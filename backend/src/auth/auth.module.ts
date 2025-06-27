import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PasswordService } from './services/password.service';
import { ValidationService } from './services/validation.service';
import { AuthLoggerService } from './services/auth-logger.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { PrismaModule } from '../prisma/prisma.module';
import { LoggerModule } from '../common/logger/logger.module';

@Module({
  imports: [
    PrismaModule,
    LoggerModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev-secret',
      signOptions: {
        expiresIn: '7d',
        issuer: 'recipes-app',
        audience: 'recipes-app-users',
      },
    }),
  ],
  providers: [AuthService, PasswordService, ValidationService, AuthLoggerService, JwtAuthGuard],
  controllers: [AuthController],
  exports: [AuthService, JwtModule, PasswordService, ValidationService, AuthLoggerService, JwtAuthGuard],
})
export class AuthModule {}
