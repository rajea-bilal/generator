# 🧪 Kaizen Boilerplate Testing Checklist

This checklist ensures all features in `config.ts` work correctly for developers who use this boilerplate.

## 🎯 **Current Status: 95% Complete Full SaaS! 🎉**
**✅ Just completed:** Email Configuration (Section 4)  
**🔄 Next up:** Add OpenStatus monitoring to complete Full SaaS Configuration  
**📊 Progress:** 4/5 core configurations tested and working

## 🚀 Pre-Testing Setup

### Prerequisites
- [ ] Node.js installed (v18+)
- [ ] npm installed  
- [ ] Test accounts for external services (see service-specific sections)

### Base Setup
- [ ] Clone repo: `git clone <repo-url>`
- [ ] Install dependencies: `npm install --legacy-peer-deps`
- [ ] Copy environment template: `cp .env.example .env` (if it exists)
- [ ] Verify build works: `npm run build`

---

## 📋 Configuration Testing Matrix

Test each configuration state to ensure all combinations work correctly.

### 1. 🔧 Static Configuration (No Services)
**Config**: Set all features to `false`, all services to `enabled: false`

```typescript
// config.ts
features: {
  auth: false,
  payments: false,
  convex: false,
  email: false,
  monitoring: false,
}
```

#### Tests:
- [x] **Build**: `npm run build` completes without errors
- [x] **Dev Server**: `npm run dev` starts without errors
- [x] **Homepage**: Navigate to `/` - loads successfully
- [x] **No Auth UI**: Sign-in/sign-up buttons not visible
- [x] **No Pricing**: Pricing page not accessible (`/pricing` should 404)
- [x] **Dashboard**: `/dashboard` accessible but no dynamic features
- [x] **No Chat**: Chat functionality not visible in dashboard
- [x] **TypeScript**: `npm run typecheck` passes
- [x] **Tests**: `npm run test` passes
- [x] **E2E**: `npm run test:e2e` passes

---

### 2. 🔐 Start with Auth-Only Configuration
**Config**: Enable auth + convex, disable payments/email/monitoring

```typescript
// config.ts
features: {
  auth: true,
  payments: false,
  convex: true,
  email: false,
  monitoring: false,
}
services: {
  clerk: { enabled: true },
  convex: { enabled: true },
  resend: { enabled: false },
}
ui: {
  showAuth: true,
  showDashboard: true,
  showChat: true,
  showPricing: false,
}
```

#### Environment Variables Required:
```bash
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CONVEX_DEPLOYMENT=your-deployment
VITE_CONVEX_URL=https://your-deployment.convex.cloud
```

#### Tests:
- [x] **Config Validation**: `validateConfig()` returns no errors
- [x] **Build**: `npm run build` completes
- [x] **Dev Server**: Starts without config errors
- [x] **Auth UI**: Sign-in/sign-up buttons visible on homepage
- [x] **Sign-up Flow**: `/sign-up` page loads, form functional
- [x] **Sign-in Flow**: `/sign-in` page loads, form functional
- [x] **Protected Routes**: Dashboard requires authentication
- [x] **Clerk Integration**: User can sign up/in successfully
- [x] **Convex Connection**: Dashboard shows user data
- [x] **Chat Feature**: AI chat works in dashboard (if OpenAI configured)
- [x] **No Pricing**: Pricing routes not accessible
- [x] **Session Persistence**: Refresh page maintains auth state

---

### 3. 💳 Add Payments Configuration  
**Config**: Enable payments + auth + convex, disable email/monitoring

```typescript
// config.ts
features: {
  auth: true,
  payments: true,
  convex: true,
  email: false,
  monitoring: false,
}
services: {
  clerk: { enabled: true },
  polar: { enabled: true },
  convex: { enabled: true },
  resend: { enabled: false },
}
ui: {
  showPricing: true,
  showDashboard: true,
  showAuth: true,
  showChat: false,
}
```

#### Environment Variables Required:
```bash
# Auth
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
VITE_CLERK_FRONTEND_API_URL=https://your-app.clerk.accounts.dev

# Payments
POLAR_ACCESS_TOKEN=polar_...
POLAR_ORGANIZATION_ID=org_...
POLAR_WEBHOOK_SECRET=whsec_...

# Database
CONVEX_DEPLOYMENT=your-deployment
VITE_CONVEX_URL=https://your-deployment.convex.cloud
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
```

#### Tests:
- [x] **Config Validation**: No validation errors
- [x] **Build**: Completes successfully
- [x] **Auth UI**: Sign-in/sign-up buttons visible on homepage
- [x] **Pricing Page**: `/pricing` accessible and displays plans
- [x] **Polar Integration**: Pricing plans load from Polar API
- [x] **Authentication Required**: Must sign in to access payments
- [x] **Checkout Flow**: Payment buttons redirect to Polar after auth
- [x] **Webhook Handler**: Payment webhooks processed correctly
- [x] **Success Page**: `/success` page accessible after payment
- [x] **Dashboard**: Protected dashboard with subscription access
- [x] **Payment Flow**: Complete auth → payment → dashboard flow

---

### 4. 📧 Add Email Configuration
**Config**: Enable auth + convex + payments + email, disable monitoring

```typescript
// config.ts
features: {
  auth: true,
  payments: true,
  convex: true,
  email: true,
  monitoring: false,
}
services: {
  convex: { enabled: true },
  resend: { enabled: true },
}
ui: {
  showPricing: false,
  showDashboard: true,
  showAuth: false,
  showChat: false,
}
```

#### Environment Variables Required:
```bash
CONVEX_DEPLOYMENT=your-deployment
VITE_CONVEX_URL=https://your-deployment.convex.cloud
RESEND_API_KEY=re_...
RESEND_WEBHOOK_SECRET=whsec_...
```

#### Tests:
- [x] **Config Validation**: No validation errors
- [x] **Build**: Completes successfully
- [x] **Email Sending**: `sendTestEmail()` function works
- [x] **Email Webhooks**: `/resend-webhook` endpoint processes events
- [x] **Event Handling**: Email events are logged correctly
- [x] **Dashboard**: Accessible with authentication (email feature requires auth)
- [x] **Test Email Form**: Form appears in dashboard when email enabled
- [x] **Email Delivery**: Test emails sent successfully (check spam folder for sandbox emails)

---

### 5. 🚀 Full SaaS Configuration with OpenStatus for Monitoring
**Config**: Enable all core features (no premium monitoring)

✅ **Completed So Far:**
- [x] Authentication (Clerk)
- [x] Payments (Polar.sh) 
- [x] Database (Convex)
- [x] Email (Resend)

🔄 **Remaining to Test:**
- [ ] Status Monitoring (OpenStatus) - **Only thing left for Full SaaS!**

```typescript
// config.ts - Current Configuration
features: {
  auth: true,        // ✅ COMPLETED
  payments: true,    // ✅ COMPLETED
  convex: true,      // ✅ COMPLETED
  email: true,       // ✅ COMPLETED
  monitoring: false, // Premium feature - see section 6
}
services: {
  clerk: { enabled: true },      // ✅ COMPLETED
  polar: { enabled: true },      // ✅ COMPLETED
  convex: { enabled: true },     // ✅ COMPLETED
  resend: { enabled: true },     // ✅ COMPLETED
  openai: { enabled: false },    // 🔧 OPTIONAL - can enable for AI chat
  sentry: { enabled: false },    // 💎 PREMIUM - see section 6
  openstatus: { enabled: false }, // 🔄 NEXT - only remaining item!
}
ui: {
  showPricing: true,   // ✅ COMPLETED
  showDashboard: true, // ✅ COMPLETED
  showChat: false,     // 🔧 OPTIONAL - set to true if enabling OpenAI
  showAuth: true,      // ✅ COMPLETED
}
```

#### Environment Variables for OpenStatus:
```bash
# Status Monitoring (Final piece for Full SaaS)
OPENSTATUS_API_KEY=your-key
OPENSTATUS_PROJECT_ID=your-project

# Optional: OpenAI for AI Chat (can add anytime)
OPENAI_API_KEY=sk-...
```

#### Completed Tests:
- [x] **Config Validation**: All required env vars validated
- [x] **Build**: Completes without errors
- [x] **Full Auth Flow**: Sign-up → Sign-in → Dashboard
- [x] **Subscription Flow**: Sign-up → Pricing → Checkout → Success
- [x] **Protected Dashboard**: Requires auth and active subscription
- [x] **Email Functionality**: Test email form works in dashboard
- [x] **Webhook Handlers**: All webhook endpoints functional
- [x] **User Management**: Settings page allows profile updates
- [x] **Subscription Management**: Users can view/cancel subscriptions

#### Remaining Tests (OpenStatus Only):
- [ ] **Status Monitoring**: OpenStatus integration works
- [ ] **Health Endpoint**: `/api/health` endpoint responds correctly
- [ ] **Monitor Creation**: Uptime monitors created for main app
- [ ] **Alert Configuration**: Notifications configured for downtime

#### Optional Tests (Can Add Anytime):
- [ ] **AI Chat**: OpenAI integration works in dashboard (if enabled)

---

### 6. 💎 Premium Configuration with Error Monitoring
**Config**: Full SaaS + Premium Sentry error monitoring (requires Convex Pro subscription)

⚠️ **Prerequisites**: This configuration requires a **Convex Pro subscription** ($20/month minimum) for built-in exception reporting integration.

```typescript
// config.ts
features: {
  auth: true,
  payments: true,
  convex: true,
  email: true,
  monitoring: true,  // 👈 Premium feature
}
services: {
  clerk: { enabled: true },
  polar: { enabled: true },
  convex: { enabled: true },
  resend: { enabled: true },
  openai: { enabled: true },
  sentry: { enabled: true },     // 👈 Premium feature
  openstatus: { enabled: true },
}
ui: {
  showPricing: true,
  showDashboard: true,
  showChat: true,
  showAuth: true,
}
```

#### Environment Variables Required:
All variables from Full SaaS Configuration, plus:

```bash
# Premium Error Monitoring (Convex Pro Required)
VITE_SENTRY_DSN=https://...sentry.io/project-id
SENTRY_ENVIRONMENT=development
```

#### Premium Setup Steps:
1. **Upgrade to Convex Pro**: In Convex dashboard → Billing → Upgrade to Pro
2. **Create Sentry project**: At [sentry.io](https://sentry.io) → Choose "Generic" platform  
3. **Configure in Convex**: Dashboard → Settings → Integrations → Exception Reporting
4. **Add Sentry DSN**: Copy from Sentry project settings

#### Tests:
- [ ] **Convex Pro Subscription**: Deployment upgraded to Pro tier
- [ ] **Sentry Project**: Created and configured in Convex dashboard
- [ ] **Automatic Error Reporting**: Backend errors automatically sent to Sentry
- [ ] **Rich Error Metadata**: Errors include function name, request ID, user context
- [ ] **Zero-Code Integration**: No manual error handling required
- [ ] **Frontend Error Tracking**: Optional manual Sentry integration working
- [ ] **All Full SaaS Tests**: Everything from section 5 still works

#### Premium Benefits:
- 🔍 **Automatic error reporting** for all Convex functions
- 📊 **Rich error metadata** (function name, runtime, user context)
- 🚨 **Real-time alerts** for production issues
- 📈 **Performance monitoring** and release tracking
- 🛠️ **Zero-code setup** (no manual error wrapping)

---

## 🎯 Quick Progress Summary

**✅ Completed Configurations:**
- [x] Section 2: Auth-Only Configuration 
- [x] Section 3: Payments Configuration
- [x] Section 4: Email Configuration 
- [x] Section 5: Full SaaS Configuration (95% complete - just need OpenStatus!)

**🔄 Next Steps:**
- Add OpenStatus monitoring to complete Full SaaS
- Optionally add OpenAI for AI chat functionality

**💎 Available Premium Features:**
- Section 6: Premium Sentry error monitoring (requires Convex Pro)

---

## 📝 Documentation Validation

### Config Documentation
- [ ] **README**: Instructions match actual config requirements
- [ ] **Comments**: Config file comments are accurate
- [ ] **Examples**: `config.example.ts` configurations work
- [ ] **Environment Variables**: All required env vars are documented

### Developer Experience
- [ ] **First-time Setup**: New developer can follow setup guide
- [ ] **Error Messages**: Clear error messages for common issues
- [ ] **Debugging**: Adequate logging for troubleshooting
- [ ] **Type Safety**: TypeScript provides good DX

---

## 🚨 Error Scenarios

### Network Failures
- [ ] **Service Unavailable**: App handles service outages gracefully
- [ ] **API Timeouts**: Timeouts are handled appropriately
- [ ] **Rate Limiting**: Rate limit responses are handled
- [ ] **Network Errors**: Network failures don't crash app

### Configuration Errors
- [ ] **Invalid API Keys**: Clear error messages for invalid keys
- [ ] **Missing Services**: Graceful degradation when services unavailable
- [ ] **Version Mismatches**: Handles API version mismatches
- [ ] **CORS Issues**: CORS problems are documented

---

## ✅ Final Verification

Before marking the boilerplate as production-ready:

- [ ] **All Configurations Tested**: Every config.example.ts configuration works
- [ ] **All Services Tested**: Every service integration works
- [ ] **All Features Tested**: Every feature flag works correctly
- [ ] **All UI States Tested**: Every UI combination works
- [ ] **Error Handling**: All error scenarios are handled
- [ ] **Performance**: App performs well under normal load
- [ ] **Security**: No security vulnerabilities introduced
- [ ] **Documentation**: All setup guides are accurate

---

## 📋 Quick Test Commands

```bash
# Run all tests
npm run test:all

# Test specific feature combinations
npm run build && npm run dev

# Validate configuration
npm run typecheck

# Test with different configs
# 1. Edit config.ts
# 2. npm run build
# 3. npm run dev
# 4. Test functionality
```

---

## 🔄 Continuous Testing

For ongoing maintenance:

1. **Monthly**: Run full checklist on latest dependencies
2. **Before Releases**: Run relevant sections for changed features
3. **After Updates**: Test affected service integrations
4. **User Reports**: Add new test cases for reported issues

This checklist ensures your Kaizen boilerplate works reliably for all developers who use it. 