#!/bin/bash

# Mitralabs.id Deployment Script
# This script prepares the application for deployment

set -e

echo "🚀 Mitralabs.id Deployment Script"
echo "=================================="
echo ""

# Check current branch
BRANCH=$(git branch --show-current)
echo "📍 Current branch: $BRANCH"
echo ""

# Check for uncommitted changes
if [[ -n $(git status -s) ]]; then
    echo "⚠️  You have uncommitted changes:"
    git status -s
    echo ""
    read -p "Do you want to continue? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Deployment cancelled"
        exit 1
    fi
fi

# Run linter
echo "🔍 Running linter..."
npm run lint
echo "✅ Linting passed"
echo ""

# Run type check
echo "🔍 Running type check..."
npm run type-check
echo "✅ Type check passed"
echo ""

# Run tests
echo "🧪 Running tests..."
npm test -- --run
echo "✅ Tests passed"
echo ""

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
npx prisma generate
echo "✅ Prisma Client generated"
echo ""

# Build application
echo "🏗️  Building application..."
npm run build
echo "✅ Build completed"
echo ""

# Check build size
echo "📊 Build size:"
du -sh .next
echo ""

# Ask for deployment confirmation
echo "=================================="
echo "Ready to deploy!"
echo ""
echo "Deployment checklist:"
echo "✅ Linting passed"
echo "✅ Type check passed"
echo "✅ Tests passed"
echo "✅ Build completed"
echo ""
read -p "Deploy to production? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 Deploying to Vercel..."

    # Check if Vercel CLI is installed
    if ! command -v vercel &> /dev/null; then
        echo "⚠️  Vercel CLI not found. Installing..."
        npm i -g vercel
    fi

    # Deploy
    vercel --prod

    echo ""
    echo "=================================="
    echo "✅ Deployment completed!"
    echo ""
    echo "Post-deployment checklist:"
    echo "□ Test admin login"
    echo "□ Test image upload"
    echo "□ Test contact form"
    echo "□ Check analytics"
    echo "□ Run Lighthouse audit"
    echo "=================================="
else
    echo "❌ Deployment cancelled"
    exit 1
fi
