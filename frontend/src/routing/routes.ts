import { createRoute } from '@tanstack/react-router'
import { rootRoute } from './root'
import HomePage from '../pages/HomePage'
import LoginPage from '../pages/LoginPage'
import SignUpPage from '../pages/SignUpPage'
import CreateRecipePage from '../pages/CreateRecipePage'
import RecipeDetailPage from '../pages/RecipeDetailPage'

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
})

export const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
})

export const signupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/signup',
  component: SignUpPage,
})

export const recipeDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/recipes/$id',
  component: RecipeDetailPage,
})

export const createRecipeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/recipes/create',
  component: CreateRecipePage,
}) 