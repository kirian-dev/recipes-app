export interface User {
  id: string
  username: string
}

export interface SignUpDto {
  username: string
  password: string
}

export interface LoginDto {
  username: string
  password: string
}

export interface AuthResponse extends User {
  accessToken: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
} 