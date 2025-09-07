# Deployment Instructions for Vercel

## Environment Variables Setup

### Option 1: Via Vercel Dashboard (Recommended)

1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add the following environment variable:
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: `https://jobhunt-server-six.vercel.app/api/v1`
   - **Environment**: Select "Production", "Preview", and "Development"

4. After adding, redeploy your application:
   - Go to the Deployments tab
   - Click on the three dots menu of your latest deployment
   - Select "Redeploy"

### Option 2: Via Vercel CLI

```bash
vercel env add VITE_API_BASE_URL production
# When prompted, enter: https://jobhunt-server-six.vercel.app/api/v1
```

### Option 3: Via vercel.json (Already configured)

The `vercel.json` file in the root already includes the environment variable configuration.

## Important Notes

1. **DO NOT** include the trailing slash in the API URL
2. **ENSURE** the URL starts with `https://` (not just the domain)
3. **VERIFY** the backend URL is correct: `https://jobhunt-server-six.vercel.app`

## Verification

After deployment, check the browser's Network tab to ensure API calls are going to:
- `https://jobhunt-server-six.vercel.app/api/v1/...`

NOT:
- `https://jobhunt-client-eta.vercel.app/jobhunt-server-six.vercel.app/...`

## Common Issues

### Issue: API URL is being appended to frontend URL
**Solution**: The environment variable is not set correctly. It might be missing the protocol (`https://`).

### Issue: 404 errors on API calls
**Solution**: Verify the backend is deployed and accessible at the correct URL.

### Issue: CORS errors
**Solution**: Ensure the backend has proper CORS configuration to allow requests from your frontend domain.

## Local Development

For local development, use the `.env` file with:
```
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

## Production Deployment

For production, use the `.env.production` file or Vercel environment variables with:
```
VITE_API_BASE_URL=https://jobhunt-server-six.vercel.app/api/v1
```
