import { Injectable, NestInterceptor, ExecutionContext, CallHandler, BadRequestException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { plainToClass, ClassConstructor } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { Request } from 'express';
import { ParsedQs } from 'qs';

@Injectable()
export class ValidationInterceptor implements NestInterceptor {
  constructor(private readonly dtoClass: ClassConstructor<Record<string, unknown>>) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<Request>();
    const query = request.query as Record<string, any>;

    // Transform and validate query parameters
    const dtoObject = plainToClass(this.dtoClass, query as object);
    const errors = await validate(dtoObject as object);

    if (errors.length > 0) {
      const validationErrors = errors.map((error: ValidationError) => ({
        field: error.property,
        constraints: error.constraints,
      }));
      throw new BadRequestException({
        message: 'Validation failed',
        errors: validationErrors,
      });
    }

    request.query = dtoObject as unknown as ParsedQs;

    return next.handle();
  }
}
