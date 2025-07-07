# Testing Locally

This guide walks you through setting up Kaizen for local development based on your chosen configuration.

## 🔧 Before You Start: Configuration Check

**IMPORTANT**: Before following this guide, make sure you've configured your `config.ts` file with the features you want:

```typescript
// config.ts
export const config: AppConfig = {
  features: {
    auth: true,        // Do you want user authentication?
    payments: true,    // Do you want subscription billing?
    convex: true,      // Do you want backend database?
    email: false,      // Email with Resend (optional)
  },
  // ... rest of config
};
```

## 🎯 Quick Setup Paths

Choose your path based on your configuration:

- **🚀 Full SaaS** (`auth: true, payments: true, convex: true`): Follow all steps
- **🌐 Frontend Only** (`auth: false, payments: false, convex: false`): Jump to [Step 8](#step-8-start-the-development-server)  
- **👤 Auth-Only** (`auth: true, payments: false, convex: true`): Skip steps 6-8, do steps 1-5 only
- **💳 Payments-Only** (`auth: false, payments: true, convex: true`): Skip steps 4-5, do others

## ⚠️ Expected Errors by Configuration

**Don't panic!** Based on your configuration, you might see these errors initially:

| Configuration | Expected Errors (Normal!) | Action |
|---------------|---------------------------|---------|
| **Frontend Only** | None! Should work immediately | None needed |
| **No Convex** | "No address provided to convex react client" | Ignore - you disabled convex |
| **No Auth** | No Clerk-related errors | Skip Clerk setup |
| **No Payments** | "Cannot find function subscriptions:getAvailablePlans" | Ignore - you disabled payments |
| **Full SaaS** | All errors until setup complete | Follow all steps |

---

## Step 1: Install Dependencies

```bash
npm install --legacy-peer-deps
```

## Step 2: Start Development Server (Test Configuration)

```bash
npm run dev
```

Visit `http://localhost:5173` to see what errors you get. This helps you understand what needs setup based on your configuration.

## Step 3: Set Up Convex (If convex: true)

**Skip this step if you set `convex: false` in your config**

1. Open a new terminal and run:
```bash
npx convex dev
```

2. If not logged in, follow the prompts to log in
3. Create a new project when prompted
4. This will automatically add your Convex URL to `.env.local`

## Step 4: Set Up Clerk (If auth: true)

**Skip this step if you disabled auth in config**

1. Go to [Clerk Dashboard](https://dashboard.clerk.dev/)
2. Create a new application
3. Select "React Router" as your framework
4. Enable Email/Password and Google authentication methods
5. Go to API Keys and copy them to your `.env.local`:
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

## Step 5: Configure Clerk-Convex Integration (If both auth and convex: true)

**Skip this step if you disabled auth or convex**

1. In Clerk Dashboard:
   - Go to JWT Templates
   - Create a new template
   - Select "Convex"
   - Save the template

2. Copy the Issuer URL from Clerk

3. In Convex Dashboard:
   - Go to Settings > Environment Variables
   - Add `VITE_CLERK_FRONTEND_API_URL` and set it to the Issuer URL from Clerk

## Step 6: Set Up Polar (If payments: true)

**Skip this step if you disabled payments in config**

1. Go to [sandbox.polar.sh](https://sandbox.polar.sh)
2. Create a new organization
3. Create a subscription plan
4. Get your API keys from Settings

5. In Convex Dashboard, add these environment variables:
```env
POLAR_ACCESS_TOKEN=<your-access-token>
POLAR_ORGANIZATION_ID=<your-org-id>
POLAR_WEBHOOK_SECRET=<your-webhook-secret>

# Feature flags (automatically set by config system, but you can set manually)
PAYMENTS_ENABLED=true
EMAIL_ENABLED=false

# Optional: Resend Email (if email: true)
RESEND_API_KEY=re_your_api_key_here
RESEND_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

## Step 7: Configure Webhooks (If payments: true)

**Skip this step if you disabled payments in config**

1. Get your Convex HTTP URL from the Convex dashboard
2. In Polar Dashboard:
   - Go to Webhooks
   - Add a new endpoint: `<your-convex-http-url>/payments/webhook`
   - Select "Format as raw"
   - Generate a new secret
   - Select all event types
   - Click Create

## Step 8: Set Up Tunnel for Local Testing (If payments: true)

**Skip this step if you disabled payments in config**

Since Polar needs to reach your local environment for webhooks, set up a tunnel:

1. Start your tunnel:
```bash
ngrok http 5173
```

2. Copy the HTTPS URL provided by ngrok

3. Add it to your Convex environment variables:
```env
FRONTEND_URL=<your-ngrok-url>
```

4. Update `vite.config.ts` to allow the ngrok domain:
```typescript
server: {
  host: true,
  allowedHosts: ['your-ngrok-subdomain.ngrok.io']
}
```

## Step 9: Set Up Resend Email (Optional - If email: true)

**Skip this step if you set `email: false` in your config**

1. Go to [Resend.com](https://resend.com) and create an account
2. Create a new API key in your dashboard
3. In Convex Dashboard, add these environment variables:
```env
RESEND_API_KEY=re_your_api_key_here
RESEND_WEBHOOK_SECRET=whsec_your_webhook_secret_here  # Optional
```

4. Enable email in your `config.ts`:
```typescript
features: {
  email: true,      // Enable email feature
  convex: true,     // Required for Resend component
}
services: {
  resend: {
    enabled: true,
  },
}
```

For detailed email setup, see the [Email Setup Guide](./email-setup.md).

## Step 10: Start the Development Server

### For Configurations WITH Convex:
1. In one terminal, keep Convex running:
```bash
npx convex dev
```

2. In another terminal, start the frontend:
```bash
npm run dev
```

### For Configurations WITHOUT Convex:
Just start the frontend:
```bash
npm run dev
```

Your app should now be running at `http://localhost:5173`.

## Environment Variables Summary by Configuration

### Simple Frontend (No Backend)
```env
# No environment variables needed!
```

### Auth-Only Configuration
```env
# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."

# Convex Backend
CONVEX_DEPLOYMENT="..."
VITE_CONVEX_URL="..."

# OpenAI (optional)
OPENAI_API_KEY="sk-..."
```

### Full SaaS Configuration
```env
# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."

# Convex Backend
CONVEX_DEPLOYMENT="..."
VITE_CONVEX_URL="..."

# Polar Payments
POLAR_ACCESS_TOKEN="..."
POLAR_ORGANIZATION_ID="..."
POLAR_WEBHOOK_SECRET="..."

# OpenAI Chat
OPENAI_API_KEY="sk-..."

# Resend Email (optional)
RESEND_API_KEY="re_..."
RESEND_WEBHOOK_SECRET="whsec_..."

# Frontend URL (for webhooks)
FRONTEND_URL="http://localhost:5173"
```

## Testing Different Configurations

### Simple Frontend
1. Visit `http://localhost:5173`
2. Navigate through the demo dashboard
3. No authentication or payment flows

### Auth-Only
1. Visit `http://localhost:5173`
2. Click "Sign Up" to create an account
3. Test the dashboard and chat functionality
4. No payment flows

### Full SaaS
1. Visit `http://localhost:5173`
2. Test the complete user flow:
   - Sign up
   - View pricing
   - Subscribe with test card:
     - Card: 4242 4242 4242 4242
   - Any future expiry date
   - Any CVC
   - Access dashboard
   - Use chat functionality

## Configuration Validation

The app will automatically validate your configuration on startup. Check the console for:

✅ **Valid configuration:**
```
🔧 App Configuration:
   Features: auth, payments, convex
   Services: clerk, polar, convex, openai
```

❌ **Invalid configuration:**
```
⚠️  Configuration validation failed:
   - VITE_CLERK_PUBLISHABLE_KEY is required when auth is enabled
   - POLAR_ACCESS_TOKEN is required when payments are enabled
```

## Troubleshooting

### Configuration Issues
- **"Configuration validation failed"**: Add missing environment variables
- **"Service not available"**: Check feature flags in `config.ts`
- **Components not showing**: Verify UI flags in config

### Service-Specific Issues
- **"No address provided to convex react client"**: Convex is enabled but URL missing
- **Auth not working**: Check Clerk environment variables
- **Payments failing**: Verify Polar webhook configuration
- **Chat not available**: OpenAI API key missing or Convex disabled

### Development Issues
- **React version conflicts**: Use `--legacy-peer-deps` during installation
- **Build errors**: Run `npm run typecheck` to identify TypeScript issues
- **Webhook testing**: Ensure ngrok tunnel is running and properly configured 