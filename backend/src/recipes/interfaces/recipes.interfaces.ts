export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  cookingTime: number;
  likesCount: number;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  author?: RecipeAuthor;
}

export interface RecipeAuthor {
  id: string;
  username: string;
}

export interface CreateRecipeData {
  title: string;
  description: string;
  ingredients: string[];
  cookingTime: number;
  authorId: string;
}

export interface UpdateRecipeData {
  title?: string;
  description?: string;
  ingredients?: string[];
  cookingTime?: number;
}

export interface FindAllOptions {
  page?: number;
  limit?: number;
  search?: string;
  maxCookingTime?: number;
  minIngredients?: number;
}

export interface RecipePagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface RecipesResponse {
  recipes: Recipe[];
  pagination: RecipePagination;
}

export interface LikeToggleResponse {
  liked: boolean;
}

export interface RecipeOperationLogData {
  recipeId?: string;
  userId?: string;
  authorId?: string;
  title?: string;
  cookingTime?: number;
  ingredientsCount?: number;
  searchTerm?: string;
  page?: number;
  limit?: number;
  totalRecipes?: number;
  liked?: boolean;
  [key: string]: unknown;
}

export interface RecipeWhereCondition {
  OR?: Array<{
    title?: { contains: string; mode: 'insensitive' };
    description?: { contains: string; mode: 'insensitive' };
    ingredients?: { hasSome: string[] };
  }>;
  cookingTime?: { lte: number };
}

export interface AuthenticatedRequest {
  user: {
    sub: string;
    id?: string;
    username?: string;
  };
}
