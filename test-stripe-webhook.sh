#!/bin/bash

# Test Stripe Webhook Endpoint
# Usage: ./test-stripe-webhook.sh

API_BASE="https://djuvnasyncdqhsrydkse.supabase.co/functions/v1/make-server-51144976"
ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqdXZuYXN5bmNkcWhzcnlka3NlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1NjI3MTksImV4cCI6MjA3OTEzODcxOX0.g3NT-tQo88MdeyLbzAXWEol_SN6AmcFMWA94p6X_lmQ"

echo "🧪 Testing Stripe Webhook Endpoint"
echo "=================================="
echo ""

# Note: This is a simplified test. Real webhook testing requires:
# 1. Stripe CLI: stripe listen --forward-to <url>
# 2. Or use Stripe Dashboard to send test events

echo "⚠️  This script tests the endpoint structure."
echo "For full webhook testing, use Stripe CLI:"
echo ""
echo "  stripe listen --forward-to $API_BASE/stripe-webhook"
echo "  stripe trigger checkout.session.completed"
echo ""
echo "Or configure webhook in Stripe Dashboard:"
echo "  URL: $API_BASE/stripe-webhook"
echo ""

# Test webhook endpoint (will fail without proper signature, but tests endpoint exists)
echo "1️⃣ Testing webhook endpoint (expecting 400 - missing signature)..."
WEBHOOK_RESPONSE=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ANON_KEY" \
  -H "apikey: $ANON_KEY" \
  -d '{"type":"test.event","data":{"object":{"id":"test_123"}}}' \
  "$API_BASE/stripe-webhook")

echo "Response: $WEBHOOK_RESPONSE"
echo ""

if echo "$WEBHOOK_RESPONSE" | grep -q "Missing stripe-signature\|Webhook secret not configured"; then
  echo "✅ Webhook endpoint exists and validates signature!"
else
  echo "⚠️  Unexpected response. Check endpoint configuration."
fi

echo ""
echo "📋 Next Steps:"
echo "1. Configure STRIPE_WEBHOOK_SECRET in Supabase Dashboard"
echo "2. Create webhook endpoint in Stripe Dashboard"
echo "3. Use Stripe CLI for full testing: stripe listen --forward-to <url>"
echo ""

