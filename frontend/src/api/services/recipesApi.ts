import apiClient from '../client'
import { 
  Recipe, 
  CreateRecipeDto, 
  UpdateRecipeDto, 
  GetRecipesParams, 
  GetRecipesResponse,
  ToggleLikeResponse 
} from '../types'

class RecipesApiService {
  async getRecipes(params: GetRecipesParams = {}): Promise<GetRecipesResponse> {
    const searchParams = new URLSearchParams()
    
    if (params.page) searchParams.append('page', params.page.toString())
    if (params.limit) searchParams.append('limit', params.limit.toString())
    if (params.search) searchParams.append('search', params.search)
    if (params.maxCookingTime) searchParams.append('maxCookingTime', params.maxCookingTime.toString())
    if (params.minIngredients) searchParams.append('minIngredients', params.minIngredients.toString())
    
    const response = await apiClient.get(`/recipes?${searchParams.toString()}`)
    const { recipes, pagination } = response.data

    return {
      recipes,
      total: pagination.total,
      page: pagination.page,
      limit: pagination.limit,
      hasNextPage: pagination.page < pagination.pages
    }
  }

  async getRecipe(id: string): Promise<Recipe> {
    const response = await apiClient.get(`/recipes/${id}`)
    return response.data
  }

  async createRecipe(data: CreateRecipeDto): Promise<Recipe> {
    const response = await apiClient.post('/recipes', data)
    return response.data
  }

  async updateRecipe(id: string, data: UpdateRecipeDto): Promise<Recipe> {
    const response = await apiClient.put(`/recipes/${id}`, data)
    return response.data
  }

  async deleteRecipe(id: string): Promise<void> {
    await apiClient.delete(`/recipes/${id}`)
  }

  async toggleLike(id: string): Promise<ToggleLikeResponse> {
    const response = await apiClient.post(`/recipes/${id}/like`)
    return response.data
  }
}

export const recipesApi = new RecipesApiService() 