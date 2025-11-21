# 🚀 Deploy Supabase Function NOW

## Project: `djuvnasyncdqhsrydkse`
## Function: `make-server-51144976`

## ⚡ Quick Deploy Steps (5 minutes)

### Step 1: Open Supabase Dashboard
**Click this link**: https://supabase.com/dashboard/project/djuvnasyncdqhsrydkse/functions

### Step 2: Create or Edit Function
- If function exists: Click **"make-server-51144976"** → Click **"Edit"**
- If not exists: Click **"Create a new function"** → Name: `make-server-51144976`

### Step 3: Copy Function Code
**File**: `src/supabase/functions/server/index.tsx` (1004 lines)

**Quick copy**:
1. Open file: `src/supabase/functions/server/index.tsx`
2. Select ALL (Cmd+A / Ctrl+A)
3. Copy (Cmd+C / Ctrl+C)
4. Paste into Supabase editor
5. Click **"Deploy"**

### Step 4: Wait & Verify
- Wait 30-60 seconds for deployment
- Test endpoint (see below)

---

## ✅ Verify Deployment

After deployment, run this test:

```bash
curl -X POST \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqdXZuYXN5bmNkcWhzcnlka3NlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1NjI3MTksImV4cCI6MjA3OTEzODcxOX0.g3NT-tQo88MdeyLbzAXWEol_SN6AmcFMWA94p6X_lmQ" \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqdXZuYXN5bmNkcWhzcnlka3NlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1NjI3MTksImV4cCI6MjA3OTEzODcxOX0.g3NT-tQo88MdeyLbzAXWEol_SN6AmcFMWA94p6X_lmQ" \
  -H "Content-Type: application/json" \
  -d '{"snippetId":"AG-CLICKBLK1","ip":"192.168.1.1","userAgent":"Mozilla/5.0","referrer":"test.com","timestamp":"2024-01-01T00:00:00Z","url":"https://clickblock.co","isAdClick":false}' \
  https://djuvnasyncdqhsrydkse.supabase.co/functions/v1/make-server-51144976/track-click
```

**Expected Response**:
```json
{
  "blocked": false,
  "message": "Click tracked successfully",
  "snippetId": "AG-CLICKBLK1",
  "websiteId": "website:..."
}
```

---

## 📋 Function Details

- **Project ID**: `djuvnasyncdqhsrydkse`
- **Function Name**: `make-server-51144976`
- **File**: `src/supabase/functions/server/index.tsx`
- **Size**: 1004 lines
- **Status**: Ready to deploy ✅

---

## 🎯 Direct Dashboard Link

**Go to**: https://supabase.com/dashboard/project/djuvnasyncdqhsrydkse/functions

**Then**: Copy code from `src/supabase/functions/server/index.tsx` and deploy!

---

**That's it! Once deployed, tracking will work!** 🚀

