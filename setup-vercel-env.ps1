# PowerShell Script untuk Setup Vercel Environment Variables
# Jalankan: .\setup-vercel-env.ps1

Write-Host "🔧 Setting up Vercel Environment Variables..." -ForegroundColor Cyan
Write-Host ""

# Function untuk add environment variable
function Add-VercelEnv {
    param(
        [string]$Name,
        [string]$Value,
        [string]$Environment
    )

    Write-Host "Adding $Name to $Environment..." -ForegroundColor Yellow
    echo $Value | vercel env add $Name $Environment
    Write-Host "✅ $Name added!" -ForegroundColor Green
    Write-Host ""
}

# 1. NEXT_PUBLIC_SUPABASE_URL
Write-Host "1/6 - Adding NEXT_PUBLIC_SUPABASE_URL..." -ForegroundColor Cyan
echo "https://ztzicspqnvfpbnvhwilo.supabase.co" | vercel env add NEXT_PUBLIC_SUPABASE_URL production
echo "https://ztzicspqnvfpbnvhwilo.supabase.co" | vercel env add NEXT_PUBLIC_SUPABASE_URL preview
echo "https://ztzicspqnvfpbnvhwilo.supabase.co" | vercel env add NEXT_PUBLIC_SUPABASE_URL development

# 2. NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
Write-Host "2/6 - Adding NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY..." -ForegroundColor Cyan
echo "sb_publishable_aiRP-bNzsRmfBl9gV-ttPg_odY_PqiI" | vercel env add NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY production
echo "sb_publishable_aiRP-bNzsRmfBl9gV-ttPg_odY_PqiI" | vercel env add NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY preview
echo "sb_publishable_aiRP-bNzsRmfBl9gV-ttPg_odY_PqiI" | vercel env add NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY development

# 3. DATABASE_URL
Write-Host "3/6 - Adding DATABASE_URL..." -ForegroundColor Cyan
echo "postgresql://postgres.ztzicspqnvfpbnvhwilo:astaghfirullah@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true" | vercel env add DATABASE_URL production
echo "postgresql://postgres.ztzicspqnvfpbnvhwilo:astaghfirullah@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true" | vercel env add DATABASE_URL preview
echo "postgresql://postgres.ztzicspqnvfpbnvhwilo:astaghfirullah@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true" | vercel env add DATABASE_URL development

# 4. DIRECT_URL
Write-Host "4/6 - Adding DIRECT_URL..." -ForegroundColor Cyan
echo "postgresql://postgres.ztzicspqnvfpbnvhwilo:astaghfirullah@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres" | vercel env add DIRECT_URL production
echo "postgresql://postgres.ztzicspqnvfpbnvhwilo:astaghfirullah@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres" | vercel env add DIRECT_URL preview
echo "postgresql://postgres.ztzicspqnvfpbnvhwilo:astaghfirullah@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres" | vercel env add DIRECT_URL development

# 5. NEXT_PUBLIC_APP_URL (sudah ditambahkan)
Write-Host "5/6 - NEXT_PUBLIC_APP_URL already added ✅" -ForegroundColor Green

# 6. NODE_ENV (sudah ditambahkan)
Write-Host "6/6 - NODE_ENV already added ✅" -ForegroundColor Green

Write-Host ""
Write-Host "✅ Environment Variables setup completed!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Redeploy: vercel --prod" -ForegroundColor White
Write-Host "2. Test: https://mitralabs-web.vercel.app" -ForegroundColor White
