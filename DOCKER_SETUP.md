# Docker Setup with Database, Migrations and E2E Tests

This guide explains how to run the recipes application with Docker, including database setup, migrations, and e2e tests.

## Quick Start

### Option 1: Development Environment Only
```bash
./scripts/docker-setup.sh
```

This will:
- Start PostgreSQL database for development (port 5432)
- Run Prisma migrations
- Start the backend API server (port 3001)
- Start the frontend application (port 3000)

### Option 2: E2E Tests Only
```bash
./scripts/run-tests.sh
```

This will:
- Start only the test PostgreSQL database (port 5433)
- Run e2e tests against the test database
- Stop all test containers when tests complete

### Option 3: Development + Tests
```bash
./scripts/run-all.sh
```

This will:
- Start development environment
- Run e2e tests
- Show results from both

## Manual Commands

### Development Environment
```bash
# Start development services
docker compose up --build -d

# Stop development services
docker compose down

# View development logs
docker compose logs -f
```

### Test Environment
```bash
# Start test services
docker compose -f docker-compose.test.yml up --build

# Stop test services
docker compose -f docker-compose.test.yml down

# View test logs
docker compose -f docker-compose.test.yml logs -f
```

## Services Overview

### Development Services (docker-compose.yml)
| Service | Port | Purpose | Database |
|---------|------|---------|----------|
| Frontend | 3000 | React application | - |
| Backend | 3001 | NestJS API | PostgreSQL (dev) |
| PostgreSQL (dev) | 5432 | Development database | recipes_db |

### Test Services (docker-compose.test.yml)
| Service | Port | Purpose | Database |
|---------|------|---------|----------|
| Backend Test | 3002 | E2E test runner | PostgreSQL (test) |
| PostgreSQL (test) | 5433 | Test database | recipes_test |

## Database Configuration

### Development Database
- **Host**: localhost:5432
- **Database**: recipes_db
- **User**: recipes_user
- **Password**: recipes_password
- **URL**: `postgresql://recipes_user:recipes_password@postgres:5432/recipes_db`

### Test Database
- **Host**: localhost:5433
- **Database**: recipes_test
- **User**: test
- **Password**: test
- **URL**: `postgresql://test:test@postgres_test:5432/recipes_test`

## Prisma Commands

The Docker setup automatically runs these Prisma commands:

```bash
# Generate Prisma client
npm run db:generate

# Run migrations (development)
npm run db:migrate

# Push schema to database (testing)
npm run db:push
```

## Troubleshooting

### Database Connection Issues
1. Check if PostgreSQL containers are running:
   ```bash
   # Development
   docker compose ps
   
   # Tests
   docker compose -f docker-compose.test.yml ps
   ```

2. Check database health:
   ```bash
   # Development
   docker compose logs postgres
   
   # Tests
   docker compose -f docker-compose.test.yml logs postgres_test
   ```

### Migration Issues
1. Reset development database:
   ```bash
   docker compose down -v
   docker compose up --build -d
   ```

2. Reset test database:
   ```bash
   docker compose -f docker-compose.test.yml down -v
   docker compose -f docker-compose.test.yml up --build
   ```

### Test Failures
1. Check test logs:
   ```bash
   docker compose -f docker-compose.test.yml logs backend_test
   ```

2. Ensure test database is clean:
   ```bash
   docker compose -f docker-compose.test.yml down -v
   docker compose -f docker-compose.test.yml up --build
   ```

## Environment Variables

The following environment variables are automatically set:

- `DATABASE_URL`: Database connection string
- `NODE_ENV`: Environment (development/test)
- `JWT_SECRET`: JWT signing secret
- `PORT`: Application port

## Volumes

- `postgres_data`: Development database data
- `postgres_test_data`: Test database data

These volumes persist data between container restarts. Use `docker compose down -v` to remove them.

## File Structure

```
├── docker-compose.yml          # Development environment
├── docker-compose.test.yml     # Test environment
├── scripts/
│   ├── docker-setup.sh         # Start development
│   ├── run-tests.sh           # Run tests only
│   └── run-all.sh             # Start dev + tests
└── DOCKER_SETUP.md            # This documentation
``` 