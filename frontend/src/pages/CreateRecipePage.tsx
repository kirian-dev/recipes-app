import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Plus, X, Clock, ChefHat, ArrowLeft } from 'lucide-react'
import { useCreateRecipe } from '../hooks/api/useRecipes'
import ProtectedRoute from '../components/ProtectedRoute'
import { toast } from 'sonner'

interface Ingredient {
  id: string
  value: string
}

export default function CreateRecipePage() {
  const navigate = useNavigate()
  const createRecipe = useCreateRecipe()
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    cookingTime: 30,
  })
  
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: '1', value: '' }
  ])
  
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Recipe title is required'
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters long'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Recipe description is required'
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters long'
    }

    if (formData.cookingTime < 5) {
      newErrors.cookingTime = 'Cooking time must be at least 5 minutes'
    }

    const validIngredients = ingredients.filter(ing => ing.value.trim())
    if (validIngredients.length === 0) {
      newErrors.ingredients = 'Add at least one ingredient'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error('Please check the correctness of all required fields!')
      return
    }

    try {
      const validIngredients = ingredients
        .filter(ing => ing.value.trim())
        .map(ing => ing.value.trim())
      

      await createRecipe.mutateAsync({
        title: formData.title.trim(),
        description: formData.description.trim(),
        ingredients: validIngredients,
        cookingTime: formData.cookingTime,
      })

      toast.success('Recipe created successfully!')
      setTimeout(() => {
        navigate({ to: '/' })
      }, 1500)
    } catch (error: any) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message)
      } else {
        toast.error('An error occurred while creating the recipe')
      }
    }
  }

  const addIngredient = () => {
    const newId = Date.now().toString()
    setIngredients([...ingredients, { id: newId, value: '' }])
  }

  const removeIngredient = (id: string) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter(ing => ing.id !== id))
    }
  }

  const updateIngredient = (id: string, value: string) => {
    setIngredients(ingredients.map(ing => 
      ing.id === id ? { ...ing, value } : ing
    ))
  }


  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate({ to: '/' })}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back
            </button>
            <div className="flex items-center space-x-2">
              <ChefHat className="h-8 w-8 text-primary-600" />
              <h1 className="text-3xl font-bold text-gray-900">Create Recipe</h1>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Recipe Title *
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    errors.title ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter recipe title"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  id="description"
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    errors.description ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Describe your recipe..."
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
              </div>

              <div>
                <label htmlFor="cookingTime" className="block text-sm font-medium text-gray-700 mb-2">
                  Cooking Time (minutes) *
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="number"
                    id="cookingTime"
                    min="5"
                    value={formData.cookingTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, cookingTime: parseInt(e.target.value) || 0 }))}
                    className={`w-full pl-10 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      errors.cookingTime ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.cookingTime && (
                  <p className="mt-1 text-sm text-red-600">{errors.cookingTime}</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Ingredients</h2>
              <button
                type="button"
                onClick={addIngredient}
                className="flex items-center px-3 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Ingredient
              </button>
            </div>

            <div className="space-y-3">
              {ingredients.map((ingredient, index) => (
                <div key={ingredient.id} className="flex items-center space-x-3">
                  <span className="text-sm text-gray-500 w-8">{index + 1}.</span>
                  <input
                    type="text"
                    value={ingredient.value}
                    onChange={(e) => updateIngredient(ingredient.id, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter ingredient"
                  />
                  {ingredients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeIngredient(ingredient.id)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {errors.ingredients && (
              <p className="mt-2 text-sm text-red-600">{errors.ingredients}</p>
            )}
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate({ to: '/' })}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createRecipe.isPending}
              className="px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {createRecipe.isPending ? 'Creating...' : 'Create Recipe'}
            </button>
          </div>
        </form>
      </div>
    </ProtectedRoute>
  )
} 