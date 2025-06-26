import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RecipeParamDto {
  @ApiProperty({
    description: 'Recipe ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString({ message: 'Recipe ID must be a string' })
  @IsNotEmpty({ message: 'Recipe ID is required' })
  id: string;
}
