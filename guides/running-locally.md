# 🏠 Running Locally Guide

This guide walks you through setting up and running the Kaizen application on your local development machine.

## Prerequisites

Before getting started, make sure you have:

- **Node.js** (v18 or later) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** - [Download here](https://git-scm.com/)
- **Code Editor** - We recommend [VS Code](https://code.visualstudio.com/)

## Step 1: Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd kaizen

# Install dependencies
npm install --legacy-peer-deps

# Verify the installation
npm run typecheck
```

## Step 2: Basic Configuration

1. **Open `config.ts`** in the project root
2. **Choose your features** by setting them to `true`/`false`:

```typescript
export const config: AppConfig = {
  features: {
    auth: true,        // User authentication
    payments: true,    // Subscription billing  
    convex: true,      // Database and real-time features
    email: true,       // Email sending
    monitoring: true,  // Error reporting and monitoring
  },
  // ... services will be configured next
};
```

3. **Start simple**: For your first run, try enabling just `convex: true` and `monitoring: true`

## Step 3: Set Up Core Services

### 3.1 Convex Database (Required)

Convex provides your database, backend functions, and real-time features.

1. **Install Convex CLI**:
   ```bash
   npm install -g convex
   ```

2. **Initialize Convex**:
   ```bash
   npx convex dev
   ```
   
   This will:
   - Create a new Convex project (or use existing)
   - Start the Convex development server
   - Give you a deployment URL

3. **Copy the environment variables** that Convex provides:
   ```bash
   # Add these to your .env file
   VITE_CONVEX_URL=https://your-deployment.convex.cloud
   CONVEX_DEPLOYMENT=your-deployment-name
   ```

### 3.2 Authentication (Optional - if `auth: true`)

1. **Create a Clerk account** at [clerk.dev](https://clerk.dev)

2. **Create a new application**:
   - Choose "React" as the framework
   - Copy your keys

3. **Add to `.env`**:
   ```bash
   VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   ```

4. **Update `config.ts`**:
   ```typescript
   services: {
     convex: { enabled: true },
     clerk: { enabled: true },  // 👈 Enable Clerk
   }
   ```

### 3.3 AI Chat (Optional)

If you want the AI chat feature in the dashboard:

1. **Get OpenAI API key** from [platform.openai.com](https://platform.openai.com)

2. **Add to `.env`**:
   ```bash
   OPENAI_API_KEY=sk-...
   ```

3. **Update `config.ts`**:
   ```typescript
   services: {
     openai: { enabled: true },  // 👈 Enable OpenAI
   }
   ```

## Step 4: Start Development Server

```bash
# Start the development server
npm run dev
```

You should see:
- ✅ Configuration validation messages
- 🌐 Server running at `http://localhost:5173`
- 📊 Convex dashboard URL

## Step 5: Test Basic Functionality

1. **Open your browser** to `http://localhost:5173`
2. **Check the homepage** loads properly
3. **Try the dashboard** at `/dashboard`
4. **Test authentication** (if enabled) by signing up

## Step 6: Add More Features (Optional)

### 6.1 Payments with Polar.sh

1. **Create account** at [polar.sh](https://polar.sh)
2. **Create organization** and products
3. **Get API credentials**:
   ```bash
   POLAR_ACCESS_TOKEN=polar_...
   POLAR_ORGANIZATION_ID=org_...
   POLAR_WEBHOOK_SECRET=whsec_...
   ```

### 6.2 Email with Resend

1. **Create account** at [resend.com](https://resend.com)
2. **Get API key** and **create webhook secret**:
   ```bash
   RESEND_API_KEY=re_...
   RESEND_WEBHOOK_SECRET=whsec_...
   ```

### 6.3 Error Reporting & Monitoring

#### Built-in Convex Exception Reporting (Recommended)

For production-grade error reporting with zero code changes:

1. **Upgrade to Convex Pro** (required for built-in exception reporting)
2. **Create Sentry account** at [sentry.io](https://sentry.io)
3. **Create project** (choose "Generic" platform)
4. **Configure in Convex Dashboard**:
   - Go to Settings → Integrations → Exception Reporting
   - Add your Sentry DSN
   - All function errors will be automatically reported

#### Frontend Monitoring (Optional)

For additional frontend error tracking:

```bash
# Optional - for custom frontend error handling
VITE_SENTRY_DSN=https://your-dsn@sentry.io/project-id
```

## Step 7: Development Workflow

### 7.1 Running Commands

```bash
# Development server
npm run dev

# Type checking
npm run typecheck

# Build for production
npm run build

# Run tests
npm run test

# Run E2E tests
npm run test:e2e
```

### 7.2 File Structure

```
├── app/                    # React Router application
│   ├── components/        # Reusable UI components
│   ├── routes/           # Page components and routing
│   └── root.tsx          # App root component
├── convex/               # Convex backend functions
│   ├── schema.ts         # Database schema
│   ├── users.ts          # User management functions
│   └── sendEmails.ts     # Email functions
├── config.ts             # ⚙️ Main configuration file
└── guides/               # Setup documentation
```

### 7.3 Common Development Tasks

**Add a new page:**
1. Create file in `app/routes/`
2. Export default component
3. Add to navigation if needed

**Add a new Convex function:**
1. Create/edit file in `convex/`
2. Export query, mutation, or action
3. Use in React with `useQuery` or `useMutation`

**Add a new UI component:**
1. Create in `app/components/`
2. Follow existing patterns
3. Add to exports if reusable

## Step 8: Testing Your Setup

### 8.1 Configuration Validation

Run the development server and check the console for:

```bash
🎯 Kaizen Configuration Status:
✅ Core features initialized
✅ Authentication: Enabled (Clerk)
✅ Database: Enabled (Convex)
✅ Monitoring: Backend via Convex built-in
```

### 8.2 Feature Testing

- [ ] **Homepage**: Loads without errors
- [ ] **Authentication**: Sign up/sign in works (if enabled)
- [ ] **Dashboard**: Shows user data and real-time updates
- [ ] **AI Chat**: Responds to messages (if OpenAI configured)
- [ ] **Error Handling**: Errors are logged properly

### 8.3 Error Reporting Testing

If you enabled monitoring with Convex Pro:

1. **Create a test error** in a Convex function:
   ```typescript
   // In convex/test.ts
   export const testError = mutation({
     handler: async () => {
       throw new Error("Test error for local development");
     }
   });
   ```

2. **Call it from your app** and check Sentry for the error
3. **Remove the test function** when done

## Troubleshooting

### Common Issues

1. **"Convex deployment not found"**:
   - Run `npx convex dev` first
   - Check that `VITE_CONVEX_URL` is set correctly

2. **Authentication not working**:
   - Verify Clerk keys are correct
   - Check that localhost URLs are allowed in Clerk dashboard

3. **Build errors**:
   - Run `npm run typecheck` to see TypeScript errors
   - Make sure all enabled services have required environment variables

4. **Styling issues**:
   - Clear browser cache
   - Check that Tailwind CSS is working
   - Verify component imports are correct

### Getting Help

- **Configuration Issues**: Check `config.example.ts` for working examples
- **Convex Issues**: [Convex Discord](https://convex.dev/community)
- **React Router**: [React Router Docs](https://reactrouter.com/)
- **Tailwind CSS**: [Tailwind Docs](https://tailwindcss.com/)

---

## Next Steps

Once you have the app running locally:

1. **Explore the codebase**: Check out the different components and routes
2. **Try different features**: Enable/disable features in `config.ts`
3. **Read the guides**: Check out service-specific setup guides
4. **Deploy to production**: Follow the [Deploy to Production guide](./deploy-to-production.md)

🎉 **You're ready to build!** Your Kaizen application is now running locally with the features you need. 