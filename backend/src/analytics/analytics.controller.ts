import { Controller, Get, Query, Req, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AnalyticsService } from './analytics.service';
import { AnalyticsLoggerService } from './services/analytics-logger.service';
import {
  AnalyticsResponse,
  MethodStatsResponse,
  StatusStatsResponse,
  TimeRangeResponse,
} from '../common/interfaces';

@ApiTags('analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(
    private readonly analyticsService: AnalyticsService,
    private readonly analyticsLogger: AnalyticsLoggerService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get comprehensive API request statistics' })
  @ApiResponse({
    status: 200,
    description: 'API request statistics',
    schema: {
      type: 'object',
      properties: {
        totalRequests: {
          type: 'number',
          description: 'Total number of requests',
        },
        averageResponseTime: {
          type: 'number',
          description: 'Average response time (ms)',
        },
        topEndpoints: {
          type: 'array',
          description: 'Top endpoints by request count',
        },
        uniqueAuthenticatedUsers: {
          type: 'number',
          description: 'Number of unique authenticated users',
        },
      },
    },
  })
  async getAnalytics(
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<AnalyticsResponse> {
    const startTime = Date.now();
    const { method, path, ip } = request;

    try {
      const result = await this.analyticsService.getAnalytics();
      const duration = Date.now() - startTime;

      this.analyticsLogger.logEndpointAccess(
        method,
        path,
        response.statusCode,
        duration,
        undefined,
        ip,
      );

      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      const statusCode = 500;

      this.analyticsLogger.logEndpointAccess(
        method,
        path,
        statusCode,
        duration,
        undefined,
        ip,
      );

      throw error;
    }
  }

  @Get('methods')
  @ApiOperation({ summary: 'Get requests grouped by HTTP method' })
  @ApiResponse({
    status: 200,
    description: 'Requests by HTTP method',
  })
  async getRequestsByMethod(
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<MethodStatsResponse[]> {
    const startTime = Date.now();
    const { method, path, ip } = request;

    try {
      const result = await this.analyticsService.getRequestsByMethod();
      const duration = Date.now() - startTime;

      this.analyticsLogger.logEndpointAccess(
        method,
        path,
        response.statusCode,
        duration,
        undefined,
        ip,
      );

      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      const statusCode = 500;

      this.analyticsLogger.logEndpointAccess(
        method,
        path,
        statusCode,
        duration,
        undefined,
        ip,
      );

      throw error;
    }
  }

  @Get('status-codes')
  @ApiOperation({ summary: 'Get requests grouped by HTTP status code' })
  @ApiResponse({
    status: 200,
    description: 'Requests by HTTP status code',
  })
  async getRequestsByStatus(
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<StatusStatsResponse[]> {
    const startTime = Date.now();
    const { method, path, ip } = request;

    try {
      const result = await this.analyticsService.getRequestsByStatus();
      const duration = Date.now() - startTime;

      this.analyticsLogger.logEndpointAccess(
        method,
        path,
        response.statusCode,
        duration,
        undefined,
        ip,
      );

      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      const statusCode = 500;

      this.analyticsLogger.logEndpointAccess(
        method,
        path,
        statusCode,
        duration,
        undefined,
        ip,
      );

      throw error;
    }
  }

  @Get('time-range')
  @ApiOperation({ summary: 'Get requests within a time range' })
  @ApiQuery({
    name: 'startDate',
    required: true,
    description: 'Start date (ISO string)',
  })
  @ApiQuery({
    name: 'endDate',
    required: true,
    description: 'End date (ISO string)',
  })
  @ApiResponse({
    status: 200,
    description: 'Requests in time range',
  })
  async getRequestsByTimeRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<TimeRangeResponse[]> {
    const startTime = Date.now();
    const { method, path, ip } = request;

    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const result = await this.analyticsService.getRequestsByTimeRange(
        start,
        end,
      );
      const duration = Date.now() - startTime;

      this.analyticsLogger.logEndpointAccess(
        method,
        path,
        response.statusCode,
        duration,
        undefined,
        ip,
      );

      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      const statusCode = 500;

      this.analyticsLogger.logEndpointAccess(
        method,
        path,
        statusCode,
        duration,
        undefined,
        ip,
      );

      throw error;
    }
  }
}
