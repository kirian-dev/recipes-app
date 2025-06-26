export const API_ENDPOINTS = {
  RECIPES: {
    LIST: '/recipes',
    DETAIL: (id: string) => `/recipes/${id}`,
    CREATE: '/recipes',
    UPDATE: (id: string) => `/recipes/${id}`,
    DELETE: (id: string) => `/recipes/${id}`,
    LIKE: (id: string) => `/recipes/${id}/like`,
  },
  
  AUTH: {
    SIGN_UP: '/auth/sign-up',
    LOGIN: '/auth/login',
  },
} as const

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const

export const HEADERS = {
  CONTENT_TYPE: 'Content-Type',
  AUTHORIZATION: 'Authorization',
  ACCEPT: 'Accept',
} as const 

export const PAGINATION_LIMIT = 12