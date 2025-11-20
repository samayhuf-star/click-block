#!/bin/bash

# Deploy Supabase Edge Function: make-server-51144976
# This script helps deploy the function to Supabase

echo "🚀 Supabase Edge Function Deployment"
echo "====================================="
echo ""

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null
then
    echo "📦 Installing Supabase CLI..."
    echo ""
    echo "Please install Supabase CLI using one of these methods:"
    echo ""
    echo "Option 1: Using npm (if you have Node.js):"
    echo "  npm install -g supabase"
    echo ""
    echo "Option 2: Using Homebrew (macOS):"
    echo "  brew install supabase/tap/supabase"
    echo ""
    echo "Option 3: Using Scoop (Windows):"
    echo "  scoop bucket add supabase https://github.com/supabase/scoop-bucket.git"
    echo "  scoop install supabase"
    echo ""
    echo "After installing, run this script again."
    exit 1
fi

echo "✅ Supabase CLI found"
echo ""

# Check if already linked
if [ ! -f ".supabase/config.toml" ]; then
    echo "🔗 Linking to Supabase project..."
    echo ""
    echo "You'll need to:"
    echo "1. Login: supabase login"
    echo "2. Link project: supabase link --project-ref lwyzoynbpuytmtcrjbga"
    echo ""
    read -p "Have you logged in and linked? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Please login and link first, then run this script again."
        exit 1
    fi
fi

echo ""
echo "📤 Deploying function: make-server-51144976"
echo ""

# Deploy the function
supabase functions deploy make-server-51144976 --no-verify-jwt

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🔍 Verify deployment:"
echo "curl -H 'Authorization: Bearer YOUR_ANON_KEY' \\"
echo "     -H 'apikey: YOUR_ANON_KEY' \\"
echo "     https://lwyzoynbpuytmtcrjbga.supabase.co/functions/v1/make-server-51144976/health"
echo ""

