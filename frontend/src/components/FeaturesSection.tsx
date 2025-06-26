import { ChefHat, Heart, Users } from 'lucide-react'

export default function FeaturesSection() {
  return (
    <section className="py-12 bg-gray-50 rounded-2xl">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Why Choose Us
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-primary-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <ChefHat className="h-8 w-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Thousands of Recipes</h3>
            <p className="text-gray-600">
              Large collection of recipes from simple to complex dishes
            </p>
          </div>
          <div className="text-center">
            <div className="bg-primary-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Heart className="h-8 w-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Save Your Favorites</h3>
            <p className="text-gray-600">
              Create collections and save your favorite recipes
            </p>
          </div>
          <div className="text-center">
            <div className="bg-primary-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Users className="h-8 w-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Community</h3>
            <p className="text-gray-600">
              Connect with other cooks and share experiences
            </p>
          </div>
        </div>
      </div>
    </section>
  )
} 