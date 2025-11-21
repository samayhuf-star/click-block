# 🧪 Test Results

**Date:** $(date)  
**Function:** `make-server-51144976`  
**Project:** `djuvnasyncdqhsrydkse`

---

## Test Summary

Run the comprehensive test script:

```bash
./test-all-endpoints.sh
```

---

## Individual Tests

### 1. Health Check

```bash
curl -H "Authorization: Bearer YOUR_ANON_KEY" \
     -H "apikey: YOUR_ANON_KEY" \
     https://djuvnasyncdqhsrydkse.supabase.co/functions/v1/make-server-51144976/health
```

**Expected:** `{"status":"ok"}`

---

### 2. Settings API - Save

```bash
# First, sign in to get access token
curl -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{"email":"your@email.com","password":"yourpassword"}' \
  https://djuvnasyncdqhsrydkse.supabase.co/functions/v1/make-server-51144976/signin

# Then save settings (use access token from above)
curl -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "name": "Test User",
    "emailNotifications": true,
    "customThreshold": 85
  }' \
  https://djuvnasyncdqhsrydkse.supabase.co/functions/v1/make-server-51144976/user/settings
```

**Expected:** `{"success":true,"message":"Settings saved successfully"}`

---

### 3. Settings API - Get

```bash
curl -X GET \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  https://djuvnasyncdqhsrydkse.supabase.co/functions/v1/make-server-51144976/user/settings
```

**Expected:** `{"settings":{...}}`

---

### 4. Stripe Webhook

```bash
# Test endpoint structure (will fail without proper signature, but confirms endpoint exists)
curl -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{"type":"test"}' \
  https://djuvnasyncdqhsrydkse.supabase.co/functions/v1/make-server-51144976/stripe-webhook
```

**Expected:** Error about missing signature (confirms endpoint exists)

**For real testing:** Use Stripe CLI:
```bash
stripe listen --forward-to https://djuvnasyncdqhsrydkse.supabase.co/functions/v1/make-server-51144976/stripe-webhook
stripe trigger checkout.session.completed
```

---

### 5. Checkout Session Creation

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{
    "planId": "starter",
    "planName": "Starter Plan",
    "amount": 29,
    "billingPeriod": "monthly"
  }' \
  https://djuvnasyncdqhsrydkse.supabase.co/functions/v1/make-server-51144976/create-checkout-session
```

**Expected:** `{"url":"https://checkout.stripe.com/..."}`

---

## ✅ Success Criteria

- [ ] Health endpoint returns `{"status":"ok"}`
- [ ] Settings save successfully
- [ ] Settings retrieve successfully
- [ ] Webhook endpoint validates signature
- [ ] Checkout session creation works (if Stripe configured)

---

## 🔗 View Logs

**Function Logs:** https://supabase.com/dashboard/project/djuvnasyncdqhsrydkse/functions/make-server-51144976/logs

---

**Run tests:** `./test-all-endpoints.sh`

