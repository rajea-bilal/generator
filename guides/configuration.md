# Configuration Guide

This guide explains how to configure Kaizen for different use cases using the flexible configuration system.

## 🔧 Configuration Overview

Kaizen uses a flexible configuration system that allows you to enable/disable five main features:

- **Authentication** (Clerk) - User login/signup, protected routes
- **Payments** (Polar.sh) - Subscription billing, payment processing  
- **Backend** (Convex) - Real-time database, server functions, AI chat
- **Email** (Plunk) - Email sending (coming soon)
- **Monitoring** (Sentry + OpenStatus) - Error reporting, uptime monitoring, alerting

## 📁 Configuration Files

- `config.ts` - Main configuration file
- `config.example.ts` - Example configurations for different use cases
- `.env.local` - Environment variables (only for enabled features)

## 🚀 Quick Start Configurations

### 1. Full SaaS App (Default)
**Perfect for:** Complete SaaS application with all features

```typescript
// config.ts
export const config: AppConfig = {
  features: {
    auth: true,        // ✅ User authentication
    payments: true,    // ✅ Subscription billing
    convex: true,      // ✅ Real-time database
    email: false,      // ❌ Email (not implemented yet)
    monitoring: true,  // ✅ Error reporting & monitoring
  },
  ui: {
    showPricing: true,    // Show pricing page
    showDashboard: true,  // Show dashboard
    showChat: true,       // Show AI chat
    showAuth: true,       // Show login/signup
  },
};
```

**Required Environment Variables:**
```env
# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Convex Backend
CONVEX_DEPLOYMENT=...
VITE_CONVEX_URL=https://...convex.cloud

# Polar.sh Payments
POLAR_ACCESS_TOKEN=...
POLAR_ORGANIZATION_ID=...
POLAR_WEBHOOK_SECRET=...

# OpenAI Chat
OPENAI_API_KEY=sk-...

# Sentry Error Reporting
VITE_SENTRY_DSN=https://your-dsn@sentry.io/project-id
SENTRY_DSN=https://your-dsn@sentry.io/project-id
SENTRY_AUTH_TOKEN=your-auth-token-here
SENTRY_ORG=your-org-slug
SENTRY_PROJECT=kaizen-app

# OpenStatus Monitoring
OPENSTATUS_API_KEY=your-api-key-here
OPENSTATUS_PROJECT_ID=your-project-id

# Feature Flags for Convex (automatically set by the config system)
PAYMENTS_ENABLED=true
EMAIL_ENABLED=false
AUTH_ENABLED=true
CONVEX_ENABLED=true
MONITORING_ENABLED=true
```

### 2. Simple Frontend App
**Perfect for:** Static websites, portfolio sites, landing pages

```typescript
// config.ts
export const config: AppConfig = {
  features: {
    auth: false,       // ❌ No authentication
    payments: false,   // ❌ No payments
    convex: false,     // ❌ No backend
    email: false,      // ❌ No email
    monitoring: false, // ❌ No monitoring (or true for basic error tracking)
  },
  ui: {
    showPricing: false,   // Hide pricing
    showDashboard: true,  // Show dashboard (as demo)
    showChat: false,      // Hide chat
    showAuth: false,      // Hide auth buttons
  },
};
```

**Required Environment Variables:**
```env
# None required!
```

### 3. Auth-Only App
**Perfect for:** User-focused apps, content management, personal dashboards

```typescript
// config.ts
export const config: AppConfig = {
  features: {
    auth: true,        // ✅ User authentication
    payments: false,   // ❌ No payments
    convex: true,      // ✅ Database for user data
    email: false,      // ❌ No email
  },
  ui: {
    showPricing: false,   // Hide pricing
    showDashboard: true,  // Show dashboard
    showChat: true,       // Show AI chat
    showAuth: true,       // Show login/signup
  },
};
```

**Required Environment Variables:**
```env
# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Convex Backend
CONVEX_DEPLOYMENT=...
VITE_CONVEX_URL=https://...convex.cloud

# OpenAI Chat (optional)
OPENAI_API_KEY=sk-...
```

### 4. Payments-Only App
**Perfect for:** E-commerce, product sales, one-time purchases

```typescript
// config.ts
export const config: AppConfig = {
  features: {
    auth: false,       // ❌ No authentication required
    payments: true,    // ✅ Payment processing
    convex: true,      // ✅ Database for orders
    email: false,      // ❌ No email
  },
  ui: {
    showPricing: true,    // Show pricing
    showDashboard: true,  // Show order dashboard
    showChat: false,      // Hide chat
    showAuth: false,      // Hide auth
  },
};
```

**Required Environment Variables:**
```env
# Convex Backend
CONVEX_DEPLOYMENT=...
VITE_CONVEX_URL=https://...convex.cloud

# Polar.sh Payments
POLAR_ACCESS_TOKEN=...
POLAR_ORGANIZATION_ID=...
POLAR_WEBHOOK_SECRET=...
```

### 5. Chat-Only App
**Perfect for:** AI assistants, chatbots, customer support

```typescript
// config.ts
export const config: AppConfig = {
  features: {
    auth: true,        // ✅ User sessions
    payments: false,   // ❌ No payments
    convex: true,      // ✅ Chat history
    email: false,      // ❌ No email
  },
  ui: {
    showPricing: false,   // Hide pricing
    showDashboard: true,  // Show chat dashboard
    showChat: true,       // Show AI chat
    showAuth: true,       // Show login
  },
};
```

## 🔄 Migration Between Configurations

### From Simple Frontend to Full SaaS

1. **Update config.ts:**
```typescript
// Before
features: { auth: false, payments: false, convex: false, email: false }

// After  
features: { auth: true, payments: true, convex: true, email: false }
```

2. **Add environment variables:**
```env
# Add to .env.local
VITE_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...
CONVEX_DEPLOYMENT=...
VITE_CONVEX_URL=...
POLAR_ACCESS_TOKEN=...
POLAR_ORGANIZATION_ID=...
POLAR_WEBHOOK_SECRET=...
OPENAI_API_KEY=...
```

3. **Set up backend services:**
```bash
npx convex dev
```

4. **Test the application:**
```bash
npm run dev
```

### From Auth-Only to Full SaaS

1. **Update config.ts:**
```typescript
// Before
features: { auth: true, payments: false, convex: true, email: false }

// After
features: { auth: true, payments: true, convex: true, email: false }
ui: { showPricing: true, ... }
```

2. **Add payment environment variables:**
```env
POLAR_ACCESS_TOKEN=...
POLAR_ORGANIZATION_ID=...
POLAR_WEBHOOK_SECRET=...
```

3. **Set up Polar.sh webhooks**

## 🛠️ Advanced Configuration

### Custom Service Providers

You can customize which services are used:

```typescript
// config.ts
export const config: AppConfig = {
  features: {
    auth: true,
    payments: true,
    convex: true,
    email: false,
  },
  services: {
    clerk: {
      enabled: true,  // Use Clerk for auth
      publishableKey: process.env.VITE_CLERK_PUBLISHABLE_KEY,
      secretKey: process.env.CLERK_SECRET_KEY,
    },
    polar: {
      enabled: false, // Disable Polar.sh
    },
    // Add custom payment provider here
  },
};
```

### Environment-Specific Configs

```typescript
// config.ts
import { isDevelopment, isProduction } from './config-utils';

export const config: AppConfig = {
  features: {
    auth: true,
    payments: isProduction,  // Only enable payments in production
    convex: true,
    email: false,
  },
  services: {
    polar: {
      enabled: isProduction,
      accessToken: isProduction 
        ? process.env.POLAR_ACCESS_TOKEN 
        : process.env.POLAR_SANDBOX_TOKEN,
    },
  },
};
```

## 🔍 Configuration Validation

The system automatically validates your configuration on startup:

```typescript
// Automatic validation
initializeConfig(); // Called in root.tsx

// Manual validation
const validation = validateConfig();
if (!validation.valid) {
  console.error('Configuration errors:', validation.errors);
}
```

**Common validation errors:**
- Missing required environment variables
- Invalid service configurations
- Conflicting feature flags

## 📋 Best Practices

### 1. Start Simple
Begin with a simple configuration and gradually add features:
```typescript
// Start with
features: { auth: false, payments: false, convex: false, email: false }

// Then add
features: { auth: true, payments: false, convex: true, email: false }

// Finally
features: { auth: true, payments: true, convex: true, email: false }
```

### 2. Use Environment Variables
Never hardcode sensitive information:
```typescript
// ❌ Bad
services: {
  clerk: {
    secretKey: "sk_test_hardcoded_key",
  },
}

// ✅ Good
services: {
  clerk: {
    secretKey: process.env.CLERK_SECRET_KEY,
  },
}
```

### 3. Test Configuration Changes
Always test after configuration changes:
```bash
npm run dev
npm run build
npm run typecheck
```

### 4. Use TypeScript
The configuration is fully typed - let TypeScript guide you:
```typescript
// TypeScript will warn about invalid configurations
const config: AppConfig = {
  features: {
    auth: true,
    payments: "yes", // ❌ TypeScript error - should be boolean
  },
};
```

## 🚨 Troubleshooting

### "Configuration validation failed"
**Cause:** Missing required environment variables
**Solution:** Add missing variables to `.env.local`

### "Convex hooks cannot be used"
**Cause:** Convex disabled but components still use hooks
**Solution:** Components have built-in checks - this shouldn't happen

### "Service not available"
**Cause:** Required service is disabled
**Solution:** Enable the service in config or remove dependencies

### Build errors with disabled services
**Cause:** Imports for disabled services
**Solution:** The system uses dynamic imports to avoid this

## 🚨 Error Troubleshooting by Configuration

**Don't panic!** Many "errors" are actually normal when certain features are disabled. Here's what to expect:

### ✅ Frontend Only (`auth: false, payments: false, convex: false`)
**Expected:** No errors! App should work immediately.
**If you see errors:** Check that all features are set to `false` in config.ts

### ⚡ No Convex (`convex: false`)
**Expected Errors (Normal!):**
- `No address provided to convex react client`
- `Cannot access useQuery outside of ConvexProvider`

**Solution:** These are normal! Your config disabled Convex so these components won't load.

### 👤 No Auth (`auth: false`)  
**Expected:** No auth-related errors
**If you see Clerk errors:** Double-check that `auth: false` in config.ts

### 💳 No Payments (`payments: false`)
**Expected Errors (Normal!):**
- `Cannot find function subscriptions:getAvailablePlans`
- Pricing page shows empty state

**Solution:** Normal! Payments are disabled so pricing functions don't load.

### 🤖 No AI Chat (`convex: false` or missing OpenAI key)
**Expected:** Chat tab is hidden or shows "Chat disabled" message
**If chat breaks:** Ensure `showChat: false` in UI config when convex is disabled

### 🔥 Full SaaS (`all features: true`)
**Expected:** All errors until setup complete, then no errors
**If persistent errors:** Follow the video tutorial or setup guide completely

## 🎯 Quick Configuration Examples

See `config.example.ts` for complete working examples of each configuration type.

## 📊 Monitoring Configuration

For detailed monitoring setup, see the [Monitoring Setup Guide](./monitoring-setup.md).

### Quick Monitoring Setup

```typescript
// config.ts
export const config: AppConfig = {
  features: {
    monitoring: true,  // Enable error reporting & monitoring
  },
  services: {
    sentry: {
      enabled: true,   // Enable Sentry error tracking
    },
    openstatus: {
      enabled: true,   // Enable OpenStatus uptime monitoring
    },
  },
};
```

**Required Environment Variables:**
```env
# Sentry Configuration
VITE_SENTRY_DSN=https://your-dsn@sentry.io/project-id
SENTRY_DSN=https://your-dsn@sentry.io/project-id
SENTRY_AUTH_TOKEN=your-auth-token-here
SENTRY_ORG=your-org-slug
SENTRY_PROJECT=kaizen-app

# OpenStatus Configuration
OPENSTATUS_API_KEY=your-api-key-here
OPENSTATUS_PROJECT_ID=your-project-id
```

### Monitoring Levels

1. **No Monitoring** (`monitoring: false`):
   - No error tracking or uptime monitoring
   - Good for: Simple static sites

2. **Basic Error Tracking** (`monitoring: true`, Sentry only):
   - Frontend and backend error reporting
   - Good for: Applications that need error visibility

3. **Full Monitoring** (`monitoring: true`, both Sentry + OpenStatus):
   - Error tracking + uptime monitoring + alerting
   - Good for: Production applications requiring high availability

## 🔄 Updates

When updating Kaizen, check:
1. New features added to `AppConfig` interface
2. Changes to required environment variables
3. Updates to validation rules
4. New configuration examples
5. New monitoring and alerting capabilities 