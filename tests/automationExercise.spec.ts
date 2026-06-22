import { test, expect } from '@playwright/test';

test('Verify home page loads and has correct title', async ({ page }) => {
  // Go to the home page
  await page.goto('https://automationexercise.com/');

  // Expect the title to contain "Automation Exercise"
  await expect(page).toHaveTitle(/Automation Exercise/);
});