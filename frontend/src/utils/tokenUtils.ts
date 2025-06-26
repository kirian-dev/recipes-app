export const tokenUtils = {
  getAccessToken: (): string | null => {
    return localStorage.getItem('accessToken')
  },

  setTokens: (accessToken: string): void => {
    localStorage.setItem('accessToken', accessToken)
  },

  removeTokens: (): void => {
    localStorage.removeItem('accessToken')
  },

  isTokenExpired: (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const currentTime = Date.now() / 1000
      return payload.exp < currentTime
    } catch {
      return true
    }
  },

  getUserFromToken: (token: string): any => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      return payload
    } catch {
      return null
    }
  },

  hasValidToken: (): boolean => {
    const token = tokenUtils.getAccessToken()
    return !!token && !tokenUtils.isTokenExpired(token)
  },
} 