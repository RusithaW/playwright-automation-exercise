/// <reference types="node" />
import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if test.only is left in source code */
  forbidOnly: !!process.env.CI,
  /* Retry on CI */
  retries: process.env.CI ? 2 : 0,
  /* Allow 2 parallel workers on CI for optimal speed without overloading free runners */
  workers: process.env.CI ? 2 : undefined,
  /* Multi-reporter: Console list + HTML + JUnit for CI tab integration */
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['junit', { outputFile: 'results/results.xml' }],
  ],

  /* Global Timeouts */
  timeout: 60000, // 60 seconds total test limit
  expect: {
    timeout: 10000, // 10 seconds for UI element assertions
  },

  /* Shared defaults across projects */
  use: {
    launchOptions: {
      args: ['--disable-blink-features=AutomationControlled'],
    },
    testIdAttribute: 'data-qa',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15000,
    navigationTimeout: 30000,
  },

  /* Completely isolated projects for UI and API execution */
  projects: [
    {
      name: 'ui-chrome',
      testDir: './tests/ui',
      testMatch: /.*\.spec\.ts/,          // <--- Updated to match all .spec.ts files
      testIgnore: /.*\.api\.spec\.ts/,     // <--- Ignores any API specs if present in UI directory
      use: {
        ...devices['Desktop Chrome'],
        baseURL: process.env.UI_BASE_URL || 'https://automationexercise.com',
      },
    },
    {
      name: 'api',
      testDir: './tests/api',
      testMatch: /.*\.api\.spec\.ts/,
      use: {
        baseURL: process.env.API_BASE_URL || 'https://automationexercise.com/api',
        extraHTTPHeaders: {
          'Accept': 'application/json',
        },
      },
    },
  ],
});