# 🚀 Deploy Supabase Edge Function: make-server-51144976

## Current Status

The function code is ready at: `src/supabase/functions/server/index.tsx`

## ⚠️ Important: Two Deployment Options

### Option 1: Deploy via Supabase Dashboard (Easiest - No CLI needed)

1. **Go to Supabase Dashboard**:
   - Visit: https://supabase.com/dashboard/project/lwyzoynbpuytmtcrjbga/functions
   - Or: https://supabase.com/dashboard → Select your project → Edge Functions

2. **Create/Edit Function**:
   - Click "Create a new function" OR
   - Find existing function `make-server-51144976` and click "Edit"

3. **Copy Function Code**:
   - Open: `src/supabase/functions/server/index.tsx`
   - Copy ALL the code
   - Paste into the Supabase function editor

4. **Copy Dependencies**:
   - Also copy these files to the function (if Supabase allows multiple files):
     - `kv_store.tsx`
     - `stripe.tsx`
     - `diagnostics.tsx`
     - `fix_domains.tsx`
     - `url_helper.tsx`
     - `system-health.tsx`
   - OR combine them all into `index.tsx` if single file only

5. **Deploy**:
   - Click "Deploy" button
   - Wait for deployment to complete

6. **Verify**:
   ```bash
   curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3eXpveW5icHV5dG10Y3JqYmdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyMTYzMTIsImV4cCI6MjA3ODc5MjMxMn0.UHURs_eM-ZpxAZ3ADCm4BVoigW_3MjSwYkX2-Xa3MEo" \
        -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3eXpveW5icHV5dG10Y3JqYmdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyMTYzMTIsImV4cCI6MjA3ODc5MjMxMn0.UHURs_eM-ZpxAZ3ADCm4BVoigW_3MjSwYkX2-Xa3MEo" \
        https://lwyzoynbpuytmtcrjbga.supabase.co/functions/v1/make-server-51144976/health
   ```
   Expected: `{"status":"ok"}`

---

### Option 2: Deploy via Supabase CLI

1. **Install Supabase CLI**:
   ```bash
   # macOS/Linux
   brew install supabase/tap/supabase
   
   # OR using npm
   npm install -g supabase
   
   # OR using direct download
   # Visit: https://github.com/supabase/cli/releases
   ```

2. **Login**:
   ```bash
   supabase login
   ```
   (Opens browser for authentication)

3. **Link Project**:
   ```bash
   supabase link --project-ref lwyzoynbpuytmtcrjbga
   ```

4. **Deploy Function**:
   ```bash
   cd "/Users/samay/Downloads/Igiuh Clickfrau Duhuh (2)"
   supabase functions deploy make-server-51144976 --no-verify-jwt
   ```

5. **Verify**:
   ```bash
   curl -H "Authorization: Bearer YOUR_ANON_KEY" \
        -H "apikey: YOUR_ANON_KEY" \
        https://lwyzoynbpuytmtcrjbga.supabase.co/functions/v1/make-server-51144976/health
   ```

---

## 📁 Function Structure

The function has been prepared at:
- `supabase/functions/make-server-51144976/index.tsx` ✅

All dependencies are copied to the function directory.

## 🔍 Function Endpoints

Once deployed, these endpoints will be available:

- `GET /health` - Health check
- `GET /websites` - List websites
- `POST /websites` - Create website
- `DELETE /websites/:id` - Delete website
- `POST /track-click` - Track clicks ⭐ (This is what we need!)
- `GET /analytics/:id` - Get website analytics
- `GET /analytics` - Get all analytics
- `GET /overview` - Dashboard overview
- `POST /signup` - User registration
- `POST /signin` - User authentication

## ⚡ Quick Test After Deployment

```bash
# Test health endpoint
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3eXpveW5icHV5dG10Y3JqYmdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyMTYzMTIsImV4cCI6MjA3ODc5MjMxMn0.UHURs_eM-ZpxAZ3ADCm4BVoigW_3MjSwYkX2-Xa3MEo" \
     -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3eXpveW5icHV5dG10Y3JqYmdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyMTYzMTIsImV4cCI6MjA3ODc5MjMxMn0.UHURs_eM-ZpxAZ3ADCm4BVoigW_3MjSwYkX2-Xa3MEo" \
     https://lwyzoynbpuytmtcrjbga.supabase.co/functions/v1/make-server-51144976/health

# Test track-click endpoint
curl -X POST \
     -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3eXpveW5icHV5dG10Y3JqYmdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyMTYzMTIsImV4cCI6MjA3ODc5MjMxMn0.UHURs_eM-ZpxAZ3ADCm4BVoigW_3MjSwYkX2-Xa3MEo" \
     -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3eXpveW5icHV5dG10Y3JqYmdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyMTYzMTIsImV4cCI6MjA3ODc5MjMxMn0.UHURs_eM-ZpxAZ3ADCm4BVoigW_3MjSwYkX2-Xa3MEo" \
     -H "Content-Type: application/json" \
     -d '{"snippetId":"AG-A9T9XVE6","ip":"192.168.1.1","userAgent":"Mozilla/5.0","referrer":"test.com","timestamp":"2024-01-01T00:00:00Z","url":"https://test-example.com","isAdClick":false}' \
     https://lwyzoynbpuytmtcrjbga.supabase.co/functions/v1/make-server-51144976/track-click
```

## 📝 Project Information

- **Project ID**: `lwyzoynbpuytmtcrjbga`
- **Function Name**: `make-server-51144976`
- **Function URL**: `https://lwyzoynbpuytmtcrjbga.supabase.co/functions/v1/make-server-51144976`
- **Anon Key**: (See tracking.js or info.tsx)

## ✅ After Deployment

Once deployed successfully:

1. ✅ Tracking endpoint will work (`/track-click`)
2. ✅ Analytics will start recording
3. ✅ Dashboard will show real data
4. ✅ Test website clicks will be tracked

---

**Recommended**: Use **Option 1 (Dashboard)** - it's the easiest and doesn't require CLI installation!

