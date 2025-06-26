import { useState } from 'react'
import HeroSection from '../components/HeroSection'
import SearchAndFiltersSection from '../components/SearchAndFiltersSection'
import RecipesGrid from '../components/RecipesGrid'
import FeaturesSection from '../components/FeaturesSection'
import CTASection from '../components/CTASection'
import RecipesCount from '../components/RecipesCount'
import ErrorDisplay from '../components/ErrorDisplay'
import ModalsSection from '../components/ModalsSection'
import ActiveFilters from '../components/ActiveFilters'
import { useRecipes } from '../hooks/api/useRecipes'
import { useAuth } from '../hooks/useAuth'
import { useFilters } from '../hooks/useFilters'
import { useInfiniteScroll } from '../hooks/useInfiniteScroll'
import { RecipeFilters } from '../api/types'
import { FilterOptions } from '../components/FilterModal'

export default function HomePage() {
  const { isAuthenticated } = useAuth()
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const { filters, updateFilters, hasActiveFilters, getActiveFiltersCount, clearFilters } = useFilters()

  // Convert FilterOptions to RecipeFilters
  const recipeFilters: RecipeFilters = {
    search: filters.search || '',
    maxCookingTime: filters.maxCookingTime || null,
    minIngredients: filters.minIngredients || null,
  }

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useRecipes(recipeFilters)

  const { lastElementRef } = useInfiniteScroll({
    onIntersect: () => {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
    },
  })

  const handleLikeClick = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true)
    }
  }

  const recipes = data?.pages.flatMap((page: any) => page.recipes) || []

  const handleApplyFilters = (newFilters: FilterOptions) => {
    updateFilters(newFilters)
  }

  const handleClearFilters = () => {
    clearFilters()
  }

  const total = data?.pages?.[0]?.total ?? 0

  if (error) {
    return <ErrorDisplay error={error} />
  }

  return (
    <div className="space-y-8">
      <HeroSection isAuthenticated={isAuthenticated} />

      <SearchAndFiltersSection
        filters={filters}
        updateFilters={updateFilters}
        hasActiveFilters={hasActiveFilters}
        getActiveFiltersCount={getActiveFiltersCount}
        setShowFilterModal={setShowFilterModal}
      />

      <ActiveFilters
        filters={filters}
        onUpdateFilters={updateFilters}
        onClearAll={handleClearFilters}
      />

      <RecipesCount
        count={total}
        hasActiveFilters={hasActiveFilters}
        isLoading={isLoading}
      />

      <section>
        <RecipesGrid
          recipes={recipes}
          isLoading={isLoading}
          isFetchingNextPage={isFetchingNextPage}
          lastElementRef={lastElementRef}
          handleLikeClick={handleLikeClick}
          isAuthenticated={isAuthenticated}
        />
      </section>

      <FeaturesSection />

      <CTASection />

      <ModalsSection
        showFilterModal={showFilterModal}
        showAuthModal={showAuthModal}
        setShowFilterModal={setShowFilterModal}
        setShowAuthModal={setShowAuthModal}
        onApplyFilters={handleApplyFilters}
        currentFilters={filters}
      />
    </div>
  )
} 