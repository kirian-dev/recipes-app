import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthUser, JwtPayload } from './interfaces/auth.interfaces';
import { InvalidTokenException, TokenExpiredException, UserNotFoundException } from './exceptions/auth.exceptions';

interface RequestWithUser {
  headers: Record<string, string>;
  user?: AuthUser;
}

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;

  const mockJwtService = {
    verify: jest.fn(),
  };

  const mockAuthService = {
    validateUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtAuthGuard,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    guard = module.get<JwtAuthGuard>(JwtAuthGuard);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('canActivate', () => {
    it('should return true for valid JWT token', async () => {
      const token = 'valid-jwt-token';
      const payload: JwtPayload = { sub: 'user-id', username: 'testuser' };
      const user: AuthUser = { id: 'user-id', username: 'testuser' };

      const mockRequest: RequestWithUser = {
        headers: {
          authorization: `Bearer ${token}`,
        },
      };

      const mockContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue(mockRequest),
        }),
      } as unknown as ExecutionContext;

      mockJwtService.verify.mockReturnValue(payload);
      mockAuthService.validateUser.mockResolvedValue(user);

      const result = await guard.canActivate(mockContext);

      expect(mockJwtService.verify).toHaveBeenCalledWith(token);
      expect(mockAuthService.validateUser).toHaveBeenCalledWith(payload.sub);
      expect(mockRequest.user).toEqual(user);
      expect(result).toBe(true);
    });

    it('should throw InvalidTokenException when no authorization header', async () => {
      const mockRequest: RequestWithUser = {
        headers: {},
      };

      const mockContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue(mockRequest),
        }),
      } as unknown as ExecutionContext;

      await expect(guard.canActivate(mockContext)).rejects.toThrow(InvalidTokenException);
    });

    it('should throw InvalidTokenException when authorization header is malformed', async () => {
      const mockRequest: RequestWithUser = {
        headers: {
          authorization: 'InvalidFormat',
        },
      };

      const mockContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue(mockRequest),
        }),
      } as unknown as ExecutionContext;

      await expect(guard.canActivate(mockContext)).rejects.toThrow(InvalidTokenException);
    });

    it('should throw TokenExpiredException when JWT token is expired', async () => {
      const token = 'expired-jwt-token';
      const mockRequest: RequestWithUser = {
        headers: {
          authorization: `Bearer ${token}`,
        },
      };

      const mockContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue(mockRequest),
        }),
      } as unknown as ExecutionContext;

      const expiredError = new Error('Token expired');
      expiredError.name = 'TokenExpiredError';
      mockJwtService.verify.mockImplementation(() => {
        throw expiredError;
      });

      await expect(guard.canActivate(mockContext)).rejects.toThrow(TokenExpiredException);
    });

    it('should throw InvalidTokenException when JWT verification fails', async () => {
      const token = 'invalid-jwt-token';
      const mockRequest: RequestWithUser = {
        headers: {
          authorization: `Bearer ${token}`,
        },
      };

      const mockContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue(mockRequest),
        }),
      } as unknown as ExecutionContext;

      mockJwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(guard.canActivate(mockContext)).rejects.toThrow(InvalidTokenException);
    });

    it('should throw UserNotFoundException when user validation fails', async () => {
      const token = 'valid-jwt-token';
      const payload: JwtPayload = { sub: 'user-id', username: 'testuser' };

      const mockRequest: RequestWithUser = {
        headers: {
          authorization: `Bearer ${token}`,
        },
      };

      const mockContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue(mockRequest),
        }),
      } as unknown as ExecutionContext;

      mockJwtService.verify.mockReturnValue(payload);
      mockAuthService.validateUser.mockRejectedValue(new UserNotFoundException('user-id'));

      await expect(guard.canActivate(mockContext)).rejects.toThrow(UserNotFoundException);
    });

    it('should handle authorization header with different cases', async () => {
      const token = 'valid-jwt-token';
      const payload: JwtPayload = { sub: 'user-id', username: 'testuser' };
      const user: AuthUser = { id: 'user-id', username: 'testuser' };

      const mockRequest: RequestWithUser = {
        headers: {
          Authorization: `Bearer ${token}`, // Capital A
        },
      };

      const mockContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue(mockRequest),
        }),
      } as unknown as ExecutionContext;

      mockJwtService.verify.mockReturnValue(payload);
      mockAuthService.validateUser.mockResolvedValue(user);

      const result = await guard.canActivate(mockContext);

      expect(result).toBe(true);
    });

    it('should handle authorization header with extra spaces', async () => {
      const token = 'valid-jwt-token';
      const payload: JwtPayload = { sub: 'user-id', username: 'testuser' };
      const user: AuthUser = { id: 'user-id', username: 'testuser' };

      const mockRequest: RequestWithUser = {
        headers: {
          authorization: `  Bearer  ${token}  `, // Extra spaces
        },
      };

      const mockContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue(mockRequest),
        }),
      } as unknown as ExecutionContext;

      mockJwtService.verify.mockReturnValue(payload);
      mockAuthService.validateUser.mockResolvedValue(user);

      const result = await guard.canActivate(mockContext);

      expect(result).toBe(true);
    });
  });
});
