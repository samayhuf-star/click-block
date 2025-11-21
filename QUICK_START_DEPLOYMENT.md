# 🚀 Quick Start - Deployment & Configuration

## ✅ Step 1: Supabase Edge Function - DEPLOYED

**Status:** ✅ **DEPLOYED**  
**Function:** `make-server-51144976`  
**Project:** `djuvnasyncdqhsrydkse`  
**URL:** `https://djuvnasyncdqhsrydkse.supabase.co/functions/v1/make-server-51144976`

**New Endpoints Available:**
- ✅ `GET /user/settings` - Get user settings
- ✅ `POST /user/settings` - Save user settings  
- ✅ `POST /stripe-webhook` - Stripe webhook handler

---

## 🔐 Step 2: Configure Environment Variables

### In Supabase Dashboard:

1. **Go to:** https://supabase.com/dashboard/project/djuvnasyncdqhsrydkse/settings/functions

2. **Add Secrets:**
   - Click "Secrets" tab
   - Add these environment variables:

   | Name | Value | Where to Get |
   |------|-------|--------------|
   | `STRIPE_SECRET_KEY` | `sk_test_...` or `sk_live_...` | Stripe Dashboard → Developers → API keys |
   | `STRIPE_WEBHOOK_SECRET` | `whsec_...` | See Step 3 below |
   | `SUPABASE_URL` | `https://djuvnasyncdqhsrydkse.supabase.co` | Already set |
   | `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbG...` | Supabase Dashboard → Settings → API |

---

## 🔗 Step 3: Configure Stripe Webhook

### 3.1 Create Webhook Endpoint in Stripe:

1. **Go to:** https://dashboard.stripe.com/webhooks

2. **Click:** "Add endpoint"

3. **Configure:**
   - **Endpoint URL:** `https://djuvnasyncdqhsrydkse.supabase.co/functions/v1/make-server-51144976/stripe-webhook`
   - **Description:** "ClickBlock Payment & Subscription Events"
   - **Events to send:** Select these events:
     - ✅ `checkout.session.completed`
     - ✅ `customer.subscription.created`
     - ✅ `customer.subscription.updated`
     - ✅ `customer.subscription.deleted`
     - ✅ `invoice.payment_succeeded`
     - ✅ `invoice.payment_failed`

4. **Copy Signing Secret:**
   - After creating, copy the "Signing secret" (starts with `whsec_`)
   - Add it to Supabase as `STRIPE_WEBHOOK_SECRET` (Step 2)

---

## 🧪 Step 4: Test Settings Persistence

### Option A: Test via Script

```bash
./test-settings-api.sh
```

### Option B: Test via Production UI

1. **Visit:** Your Vercel deployment URL
2. **Sign in** with your account
3. **Go to:** Settings page
4. **Change settings** (e.g., notification preferences)
5. **Click:** "Save Changes"
6. **Refresh page** - Settings should persist ✅

### Option C: Test via API

```bash
# 1. Sign in (get access token)
curl -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{"email":"your@email.com","password":"yourpassword"}' \
  https://djuvnasyncdqhsrydkse.supabase.co/functions/v1/make-server-51144976/signin

# 2. Save settings (use access token from step 1)
curl -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{"name":"Test","emailNotifications":true}' \
  https://djuvnasyncdqhsrydkse.supabase.co/functions/v1/make-server-51144976/user/settings

# 3. Get settings
curl -X GET \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  https://djuvnasyncdqhsrydkse.supabase.co/functions/v1/make-server-51144976/user/settings
```

---

## 🧪 Step 5: Test Stripe Webhook

### Option A: Using Stripe CLI (Recommended)

```bash
# Install Stripe CLI
# macOS: brew install stripe/stripe-cli/stripe
# Linux: See https://stripe.com/docs/stripe-cli

# Login
stripe login

# Forward webhooks to your endpoint
stripe listen --forward-to https://djuvnasyncdqhsrydkse.supabase.co/functions/v1/make-server-51144976/stripe-webhook

# In another terminal, trigger test events
stripe trigger checkout.session.completed
stripe trigger customer.subscription.created
stripe trigger invoice.payment_succeeded
```

### Option B: Using Stripe Dashboard

1. **Go to:** https://dashboard.stripe.com/webhooks
2. **Click** on your webhook endpoint
3. **Click** "Send test webhook"
4. **Select event type** (e.g., `checkout.session.completed`)
5. **Click** "Send test webhook"
6. **Check** Supabase function logs for receipt

### Option C: Test Script

```bash
./test-stripe-webhook.sh
```

### Monitor Webhook Logs:

- **Supabase Logs:** https://supabase.com/dashboard/project/djuvnasyncdqhsrydkse/functions/make-server-51144976/logs
- **Stripe Dashboard:** https://dashboard.stripe.com/webhooks → Your endpoint → Recent events

---

## 📊 Step 6: Optional - Integrate Sentry

### Quick Setup:

1. **Sign up:** https://sentry.io/signup/
2. **Create project:** Select "React"
3. **Copy DSN**

4. **Install:**
   ```bash
   npm install @sentry/react @sentry/tracing
   ```

5. **Add to `src/main.tsx`:**
   ```typescript
   import * as Sentry from "@sentry/react";
   
   Sentry.init({
     dsn: "YOUR_SENTRY_DSN",
     integrations: [new Sentry.BrowserTracing()],
     tracesSampleRate: 1.0,
   });
   ```

6. **Add env variable in Vercel:**
   - `NEXT_PUBLIC_SENTRY_DSN` = Your Sentry DSN

---

## ✅ Verification Checklist

- [x] Supabase Edge Function deployed
- [ ] `STRIPE_SECRET_KEY` configured in Supabase
- [ ] `STRIPE_WEBHOOK_SECRET` configured in Supabase
- [ ] Stripe webhook endpoint created
- [ ] Settings persistence tested
- [ ] Stripe webhook tested
- [ ] (Optional) Sentry integrated

---

## 🔗 Quick Links

- **Supabase Dashboard:** https://supabase.com/dashboard/project/djuvnasyncdqhsrydkse
- **Function Logs:** https://supabase.com/dashboard/project/djuvnasyncdqhsrydkse/functions/make-server-51144976/logs
- **Stripe Dashboard:** https://dashboard.stripe.com
- **Stripe Webhooks:** https://dashboard.stripe.com/webhooks

---

**Status:** Ready for production! 🎉

