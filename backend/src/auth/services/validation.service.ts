import { Injectable } from '@nestjs/common';
import { AUTH_CONSTANTS } from '../constants/auth.constants';
import { ValidationException } from '../exceptions/auth.exceptions';

@Injectable()
export class ValidationService {
  /**
   * Validates sign up input
   */
  validateSignUpInput(username: string, password: string): void {
    this.validateUsername(username);
    this.validatePassword(password);
    this.validateUsernamePattern(username);
  }

  /**
   * Validates login input
   */
  validateLoginInput(username: string, password: string): void {
    this.validateUsernameNotEmpty(username);
    this.validatePasswordNotEmpty(password);
  }

  /**
   * Validates userId
   */
  validateUserId(userId: string): void {
    if (!userId) {
      throw new ValidationException('userId', AUTH_CONSTANTS.MESSAGES.USER_ID.REQUIRED);
    }
  }

  /**
   * Validates username (full check)
   */
  private validateUsername(username: string): void {
    this.validateUsernameNotEmpty(username);
    this.validateUsernameLength(username);
  }

  /**
   * Checks if username is not empty
   */
  private validateUsernameNotEmpty(username: string): void {
    if (!username || username.trim().length === 0) {
      throw new ValidationException('username', AUTH_CONSTANTS.MESSAGES.USERNAME.EMPTY);
    }
  }

  /**
   * Checks username length
   */
  private validateUsernameLength(username: string): void {
    if (username.length < AUTH_CONSTANTS.USERNAME.MIN_LENGTH) {
      throw new ValidationException('username', AUTH_CONSTANTS.MESSAGES.USERNAME.TOO_SHORT);
    }

    if (username.length > AUTH_CONSTANTS.USERNAME.MAX_LENGTH) {
      throw new ValidationException('username', AUTH_CONSTANTS.MESSAGES.USERNAME.TOO_LONG);
    }
  }

  /**
   * Checks username pattern
   */
  private validateUsernamePattern(username: string): void {
    if (!AUTH_CONSTANTS.USERNAME.PATTERN.test(username)) {
      throw new ValidationException('username', AUTH_CONSTANTS.MESSAGES.USERNAME.INVALID_CHARS);
    }
  }

  /**
   * Validates password (full check)
   */
  private validatePassword(password: string): void {
    this.validatePasswordNotEmpty(password);
    this.validatePasswordLength(password);
  }

  /**
   * Checks if password is not empty
   */
  private validatePasswordNotEmpty(password: string): void {
    if (!password || password.trim().length === 0) {
      throw new ValidationException('password', AUTH_CONSTANTS.MESSAGES.PASSWORD.EMPTY);
    }
  }

  /**
   * Checks password length
   */
  private validatePasswordLength(password: string): void {
    if (password.length < AUTH_CONSTANTS.PASSWORD.MIN_LENGTH) {
      throw new ValidationException('password', AUTH_CONSTANTS.MESSAGES.PASSWORD.TOO_SHORT);
    }

    if (password.length > AUTH_CONSTANTS.PASSWORD.MAX_LENGTH) {
      throw new ValidationException('password', AUTH_CONSTANTS.MESSAGES.PASSWORD.TOO_LONG);
    }
  }
}
