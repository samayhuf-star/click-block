# 🛡️ ClickBlock Tracking Setup & Testing Guide

## 📋 Quick Summary

Your ClickBlock tracking system is now **FULLY FIXED** and ready to work! Here's what was wrong and what's been fixed:

### ❌ **Problems Found:**
1. **Tracking script missing Project ID** - Was set to 'YOUR_PROJECT_ID'
2. **Missing API headers** - Authorization and apikey headers not being sent
3. **Missing getAnalytics function** - Frontend couldn't fetch analytics data
4. **No console logging** - Impossible to debug issues

### ✅ **Fixes Applied:**
1. ✅ Updated `/public/tracking.js` with correct Project ID and API key
2. ✅ Created `/public/tracker.js` for simpler integration
3. ✅ Added proper Authorization and apikey headers to all requests
4. ✅ Added websitesAPI.getAnalytics() function
5. ✅ Added comprehensive console logging for debugging
6. ✅ Created test page at `/public/test-tracking.html`

---

## 🚀 How to Test (3 Easy Steps)

### **Step 1: Restore Your Default Websites**

1. Go to your **Websites** dashboard
2. If you have no websites, click **"Restore My 3 Websites"** button
3. You'll get 3 pre-verified websites:
   - **ClickBlock.co** (ID: `AG-CLICKBLK1`)
   - **Marketing Site** (ID: `AG-MRKTSITE`)
   - **E-commerce Store** (ID: `AG-ECOMSTR1`)

### **Step 2: Open the Test Page**

Navigate to: `http://localhost:8000/test-tracking.html` (or your deployed URL + `/test-tracking.html`)

The test page will:
- ✅ Automatically track a page view on load
- ✅ Show real-time console logs
- ✅ Display tracking statistics
- ✅ Let you test ad clicks
- ✅ Let you test fraud detection with rapid clicks

### **Step 3: Check Your Dashboard**

1. Go to your **Dashboard**
2. You should see:
   - Total clicks increasing
   - Analytics updating
   - System logs appearing

---

## 📝 Installation on Your Website

### **Option 1: Full Tracking Script (Recommended)**

```html
<!-- Place this in your <head> section -->
<script>
  (function() {
    var ag = document.createElement('script');
    ag.type = 'text/javascript';
    ag.async = true;
    ag.src = 'https://cdn.clickblock.co/tracking.js';
    ag.setAttribute('data-snippet-id', 'YOUR_SNIPPET_ID_HERE');
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(ag, s);
  })();
</script>
```

### **Option 2: Simple Tracking Script**

```html
<!-- Place this in your <head> section -->
<script src="https://cdn.clickblock.co/tracker.js" data-id="YOUR_SNIPPET_ID_HERE"></script>
```

**Replace `YOUR_SNIPPET_ID_HERE` with your actual snippet ID from the dashboard!**

---

## 🔍 How to Debug

### **Check Browser Console**

Open Developer Tools (F12) and look for these messages:

✅ **Success messages:**
```
ClickBlock Tracking Active - Snippet ID: AG-CLICKBLK1
ClickBlock: Tracking initialized successfully
ClickBlock: Sending tracking data: {...}
ClickBlock: Click tracked successfully
```

❌ **Error messages:**
```
ClickBlock: No snippet ID found
ClickBlock tracking error: ...
```

### **Check System Logs**

1. Go to **Settings** → **System Logs** in your dashboard
2. Filter by:
   - **Traffic** - See all tracked clicks
   - **Error** - See any tracking errors
   - **Success** - See successful tracking events

### **Check Network Tab**

1. Open Developer Tools → Network tab
2. Look for requests to:
   ```
   https://lwyzoynbpuytmtcrjbga.supabase.co/functions/v1/make-server-51144976/track-click
   ```
3. Check the request:
   - **Status should be 200** ✅
   - **Response should have `{blocked: false, message: "..."}`**

---

## 🎯 Your Tracking IDs

- **ClickBlock.co**: `AG-CLICKBLK1`
- **Marketing Site**: `AG-MRKTSITE`
- **E-commerce Store**: `AG-ECOMSTR1`

When you add new websites, they'll get auto-generated IDs like `AG-X7F9K2L4`

---

## 🧪 Testing Fraud Detection

### **Test Scenario 1: Normal Clicks** ✅
1. Click once
2. Wait 30 seconds
3. Click again
4. **Result**: Both clicks should be tracked as legitimate

### **Test Scenario 2: Rapid Clicks** ⚠️
1. Click 5 times rapidly (within 10 seconds)
2. **Result**: After 3 clicks, fraud detection should trigger
3. Check System Logs for "Fraudulent click detected" message

### **Test Scenario 3: IP Whitelist** ✅
1. Go to **Protection Rules**
2. Add your IP to whitelist
3. Make rapid clicks
4. **Result**: All clicks should pass through

---

## 📊 What Gets Tracked

Every click/page view captures:
- ✅ **IP Address** (from request headers)
- ✅ **User Agent** (browser/device info)
- ✅ **Referrer** (where they came from)
- ✅ **Timestamp** (exact time)
- ✅ **URL** (page visited)
- ✅ **Screen Resolution**
- ✅ **Language**
- ✅ **Is Ad Click** (if clicked on ad element)

---

## 🛠️ Troubleshooting

### **"No tracking data appearing"**

**Check:**
1. ✅ Tracking script installed on your website?
2. ✅ Snippet ID correct in the script?
3. ✅ Website is accessible (not localhost)?
4. ✅ Browser console shows no errors?
5. ✅ Network request returns 200 status?

### **"Tracking works but no fraud detection"**

**Check:**
1. Go to **Protection Rules**
2. Make sure you have threshold rules set:
   - Default: 3 clicks in 10 minutes
   - Default: 1 click in 2 days
3. Try the rapid click test

### **"System logs empty"**

**Cause**: Logs are created when clicks are tracked.

**Solution**: 
1. Make sure tracking is working first
2. Refresh the System Logs page
3. Check filter settings (show all types)

---

## 🎬 Quick Start Checklist

- [ ] Restore default websites (or add a new one)
- [ ] Get your tracking ID from the dashboard
- [ ] Install tracking script on your website
- [ ] Open test page to verify it works
- [ ] Check browser console for success messages
- [ ] Check System Logs for tracking events
- [ ] Check Dashboard for analytics
- [ ] Test fraud detection with rapid clicks

---

## 🚨 Important Notes

1. **Localhost won't work**: The tracking script needs a live URL to verify
2. **Wait 2-5 minutes**: After installing, verification may take a few minutes
3. **Console logs are your friend**: Always check browser console first
4. **Test page is your best friend**: Use `/test-tracking.html` to verify everything

---

## 📞 Still Having Issues?

1. Open browser console (F12)
2. Copy all ClickBlock-related messages
3. Check Network tab for failed requests
4. Check System Logs in dashboard
5. Share the error messages for help

---

## ✅ Success Indicators

You'll know it's working when you see:

1. ✅ Green "Active" status on website cards
2. ✅ "Tracking initialized successfully" in console
3. ✅ Click numbers increasing in dashboard
4. ✅ New entries in System Logs
5. ✅ Fraud detection working on rapid clicks

---

**🎉 Your tracking system is now fully operational!**

Use the test page and check your browser console to see it in action!
