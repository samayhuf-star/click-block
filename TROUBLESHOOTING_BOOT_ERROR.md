# 🔧 Troubleshooting BOOT_ERROR

## Issue

The function is returning `BOOT_ERROR` - "Function failed to start (please check logs)"

## Common Causes & Solutions

### 1. Missing Environment Variables

**Check:** https://supabase.com/dashboard/project/djuvnasyncdqhsrydkse/settings/functions

**Required Variables:**
- `STRIPE_SECRET_KEY` - Your Stripe secret key
- `STRIPE_WEBHOOK_SECRET` - Your Stripe webhook signing secret (can be empty initially)
- `SUPABASE_URL` - Should be auto-set, but verify: `https://djuvnasyncdqhsrydkse.supabase.co`
- `SUPABASE_SERVICE_ROLE_KEY` - From Settings → API → service_role key

**Action:**
1. Go to Supabase Dashboard → Functions → Secrets
2. Add missing environment variables
3. Redeploy function or wait a few minutes for auto-reload

---

### 2. Check Function Logs

**View Logs:**
https://supabase.com/dashboard/project/djuvnasyncdqhsrydkse/functions/make-server-51144976/logs

**Look for:**
- Import errors
- Missing dependencies
- Environment variable errors
- Syntax errors

---

### 3. Verify Function Code

**Check if function code is correct:**

1. Go to: https://supabase.com/dashboard/project/djuvnasyncdqhsrydkse/functions/make-server-51144976
2. Click "Edit" to view the code
3. Check for syntax errors
4. Verify all imports are correct

---

### 4. Redeploy Function

If environment variables are set but function still fails:

```bash
# From your local machine
cd "/Users/samay/Downloads/Igiuh Clickfrau Duhuh (2)"
supabase functions deploy make-server-51144976 --no-verify-jwt
```

Or redeploy via Supabase Dashboard:
1. Go to Functions → make-server-51144976
2. Click "Redeploy" or "Deploy"

---

### 5. Check Dependencies

The function uses these dependencies (should be auto-installed):
- `npm:hono`
- `npm:hono/cors`
- `npm:hono/logger`
- `npm:stripe`
- `jsr:@supabase/supabase-js@2`

If there are import errors, check the function logs.

---

## Quick Fix Checklist

- [ ] Check Supabase Dashboard → Functions → Logs for error details
- [ ] Verify `STRIPE_SECRET_KEY` is set (can use test key: `sk_test_...`)
- [ ] Verify `SUPABASE_SERVICE_ROLE_KEY` is set
- [ ] Set `STRIPE_WEBHOOK_SECRET` (can be empty string initially: `""`)
- [ ] Redeploy function after adding environment variables
- [ ] Wait 1-2 minutes after deployment for function to start

---

## Test After Fix

Once environment variables are set:

```bash
./test-all-endpoints.sh
```

Or manually:

```bash
curl -H "Authorization: Bearer YOUR_ANON_KEY" \
     -H "apikey: YOUR_ANON_KEY" \
     https://djuvnasyncdqhsrydkse.supabase.co/functions/v1/make-server-51144976/health
```

**Expected:** `{"status":"ok"}`

---

## Still Not Working?

1. **Check Logs:** https://supabase.com/dashboard/project/djuvnasyncdqhsrydkse/functions/make-server-51144976/logs
2. **Copy error message** from logs
3. **Check:** Are all environment variables set correctly?
4. **Try:** Redeploy function manually

---

**Most Common Issue:** Missing `STRIPE_SECRET_KEY` - Even if you're not using Stripe yet, the function needs this variable to start (it can be a test key).

