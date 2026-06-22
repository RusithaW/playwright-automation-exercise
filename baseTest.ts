// tests/baseTest.ts
import { test as base } from '@playwright/test';

// This intercepts network requests to abort annoying Google ads/popups
export const test = base.extend({
  page: async ({ page }, use) => {
    await page.route('**/*google*/**', route => route.abort());
    await page.route('**/*analytics*/**', route => route.abort());
    await page.route('**/*doubleclick*/**', route => route.abort());
    await use(page);
  },
});

export { expect } from '@playwright/test';