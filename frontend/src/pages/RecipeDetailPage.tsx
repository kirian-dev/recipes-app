import { useParams } from '@tanstack/react-router'
import { Clock, Heart, ChefHat } from 'lucide-react'
import { useRecipe, useToggleLike } from '../hooks/api/useRecipes'
import { toast } from 'sonner'

export default function RecipeDetailPage() {
  const { id } = useParams({ from: '/recipes/$id' })
  const { data: recipe, isLoading, error } = useRecipe(id)
  const toggleLike = useToggleLike()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (error || !recipe) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Recipe not found
        </h3>
        <p className="text-gray-600">
          Failed to load recipe. It may have been deleted or doesn't exist.
        </p>
      </div>
    )
  }

  const handleLike = async () => {
    try {
      await toggleLike.mutateAsync(recipe.id)
    } catch (error) {
      console.error('Error liking recipe:', error)
    }
  }
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="card">
        <div className="aspect-video bg-gray-200 rounded-lg mb-6 overflow-hidden">
          <div className="w-full h-full bg-gray-300 flex items-center justify-center">
            <ChefHat className="h-16 w-16 text-gray-400" />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {recipe.title}
            </h1>
            <p className="text-gray-600 mb-4">{recipe.description}</p>
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {recipe.cookingTime} minutes
              </div>
              <div className="flex items-center">
                <Heart className="h-4 w-4 mr-1" />
                {recipe.likesCount} likes
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleLike}
              disabled={toggleLike.isPending}
              className="btn btn-primary flex items-center"
            >
              <Heart className="h-4 w-4 mr-2" />
              Like
            </button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ingredients</h2>
          <ul className="space-y-2">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="flex items-center">
                <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
                {ingredient}
              </li>
            ))}
          </ul>
        </div>

      </div>

      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Comments</h2>
        <div className="space-y-4">
          <div className="border-b border-gray-200 pb-4">
            <div className="flex items-center space-x-2 mb-2">
              <span className="font-medium">cooking_lover</span>
              <span className="text-sm text-gray-500">2 hours ago</span>
            </div>
            <p className="text-gray-700">
              Great recipe! It turned out very tasty. I'll definitely try it again.
            </p>
          </div>
          <div className="border-b border-gray-200 pb-4">
            <div className="flex items-center space-x-2 mb-2">
              <span className="font-medium">pasta_master</span>
              <span className="text-sm text-gray-500">1 day ago</span>
            </div>
            <p className="text-gray-700">
              Classic! Added a bit of garlic for aroma. I recommend it to everyone.
            </p>
          </div>
        </div>
        
        <div className="mt-6">
          <textarea
            placeholder="Add a comment..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            rows={3}
          />
          <button className="mt-2 btn btn-primary" onClick={() => toast.info('Comments are not implemented yet')}>
            Send
          </button>
        </div>
      </div>
    </div>
  )
} 