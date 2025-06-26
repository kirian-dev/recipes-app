import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { AUTH_CONSTANTS } from '../constants/auth.constants';
import { PasswordTooWeakException } from '../exceptions/auth.exceptions';
import { AuthLoggerService } from './auth-logger.service';

export interface PasswordHash {
  hash: string;
  salt: string;
}

@Injectable()
export class PasswordService {
  constructor(private authLogger: AuthLoggerService) {}

  /**
   * Creates a password hash with a salt
   */
  hashPassword(password: string): PasswordHash {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = this.createHash(password, salt);

    return { hash, salt };
  }

  /**
   * Verifies a password against a hash
   */
  verifyPassword(password: string, hash: string, salt: string): boolean {
    const passwordHash = this.createHash(password, salt);
    return passwordHash === hash;
  }

  /**
   * Validates password strength
   */
  validatePasswordStrength(password: string): void {
    const isWeak = this.isPasswordTooWeak(password);
    const reason = isWeak ? this.getWeakPasswordReason(password) : undefined;

    this.authLogger.logPasswordValidation('unknown', isWeak, reason);

    if (isWeak) {
      throw new PasswordTooWeakException();
    }
  }

  /**
   * Creates a password hash with a salt
   */
  private createHash(password: string, salt: string): string {
    return crypto
      .createHash('sha256')
      .update(password + salt)
      .digest('hex');
  }

  /**
   * Checks if a password is too weak
   */
  private isPasswordTooWeak(password: string): boolean {
    const lowerPassword = password.toLowerCase();

    // Checks for known weak passwords
    if (AUTH_CONSTANTS.WEAK_PASSWORDS.includes(lowerPassword)) {
      return true;
    }

    // Checks for repeated characters (4+ in a row)
    if (/(.)\1{3,}/.test(password)) {
      return true;
    }

    // Checks for weak sequences
    for (const seq of AUTH_CONSTANTS.WEAK_SEQUENCES) {
      if (lowerPassword.includes(seq)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Gets the reason why a password is weak
   */
  private getWeakPasswordReason(password: string): string {
    const lowerPassword = password.toLowerCase();

    if (AUTH_CONSTANTS.WEAK_PASSWORDS.includes(lowerPassword)) {
      return 'Password is in the list of common weak passwords';
    }

    if (/(.)\1{3,}/.test(password)) {
      return 'Password contains repeated characters';
    }

    for (const seq of AUTH_CONSTANTS.WEAK_SEQUENCES) {
      if (lowerPassword.includes(seq)) {
        return `Password contains weak sequence: ${seq}`;
      }
    }

    return 'Password does not meet security requirements';
  }
}
