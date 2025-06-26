#!/bin/sh

echo "🚀 Starting database initialization..."

# Generate Prisma client
echo "📦 Generating Prisma client..."
npm run db:generate

# Run migrations
echo "🔄 Running database migrations..."
npx prisma migrate deploy

# Check if database is empty (only seed if empty)
echo "🔍 Checking if database needs seeding..."
RECIPE_COUNT=$(npx prisma db execute --stdin <<< "SELECT COUNT(*) as count FROM recipes;" | grep -o '[0-9]*' | tail -1)

if [ "$RECIPE_COUNT" -eq "0" ]; then
    echo "🌱 Database is empty, running seed..."
    npm run db:seed
    echo "✅ Seed completed!"
else
    echo "📊 Database already has $RECIPE_COUNT recipes, skipping seed"
fi

echo "✅ Database initialization completed!" 