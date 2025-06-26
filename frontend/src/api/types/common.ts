export interface ApiResponse<T = any> {
  data: T
  message?: string
  status: number
}

export interface PaginationParams {
  page?: number
  limit?: number
}

export interface PaginationResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  hasNextPage: boolean
}

export interface RecipeFilters {
  search?: string
  maxCookingTime?: number
  minIngredients?: number
}

export interface ApiError {
  message: string
  status: number
  errors?: Record<string, string[]>
} 