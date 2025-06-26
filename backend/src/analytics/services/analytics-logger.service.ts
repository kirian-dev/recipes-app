import { Injectable, Logger } from '@nestjs/common';
import { LoggerService } from '../../common/logger/logger.service';

export interface AnalyticsLogContext {
  userId?: string;
  ip?: string;
  userAgent?: string;
  action: string;
  success: boolean;
  error?: string;
  metadata?: Record<string, unknown>;
}

@Injectable()
export class AnalyticsLoggerService {
  private readonly logger = new Logger(AnalyticsLoggerService.name);

  constructor(private readonly loggerService: LoggerService) {}

  /**
   * Logs analytics event creation
   */
  logEventCreation(
    eventData: {
      method: string;
      path: string;
      statusCode: number;
      duration: number;
      ip?: string;
      userId?: string;
      userAgent: string;
    },
    success: boolean,
    error?: string,
  ): void {
    const context: AnalyticsLogContext = {
      userId: eventData.userId,
      ip: eventData.ip,
      userAgent: eventData.userAgent,
      action: 'analytics_event_creation',
      success,
      error,
      metadata: {
        method: eventData.method,
        path: eventData.path,
        statusCode: eventData.statusCode,
        duration: eventData.duration,
      },
    };

    if (success) {
      this.logInfo('Analytics event created successfully', context);
    } else {
      this.logError('Analytics event creation failed', context);
    }
  }

  /**
   * Logs analytics data retrieval
   */
  logAnalyticsRetrieval(
    action: string,
    success: boolean,
    error?: string,
    metadata?: Record<string, unknown>,
  ): void {
    const context: AnalyticsLogContext = {
      action: `analytics_${action}`,
      success,
      error,
      metadata,
    };

    if (success) {
      this.logInfo(`Analytics ${action} retrieved successfully`, context);
    } else {
      this.logError(`Analytics ${action} retrieval failed`, context);
    }
  }

  /**
   * Logs API endpoint access
   */
  logEndpointAccess(
    method: string,
    path: string,
    statusCode: number,
    duration: number,
    userId?: string,
    ip?: string,
  ): void {
    const context: AnalyticsLogContext = {
      userId,
      ip,
      action: 'endpoint_access',
      success: statusCode < 400,
      metadata: {
        method,
        path,
        statusCode,
        duration,
      },
    };

    if (statusCode >= 400) {
      this.logWarn('API endpoint access failed', context);
    } else {
      this.logDebug('API endpoint accessed', context);
    }
  }

  /**
   * Logs info level messages
   */
  private logInfo(message: string, context: AnalyticsLogContext): void {
    this.loggerService.info(message, {
      service: 'analytics',
      ...context,
    });
  }

  /**
   * Logs warn level messages
   */
  private logWarn(message: string, context: AnalyticsLogContext): void {
    this.loggerService.warn(message, {
      service: 'analytics',
      ...context,
    });
  }

  /**
   * Logs error level messages
   */
  private logError(message: string, context: AnalyticsLogContext): void {
    this.loggerService.error(message, {
      service: 'analytics',
      ...context,
    });
  }

  /**
   * Logs debug level messages
   */
  private logDebug(message: string, context: AnalyticsLogContext): void {
    this.loggerService.debug(message, {
      service: 'analytics',
      ...context,
    });
  }
}
