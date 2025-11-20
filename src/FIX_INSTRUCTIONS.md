# Critical Server File Corruption

## Problem
The `/supabase/functions/server/index.tsx` file has corrupted lines that cannot be edited:

**Line 383:** `\/*/, ''); // Remove malformed http/https`  
**Line 384:** `sanitizedUrl = sanitizedUrl.replace(/^\\/+/, ''); // Remove leading slashes`

**Line 465:** `targetUrl = targetUrl.replace(/^(htts?):?\\/*/, ''); // Remove malformed http/https`  
**Line 466:** `targetUrl = targetUrl.replace(/^\\/+/, ''); // Remove leading slashes`

These lines:
1. Start with corrupted characters (line 383 starts with `\` which breaks parsing)
2. Try to reassign const variables 
3. Duplicate the sanitization logic already in `url_helper.tsx`

## Impact
- Server won't compile due to parsing error on line 383
- URLs get corrupted into things like `https://ps//ps://dominent.online/`

## Solution Needed
Lines 383-385 should be removed entirely from the add website endpoint (around line 372).
Lines 465-471 should be removed from the verify endpoint (around line 440).

The sanitizeUrl() function already handles all URL cleaning, so these duplicate lines are unnecessary and harmful.

## Correct Code
After `const sanitizedUrl = sanitizeUrl(url);` on line 381, the next line should be:
```
// Basic URL validation
try {
  new URL(sanitizedUrl);
```

After `const targetUrl = sanitizeUrl(website.url);` on line 462, the next line should be:
```
console.log(`Verifying website: ${targetUrl}`);
```
