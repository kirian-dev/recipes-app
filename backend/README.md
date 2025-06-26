# Recipes API Backend

A robust REST API for a recipe sharing application built with NestJS, PostgreSQL, and Prisma.

## 🚀 Features

- **User Authentication**: JWT-based authentication with password hashing
- **Recipe Management**: CRUD operations for recipes with filtering and pagination
- **Like System**: Users can like/unlike recipes
- **Analytics**: Request tracking and analytics
- **Validation**: Comprehensive input validation
- **Error Handling**: Structured error responses
- **Logging**: Detailed logging for debugging and monitoring
- **Testing**: Unit and E2E tests with high coverage

## 🛠 Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT
- **Validation**: class-validator
- **Testing**: Jest
- **Documentation**: Swagger/OpenAPI

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd recipes-app/backend
npm install
```

### 2. Environment Setup

Copy the environment template and configure your variables:

```bash
cp env.example .env
```

Configure the following variables in `.env`:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/recipes_db"

# JWT
JWT_SECRET="your-super-secret-jwt-key"

# Application
PORT=3000
NODE_ENV=development
```

### 3. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed the database (optional)
npx prisma db seed
```

### 4. Start the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run start:prod
```

The API will be available at `http://localhost:3001`

## 📚 API Documentation

Once the application is running, you can access the interactive API documentation at:

- **Swagger UI**: `http://localhost:3001/api/docs`
- **OpenAPI JSON**: `http://localhost:3001/api/api-json`

## 🏗 Project Structure

```
src/
├── auth/                 # Authentication module
│   ├── dto/             # Data transfer objects
│   ├── exceptions/      # Custom exceptions
│   ├── interfaces/      # TypeScript interfaces
│   ├── services/        # Auth services
│   └── auth.*.ts        # Auth controller, service, module
├── recipes/             # Recipes module
│   ├── constants/       # Recipe constants
│   ├── dto/            # Data transfer objects
│   ├── interfaces/     # TypeScript interfaces
│   ├── services/       # Recipe services
│   └── recipes.*.ts    # Recipe controller, service, module
├── analytics/          # Analytics module
│   ├── dto/           # Data transfer objects
│   ├── services/      # Analytics services
│   └── analytics.*.ts # Analytics controller, service, module
├── common/            # Shared utilities
│   ├── config/        # Configuration files
│   ├── decorators/    # Custom decorators
│   ├── filters/       # Exception filters
│   ├── interceptors/  # Request/response interceptors
│   ├── interfaces/    # Shared interfaces
│   └── logger/        # Logging configuration
├── prisma/           # Database configuration
│   ├── schema.prisma # Database schema
│   └── seed.ts       # Database seeder
└── main.ts          # Application entry point
```

## 🔐 Authentication

The API uses JWT-based authentication. To access protected endpoints:

1. **Register**: `POST /auth/sign-up`
2. **Login**: `POST /auth/login`
3. **Use Token**: Include `Authorization: Bearer <token>` header

### Example Authentication Flow

```bash
# Register a new user
curl -X POST http://localhost:3000/auth/sign-up \
  -H "Content-Type: application/json" \
  -d '{"username": "chef_john", "password": "SecurePassword*"}'

# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "chef_john", "password": "SecurePassword*"}'

# Use the returned token for authenticated requests
curl -X GET http://localhost:3000/recipes \
  -H "Authorization: Bearer <your-jwt-token>"
```

## 🍳 Recipes API

### Endpoints

- `GET /recipes` - Get paginated recipes with filtering
- `POST /recipes` - Create a new recipe (authenticated)
- `GET /recipes/:id` - Get a specific recipe
- `PUT /recipes/:id` - Update a specific recipe
- `DELETE /recipes/:id` - Delete a specific recipe
- `POST /recipes/:id/like` - Like/unlike a recipe (authenticated)

### Filtering Options

```bash
# Search recipes
GET /recipes?search=pasta

# Filter by cooking time
GET /recipes?maxCookingTime=30

# Filter by ingredients count
GET /recipes?minIngredients=5

# Pagination
GET /recipes?page=1&limit=10
```

### Example Recipe Creation

```bash
curl -X POST http://localhost:3000/recipes \
  -H "Authorization: Bearer <your-jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Spaghetti Carbonara",
    "description": "Classic Italian pasta dish",
    "ingredients": ["spaghetti", "eggs", "pecorino", "guanciale"],
    "cookingTime": 20
  }'
```

## 📊 Analytics

The API automatically tracks request analytics including:

- HTTP method and path
- Response status codes
- Response times
- User agents
- IP addresses
- User identification (when authenticated)

### Analytics Endpoints
- `GET /analytics` - Get comprehensive API request statistics
- `GET /analytics/methods` - Get statistics by HTTP method
- `GET /analytics/status-codes` - Get statistics by status code
- `GET /analytics/time-range` - Get time-range statistics

## 🧪 Testing

### Running Tests

```bash
# Unit tests
npm run test:unit

# E2E tests
npm run test:e2e

# All tests
npm run test:all

# Tests with coverage
npm run test:cov
```

### Test Structure

- **Unit Tests**: `src/**/*.spec.ts` - Test individual components
- **E2E Tests**: `test/*.e2e-spec.ts` - Test complete API flows

### Test Coverage

The test suite covers:
- ✅ Authentication flows
- ✅ Recipe CRUD operations
- ✅ Like/unlike functionality
- ✅ Input validation
- ✅ Error handling
- ✅ Analytics tracking
- ✅ JWT guard functionality

## 🗄 Database

### Schema Overview

- **Users**: User accounts with authentication
- **Recipes**: Recipe data with author relationships
- **UserLikedRecipe**: Many-to-many relationship for likes
- **AnalyticsEvent**: Request tracking and analytics

### Database Operations

```bash
# View database in Prisma Studio
npx prisma studio

# Reset database
npx prisma migrate reset

# Generate new migration
npx prisma migrate dev --name <migration-name>

# Deploy migrations to production
npx prisma migrate deploy
```

## 🔧 Development

### Available Scripts

```bash
# Development
npm run start:dev      # Start in development mode
npm run start:debug    # Start in debug mode
npm run start:prod     # Start in production mode

# Building
npm run build          # Build the application
npm run build:webpack  # Build with webpack

# Database
npm run db:generate    # Generate Prisma client
npm run db:migrate     # Run migrations
npm run db:seed        # Seed database
npm run db:studio      # Open Prisma Studio

# Testing
npm run test           # Run all tests
npm run test:watch     # Run tests in watch mode
npm run test:cov       # Run tests with coverage
npm run test:debug     # Run tests in debug mode
npm run test:e2e       # Run E2E tests

# Linting
npm run lint           # Run ESLint
npm run lint:fix       # Fix ESLint issues
```

### Code Quality

The project uses:
- **ESLint** for code linting
- **Prettier** for code formatting
- **Husky** for git hooks
- **Jest** for testing

## 🚀 Deployment

### Docker

```bash
# Build the image
docker build -t recipes-api .

# Run the container
docker run -p 3000:3000 recipes-api
```

### Environment Variables for Production

```env
DATABASE_URL="postgresql://user:pass@host:5432/db"
JWT_SECRET="your-production-secret"
NODE_ENV="production"
PORT=3000
```

## 📝 API Response Format

### Success Response

```json
{
  "data": {
    // Response data
  },
  "message": "Success message",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Error Response

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "field": "username",
      "constraint": "minLength"
    }
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

### Development Guidelines

- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Use conventional commit messages
- Ensure all linting rules pass

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation at `/api`
- Review the test files for usage examples

## 🔄 Changelog

### v1.0.0
- Initial release
- User authentication
- Recipe management
- Like system
- Analytics tracking
- Comprehensive testing
