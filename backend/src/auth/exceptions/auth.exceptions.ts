import { HttpException, HttpStatus } from '@nestjs/common';

export class UserAlreadyExistsException extends HttpException {
  constructor(username: string) {
    super(
      {
        statusCode: HttpStatus.CONFLICT,
        message: 'User already exists',
        error: 'Conflict',
        details: {
          field: 'username',
          value: username,
          reason: 'Username is already taken',
        },
      },
      HttpStatus.CONFLICT,
    );
  }
}

export class InvalidCredentialsException extends HttpException {
  constructor() {
    super(
      {
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        message: 'Invalid credentials',
        error: 'Unprocessable Entity',
        details: {
          reason: 'Username or password is incorrect',
        },
      },
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }
}

export class UserNotFoundException extends HttpException {
  constructor(userId: string) {
    super(
      {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'User not found',
        error: 'Not Found',
        details: {
          field: 'userId',
          value: userId,
          reason: 'User does not exist',
        },
      },
      HttpStatus.NOT_FOUND,
    );
  }
}

export class ValidationException extends HttpException {
  constructor(field: string, message: string) {
    super(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Validation failed',
        error: 'Bad Request',
        details: {
          field,
          reason: message,
        },
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class TokenExpiredException extends HttpException {
  constructor() {
    super(
      {
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Token expired',
        error: 'Unauthorized',
        details: {
          reason: 'JWT token has expired',
        },
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}

export class InvalidTokenException extends HttpException {
  constructor() {
    super(
      {
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Invalid token',
        error: 'Unauthorized',
        details: {
          reason: 'JWT token is invalid or malformed',
        },
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}

export class AccountLockedException extends HttpException {
  constructor() {
    super(
      {
        statusCode: HttpStatus.FORBIDDEN,
        message: 'Account locked',
        error: 'Forbidden',
        details: {
          reason:
            'Account has been locked due to multiple failed login attempts',
        },
      },
      HttpStatus.FORBIDDEN,
    );
  }
}

export class PasswordTooWeakException extends HttpException {
  constructor() {
    super(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Password too weak',
        error: 'Bad Request',
        details: {
          field: 'password',
          reason: 'Password does not meet security requirements',
        },
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class RateLimitExceededException extends HttpException {
  constructor() {
    super(
      {
        statusCode: HttpStatus.TOO_MANY_REQUESTS,
        message: 'Rate limit exceeded',
        error: 'Too Many Requests',
        details: {
          reason: 'Too many authentication attempts, please try again later',
        },
      },
      HttpStatus.TOO_MANY_REQUESTS,
    );
  }
}
