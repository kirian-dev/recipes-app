import { useState, useEffect } from 'react'
import { X, Search, Clock, List, Filter } from 'lucide-react'

export interface FilterOptions {
  search: string
  maxCookingTime: number | null
  minIngredients: number | null
}

interface FilterModalProps {
  isOpen: boolean
  onClose: () => void
  onApplyFilters: (filters: FilterOptions) => void
  currentFilters: FilterOptions
}

export default function FilterModal({ 
  isOpen, 
  onClose, 
  onApplyFilters, 
  currentFilters 
}: FilterModalProps) {
  const [filters, setFilters] = useState<FilterOptions>(currentFilters)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setFilters(currentFilters)
  }, [currentFilters])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      onApplyFilters(filters)
      onClose()
    } catch (error) {
      console.error('Error applying filters:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    const resetFilters: FilterOptions = {
      search: '',
      maxCookingTime: null,
      minIngredients: null,
    }
    setFilters(resetFilters)
  }

  const handleClearAll = () => {
    handleReset()
    onApplyFilters({
      search: '',
      maxCookingTime: null,
      minIngredients: null,
    })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <Filter className="h-6 w-6 text-primary-600" />
            <h2 className="text-2xl font-bold text-gray-900">
              Filters
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              <Search className="h-4 w-4 inline mr-1" />
              Search by title and description
            </label>
            <input
              type="text"
              id="search"
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              placeholder="Enter recipe title or description..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="maxCookingTime" className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="h-4 w-4 inline mr-1" />
              Maximum cooking time (minutes)
            </label>
            <input
              type="number"
              id="maxCookingTime"
              min="1"
              max="480"
              value={filters.maxCookingTime || ''}
              onChange={(e) => setFilters(prev => ({ 
                ...prev, 
                maxCookingTime: e.target.value ? Number(e.target.value) : null 
              }))}
              placeholder="e.g., 30"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Leave empty to show all recipes
            </p>
          </div>

          <div>
            <label htmlFor="minIngredients" className="block text-sm font-medium text-gray-700 mb-2">
              <List className="h-4 w-4 inline mr-1" />
              Minimum number of ingredients
            </label>
            <input
              type="number"
              id="minIngredients"
              min="1"
              max="50"
              value={filters.minIngredients || ''}
              onChange={(e) => setFilters(prev => ({ 
                ...prev, 
                minIngredients: e.target.value ? Number(e.target.value) : null 
              }))}
              placeholder="e.g., 5"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Leave empty to show all recipes
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Quick filters
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFilters(prev => ({ ...prev, maxCookingTime: 15 }))}
                className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                  filters.maxCookingTime === 15
                    ? 'bg-primary-100 border-primary-300 text-primary-700'
                    : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                }`}
              >
                Quick (≤15 min)
              </button>
              <button
                type="button"
                onClick={() => setFilters(prev => ({ ...prev, maxCookingTime: 30 }))}
                className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                  filters.maxCookingTime === 30
                    ? 'bg-primary-100 border-primary-300 text-primary-700'
                    : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                }`}
              >
                Medium (≤30 min)
              </button>
              <button
                type="button"
                onClick={() => setFilters(prev => ({ ...prev, minIngredients: 3 }))}
                className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                  filters.minIngredients === 3
                    ? 'bg-primary-100 border-primary-300 text-primary-700'
                    : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                }`}
              >
                Simple (≥3 ingr.)
              </button>
              <button
                type="button"
                onClick={() => setFilters(prev => ({ ...prev, minIngredients: 8 }))}
                className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                  filters.minIngredients === 8
                    ? 'bg-primary-100 border-primary-300 text-primary-700'
                    : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                }`}
              >
                Complex (≥8 ingr.)
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 btn btn-primary"
            >
              {isLoading ? 'Applying...' : 'Apply Filters'}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={handleClearAll}
              className="px-4 py-2 text-red-600 hover:text-red-800 text-sm"
            >
              Clear All
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}