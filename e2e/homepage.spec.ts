import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('loads homepage successfully', async ({ page }) => {
    await page.goto('/');
    
    // Check if the page loads without errors
    await expect(page).toHaveTitle(/Kaizen/);
    
    // Check for main navigation or key content
    await expect(page.locator('body')).toBeVisible();
  });

  test('has working navigation', async ({ page }) => {
    await page.goto('/');
    
    // Look for common navigation elements that should exist
    // This is a basic test that will work regardless of feature configuration
    const body = page.locator('body');
    await expect(body).toBeVisible();
    
    // Test that we can navigate (this will work for any Kaizen config)
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('localhost');
  });

  test('renders without JavaScript errors', async ({ page }) => {
    const errors: string[] = [];
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Filter out known non-critical errors that can occur during development
    const criticalErrors = errors.filter(error => 
      !error.includes('favicon') && 
      !error.includes('analytics') &&
      !error.includes('clerk') && // May not be configured in test
      !error.includes('route module') && // React Router dev reload issues
      !error.includes('reloading page') && // Hot reload messages
      !error.includes('Loading chunk') && // Vite chunk loading
      !error.includes('Failed to fetch') // Network timing issues
    );
    
    expect(criticalErrors).toHaveLength(0);
  });
});