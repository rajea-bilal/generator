---
title: 'Overview'
description: 'Modern, production-ready SaaS starter template for building full-stack React applications'
icon: 'K'
---

<Note>
  This page was last updated on: 7th July 2025
</Note>

<Warning>
  **DO NOT upgrade any dependencies in your package.json** for the core stack dependencies (Clerk, Convex, Polar.sh, etc.), unless you have a specific reason to and are following the official migration guides from each service. Upgrading packages without proper migration can break your authentication, database connections, and other critical functionality. The current versions in the boilerplate are tested and stable together.
</Warning>

Repo: https://github.com/code-and-creed/kaizen

## Pre-requisites

1. Frontend Knowledge (Have completed the Frontend section of the Software Engineer Roadmap) so that your base HTML, CSS, JS and React skills are up to par.
2. Fundamental Backend Systems Knowledge (Have completed the [Systems Expert Fundamentals Course](https://www.algoexpert.io/systems/fundamentals) of the Software Engineer Roadmap)
3. Fundamental Tech Stack Knowledge (Have completed the [Kaizen Tech Stack Tutorial](https://youtube.com/playlist?list=PLUxlPfFPDnAEI0roJMdV49n29gFFzmEQ5&feature=shared))

## Tech Stack

- [React Router v7](https://reactrouter.com/) - Modern full-stack React framework with SSR
- [Convex](https://convex.dev/) - Real-time database and serverless functions
- [Clerk](https://clerk.com/) - Authentication as a Service Provider
- [Polar.sh](https://polar.sh/) - Subscription billing and payments
- [Resend](https://resend.com/) - Email as a Service Provider
- [OpenAI](https://openai.com/) - AI chat capabilities (optional)
- [Vercel](https://vercel.com/) - Deployments without worrying about infrastructure (Auto-Scaling, DDoS protection, etc.)

## Cost of running this stack

All of the above services have generous free tiers.

Even as your product grows, the cost remains minimal (averaging $200-300/month with 10,000+ DAUs for 80%+ profit margin).

These 3rd party services abstract away significant infrastructure work in key areas (authentication, database, payments, etc.), letting you focus solely on building your product.


## Building with Kaizen

<Steps>
  <Step title="Prerequisites">
    1. Install the latest stable version of Node.js (If you already have Node.js installed, this will override it):
       - **Mac/Linux**: Install via [nvm](https://github.com/nvm-sh/nvm):
         ```bash
         nvm install stable
         ```

       Verify Node.js is installed:
       ```bash
       node -v
       ```
       Should return something like `v24.x.y` (at the time of writing: 24.6.0)

    2. Install ngrok for webhook testing:
       ```bash
       brew install ngrok
       ```

    3. Create a new empty GitHub repository for your project

       Have the SSH repository URL ready (e.g., `git@github.com:username/repo-name.git`)

       <Note>
         Make sure it's the SSH URL, not the HTTPS URL!
       </Note>

    4. Gather your Development API keys from the following services:

      <Warning>
        If you have your own agency and you're building for a client, you'll need to create all the below accounts for them using your own agency company email account and then transfer ownership to them later when the contract ends.

        See the [Account Management Guide](/agency-related/account-management-guide) for more information on how to do this.
      </Warning>

       - **Clerk** (Authentication)
         - Create an account at [Clerk](https://clerk.com) (or new 'Application' if you already have an account)
         - Create a new Application and select "React Router" as your framework
         - Enable Email/Password and Google authentication methods
         - Copy your `VITE_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` from the 'API Keys' section
         - Add them to somewhere safe (ideally if you're using a clipboard manager, you'll be able to paste them into your `.env` file later)

       - **Convex** (Database)
         - Create an account at [Convex](https://convex.dev)
         - We'll set this up in the next step when you clone the repo

       - **Polar.sh** (Subscriptions) - Optional for initial setup
         - Create an account at [sandbox.polar.sh](https://sandbox.polar.sh)
         - Create a new organization
         - Create a subscription plan
         - Copy your API keys from Settings
         - Add them to somewhere safe

       - **Resend** (Email) - Optional for initial setup
         - Create an account at [Resend](https://resend.com)
         - Generate an API key from the API Keys section
         - Add it to somewhere safe

       - **OpenAI** (AI Chat) - Optional
         - Create an account at [OpenAI](https://openai.com)
         - Generate an API key from the API Keys section
         - Copy your `OPENAI_API_KEY`
         - Add it to somewhere safe
  </Step>

  <Step title="Clone and Setup Project">
    1. Create a fresh repository on GitHub (private - if you want to keep it private)

    2. Clone the Kaizen repository and set up your project:
       ```bash
       git clone https://github.com/code-and-creed/kaizen.git your-project-name
       cd your-project-name
       rm -rf .git
       git init
       git remote add origin your-github-repo-url
       ```

    3. Install dependencies:
       ```bash
       npm install --legacy-peer-deps
       ```

       <Note>
         We use `--legacy-peer-deps` because some packages might have React 18 peer dependencies while we're using React 19.
       </Note>

    4. Copy environment template:
       ```bash
       cp .env.example .env.local
       ```

    5. Verify build works:
       ```bash
       npm run build
       ```
  </Step>

  <Step title="Configure Features Step by Step">
    Kaizen uses a progressive configuration approach where you can enable features one by one. Start with basic configuration and add services as needed.

    ### Start with Static Configuration (No Services)
    
    First, let's make sure everything builds and runs without any external services:

    1. Edit your `config.ts` file to disable all features:
       ```typescript
       features: {
         auth: false,
         payments: false,
         convex: false,
         email: false,
         monitoring: false,
       }
       ```

    2. Test the basic setup:
       ```bash
       npm run build
       npm run dev
       ```

    3. Visit `http://localhost:5173` - you should see the homepage load successfully

    ### Enable Authentication and Convex

    1. Update your `config.ts`:
       ```typescript
       features: {
         auth: true, // Enable authentication
         payments: false,
         convex: true, // Enable convex
         email: false,
         monitoring: false,
       }
       services: {
         convex: { enabled: true }, // Enable convex
         clerk: { enabled: true }, // Enable clerk
       }
       ui: {
         showAuth: true, // Show auth page
         showDashboard: true, // Show dashboard
         showChat: false,
         showPricing: false,
       }
       ```

    2. Set up Convex:
       ```bash
       npx convex dev
       ```
       - Follow prompts to log in to Convex
       - Create a new project when prompted (or select existing)
       - This automatically updates your `.env.local` file env vars (VITE_CONVEX_URL, CONVEX_DEPLOYMENT)
       - Keep this terminal running (Convex development server)

    3. Add your Clerk keys to your `.env.local` file:
       ```env
       VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
       CLERK_SECRET_KEY=sk_test_...

    4. Configure Clerk JWT templates for Convex integration:
       - In Clerk Dashboard: Go to **Configure** → **JWT Templates**
       - Click **New template** → **Convex**
       - Click **Save** (important - don't forget this step!)
       - Copy the **Issuer** URL (looks like `https://your-app.clerk.accounts.dev`)

    5. Configure Convex to use your Clerk JWT template:
       - Go to your Convex project dashboard (Make sure you're on the 'development' environment)
       - Navigate to **Settings** → **Environment Variables**
       - Add: `VITE_CLERK_FRONTEND_API_URL` with the Issuer URL from step 4
       - This enables Convex to verify Clerk JWT tokens

    6. Also add this env var to your `.env.local` file:
       ```env
       NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
       ```

    <Note>
      It's the same as your `VITE_CONVEX_URL`
    </Note>

    7. Shutdown and Restart your development server. Authentication should now be working.

    ### Enable Payments (Polar.sh)

    1. Update your `config.ts`:
       ```typescript
       features: {
         auth: true,
         payments: true, // Enable payments
         convex: true,
         email: false,
         monitoring: false,
       }
       services: {
         clerk: { enabled: true },
         polar: { enabled: true }, // Enable polar.sh
         convex: { enabled: true },
       }
       ui: {
         showAuth: true,
         showDashboard: true,
         showChat: false,
         showPricing: true, // Show pricing page
       }
       ```

    3. Run ngrok:
       ```bash
       ngrok http 5173
       ```
       Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)

    3. Set your local frontend URL in your `.env.local` file:
       ```bash
       FRONTEND_URL=https://abc123.ngrok.io
       ```

    4. Update `vite.config.ts` with the new ngrok URL:
       ```typescript
       export default defineConfig({
        ...
         server: {
            allowedHosts: ["abc123.ngrok.app"],
        ...
       })
       ```

    5. **CRITICAL**: Add the below environment variables to **Convex Dashboard** (not local .env):
       - Go to your Convex project dashboard
       - Navigate to **Settings** → **Environment Variables**
       - Get your Polar variables from the Polar Dashboard:
       
       i) POLAR_ACCESS_TOKEN: Settings -> General -> Developers -> New Token (Select All scopes and Set expiration to None)
       ii)POLAR_ORGANIZATION_ID: Settings -> General -> Profile -> Identifier
       iii) POLAR_SERVER: Set to `sandbox` for development


       ```bash
       POLAR_ACCESS_TOKEN=polar_...
       POLAR_ORGANIZATION_ID=...
       POLAR_SERVER=sandbox
       FRONTEND_URL=https://abc123.ngrok.io  # Your ngrok URL, no trailing slash!
       ```

    6. Configure webhook in Polar Dashboard:
       - Get your Convex HTTP actions URL from dashboard (ends in `.convex.site`)
       - Go to **Settings** → **Webhooks** → **Add Endpoint**
       - URL: `https://your-deployment.convex.site/payments/webhook`
       - Format: **Raw**
       - Click **Generate new secret** and copy it
       - Select all events and click **Create**
       - Copy the webhook secret and add it to your Convex Environment Variables:
       ```bash
       POLAR_WEBHOOK_SECRET=whsec_...
       ```

    8. Test payments:
       - Use your ngrok URL in browser (not localhost)
       - Sign up/login with test account
       - Click on the plan you created
       - Use test card: `4242 4242 4242 4242`, any future date, any CVC
       - Verify redirect to success page and dashboard access

    ### Deploy to Production

    <Note>
      Pre-Requisite: You need to have purchased a domain already
    </Note>

    Once your app works locally, we can deploy to production

    1. Setup Clerk for Production
    
    i) Create a production instance of your Clerk app in your Clerk Dashboard (use your purchased domain)
    ii) Set the DNS properties for your domain provider
    iii) Create a JWT template that same way you did for Development
    iv) Copy the API keys

    2. Setup Polar for Production
    
    i) Create the same products (if applicable) in your production polar.sh dashboard
    ii) Create/Copy all the same variables you did when developing locally (POLAR_ACCESS_TOKEN, POLAR_ORGANIZATION_ID, POLAR_WEBHOOK_SECRET)
    iii) Set POLAR_SERVER to `production` in your production environment variables

    <Note>
      For POLAR_WEBHOOK_SECRET, use https://your-prod-name.convex.site/payments/webhook`
    </Note>

    3. Setup Convex for Production

    i) Switch to the 'Production' environment for your project in your Convex Dashboard
    ii) Set all the environment variables the same way they are set in your development environment

    4. Create a new project in your Vercel account

    2. Select your github repo and set the 'Build Command' to:
    ```
    npx convex deploy --cmd 'npm run build'
    ```

    3. Set your Environment Variables

    i) Copy your Environment Variables in .env.local and paste into the Environment Variables area

    ii) Update your Clerk env vars to be the production API keys from your production Clerk app you just created.

    ii) Update your CONVEX_DEPLOYMENT key to be the prod name: i.e. `prod:...`

    iii) Update your VITE_CONVEX_URL to be your prod name: i.e. `https://your-prod-name.convex.cloud`

    iv) Set up the CONVEX_DEPLOY_KEY environment variable

    Go to your project's Settings page. Click the Generate Production Deploy Key button to generate a Production deploy key. Then click the copy button to copy the key.

    Back in Vercel, add an environment variable below the others, named CONVEX_DEPLOY_KEY and paste in your deploy key.

    iii) Now you can click 'Deploy'

    ### Enable Email (Resend)

    1. Update your `config.ts`:
       ```typescript
       features: {
         auth: true,
         payments: true,
         convex: true,
         email: true, // Enable email
         monitoring: false,
       }
       services: {
         clerk: { enabled: true },
         polar: { enabled: true },
         convex: { enabled: true },
         resend: { enabled: true },
       }
       ```

    2. Create Resend account:
       - Go to [resend.com](https://resend.com) and create an account
       - Generate an API key from **API Keys** section (select **Full Access**)
       - Copy the API key (starts with `re_`)
    
    3. Choose your email setup approach:
       
       **Option A: Quick Testing (No Domain Required)**
       - Use Resend's built-in sandbox domain
       - Sender email: `onboarding@resend.dev` (works immediately)
       - Can only send to your Resend account email address
       
       **Option B: Custom Domain (Production Ready)**
       - Verify your own domain for branded emails
       - Go to **Domains** → **Add Domain** → Enter your domain
       - Add required DNS records (TXT, MX, CNAME) to your domain registrar
       - Wait for verification (can take minutes to hours)
       - Sender email: `noreply@yourdomain.com` (after verification)

    3. **CRITICAL**: Add environment variables to **Convex Dashboard** (not local .env):
       - Go to your Convex project dashboard
       - Navigate to **Settings** → **Environment Variables**
       - Add these variables:
       ```bash
       RESEND_API_KEY=re_...
       SENDER_EMAIL=onboarding@resend.dev  # Use this for testing
       # OR (after domain verification)
       SENDER_EMAIL=noreply@yourdomain.com  # Use this for production
       COMPANY_NAME=Your Company Name
       ```

    4. Set up webhook for email events:
       - Get your Convex HTTP actions URL (ends in `.convex.site`)
       - In Resend dashboard → **Webhooks** → **Add Endpoint**
       - URL: `https://your-deployment.convex.site/resend-webhook`
       - Enable all `email.*` events
       - Copy webhook secret and add it to your Convex Environment Variables:
       ```bash
       RESEND_WEBHOOK_SECRET=whsec_...
       ```

    5. Test email functionality:
       - Navigate to `/dashboard` (must be authenticated)
       - Find the "Test Email" form in dashboard
       - **Important**: For local development, use your Resend account email address as recipient!
       - Send test email and check spam folder (sandbox emails often go there)
       - Verify success in Resend dashboard → **Logs**

    <Note>
      🎉 Hooray! You’ve now successfully configured your app. You’re ready to start building and shipping features.
    </Note>

    ### Enable AI Chat (OpenAI) - Optional
    
    1. Add OpenAI API key:
       ```env
       OPENAI_API_KEY=sk-...
       ```

    2. Update your `config.ts`:
       ```typescript
       services: {
         openai: { enabled: true }, // Enable openai
       }
       ui: {
         showChat: true,  // Show AI chat in dashboard
       }
       ```

    3. Add your OpenAI API key to your Convex Environment Variables:
       - Go to your Convex project dashboard
       - Navigate to **Settings** → **Environment Variables**
       - Add: `OPENAI_API_KEY=sk-...`

    <Warning>
      **Important: When returning to work on your project**
      
      Start these in three separate terminals:
      - Terminal 1:
        ```bash
        npm run dev
        ```
      - Terminal 2:
        ```bash
        npx convex dev
        ```
      - Terminal 3 (only when testing webhooks like payments):
        ```bash
        ngrok http 5173  # or your Vite dev port
        ```
      
      Each time you restart ngrok, it generates a new URL. You must:
      1. Update the `FRONTEND_URL` in your `.env.local` file with the new ngrok URL
      2. Update your Convex environment variable `FRONTEND_URL` with the new ngrok URL
      3. Update `vite.config.ts` → `server.allowedHosts` with the new ngrok host (same as initial setup)
      4. Restart both your Convex dev server and your app dev server after those changes
      
      Failing to update these will cause webhooks to fail silently!
    </Warning>

    <Note>
      ngrok is only required when testing webhooks (e.g., payments, emails). After completing a local subscription test, you can switch your browser back to `http://localhost:5173` immediately; no server restarts are needed. Keep ngrok running only when you need to receive webhooks.
    </Note>
  </Step>

  <Step title="Building the Product">
    At this point, you should have a clean and beautiful landing page that explains the product and what it does, with authentication and optionally payments configured.

    Now it's time to add the main functionality of your product:
    
    1. **Dashboard**: Users get redirected here after signing up
    2. **Core Features**: The main value proposition of your SaaS
    3. **Settings**: User profile management and subscription handling

    We've got a dedicated guide page related to building clean and beautiful UIs very quickly: [Rapid UI Prototyping](/building-with-kaizen/rapid-ui-prototyping)

    See the 'The v0 + Cursor Workflow (Recommended)' section
  </Step>

  <Step title="Testing Your Application">
    Kaizen includes comprehensive testing setup with Vitest and Playwright:

    ### Run All Tests
    ```bash
    npm run test:all
    ```

    ### Unit Tests (Development)
    ```bash
    npm run test:watch    # Watch mode
    npm run test:ui       # Visual UI
    ```

    ### End-to-End Tests
    ```bash
    npm run test:e2e      # Run once
    npm run test:e2e:ui   # Interactive UI
    ```

    <Note>
      Tests are configured as non-blocking by default, meaning deployments can proceed even if tests fail. This ensures development velocity while still providing test feedback.
    </Note>
  </Step>

  <Step title="Deploying the App to Production">
    <Warning>
      You'll need to purchase a domain before deploying to production. Services like Clerk and Polar require a verified domain for production environments. Purchase a domain from providers like Namecheap, Porkbun, GoDaddy, or Google Domains before proceeding with production deployment.
    </Warning>

    When you're ready to deploy your application to production, follow our comprehensive deployment guide:
    
    [Deploy to Production Guide](/building-with-kaizen/deploy-to-production)
    
    The guide covers everything you need for a successful production deployment:
    - Domain purchase and setup
    - Production database configuration (Convex)
    - Production authentication setup (Clerk)
    - Production subscription setup (Polar.sh)
    - Vercel deployment
    - Post-deployment verification
  </Step>
</Steps>