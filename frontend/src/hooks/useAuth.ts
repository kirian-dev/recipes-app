import { tokenUtils } from '../utils/tokenUtils'

export const useAuth = () => {
  const getUserFromStorage = () => {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        return JSON.parse(userStr)
      } catch {
        return null
      }
    }
    return null
  }

  const user = getUserFromStorage()
  const isAuthenticated = !!user && tokenUtils.hasValidToken()
  
  return {
    user,
    isAuthenticated,
    isLoading: false,
    error: null,
  }
} 