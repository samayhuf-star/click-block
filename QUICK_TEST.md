# Quick Production Test Guide

## 🚀 Production URL
**https://click-block-hkqw8xj8m-samayhuf-stars-projects.vercel.app**

## ✅ Verified Status

### API Health Check
- ✅ Backend API: **Healthy** (`{"status":"ok"}`)
- ✅ Tracking Endpoint: **Available**
- ✅ Build: **Successful** (19s)

### Deployment Info
- **Status**: Ready
- **Build Time**: 19 seconds  
- **Environment**: Production
- **Deployment ID**: `HyCqueLqCoBKcz1UNqHSthss5TCh`

## 🧪 Quick Test Steps

### 1. Test Site Access (30 seconds)
1. Visit: https://click-block-hkqw8xj8m-samayhuf-stars-projects.vercel.app
2. Check: Page loads without errors
3. Open Console (F12): Check for errors
4. Expected: ✅ Site loads, no critical errors

### 2. Test Authentication (1 minute)
1. Click "Sign Up"
2. Enter: Name, Email, Password (8+ chars)
3. Expected: ✅ Account created, redirected to dashboard

### 3. Test Tracking Script (2 minutes)
1. Go to **Websites** page
2. Click **"Add Website"**
3. Enter: Name: "Test Site", URL: "https://example.com"
4. Click **"View Snippet"**
5. Copy the snippet code
6. Create test HTML file:
   ```html
   <!DOCTYPE html>
   <html>
   <head>
     <title>Test</title>
     <!-- Paste snippet here, replace YOUR_SNIPPET_ID -->
   </head>
   <body><h1>Test Page</h1></body>
   </html>
   ```
7. Open test HTML in browser
8. Check Console (F12): Should see "ClickBlock Tracking Active"
9. Wait 30 seconds
10. Go back to dashboard, click **"Refresh"**
11. Expected: ✅ Total Clicks increased

### 4. Test Analytics (1 minute)
1. Go to **Analytics** page
2. Expected: ✅ Shows data or empty state message
3. Go to **Overview** page
4. Expected: ✅ Stats cards show real data

### 5. Test View Details (30 seconds)
1. Go to **Websites** page
2. Click **"View Details"** on any website
3. Expected: ✅ Live traffic dashboard opens
4. Check: Traffic breakdown cards visible
5. Check: Recent traffic table visible

## 🔍 Browser Console Test

Open browser console on production site and run:

```javascript
// Quick health check
Promise.all([
  fetch('/tracking.js').then(r => r.ok ? '✅ Tracking script accessible' : '❌ Tracking script not found'),
  fetch('https://lwyzoynbpuytmtcrjbga.supabase.co/functions/v1/make-server-51144976/health', {
    headers: {
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3eXpveW5icHV5dG10Y3JqYmdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyMTYzMTIsImV4cCI6MjA3ODc5MjMxMn0.UHURs_eM-ZpxAZ3ADCm4BVoigW_3MjSwYkX2-Xa3MEo',
      'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3eXpveW5icHV5dG10Y3JqYmdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyMTYzMTIsImV4cCI6MjA3ODc5MjMxMn0.UHURs_eM-ZpxAZ3ADCm4BVoigW_3MjSwYkX2-Xa3MEo'
    }
  }).then(r => r.json()).then(d => d.status === 'ok' ? '✅ API healthy' : '❌ API unhealthy')
]).then(results => console.log(results.join('\n')));
```

## 📊 Expected Results

### ✅ Success Indicators:
- Production site loads ✅
- Tracking script accessible ✅  
- API responds correctly ✅
- Dashboard features work ✅
- Analytics display correctly ✅

### ⚠️ If Issues Found:

1. **Tracking script 404**
   - Check: `build/tracking.js` exists
   - Fix: Vite should copy from `src/public/`
   - Verify: File is in build output

2. **Analytics showing zero**
   - Normal if no clicks tracked yet
   - Install snippet and test
   - Wait 30 seconds, refresh dashboard

3. **API errors**
   - Check: Browser console for errors
   - Check: Vercel function logs
   - Verify: API keys are correct

## 🎯 Testing Summary

**Total Test Time**: ~5 minutes

1. ✅ Site Access (30s)
2. ✅ Authentication (1m)
3. ✅ Tracking Script (2m)
4. ✅ Analytics Display (1m)
5. ✅ View Details (30s)

**Status**: Production site is ready for testing! 🚀

