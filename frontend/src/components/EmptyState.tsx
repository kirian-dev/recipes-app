import { Link } from '@tanstack/react-router'
import { ChefHat, Plus } from 'lucide-react'

interface EmptyStateProps {
  title: string
  description: string
  actionText?: string
  actionLink?: string
  icon?: React.ReactNode
}

export default function EmptyState({
  title,
  description,
  actionText = 'Add Recipe',
  actionLink = '/recipes/create',
  icon = <ChefHat className="h-16 w-16 text-gray-400 mx-auto mb-4" />
}: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      {icon}
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-gray-600 mb-6">
        {description}
      </p>
      {actionLink && (
        <Link
          to={actionLink}
          className="btn btn-primary inline-flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          {actionText}
        </Link>
      )}
    </div>
  )
} 