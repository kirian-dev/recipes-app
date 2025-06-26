import { useMutation, useQueryClient } from '@tanstack/react-query'
import { authApi } from '../../api/services'

export const useSignUp = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: authApi.signUp,
    onSuccess: (data) => {
      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('user', JSON.stringify({
        id: data.id,
        username: data.username,
      }))
      
      queryClient.setQueryData(['user'], {
        id: data.id,
        username: data.username,
      })
    },
  })
}

export const useLogin = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('user', JSON.stringify({
        id: data.id,
        username: data.username,
      }))
      
      queryClient.setQueryData(['user'], {
        id: data.id,
        username: data.username,
      })
    },
  })
}

export const useLogout = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async () => {
      return Promise.resolve()
    },
    onSuccess: () => {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('user')
      
      queryClient.setQueryData(['user'], null)
      queryClient.clear()
    },
  })
}