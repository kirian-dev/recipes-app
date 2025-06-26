import { Module } from '@nestjs/common';
import { RecipesController } from './recipes.controller';
import { RecipesService } from './recipes.service';
import { RecipesLoggerService } from './services/recipes-logger.service';
import { ValidationService } from './services/validation.service';
import { LoggerModule } from '../common/logger/logger.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [LoggerModule, AuthModule],
  controllers: [RecipesController],
  providers: [RecipesService, RecipesLoggerService, ValidationService],
  exports: [RecipesService],
})
export class RecipesModule {}
