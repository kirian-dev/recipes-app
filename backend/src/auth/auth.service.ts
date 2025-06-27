import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import {
  UserAlreadyExistsException,
  InvalidCredentialsException,
  UserNotFoundException,
  ValidationException,
} from './exceptions/auth.exceptions';
import { AUTH_CONSTANTS } from './constants/auth.constants';
import { PasswordService } from './services/password.service';
import { ValidationService } from './services/validation.service';
import { AuthLoggerService } from './services/auth-logger.service';
import { AuthUser, JwtPayload } from './interfaces/auth.interfaces';
import { User } from 'src/common/interfaces';
import { AuthResponseDto } from './dto/auth-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private passwordService: PasswordService,
    private validationService: ValidationService,
    private authLogger: AuthLoggerService,
  ) {}

  /**
   * Registers a new user
   */
  async signUp(username: string, password: string): Promise<AuthResponseDto> {
    // Validates input data
    this.validationService.validateSignUpInput(username, password);
    this.passwordService.validatePasswordStrength(password);

    // Checks if user already exists
    const existing = await this.findUserByUsername(username);
    if (existing) {
      this.authLogger.logSignUpAttempt({
        username,
        success: false,
        error: 'User already exists',
      });
      throw new UserAlreadyExistsException(username);
    }

    // Creates a user
    try {
      const { hash: passwordHash, salt } = this.passwordService.hashPassword(password);

      const user = await this.prisma.user.create({
        data: { username, passwordHash, salt },
      });

      this.authLogger.logDatabaseOperation('create', 'user', true, undefined, {
        userId: user.id,
      });

      this.authLogger.logSignUpAttempt({
        userId: user.id,
        username,
        success: true,
      });

      const payload: JwtPayload = { sub: user.id, username: user.username };
      const token = this.jwtService.sign(payload);

      this.authLogger.logJwtGeneration(user.id, user.username, true);

      return {
        accessToken: token,
        id: user.id,
        username: user.username,
      };
    } catch (error) {
      this.authLogger.logDatabaseOperation(
        'create',
        'user',
        false,
        error instanceof Error ? error.message : 'Unknown error',
        { username },
      );

      this.authLogger.logSignUpAttempt({
        username,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      throw new ValidationException('database', AUTH_CONSTANTS.MESSAGES.DATABASE.CREATE_FAILED);
    }
  }

  /**
   * Authenticates a user
   */
  async login(username: string, password: string): Promise<AuthResponseDto> {
    // Validates input data
    this.validationService.validateLoginInput(username, password);

    // Finds a user
    const user = await this.findUserByUsername(username);
    if (!user) {
      this.authLogger.logLoginAttempt({
        username,
        success: false,
        error: 'User not found',
      });
      throw new InvalidCredentialsException();
    }

    // Checks password
    const isValidPassword = this.passwordService.verifyPassword(password, user.passwordHash, user.salt);

    if (!isValidPassword) {
      this.authLogger.logLoginAttempt({
        userId: user.id,
        username,
        success: false,
        error: 'Invalid password',
      });
      throw new InvalidCredentialsException();
    }

    // Generates a JWT token
    try {
      const payload: JwtPayload = { sub: user.id, username: user.username };
      const token = this.jwtService.sign(payload);

      this.authLogger.logJwtGeneration(user.id, user.username, true);
      this.authLogger.logLoginAttempt({
        userId: user.id,
        username,
        success: true,
      });

      return {
        accessToken: token,
        id: user.id,
        username: user.username,
      };
    } catch (error) {
      this.authLogger.logJwtGeneration(user.id, user.username, false);

      this.authLogger.logLoginAttempt({
        userId: user.id,
        username,
        success: false,
        error: error instanceof Error ? error.message : 'JWT generation failed',
      });

      throw new ValidationException('jwt', AUTH_CONSTANTS.MESSAGES.JWT.GENERATE_FAILED);
    }
  }

  /**
   * Validates a user by ID
   */
  async validateUser(userId: string): Promise<AuthUser> {
    this.validationService.validateUserId(userId);

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      this.authLogger.logUserValidation(userId, false, 'User not found');
      throw new UserNotFoundException(userId);
    }

    this.authLogger.logUserValidation(userId, true);
    return this.mapToAuthUser(user);
  }

  /**
   * Finds a user by username
   */
  private async findUserByUsername(username: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { username } });
  }

  /**
   * Converts a user model to AuthUser
   */
  private mapToAuthUser(user: User): AuthUser {
    return {
      id: user.id,
      username: user.username,
    };
  }
}
