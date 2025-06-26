import { Injectable } from '@nestjs/common';
import { RECIPES_CONSTANTS } from '../constants/recipes.constants';
import { RecipesLoggerService } from './recipes-logger.service';

@Injectable()
export class ValidationService {
  constructor(private readonly recipesLogger: RecipesLoggerService) {}

  /**
   * Validates recipe ID format
   */
  validateRecipeId(recipeId: string): void {
    if (
      !recipeId ||
      typeof recipeId !== 'string' ||
      recipeId.trim().length === 0
    ) {
      this.recipesLogger.logValidationError(
        'recipeId',
        recipeId,
        RECIPES_CONSTANTS.MESSAGES.VALIDATION.INVALID_RECIPE_ID,
      );
      throw new Error(RECIPES_CONSTANTS.MESSAGES.VALIDATION.INVALID_RECIPE_ID);
    }
  }

  /**
   * Validates user ID format
   */
  validateUserId(userId: string): void {
    if (!userId || typeof userId !== 'string' || userId.trim().length === 0) {
      this.recipesLogger.logValidationError(
        'userId',
        userId,
        RECIPES_CONSTANTS.MESSAGES.VALIDATION.INVALID_USER_ID,
      );
      throw new Error(RECIPES_CONSTANTS.MESSAGES.VALIDATION.INVALID_USER_ID);
    }
  }

  /**
   * Validates recipe title
   */
  validateTitle(title: string): void {
    if (!title || typeof title !== 'string') {
      this.recipesLogger.logValidationError(
        'title',
        title,
        RECIPES_CONSTANTS.MESSAGES.VALIDATION.TITLE_REQUIRED,
      );
      throw new Error(RECIPES_CONSTANTS.MESSAGES.VALIDATION.TITLE_REQUIRED);
    }

    const trimmedTitle = title.trim();
    if (
      trimmedTitle.length < RECIPES_CONSTANTS.VALIDATION.TITLE.MIN_LENGTH ||
      trimmedTitle.length > RECIPES_CONSTANTS.VALIDATION.TITLE.MAX_LENGTH
    ) {
      this.recipesLogger.logValidationError(
        'title',
        title,
        `Title must be between ${RECIPES_CONSTANTS.VALIDATION.TITLE.MIN_LENGTH} and ${RECIPES_CONSTANTS.VALIDATION.TITLE.MAX_LENGTH} characters`,
      );
      throw new Error(
        `Title must be between ${RECIPES_CONSTANTS.VALIDATION.TITLE.MIN_LENGTH} and ${RECIPES_CONSTANTS.VALIDATION.TITLE.MAX_LENGTH} characters`,
      );
    }
  }

  /**
   * Validates recipe description
   */
  validateDescription(description: string): void {
    if (!description || typeof description !== 'string') {
      this.recipesLogger.logValidationError(
        'description',
        description,
        RECIPES_CONSTANTS.MESSAGES.VALIDATION.DESCRIPTION_REQUIRED,
      );
      throw new Error(
        RECIPES_CONSTANTS.MESSAGES.VALIDATION.DESCRIPTION_REQUIRED,
      );
    }

    const trimmedDescription = description.trim();
    if (
      trimmedDescription.length <
        RECIPES_CONSTANTS.VALIDATION.DESCRIPTION.MIN_LENGTH ||
      trimmedDescription.length >
        RECIPES_CONSTANTS.VALIDATION.DESCRIPTION.MAX_LENGTH
    ) {
      this.recipesLogger.logValidationError(
        'description',
        description,
        `Description must be between ${RECIPES_CONSTANTS.VALIDATION.DESCRIPTION.MIN_LENGTH} and ${RECIPES_CONSTANTS.VALIDATION.DESCRIPTION.MAX_LENGTH} characters`,
      );
      throw new Error(
        `Description must be between ${RECIPES_CONSTANTS.VALIDATION.DESCRIPTION.MIN_LENGTH} and ${RECIPES_CONSTANTS.VALIDATION.DESCRIPTION.MAX_LENGTH} characters`,
      );
    }
  }

  /**
   * Validates ingredients array
   */
  validateIngredients(ingredients: string[]): void {
    if (!Array.isArray(ingredients)) {
      this.recipesLogger.logValidationError(
        'ingredients',
        ingredients,
        RECIPES_CONSTANTS.MESSAGES.VALIDATION.INGREDIENTS_REQUIRED,
      );
      throw new Error(
        RECIPES_CONSTANTS.MESSAGES.VALIDATION.INGREDIENTS_REQUIRED,
      );
    }

    if (
      ingredients.length < RECIPES_CONSTANTS.VALIDATION.INGREDIENTS.MIN_COUNT ||
      ingredients.length > RECIPES_CONSTANTS.VALIDATION.INGREDIENTS.MAX_COUNT
    ) {
      this.recipesLogger.logValidationError(
        'ingredients',
        ingredients,
        `Ingredients count must be between ${RECIPES_CONSTANTS.VALIDATION.INGREDIENTS.MIN_COUNT} and ${RECIPES_CONSTANTS.VALIDATION.INGREDIENTS.MAX_COUNT}`,
      );
      throw new Error(
        `Ingredients count must be between ${RECIPES_CONSTANTS.VALIDATION.INGREDIENTS.MIN_COUNT} and ${RECIPES_CONSTANTS.VALIDATION.INGREDIENTS.MAX_COUNT}`,
      );
    }

    // Validate each ingredient
    ingredients.forEach((ingredient, index) => {
      if (
        !ingredient ||
        typeof ingredient !== 'string' ||
        ingredient.trim().length === 0
      ) {
        this.recipesLogger.logValidationError(
          `ingredients[${index}]`,
          ingredient,
          'Each ingredient must be a non-empty string',
        );
        throw new Error(
          `Ingredient at index ${index} must be a non-empty string`,
        );
      }
    });
  }

  /**
   * Validates cooking time
   */
  validateCookingTime(cookingTime: number): void {
    if (typeof cookingTime !== 'number' || isNaN(cookingTime)) {
      this.recipesLogger.logValidationError(
        'cookingTime',
        cookingTime,
        RECIPES_CONSTANTS.MESSAGES.VALIDATION.INVALID_COOKING_TIME,
      );
      throw new Error(
        RECIPES_CONSTANTS.MESSAGES.VALIDATION.INVALID_COOKING_TIME,
      );
    }

    if (
      cookingTime < RECIPES_CONSTANTS.VALIDATION.COOKING_TIME.MIN ||
      cookingTime > RECIPES_CONSTANTS.VALIDATION.COOKING_TIME.MAX
    ) {
      this.recipesLogger.logValidationError(
        'cookingTime',
        cookingTime,
        `Cooking time must be between ${RECIPES_CONSTANTS.VALIDATION.COOKING_TIME.MIN} and ${RECIPES_CONSTANTS.VALIDATION.COOKING_TIME.MAX} minutes`,
      );
      throw new Error(
        `Cooking time must be between ${RECIPES_CONSTANTS.VALIDATION.COOKING_TIME.MIN} and ${RECIPES_CONSTANTS.VALIDATION.COOKING_TIME.MAX} minutes`,
      );
    }
  }

  /**
   * Validates pagination parameters
   */
  validatePaginationParams(page?: number, limit?: number): void {
    if (page !== undefined) {
      if (typeof page !== 'number' || isNaN(page) || page < 1) {
        this.recipesLogger.logValidationError(
          'page',
          page,
          'Page must be a positive integer',
        );
        throw new Error('Page must be a positive integer');
      }
    }

    if (limit !== undefined) {
      if (
        typeof limit !== 'number' ||
        isNaN(limit) ||
        limit < 1 ||
        limit > RECIPES_CONSTANTS.VALIDATION.PAGINATION.MAX_LIMIT
      ) {
        this.recipesLogger.logValidationError(
          'limit',
          limit,
          `Limit must be between 1 and ${RECIPES_CONSTANTS.VALIDATION.PAGINATION.MAX_LIMIT}`,
        );
        throw new Error(
          `Limit must be between 1 and ${RECIPES_CONSTANTS.VALIDATION.PAGINATION.MAX_LIMIT}`,
        );
      }
    }
  }

  /**
   * Validates search parameters
   */
  validateSearchParams(
    search?: string,
    maxCookingTime?: number,
    minIngredients?: number,
  ): void {
    if (
      search !== undefined &&
      (typeof search !== 'string' || search.trim().length === 0)
    ) {
      this.recipesLogger.logValidationError(
        'search',
        search,
        'Search term must be a non-empty string',
      );
      throw new Error('Search term must be a non-empty string');
    }

    if (maxCookingTime !== undefined) {
      this.validateCookingTime(maxCookingTime);
    }

    if (minIngredients !== undefined) {
      if (
        typeof minIngredients !== 'number' ||
        isNaN(minIngredients) ||
        minIngredients < 1 ||
        minIngredients > RECIPES_CONSTANTS.VALIDATION.INGREDIENTS.MAX_COUNT
      ) {
        this.recipesLogger.logValidationError(
          'minIngredients',
          minIngredients,
          `Min ingredients must be between 1 and ${RECIPES_CONSTANTS.VALIDATION.INGREDIENTS.MAX_COUNT}`,
        );
        throw new Error(
          `Min ingredients must be between 1 and ${RECIPES_CONSTANTS.VALIDATION.INGREDIENTS.MAX_COUNT}`,
        );
      }
    }
  }
}
