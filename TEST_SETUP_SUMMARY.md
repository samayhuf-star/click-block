# Test Website Setup Summary

## ✅ Sample Website Added

I've added a sample website to your system:

- **Name**: Test Website
- **URL**: https://test-example.com
- **Snippet ID**: `AG-A9T9XVE6`
- **Status**: Inactive (needs verification)

## 🧪 How to Test Tracking

### Option 1: Use the Test HTML Page

I've created a test HTML file: `test-tracking-page.html`

1. **Open the file** in your browser
2. **Open browser console** (F12) to see tracking logs
3. The page will automatically track a page view on load
4. Click buttons to simulate ad clicks
5. Check your dashboard after 30 seconds to see analytics

### Option 2: Test via Dashboard

1. **Visit**: https://click-block-j5lbou9qt-samayhuf-stars-projects.vercel.app
2. **Go to**: Websites page
3. **Find**: "Test Website"
4. **Click**: "View Snippet"
5. **Copy** the snippet code
6. **Create** a simple HTML page with the snippet
7. **Open** the HTML page in browser
8. **Check** console for tracking logs
9. **Wait** 30 seconds
10. **Refresh** dashboard to see analytics

## 📊 Current Websites

You currently have **3 test websites**:

1. **Test Website** - `AG-A9T9XVE6` (https://test-example.com)
2. **Test Analytics Site** - `AG-F2V03XYM` (https://test-analytics.example.com)
3. **Test Analytics Site** - `AG-TGQH40PB` (https://test-analytics.example.com)

## ⚠️ Important Note

The tracking endpoint (`/track-click`) is returning 404, which suggests:

1. **Supabase Edge Function** may need to be deployed
2. The function might need to be activated in Supabase dashboard
3. Check Supabase dashboard → Edge Functions → `make-server-51144976`

## 🔧 Next Steps

1. **Deploy Supabase Function** (if not already deployed):
   - Go to Supabase Dashboard
   - Navigate to Edge Functions
   - Deploy the `make-server-51144976` function

2. **Test Tracking**:
   - Use the test HTML page
   - Or install snippet on a real website
   - Check browser console for logs
   - Verify analytics in dashboard

3. **Check Analytics**:
   - Go to Dashboard → Overview
   - Go to Websites → View Details
   - Go to Analytics page

## 📝 Tracking Snippet

For the "Test Website" (`AG-A9T9XVE6`):

```html
<script>
  (function() {
    var ag = document.createElement('script');
    ag.type = 'text/javascript';
    ag.async = true;
    ag.src = 'https://click-block-j5lbou9qt-samayhuf-stars-projects.vercel.app/tracking.js';
    ag.setAttribute('data-snippet-id', 'AG-A9T9XVE6');
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(ag, s);
  })();
</script>
```

## 🎯 Expected Results

When tracking works correctly, you should see:

- ✅ Console logs: "ClickBlock Tracking Active"
- ✅ Console logs: "Click tracked successfully"
- ✅ Dashboard shows click count increasing
- ✅ Analytics page shows traffic data
- ✅ View Details shows live traffic breakdown

---

**Status**: Sample website added ✅  
**Next**: Deploy Supabase function and test tracking 🚀

