interface LoadingSpinnerProps {
  text?: string
  size?: 'sm' | 'md' | 'lg'
}

export default function LoadingSpinner({ text = 'Loading...', size = 'md' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  }

  return (
    <div className="text-center py-4">
      <div className="inline-flex items-center text-gray-500">
        <div className={`animate-spin rounded-full border-b-2 border-primary-600 mr-2 ${sizeClasses[size]}`}></div>
        {text}
      </div>
    </div>
  )
} 