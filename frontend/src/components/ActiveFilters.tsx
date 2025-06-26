import { X } from 'lucide-react'
import { FilterOptions } from './FilterModal'

interface ActiveFiltersProps {
  filters: FilterOptions
  onUpdateFilters: (filters: Partial<FilterOptions>) => void
  onClearAll: () => void
}

export default function ActiveFilters({ filters, onUpdateFilters, onClearAll }: ActiveFiltersProps) {
  const hasActiveFilters = () => {
    return (
      filters.search.trim() !== '' ||
      filters.maxCookingTime !== null ||
      filters.minIngredients !== null
    )
  }

  if (!hasActiveFilters()) return null

  return (
    <div className="flex flex-wrap items-center gap-2 p-3 bg-gray-50 rounded-lg">
      <span className="text-sm text-gray-600">Active filters:</span>
      
      {filters.search && (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
          Search: "{filters.search}"
          <button
            onClick={() => onUpdateFilters({ search: '' })}
            className="ml-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      )}
      
      {filters.maxCookingTime && (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
          ≤{filters.maxCookingTime} min
          <button
            onClick={() => onUpdateFilters({ maxCookingTime: undefined })}
            className="ml-2 text-green-600 hover:text-green-800 transition-colors"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      )}
      
      {filters.minIngredients && (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
          ≥{filters.minIngredients} ingr.
          <button
            onClick={() => onUpdateFilters({ minIngredients: undefined })}
            className="ml-2 text-purple-600 hover:text-purple-800 transition-colors"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      )}
      
      <button
        onClick={onClearAll}
        className="text-sm text-red-600 hover:text-red-800 font-medium transition-colors"
      >
        Clear all
      </button>
    </div>
  )
} 