# Frontend Application Structure

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Backend server running on port 3000

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`

### Docker Setup
```bash
# Start all services (frontend, backend, database)
docker-compose up

# Or start only frontend
docker-compose up frontend
```

## Architecture Overview

The application uses a modern layered architecture:

- **Types** - TypeScript types
- **API** - API services and client
- **Hooks** - React Query hooks
- **Components** - React components
- **Providers** - Context providers
- **Utils** - Utilities
- **Constants** - Constants

## Folder Structure

```
src/
├── api/
│   ├── client.ts              # Axios client with interceptors
│   ├── services/              # API services
│   │   ├── recipesApi.ts      # Recipes API
│   │   ├── authApi.ts         # Authentication API
│   │   └── index.ts           # Services export
│   ├── recipes.ts             # Recipes export
│   └── auth.ts                # Authentication export
├── types/
│   ├── recipe.ts              # Recipe types
│   ├── auth.ts                # Authentication types
│   ├── common.ts              # Common types
│   └── index.ts               # Types export
├── hooks/
│   ├── api/                   # API hooks
│   │   ├── useRecipes.ts      # Recipe hooks
│   │   ├── useAuth.ts         # Authentication hooks
│   │   └── index.ts           # API hooks export
│   ├── useAuth.ts             # Authentication state hook
│   ├── useFilters.ts          # Filters hook
│   └── useInfiniteScroll.ts   # Infinite scroll hook
├── providers/
│   ├── AppProviders.tsx       # Main provider
│   ├── QueryProvider.tsx      # React Query provider
│   ├── ToasterProvider.tsx    # Notifications provider
│   └── index.ts               # Providers export
├── components/
│   ├── ErrorBoundary.tsx      # Error handling
│   ├── Layout.tsx             # Application layout
│   ├── ui/                    # UI components
│   └── ...                    # Other components
├── pages/                     # Application pages
├── utils/
│   ├── tokenUtils.ts          # Token utilities
│   └── index.ts               # Utilities export
├── constants/
│   ├── api.ts                 # API constants
│   └── index.ts               # Constants export
├── routing/
│   ├── router.ts              # Main router
│   ├── root.ts                # Root route
│   ├── routes.ts              # Route definitions
│   └── index.ts               # Routing export
└── App.tsx                    # Main component
```

## API Endpoints

### Recipes
- `POST /api/recipes` - Create recipe
- `GET /api/recipes` - Get recipes list
- `GET /api/recipes/{id}` - Get recipe by ID
- `PUT /api/recipes/{id}` - Update recipe
- `DELETE /api/recipes/{id}` - Delete recipe
- `POST /api/recipes/{id}/like` - Toggle like

### Authentication
- `POST /api/auth/sign-up` - Registration
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `POST /api/auth/refresh` - Token refresh
- `GET /api/auth/me` - Get current user

## Usage

### Import types
```typescript
import { Recipe, CreateRecipeDto, User } from '../types'
```

### Using API hooks
```typescript
import { useRecipes, useCreateRecipe, useAuth } from '../hooks/api'

// Get recipes list
const { data, isLoading, fetchNextPage } = useRecipes(filters)

// Create recipe
const createRecipe = useCreateRecipe()
createRecipe.mutate(recipeData)

// Check authentication
const { user, isAuthenticated } = useAuth()
```

### Using API services directly
```typescript
import { recipesApi, authApi } from '../api/services'

// Create recipe
const recipe = await recipesApi.createRecipe(recipeData)

// Login
const authData = await authApi.login(credentials)
```

## Features

1. **Error Boundary** - global error handling
2. **Token Management** - automatic JWT token management
3. **React Query** - caching and state management
4. **TypeScript** - full type safety
5. **Modular Architecture** - modular architecture 