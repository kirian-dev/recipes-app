interface ErrorDisplayProps {
  error: Error
  title?: string
}

export default function ErrorDisplay({ error, title = 'Error loading recipes' }: ErrorDisplayProps) {
  return (
    <div className="text-center py-12">
      <div className="text-red-600 text-lg">
        {title}: {error.message}
      </div>
    </div>
  )
} 