import { test, expect } from '@playwright/test';

test.describe('AdGuardian Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the main heading', async ({ page }) => {
    await expect(page.getByText('Stop Wasting Money on')).toBeVisible();
    await expect(page.getByText('Click Fraud')).toBeVisible();
  });

  test('should display navigation bar', async ({ page }) => {
    await expect(page.getByText('AdGuardian')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Start Free Trial' })).toBeVisible();
  });

  test('should display hero section with description', async ({ page }) => {
    await expect(page.getByText('Protect your Google Ads campaigns from fraudulent clicks, bots, and competitors.')).toBeVisible();
  });

  test('should display CTA buttons', async ({ page }) => {
    const trialButton = page.getByRole('button', { name: /Start 14-Day Free Trial/i });
    const demoButton = page.getByRole('button', { name: /View Live Demo/i });
    
    await expect(trialButton).toBeVisible();
    await expect(demoButton).toBeVisible();
  });

  test('should display statistics section', async ({ page }) => {
    await expect(page.getByText('99.9%')).toBeVisible();
    await expect(page.getByText('Detection Accuracy')).toBeVisible();
    
    await expect(page.getByText('$2.5M+')).toBeVisible();
    await expect(page.getByText('Ad Spend Protected')).toBeVisible();
    
    await expect(page.getByText('500K+')).toBeVisible();
    await expect(page.getByText('Fraudulent Clicks Blocked')).toBeVisible();
    
    await expect(page.getByText('24/7')).toBeVisible();
    await expect(page.getByText('Real-Time Protection')).toBeVisible();
  });

  test('should display features section', async ({ page }) => {
    await expect(page.getByText('Comprehensive Protection')).toBeVisible();
    await expect(page.getByText('Everything you need to stop click fraud')).toBeVisible();
    
    await expect(page.getByText('Real-Time Detection')).toBeVisible();
    await expect(page.getByText('Multi-Site Management')).toBeVisible();
    await expect(page.getByText('Detailed Analytics')).toBeVisible();
  });

  test('should display CTA section', async ({ page }) => {
    await expect(page.getByText('Ready to Protect Your Ad Spend?')).toBeVisible();
    await expect(page.getByText('Join thousands of companies using AdGuardian to stop click fraud')).toBeVisible();
  });

  test('should display footer', async ({ page }) => {
    await expect(page.getByText('© 2024 AdGuardian. All rights reserved.')).toBeVisible();
  });

  test('CTA buttons should have correct styling', async ({ page }) => {
    const trialButton = page.getByRole('button', { name: /Start 14-Day Free Trial/i }).first();
    
    // Check if button has gradient background classes
    const classes = await trialButton.getAttribute('class');
    expect(classes).toContain('bg-gradient-to-r');
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    await expect(page.getByText('AdGuardian')).toBeVisible();
    await expect(page.getByText('Stop Wasting Money on')).toBeVisible();
  });

  test('should be responsive on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    
    await expect(page.getByText('AdGuardian')).toBeVisible();
    await expect(page.getByText('Stop Wasting Money on')).toBeVisible();
  });

  test('should be responsive on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    await expect(page.getByText('AdGuardian')).toBeVisible();
    await expect(page.getByText('Stop Wasting Money on')).toBeVisible();
  });
});
