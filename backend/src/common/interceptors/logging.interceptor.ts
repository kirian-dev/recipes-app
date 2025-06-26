import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const { method, url, ip, headers } = request;
    const userAgent = headers['user-agent'] || '';
    const startTime = Date.now();

    this.logger.log(`${method} ${url} - ${ip} - ${userAgent}`);

    return next.handle().pipe(
      tap(() => {
        const endTime = Date.now();
        const duration = endTime - startTime;
        const statusCode = response.statusCode;

        this.logger.log(`${method} ${url} - ${statusCode} - ${duration}ms`);
      }),
      catchError((error: Error) => {
        const endTime = Date.now();
        const duration = endTime - startTime;
        const statusCode = response.statusCode || 500;

        this.logger.error(
          `${method} ${url} - ${statusCode} - ${duration}ms - ${error.message}`,
        );

        throw error;
      }),
    );
  }
}
