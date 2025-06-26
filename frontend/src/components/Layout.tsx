import { useState } from 'react'
import { Link, useNavigate, Outlet } from '@tanstack/react-router'
import { ChefHat, Plus, LogOut, User, Menu, X } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useLogout } from '../hooks/api/useAuth'

export default function Layout() {
  const { isAuthenticated, user } = useAuth()
  const logout = useLogout()
  const navigate = useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await logout.mutateAsync()
      navigate({ to: '/' })
      setIsMobileMenuOpen(false)
    } catch (error) {
      console.error('Error during logout:', error)
    }
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <ChefHat className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">Recipes</span>
            </Link>

            <nav className="hidden md:flex space-x-8">
              <Link
                to="/"
                className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Home
              </Link>
              {isAuthenticated && (
                <Link
                  to="/recipes/create"
                  className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create Recipe</span>
                </Link>
              )}
            </nav>

            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-700">
                    <User className="h-4 w-4 text-gray-400" />
                    <span>{user?.username}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    disabled={logout.isPending}
                    className="flex items-center space-x-2 text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-700 hover:text-gray-900 p-2"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/"
                onClick={closeMobileMenu}
                className="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md text-base font-medium transition-colors"
              >
                Home
              </Link>
              {isAuthenticated && (
                <Link
                  to="/recipes/create"
                  onClick={closeMobileMenu}
                  className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md text-base font-medium transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create Recipe</span>
                </Link>
              )}
            </div>
            
            <div className="px-2 pt-2 pb-3 border-t border-gray-200">
              {isAuthenticated ? (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700">
                    <User className="h-4 w-4 text-gray-400" />
                    <span>{user?.username}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    disabled={logout.isPending}
                    className="flex items-center space-x-2 w-full px-3 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-md text-base font-medium transition-colors disabled:opacity-50"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    to="/login"
                    onClick={closeMobileMenu}
                    className="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md text-base font-medium transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={closeMobileMenu}
                    className="block px-3 py-2 bg-primary-600 text-white hover:bg-primary-700 rounded-md text-base font-medium transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500 text-sm">
            © 2025 Recipe Platform. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
} 