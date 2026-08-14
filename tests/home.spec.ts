/// <reference types="node" />
import { test, expect } from '../baseTest';
import { AuthActions } from '../pages/actions/AuthActions';
import { HomeActions } from '../pages/actions/HomeActions';

test.describe('Home Page Navigation and Test Cases', () => {
    let authActions: AuthActions;
    let homeActions: HomeActions;

    test.beforeEach(({ page }) => {
        authActions = new AuthActions(page);
        homeActions = new HomeActions(page);
    });

    test('Test Case 7: Navigate to Test Cases Page', async () => {
        // Navigate to the application landing page and verify visibility
        await authActions.navigateToHome();
        await expect(authActions.authLocators.homeFeaturedItems).toBeVisible();

        // Navigate to the Test Cases view and verify the section header
        await homeActions.navigateToTestCases();
        await expect(homeActions.homeLocators.testCasesHeader).toHaveText('Test Cases');
    });

    test('Test Case 25: Verify Scroll Up using \'Arrow\' button and Scroll Down functionality', async () => {
        // 1-2. Launch browser & Navigate to url
        await authActions.navigateToHome();

        // 3. Verify that home page is visible successfully
        await expect(authActions.authLocators.homeFeaturedItems).toBeVisible();

        // 4. Scroll down page to bottom
        await homeActions.scrollToBottom();

        // 5. Verify 'SUBSCRIPTION' is visible
        await expect(homeActions.getSubscriptionHeader()).toBeVisible();

        // 6. Click on arrow at bottom right side to move upward
        const scrollUpButton = homeActions.getScrollUpButton();
        await expect(scrollUpButton).toBeVisible();
        await scrollUpButton.click();

        // 7. Verify that page is scrolled up and text is visible on screen
        await expect(homeActions.getTopBannerHeader()).toBeVisible();
    });

    test('Test Case 26: Verify Scroll Up without \'Arrow\' button and Scroll Down functionality', async () => {
        // 1-2. Launch browser & Navigate to url
        await authActions.navigateToHome();

        // 3. Verify that home page is visible successfully
        await expect(authActions.authLocators.homeFeaturedItems).toBeVisible();

        // 4. Scroll down page to bottom
        await homeActions.scrollToBottom();

        // 5. Verify 'SUBSCRIPTION' is visible
        await expect(homeActions.getSubscriptionHeader()).toBeVisible();

        // 6. Scroll up page to top (without clicking the arrow button)
        await homeActions.scrollToTop();

        // 7. Verify that page is scrolled up and 'Full-Fledged practice website for Automation Engineers' text is visible on screen
        await expect(homeActions.getTopBannerHeader()).toBeVisible();
    });
});