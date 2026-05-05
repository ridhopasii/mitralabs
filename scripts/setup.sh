#!/bin/bash

# Mitralabs.id Setup Script
# This script automates the initial setup process

set -e

echo "🚀 Mitralabs.id Setup Script"
echo "=============================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm version: $(npm -v)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install
echo "✅ Dependencies installed"
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "⚠️  .env.local not found. Creating from .env.example..."
    cp .env.example .env.local
    echo "✅ .env.local created. Please edit it with your credentials."
    echo ""
    echo "📝 Required environment variables:"
    echo "   - NEXT_PUBLIC_SUPABASE_URL"
    echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY"
    echo "   - DATABASE_URL"
    echo "   - NEXT_PUBLIC_EMAILJS_SERVICE_ID"
    echo "   - NEXT_PUBLIC_EMAILJS_TEMPLATE_ID"
    echo "   - NEXT_PUBLIC_EMAILJS_PUBLIC_KEY"
    echo "   - NEXT_PUBLIC_HCAPTCHA_SITE_KEY"
    echo ""
    read -p "Press Enter after you've updated .env.local..."
else
    echo "✅ .env.local already exists"
fi
echo ""

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
npx prisma generate
echo "✅ Prisma Client generated"
echo ""

# Ask if user wants to run migrations
read -p "Do you want to run database migrations? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🗄️  Running database migrations..."
    npx prisma migrate dev --name init
    echo "✅ Migrations completed"
else
    echo "⏭️  Skipping migrations"
fi
echo ""

# Run tests
echo "🧪 Running tests..."
npm test -- --run
echo "✅ Tests passed"
echo ""

# Build the application
echo "🏗️  Building application..."
npm run build
echo "✅ Build completed"
echo ""

echo "=============================="
echo "✅ Setup completed successfully!"
echo ""
echo "Next steps:"
echo "1. Make sure you've configured .env.local"
echo "2. Setup Supabase storage bucket 'site-assets'"
echo "3. Create admin user in Supabase Auth"
echo "4. Run 'npm run dev' to start development server"
echo ""
echo "📚 For detailed instructions, see SETUP.md"
echo "=============================="
