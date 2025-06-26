import { IsString, IsNumber, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAnalyticsEventDto {
  @ApiProperty({
    description: 'HTTP method',
    example: 'GET',
  })
  @IsString()
  method: string;

  @ApiProperty({
    description: 'URL path',
    example: '/recipes',
  })
  @IsString()
  path: string;

  @ApiProperty({
    description: 'HTTP status code',
    example: 200,
  })
  @IsNumber()
  statusCode: number;

  @ApiProperty({
    description: 'Response time in milliseconds',
    example: 150,
  })
  @IsNumber()
  duration: number;

  @ApiPropertyOptional({
    description: 'Client IP address',
    example: '192.168.1.1',
  })
  @IsOptional()
  @IsString()
  ip?: string;

  @ApiPropertyOptional({
    description: 'User ID if authenticated',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiProperty({
    description: 'User-Agent header',
    example: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  })
  @IsString()
  userAgent: string;

  @ApiProperty({
    description: 'Event timestamp',
    example: '2024-01-01T12:00:00.000Z',
  })
  @IsDateString()
  timestamp: string;
}
