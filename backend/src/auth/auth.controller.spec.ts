import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { LoginDto } from './dto/login.dto';
import {
  UserAlreadyExistsException,
  InvalidCredentialsException,
  ValidationException,
  AccountLockedException,
  PasswordTooWeakException,
  RateLimitExceededException,
} from './exceptions/auth.exceptions';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    signUp: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signUp', () => {
    it('should register a new user', async () => {
      const signUpDto: SignUpDto = {
        username: 'newuser',
        password: 'password123',
      };

      const expectedUser = {
        id: 'user-id',
        username: 'newuser',
      };

      mockAuthService.signUp.mockResolvedValue(expectedUser);

      const result = await controller.signUp(signUpDto);

      expect(mockAuthService.signUp).toHaveBeenCalledWith(
        signUpDto.username,
        signUpDto.password,
      );
      expect(result).toEqual(expectedUser);
    });

    it('should throw UserAlreadyExistsException when user already exists', async () => {
      const signUpDto: SignUpDto = {
        username: 'existinguser',
        password: 'password123',
      };

      const error = new UserAlreadyExistsException('existinguser');
      mockAuthService.signUp.mockRejectedValue(error);

      await expect(controller.signUp(signUpDto)).rejects.toThrow(
        UserAlreadyExistsException,
      );
      expect(mockAuthService.signUp).toHaveBeenCalledWith(
        signUpDto.username,
        signUpDto.password,
      );
    });

    it('should throw ValidationException when username is empty', async () => {
      const signUpDto: SignUpDto = {
        username: '',
        password: 'password123',
      };

      const error = new ValidationException(
        'username',
        'Username cannot be empty',
      );
      mockAuthService.signUp.mockRejectedValue(error);

      await expect(controller.signUp(signUpDto)).rejects.toThrow(
        ValidationException,
      );
      expect(mockAuthService.signUp).toHaveBeenCalledWith(
        signUpDto.username,
        signUpDto.password,
      );
    });

    it('should throw ValidationException when username is too short', async () => {
      const signUpDto: SignUpDto = {
        username: 'ab',
        password: 'password123',
      };

      const error = new ValidationException(
        'username',
        'Username must be at least 3 characters long',
      );
      mockAuthService.signUp.mockRejectedValue(error);

      await expect(controller.signUp(signUpDto)).rejects.toThrow(
        ValidationException,
      );
      expect(mockAuthService.signUp).toHaveBeenCalledWith(
        signUpDto.username,
        signUpDto.password,
      );
    });

    it('should throw ValidationException when password is too short', async () => {
      const signUpDto: SignUpDto = {
        username: 'testuser',
        password: '123',
      };

      const error = new ValidationException(
        'password',
        'Password must be at least 6 characters long',
      );
      mockAuthService.signUp.mockRejectedValue(error);

      await expect(controller.signUp(signUpDto)).rejects.toThrow(
        ValidationException,
      );
      expect(mockAuthService.signUp).toHaveBeenCalledWith(
        signUpDto.username,
        signUpDto.password,
      );
    });

    it('should throw ValidationException when username contains invalid characters', async () => {
      const signUpDto: SignUpDto = {
        username: 'test@user',
        password: 'password123',
      };

      const error = new ValidationException(
        'username',
        'Username can only contain letters, numbers, underscores and hyphens',
      );
      mockAuthService.signUp.mockRejectedValue(error);

      await expect(controller.signUp(signUpDto)).rejects.toThrow(
        ValidationException,
      );
      expect(mockAuthService.signUp).toHaveBeenCalledWith(
        signUpDto.username,
        signUpDto.password,
      );
    });

    it('should throw PasswordTooWeakException when password is too weak', async () => {
      const signUpDto: SignUpDto = {
        username: 'testuser',
        password: '123456',
      };

      const error = new PasswordTooWeakException();
      mockAuthService.signUp.mockRejectedValue(error);

      await expect(controller.signUp(signUpDto)).rejects.toThrow(
        PasswordTooWeakException,
      );
      expect(mockAuthService.signUp).toHaveBeenCalledWith(
        signUpDto.username,
        signUpDto.password,
      );
    });

    it('should throw RateLimitExceededException when too many signup attempts', async () => {
      const signUpDto: SignUpDto = {
        username: 'testuser',
        password: 'password123',
      };

      const error = new RateLimitExceededException();
      mockAuthService.signUp.mockRejectedValue(error);

      await expect(controller.signUp(signUpDto)).rejects.toThrow(
        RateLimitExceededException,
      );
      expect(mockAuthService.signUp).toHaveBeenCalledWith(
        signUpDto.username,
        signUpDto.password,
      );
    });
  });

  describe('login', () => {
    it('should authenticate user and return access token', async () => {
      const loginDto: LoginDto = {
        username: 'testuser',
        password: 'password123',
      };

      const expectedResult = {
        accessToken: 'jwt-token-here',
      };

      mockAuthService.login.mockResolvedValue(expectedResult);

      const result = await controller.login(loginDto);

      expect(mockAuthService.login).toHaveBeenCalledWith(
        loginDto.username,
        loginDto.password,
      );
      expect(result).toEqual(expectedResult);
    });

    it('should throw InvalidCredentialsException when user does not exist', async () => {
      const loginDto: LoginDto = {
        username: 'nonexistentuser',
        password: 'password123',
      };

      const error = new InvalidCredentialsException();
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(loginDto)).rejects.toThrow(
        InvalidCredentialsException,
      );
      expect(mockAuthService.login).toHaveBeenCalledWith(
        loginDto.username,
        loginDto.password,
      );
    });

    it('should throw InvalidCredentialsException when password is incorrect', async () => {
      const loginDto: LoginDto = {
        username: 'testuser',
        password: 'wrongpassword',
      };

      const error = new InvalidCredentialsException();
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(loginDto)).rejects.toThrow(
        InvalidCredentialsException,
      );
      expect(mockAuthService.login).toHaveBeenCalledWith(
        loginDto.username,
        loginDto.password,
      );
    });

    it('should throw ValidationException when username is empty', async () => {
      const loginDto: LoginDto = {
        username: '',
        password: 'password123',
      };

      const error = new ValidationException(
        'username',
        'Username cannot be empty',
      );
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(loginDto)).rejects.toThrow(
        ValidationException,
      );
      expect(mockAuthService.login).toHaveBeenCalledWith(
        loginDto.username,
        loginDto.password,
      );
    });

    it('should throw ValidationException when password is empty', async () => {
      const loginDto: LoginDto = {
        username: 'testuser',
        password: '',
      };

      const error = new ValidationException(
        'password',
        'Password cannot be empty',
      );
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(loginDto)).rejects.toThrow(
        ValidationException,
      );
      expect(mockAuthService.login).toHaveBeenCalledWith(
        loginDto.username,
        loginDto.password,
      );
    });

    it('should throw AccountLockedException when account is locked', async () => {
      const loginDto: LoginDto = {
        username: 'lockeduser',
        password: 'password123',
      };

      const error = new AccountLockedException();
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(loginDto)).rejects.toThrow(
        AccountLockedException,
      );
      expect(mockAuthService.login).toHaveBeenCalledWith(
        loginDto.username,
        loginDto.password,
      );
    });

    it('should throw RateLimitExceededException when too many login attempts', async () => {
      const loginDto: LoginDto = {
        username: 'testuser',
        password: 'password123',
      };

      const error = new RateLimitExceededException();
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(loginDto)).rejects.toThrow(
        RateLimitExceededException,
      );
      expect(mockAuthService.login).toHaveBeenCalledWith(
        loginDto.username,
        loginDto.password,
      );
    });
  });
});
