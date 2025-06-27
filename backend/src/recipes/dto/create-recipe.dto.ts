import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsArray,
  Min,
  Max,
  MinLength,
  MaxLength,
  ArrayMinSize,
  ArrayMaxSize,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RECIPES_CONSTANTS } from '../constants/recipes.constants';

export class CreateRecipeDto {
  @ApiProperty({
    description: 'Recipe title',
    example: 'Baked Chicken Breast',
    minLength: RECIPES_CONSTANTS.VALIDATION.TITLE.MIN_LENGTH,
    maxLength: RECIPES_CONSTANTS.VALIDATION.TITLE.MAX_LENGTH,
  })
  @IsString()
  @IsNotEmpty({ message: RECIPES_CONSTANTS.MESSAGES.VALIDATION.TITLE_REQUIRED })
  @MinLength(RECIPES_CONSTANTS.VALIDATION.TITLE.MIN_LENGTH, {
    message: `Title must be at least ${RECIPES_CONSTANTS.VALIDATION.TITLE.MIN_LENGTH} characters long`,
  })
  @MaxLength(RECIPES_CONSTANTS.VALIDATION.TITLE.MAX_LENGTH, {
    message: `Title must not exceed ${RECIPES_CONSTANTS.VALIDATION.TITLE.MAX_LENGTH} characters`,
  })
  title: string;

  @ApiProperty({
    description: 'Recipe description',
    example: 'Simple and delicious baked chicken breast recipe with herbs',
    minLength: RECIPES_CONSTANTS.VALIDATION.DESCRIPTION.MIN_LENGTH,
    maxLength: RECIPES_CONSTANTS.VALIDATION.DESCRIPTION.MAX_LENGTH,
  })
  @IsString()
  @IsNotEmpty({
    message: RECIPES_CONSTANTS.MESSAGES.VALIDATION.DESCRIPTION_REQUIRED,
  })
  @MinLength(RECIPES_CONSTANTS.VALIDATION.DESCRIPTION.MIN_LENGTH, {
    message: `Description must be at least ${RECIPES_CONSTANTS.VALIDATION.DESCRIPTION.MIN_LENGTH} characters long`,
  })
  @MaxLength(RECIPES_CONSTANTS.VALIDATION.DESCRIPTION.MAX_LENGTH, {
    message: `Description must not exceed ${RECIPES_CONSTANTS.VALIDATION.DESCRIPTION.MAX_LENGTH} characters`,
  })
  description: string;

  @ApiProperty({
    description: 'List of ingredients',
    example: ['chicken breast', 'olive oil', 'salt', 'pepper', 'rosemary'],
    type: [String],
    minItems: RECIPES_CONSTANTS.VALIDATION.INGREDIENTS.MIN_COUNT,
    maxItems: RECIPES_CONSTANTS.VALIDATION.INGREDIENTS.MAX_COUNT,
  })
  @IsArray()
  @IsString({ each: true, message: 'Each ingredient must be a string' })
  @ArrayMinSize(RECIPES_CONSTANTS.VALIDATION.INGREDIENTS.MIN_COUNT, {
    message: RECIPES_CONSTANTS.MESSAGES.VALIDATION.INGREDIENTS_REQUIRED,
  })
  @ArrayMaxSize(RECIPES_CONSTANTS.VALIDATION.INGREDIENTS.MAX_COUNT, {
    message: `Cannot have more than ${RECIPES_CONSTANTS.VALIDATION.INGREDIENTS.MAX_COUNT} ingredients`,
  })
  @IsNotEmpty({
    message: RECIPES_CONSTANTS.MESSAGES.VALIDATION.INGREDIENTS_REQUIRED,
  })
  ingredients: string[];

  @ApiProperty({
    description: 'Cooking time in minutes',
    example: 45,
    minimum: RECIPES_CONSTANTS.VALIDATION.COOKING_TIME.MIN,
    maximum: RECIPES_CONSTANTS.VALIDATION.COOKING_TIME.MAX,
  })
  @IsNumber({}, { message: RECIPES_CONSTANTS.MESSAGES.VALIDATION.INVALID_COOKING_TIME })
  @Min(RECIPES_CONSTANTS.VALIDATION.COOKING_TIME.MIN, {
    message: `Cooking time must be at least ${RECIPES_CONSTANTS.VALIDATION.COOKING_TIME.MIN} minute`,
  })
  @Max(RECIPES_CONSTANTS.VALIDATION.COOKING_TIME.MAX, {
    message: `Cooking time cannot exceed 24 hours (${RECIPES_CONSTANTS.VALIDATION.COOKING_TIME.MAX} minutes)`,
  })
  cookingTime: number;
}
