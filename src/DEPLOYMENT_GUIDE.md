# AdGuardian Vercel Deployment Guide

## Quick Deploy (Copy & Paste These Commands)

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Set Your Token
```bash
export VERCEL_TOKEN=drSv4jT6jlptKSmc0RXjOd1z
```

### Step 3: Deploy
```bash
vercel --prod --token $VERCEL_TOKEN
```

When prompted:
- **Set up and deploy?** → Yes
- **Which scope?** → Select your account
- **Link to existing project?** → No
- **Project name?** → adguardian (or your preferred name)
- **Directory?** → ./ (press Enter)
- **Override settings?** → No

---

## Environment Variables Setup

After deployment, add these environment variables in Vercel Dashboard:

1. Go to: https://vercel.com/your-username/adguardian/settings/environment-variables

2. Add these variables:
   - `SUPABASE_URL` = Your Supabase project URL
   - `SUPABASE_ANON_KEY` = Your Supabase anon key
   - `SUPABASE_SERVICE_ROLE_KEY` = Your Supabase service role key

3. Redeploy: `vercel --prod --token $VERCEL_TOKEN`

---

## Alternative: Deploy via Vercel Dashboard

1. **Prepare your code:**
   ```bash
   # Initialize git if not already done
   git init
   git add .
   git commit -m "Initial commit - AdGuardian SaaS"
   ```

2. **Push to GitHub:**
   ```bash
   # Create a new repo on GitHub first, then:
   git remote add origin https://github.com/YOUR_USERNAME/adguardian.git
   git branch -M main
   git push -u origin main
   ```

3. **Deploy on Vercel:**
   - Go to https://vercel.com/new
   - Click "Import Git Repository"
   - Select your repository
   - Add environment variables
   - Click "Deploy"

---

## Deploying Supabase Edge Functions

Your backend server also needs to be deployed:

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Deploy edge functions
supabase functions deploy make-server-51144976
```

---

## Post-Deployment Checklist

- [ ] Frontend deployed to Vercel
- [ ] Environment variables added
- [ ] Supabase edge functions deployed
- [ ] Test the live site
- [ ] Verify tracking snippet generation works
- [ ] Test authentication flow
- [ ] **IMPORTANT: Regenerate your Vercel token** (security best practice)

---

## Troubleshooting

### Build Fails
- Check that all dependencies are in package.json
- Verify Node version compatibility
- Check build logs in Vercel dashboard

### Runtime Errors
- Verify environment variables are set correctly
- Check Supabase CORS settings allow your Vercel domain
- Review browser console for errors

### API Connection Issues
- Ensure Supabase edge functions are deployed
- Verify API endpoints are accessible
- Check network tab for failed requests

---

## Your Deployment URLs

After deployment, you'll have:
- **Frontend**: `https://adguardian.vercel.app` (or custom domain)
- **Backend**: `https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-51144976/`

---

## Security Reminder

🔒 **REGENERATE YOUR VERCEL TOKEN AFTER DEPLOYMENT**

1. Go to: https://vercel.com/account/tokens
2. Delete token: `drSv4jT6jlptKSmc0RXjOd1z`
3. Create a new one if needed for future deployments
