import { useState, useEffect } from 'react'
import { Search, Filter } from 'lucide-react'
import { FilterOptions } from './FilterModal'
import { useDebounce } from '../hooks/useDebounce'

interface SearchAndFiltersSectionProps {
  filters: FilterOptions
  updateFilters: (filters: Partial<FilterOptions>) => void
  hasActiveFilters: boolean
  getActiveFiltersCount: () => number
  setShowFilterModal: (show: boolean) => void
}

export default function SearchAndFiltersSection({
  filters,
  updateFilters,
  hasActiveFilters,
  getActiveFiltersCount,
  setShowFilterModal
}: SearchAndFiltersSectionProps) {
  const [searchValue, setSearchValue] = useState(filters.search || '')
  const debouncedSearch = useDebounce(searchValue, 500)

  useEffect(() => {
    setSearchValue(filters.search || '')
  }, [filters.search])

  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      updateFilters({ search: debouncedSearch })
    }
  }, [debouncedSearch])

  return (
    <section className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <button
          onClick={() => setShowFilterModal(true)}
          className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 inline-flex items-center space-x-2 ${
            hasActiveFilters
              ? 'bg-primary-600 text-white hover:bg-primary-700'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          <Filter className="h-4 w-4" />
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="bg-white text-primary-600 text-xs font-bold px-2 py-1 rounded-full">
              {getActiveFiltersCount()}
            </span>
          )}
        </button>
      </div>
    </section>
  )
} 