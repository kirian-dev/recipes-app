import { Link } from '@tanstack/react-router'
import { ChefHat, Plus } from 'lucide-react'

interface HeroSectionProps {
  isAuthenticated: boolean
}

export default function HeroSection({ isAuthenticated }: HeroSectionProps) {
  return (
    <section className="text-center py-12 bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl">
      <div className="max-w-3xl mx-auto">
        <ChefHat className="h-16 w-16 text-primary-600 mx-auto mb-6" />
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Share Your Best Recipes
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Discover thousands of recipes from home cooks around the world. 
          Create, save, and share your culinary masterpieces.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {isAuthenticated && (
            <Link
              to="/recipes/create"
              className="btn btn-secondary inline-flex items-center justify-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Recipe
            </Link>
          )}
        </div>
      </div>
    </section>
  )
} 