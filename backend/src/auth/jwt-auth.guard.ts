import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { AuthUser, JwtPayload } from './interfaces/auth.interfaces';
import {
  InvalidTokenException,
  TokenExpiredException,
  UserNotFoundException,
} from './exceptions/auth.exceptions';

interface JwtError {
  name: string;
  message: string;
}

interface RequestWithUser extends Request {
  user?: AuthUser;
}

const JWT_STRATEGY = 'jwt' as const;

@Injectable()
export class JwtAuthGuard extends AuthGuard(JWT_STRATEGY) {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const authHeader =
      request.headers.authorization || request.headers.Authorization;

    if (!authHeader) {
      throw new InvalidTokenException();
    }

    // Ensure authHeader is a string
    const authHeaderString = Array.isArray(authHeader)
      ? authHeader[0]
      : authHeader;

    if (!authHeaderString) {
      throw new InvalidTokenException();
    }

    const parts = authHeaderString
      .trim()
      .split(' ')
      .filter((part) => part.length > 0);

    if (parts.length !== 2 || parts[0] !== 'Bearer' || !parts[1]) {
      throw new InvalidTokenException();
    }

    const token = parts[1];

    try {
      const payload = this.jwtService.verify<JwtPayload>(token);
      const user = await this.authService.validateUser(payload.sub);

      if (!user) {
        throw new UserNotFoundException(payload.sub);
      }

      request.user = user;
      return true;
    } catch (error: unknown) {
      if (error instanceof UserNotFoundException) {
        throw error;
      }

      // Check if it's a JWT expiration error
      const jwtError = error as JwtError;
      if (jwtError?.name === 'TokenExpiredError') {
        throw new TokenExpiredException();
      }

      // For any other JWT verification errors
      throw new InvalidTokenException();
    }
  }

  handleRequest<TUser = any>(err: unknown, user: TUser): TUser {
    if (err || !user) {
      if (err instanceof UserNotFoundException) {
        throw err;
      }

      const jwtError = err as JwtError;
      if (jwtError?.name === 'TokenExpiredError') {
        throw new TokenExpiredException();
      }

      throw new InvalidTokenException();
    }
    return user;
  }
}
