/// <reference types="node" />
import { test, expect } from '../baseTest';
import { AuthActions } from '../pages/actions/AuthActions';
import { HomeActions } from '../pages/actions/HomeActions';
import { CartActions } from '../pages/actions/CartActions';

test.describe('Newsletter Subscription Validations', () => {
    let authActions: AuthActions;
    let homeActions: HomeActions;
    let cartActions: CartActions;

    test.beforeEach(({ page }) => {
        authActions = new AuthActions(page);
        homeActions = new HomeActions(page);
        cartActions = new CartActions(page);
    });

    test('Test Case 10: Verify Subscription in home page footer', async () => {
        // Navigate to the application landing page and verify visibility
        await authActions.navigateToHome();
        await expect(authActions.authLocators.homeFeaturedItems).toBeVisible();

        // Scroll to the footer and verify the subscription text
        await homeActions.scrollToFooter();
        await expect(homeActions.homeLocators.subscriptionText).toHaveText('Subscription');

        // Fill the subscription form with a valid email and submit
        await homeActions.subscribe('tester_home@example.com');
        await homeActions.waitForSubscriptionSuccessAlert();
    });

    test('Test Case 11: Verify Subscription in Cart page', async () => {
        // Navigate to home page and route directly into the cart view
        await authActions.navigateToHome();
        await cartActions.navigateToCart();

        // Scroll down to the shared footer component wrapper
        await homeActions.scrollToFooter();
        await expect(homeActions.homeLocators.subscriptionText).toHaveText('Subscription');

        // Execute form entry validation matching core criteria
        await homeActions.subscribe('tester_cart@example.com');
        await expect(homeActions.homeLocators.subscriptionSuccessAlert).toBeVisible();
        await expect(homeActions.homeLocators.subscriptionSuccessAlert).toContainText('You have been successfully subscribed!');
    });
});