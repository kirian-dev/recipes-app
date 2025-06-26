#!/bin/bash

# Script to start application only (without tests)

set -e

echo "🚀 Starting application..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Stop existing containers
print_status "Stopping existing containers..."
docker compose down

# Build and start services
print_status "Building and starting services..."
docker compose up --build -d

# Wait for database to be ready
print_status "Waiting for database to be ready..."
sleep 15

# Check if database is ready
print_status "Checking database connection..."
max_attempts=30
attempt=1

while [ $attempt -le $max_attempts ]; do
    if docker compose exec -T postgres pg_isready -U recipes_user -d recipes_db > /dev/null 2>&1; then
        print_success "Database is ready!"
        break
    else
        print_warning "Database not ready yet (attempt $attempt/$max_attempts)..."
        sleep 2
        attempt=$((attempt + 1))
    fi
done

if [ $attempt -gt $max_attempts ]; then
    print_error "Database failed to start within expected time"
    exit 1
fi

# Wait for backend to be ready
print_status "Waiting for backend to be ready..."
sleep 10

# Check backend health
print_status "Checking backend health..."
max_attempts=20
attempt=1

while [ $attempt -le $max_attempts ]; do
    if curl -f http://localhost:3001/api/health > /dev/null 2>&1; then
        print_success "Backend is ready!"
        break
    else
        print_warning "Backend not ready yet (attempt $attempt/$max_attempts)..."
        sleep 3
        attempt=$((attempt + 1))
    fi
done

if [ $attempt -gt $max_attempts ]; then
    print_warning "Backend health check failed, but continuing..."
fi

# Check frontend health
print_status "Checking frontend health..."
max_attempts=15
attempt=1

while [ $attempt -le $max_attempts ]; do
    if curl -f http://localhost:3000 > /dev/null 2>&1; then
        print_success "Frontend is ready!"
        break
    else
        print_warning "Frontend not ready yet (attempt $attempt/$max_attempts)..."
        sleep 2
        attempt=$((attempt + 1))
    fi
done

if [ $attempt -gt $max_attempts ]; then
    print_warning "Frontend health check failed, but continuing..."
fi

# Show service status
print_status "Service status:"
docker compose ps

echo ""
print_success "🎉 Application is ready!"
echo ""
echo "📋 Available services:"
echo "  • Frontend: http://localhost:3000"
echo "  • Backend API: http://localhost:3001"
echo "  • Swagger Documentation: http://localhost:3001/api/docs"
echo "  • PostgreSQL: localhost:5432"
echo ""
echo "🔍 Useful commands:"
echo "  • View logs: docker compose logs -f"
echo "  • Stop services: docker compose down"
echo "  • Run tests: ./scripts/run-tests.sh"
echo "  • Full setup with tests: ./scripts/run-all.sh"
echo ""
print_success "✅ Application started successfully!" 