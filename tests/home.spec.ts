/// <reference types="node" />
import { test, expect } from '../baseTest';
import { AuthActions } from '../pages/actions/AuthActions';
import { HomeActions } from '../pages/actions/HomeActions';
import * as path from 'path';

test.describe('Home Page Navigation and Test Cases', () => {
    let authActions: AuthActions;
    let homeActions: HomeActions;

    test.beforeEach(({ page }) => {
        authActions = new AuthActions(page);
        homeActions = new HomeActions(page);
    });

    test('Test Case 7: Navigate to Test Cases Page', async ({ page }) => {
        // Navigate to the application landing page and verify visibility
        await authActions.navigateToHome();
        await expect(authActions.authLocators.homeFeaturedItems).toBeVisible();

        // Navigate to the Test Cases view and verify the section header
        await homeActions.navigateToTestCases();
        await expect(homeActions.homeLocators.testCasesHeader).toHaveText('Test Cases');
    });

    test('Test Case 25: Verify Scroll Up using \'Arrow\' button and Scroll Down functionality', async ({ page }) => {
        // 1-2. Launch browser & Navigate to url
        await authActions.navigateToHome();

        // 3. Verify that home page is visible successfully
        await expect(authActions.authLocators.homeFeaturedItems).toBeVisible();

        // 4. Scroll down page to bottom
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

        // 5. Verify 'SUBSCRIPTION' is visible
        const subscriptionHeader = page.locator('h2', { hasText: 'Subscription' });
        await expect(subscriptionHeader).toBeVisible();

        // 6. Click on arrow at bottom right side to move upward
        const scrollUpButton = page.locator('#scrollUp');
        await expect(scrollUpButton).toBeVisible();
        await scrollUpButton.click();

        // 7. Verify that page is scrolled up and text is visible on screen
        const topBannerHeader = page.locator('h2:has-text("Full-Fledged practice website for Automation Engineers")').first();
        await expect(topBannerHeader).toBeVisible();
    });
});