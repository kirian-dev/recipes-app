#!/bin/bash

# Script to run Docker with database and migrations for development

set -e

echo "🚀 Starting Docker with database and migrations for development..."

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker compose down

# Remove old volumes (optional, uncomment if needed)
# echo "🗑️ Removing old volumes..."
# docker compose down -v

# Build and start services
echo "🔨 Building and starting services..."
docker compose up --build -d

# Wait for databases to be ready
echo "⏳ Waiting for database to be ready..."
sleep 10

# Check service status
echo "📊 Service status:"
docker compose ps

echo ""
echo "✅ All services are running!"
echo ""
echo "📋 Available services:"
echo "  • Frontend: http://localhost:3000"
echo "  • Backend API: http://localhost:3001"
echo "  • PostgreSQL (dev): localhost:5432"
echo ""
echo "🔍 View logs:"
echo "  docker compose logs -f" 