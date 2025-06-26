import { ReactNode } from 'react'
import { QueryProvider } from './QueryProvider'
import { ToasterProvider } from './ToasterProvider'
import ErrorBoundary from '../components/ErrorBoundary'

interface AppProvidersProps {
  children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ErrorBoundary>
      <QueryProvider>
        <ToasterProvider>
          {children}
        </ToasterProvider>
      </QueryProvider>
    </ErrorBoundary>
  )
} 