interface RecipesCountProps {
  count: number
  hasActiveFilters: boolean
  isLoading: boolean
}

export default function RecipesCount({ count, hasActiveFilters, isLoading }: RecipesCountProps) {
  if (isLoading) {
    return null
  }

  return (
    <p className="text-sm text-gray-600">
      Found recipes: {count}
      {hasActiveFilters && (
        <span className="text-primary-600 ml-2">
          (with applied filters)
        </span>
      )}
    </p>
  )
} 