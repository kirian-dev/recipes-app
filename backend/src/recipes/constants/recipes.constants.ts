export const RECIPES_CONSTANTS = {
  MESSAGES: {
    VALIDATION: {
      INVALID_RECIPE_ID: 'Invalid recipe ID format',
      INVALID_USER_ID: 'Invalid user ID format',
      TITLE_REQUIRED: 'Recipe title is required',
      DESCRIPTION_REQUIRED: 'Recipe description is required',
      INGREDIENTS_REQUIRED: 'At least one ingredient is required',
      COOKING_TIME_REQUIRED: 'Cooking time is required',
      INVALID_COOKING_TIME: 'Cooking time must be a positive number',
      INVALID_INGREDIENTS_COUNT: 'Invalid number of ingredients',
      USER_ID_NOT_FOUND: 'User ID not found in request',
    },
    AUTHORIZATION: {
      UPDATE_FORBIDDEN: 'You can only update your own recipes',
      DELETE_FORBIDDEN: 'You can only delete your own recipes',
      UNAUTHORIZED: 'Authentication required',
    },
    DATABASE: {
      CREATE_FAILED: 'Failed to create recipe',
      UPDATE_FAILED: 'Failed to update recipe',
      DELETE_FAILED: 'Failed to delete recipe',
      FETCH_FAILED: 'Failed to fetch recipes',
      FETCH_ONE_FAILED: 'Failed to fetch recipe',
      LIKE_TOGGLE_FAILED: 'Failed to toggle like status',
      FETCH_LIKED_FAILED: 'Failed to fetch liked recipes',
    },
    SUCCESS: {
      CREATED: 'Recipe created successfully',
      UPDATED: 'Recipe updated successfully',
      DELETED: 'Recipe deleted successfully',
      LIKED: 'Recipe liked successfully',
      UNLIKED: 'Recipe unliked successfully',
    },
  },
  VALIDATION: {
    TITLE: {
      MIN_LENGTH: 3,
      MAX_LENGTH: 100,
    },
    DESCRIPTION: {
      MIN_LENGTH: 10,
      MAX_LENGTH: 1000,
    },
    INGREDIENTS: {
      MIN_COUNT: 1,
      MAX_COUNT: 50,
    },
    COOKING_TIME: {
      MIN: 1,
      MAX: 1440,
    },
    PAGINATION: {
      DEFAULT_PAGE: 1,
      DEFAULT_LIMIT: 20,
      MAX_LIMIT: 100,
    },
  },
  OPERATIONS: {
    CREATE: 'create',
    UPDATE: 'update',
    DELETE: 'delete',
    FETCH: 'fetch',
    FETCH_ONE: 'fetch_one',
    LIKE_TOGGLE: 'like_toggle',
    FETCH_LIKED: 'fetch_liked',
  },
  ENTITIES: {
    RECIPE: 'recipe',
    USER_LIKED_RECIPE: 'user_liked_recipe',
  },
} as const;
