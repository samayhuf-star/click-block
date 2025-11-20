import { test, expect } from '@playwright/test';

test.describe('Visual Regression Tests', () => {
  test('landing page should match screenshot', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('landing-page.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('hero section should match screenshot', async ({ page }) => {
    await page.goto('/');
    
    const heroSection = page.locator('section').first();
    await expect(heroSection).toHaveScreenshot('hero-section.png', {
      animations: 'disabled',
    });
  });

  test('features section should match screenshot', async ({ page }) => {
    await page.goto('/');
    
    const featuresSection = page.getByText('Comprehensive Protection').locator('..');
    await expect(featuresSection).toHaveScreenshot('features-section.png', {
      animations: 'disabled',
    });
  });

  test('mobile view should match screenshot', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('mobile-view.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('tablet view should match screenshot', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('tablet-view.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('desktop view should match screenshot', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('desktop-view.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });
});
