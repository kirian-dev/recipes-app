import Masonry from 'react-masonry-css'
import RecipeCard from './RecipeCard'
import LoadingSpinner from './LoadingSpinner'
import EmptyState from './EmptyState'
import { Recipe } from '../api/types'

interface RecipesGridProps {
  recipes: Recipe[]
  isLoading: boolean
  isFetchingNextPage: boolean
  lastElementRef: (node: HTMLDivElement | null) => void
  handleLikeClick: () => void
  isAuthenticated: boolean
}

export default function RecipesGrid({
  recipes,
  isLoading,
  isFetchingNextPage,
  lastElementRef,
  handleLikeClick,
  isAuthenticated
}: RecipesGridProps) {
  const breakpointColumns = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (recipes.length === 0) {
    return (
      <EmptyState
        title="No recipes found"
        description="Try changing search query or add a new recipe"
        actionText="Add Recipe"
        actionLink="/recipes/create"
      />
    )
  }

  return (
    <>
      <Masonry
        breakpointCols={breakpointColumns}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {recipes.map((recipe, index) => (
          <div
            key={recipe.id}
            ref={index === recipes.length - 1 ? lastElementRef : undefined}
            className="mb-6"
          >
            <RecipeCard
              recipe={recipe}
              onLikeClick={handleLikeClick}
              isAuthenticated={isAuthenticated}
            />
          </div>
        ))}
      </Masonry>

      {isFetchingNextPage && (
        <LoadingSpinner text="Loading..." size="sm" />
      )}
    </>
  )
} 