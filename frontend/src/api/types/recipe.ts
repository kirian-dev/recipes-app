export interface Recipe {
  id: string
  title: string
  description: string
  ingredients: string[]
  cookingTime: number
  author: {
    id: string
    username: string
  }
  authorId: string
  likesCount: number
  isLiked: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateRecipeDto {
  title: string
  description: string
  ingredients: string[]
  cookingTime: number
}

export interface UpdateRecipeDto extends Partial<CreateRecipeDto> {}

export interface GetRecipesParams {
  page?: number
  limit?: number
  search?: string
  maxCookingTime?: number
  minIngredients?: number
}

export interface GetRecipesResponse {
  recipes: Recipe[]
  total: number
  page: number
  limit: number
  hasNextPage: boolean
}

export interface ToggleLikeResponse extends Recipe {}

export interface RecipeFilters {
  search: string
  maxCookingTime?: number | null
  minIngredients?: number | null
}
