#!/bin/bash

# AdGuardian Vercel Deployment Script
# This script automates the deployment process

echo "🚀 AdGuardian Deployment Script"
echo "================================"
echo ""

# Set your Vercel token
export VERCEL_TOKEN="drSv4jT6jlptKSmc0RXjOd1z"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null
then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
else
    echo "✅ Vercel CLI is already installed"
fi

echo ""
echo "🌐 Deploying to Vercel..."
echo ""

# Deploy to production
vercel --prod --token $VERCEL_TOKEN --yes

echo ""
echo "✅ Deployment complete!"
echo ""
echo "⚠️  IMPORTANT NEXT STEPS:"
echo "1. Add environment variables in Vercel Dashboard:"
echo "   - SUPABASE_URL"
echo "   - SUPABASE_ANON_KEY"
echo "   - SUPABASE_SERVICE_ROLE_KEY"
echo ""
echo "2. Redeploy after adding env variables"
echo ""
echo "3. REGENERATE your Vercel token for security:"
echo "   https://vercel.com/account/tokens"
echo ""
