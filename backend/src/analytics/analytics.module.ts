import { Module } from '@nestjs/common';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { AnalyticsLoggerService } from './services/analytics-logger.service';
import { PrismaModule } from '../prisma/prisma.module';
import { LoggerModule } from '../common/logger/logger.module';

@Module({
  imports: [PrismaModule, LoggerModule],
  controllers: [AnalyticsController],
  providers: [AnalyticsService, AnalyticsLoggerService],
  exports: [AnalyticsService, AnalyticsLoggerService],
})
export class AnalyticsModule {}
