import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAnalyticsEventDto } from './dto/create-analytics-event.dto';
import { AnalyticsLoggerService } from './services/analytics-logger.service';
import {
  AnalyticsResponse,
  AnalyticsEvent,
  MethodStatsResponse,
  StatusStatsResponse,
  TimeRangeResponse,
} from '../common/interfaces';

@Injectable()
export class AnalyticsService {
  constructor(
    private prisma: PrismaService,
    private analyticsLogger: AnalyticsLoggerService,
  ) {}

  async createEvent(createAnalyticsEventDto: CreateAnalyticsEventDto): Promise<AnalyticsEvent> {
    try {
      const result = await this.prisma.analyticsEvent.create({
        data: createAnalyticsEventDto,
      });

      this.analyticsLogger.logEventCreation(
        {
          method: result.method,
          path: result.path,
          statusCode: result.statusCode,
          duration: result.duration,
          ip: result.ip || undefined,
          userId: result.userId || undefined,
          userAgent: result.userAgent,
        },
        true,
      );

      return result as AnalyticsEvent;
    } catch (error) {
      this.analyticsLogger.logEventCreation(
        {
          method: createAnalyticsEventDto.method,
          path: createAnalyticsEventDto.path,
          statusCode: createAnalyticsEventDto.statusCode,
          duration: createAnalyticsEventDto.duration,
          ip: createAnalyticsEventDto.ip || undefined,
          userId: createAnalyticsEventDto.userId || undefined,
          userAgent: createAnalyticsEventDto.userAgent,
        },
        false,
        error instanceof Error ? error.message : 'Unknown error',
      );
      throw error;
    }
  }

  async logEvent(eventData: {
    method: string;
    path: string;
    statusCode: number;
    duration: number;
    ip?: string;
    userId?: string;
    userAgent: string;
    timestamp: Date;
  }): Promise<void> {
    try {
      await this.createEvent({
        method: eventData.method,
        path: eventData.path,
        statusCode: eventData.statusCode,
        duration: eventData.duration,
        ip: eventData.ip || undefined,
        userId: eventData.userId || undefined,
        userAgent: eventData.userAgent,
        timestamp: eventData.timestamp.toISOString(),
      });
    } catch (error) {
      // Log error but don't interrupt request processing
      this.analyticsLogger.logEventCreation(
        {
          method: eventData.method,
          path: eventData.path,
          statusCode: eventData.statusCode,
          duration: eventData.duration,
          ip: eventData.ip,
          userId: eventData.userId,
          userAgent: eventData.userAgent,
        },
        false,
        error instanceof Error ? error.message : 'Unknown error',
      );
    }
  }

  async getAnalytics(): Promise<AnalyticsResponse> {
    try {
      const [totalRequests, averageResponseTime, topEndpoints, uniqueUsers] = await Promise.all([
        this.prisma.analyticsEvent.count(),
        this.prisma.analyticsEvent.aggregate({
          _avg: { duration: true },
        }),
        this.prisma.analyticsEvent.groupBy({
          by: ['path'],
          _count: { path: true },
          orderBy: { _count: { path: 'desc' } },
          take: 10,
        }),
        this.prisma.analyticsEvent.groupBy({
          by: ['userId'],
          where: { userId: { not: null } },
          _count: { userId: true },
        }),
      ]);

      const result: AnalyticsResponse = {
        totalRequests,
        averageResponseTime: averageResponseTime._avg.duration || 0,
        topEndpoints,
        uniqueAuthenticatedUsers: uniqueUsers.length,
      };

      this.analyticsLogger.logAnalyticsRetrieval('overview', true, undefined, {
        totalRequests,
        averageResponseTime: result.averageResponseTime,
        uniqueUsers: result.uniqueAuthenticatedUsers,
      });

      return result;
    } catch (error) {
      this.analyticsLogger.logAnalyticsRetrieval(
        'overview',
        false,
        error instanceof Error ? error.message : 'Unknown error',
      );
      throw error;
    }
  }

  async getRequestsByMethod(): Promise<MethodStatsResponse[]> {
    try {
      const result = await this.prisma.analyticsEvent.groupBy({
        by: ['method'],
        _count: { method: true },
        orderBy: { _count: { method: 'desc' } },
      });

      const methodStats: MethodStatsResponse[] = result.map((item) => ({
        method: item.method,
        _count: { method: item._count.method },
      }));

      this.analyticsLogger.logAnalyticsRetrieval('methods', true, undefined, {
        methodCount: methodStats.length,
      });

      return methodStats;
    } catch (error) {
      this.analyticsLogger.logAnalyticsRetrieval(
        'methods',
        false,
        error instanceof Error ? error.message : 'Unknown error',
      );
      throw error;
    }
  }

  async getRequestsByStatus(): Promise<StatusStatsResponse[]> {
    try {
      const result = await this.prisma.analyticsEvent.groupBy({
        by: ['statusCode'],
        _count: { statusCode: true },
        orderBy: { statusCode: 'asc' },
      });

      const statusStats: StatusStatsResponse[] = result.map((item) => ({
        statusCode: item.statusCode,
        _count: { statusCode: item._count.statusCode },
      }));

      this.analyticsLogger.logAnalyticsRetrieval('status_codes', true, undefined, {
        statusCount: statusStats.length,
      });

      return statusStats;
    } catch (error) {
      this.analyticsLogger.logAnalyticsRetrieval(
        'status_codes',
        false,
        error instanceof Error ? error.message : 'Unknown error',
      );
      throw error;
    }
  }

  async getRequestsByTimeRange(startDate: Date, endDate: Date): Promise<TimeRangeResponse[]> {
    try {
      const result = await this.prisma.analyticsEvent.findMany({
        where: {
          timestamp: {
            gte: startDate,
            lte: endDate,
          },
        },
        orderBy: { timestamp: 'desc' },
      });

      const timeRangeStats: TimeRangeResponse[] = result.map((item) => ({
        id: item.id,
        timestamp: item.timestamp,
        method: item.method,
        path: item.path,
        statusCode: item.statusCode,
        duration: item.duration,
        ip: item.ip,
        userId: item.userId,
        userAgent: item.userAgent,
      }));

      this.analyticsLogger.logAnalyticsRetrieval('time_range', true, undefined, {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        recordCount: timeRangeStats.length,
      });

      return timeRangeStats;
    } catch (error) {
      this.analyticsLogger.logAnalyticsRetrieval(
        'time_range',
        false,
        error instanceof Error ? error.message : 'Unknown error',
        {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
      );
      throw error;
    }
  }
}
