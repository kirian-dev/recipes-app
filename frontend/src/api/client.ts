import axios, { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios'
import { tokenUtils } from '../utils/tokenUtils'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenUtils.getAccessToken()
    
    if (token && tokenUtils.isTokenExpired(token)) {
      tokenUtils.removeTokens()
      
      window.location.href = '/login'
      return Promise.reject(new Error('Token expired'))
    }
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      tokenUtils.removeTokens()
      window.location.href = '/login'
    }
    
    return Promise.reject(error)
  }
)

export default apiClient 