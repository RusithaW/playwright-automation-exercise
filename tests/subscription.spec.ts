/// <reference types="node" />
import { test, expect } from '../baseTest';
import { AuthActions } from '../pages/actions/AuthActions';
import { HomeActions } from '../pages/actions/HomeActions';
import { CartActions } from '../pages/actions/CartActions';

test.describe('Newsletter Subscription Validations', () => {
    let auth: AuthActions;
    let home: HomeActions;
    let cart: CartActions;

    test.beforeEach(({ page }) => {
        auth = new AuthActions(page);
        home = new HomeActions(page);
        cart = new CartActions(page);
    });

    test('Test Case 10: Verify Subscription in home page footer', async ({ page }) => {
        // Navigate to the application landing page and verify visibility
        await auth.navigateToHome();
        await expect(auth.authLocators.homeFeaturedItems).toBeVisible();

        // Scroll to the footer and verify the subscription text
        await home.scrollToFooter();
        await expect(home.homeLocators.subscriptionText).toHaveText('Subscription');

        // Fill the subscription form with a valid email and submit
        await home.subscribe('tester_home@example.com');
        await home.waitForSubscriptionSuccessAlert();
    });

    test('Test Case 11: Verify Subscription in Cart page', async () => {
        // Navigate to home page and route directly into the cart view
        await auth.navigateToHome();
        await cart.navigateToCart();

        // Scroll down to the shared footer component wrapper
        await home.scrollToFooter();
        await expect(home.homeLocators.subscriptionText).toHaveText('Subscription');

        // Execute form entry validation matching core criteria
        await home.subscribe('tester_cart@example.com');
        await expect(home.homeLocators.subscriptionSuccessAlert).toBeVisible();
        await expect(home.homeLocators.subscriptionSuccessAlert).toContainText('You have been successfully subscribed!');
    });
});