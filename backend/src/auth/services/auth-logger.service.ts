import { Injectable, Logger } from '@nestjs/common';
import { LoggerService } from '../../common/logger/logger.service';

export interface AuthLogContext {
  userId?: string;
  username?: string;
  ip?: string;
  userAgent?: string;
  action: string;
  success: boolean;
  error?: string;
  metadata?: Record<string, unknown>;
}

@Injectable()
export class AuthLoggerService {
  private readonly logger = new Logger(AuthLoggerService.name);

  constructor(private readonly loggerService: LoggerService) {}

  /**
   * Logs user registration attempt
   */
  logSignUpAttempt(context: Omit<AuthLogContext, 'action'>): void {
    const logContext: AuthLogContext = {
      ...context,
      action: 'sign_up_attempt',
    };

    if (context.success) {
      this.logInfo('User registration successful', logContext);
    } else {
      this.logError('User registration failed', logContext);
    }
  }

  /**
   * Logs user login attempt
   */
  logLoginAttempt(context: Omit<AuthLogContext, 'action'>): void {
    const logContext: AuthLogContext = {
      ...context,
      action: 'login_attempt',
    };

    if (context.success) {
      this.logInfo('User login successful', logContext);
    } else {
      this.logWarn('User login failed', logContext);
    }
  }

  /**
   * Logs password validation
   */
  logPasswordValidation(
    username: string,
    isWeak: boolean,
    reason?: string,
  ): void {
    const context: AuthLogContext = {
      username,
      action: 'password_validation',
      success: !isWeak,
      metadata: {
        isWeak,
        reason: reason || 'Password meets security requirements',
      },
    };

    if (isWeak) {
      this.logWarn('Weak password detected', context);
    } else {
      this.logDebug('Password validation passed', context);
    }
  }

  /**
   * Logs JWT token generation
   */
  logJwtGeneration(userId: string, username: string, success: boolean): void {
    const context: AuthLogContext = {
      userId,
      username,
      action: 'jwt_generation',
      success,
    };

    if (success) {
      this.logInfo('JWT token generated successfully', context);
    } else {
      this.logError('JWT token generation failed', context);
    }
  }

  /**
   * Logs user validation
   */
  logUserValidation(userId: string, success: boolean, error?: string): void {
    const context: AuthLogContext = {
      userId,
      action: 'user_validation',
      success,
      error,
    };

    if (success) {
      this.logDebug('User validation successful', context);
    } else {
      this.logWarn('User validation failed', context);
    }
  }

  /**
   * Logs database operations
   */
  logDatabaseOperation(
    operation: string,
    table: string,
    success: boolean,
    error?: string,
    metadata?: Record<string, unknown>,
  ): void {
    const context: AuthLogContext = {
      action: 'database_operation',
      success,
      error,
      metadata: {
        operation,
        table,
        ...metadata,
      },
    };

    if (success) {
      this.logDebug('Database operation successful', context);
    } else {
      this.logError('Database operation failed', context);
    }
  }

  /**
   * Logs security events
   */
  logSecurityEvent(
    event: string,
    username?: string,
    ip?: string,
    metadata?: Record<string, unknown>,
  ): void {
    const context: AuthLogContext = {
      username,
      ip,
      action: 'security_event',
      success: true,
      metadata: {
        event,
        ...metadata,
      },
    };

    this.logWarn('Security event detected', context);
  }

  /**
   * Logs rate limiting events
   */
  logRateLimit(username: string, ip: string, action: string): void {
    const context: AuthLogContext = {
      username,
      ip,
      action: 'rate_limit_exceeded',
      success: false,
      metadata: {
        limitedAction: action,
      },
    };

    this.logWarn('Rate limit exceeded', context);
  }

  /**
   * Logs info level messages
   */
  private logInfo(message: string, context: AuthLogContext): void {
    this.loggerService.info(message, {
      service: 'auth',
      ...context,
    });
  }

  /**
   * Logs warn level messages
   */
  private logWarn(message: string, context: AuthLogContext): void {
    this.loggerService.warn(message, {
      service: 'auth',
      ...context,
    });
  }

  /**
   * Logs error level messages
   */
  private logError(message: string, context: AuthLogContext): void {
    this.loggerService.error(message, {
      service: 'auth',
      ...context,
    });
  }

  /**
   * Logs debug level messages
   */
  private logDebug(message: string, context: AuthLogContext): void {
    this.loggerService.debug(message, {
      service: 'auth',
      ...context,
    });
  }
}
