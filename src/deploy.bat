@echo off
REM AdGuardian Vercel Deployment Script (Windows)
REM This script automates the deployment process

echo ================================
echo AdGuardian Deployment Script
echo ================================
echo.

REM Set your Vercel token
set VERCEL_TOKEN=drSv4jT6jlptKSmc0RXjOd1z

REM Check if Vercel CLI is installed
where vercel >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Installing Vercel CLI...
    call npm install -g vercel
) else (
    echo Vercel CLI is already installed
)

echo.
echo Deploying to Vercel...
echo.

REM Deploy to production
call vercel --prod --token %VERCEL_TOKEN% --yes

echo.
echo Deployment complete!
echo.
echo IMPORTANT NEXT STEPS:
echo 1. Add environment variables in Vercel Dashboard:
echo    - SUPABASE_URL
echo    - SUPABASE_ANON_KEY
echo    - SUPABASE_SERVICE_ROLE_KEY
echo.
echo 2. Redeploy after adding env variables
echo.
echo 3. REGENERATE your Vercel token for security:
echo    https://vercel.com/account/tokens
echo.

pause
