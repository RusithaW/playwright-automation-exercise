/// <reference types="node" />
import { test, expect } from '../../fixtures/uiFixtures';

test.describe('Newsletter Subscription Validations', () => {

    test('Test Case 10: Verify Subscription in home page footer', async ({ homePage }) => {
        // 1. Navigate to home page and verify visibility
        await homePage.navigateToHome();
        await expect(homePage.featuredItems).toBeVisible();

        // 2. Scroll to footer and verify subscription text
        await homePage.scrollToFooter();
        await expect(homePage.subscriptionText).toHaveText('Subscription');

        // 3. Enter email and submit subscription
        await homePage.subscribe('tester_home@example.com');
        await homePage.waitForSubscriptionSuccessAlert();
    });

    test('Test Case 11: Verify Subscription in Cart page', async ({ cartPage, homePage }) => {
        // 1. Navigate to home page and route directly into cart view
        await homePage.navigateToHome();
        await cartPage.navigateToCart();

        // 2. Scroll down to shared footer component and verify header
        await homePage.scrollToFooter();
        await expect(homePage.subscriptionText).toHaveText('Subscription');

        // 3. Execute subscription form entry and verify success alert
        await homePage.subscribe('tester_cart@example.com');
        await expect(homePage.subscriptionSuccessAlert).toBeVisible();
        await expect(homePage.subscriptionSuccessAlert).toContainText('You have been successfully subscribed!');
    });
});