export const AUTH_CONSTANTS = {
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 50,
    PATTERN: /^[a-zA-Z0-9_-]+$/,
    PATTERN_MESSAGE: 'Username can only contain letters, numbers, underscores and hyphens',
  },
  PASSWORD: {
    MIN_LENGTH: 6,
    MAX_LENGTH: 128,
  },
  WEAK_PASSWORDS: [
    '123456',
    'password',
    'qwerty',
    'admin',
    '123456789',
    '12345678',
    '1234567',
    'password123',
    'admin123',
    'letmein',
  ] as string[],
  WEAK_SEQUENCES: ['123', 'abc', 'qwe', 'asd', 'zxc', '789', 'def', 'ghi', 'jkl', 'mno'] as string[],
  MESSAGES: {
    USERNAME: {
      EMPTY: 'Username cannot be empty',
      TOO_SHORT: 'Username must be at least 3 characters long',
      TOO_LONG: 'Username cannot exceed 50 characters',
      INVALID_CHARS: 'Username can only contain letters, numbers, underscores and hyphens',
    },
    PASSWORD: {
      EMPTY: 'Password cannot be empty',
      TOO_SHORT: 'Password must be at least 6 characters long',
      TOO_LONG: 'Password cannot exceed 128 characters',
      TOO_WEAK: 'Password does not meet security requirements',
    },
    USER_ID: {
      REQUIRED: 'User ID is required',
    },
    DATABASE: {
      CREATE_FAILED: 'Failed to create user',
    },
    JWT: {
      GENERATE_FAILED: 'Failed to generate access token',
    },
  },
} as const;
