import { createRouter } from '@tanstack/react-router'
import { rootRoute } from './root'
import { 
  indexRoute, 
  loginRoute, 
  signupRoute, 
  createRecipeRoute, 
  recipeDetailRoute 
} from './routes'
import { queryClient } from '../providers/QueryProvider'

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  signupRoute,
  createRecipeRoute,
  recipeDetailRoute,
])

export const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
  defaultPreload: 'intent',
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
} 