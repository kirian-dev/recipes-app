import { Injectable } from '@nestjs/common';
import { LoggerService } from '../../common/logger/logger.service';
import { RECIPES_CONSTANTS } from '../constants/recipes.constants';
import { RecipeOperationLogData } from '../interfaces/recipes.interfaces';

@Injectable()
export class RecipesLoggerService {
  constructor(private readonly logger: LoggerService) {}

  logRecipeCreation(data: RecipeOperationLogData, success: boolean, error?: string): void {
    const message = success
      ? RECIPES_CONSTANTS.MESSAGES.SUCCESS.CREATED
      : RECIPES_CONSTANTS.MESSAGES.DATABASE.CREATE_FAILED;

    this.logger.info(message, {
      service: 'RecipesService',
      action: RECIPES_CONSTANTS.OPERATIONS.CREATE,
      success,
      error,
      metadata: data,
    });
  }

  logRecipeUpdate(data: RecipeOperationLogData, success: boolean, error?: string): void {
    const message = success
      ? RECIPES_CONSTANTS.MESSAGES.SUCCESS.UPDATED
      : RECIPES_CONSTANTS.MESSAGES.DATABASE.UPDATE_FAILED;

    this.logger.info(message, {
      service: 'RecipesService',
      action: RECIPES_CONSTANTS.OPERATIONS.UPDATE,
      success,
      error,
      metadata: data,
    });
  }

  logRecipeDeletion(data: RecipeOperationLogData, success: boolean, error?: string): void {
    const message = success
      ? RECIPES_CONSTANTS.MESSAGES.SUCCESS.DELETED
      : RECIPES_CONSTANTS.MESSAGES.DATABASE.DELETE_FAILED;

    this.logger.info(message, {
      service: 'RecipesService',
      action: RECIPES_CONSTANTS.OPERATIONS.DELETE,
      success,
      error,
      metadata: data,
    });
  }

  logRecipesFetch(data: RecipeOperationLogData, success: boolean, error?: string): void {
    const message = success ? 'Recipes fetched successfully' : RECIPES_CONSTANTS.MESSAGES.DATABASE.FETCH_FAILED;

    this.logger.info(message, {
      service: 'RecipesService',
      action: RECIPES_CONSTANTS.OPERATIONS.FETCH,
      success,
      error,
      metadata: data,
    });
  }

  logRecipeFetch(data: RecipeOperationLogData, success: boolean, error?: string): void {
    const message = success ? 'Recipe fetched successfully' : RECIPES_CONSTANTS.MESSAGES.DATABASE.FETCH_ONE_FAILED;

    this.logger.info(message, {
      service: 'RecipesService',
      action: RECIPES_CONSTANTS.OPERATIONS.FETCH_ONE,
      success,
      error,
      metadata: data,
    });
  }

  logLikeToggle(data: RecipeOperationLogData, success: boolean, error?: string): void {
    const message = success
      ? data.liked
        ? RECIPES_CONSTANTS.MESSAGES.SUCCESS.LIKED
        : RECIPES_CONSTANTS.MESSAGES.SUCCESS.UNLIKED
      : RECIPES_CONSTANTS.MESSAGES.DATABASE.LIKE_TOGGLE_FAILED;

    this.logger.info(message, {
      service: 'RecipesService',
      action: RECIPES_CONSTANTS.OPERATIONS.LIKE_TOGGLE,
      success,
      error,
      metadata: data,
    });
  }

  logLikedRecipesFetch(data: RecipeOperationLogData, success: boolean, error?: string): void {
    const message = success
      ? 'Liked recipes fetched successfully'
      : RECIPES_CONSTANTS.MESSAGES.DATABASE.FETCH_LIKED_FAILED;

    this.logger.info(message, {
      service: 'RecipesService',
      action: RECIPES_CONSTANTS.OPERATIONS.FETCH_LIKED,
      success,
      error,
      metadata: data,
    });
  }

  logAuthorizationCheck(operation: string, userId: string, authorId: string, success: boolean): void {
    const message = success ? 'Authorization check passed' : 'Authorization check failed';

    this.logger.info(message, {
      service: 'RecipesService',
      action: operation,
      success,
      metadata: { userId, authorId },
    });
  }

  logValidationError(field: string, value: any, error: string): void {
    this.logger.warn('Validation error', {
      service: 'RecipesService',
      action: 'validation',
      success: false,
      error,
      metadata: { field, value },
    });
  }
}
