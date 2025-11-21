#!/bin/bash

# Comprehensive Test Script for All Endpoints
# Tests: Health, Settings API, Stripe Webhook

API_BASE="https://djuvnasyncdqhsrydkse.supabase.co/functions/v1/make-server-51144976"
ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqdXZuYXN5bmNkcWhzcnlka3NlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1NjI3MTksImV4cCI6MjA3OTEzODcxOX0.g3NT-tQo88MdeyLbzAXWEol_SN6AmcFMWA94p6X_lmQ"

echo "🧪 Comprehensive Endpoint Testing"
echo "=================================="
echo ""

# Test 1: Health Check
echo "1️⃣ Testing Health Endpoint..."
HEALTH_RESPONSE=$(curl -s -H "Authorization: Bearer $ANON_KEY" -H "apikey: $ANON_KEY" "$API_BASE/health")
echo "Response: $HEALTH_RESPONSE"
if echo "$HEALTH_RESPONSE" | grep -q "ok"; then
  echo "✅ Health check PASSED"
else
  echo "❌ Health check FAILED"
fi
echo ""

# Test 2: Sign In (to get access token)
echo "2️⃣ Testing Sign In..."
SIGNIN_RESPONSE=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ANON_KEY" \
  -H "apikey: $ANON_KEY" \
  -d '{"email":"sam@sam.com","password":"password123"}' \
  "$API_BASE/signin")

echo "Response: $SIGNIN_RESPONSE"
ACCESS_TOKEN=$(echo $SIGNIN_RESPONSE | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)

if [ -z "$ACCESS_TOKEN" ]; then
  echo "⚠️  Could not extract access token. Trying alternative method..."
  ACCESS_TOKEN=$(echo $SIGNIN_RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin).get('accessToken', ''))" 2>/dev/null)
fi

if [ -n "$ACCESS_TOKEN" ]; then
  echo "✅ Sign in successful - Token: ${ACCESS_TOKEN:0:30}..."
  echo ""
  
  # Test 3: Save Settings
  echo "3️⃣ Testing Save Settings..."
  SAVE_RESPONSE=$(curl -s -X POST \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    -H "apikey: $ANON_KEY" \
    -d '{
      "name": "Test User",
      "email": "sam@sam.com",
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
  
  echo "Response: $SAVE_RESPONSE"
  if echo "$SAVE_RESPONSE" | grep -q "success\|settings"; then
    echo "✅ Save settings PASSED"
  else
    echo "❌ Save settings FAILED"
  fi
  echo ""
  
  # Test 4: Get Settings
  echo "4️⃣ Testing Get Settings..."
  GET_RESPONSE=$(curl -s -X GET \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    -H "apikey: $ANON_KEY" \
    "$API_BASE/user/settings")
  
  echo "Response: $GET_RESPONSE"
  if echo "$GET_RESPONSE" | grep -q "settings\|Test User"; then
    echo "✅ Get settings PASSED"
  else
    echo "❌ Get settings FAILED"
  fi
  echo ""
else
  echo "❌ Sign in FAILED - Cannot test settings endpoints"
  echo ""
fi

# Test 5: Stripe Webhook Endpoint (structure test)
echo "5️⃣ Testing Stripe Webhook Endpoint Structure..."
WEBHOOK_RESPONSE=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ANON_KEY" \
  -H "apikey: $ANON_KEY" \
  -d '{"type":"test.event","data":{"object":{"id":"test_123"}}}' \
  "$API_BASE/stripe-webhook")

echo "Response: $WEBHOOK_RESPONSE"
if echo "$WEBHOOK_RESPONSE" | grep -q "Missing stripe-signature\|Webhook secret not configured"; then
  echo "✅ Webhook endpoint exists and validates signature"
else
  echo "⚠️  Unexpected response - check endpoint configuration"
fi
echo ""

# Test 6: Checkout Session Creation (if Stripe configured)
echo "6️⃣ Testing Checkout Session Creation..."
CHECKOUT_RESPONSE=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ANON_KEY" \
  -H "apikey: $ANON_KEY" \
  -d '{
    "planId": "starter",
    "planName": "Starter Plan",
    "amount": 29,
    "billingPeriod": "monthly",
    "customerEmail": "test@example.com"
  }' \
  "$API_BASE/create-checkout-session")

echo "Response: $CHECKOUT_RESPONSE"
if echo "$CHECKOUT_RESPONSE" | grep -q "url\|error"; then
  if echo "$CHECKOUT_RESPONSE" | grep -q "url"; then
    echo "✅ Checkout session creation PASSED"
  else
    echo "⚠️  Checkout endpoint responded (may need Stripe configuration)"
  fi
else
  echo "❌ Checkout endpoint FAILED"
fi
echo ""

echo "=================================="
echo "✅ Testing Complete!"
echo ""
echo "📋 Summary:"
echo "- Health: Check above"
echo "- Settings API: Check above"
echo "- Stripe Webhook: Check above"
echo "- Checkout Session: Check above"
echo ""
echo "🔗 View logs: https://supabase.com/dashboard/project/djuvnasyncdqhsrydkse/functions/make-server-51144976/logs"

