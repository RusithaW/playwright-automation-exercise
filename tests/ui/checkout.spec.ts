import { test, expect } from '../../fixtures/uiFixtures';

test.describe('Transaction Flow Architecture Validation', () => {

    test('Test Case 14: Place Order: Register while Checkout', async ({ page, authPage, homePage, navbarComponent, productPage, cartPage, checkoutPage, testUser }) => {
        // 1-3. Launch browser, Navigate to home & verify
        await homePage.navigateToHome();
        await expect(homePage.featuredItems).toBeVisible();

        // 4-6. Add products & navigate to cart
        await productPage.addTwoProductsSequential();
        await expect(cartPage.cartBreadcrumb).toBeVisible();

        // 7-8. Proceed to checkout & trigger registration from checkout modal
        await cartPage.clickProceedToCheckout();
        await checkoutPage.clickRegisterLoginFromCheckout();

        // 9-10. Complete Signup and create account
        await authPage.fillSignupForm(testUser.name, testUser.email);
        await authPage.fillAccountDetailsForm(testUser);
        await expect(checkoutPage.accountCreatedHeader).toHaveText('Account Created!');
        await checkoutPage.clickContinue();

        // 11-13. Verify header state & return to checkout via cart
        await expect(navbarComponent.loggedInAsUser).toContainText(`Logged in as ${testUser.name}`);
        await cartPage.navigateToCart();
        await expect(cartPage.cartBreadcrumb).toBeVisible();
        await cartPage.clickProceedToCheckout();

        // 14-15. Review order & submit comment
        await checkoutPage.verifyAddressDetailsAndReviewOrder();
        await expect(checkoutPage.deliveryAddressDetails).toBeVisible();
        await expect(checkoutPage.billingAddressDetails).toBeVisible();
        await checkoutPage.fillOrderCommentAndPlaceOrder('Please ship this as a gift.');
        await page.waitForURL('**/payment');

        // 16-18. Fill payment & verify order confirmation
        await checkoutPage.fillPaymentDetails('QA Tester', '4111111111111111', '123', '12', '2026');
        await checkoutPage.submitPayment();
        await checkoutPage.verifyOrderSuccess();

        // 19-20. Clean up account
        await navbarComponent.clickDeleteAccount();
        await expect(checkoutPage.accountDeletedHeader).toHaveText('Account Deleted!');
        await checkoutPage.clickContinue();
    });

    test('Test Case 15: Place Order: Register before Checkout', async ({ page, authPage, homePage, navbarComponent, productPage, cartPage, checkoutPage, testUser }) => {
        // 1-3. Launch browser, Navigate & verify home
        await homePage.navigateToHome();
        await expect(homePage.featuredItems).toBeVisible();

        // 4-7. Register prior to shopping
        await navbarComponent.clickSignupLogin();
        await authPage.fillSignupForm(testUser.name, testUser.email);
        await authPage.fillAccountDetailsForm(testUser);
        await expect(checkoutPage.accountCreatedHeader).toHaveText('Account Created!');
        await checkoutPage.clickContinue();
        await expect(navbarComponent.loggedInAsUser).toContainText(`Logged in as ${testUser.name}`);

        await page.waitForLoadState('networkidle');

        // 8-10. Add products & proceed to checkout
        await productPage.addTwoProductsSequential();
        await cartPage.navigateToCart();
        await expect(cartPage.cartBreadcrumb).toBeVisible();
        await cartPage.clickProceedToCheckout();

        // 11-12. Review address & place order
        await checkoutPage.verifyAddressDetailsAndReviewOrder();
        await expect(checkoutPage.deliveryAddressDetails).toBeVisible();
        await expect(checkoutPage.billingAddressDetails).toBeVisible();
        await checkoutPage.fillOrderCommentAndPlaceOrder('Please ship this as a gift.');
        await page.waitForURL('**/payment');

        // 13-15. Payment process & confirmation
        await checkoutPage.fillPaymentDetails('QA Tester', '4111111111111111', '123', '12', '2026');
        await checkoutPage.submitPayment();
        await checkoutPage.verifyOrderSuccess();

        // 16-17. Teardown
        await navbarComponent.clickDeleteAccount();
        await expect(checkoutPage.accountDeletedHeader).toHaveText('Account Deleted!');
        await checkoutPage.clickContinue();
    });

    test('Test Case 16: Place Order: Login before Checkout', async ({ page, authPage, homePage, navbarComponent, productPage, cartPage, checkoutPage, testUser }) => {
        // Setup Target Account
        await homePage.navigateToHome();
        await navbarComponent.clickSignupLogin();
        await authPage.fillSignupForm(testUser.name, testUser.email);
        await authPage.fillAccountDetailsForm(testUser);
        await authPage.clickContinue();
        await navbarComponent.clickLogout();

        // 1-3. Re-navigate home
        await homePage.navigateToHome();
        await expect(homePage.featuredItems).toBeVisible();

        // 4-6. Login with existing user
        await navbarComponent.clickSignupLogin();
        await page.waitForURL('**/login');
        await authPage.loginUser(testUser.email, testUser.password);
        await expect(navbarComponent.loggedInAsUser).toContainText(`Logged in as ${testUser.name}`);

        await page.waitForLoadState('networkidle');

        // 7-10. Add products & proceed to checkout
        await productPage.addTwoProductsSequential();
        await cartPage.navigateToCart();
        await expect(cartPage.cartBreadcrumb).toBeVisible();
        await cartPage.clickProceedToCheckout();

        // 11-12. Review order & submit comment
        await checkoutPage.verifyAddressDetailsAndReviewOrder();
        await expect(checkoutPage.deliveryAddressDetails).toBeVisible();
        await expect(checkoutPage.billingAddressDetails).toBeVisible();
        await checkoutPage.fillOrderCommentAndPlaceOrder('Please ship this as a gift.');
        await page.waitForURL('**/payment');

        // 13-15. Payment execution & success check
        await checkoutPage.fillPaymentDetails('QA Tester', '4111111111111111', '123', '12', '2026');
        await checkoutPage.submitPayment();
        await checkoutPage.verifyOrderSuccess();

        // 16-17. Teardown
        await navbarComponent.clickDeleteAccount();
        await expect(checkoutPage.accountDeletedHeader).toHaveText('Account Deleted!');
        await checkoutPage.clickContinue();
    });

    test('Test Case 23: Verify address details in checkout page', async ({ page, authPage, homePage, navbarComponent, productPage, checkoutPage, testUser }) => {
        // Override address details in testUser fixture to explicitly match verification assertions
        const customUser = {
            ...testUser,
            firstName: 'John',
            lastName: 'Doe',
            company: 'QA Solutions',
            address: '123 Automation St.',
            address2: 'Suite 100',
            city: 'Los Angeles',
            state: 'California',
            zipcode: '90001',
            country: 'United States',
            mobileNumber: '1234567890',
        };

        const expectedAddressDetails = [
            customUser.firstName, customUser.lastName, customUser.company,
            customUser.address, customUser.address2,
            customUser.city, customUser.state, customUser.zipcode,
            customUser.country, customUser.mobileNumber
        ];

        // 1-7. Setup Account
        await homePage.navigateToHome();
        await expect(homePage.featuredItems).toBeVisible();
        await navbarComponent.clickSignupLogin();
        await authPage.fillSignupForm(customUser.name, customUser.email);
        await authPage.fillAccountDetailsForm(customUser);
        await expect(checkoutPage.accountCreatedHeader).toBeVisible();
        await checkoutPage.clickContinue();
        await expect(navbarComponent.loggedInAsUser).toContainText(`Logged in as ${customUser.name}`);

        // 8-10. Add single item & open cart from modal
        await productPage.clickFirstProduct();
        await productPage.addToCartFromDetailPage();
        await expect(productPage.viewCartModalLink).toBeVisible();
        await productPage.viewCartModalLink.click();

        // 11. Navigate to Checkout
        await page.waitForURL('**/view_cart');
        await expect(checkoutPage.shoppingCartBreadcrumb).toHaveClass(/active/);
        await checkoutPage.clickProceedToCheckout();
        await page.waitForURL('**/checkout');

        // 12-13. Verify delivery & billing addresses match signup input
        await checkoutPage.verifyDeliveryAndBillingAddress();
        for (const detail of expectedAddressDetails) {
            await expect(checkoutPage.deliveryAddressBox).toContainText(detail);
            await expect(checkoutPage.billingAddressBox).toContainText(detail);
        }

        // 14-15. Teardown
        await navbarComponent.clickDeleteAccount();
        await expect(checkoutPage.accountDeletedHeader).toBeVisible();
        await checkoutPage.clickContinue();
    });

    test('Test Case 24: Download Invoice after purchase order', async ({ page, authPage, homePage, navbarComponent, productPage, cartPage, checkoutPage, testUser }) => {
        // 1-4. Navigate home & select product
        await homePage.navigateToHome();
        await expect(homePage.featuredItems).toBeVisible();
        await productPage.clickFirstProduct();
        await page.waitForURL('**/product_details/**');
        await productPage.addToCartFromDetailPage();

        // 5-8. Navigate to cart modal -> view cart -> checkout modal -> login
        await checkoutPage.waitForCartModalVisible();
        await productPage.viewCartModalLink.click();
        await page.waitForURL('**/view_cart');
        await expect(checkoutPage.shoppingCartBreadcrumb).toHaveClass(/active/);
        await cartPage.clickProceedToCheckout();
        await checkoutPage.clickLoginFromCheckoutModal();

        // 9-11. Complete Registration flow
        await authPage.fillSignupForm(testUser.name, testUser.email);
        await authPage.fillAccountDetailsForm(testUser);
        await expect(checkoutPage.accountCreatedHeader).toBeVisible();
        await checkoutPage.clickContinue();
        await expect(navbarComponent.loggedInAsUser).toContainText(`Logged in as ${testUser.name}`);

        // 12-14. Return to cart & proceed to checkout
        await cartPage.navigateToCart();
        await page.waitForURL('**/view_cart');
        await cartPage.clickProceedToCheckout();
        await page.waitForURL('**/checkout');

        // 15-18. Fill details & complete payment
        await checkoutPage.verifyDeliveryAndBillingAddress();
        await checkoutPage.fillOrderCommentAndPlaceOrder('Order comment: Handle with care.');
        await page.waitForURL('**/payment');
        await checkoutPage.fillPaymentDetails(testUser.name, '4111111111111111', '311', '12', '2028');
        await checkoutPage.submitPayment();
        await expect(checkoutPage.orderPlacedAlert).toBeVisible();

        // 19. Trigger and verify Invoice Download
        const download = await checkoutPage.downloadInvoice();
        expect(download.suggestedFilename()).toBeTruthy();

        // 20-22. Final continuation and account deletion
        await checkoutPage.clickContinue();
        await navbarComponent.clickDeleteAccount();
        await expect(checkoutPage.accountDeletedHeader).toBeVisible();
        await checkoutPage.clickContinue();
    });
});