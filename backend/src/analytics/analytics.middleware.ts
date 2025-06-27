import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AnalyticsService } from './analytics.service';
import { JwtService } from '@nestjs/jwt';
import { LoggerService } from '../common/logger/logger.service';
import { JwtPayload } from '../auth/interfaces/auth.interfaces';

@Injectable()
export class AnalyticsMiddleware implements NestMiddleware {
  constructor(
    private analyticsService: AnalyticsService,
    private jwtService: JwtService,
    private loggerService: LoggerService,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - startTime;

      // Extract user ID from JWT token if present
      let userId: string | undefined;
      try {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
          const token = authHeader.substring(7);
          const payload = this.jwtService.verify<JwtPayload>(token, {
            secret: process.env.JWT_SECRET || 'dev-secret',
          });
          userId = payload.sub;
        }
      } catch (error) {
        // Token is invalid or expired, continue without user ID
        this.loggerService.debug('Invalid JWT token in analytics middleware', {
          service: 'analytics',
          action: 'jwt_verification',
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          metadata: {
            path: req.path,
            method: req.method,
          },
        });
      }

      // Get client IP address
      const ip = this.getClientIp(req);

      this.analyticsService
        .logEvent({
          method: req.method,
          path: req.path,
          statusCode: res.statusCode,
          duration,
          ip,
          userId,
          userAgent: req.get('User-Agent') || 'Unknown',
          timestamp: new Date(),
        })
        .catch((error) => {
          // Log error but don't throw to avoid breaking the response
          this.loggerService.error('Error in analytics middleware', {
            service: 'analytics',
            action: 'log_event',
            error: error instanceof Error ? error.message : 'Unknown error',
            metadata: {
              path: req.path,
              method: req.method,
            },
          });
        });
    });

    next();
  }

  private getClientIp(req: Request): string | undefined {
    // Check various headers for real IP address
    const xForwardedFor = req.headers['x-forwarded-for'];
    if (xForwardedFor) {
      const ips = Array.isArray(xForwardedFor) ? xForwardedFor[0] : xForwardedFor;
      return ips.split(',')[0].trim();
    }

    const xRealIp = req.headers['x-real-ip'];
    if (xRealIp) {
      return Array.isArray(xRealIp) ? xRealIp[0] : xRealIp;
    }

    return req.ip || req.connection?.remoteAddress;
  }
}
