# 🔐 Stripe Configuration Guide

## ✅ Keys Provided

**Secret Key:** `sk_test_51SUSgwIsXqYABheT...` (provided separately)  
**Publishable Key:** `pk_test_51SUSgwIsXqYABheTclLx4HFxxuPEtf73Fcqk6lHdQYBvLHm0uvXn3lPACC7pap4JhjKJy8KR73iv9dxsjaqqpezn00BoP47EiW` ✅ Already configured in frontend

---

## 🔐 Step 1: Configure Stripe Secret Key in Supabase

### Add Secret Key to Supabase Edge Function:

1. **Go to Supabase Dashboard:**
   - Visit: https://supabase.com/dashboard/project/djuvnasyncdqhsrydkse/settings/functions

2. **Add Secret:**
   - Click on "Secrets" tab
   - Click "Add new secret"
   - **Name:** `STRIPE_SECRET_KEY`
   - **Value:** `sk_test_51SUSgwIsXqYABheT...` (use the full secret key you received)
   - Click "Save"

---

## ✅ Step 2: Verify Publishable Key in Frontend

The publishable key is already configured in `src/utils/stripe.ts`:

```typescript
const STRIPE_PUBLISHABLE_KEY = 'pk_test_51SUSgwIsXqYABheTclLx4HFxxuPEtf73Fcqk6lHdQYBvLHm0uvXn3lPACC7pap4JhjKJy8KR73iv9dxsjaqqpezn00BoP47EiW';
```

✅ **No action needed** - Already configured!

---

## 🔗 Step 3: Create Stripe Webhook & Get Secret

### 3.1 Create Webhook Endpoint:

1. **Go to Stripe Dashboard:**
   - Visit: https://dashboard.stripe.com/webhooks

2. **Click "Add endpoint"**

3. **Configure Webhook:**
   - **Endpoint URL:** `https://djuvnasyncdqhsrydkse.supabase.co/functions/v1/make-server-51144976/stripe-webhook`
   - **Description:** "ClickBlock Payment & Subscription Events"
   - **Events to send:** Select these events:
     - ✅ `checkout.session.completed`
     - ✅ `customer.subscription.created`
     - ✅ `customer.subscription.updated`
     - ✅ `customer.subscription.deleted`
     - ✅ `invoice.payment_succeeded`
     - ✅ `invoice.payment_failed`

4. **Click "Add endpoint"**

### 3.2 Copy Webhook Signing Secret:

After creating the webhook:
1. Click on the webhook endpoint you just created
2. Find "Signing secret" section
3. Click "Reveal" to show the secret (starts with `whsec_`)
4. **Copy this secret** - you'll need it in Step 4

---

## 🔐 Step 4: Add Webhook Secret to Supabase

1. **Go back to Supabase Dashboard:**
   - Visit: https://supabase.com/dashboard/project/djuvnasyncdqhsrydkse/settings/functions

2. **Add Webhook Secret:**
   - Click "Secrets" tab
   - Click "Add new secret"
   - **Name:** `STRIPE_WEBHOOK_SECRET`
   - **Value:** `whsec_...` (paste the signing secret from Step 3.2)
   - Click "Save"

---

## ✅ Step 5: Verify Configuration

After adding both secrets, test the function:

```bash
# Test health endpoint
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqdXZuYXN5bmNkcWhzcnlka3NlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1NjI3MTksImV4cCI6MjA3OTEzODcxOX0.g3NT-tQo88MdeyLbzAXWEol_SN6AmcFMWA94p6X_lmQ" \
     -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqdXZuYXN5bmNkcWhzcnlka3NlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1NjI3MTksImV4cCI6MjA3OTEzODcxOX0.g3NT-tQo88MdeyLbzAXWEol_SN6AmcFMWA94p6X_lmQ" \
     https://djuvnasyncdqhsrydkse.supabase.co/functions/v1/make-server-51144976/health
```

Expected response: `{"status":"ok"}`

---

## 🧪 Step 6: Test Stripe Integration

### Test Checkout Session Creation:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqdXZuYXN5bmNkcWhzcnlka3NlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1NjI3MTksImV4cCI6MjA3OTEzODcxOX0.g3NT-tQo88MdeyLbzAXWEol_SN6AmcFMWA94p6X_lmQ" \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqdXZuYXN5bmNkcWhzcnlka3NlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1NjI3MTksImV4cCI6MjA3OTEzODcxOX0.g3NT-tQo88MdeyLbzAXWEol_SN6AmcFMWA94p6X_lmQ" \
  -d '{
    "planId": "starter",
    "planName": "Starter Plan",
    "amount": 29,
    "billingPeriod": "monthly",
    "customerEmail": "test@example.com"
  }' \
  https://djuvnasyncdqhsrydkse.supabase.co/functions/v1/make-server-51144976/create-checkout-session
```

### Test Webhook (using Stripe CLI):

```bash
# Install Stripe CLI if needed
# macOS: brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks
stripe listen --forward-to https://djuvnasyncdqhsrydkse.supabase.co/functions/v1/make-server-51144976/stripe-webhook

# In another terminal, trigger test event
stripe trigger checkout.session.completed
```

---

## 📋 Configuration Checklist

- [ ] `STRIPE_SECRET_KEY` added to Supabase Secrets
- [ ] Stripe webhook endpoint created
- [ ] `STRIPE_WEBHOOK_SECRET` added to Supabase Secrets
- [ ] Health endpoint tested and working
- [ ] Checkout session creation tested
- [ ] Webhook tested with test events

---

## 🔒 Security Notes

⚠️ **IMPORTANT:**
- ✅ Secret keys are stored securely in Supabase (not in code)
- ✅ Publishable key is safe to use in frontend code
- ❌ Never commit secret keys to git
- ❌ Never expose secret keys in client-side code

---

## 🔗 Quick Links

- **Supabase Secrets:** https://supabase.com/dashboard/project/djuvnasyncdqhsrydkse/settings/functions
- **Stripe Dashboard:** https://dashboard.stripe.com
- **Stripe Webhooks:** https://dashboard.stripe.com/webhooks
- **Function Logs:** https://supabase.com/dashboard/project/djuvnasyncdqhsrydkse/functions/make-server-51144976/logs

---

**Status:** Ready to configure! Follow steps 1-4 above. 🚀

