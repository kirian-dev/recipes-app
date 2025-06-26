# Testing

This document describes the test structure and instructions for running tests for the recipe sharing application.

## Test Structure

### Unit Tests
Unit tests are located in the `src/` folder and have the `.spec.ts` extension. They test individual components in isolation:

- **Services**: `src/**/*.service.spec.ts`
- **Controllers**: `src/**/*.controller.spec.ts`
- **Guards**: `src/**/*.guard.spec.ts`
- **Middleware**: `src/**/*.middleware.spec.ts`

### E2E Tests
E2E tests are located in the `test/` folder and have the `.e2e-spec.ts` extension. They test the complete API flow:

- `test/app.e2e-spec.ts` - main API endpoints

## Test Commands

### Unit Tests
```bash
# Run all unit tests
npm run test:unit

# Run unit tests in watch mode
npm run test:watch

# Run unit tests with code coverage
npm run test:cov
```

### E2E Tests
```bash
# Run all E2E tests
npm run test:e2e
```

### All Tests
```bash
# Run all tests (unit + e2e)
npm run test:all

# Run all tests with coverage
npm run test:cov
```

## Test Coverage

### Unit Tests Cover:

#### RecipesService
- ✅ Recipe creation
- ✅ Recipe retrieval with filtering and pagination
- ✅ Recipe updates
- ✅ Recipe deletion
- ✅ Recipe likes/unlikes
- ✅ Liked recipes retrieval
- ✅ Error handling

#### AuthService
- ✅ User registration
- ✅ User authentication
- ✅ User validation
- ✅ Password hashing
- ✅ Error handling

#### AnalyticsService
- ✅ Analytics event creation
- ✅ Method statistics retrieval
- ✅ Status code statistics retrieval
- ✅ User-agent statistics retrieval
- ✅ Time-based statistics retrieval
- ✅ Path statistics retrieval
- ✅ User statistics retrieval

#### JwtAuthGuard
- ✅ JWT token validation
- ✅ Missing token handling
- ✅ Invalid token handling
- ✅ Non-existent user handling

#### AnalyticsMiddleware
- ✅ Successful request logging
- ✅ Request logging without user
- ✅ Missing headers handling
- ✅ Response time measurement
- ✅ Error handling

#### Controllers
- ✅ RecipesController - all endpoints
- ✅ AuthController - registration and authentication
- ✅ AnalyticsController - statistics retrieval

### E2E Tests Cover:

#### Authentication
- ✅ POST /auth/sign-up - user registration
- ✅ POST /auth/login - user authentication
- ✅ Input validation
- ✅ Error handling

#### Recipes
- ✅ POST /recipes - recipe creation
- ✅ GET /recipes - recipe retrieval with pagination
- ✅ GET /recipes/:id - specific recipe retrieval
- ✅ POST /recipes/:id/like - recipe like/unlike
- ✅ GET /recipes/liked - liked recipes retrieval
- ✅ Search filtering
- ✅ Cooking time filtering
- ✅ Ingredients count filtering
- ✅ Authentication and authorization
- ✅ Error handling

## Test Environment Setup

### Environment Variables
The following environment variables are used for E2E tests:
```bash
NODE_ENV=test
JWT_SECRET=test-secret
DATABASE_URL=postgresql://test:test@localhost:5432/recipes_test
```

### Test Database
E2E tests require a separate test database. Ensure that:
1. PostgreSQL is running
2. Database `recipes_test` is created
3. Migrations are executed for the test database

## Running Tests in CI/CD

For CI/CD pipeline integration, use:
```bash
# Install dependencies
npm install

# Run migrations for tests
npm run db:migrate

# Run all tests
npm run test:all

# Check code coverage
npm run test:cov
```

## Debugging Tests

### Unit Tests
```bash
# Run in debug mode
npm run test:debug

# Run specific test
npm run test:unit -- --testNamePattern="should create a recipe"
```

### E2E Tests
```bash
# Run with verbose output
npm run test:e2e -- --verbose

# Run specific test
npm run test:e2e -- --testNamePattern="should register a new user"
```

## Code Coverage

To view code coverage:
```bash
npm run test:cov
```

Coverage report will be created in the `coverage/` folder. Open `coverage/lcov-report/index.html` in a browser to view the detailed report.

## Best Practices

1. **Test Isolation**: Each test should be independent
2. **Mocking**: Use mocks for external dependencies
3. **Data Cleanup**: E2E tests should clean up test data
4. **Descriptive Names**: Test names should describe expected behavior
5. **AAA Pattern**: Arrange, Act, Assert
6. **Edge Case Coverage**: Test both successful and error scenarios 