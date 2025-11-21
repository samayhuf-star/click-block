# Admin Login Fix

## Issue
Admin login for `sam@sam.com` was not working properly.

## Root Cause
1. The `userSession` object created during sign-in was missing the `role` field
2. The email comparison in Dashboard was not case-insensitive

## Fixes Applied

### 1. Added `role` field to userSession (AuthModal.tsx)
- **Sign-in**: Now includes `role: data.user.user_metadata?.role || 'customer'`
- **Sign-up**: Now includes `role: data.user.user_metadata?.role || 'customer'`
- Ensures email is trimmed and lowercased: `email: formData.email.trim().toLowerCase()`

### 2. Improved admin check in Dashboard.tsx
- Made email comparison case-insensitive and trimmed
- Added proper email normalization: `const userEmail = currentUser?.email?.toLowerCase()?.trim();`
- Checks both `role === "super_admin"` and email matches

## Testing
1. Ensure `sam@sam.com` exists in Supabase (call `/create-super-admin` endpoint if needed)
2. Sign in with:
   - Email: `sam@sam.com`
   - Password: `sam@sam.com`
3. Should now have super admin access

## Next Steps
If login still fails:
1. Verify user exists: Check Supabase Auth users table
2. Create admin if missing: Call `/make-server-51144976/create-super-admin` endpoint
3. Check user metadata: Ensure `role: "super_admin"` is set in `user_metadata`

