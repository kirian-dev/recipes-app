import { Injectable } from '@nestjs/common';
import { logger } from './logger.config';

export interface LogContext {
  service?: string;
  userId?: string;
  username?: string;
  ip?: string;
  userAgent?: string;
  action?: string;
  success?: boolean;
  error?: string;
  metadata?: Record<string, unknown>;
}

@Injectable()
export class LoggerService {
  /**
   * Logs info level messages
   */
  info(message: string, context?: LogContext): void {
    logger.info(message, context);
  }

  /**
   * Logs warn level messages
   */
  warn(message: string, context?: LogContext): void {
    logger.warn(message, context);
  }

  /**
   * Logs error level messages
   */
  error(message: string, context?: LogContext): void {
    logger.error(message, context);
  }

  /**
   * Logs debug level messages
   */
  debug(message: string, context?: LogContext): void {
    logger.debug(message, context);
  }

  /**
   * Logs verbose level messages
   */
  verbose(message: string, context?: LogContext): void {
    logger.verbose(message, context);
  }
}
