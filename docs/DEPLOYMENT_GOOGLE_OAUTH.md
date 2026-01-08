# Google OAuth Production Deployment Checklist

## Required Environment Variables

Add these environment variables to your production hosting platform (Vercel, Netlify, etc.):

```bash
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## Google Cloud Console Configuration

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** > **Credentials**
3. Select your OAuth 2.0 Client ID
4. Add the following to **Authorized redirect URIs**:
   ```
   https://genosys.ae/api/auth/google/callback
   ```
5. Add the following to **Authorized JavaScript origins**:
   ```
   https://genosys.ae
   ```

## Verification Steps

After setting environment variables:

1. **Restart your production server** (environment variables require a restart)
2. **Test the endpoint**: Visit `https://genosys.ae/api/auth/google`
   - Should redirect to Google OAuth consent screen
   - Should NOT return `{"error":"Google Sign-In is not configured..."}`
3. **Test the full flow**:
   - Click "Sign in with Google" on login page
   - Complete Google authentication
   - Should redirect back to your site and log you in

## Troubleshooting

### Error: "Google Sign-In is not configured"
- **Cause**: Environment variables not set or server not restarted
- **Solution**: 
  1. Verify variables are set in your hosting platform
  2. Restart/redeploy your application
  3. Check server logs for environment variable warnings

### Error: "redirect_uri_mismatch"
- **Cause**: Redirect URI not added to Google Cloud Console
- **Solution**: Add `https://genosys.ae/api/auth/google/callback` to Authorized redirect URIs

### Error: "invalid_client"
- **Cause**: Wrong Client ID or Secret
- **Solution**: Double-check environment variables match Google Cloud Console

## Platform-Specific Instructions

### Vercel
1. Go to your project settings
2. Navigate to **Environment Variables**
3. Add `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
4. Redeploy your application

### Netlify
1. Go to **Site settings** > **Environment variables**
2. Add `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
3. Redeploy your site

### Other Platforms
- Set environment variables in your platform's configuration
- Ensure variables are available at build time (if needed)
- Restart/redeploy after adding variables

