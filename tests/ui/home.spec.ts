/// <reference types="node" />
import { test, expect } from '../../fixtures/uiFixtures';

test.describe('Home Page Navigation and Test Cases', () => {

    test('Test Case 7: Navigate to Test Cases Page', async ({ homePage }) => {
        // 1. Navigate to home and verify landing page
        await homePage.navigateToHome();
        await expect(homePage.featuredItems).toBeVisible();

        // 2. Navigate to Test Cases and verify header
        await homePage.navigateToTestCases();
        await expect(homePage.testCasesHeader).toHaveText('Test Cases');
    });

    test('Test Case 25: Verify Scroll Up using \'Arrow\' button and Scroll Down functionality', async ({ homePage }) => {
        // 1-3. Navigate to home page and verify visibility
        await homePage.navigateToHome();
        await expect(homePage.featuredItems).toBeVisible();

        // 4-5. Scroll down to bottom and verify subscription section
        await homePage.scrollToBottom();
        await expect(homePage.subscriptionText).toBeVisible();

        // 6. Click scroll-up arrow button
        await expect(homePage.scrollUpButton).toBeVisible();
        await homePage.scrollUpButton.click();

        // 7. Verify page scrolled to top banner header
        await expect(homePage.topBannerHeader).toBeVisible();
    });

    test('Test Case 26: Verify Scroll Up without \'Arrow\' button and Scroll Down functionality', async ({ homePage }) => {
        // 1-3. Navigate to home page and verify visibility
        await homePage.navigateToHome();
        await expect(homePage.featuredItems).toBeVisible();

        // 4-5. Scroll down to bottom and verify subscription section
        await homePage.scrollToBottom();
        await expect(homePage.subscriptionText).toBeVisible();

        // 6. Scroll up directly without clicking arrow button
        await homePage.scrollToTop();

        // 7. Verify page scrolled to top banner header
        await expect(homePage.topBannerHeader).toBeVisible();
    });
});