# 📊 Monitoring & Error Reporting Setup Guide

This guide walks you through setting up comprehensive error reporting and monitoring for your application using Sentry and OpenStatus.

## Overview

The monitoring system provides:
- **Frontend Error Tracking**: React error boundaries with Sentry integration
- **Backend Error Tracking**: Convex function error monitoring
- **Uptime Monitoring**: OpenStatus integration for service monitoring
- **Alert Pipeline**: Sentry → OpenStatus → Slack/SMS notifications
- **Source Maps**: Proper stack traces in production

## Prerequisites

- Kaizen application set up and running
- GitHub account (for CI/CD integration)
- Email for notifications

## Step 1: Enable Monitoring Feature

1. Open `config.ts` in your project root
2. Set the monitoring feature flag to `true`:

```typescript
export const config: AppConfig = {
  features: {
    // ... other features
    monitoring: true,  // 👈 Enable monitoring
  },
  // ...
};
```

## Step 2: Set Up Sentry

### 2.1 Create Sentry Account & Project

1. Go to [sentry.io](https://sentry.io) and create a free account
2. Create a new project:
   - Choose **React** as the platform
   - Name it `kaizen-app` (or your preferred name)
   - Choose your organization

### 2.2 Get Your Sentry Configuration

After creating the project, you'll need these values:

1. **DSN**: Found in **Settings** → **Projects** → **Your Project** → **Client Keys (DSN)**
2. **Auth Token**: Go to **Settings** → **Auth Tokens** → **Create New Token**
   - Scopes: `project:write`, `org:read`
   - Name: `kaizen-sourcemaps`
3. **Organization Slug**: Found in **Settings** → **Organization Settings**

### 2.3 Configure Environment Variables

Add these to your `.env` file (create from `.env.example`):

```bash
# Sentry Configuration
VITE_SENTRY_DSN=https://your-dsn@sentry.io/project-id
SENTRY_DSN=https://your-dsn@sentry.io/project-id
SENTRY_AUTH_TOKEN=your-auth-token-here
SENTRY_ORG=your-org-slug
SENTRY_PROJECT=kaizen-app
SENTRY_ENVIRONMENT=development
```

### 2.4 Enable Sentry Service

In `config.ts`, enable the Sentry service:

```typescript
export const config: AppConfig = {
  // ...
  services: {
    // ... other services
    sentry: {
      enabled: true,  // 👈 Enable Sentry
      // DSN and other configs are automatically loaded from env vars
    },
  },
};
```

### 2.5 Test Sentry Integration

1. Start your development server: `npm run dev`
2. Open browser console and run:
   ```javascript
   throw new Error("Test Sentry Error");
   ```
3. Check your Sentry dashboard - you should see the error appear

## Step 3: Set Up OpenStatus

### 3.1 Create OpenStatus Account

1. Go to [openstatus.dev](https://openstatus.dev) and create an account
2. Create a new workspace/project

### 3.2 Get API Credentials

1. Go to **Settings** → **API Keys**
2. Create a new API key with monitoring permissions
3. Note your project ID from the URL or settings

### 3.3 Configure Environment Variables

Add to your `.env` file:

```bash
# OpenStatus Configuration
OPENSTATUS_API_KEY=your-api-key-here
OPENSTATUS_PROJECT_ID=your-project-id
OPENSTATUS_WEBHOOK_URL=https://your-app.com/api/webhooks/sentry
```

### 3.4 Enable OpenStatus Service

In `config.ts`:

```typescript
export const config: AppConfig = {
  // ...
  services: {
    // ... other services
    openstatus: {
      enabled: true,  // 👈 Enable OpenStatus
    },
  },
};
```

## Step 4: Set Up Monitoring Checks

### 4.1 Create Health Check Monitor

In OpenStatus dashboard:

1. Go to **Monitors** → **Create Monitor**
2. Configure:
   - **Name**: `Kaizen App Health`
   - **URL**: `https://your-app.com/api/health`
   - **Regions**: Select multiple regions (US East, EU West)
   - **Interval**: 60 seconds
   - **Method**: GET

### 4.2 Create Main App Monitor

1. Create another monitor:
   - **Name**: `Kaizen Main App`
   - **URL**: `https://your-app.com`
   - **Regions**: Multiple regions
   - **Interval**: 300 seconds (5 minutes)

## Step 5: Configure Alerting

### 5.1 Set Up Sentry Alert Rules

In your Sentry project:

1. Go to **Alerts** → **Create Alert**
2. Configure trigger:
   - **Trigger**: `An issue is created`
   - **Filters**: All issues or specific error types
3. Add action:
   - **Action**: `Send a webhook`
   - **URL**: `https://your-app.com/api/webhooks/sentry`
   - **Method**: POST

### 5.2 Set Up OpenStatus Notifications

In OpenStatus:

1. Go to **Notifications** → **Add Notification**
2. Choose your preferred method:
   - **Slack**: Connect your Slack workspace
   - **Email**: Add email addresses
   - **Webhook**: For custom integrations

3. Configure escalation:
   - **Immediate**: Email notification
   - **After 5 minutes**: Slack notification
   - **After 15 minutes**: SMS (if configured)

## Step 6: Production Deployment

### 6.1 Environment Variables in Production

Set these environment variables in your hosting platform:

**Vercel:**
```bash
vercel env add VITE_SENTRY_DSN
vercel env add SENTRY_DSN
vercel env add SENTRY_AUTH_TOKEN
vercel env add SENTRY_ORG
vercel env add SENTRY_PROJECT
vercel env add OPENSTATUS_API_KEY
vercel env add OPENSTATUS_PROJECT_ID
```

**Netlify:**
Add in Site Settings → Environment Variables

### 6.2 Update Production Config

For production, update your environment variables:

```bash
SENTRY_ENVIRONMENT=production
OPENSTATUS_WEBHOOK_URL=https://your-production-app.com/api/webhooks/sentry
```

### 6.3 GitHub Secrets (for CI/CD)

Add these secrets to your GitHub repository:

1. Go to **Settings** → **Secrets and Variables** → **Actions**
2. Add these repository secrets:
   - `SENTRY_AUTH_TOKEN`
   - `SENTRY_ORG`
   - `SENTRY_PROJECT`
   - `VITE_SENTRY_DSN`

## Step 7: Testing & Validation

### 7.1 Test Error Reporting

1. **Frontend Error Test**:
   ```javascript
   // In browser console
   throw new Error("Frontend test error");
   ```

2. **Backend Error Test** (if using Convex):
   ```typescript
   // In a Convex function, temporarily add:
   export const testError = mutation({
     handler: async () => {
       throw new Error("Backend test error");
     }
   });
   ```

### 7.2 Test Uptime Monitoring

1. Temporarily break your app (comment out a critical component)
2. Deploy and verify OpenStatus detects the outage
3. Check that notifications are sent

### 7.3 Verify Source Maps

1. Create an error in production
2. Check Sentry dashboard
3. Verify stack traces show original source code (not minified)

## Step 8: Advanced Configuration

### 8.1 Custom Error Filtering

Update `app/sentry.client.ts` to filter errors:

```typescript
Sentry.init({
  // ... other config
  beforeSend(event) {
    // Filter out specific errors
    if (event.exception?.values?.[0]?.value?.includes('Non-Error promise rejection')) {
      return null;
    }
    
    // Filter out development errors
    if (import.meta.env.DEV) {
      return null;
    }
    
    return event;
  },
});
```

### 8.2 Performance Monitoring

Enable performance monitoring in Sentry:

```typescript
Sentry.init({
  // ... other config
  tracesSampleRate: 0.1, // 10% of transactions
  // Add performance integrations
});
```

### 8.3 User Context

Add user context to errors:

```typescript
import { useUser } from "@clerk/react-router";

// In your app component
const { user } = useUser();

useEffect(() => {
  if (user) {
    Sentry.setUser({
      id: user.id,
      email: user.primaryEmailAddress?.emailAddress,
    });
  }
}, [user]);
```

## Troubleshooting

### Common Issues

1. **Source maps not working**:
   - Verify `SENTRY_AUTH_TOKEN` is set in CI/CD
   - Check that build includes source maps
   - Ensure auth token has correct permissions

2. **Errors not appearing in Sentry**:
   - Check browser network tab for Sentry requests
   - Verify DSN is correct
   - Check beforeSend filters

3. **OpenStatus monitors failing**:
   - Verify URLs are accessible publicly
   - Check API key permissions
   - Ensure health endpoint returns 200 status

### Getting Help

- **Sentry Documentation**: [docs.sentry.io](https://docs.sentry.io)
- **OpenStatus Documentation**: [docs.openstatus.dev](https://docs.openstatus.dev)
- **Kaizen Issues**: [GitHub Issues](https://github.com/your-repo/issues)

## Next Steps

Once monitoring is set up:

1. **Set up custom dashboards** in Sentry for key metrics
2. **Configure release tracking** to correlate errors with deployments
3. **Set up performance budgets** to track app speed
4. **Create runbooks** for common incident response scenarios

---

🎉 **Congratulations!** Your application now has comprehensive monitoring and error reporting. You'll be notified immediately when issues occur and have detailed information to debug problems quickly.