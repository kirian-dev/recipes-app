import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'Username for login',
    example: 'john_doe',
  })
  @IsString()
  @IsNotEmpty({ message: 'Username is required' })
  username: string;

  @ApiProperty({
    description: 'Password for login',
    example: 'SecurePassword123*',
  })
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}
