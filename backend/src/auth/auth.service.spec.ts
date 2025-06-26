import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import {
  UserAlreadyExistsException,
  InvalidCredentialsException,
  UserNotFoundException,
  ValidationException,
  PasswordTooWeakException,
} from './exceptions/auth.exceptions';
import { PasswordService } from './services/password.service';
import { ValidationService } from './services/validation.service';
import { AuthLoggerService } from './services/auth-logger.service';
import { User } from '../common/interfaces';

describe('AuthService', () => {
  let service: AuthService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  const mockPasswordService = {
    hashPassword: jest.fn(),
    verifyPassword: jest.fn(),
    validatePasswordStrength: jest.fn(),
  };

  const mockValidationService = {
    validateSignUpInput: jest.fn(),
    validateLoginInput: jest.fn(),
    validateUserId: jest.fn(),
  };

  const mockAuthLoggerService = {
    logSignUpAttempt: jest.fn(),
    logLoginAttempt: jest.fn(),
    logJwtGeneration: jest.fn(),
    logUserValidation: jest.fn(),
    logDatabaseOperation: jest.fn(),
    logPasswordValidation: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: PasswordService,
          useValue: mockPasswordService,
        },
        {
          provide: ValidationService,
          useValue: mockValidationService,
        },
        {
          provide: AuthLoggerService,
          useValue: mockAuthLoggerService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signUp', () => {
    it('should create a new user successfully', async () => {
      const username = 'newuser';
      const password = 'password123';

      mockValidationService.validateSignUpInput.mockReturnValue(undefined);
      mockPasswordService.validatePasswordStrength.mockReturnValue(undefined);
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPasswordService.hashPassword.mockReturnValue({
        hash: 'hashedpassword',
        salt: 'testsalt',
      });
      mockPrismaService.user.create.mockResolvedValue({
        id: 'user-id',
        username: 'newuser',
        passwordHash: 'hashedpassword',
        salt: 'testsalt',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await service.signUp(username, password);

      expect(mockValidationService.validateSignUpInput).toHaveBeenCalledWith(
        username,
        password,
      );
      expect(mockPasswordService.validatePasswordStrength).toHaveBeenCalledWith(
        password,
      );
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { username },
      });
      expect(mockPasswordService.hashPassword).toHaveBeenCalledWith(password);
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: {
          username,
          passwordHash: 'hashedpassword',
          salt: 'testsalt',
        },
      });
      expect(result).toEqual({
        id: 'user-id',
        username: 'newuser',
      });
    });

    it('should throw UserAlreadyExistsException when user already exists', async () => {
      const username = 'existinguser';
      const password = 'password123';

      mockValidationService.validateSignUpInput.mockReturnValue(undefined);
      mockPasswordService.validatePasswordStrength.mockReturnValue(undefined);
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'existing-id',
        username: 'existinguser',
        passwordHash: 'hash',
        salt: 'salt',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await expect(service.signUp(username, password)).rejects.toThrow(
        UserAlreadyExistsException,
      );
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { username },
      });
    });

    it('should throw ValidationException when validation fails', async () => {
      const username = '';
      const password = 'password123';

      mockValidationService.validateSignUpInput.mockImplementation(() => {
        throw new ValidationException('username', 'Username is required');
      });

      await expect(service.signUp(username, password)).rejects.toThrow(
        ValidationException,
      );
    });

    it('should throw PasswordTooWeakException when password is too weak', async () => {
      const username = 'testuser';
      const password = '123';

      mockValidationService.validateSignUpInput.mockReturnValue(undefined);
      mockPasswordService.validatePasswordStrength.mockImplementation(() => {
        throw new PasswordTooWeakException();
      });

      await expect(service.signUp(username, password)).rejects.toThrow(
        PasswordTooWeakException,
      );
    });

    it('should handle database errors gracefully', async () => {
      const username = 'newuser';
      const password = 'password123';

      mockValidationService.validateSignUpInput.mockReturnValue(undefined);
      mockPasswordService.validatePasswordStrength.mockReturnValue(undefined);
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPasswordService.hashPassword.mockReturnValue({
        hash: 'hashedpassword',
        salt: 'testsalt',
      });
      mockPrismaService.user.create.mockRejectedValue(
        new Error('Database connection failed'),
      );

      await expect(service.signUp(username, password)).rejects.toThrow(
        ValidationException,
      );
    });
  });

  describe('login', () => {
    it('should authenticate user and return access token', async () => {
      const username = 'testuser';
      const password = 'password123';

      const mockUser: User = {
        id: 'user-id',
        username: 'testuser',
        passwordHash: 'correcthash',
        salt: 'testsalt',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockValidationService.validateLoginInput.mockReturnValue(undefined);
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPasswordService.verifyPassword.mockReturnValue(true);
      mockJwtService.sign.mockReturnValue('jwt-token');

      const result = await service.login(username, password);

      expect(mockValidationService.validateLoginInput).toHaveBeenCalledWith(
        username,
        password,
      );
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { username },
      });
      expect(mockPasswordService.verifyPassword).toHaveBeenCalledWith(
        password,
        mockUser.passwordHash,
        mockUser.salt,
      );
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: 'user-id',
        username: 'testuser',
      });
      expect(result).toEqual({
        accessToken: 'jwt-token',
        id: 'user-id',
        username: 'testuser',
      });
    });

    it('should throw InvalidCredentialsException when user does not exist', async () => {
      const username = 'nonexistentuser';
      const password = 'password123';

      mockValidationService.validateLoginInput.mockReturnValue(undefined);
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.login(username, password)).rejects.toThrow(
        InvalidCredentialsException,
      );
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { username },
      });
    });

    it('should throw InvalidCredentialsException when password is incorrect', async () => {
      const username = 'testuser';
      const password = 'wrongpassword';

      const mockUser: User = {
        id: 'user-id',
        username: 'testuser',
        passwordHash: 'correcthash',
        salt: 'testsalt',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockValidationService.validateLoginInput.mockReturnValue(undefined);
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPasswordService.verifyPassword.mockReturnValue(false);

      await expect(service.login(username, password)).rejects.toThrow(
        InvalidCredentialsException,
      );
    });

    it('should throw ValidationException when validation fails', async () => {
      const username = '';
      const password = 'password123';

      mockValidationService.validateLoginInput.mockImplementation(() => {
        throw new ValidationException('username', 'Username is required');
      });

      await expect(service.login(username, password)).rejects.toThrow(
        ValidationException,
      );
    });

    it('should handle JWT generation errors gracefully', async () => {
      const username = 'testuser';
      const password = 'password123';

      const mockUser: User = {
        id: 'user-id',
        username: 'testuser',
        passwordHash: 'correcthash',
        salt: 'testsalt',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockValidationService.validateLoginInput.mockReturnValue(undefined);
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPasswordService.verifyPassword.mockReturnValue(true);
      mockJwtService.sign.mockImplementation(() => {
        throw new Error('JWT signing failed');
      });

      await expect(service.login(username, password)).rejects.toThrow(
        ValidationException,
      );
    });
  });

  describe('validateUser', () => {
    it('should return user when user exists', async () => {
      const userId = 'user-id';
      const mockUser: User = {
        id: 'user-id',
        username: 'testuser',
        passwordHash: 'hash',
        salt: 'salt',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockValidationService.validateUserId.mockReturnValue(undefined);
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.validateUser(userId);

      expect(mockValidationService.validateUserId).toHaveBeenCalledWith(userId);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(result).toEqual({
        id: 'user-id',
        username: 'testuser',
      });
    });

    it('should throw ValidationException when userId validation fails', async () => {
      const userId = '';

      mockValidationService.validateUserId.mockImplementation(() => {
        throw new ValidationException('userId', 'User ID is required');
      });

      await expect(service.validateUser(userId)).rejects.toThrow(
        ValidationException,
      );
    });

    it('should throw UserNotFoundException when user does not exist', async () => {
      const userId = 'nonexistent-id';

      mockValidationService.validateUserId.mockReturnValue(undefined);
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.validateUser(userId)).rejects.toThrow(
        UserNotFoundException,
      );
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
      });
    });
  });
});
