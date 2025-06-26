import { Link } from '@tanstack/react-router'
import { Heart, Clock, ChefHat } from 'lucide-react'
import { Recipe } from '../api/types'
import { useToggleLike } from '../hooks/api/useRecipes'

interface RecipeCardProps {
  recipe: Recipe
  onLikeClick?: () => void
  isAuthenticated?: boolean
}

export default function RecipeCard({ recipe, onLikeClick, isAuthenticated }: RecipeCardProps) {
  const toggleLike = useToggleLike()

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!isAuthenticated) {
      onLikeClick?.()
      return
    }

    try {
      await toggleLike.mutateAsync(recipe.id)
    } catch (error) {
      console.error('Error liking recipe:', error)
    }
  }

  return (
    <Link
      to="/recipes/$id"
      params={{ id: recipe.id }}
      className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden"
    >
      <div className="relative h-48 bg-gray-200">
          <div className="w-full h-full flex items-center justify-center">
            <ChefHat className="h-12 w-12 text-gray-400" />
          </div>
        
        <button
          onClick={handleLikeClick}
          disabled={toggleLike.isPending}
          className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors disabled:opacity-50"
        >
          <Heart
            className="h-5 w-5 text-gray-600 hover:text-red-500"
          />
        </button>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {recipe.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {recipe.description}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>{recipe.cookingTime} min</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">
            Author: {recipe.author.username}
          </span>
          <div className="flex items-center text-gray-500">
            <Heart className="h-4 w-4 mr-1" />
            <span>{recipe.likesCount}</span>
          </div>
        </div>
      </div>
    </Link>
  )
} 