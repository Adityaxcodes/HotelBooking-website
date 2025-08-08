# Production Deployment Checklist

Use this checklist to ensure your MERN application is properly configured for production deployment.

## Pre-Deployment Checklist

### 1. Clerk Production Setup
- [ ] Obtained Clerk production keys from dashboard
- [ ] Switched to production instance in Clerk Dashboard
- [ ] Added production domain to Clerk Dashboard
- [ ] Updated webhook endpoints (if using webhooks)

### 2. Environment Variables Setup
- [ ] Set `VITE_CLERK_PUBLISHABLE_KEY` with production key (`pk_live_...`)
- [ ] Set `VITE_BACKEND_URL` with production backend URL
- [ ] Set `CLERK_SECRET_KEY` with production secret key (`sk_live_...`)
- [ ] Set production database URI (`DBURI`)
- [ ] Set production Cloudinary credentials
- [ ] Verified all environment variables are set in hosting platform

### 3. Database Configuration
- [ ] Created production MongoDB database
- [ ] Updated connection string for production
- [ ] Verified database connectivity
- [ ] Set up proper database user permissions

### 4. Backend Configuration
- [ ] Backend deployed and accessible via HTTPS
- [ ] CORS configured for production domain
- [ ] All API endpoints working
- [ ] Server running on correct port

### 5. Frontend Configuration
- [ ] Build process completed successfully
- [ ] Static files properly served
- [ ] Routing configured for SPA
- [ ] Environment variables loaded correctly

## Post-Deployment Testing

### Authentication Flow
- [ ] User can sign up successfully
- [ ] User can sign in successfully
- [ ] User can sign out successfully
- [ ] Protected routes are properly secured
- [ ] User data is correctly stored and retrieved

### Application Features
- [ ] Room browsing works
- [ ] Room details load correctly
- [ ] Booking functionality works
- [ ] Hotel registration works (if applicable)
- [ ] Image uploads work (Cloudinary)

### API Integration
- [ ] All API calls return expected responses
- [ ] Error handling works properly
- [ ] Authentication headers are included
- [ ] CORS issues resolved

## Common Deployment Issues and Solutions

### Issue: "Clerk Publishable Key is not set"
**Solution:** 
- Verify environment variable name is exactly `VITE_CLERK_PUBLISHABLE_KEY`
- Check that the key starts with `pk_live_` for production
- Ensure the hosting platform has the variable set

### Issue: "Network Error" or API calls fail
**Solution:**
- Verify `VITE_BACKEND_URL` points to correct production backend
- Check backend is deployed and accessible
- Ensure backend accepts requests from frontend domain

### Issue: Authentication redirects to wrong URL
**Solution:**
- Check Clerk Dashboard domain settings
- Verify redirect URLs in Clerk configuration
- Ensure frontend and backend use same Clerk instance

### Issue: Images not loading
**Solution:**
- Verify Cloudinary production credentials
- Check CORS settings in Cloudinary
- Ensure image URLs are properly formatted

## Environment-Specific URLs

### Development
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`
- Clerk Keys: `pk_test_...` / `sk_test_...`

### Production
- Frontend: `https://your-frontend-domain.com`
- Backend: `https://your-backend-domain.com`
- Clerk Keys: `pk_live_...` / `sk_live_...`

## Security Reminders

- [ ] Never commit `.env` files to version control
- [ ] Use HTTPS for all production traffic
- [ ] Regularly rotate secret keys
- [ ] Monitor Clerk Dashboard for suspicious activity
- [ ] Set up proper error logging and monitoring
