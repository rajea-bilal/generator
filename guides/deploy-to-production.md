# Deploying to Production Guide

This guide provides instructions for deploying the application to production with different configuration options.

**Date:** June 2025

## Prerequisites

### Required for All Deployments:
- A Git repository with your code (GitHub, GitLab, or Bitbucket)
- A [Vercel](https://vercel.com) account

### Required Based on Your Configuration:

**If auth: true**
- [Clerk](https://dashboard.clerk.com) production account

**If convex: true**
- [Convex](https://dashboard.convex.dev) account

**If payments: true**
- [Polar](https://polar.sh) production account (not sandbox)

**If chat enabled**
- [OpenAI](https://platform.openai.com) account

**If monitoring: true**
- [Sentry](https://sentry.io) account
- [OpenStatus](https://openstatus.dev) account (optional)

## Step 1: Prepare Your Repository

1. **Configure your features** in `config.ts` for production:
```typescript
export const config: AppConfig = {
  features: {
    auth: true,        // Set based on your needs
    payments: true,    // Set based on your needs
    convex: true,      // Set based on your needs
    email: false,      // Keep false for now
    monitoring: true,  // Enable for production error tracking
  },
  // ... rest of config
};
```

2. Ensure all your changes are committed
3. Push your code to your Git repository
4. Make sure your `.env` and `.env.local` files are in `.gitignore`

## Step 2: Deploy Backend to Convex (If convex: true)

**Skip this step if you disabled Convex in your configuration**

1. Deploy your backend to Convex:
```bash
npx convex deploy
```

2. Note your production deployment URL: `https://your-project-name.convex.cloud`

## Step 3: Configure Production Services

### Clerk Setup (If auth: true)
**Skip this section if you disabled auth in your configuration**

1. Create a new production application in Clerk (or switch to production mode)
2. Get your production API keys
3. Set up the JWT template for Convex (if convex is also enabled):
   - Go to JWT Templates
   - Create a new Convex template
   - Save the issuer URL

### Polar Setup (If payments: true)
**Skip this section if you disabled payments in your configuration**

1. Switch to [polar.sh](https://polar.sh) (not sandbox)
2. Create your production organization
3. Set up your production plans
4. Get your production API keys and organization ID

### Sentry Setup (If monitoring: true)
**Skip this section if you disabled monitoring in your configuration**

1. Create a production project in [Sentry](https://sentry.io)
2. Get your production DSN
3. Generate an auth token for source map uploads:
   - Go to Settings → Auth Tokens
   - Create new token with `project:write` and `org:read` scopes
4. Note your organization slug and project name

### OpenStatus Setup (If monitoring: true and uptime monitoring desired)
**Optional - only if you want uptime monitoring**

1. Create an account at [OpenStatus](https://openstatus.dev)
2. Create a new project/workspace
3. Generate an API key with monitoring permissions

## Step 4: Set Environment Variables

### For Convex (If convex: true)
**Skip this section if you disabled Convex**

In the [Convex Dashboard](https://dashboard.convex.dev), add relevant environment variables:

```env
# Frontend Configuration
FRONTEND_URL="https://your-vercel-domain.com"

# OpenAI (if chat enabled)
OPENAI_API_KEY="sk-..."

# Clerk (if auth enabled)
VITE_CLERK_FRONTEND_API_URL="https://your-clerk-frontend-api-url"

# Polar (if payments enabled)
POLAR_ACCESS_TOKEN="pk_live_..."
POLAR_ORGANIZATION_ID="org_..."
POLAR_WEBHOOK_SECRET="whsec_..."

# Sentry (if monitoring enabled)
SENTRY_DSN="https://your-dsn@sentry.io/project-id"

# OpenStatus (if monitoring enabled and uptime monitoring desired)
OPENSTATUS_API_KEY="your-api-key-here"
OPENSTATUS_PROJECT_ID="your-project-id"

# Feature flags (automatically set by config, but include for clarity)
PAYMENTS_ENABLED="true"
EMAIL_ENABLED="false"
AUTH_ENABLED="true"
CONVEX_ENABLED="true"
MONITORING_ENABLED="true"
```

### For Frontend-Only Deployments
**If you're deploying without Convex, you only need Vercel environment variables**

## Step 5: Deploy to Vercel

1. Go to [Vercel](https://vercel.com)
2. Create a new project
3. Import your Git repository
4. Configure the build settings:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install --legacy-peer-deps`

5. Add environment variables in Vercel based on your configuration:

### For Simple Frontend (No Backend)
```env
# No environment variables needed!
```

### For Configurations WITH Convex
```env
# Convex (client-side URLs)
VITE_CONVEX_URL="https://your-deployment.convex.cloud"
```

### For Configurations WITH Auth
```env
# Clerk
VITE_CLERK_PUBLISHABLE_KEY="pk_live_..."  # For client-side usage
CLERK_SECRET_KEY="sk_live_..."            # Required for build time
```

### Complete Example (Full SaaS)
```env
# Convex
VITE_CONVEX_URL="https://your-deployment.convex.cloud"

# Clerk
VITE_CLERK_PUBLISHABLE_KEY="pk_live_..."
CLERK_SECRET_KEY="sk_live_..."

# Sentry (for production error tracking)
VITE_SENTRY_DSN="https://your-dsn@sentry.io/project-id"
SENTRY_DSN="https://your-dsn@sentry.io/project-id"
SENTRY_AUTH_TOKEN="your-auth-token-here"
SENTRY_ORG="your-org-slug"
SENTRY_PROJECT="kaizen-app"
SENTRY_ENVIRONMENT="production"

# OpenStatus (optional, for uptime monitoring)
OPENSTATUS_API_KEY="your-api-key-here"
OPENSTATUS_PROJECT_ID="your-project-id"
```

**Note:** All other environment variables (FRONTEND_URL, API keys, etc.) should be set in your Convex deployment, not in Vercel.

6. Deploy the project

## Step 6: Configure Webhooks (If payments: true)

**Skip this section if you disabled payments in your configuration**

### Polar Webhooks
1. In Polar dashboard:
   - Go to Webhooks
   - Add endpoint: `https://your-convex-deployment.convex.cloud/payments/webhook`
   - Format: Raw
   - Select all event types
   - Save the webhook

## Step 7: Update Service Configurations

### Clerk (If auth: true)
**Skip this section if you disabled auth**

1. In Clerk Dashboard:
   - Add your Vercel domain to allowed origins
   - Update OAuth callback URLs
   - Update any email templates with production URLs

### Polar (If payments: true)
**Skip this section if you disabled payments**

1. Update subscription success/cancel URLs to your production domain
2. Test a subscription with a real card

### Sentry (If monitoring: true)
**Skip this section if you disabled monitoring**

1. In Sentry Dashboard:
   - Configure alert rules for production errors
   - Set up notification channels (email, Slack)
   - Verify source maps are uploading correctly

### OpenStatus (If monitoring: true and uptime monitoring enabled)
**Skip this section if you didn't configure OpenStatus**

1. Create monitors for your key endpoints:
   - Main app: `https://your-production-domain.com`
   - Health check: `https://your-production-domain.com/api/health`
2. Set up notification channels and escalation policies

## Step 8: Final Testing

Test based on your configuration:

### Simple Frontend Testing
1. Visit your production URL
2. Navigate through the demo dashboard
3. Verify all pages load correctly

### Auth-Only Testing
1. Test the complete auth flow:
   - Sign up
   - Email verification (if enabled)
   - Dashboard access
   - Chat functionality

### Full SaaS Testing
1. Test the complete user flow:
   - Sign up
   - Email verification
   - Subscription process
   - Dashboard access
   - Chat functionality
   - Subscription management

### Monitor logs in enabled services:
- Convex Dashboard (if convex enabled)
- Clerk Dashboard (if auth enabled)
- Polar Dashboard (if payments enabled)
- Sentry Dashboard (if monitoring enabled)
- OpenStatus Dashboard (if uptime monitoring enabled)

### Test Error Reporting (If monitoring: true)
1. Test frontend error tracking:
   - Open browser console
   - Run: `throw new Error("Production test error");`
   - Verify error appears in Sentry
2. Test uptime monitoring (if OpenStatus configured):
   - Verify monitors are running
   - Check health endpoint: `/api/health`

## Production Checklist by Configuration

### All Configurations
- [ ] Code is deployed to Vercel
- [ ] Application loads without errors
- [ ] Configuration is valid

### If convex: true
- [ ] Convex environment variables are set
- [ ] Backend is deployed to Convex

### If auth: true
- [ ] Clerk environment variables are set in Vercel
- [ ] OAuth callbacks are updated in Clerk
- [ ] JWT template is configured (if convex enabled)

### If payments: true
- [ ] Polar environment variables are set in Convex
- [ ] Polar webhooks are pointing to production URL
- [ ] Subscription plans are set up in Polar

### If chat enabled
- [ ] OpenAI API key has sufficient quota

### If monitoring: true
- [ ] Sentry environment variables are set in Vercel
- [ ] Sentry project is configured with alert rules
- [ ] Source maps are uploading successfully
- [ ] OpenStatus monitors are configured (if using uptime monitoring)
- [ ] Notification channels are set up and tested

## Troubleshooting by Feature

### General Issues
- **Build failures**: Check environment variables and TypeScript errors
- **Configuration errors**: Verify config.ts matches your needs
- **Missing features**: Check UI flags in config

### Auth Issues (If auth: true)
- **Auth not working**: Verify Clerk origins and environment variables
- **JWT errors**: Check Clerk-Convex integration setup

### Payment Issues (If payments: true)
- **Webhooks not working**: Verify endpoint URLs and secrets
- **Subscriptions failing**: Check Polar webhook configuration

### Backend Issues (If convex: true)
- **Database errors**: Monitor Convex logs for backend errors
- **API failures**: Check Convex environment variables

### Chat Issues (If chat enabled)
- **Chat not working**: Verify OpenAI API key and Convex configuration

### Monitoring Issues (If monitoring: true)
- **Errors not appearing in Sentry**: Check DSN configuration and network connectivity
- **Source maps not working**: Verify auth token and build configuration in GitHub Actions
- **Uptime monitoring not working**: Check OpenStatus API key and monitor configuration
- **Alerts not firing**: Verify notification channels and alert rule configuration

## Additional Resources

### Monitoring Setup
For detailed monitoring configuration, see the [Monitoring Setup Guide](./monitoring-setup.md).

### Configuration Help
For configuration options and troubleshooting, see the [Configuration Guide](./configuration.md). 