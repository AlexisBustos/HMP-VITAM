#!/bin/sh
set -e

echo "🚀 Starting HMP Vitam Backend..."

echo "🗄️  Running database migrations..."
npx prisma migrate deploy

echo "🌱 Seeding database (if needed)..."
npx prisma db seed || echo "⚠️  Seeding skipped or failed (this is okay)"

echo "✅ Starting server..."
node dist/server.js

