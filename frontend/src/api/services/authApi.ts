import apiClient from '../client'
import { SignUpDto, LoginDto, AuthResponse } from '../types'

class AuthApiService {
  async signUp(data: SignUpDto): Promise<AuthResponse> {
    const response = await apiClient.post('/auth/sign-up', data)
    return response.data
  }

  async login(data: LoginDto): Promise<AuthResponse> {
    const response = await apiClient.post('/auth/login', data)
    return response.data
  }
}

export const authApi = new AuthApiService() 