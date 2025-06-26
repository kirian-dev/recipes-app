import { useState, useCallback, useMemo } from 'react'
import { FilterOptions } from '../components/FilterModal'


const defaultFilters: FilterOptions = {
  search: '',
  maxCookingTime: null,
  minIngredients: null,
}

const isFilterActive = (filters: FilterOptions): boolean => {
  return (
    filters.search.trim() !== '' ||
    filters.maxCookingTime !== null ||
    filters.minIngredients !== null
  )
}

const getActiveFiltersCount = (filters: FilterOptions): number => {
  let count = 0
  if (filters.search.trim() !== '') count++
  if (filters.maxCookingTime !== null) count++
  if (filters.minIngredients !== null) count++
  return count
}

export function useFilters() {
  const [filters, setFilters] = useState<FilterOptions>(defaultFilters)

  const hasActiveFilters = useMemo(() => isFilterActive(filters), [filters])
  const activeFiltersCount = useMemo(() => getActiveFiltersCount(filters), [filters])

  const updateFilters = useCallback((newFilters: Partial<FilterOptions>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }, [])

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters)
  }, [])

  const clearFilters = useCallback(() => {
    setFilters(defaultFilters)
  }, [])

  return {
    filters,
    updateFilters,
    resetFilters,
    clearFilters,
    hasActiveFilters,
    getActiveFiltersCount: () => activeFiltersCount,
  }
} 