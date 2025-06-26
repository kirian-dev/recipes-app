import { Link } from '@tanstack/react-router'
import { ChefHat } from 'lucide-react'

export default function CTASection() {
  return (
    <section className="bg-primary-600 rounded-2xl p-8 text-center text-white">
      <h2 className="text-2xl font-bold mb-4">
        Ready to Share Your Recipe?
      </h2>
      <p className="text-primary-100 mb-6">
        Join our community and inspire others with your culinary creations
      </p>
      <Link
        to="/recipes/create"
        className="bg-white text-primary-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors inline-flex items-center"
      >
        <ChefHat className="h-4 w-4 mr-2" />
        Create Recipe
      </Link>
    </section>
  )
} 