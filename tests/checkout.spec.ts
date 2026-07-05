/// <reference types="node" />
import { test, expect } from '../baseTest';
import { AuthActions } from '../pages/actions/AuthActions';
import { ProductActions } from '../pages/actions/ProductActions';
import { CartActions } from '../pages/actions/CartActions';
import { CheckoutActions } from '../pages/actions/CheckoutActions';

test.describe('Transaction Flow', () => {
    let authActions: AuthActions;
    let productActions: ProductActions;
    let cartActions: CartActions;
    let checkoutActions: CheckoutActions;

    test.beforeEach(async ({ page }) => {
        authActions = new AuthActions(page);
        productActions = new ProductActions(page);
        cartActions = new CartActions(page);
        checkoutActions = new CheckoutActions(page);
    });

    test('Test Case 14: Place Order: Register while Checkout', async ({ page }) => {
        const uniqueEmail = `tester_${Date.now()}@example.com`;
        const uniqueName = `QA Tester ${Date.now()}`;
        const password = process.env.TEST_PASSWORD || 'FallbackPass123!';

        // 1-2. Launch browser & Navigate to url (Handled implicitly via framework/hooks)
        await authActions.navigateToHome();

        // 3. Verify that home page is visible successfully
        await expect(authActions.authLocators.homeFeaturedItems).toBeVisible();

        // 4. Add products to cart
        await productActions.addTwoProductsSequential();

        // 6. Verify that cart page is displayed
        await expect(cartActions.cartLocators.cartBreadcrumb).toBeVisible();

        // 7. Click Proceed To Checkout
        await cartActions.clickProceedToCheckout();

        // 8. Click 'Register / Login' button
        await checkoutActions.clickRegisterLoginFromCheckout();

        // 9. Fill all details in Signup and create account
        await authActions.fillSignupForm(uniqueName, uniqueEmail);
        await authActions.fillAccountDetailsForm(password);

        // 10. Verify 'ACCOUNT CREATED!' and click 'Continue' button
        await expect(checkoutActions.checkoutLocators.accountCreatedHeader).toHaveText('Account Created!');
        await checkoutActions.clickContinue();

        // 11. Verify ' Logged in as username' at top
        await expect(checkoutActions.checkoutLocators.navbarContainer).toContainText(`Logged in as ${uniqueName}`);

        // 12. Click 'Cart' button
        await cartActions.cartLocators.navbarCartLink.click();

        // 13. Click 'Proceed To Checkout' button
        await expect(cartActions.cartLocators.cartBreadcrumb).toBeVisible();
        await cartActions.clickProceedToCheckout();

        // 14. Verify Address Details and Review Your Order
        await checkoutActions.verifyAddressDetailsAndReviewOrder();
        await expect(checkoutActions.checkoutLocators.deliveryAddressDetails).toBeVisible();
        await expect(checkoutActions.checkoutLocators.billingAddressDetails).toBeVisible();

        // 15. Enter description in comment text area and click 'Place Order'
        await checkoutActions.fillOrderCommentAndPlaceOrder('Please ship this as a gift.');
        await page.waitForURL('**/payment');

        // 16. Enter payment details: Name on Card, Card Number, CVC, Expiration date
        await checkoutActions.fillPaymentDetails('QA Tester', '4111111111111111', '123', '12', '2026');

        // 17. Click 'Pay and Confirm Order' button
        await checkoutActions.submitPayment();

        // 18. Verify success message 'Your order has been placed successfully!'
        await checkoutActions.verifyOrderSuccess();

        // 19. Click 'Delete Account' button
        await authActions.deleteAccount();

        // 20. Verify 'ACCOUNT DELETED!' and click 'Continue' button
        await expect(checkoutActions.checkoutLocators.accountDeletedHeader).toHaveText('Account Deleted!');
        await checkoutActions.clickContinue();
    });
});