import { IsOptional, IsString, IsInt, Min, Max } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { RECIPES_CONSTANTS } from '../constants/recipes.constants';

export class QueryRecipeDto {
  @ApiPropertyOptional({
    description: 'Page number',
    example: RECIPES_CONSTANTS.VALIDATION.PAGINATION.DEFAULT_PAGE,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Page must be an integer' })
  @Min(1, { message: 'Page must be at least 1' })
  page?: number = RECIPES_CONSTANTS.VALIDATION.PAGINATION.DEFAULT_PAGE;

  @ApiPropertyOptional({
    description: 'Number of recipes per page',
    example: RECIPES_CONSTANTS.VALIDATION.PAGINATION.DEFAULT_LIMIT,
    minimum: 1,
    maximum: RECIPES_CONSTANTS.VALIDATION.PAGINATION.MAX_LIMIT,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Limit must be an integer' })
  @Min(1, { message: 'Limit must be at least 1' })
  @Max(RECIPES_CONSTANTS.VALIDATION.PAGINATION.MAX_LIMIT, {
    message: `Limit cannot exceed ${RECIPES_CONSTANTS.VALIDATION.PAGINATION.MAX_LIMIT}`,
  })
  limit?: number = RECIPES_CONSTANTS.VALIDATION.PAGINATION.DEFAULT_LIMIT;

  @ApiPropertyOptional({
    description: 'Search term for title and description',
    example: 'chicken',
    maxLength: 100,
  })
  @IsOptional()
  @IsString({ message: 'Search must be a string' })
  @Transform(({ value }) => (value as string)?.trim() || '')
  search?: string;

  @ApiPropertyOptional({
    description: 'Maximum cooking time in minutes',
    example: 30,
    minimum: RECIPES_CONSTANTS.VALIDATION.COOKING_TIME.MIN,
    maximum: RECIPES_CONSTANTS.VALIDATION.COOKING_TIME.MAX,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Max cooking time must be an integer' })
  @Min(RECIPES_CONSTANTS.VALIDATION.COOKING_TIME.MIN, {
    message: `Max cooking time must be at least ${RECIPES_CONSTANTS.VALIDATION.COOKING_TIME.MIN} minute`,
  })
  @Max(RECIPES_CONSTANTS.VALIDATION.COOKING_TIME.MAX, {
    message: `Max cooking time cannot exceed 24 hours (${RECIPES_CONSTANTS.VALIDATION.COOKING_TIME.MAX} minutes)`,
  })
  maxCookingTime?: number;

  @ApiPropertyOptional({
    description: 'Minimum number of ingredients',
    example: 5,
    minimum: 1,
    maximum: RECIPES_CONSTANTS.VALIDATION.INGREDIENTS.MAX_COUNT,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Min ingredients must be an integer' })
  @Min(1, { message: 'Min ingredients must be at least 1' })
  @Max(RECIPES_CONSTANTS.VALIDATION.INGREDIENTS.MAX_COUNT, {
    message: `Min ingredients cannot exceed ${RECIPES_CONSTANTS.VALIDATION.INGREDIENTS.MAX_COUNT}`,
  })
  minIngredients?: number;
}
