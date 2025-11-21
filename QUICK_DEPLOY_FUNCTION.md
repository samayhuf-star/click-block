# 🚀 Quick Deploy Supabase Function

## Project: `djuvnasyncdqhsrydkse`
## Function: `make-server-51144976`

## ⚡ Fastest Method: Supabase Dashboard

### Step 1: Open Dashboard
**Go to**: https://supabase.com/dashboard/project/djuvnasyncdqhsrydkse/functions

### Step 2: Create/Edit Function
- Click **"Create a new function"** OR
- Find **`make-server-51144976`** and click **"Edit"**

### Step 3: Copy Function Code
**File to copy**: `src/supabase/functions/server/index.tsx`

**Total lines**: ~1005 lines

**What to do**:
1. Open the file: `src/supabase/functions/server/index.tsx`
2. Select ALL code (Cmd+A / Ctrl+A)
3. Copy (Cmd+C / Ctrl+C)
4. Paste into Supabase function editor
5. Click **"Deploy"**

### Step 4: Wait for Deployment
- Deployment usually takes 30-60 seconds
- You'll see "Deployed successfully" message

### Step 5: Verify
After deployment, test:
```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqdXZuYXN5bmNkcWhzcnlka3NlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1NjI3MTksImV4cCI6MjA3OTEzODcxOX0.g3NT-tQo88MdeyLbzAXWEol_SN6AmcFMWA94p6X_lmQ" \
     -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqdXZuYXN5bmNkcWhzcnlka3NlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1NjI3MTksImV4cCI6MjA3OTEzODcxOX0.g3NT-tQo88MdeyLbzAXWEol_SN6AmcFMWA94p6X_lmQ" \
     https://djuvnasyncdqhsrydkse.supabase.co/functions/v1/make-server-51144976/track-click \
     -X POST \
     -H "Content-Type: application/json" \
     -d '{"snippetId":"AG-CLICKBLK1","ip":"192.168.1.1","userAgent":"Mozilla/5.0","referrer":"test.com","timestamp":"2024-01-01T00:00:00Z","url":"https://clickblock.co","isAdClick":false}'
```

Expected: `{"blocked":false,"message":"Click tracked successfully",...}`

---

## 📋 Function File Location

**Source**: `src/supabase/functions/server/index.tsx`  
**Size**: ~1005 lines  
**Ready to deploy**: ✅

---

**Go to**: https://supabase.com/dashboard/project/djuvnasyncdqhsrydkse/functions

