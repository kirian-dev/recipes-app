import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AUTH_CONSTANTS } from '../constants/auth.constants';

export class SignUpDto {
  @ApiProperty({
    description: 'Username for registration',
    example: 'john_doe',
    minLength: AUTH_CONSTANTS.USERNAME.MIN_LENGTH,
    maxLength: AUTH_CONSTANTS.USERNAME.MAX_LENGTH,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(AUTH_CONSTANTS.USERNAME.MIN_LENGTH, {
    message: AUTH_CONSTANTS.MESSAGES.USERNAME.TOO_SHORT,
  })
  @MaxLength(AUTH_CONSTANTS.USERNAME.MAX_LENGTH, {
    message: AUTH_CONSTANTS.MESSAGES.USERNAME.TOO_LONG,
  })
  @Matches(AUTH_CONSTANTS.USERNAME.PATTERN, {
    message: AUTH_CONSTANTS.MESSAGES.USERNAME.INVALID_CHARS,
  })
  username: string;

  @ApiProperty({
    description: 'Password for registration',
    example: 'SecurePassword*',
    minLength: AUTH_CONSTANTS.PASSWORD.MIN_LENGTH,
    maxLength: AUTH_CONSTANTS.PASSWORD.MAX_LENGTH,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(AUTH_CONSTANTS.PASSWORD.MIN_LENGTH, {
    message: AUTH_CONSTANTS.MESSAGES.PASSWORD.TOO_SHORT,
  })
  @MaxLength(AUTH_CONSTANTS.PASSWORD.MAX_LENGTH, {
    message: AUTH_CONSTANTS.MESSAGES.PASSWORD.TOO_LONG,
  })
  password: string;
}
