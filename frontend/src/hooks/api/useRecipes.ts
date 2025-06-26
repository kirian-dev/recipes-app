import { useInfiniteQuery, useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { recipesApi } from '../../api/services'
import { RecipeFilters, UpdateRecipeDto } from '../../api/types'
import { PAGINATION_LIMIT } from '../../constants'

export const useRecipes = (filters: RecipeFilters) => {
  return useInfiniteQuery({
    queryKey: ['recipes', filters],
    queryFn: ({ pageParam = 1 }) => recipesApi.getRecipes({
      page: pageParam,
      limit: PAGINATION_LIMIT,
      search: filters.search || undefined,
      maxCookingTime: filters.maxCookingTime || undefined,
      minIngredients: filters.minIngredients || undefined,
    }),
    getNextPageParam: (lastPage) => {
      return lastPage.hasNextPage ? lastPage.page + 1 : undefined
    },
    initialPageParam: 1,
  })
}

export const useRecipe = (id: string) => {
  return useQuery({
    queryKey: ['recipe', id],
    queryFn: () => recipesApi.getRecipe(id),
    enabled: !!id,
  })
}

export const useCreateRecipe = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: recipesApi.createRecipe,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] })
    },
  })
}

export const useUpdateRecipe = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRecipeDto }) =>
      recipesApi.updateRecipe(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] })
      queryClient.invalidateQueries({ queryKey: ['recipe', id] })
    },
  })
}

export const useDeleteRecipe = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: recipesApi.deleteRecipe,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] })
    },
  })
}

export const useToggleLike = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: recipesApi.toggleLike,
    onSuccess: (_, recipeId) => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] })
      queryClient.invalidateQueries({ queryKey: ['recipe', recipeId] })
    },
  })
} 