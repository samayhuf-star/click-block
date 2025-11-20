# Website Verification Fixes

## Issue
User reported that clicking "Verify" did not show any message or appear to do anything, even after adding the code.

## Diagnosis
1. **Silent Failures:** The client-side API wrapper was swallowing server error messages (like 400 Bad Request) and throwing a generic error, or not handling the error structure correctly.
2. **URL Protocol:** The backend `fetch` might fail if the user-provided URL didn't include `http://` or `https://`.
3. **Timeout:** 10 seconds might be too short for some websites.

## Fixes Applied

### 1. Backend (`/supabase/functions/server/index.tsx`)
- **URL Normalization:** Automatically prepends `https://` if the URL lacks a protocol.
- **Timeout Increased:** Increased verification timeout from 10s to 15s.
- **Detailed Errors:** Returns clearer error messages when the website cannot be reached.

### 2. Frontend (`/utils/api.tsx`)
- **Error Propagation:** Updated `verify` function to look for `error.message` in the server response (which Supabase/Hono returns) instead of just `error.error`. This ensures the detailed failure reason is passed to the UI.

## How to Test
1. Go to **Websites** tab.
2. Click **Verify** on a website.
3. You should now see a **Loading** toast, followed by either:
   - **Success:** "Verification successful!"
   - **Failure:** "Verification failed: [Reason]" (e.g., "Tracking snippet not found", "Unable to reach website").
