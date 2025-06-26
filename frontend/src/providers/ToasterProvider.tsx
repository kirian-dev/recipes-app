import { Toaster } from 'sonner'
import { ReactNode } from 'react'

interface ToasterProviderProps {
  children: ReactNode
}

export function ToasterProvider({ children }: ToasterProviderProps) {
  return (
    <>
      {children}
      <Toaster 
        richColors 
        position="top-center"
        duration={4000}
        closeButton
        toastOptions={{
          style: {
            background: 'white',
            color: '#374151',
          },
        }}
      />
    </>
  )
} 