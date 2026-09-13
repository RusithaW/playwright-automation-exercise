import { test, expect } from '../../fixtures/uiFixtures';

test.describe('Transaction Flow Architecture Validation', () => {

    // TC14 registers via the checkout modal's "Register / Login" link, not
    // the standard signup flow — that mid-checkout registration path is the
    // specific behavior this test verifies, so it stays fully manual and
    // does NOT use the `registeredUser` fixture.
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
        await page.waitForURL('**/login');

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
        await expect(checkoutPage.deliveryAddressBox).toBeVisible();
        await expect(checkoutPage.billingAddressBox).toBeVisible();
        await checkoutPage.fillOrderCommentAndPlaceOrder('Please ship this as a gift.');
        await page.waitForURL('**/payment');

        // 16-18. Fill payment & verify order confirmation
        await checkoutPage.fillPaymentDetails('QA Tester', '4111111111111111', '123', '12', '2026');
        await checkoutPage.submitPayment();
        await checkoutPage.verifyOrderSuccess();

        // 19-20. Clean up account (manual, since registration was manual here too)
        await navbarComponent.clickDeleteAccount();
        await expect(checkoutPage.accountDeletedHeader).toHaveText('Account Deleted!');
        await checkoutPage.clickContinue();
    });

    // TC15's account creation is pure setup — "be a registered, logged-in
    // user" — not the behavior under test (checkout itself is). The
    // `registeredUser` fixture handles steps 1-7 (register + verify logged
    // in state) and account cleanup automatically, so the test body only
    // covers the actual checkout flow being verified.
    test('Test Case 15: Place Order: Register before Checkout', async ({ page, registeredUser, navbarComponent, productPage, cartPage, checkoutPage }) => {
        // 1-7. Registration + login handled by `registeredUser` fixture.
        // Re-asserting logged-in state here since it's a listed verification
        // step in the official test case, not just internal setup.
        await expect(navbarComponent.loggedInAsUser).toContainText(`Logged in as ${registeredUser.name}`);

        // 8-10. Add products & proceed to checkout
        await productPage.addTwoProductsSequential();
        await cartPage.navigateToCart();
        await expect(cartPage.cartBreadcrumb).toBeVisible();
        await cartPage.clickProceedToCheckout();

        // 11-12. Review address & place order
        await checkoutPage.verifyAddressDetailsAndReviewOrder();
        await expect(checkoutPage.deliveryAddressBox).toBeVisible();
        await expect(checkoutPage.billingAddressBox).toBeVisible();
        await checkoutPage.fillOrderCommentAndPlaceOrder('Please ship this as a gift.');
        await page.waitForURL('**/payment');

        // 13-15. Payment process & confirmation
        await checkoutPage.fillPaymentDetails('QA Tester', '4111111111111111', '123', '12', '2026');
        await checkoutPage.submitPayment();
        await checkoutPage.verifyOrderSuccess();

        // 16-17. Account deletion now happens automatically in the
        // `registeredUser` fixture's teardown after this test completes —
        // no manual cleanup needed here.
    });

    // TC16's actual tested behavior is "log out, then log back in, then
    // check out" — so the fixture is used only for the initial account
    // creation. The logout/login sequence stays in the test body since
    // that IS what this test case verifies.
    test('Test Case 16: Place Order: Login before Checkout', async ({ page, registeredUser, homePage, navbarComponent, authPage, productPage, cartPage, checkoutPage }) => {
        // Account created via `registeredUser` fixture (which leaves the
        // browser logged in). Log out immediately so the test can verify
        // the actual login flow next, per the official test case.
        await navbarComponent.clickLogout();

        // 1-3. Re-navigate home
        await homePage.navigateToHome();
        await expect(homePage.featuredItems).toBeVisible();

        // 4-6. Login with the fixture-created user
        await navbarComponent.clickSignupLogin();
        await page.waitForURL('**/login');
        await authPage.loginUser(registeredUser.email, registeredUser.password);
        await expect(navbarComponent.loggedInAsUser).toContainText(`Logged in as ${registeredUser.name}`);

        // 7-10. Add products & proceed to checkout
        await productPage.addTwoProductsSequential();
        await cartPage.navigateToCart();
        await expect(cartPage.cartBreadcrumb).toBeVisible();
        await cartPage.clickProceedToCheckout();

        // 11-12. Review order & submit comment
        await checkoutPage.verifyAddressDetailsAndReviewOrder();
        await expect(checkoutPage.deliveryAddressBox).toBeVisible();
        await expect(checkoutPage.billingAddressBox).toBeVisible();
        await checkoutPage.fillOrderCommentAndPlaceOrder('Please ship this as a gift.');
        await page.waitForURL('**/payment');

        // 13-15. Payment execution & success check
        await checkoutPage.fillPaymentDetails('QA Tester', '4111111111111111', '123', '12', '2026');
        await checkoutPage.submitPayment();
        await checkoutPage.verifyOrderSuccess();

        // 16-17. Account cleanup handled automatically by the
        // `registeredUser` fixture's teardown. The test ends while still
        // logged back in (from step 4-6), so the fixture's
        // clickDeleteAccount() call has a valid session to act on.
    });

    // TC23 intentionally does NOT use `registeredUser`: this test needs a
    // specific, hardcoded set of address fields (city, state, zip, etc.) so
    // it can later assert the checkout page displays exactly those values
    // back. The `registeredUser` fixture is built around the ambient random
    // `testUser` and isn't a good fit for a test that needs custom data —
    // forcing it here would add fixture-override complexity for a single
    // caller. Kept manual and explicit on purpose.
    test('Test Case 23: Verify address details in checkout page', async ({ page, authPage, homePage, navbarComponent, productPage, checkoutPage, testUser }) => {
        // Override address details to specific, known values we can assert against later.
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

        // 14-15. Teardown (manual, since registration was manual here too)
        await navbarComponent.clickDeleteAccount();
        await expect(checkoutPage.accountDeletedHeader).toBeVisible();
        await checkoutPage.clickContinue();
    });

    // TC24 also registers via the checkout modal's login link — same
    // reasoning as TC14, kept fully manual.
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
        await page.waitForURL('**/login');

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
        await checkoutPage.verifyAddressDetailsAndReviewOrder();
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