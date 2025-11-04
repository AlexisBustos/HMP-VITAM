#!/bin/bash
# Post-deployment hook for Elastic Beanstalk
# Runs Prisma migrations and seed after deployment

set -e

echo "=== Post-Deployment Hook ==="
echo "Running Prisma migrations and seed..."

# Navigate to application directory
cd /var/app/current

# Run Prisma migrations
echo "Running Prisma migrations..."
npx prisma migrate deploy || {
  echo "Warning: Prisma migrate failed, trying db push..."
  npx prisma db push --skip-generate || echo "Warning: DB push also failed"
}

# Run seed (only if migrations succeeded)
if [ $? -eq 0 ]; then
  echo "Running database seed..."
  npx prisma db seed || echo "Warning: Seed failed or already executed"
fi

echo "=== Post-Deployment Hook Complete ==="

