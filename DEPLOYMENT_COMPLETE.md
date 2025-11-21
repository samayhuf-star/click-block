# 🚀 Deployment Complete - Next Steps

## ✅ Supabase Edge Function Deployed

**Function:** `make-server-51144976`  
**Project:** `djuvnasyncdqhsrydkse`  
**Base URL:** `https://djuvnasyncdqhsrydkse.supabase.co/functions/v1/make-server-51144976`

### New Endpoints Deployed:
- ✅ `GET /user/settings` - Get user settings
- ✅ `POST /user/settings` - Save user settings
- ✅ `POST /stripe-webhook` - Stripe webhook handler

---

## 🔐 Configure Environment Variables

### Step 1: Configure STRIPE_WEBHOOK_SECRET

1. **Go to Supabase Dashboard:**
   - Visit: https://supabase.com/dashboard/project/djuvnasyncdqhsrydkse/settings/functions

2. **Add Secret:**
   - Click "Secrets" or "Environment Variables"
   - Add new secret:
     - **Name:** `STRIPE_WEBHOOK_SECRET`
     - **Value:** Your Stripe webhook secret (from Stripe Dashboard)

3. **Get Stripe Webhook Secret:**
   - Go to: https://dashboard.stripe.com/webhooks
   - Create a new webhook endpoint:
     - **URL:** `https://djuvnasyncdqhsrydkse.supabase.co/functions/v1/make-server-51144976/stripe-webhook`
     - **Events to send:** Select all subscription and payment events
   - Copy the "Signing secret" (starts with `whsec_`)

4. **Also Configure (if not already set):**
   - `STRIPE_SECRET_KEY` - Your Stripe secret key
   - `SUPABASE_URL` - `https://djuvnasyncdqhsrydkse.supabase.co`
   - `SUPABASE_SERVICE_ROLE_KEY` - From Supabase Dashboard → Settings → API

---

## 🧪 Test Settings Persistence

### Test Script:

```bash
# 1. Sign in to get access token
curl -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqdXZuYXN5bmNkcWhzcnlka3NlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1NjI3MTksImV4cCI6MjA3OTEzODcxOX0.g3NT-tQo88MdeyLbzAXWEol_SN6AmcFMWA94p6X_lmQ" \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqdXZuYXN5bmNkcWhzcnlka3NlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1NjI3MTksImV4cCI6MjA3OTEzODcxOX0.g3NT-tQo88MdeyLbzAXWEol_SN6AmcFMWA94p6X_lmQ" \
  -d '{"email":"test@example.com","password":"password123"}' \
  https://djuvnasyncdqhsrydkse.supabase.co/functions/v1/make-server-51144976/signin

# 2. Save settings (use access token from step 1)
curl -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqdXZuYXN5bmNkcWhzcnlka3NlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1NjI3MTksImV4cCI6MjA3OTEzODcxOX0.g3NT-tQo88MdeyLbzAXWEol_SN6AmcFMWA94p6X_lmQ" \
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
  https://djuvnasyncdqhsrydkse.supabase.co/functions/v1/make-server-51144976/user/settings

# 3. Get settings (use access token from step 1)
curl -X GET \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqdXZuYXN5bmNkcWhzcnlka3NlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1NjI3MTksImV4cCI6MjA3OTEzODcxOX0.g3NT-tQo88MdeyLbzAXWEol_SN6AmcFMWA94p6X_lmQ" \
  https://djuvnasyncdqhsrydkse.supabase.co/functions/v1/make-server-51144976/user/settings
```

### Test in Production UI:

1. **Go to Production Site:**
   - Visit your Vercel deployment URL
   - Sign in with your account

2. **Navigate to Settings:**
   - Click "Settings" in the dashboard
   - Modify some settings (e.g., change notification preferences)
   - Click "Save Changes"

3. **Verify Persistence:**
   - Refresh the page
   - Settings should persist

---

## 🧪 Test Stripe Webhook

### Step 1: Configure Webhook in Stripe Dashboard

1. **Go to Stripe Dashboard:**
   - Visit: https://dashboard.stripe.com/webhooks

2. **Create Webhook Endpoint:**
   - Click "Add endpoint"
   - **Endpoint URL:** `https://djuvnasyncdqhsrydkse.supabase.co/functions/v1/make-server-51144976/stripe-webhook`
   - **Events to send:**
     - `checkout.session.completed`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`

3. **Copy Webhook Secret:**
   - After creating, copy the "Signing secret" (starts with `whsec_`)
   - Add it to Supabase as `STRIPE_WEBHOOK_SECRET`

### Step 2: Test Webhook with Stripe CLI (Recommended)

```bash
# Install Stripe CLI (if not installed)
# macOS: brew install stripe/stripe-cli/stripe
# Linux: See https://stripe.com/docs/stripe-cli

# Login to Stripe
stripe login

# Forward webhooks to your endpoint
stripe listen --forward-to https://djuvnasyncdqhsrydkse.supabase.co/functions/v1/make-server-51144976/stripe-webhook

# In another terminal, trigger a test event
stripe trigger checkout.session.completed
```

### Step 3: Test Webhook Manually

```bash
# Use Stripe CLI to send a test event
stripe events resend evt_test_webhook --webhook-endpoint we_xxx
```

### Step 4: Monitor Webhook Logs

1. **Check Supabase Function Logs:**
   - Go to: https://supabase.com/dashboard/project/djuvnasyncdqhsrydkse/functions/make-server-51144976/logs
   - Look for webhook events and any errors

2. **Check Stripe Dashboard:**
   - Go to: https://dashboard.stripe.com/webhooks
   - Click on your webhook endpoint
   - View "Recent events" to see delivery status

---

## 📊 Optional: Integrate Sentry for Error Tracking

### Step 1: Create Sentry Project

1. **Sign up/Login:** https://sentry.io/signup/
2. **Create Project:** Select "React" or "JavaScript"
3. **Copy DSN:** You'll get a DSN like `https://xxx@xxx.ingest.sentry.io/xxx`

### Step 2: Install Sentry

```bash
npm install @sentry/react @sentry/tracing
```

### Step 3: Configure Sentry

Add to `src/main.tsx`:

```typescript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN_HERE",
  integrations: [
    new Sentry.BrowserTracing(),
  ],
  tracesSampleRate: 1.0, // Adjust in production
  environment: process.env.NODE_ENV,
});
```

### Step 4: Update ErrorBoundary

Update `src/components/ErrorBoundary.tsx` to send errors to Sentry:

```typescript
public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
  console.error('ErrorBoundary caught an error:', error, errorInfo);
  Sentry.captureException(error, { contexts: { react: errorInfo } });
}
```

### Step 5: Add Environment Variable

In Vercel Dashboard:
- Add `NEXT_PUBLIC_SENTRY_DSN` = Your Sentry DSN

---

## ✅ Verification Checklist

- [ ] Supabase Edge Function deployed successfully
- [ ] `STRIPE_WEBHOOK_SECRET` configured in Supabase
- [ ] `STRIPE_SECRET_KEY` configured in Supabase
- [ ] Settings persistence tested and working
- [ ] Stripe webhook endpoint created in Stripe Dashboard
- [ ] Webhook secret added to Supabase
- [ ] Webhook tested with test events
- [ ] (Optional) Sentry integrated and tested

---

## 🔗 Useful Links

- **Supabase Dashboard:** https://supabase.com/dashboard/project/djuvnasyncdqhsrydkse
- **Stripe Dashboard:** https://dashboard.stripe.com
- **Function Logs:** https://supabase.com/dashboard/project/djuvnasyncdqhsrydkse/functions/make-server-51144976/logs
- **Stripe Webhooks:** https://dashboard.stripe.com/webhooks

---

**Status:** Ready for production testing! 🎉
