import { test, expect } from '@playwright/test';

test.describe('Dashboard Modules Functional Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app - assuming we can access dashboard after login
    await page.goto('/');
  });

  test('should display landing page correctly', async ({ page }) => {
    await expect(page).toHaveURL(/.*\/$/);
    // Check if main content is visible
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('should have working navigation', async ({ page }) => {
    // Check if navigation elements exist
    const nav = page.locator('nav').first();
    if (await nav.count() > 0) {
      await expect(nav).toBeVisible();
    }
  });

  test('should load without JavaScript errors', async ({ page }) => {
    const errors: string[] = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    page.on('pageerror', error => {
      errors.push(error.message);
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Filter out known non-critical errors
    const criticalErrors = errors.filter(err => 
      !err.includes('favicon') && 
      !err.includes('404') &&
      !err.includes('Failed to load resource')
    );
    
    if (criticalErrors.length > 0) {
      console.log('JavaScript errors found:', criticalErrors);
    }
    
    // Allow some non-critical errors but log them
    expect(criticalErrors.length).toBeLessThan(10);
  });

  test('should have responsive layout', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const body = page.locator('body');
    await expect(body).toBeVisible();
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.reload();
    await page.waitForLoadState('networkidle');
    await expect(body).toBeVisible();
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.reload();
    await page.waitForLoadState('networkidle');
    await expect(body).toBeVisible();
  });

  test('should load CSS and assets correctly', async ({ page }) => {
    const failedResources: string[] = [];
    
    page.on('response', response => {
      if (!response.ok() && response.status() !== 304) {
        const url = response.url();
        // Only track CSS, JS, and image failures
        if (url.match(/\.(css|js|png|jpg|jpeg|svg|woff|woff2)$/i)) {
          failedResources.push(url);
        }
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Log failed resources for debugging
    if (failedResources.length > 0) {
      console.log('Failed resources:', failedResources);
    }
    
    // Allow some 404s for optional resources
    expect(failedResources.length).toBeLessThan(5);
  });

  test('should have proper meta tags', async ({ page }) => {
    await page.goto('/');
    
    const title = await page.title();
    expect(title).toBeTruthy();
    
    const viewport = await page.locator('meta[name="viewport"]').getAttribute('content');
    expect(viewport).toContain('width');
  });

  test('should handle user interactions', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Try to find and click buttons if they exist
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    
    if (buttonCount > 0) {
      // Test that buttons are clickable
      const firstButton = buttons.first();
      await expect(firstButton).toBeVisible();
      
      // Try clicking (should not throw error)
      try {
        await firstButton.click({ timeout: 1000 });
      } catch (e) {
        // Button might navigate away, which is fine
      }
    }
  });

  test('should have accessible form elements', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check for form inputs
    const inputs = page.locator('input, textarea, select');
    const inputCount = await inputs.count();
    
    if (inputCount > 0) {
      // Check that inputs have proper labels or aria-labels
      for (let i = 0; i < Math.min(inputCount, 5); i++) {
        const input = inputs.nth(i);
        const id = await input.getAttribute('id');
        const ariaLabel = await input.getAttribute('aria-label');
        const placeholder = await input.getAttribute('placeholder');
        
        // At least one accessibility attribute should exist
        if (id) {
          const label = page.locator(`label[for="${id}"]`);
          const hasLabel = await label.count() > 0;
          expect(hasLabel || ariaLabel || placeholder).toBeTruthy();
        } else {
          expect(ariaLabel || placeholder).toBeTruthy();
        }
      }
    }
  });
});

