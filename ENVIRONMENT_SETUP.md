# Environment Configuration Guide

This guide will help you set up your Clerk authentication for both development and production environments.

## Development Setup (Already Configured)

Your development environment is already configured with test keys in the `.env` files.

## Production Setup

### Step 1: Get Your Clerk Production Keys

1. Go to your [Clerk Dashboard](https://dashboard.clerk.com/)
2. Switch to your **Production** instance (top-right corner)
3. Navigate to **Developers** → **API Keys**
4. Copy the following keys:
   - **Publishable Key** (starts with `pk_live_...`)
   - **Secret Key** (starts with `sk_live_...`)
   - **Webhook Secret** (if using webhooks, starts with `whsec_...`)

### Step 2: Configure Environment Variables by Hosting Provider

#### For Vercel Deployment:

1. Go to your Vercel project dashboard
2. Click on **Settings** → **Environment Variables**
3. Add the following variables:

**Frontend (Client) Variables:**
```dotenv
VITE_CLERK_PUBLISHABLE_KEY=pk_live_your_actual_production_key
VITE_BACKEND_URL=https://your-backend-domain.com
VITE_CURRENCY=$
```

**Backend (Server) Variables:**
```dotenv
PORT=3000
DBURI=your_production_mongodb_connection_string
CLERK_PUBLISHABLE_KEY=pk_live_your_actual_production_publishable_key
CLERK_SECRET_KEY=sk_live_your_actual_production_secret_key
CLERK_WEBHOOK_SECRET=whsec_your_actual_webhook_secret
CLOUDINARY_CLOUD_NAME=your_production_cloud_name
CLOUDINARY_API_KEY=your_production_api_key
CLOUDINARY_API_SECRET=your_production_api_secret
```

#### For Netlify Deployment:

1. Go to your Netlify site dashboard
2. Click on **Site settings** → **Environment variables**
3. Add the same variables as listed above for Vercel

#### For Railway/Render/Other Platforms:

1. Navigate to your project's environment variables section
2. Add the same variables as listed above

### Step 3: Update Your Clerk Dashboard Settings

1. In your Clerk Dashboard (Production instance):
2. Go to **Domains** and add your production domain
3. Go to **Webhooks** (if using) and update the endpoint URLs to your production URLs

### Step 4: Test Your Production Environment

1. Deploy your application with the new environment variables
2. Test the authentication flow:
   - Sign up with a new account
   - Sign in with existing account
   - Test protected routes
   - Verify user data is properly stored

## Environment Variable Security Notes

- **Never commit production keys to version control**
- **Use different database instances for development and production**
- **Regularly rotate your secret keys**
- **Use HTTPS in production for all API calls**

## Troubleshooting

### Common Issues:

1. **"Clerk Publishable Key is not set" error:**
   - Verify the environment variable name matches exactly
   - Check that the key starts with `pk_live_` for production
   - Ensure the hosting platform has the variables set

2. **Authentication fails in production:**
   - Verify your domain is added to Clerk Dashboard
   - Check that both frontend and backend are using the same Clerk instance
   - Ensure CORS settings allow your production domain

3. **API calls fail:**
   - Verify `VITE_BACKEND_URL` points to your production backend
   - Check that your backend is properly deployed and accessible
   - Ensure all routes are working with HTTPS

## Development vs Production Key Differences

| Environment | Publishable Key | Secret Key | Database | Domain |
|-------------|----------------|------------|----------|---------|
| Development | `pk_test_...` | `sk_test_...` | Development DB | localhost |
| Production | `pk_live_...` | `sk_live_...` | Production DB | Your domain |

Remember: Test keys only work in development, and live keys only work in production!
