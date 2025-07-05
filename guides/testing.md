# 🧪 Testing Guide

This guide covers how to write and run tests in the Kaizen application using Vitest for unit testing and Playwright for end-to-end testing.

## Overview

Kaizen includes a comprehensive testing setup with:
- **Unit Tests**: Vitest + React Testing Library for component and utility testing
- **End-to-End Tests**: Playwright for full application testing
- **Type-Safe Testing**: Full TypeScript support in all test files
- **Fast Feedback**: Watch mode and UI tools for development

## Quick Start

### Run All Tests
```bash
npm run test:all
```

### Run Unit Tests
```bash
npm run test          # Run once
npm run test:watch    # Watch mode
npm run test:ui       # Visual UI
```

### Run E2E Tests
```bash
npm run test:e2e      # Run once
npm run test:e2e:ui   # Interactive UI
```

## File Structure

```
kaizen/
├── test/                     # Unit test files
│   ├── setup.ts             # Test setup and global mocks
│   ├── components/           # Component tests
│   │   └── ui/
│   │       └── button.test.tsx
│   └── lib/                  # Utility tests
│       └── utils.test.ts
├── e2e/                      # End-to-end tests
│   └── homepage.spec.ts
├── vitest.config.ts          # Vitest configuration
└── playwright.config.ts     # Playwright configuration
```

## Unit Testing with Vitest

### Writing Component Tests

Create test files in the `test/` directory mirroring your component structure:

```typescript
// test/components/ui/button.test.tsx
import { render, screen } from '@testing-library/react';
import { Button } from '../../../app/components/ui/button';

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('applies variant classes correctly', () => {
    render(<Button variant="secondary">Secondary Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-secondary');
  });

  it('can be disabled', () => {
    render(<Button disabled>Disabled Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });
});
```

### Testing Utilities and Functions

```typescript
// test/lib/utils.test.ts
import { cn } from '../../app/lib/utils';

describe('Utils', () => {
  describe('cn function', () => {
    it('merges class names correctly', () => {
      const result = cn('base-class', 'additional-class');
      expect(result).toContain('base-class');
      expect(result).toContain('additional-class');
    });

    it('handles conditional classes', () => {
      const isActive = true;
      const result = cn('base-class', isActive && 'active-class');
      expect(result).toContain('base-class');
      expect(result).toContain('active-class');
    });
  });
});
```

### Testing Components with Configuration

When testing components that depend on the Kaizen config system:

```typescript
// test/components/feature-dependent.test.tsx
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

// Mock the config
vi.mock('../../config', () => ({
  isFeatureEnabled: (feature: string) => feature === 'auth',
  isServiceEnabled: (service: string) => service === 'clerk',
}));

import { YourComponent } from '../../app/components/YourComponent';

describe('YourComponent', () => {
  it('renders auth features when enabled', () => {
    render(<YourComponent />);
    expect(screen.getByText(/sign in/i)).toBeInTheDocument();
  });
});
```

### Testing Hooks

```typescript
// test/hooks/use-mobile.test.ts
import { renderHook } from '@testing-library/react';
import { useMobile } from '../../app/hooks/use-mobile';

describe('useMobile', () => {
  it('returns false on desktop', () => {
    Object.defineProperty(window, 'innerWidth', { value: 1024 });
    const { result } = renderHook(() => useMobile());
    expect(result.current).toBe(false);
  });
});
```

## End-to-End Testing with Playwright

### Writing E2E Tests

Create test files in the `e2e/` directory:

```typescript
// e2e/homepage.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('loads homepage successfully', async ({ page }) => {
    await page.goto('/');
    
    // Check if the page loads without errors
    await expect(page).toHaveTitle(/Kaizen/);
    await expect(page.locator('body')).toBeVisible();
  });

  test('has working navigation', async ({ page }) => {
    await page.goto('/');
    
    // Test navigation that works regardless of feature configuration
    const body = page.locator('body');
    await expect(body).toBeVisible();
    
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('localhost');
  });
});
```

### Testing Feature-Dependent Flows

```typescript
// e2e/auth-flow.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Only run if auth is enabled
    await page.goto('/');
    const signInButton = page.locator('text=Sign In');
    await test.skip(!await signInButton.isVisible(), 'Auth is not enabled');
  });

  test('can navigate to sign in page', async ({ page }) => {
    await page.click('text=Sign In');
    await expect(page).toHaveURL(/.*sign-in/);
  });
});
```

### Testing API Endpoints

```typescript
// e2e/api.spec.ts
import { test, expect } from '@playwright/test';

test.describe('API Endpoints', () => {
  test('health check endpoint responds', async ({ request }) => {
    const response = await request.get('/api/health');
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty('status', 'healthy');
  });
});
```

## Best Practices

### Unit Testing

1. **Test Behavior, Not Implementation**
   ```typescript
   // ✅ Good - tests behavior
   expect(screen.getByRole('button')).toBeInTheDocument();
   
   // ❌ Bad - tests implementation
   expect(wrapper.find('.button-class')).toHaveLength(1);
   ```

2. **Use Descriptive Test Names**
   ```typescript
   // ✅ Good
   it('shows error message when form submission fails')
   
   // ❌ Bad
   it('test error handling')
   ```

3. **Group Related Tests**
   ```typescript
   describe('Button Component', () => {
     describe('when disabled', () => {
       it('shows disabled styling')
       it('prevents click events')
     })
   })
   ```

4. **Mock External Dependencies**
   ```typescript
   vi.mock('../../api/client', () => ({
     fetchUser: vi.fn().mockResolvedValue({ id: 1, name: 'Test User' })
   }));
   ```

### E2E Testing

1. **Use Page Object Model for Complex Flows**
   ```typescript
   // e2e/pages/auth.page.ts
   export class AuthPage {
     constructor(private page: Page) {}
     
     async signIn(email: string, password: string) {
       await this.page.fill('[data-testid=email]', email);
       await this.page.fill('[data-testid=password]', password);
       await this.page.click('[data-testid=sign-in-button]');
     }
   }
   ```

2. **Use Data Test IDs for Stability**
   ```typescript
   // ✅ Good - stable selector
   await page.click('[data-testid=submit-button]');
   
   // ❌ Bad - fragile selector
   await page.click('.btn.btn-primary');
   ```

3. **Test Cross-Browser Compatibility**
   ```typescript
   test.describe('Cross-browser tests', () => {
     ['chromium', 'firefox', 'webkit'].forEach(browserName => {
       test(`works in ${browserName}`, async ({ page }) => {
         // Test logic
       });
     });
   });
   ```

## Configuration Testing

### Testing Different Feature Configurations

```typescript
// test/config-scenarios.test.tsx
import { render } from '@testing-library/react';
import { vi } from 'vitest';

describe('App with different configurations', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders correctly with auth disabled', () => {
    vi.mock('../config', () => ({
      isFeatureEnabled: () => false,
      isServiceEnabled: () => false,
    }));
    
    const { container } = render(<App />);
    expect(container).toMatchSnapshot();
  });

  it('renders correctly with all features enabled', () => {
    vi.mock('../config', () => ({
      isFeatureEnabled: () => true,
      isServiceEnabled: () => true,
    }));
    
    const { container } = render(<App />);
    expect(container).toMatchSnapshot();
  });
});
```

## Running Tests in CI/CD

### GitHub Actions Integration

Kaizen includes two separate workflows:

1. **Tests Workflow** (`.github/workflows/test.yml`): Runs on all pushes and PRs
2. **Deploy Workflow** (`.github/workflows/deploy.yml`): Runs on pushes to main

### Non-Blocking Tests

**Important**: Tests are configured as **non-blocking** by default. This means:

- ✅ PRs can be merged even if tests fail
- ✅ Deployments to production proceed regardless of test status
- ✅ Test results are still visible and reported
- ✅ Build failures will still block deployment (as they should)

This approach ensures that:
- **Development velocity** isn't blocked by flaky tests
- **Deployments** can proceed even with failing tests
- **Test feedback** is still provided for quality assurance

### Test Workflow Configuration

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    continue-on-error: true  # Don't block on test failures
    
    steps:
      - name: Run unit tests
        run: npm run test
        continue-on-error: true  # Tests won't block workflow
      
      - name: Run E2E tests
        run: npm run test:e2e
        continue-on-error: true  # E2E tests won't block workflow
      
      - name: Build application
        run: npm run build
        continue-on-error: false  # Build failures DO block workflow
```

### Deployment Workflow

The deployment workflow is completely separate and focuses only on building and deploying:

```yaml
# Runs independently of test results
jobs:
  deploy:
    steps:
      - name: Build application
        run: npm run build
      
      - name: Upload source maps to Sentry
        # Deployment continues even if this fails
        continue-on-error: true
```

### Vercel Integration

**Vercel automatically deploys** when you push to the main branch, regardless of GitHub Actions status. This means:

- ✅ Vercel deployments are **never blocked** by test failures
- ✅ GitHub Actions runs in parallel with Vercel deployment
- ✅ Both testing and deployment happen simultaneously
- ✅ You get test feedback without deployment delays

To modify this behavior (if needed):
1. Go to your Vercel project settings
2. Navigate to "Git" settings
3. Configure "Ignored Build Step" if you want to make deployments conditional

### Making Tests Blocking (Optional)

If you prefer to make tests block deployments, you can:

1. **Remove `continue-on-error: true`** from the test workflow
2. **Configure Vercel** to wait for GitHub Actions
3. **Add branch protection rules** requiring tests to pass

```yaml
# To make tests blocking, remove continue-on-error
jobs:
  test:
    runs-on: ubuntu-latest
    # continue-on-error: true  # Remove this line
```

## Debugging Tests

### Debugging Unit Tests

1. **Use Vitest UI**
   ```bash
   npm run test:ui
   ```

2. **Add Debug Statements**
   ```typescript
   import { screen, render } from '@testing-library/react';
   
   render(<Component />);
   screen.debug(); // Prints DOM to console
   ```

3. **Use VS Code Debugger**
   Add breakpoints and run with debugger attached.

### Debugging E2E Tests

1. **Use Playwright UI Mode**
   ```bash
   npm run test:e2e:ui
   ```

2. **Enable Headed Mode**
   ```typescript
   test.use({ headless: false });
   ```

3. **Add Screenshots on Failure**
   ```typescript
   test.afterEach(async ({ page }, testInfo) => {
     if (testInfo.status !== testInfo.expectedStatus) {
       await page.screenshot({ 
         path: `screenshots/${testInfo.title}.png` 
       });
     }
   });
   ```

## Coverage Reports

Generate test coverage reports:

```bash
npm run test:coverage
```

View coverage in your browser:
```bash
open coverage/index.html
```

## Troubleshooting

### Common Issues

1. **Import Path Errors**
   - Make sure `vitest.config.ts` includes `tsconfigPaths()` plugin
   - Use relative imports in test files

2. **Component Rendering Issues**
   - Check if components depend on providers (Router, Theme, etc.)
   - Mock external dependencies appropriately

3. **E2E Test Timeouts**
   - Increase timeout in `playwright.config.ts`
   - Use `page.waitForLoadState()` appropriately

4. **Browser Download Issues**
   - Run `npx playwright install` to download browsers
   - Check network connectivity and permissions

### Environment-Specific Issues

1. **CI Environment**
   - Use `forbidOnly: !!process.env.CI` in Playwright config
   - Set appropriate timeouts for CI environment

2. **Local Development**
   - Ensure dev server is running for E2E tests
   - Use `reuseExistingServer: !process.env.CI` in Playwright config

## Advanced Testing Patterns

### Testing with React Router

```typescript
import { createMemoryRouter, RouterProvider } from 'react-router';
import { render } from '@testing-library/react';

function renderWithRouter(component: React.ReactElement, initialEntries = ['/']) {
  const router = createMemoryRouter([
    { path: '*', element: component }
  ], { initialEntries });
  
  return render(<RouterProvider router={router} />);
}
```

### Testing with Context Providers

```typescript
function renderWithProviders(
  ui: React.ReactElement,
  options: { initialState?: any } = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <ThemeProvider>
        <ConfigProvider value={mockConfig}>
          {children}
        </ConfigProvider>
      </ThemeProvider>
    );
  }
  
  return render(ui, { wrapper: Wrapper, ...options });
}
```

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## Example Test Commands

```bash
# Run all tests
npm run test:all

# Run unit tests in watch mode
npm run test:watch

# Run specific test file
npm run test -- button.test.tsx

# Run E2E tests in headed mode
npm run test:e2e -- --headed

# Run tests with specific tag
npm run test:e2e -- --grep="auth"

# Debug specific test
npm run test:e2e:ui
```

Happy testing! 🧪✨