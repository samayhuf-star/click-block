import { test, expect } from '@playwright/test';

test.describe('Performance Tests', () => {
  test('page should load within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(3000); // Should load in under 3 seconds
  });

  test('page should not have console errors', async ({ page }) => {
    const errors: string[] = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.goto('/');
    await page.waitForTimeout(2000);
    
    expect(errors).toHaveLength(0);
  });

  test('page should not have failed network requests', async ({ page }) => {
    const failedRequests: string[] = [];
    
    page.on('requestfailed', request => {
      failedRequests.push(request.url());
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    expect(failedRequests).toHaveLength(0);
  });

  test('images should load successfully', async ({ page }) => {
    await page.goto('/');
    
    const images = page.locator('img');
    const count = await images.count();
    
    for (let i = 0; i < count; i++) {
      const isVisible = await images.nth(i).isVisible();
      expect(isVisible).toBeTruthy();
    }
  });

  test('CSS should load without errors', async ({ page }) => {
    const cssErrors: string[] = [];
    
    page.on('response', response => {
      if (response.url().includes('.css') && !response.ok()) {
        cssErrors.push(response.url());
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    expect(cssErrors).toHaveLength(0);
  });

  test('JavaScript should load without errors', async ({ page }) => {
    const jsErrors: string[] = [];
    
    page.on('response', response => {
      if (response.url().includes('.js') && !response.ok()) {
        jsErrors.push(response.url());
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    expect(jsErrors).toHaveLength(0);
  });
});
