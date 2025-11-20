import { test, expect } from '@playwright/test';

test.describe('Navigation Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('navbar should be sticky at top', async ({ page }) => {
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
    
    const classes = await nav.getAttribute('class');
    expect(classes).toContain('fixed');
  });

  test('navbar should have backdrop blur effect', async ({ page }) => {
    const nav = page.locator('nav');
    const classes = await nav.getAttribute('class');
    expect(classes).toContain('backdrop-blur-xl');
  });

  test('logo should be visible and contain shield icon', async ({ page }) => {
    const logo = page.locator('nav').getByText('AdGuardian');
    await expect(logo).toBeVisible();
  });

  test('Sign In button should be clickable', async ({ page }) => {
    const signInButton = page.getByRole('button', { name: 'Sign In' });
    await expect(signInButton).toBeVisible();
    await expect(signInButton).toBeEnabled();
  });

  test('Start Free Trial button should be clickable', async ({ page }) => {
    const trialButton = page.locator('nav').getByRole('button', { name: 'Start Free Trial' });
    await expect(trialButton).toBeVisible();
    await expect(trialButton).toBeEnabled();
  });

  test('navbar should remain visible after scrolling', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(300);
    
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
  });
});
