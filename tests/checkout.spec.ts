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

    test('Test Case 15: Place Order: Register before Checkout', async ({ page }) => {
        const uniqueEmail = `tester_${Date.now()}@example.com`;
        const uniqueName = `QA Tester ${Date.now()}`;
        const password = process.env.TEST_PASSWORD || 'FallbackPass123!';

        // 1-2. Launch browser & Navigate to url (Handled implicitly via framework/hooks)
        await authActions.navigateToHome();

        // 3. Verify that home page is visible successfully
        await expect(authActions.authLocators.homeFeaturedItems).toBeVisible();

        // 4. Click on 'Signup / Login' button
        await authActions.navigateToSignupLogin();

        // 5. Fill all details in Signup and create account
        await authActions.fillSignupForm(uniqueName, uniqueEmail);
        await authActions.fillAccountDetailsForm(password);

        // 6. Verify 'ACCOUNT CREATED!' and click 'Continue' button
        await expect(checkoutActions.checkoutLocators.accountCreatedHeader).toHaveText('Account Created!');
        await checkoutActions.clickContinue();

        // 7. Verify ' Logged in as username' at top
        await expect(checkoutActions.checkoutLocators.navbarContainer).toContainText(`Logged in as ${uniqueName}`);

        await page.waitForLoadState('networkidle');

        // 8. Add products to cart
        await productActions.addTwoProductsSequential();

        // 9. Click 'Cart' button
        await cartActions.cartLocators.navbarCartLink.click();

        // 10. Click 'Proceed To Checkout' button
        await expect(cartActions.cartLocators.cartBreadcrumb).toBeVisible();
        await cartActions.clickProceedToCheckout();

        // 11. Verify Address Details and Review Your Order
        await checkoutActions.verifyAddressDetailsAndReviewOrder();
        await expect(checkoutActions.checkoutLocators.deliveryAddressDetails).toBeVisible();
        await expect(checkoutActions.checkoutLocators.billingAddressDetails).toBeVisible();

        // 12. Enter description in comment text area and click 'Place Order'
        await checkoutActions.fillOrderCommentAndPlaceOrder('Please ship this as a gift.');
        await page.waitForURL('**/payment');

        // 13. Enter payment details: Name on Card, Card Number, CVC, Expiration date
        await checkoutActions.fillPaymentDetails('QA Tester', '4111111111111111', '123', '12', '2026');

        // 14. Click 'Pay and Confirm Order' button
        await checkoutActions.submitPayment();

        // 15. Verify success message 'Your order has been placed successfully!'
        await checkoutActions.verifyOrderSuccess();

        // 16. Click 'Delete Account' button
        await authActions.deleteAccount();

        // 17. Verify 'ACCOUNT DELETED!' and click 'Continue' button
        await expect(checkoutActions.checkoutLocators.accountDeletedHeader).toHaveText('Account Deleted!');
        await checkoutActions.clickContinue();
    });


    test('Test Case 16: Place Order: Login before Checkout', async ({ page }) => {
        // Generate values unique to this single test runner worker
        const dynamicEmail = `tester_login_flow_${Date.now()}@example.com`;
        const commonPassword = process.env.TEST_USER_PASSWORD || 'FallbackPass123!';
        const username = 'QA Automation Tester';

        // SETUP STAGE: Build the target account first
        await authActions.navigateToHome();
        await authActions.navigateToSignupLogin();
        await authActions.fillSignupForm(username, dynamicEmail);
        await authActions.fillAccountDetailsForm(commonPassword);
        await page.locator('[data-qa="continue-button"]').click();
        await authActions.logout(); // Account is ready, log out to satisfy step 4

        // 1-2. Launch browser & Navigate to url
        await authActions.navigateToHome();

        // 3. Verify that home page is visible successfully
        await expect(authActions.authLocators.homeFeaturedItems).toBeVisible();

        // 4. Click 'Signup / Login' button
        await authActions.navigateToSignupLogin();
        await page.waitForURL('**/login');

        // 5. Fill email, password and click 'Login' button
        await authActions.loginExistingUser(dynamicEmail, commonPassword);

        // 6. Verify 'Logged in as username' at top
        await expect(checkoutActions.checkoutLocators.navbarContainer).toContainText(`Logged in as ${username}`);

        // Handle hydration lag before proceeding to shop items
        await page.waitForLoadState('networkidle');

        // 7. Add products to cart
        await productActions.addTwoProductsSequential();

        // 8. Click 'Cart' button
        await cartActions.cartLocators.navbarCartLink.click();

        // 9. Verify that cart page is displayed
        await expect(cartActions.cartLocators.cartBreadcrumb).toBeVisible();

        // 10. Click Proceed To Checkout
        await cartActions.clickProceedToCheckout();

        // 11. Verify Address Details and Review Your Order
        await checkoutActions.verifyAddressDetailsAndReviewOrder();
        await expect(checkoutActions.checkoutLocators.deliveryAddressDetails).toBeVisible();
        await expect(checkoutActions.checkoutLocators.billingAddressDetails).toBeVisible();

        // 12. Enter description in comment text area and click 'Place Order'
        await checkoutActions.fillOrderCommentAndPlaceOrder('Please ship this as a gift.');
        await page.waitForURL('**/payment');

        // 13. Enter payment details
        await checkoutActions.fillPaymentDetails('QA Tester', '4111111111111111', '123', '12', '2026');

        // 14. Click 'Pay and Confirm Order' button
        await checkoutActions.submitPayment();

        // 15. Verify success message
        await checkoutActions.verifyOrderSuccess();

        // 16. Click 'Delete Account' button
        await authActions.deleteAccount();

        // 17. Verify 'ACCOUNT DELETED!' and click 'Continue' button
        await expect(checkoutActions.checkoutLocators.accountDeletedHeader).toHaveText('Account Deleted!');
        await checkoutActions.clickContinue();
    });

    test('Test Case 23: Verify address details in checkout page', async ({ page }) => {
        const timestamp = Date.now();
        const userName = 'Rusitha Dilshan';
        const userEmail = `testuser_${timestamp}@example.com`;
        const userPassword = 'Password123!';

        // Expected address values set by authActions.fillAccountDetailsForm()
        const expectedAddressDetails = [
            'John',
            'Doe',
            'QA Solutions',
            '123 Automation St.',
            'Floor 2',
            'Los Angeles',
            'California',
            '90001',
            'United States',
            '1234567890'
        ];

        // 1-2. Launch browser & Navigate to url
        await authActions.navigateToHome();

        // 3. Verify that home page is visible successfully
        await expect(authActions.authLocators.homeFeaturedItems).toBeVisible();

        // 4. Click 'Signup / Login' button
        await authActions.navigateToSignupLogin();

        // 5. Fill all details in Signup and create account
        await authActions.fillSignupForm(userName, userEmail);
        await authActions.fillAccountDetailsForm(userPassword);

        // 6. Verify 'ACCOUNT CREATED!' and click 'Continue' button
        await expect(checkoutActions.checkoutLocators.accountCreatedHeader).toBeVisible();
        await checkoutActions.clickContinue();

        // 7. Verify ' Logged in as username' at top
        await expect(checkoutActions.checkoutLocators.navbarContainer).toContainText(`Logged in as ${userName}`);

        // 8. Add products to cart
        await productActions.clickFirstProduct();
        await productActions.addToCartFromDetailPage();

        // 9. Click 'Cart' button
        await expect(productActions.productLocators.viewCartModalLink).toBeVisible();
        await productActions.productLocators.viewCartModalLink.click();

        // 10. Verify that cart page is displayed
        await page.waitForURL('**/view_cart'); // Lock: ensure cart page loaded
        await expect(page.locator('li', { hasText: 'Shopping Cart' })).toHaveClass(/active/);

        // 11. Click Proceed To Checkout
        await checkoutActions.clickProceedToCheckout();
        await page.waitForURL('**/checkout');

        // 12. Verify that the delivery address is same address filled at the time registration of account
        await checkoutActions.verifyDeliveryAndBillingAddress();
        for (const detail of expectedAddressDetails) {
            await expect(checkoutActions.checkoutLocators.deliveryAddressBox).toContainText(detail);
        }

        // 13. Verify that the billing address is same address filled at the time registration of account
        for (const detail of expectedAddressDetails) {
            await expect(checkoutActions.checkoutLocators.billingAddressBox).toContainText(detail);
        }

        // 14. Click 'Delete Account' button
        await authActions.deleteAccount();

        // 15. Verify 'ACCOUNT DELETED!' and click 'Continue' button
        await expect(checkoutActions.checkoutLocators.accountDeletedHeader).toBeVisible();
        await checkoutActions.clickContinue();
    });

    test('Test Case 24: Download Invoice after purchase order', async ({ page }) => {
        const timestamp = Date.now();
        const userName = 'Rusitha Dilshan';
        const userEmail = `testuser_${timestamp}@example.com`;
        const userPassword = 'Password123!';

        // 1-2. Launch browser & Navigate to url
        await authActions.navigateToHome();

        // 3. Verify that home page is visible successfully
        await expect(authActions.authLocators.homeFeaturedItems).toBeVisible();

        // 4. Add products to cart
        await productActions.clickFirstProduct();
        await page.waitForURL('**/product_details/**');
        await productActions.addToCartFromDetailPage();

        // 5. Click 'Cart' button
        await page.locator('#cartModal').waitFor({ state: 'visible' });
        await productActions.productLocators.viewCartModalLink.click();

        // 6. Verify that cart page is displayed
        await page.waitForURL('**/view_cart');
        await expect(page.locator('li', { hasText: 'Shopping Cart' })).toHaveClass(/active/);

        // 7. Click Proceed To Checkout
        await cartActions.clickProceedToCheckout();

        // 8. Click 'Register / Login' button on the checkout modal
        await page.locator('#checkoutModal a[href="/login"]').click();

        // 9-10. Fill all details in Signup and create account
        await authActions.fillSignupForm(userName, userEmail);
        await authActions.fillAccountDetailsForm(userPassword);
        await expect(checkoutActions.checkoutLocators.accountCreatedHeader).toBeVisible();
        await checkoutActions.clickContinue();

        // 11. Verify 'Logged in as username' at top
        await expect(checkoutActions.checkoutLocators.navbarContainer).toContainText(`Logged in as ${userName}`);

        // 12. Click 'Cart' button
        await cartActions.cartLocators.navbarCartLink.click();
        await page.waitForURL('**/view_cart');

        // 13. Click 'Proceed To Checkout' button
        await cartActions.clickProceedToCheckout();
        await page.waitForURL('**/checkout');

        // 14. Verify Address Details and Review Your Order
        await checkoutActions.verifyDeliveryAndBillingAddress();

        // 15. Enter description in comment text area and click 'Place Order'
        await page.locator('textarea[name="message"]').fill('Order comment: Handle with care.');
        await page.locator('a[href="/payment"]').click();

        // 16. Enter payment details
        await page.locator('input[name="name_on_card"]').fill('Rusitha Dilshan');
        await page.locator('input[name="card_number"]').fill('4111111111111111');
        await page.locator('input[name="cvc"]').fill('311');
        await page.locator('input[name="expiry_month"]').fill('12');
        await page.locator('input[name="expiry_year"]').fill('2028');

        // 17. Click 'Pay and Confirm Order' button
        await page.locator('button#submit').click();

        // 18. Verify success message 'Your order has been placed successfully!'
        await expect(page.locator('[data-qa="order-placed"]')).toBeVisible();

        // 19. Click 'Download Invoice' button and verify invoice is downloaded successfully
        const downloadPromise = page.waitForEvent('download');
        await page.locator('a:has-text("Download Invoice")').click();
        const download = await downloadPromise;

        // Assert that the file downloaded and has a non-empty file name
        expect(download.suggestedFilename()).toBeTruthy();

        // 20. Click 'Continue' button
        await page.locator('[data-qa="continue-button"]').click();

        // 21. Click 'Delete Account' button
        await authActions.deleteAccount();

        // 22. Verify 'ACCOUNT DELETED!' and click 'Continue' button
        await expect(checkoutActions.checkoutLocators.accountDeletedHeader).toBeVisible();
        await checkoutActions.clickContinue();
    });
});