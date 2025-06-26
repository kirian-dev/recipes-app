import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({
    status: 200,
    description: 'Application is healthy',
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          example: 'ok',
        },
        timestamp: {
          type: 'string',
          format: 'date-time',
          example: '2024-01-01T00:00:00.000Z',
        },
        uptime: {
          type: 'number',
          description: 'Application uptime in seconds',
          example: 3600,
        },
        environment: {
          type: 'string',
          example: 'development',
        },
        version: {
          type: 'string',
          example: '1.0.0',
        },
        database: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'connected',
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 503,
    description: 'Application is unhealthy',
  })
  async check() {
    // Check database connection
    let dbStatus = 'disconnected';
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      dbStatus = 'connected';
    } catch {
      dbStatus = 'error';
    }

    const healthCheck = {
      status: dbStatus === 'connected' ? 'ok' : 'error',
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime()),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
      database: {
        status: dbStatus,
      },
    };

    // Return 503 if database is not connected
    if (dbStatus !== 'connected') {
      return {
        ...healthCheck,
        status: 'error',
        message: 'Database connection failed',
      };
    }

    return healthCheck;
  }
}
