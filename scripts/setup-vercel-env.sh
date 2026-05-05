#!/bin/bash

# Script untuk setup Environment Variables di Vercel
# Jalankan: bash scripts/setup-vercel-env.sh

echo "🔧 Setting up Vercel Environment Variables..."
echo ""

# Supabase Configuration
vercel env add NEXT_PUBLIC_SUPABASE_URL production preview development
# Paste: https://ztzicspqnvfpbnvhwilo.supabase.co

vercel env add NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY production preview development
# Paste: sb_publishable_aiRP-bNzsRmfBl9gV-ttPg_odY_PqiI

# Database URLs
vercel env add DATABASE_URL production preview development
# Paste: postgresql://postgres.ztzicspqnvfpbnvhwilo:astaghfirullah@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true

vercel env add DIRECT_URL production preview development
# Paste: postgresql://postgres.ztzicspqnvfpbnvhwilo:astaghfirullah@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres

# hCaptcha (Optional)
vercel env add NEXT_PUBLIC_HCAPTCHA_SITE_KEY production preview development
# Paste your hCaptcha site key

vercel env add HCAPTCHA_SECRET_KEY production preview development
# Paste your hCaptcha secret key

# App Configuration
vercel env add NEXT_PUBLIC_APP_URL production
# Paste: https://mitralabs-web.vercel.app

vercel env add NODE_ENV production
# Paste: production

echo ""
echo "✅ Environment Variables setup completed!"
echo ""
echo "Next steps:"
echo "1. Redeploy your application: vercel --prod"
echo "2. Test the website"
