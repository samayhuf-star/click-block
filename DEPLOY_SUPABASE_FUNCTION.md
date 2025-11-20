# Deploy Supabase Edge Function

## Function Name: `make-server-51144976`

## Quick Deploy Steps

### Option 1: Using Supabase CLI (Recommended)

1. **Install Supabase CLI** (if not already installed):
   ```bash
   npm install -g supabase
   ```

2. **Login to Supabase**:
   ```bash
   supabase login
   ```
   (This will open a browser for authentication)

3. **Link to your project**:
   ```bash
   supabase link --project-ref lwyzoynbpuytmtcrjbga
   ```

4. **Deploy the function**:
   ```bash
   supabase functions deploy make-server-51144976
   ```

### Option 2: Using Supabase Dashboard

1. **Go to Supabase Dashboard**:
   - Visit: https://supabase.com/dashboard/project/lwyzoynbpuytmtcrjbga
   - Navigate to: Edge Functions

2. **Create/Update Function**:
   - Click "Create Function" or select existing `make-server-51144976`
   - Copy the contents of `src/supabase/functions/server/index.tsx`
   - Paste into the function editor
   - Click "Deploy"

3. **Verify Deployment**:
   - Check function logs
   - Test endpoint: `https://lwyzoynbpuytmtcrjbga.supabase.co/functions/v1/make-server-51144976/health`

## Function Structure

The function is located at:
- **Source**: `src/supabase/functions/server/index.tsx`
- **Deploy Location**: `supabase/functions/make-server-51144976/index.tsx`

## Dependencies

The function uses:
- `npm:hono` - Web framework
- `npm:hono/cors` - CORS middleware
- `npm:hono/logger` - Logging middleware
- `jsr:@supabase/supabase-js@2` - Supabase client

## Endpoints Available

- `GET /health` - Health check
- `GET /websites` - List all websites
- `POST /websites` - Create website
- `DELETE /websites/:id` - Delete website
- `POST /track-click` - Track click/page view
- `GET /analytics/:id` - Get website analytics
- `GET /analytics` - Get all analytics
- `GET /overview` - Get dashboard overview
- `POST /signup` - User registration
- `POST /signin` - User authentication

## Verify Deployment

After deployment, test the health endpoint:

```bash
curl -H "Authorization: Bearer YOUR_ANON_KEY" \
     -H "apikey: YOUR_ANON_KEY" \
     https://lwyzoynbpuytmtcrjbga.supabase.co/functions/v1/make-server-51144976/health
```

Expected response: `{"status":"ok"}`

## Troubleshooting

### Function Not Found (404)
- Ensure function name matches exactly: `make-server-51144976`
- Check function is deployed in Supabase dashboard
- Verify project ID is correct

### CORS Errors
- Function already has CORS enabled for all origins
- Check browser console for specific CORS errors

### Authentication Errors
- Verify anon key is correct
- Check headers are being sent correctly

## Project Information

- **Project ID**: `lwyzoynbpuytmtcrjbga`
- **Function Name**: `make-server-51144976`
- **Function URL**: `https://lwyzoynbpuytmtcrjbga.supabase.co/functions/v1/make-server-51144976`

