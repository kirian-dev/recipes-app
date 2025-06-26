#!/bin/bash

# Script to run e2e tests

set -e

echo "🧪 Running e2e tests..."

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

# Stop existing test containers
print_status "Stopping existing test containers..."
docker compose -f docker-compose.test.yml down

# Remove old test volumes (optional)
print_status "Cleaning up old test data..."
docker compose -f docker-compose.test.yml down -v

# Build and start test services
print_status "Building and starting test services..."
docker compose -f docker-compose.test.yml up --build --abort-on-container-exit

# Check test results
if [ $? -eq 0 ]; then
    print_success "✅ All tests passed!"
else
    print_error "❌ Some tests failed!"
    exit 1
fi

echo ""
print_success "🎉 Test execution completed!"
echo ""
echo "📋 Test Summary:"
echo "  • E2E tests: Completed"
echo "  • Test database: Cleaned up"
echo ""
echo "🔍 To view test logs:"
echo "  docker compose -f docker-compose.test.yml logs backend_test" 