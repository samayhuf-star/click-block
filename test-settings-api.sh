#!/bin/bash

# Test Settings API Endpoints
# Usage: ./test-settings-api.sh

API_BASE="https://djuvnasyncdqhsrydkse.supabase.co/functions/v1/make-server-51144976"
ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqdXZuYXN5bmNkcWhzcnlka3NlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1NjI3MTksImV4cCI6MjA3OTEzODcxOX0.g3NT-tQo88MdeyLbzAXWEol_SN6AmcFMWA94p6X_lmQ"

echo "🧪 Testing Settings API"
echo "======================"
echo ""

# Step 1: Sign in to get access token
echo "1️⃣ Signing in..."
SIGNIN_RESPONSE=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ANON_KEY" \
  -H "apikey: $ANON_KEY" \
  -d '{"email":"test@example.com","password":"password123"}' \
  "$API_BASE/signin")

echo "Sign-in response: $SIGNIN_RESPONSE"
echo ""

# Extract access token (you'll need to manually copy this)
ACCESS_TOKEN=$(echo $SIGNIN_RESPONSE | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)

if [ -z "$ACCESS_TOKEN" ]; then
  echo "❌ Failed to get access token. Please sign in manually and set ACCESS_TOKEN variable."
  echo ""
  echo "To get access token manually:"
  echo "1. Sign in via the web app"
  echo "2. Open browser console"
  echo "3. Run: localStorage.getItem('clickblock_user_session')"
  echo "4. Copy the accessToken from the JSON"
  echo ""
  read -p "Enter your access token: " ACCESS_TOKEN
fi

echo "✅ Using access token: ${ACCESS_TOKEN:0:20}..."
echo ""

# Step 2: Save settings
echo "2️⃣ Saving settings..."
SAVE_RESPONSE=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "apikey: $ANON_KEY" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "company": "Test Company",
    "emailNotifications": true,
    "weeklyReports": false,
    "fraudAlerts": true,
    "autoBlock": true,
    "blockVPNs": false,
    "blockDatacenters": true,
    "customThreshold": 85
  }' \
  "$API_BASE/user/settings")

echo "Save response: $SAVE_RESPONSE"
echo ""

# Step 3: Get settings
echo "3️⃣ Retrieving settings..."
GET_RESPONSE=$(curl -s -X GET \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "apikey: $ANON_KEY" \
  "$API_BASE/user/settings")

echo "Get response: $GET_RESPONSE"
echo ""

# Step 4: Verify
if echo "$GET_RESPONSE" | grep -q "Test User"; then
  echo "✅ Settings persistence working!"
else
  echo "❌ Settings not persisted correctly"
fi

echo ""
echo "✅ Test complete!"

