import { test, expect } from '../../fixtures/uiFixtures';

test.describe('Products Page Navigation and Search Validations', () => {

    test('Test Case 8: Verify All Products and product detail page', async ({ page, homePage, productPage }) => {
        await homePage.navigateToHome();
        await expect(homePage.featuredItems).toBeVisible();

        await productPage.navigateToProducts();
        await expect(productPage.productHeader).toHaveText('All Products');
        await expect(productPage.productsGrid).toBeVisible();

        await productPage.clickFirstProduct();
        await expect(page).toHaveURL(/.*product_details/);

        await expect(productPage.productName).toBeVisible();
        await expect(productPage.productCategory).toBeVisible();
        await expect(productPage.productPrice).toBeVisible();
        await expect(productPage.productAvailability).toBeVisible();
        await expect(productPage.productCondition).toBeVisible();
        await expect(productPage.productBrand).toBeVisible();
    });

    test('Test Case 9: Search Product', async ({ homePage, productPage }) => {
        const searchTerm = 'Blue Top';

        await homePage.navigateToHome();
        await expect(homePage.featuredItems).toBeVisible();

        await productPage.navigateToProducts();
        await expect(productPage.productHeader).toHaveText('All Products');

        await productPage.searchProduct(searchTerm);
        await expect(productPage.searchedProductsHeader).toBeVisible();

        const searchResults = productPage.productItems;
        await expect(searchResults).not.toHaveCount(0);

        const productNames = searchResults.locator('.productinfo p');
        const count = await searchResults.count();

        for (let i = 0; i < count; i++) {
            const nameText = await productNames.nth(i).textContent();
            expect(nameText?.toLowerCase()).toContain(searchTerm.toLowerCase());
        }
    });

    test('Test Case 13: Verify Product quantity in Cart', async ({ page, homePage, productPage, cartPage }) => {
        const targetQuantity = '4';

        await homePage.navigateToHome();
        await expect(homePage.featuredItems).toBeVisible();

        await productPage.clickFirstProduct();

        await expect(page).toHaveURL(/.*product_details.*/);
        await expect(productPage.productName).toBeVisible();

        await productPage.setProductQuantity(targetQuantity);
        await productPage.addToCartFromDetailPage();

        await productPage.viewCartModalLink.click();
        await expect(page).toHaveURL(/.*view_cart.*/);

        await expect(cartPage.cartQuantityButton).toHaveText(targetQuantity);
    });

    test('Test Case 18: View Category Products', async ({ page, homePage, productPage }) => {
        await homePage.navigateToHome();

        await expect(productPage.categorySidebar).toBeVisible();
        await page.waitForTimeout(1000);

        await productPage.getCategoryGroupHeader('Women').click();
        await expect(productPage.womenCategoryPanel).toHaveClass(/collapse in|collapsing/);

        const dressLink = productPage.getCategorySubLink('Women', 'Dress');
        await dressLink.click();

        await expect(page).toHaveURL(/.*category_products.*/);
        await expect(productPage.categoryTitleHeader).toHaveText('Women - Dress Products', { ignoreCase: true });

        await page.waitForTimeout(1000);

        await productPage.getCategoryGroupHeader('Men').click();
        await expect(productPage.menCategoryPanel).toHaveClass(/collapse in|collapsing/);

        const tshirtsLink = productPage.getCategorySubLink('Men', 'Tshirts');
        await tshirtsLink.click();

        await expect(page).toHaveURL(/.*category_products.*/);
        await expect(productPage.categoryTitleHeader).toHaveText('Men - Tshirts Products', { ignoreCase: true });
    });

    test('Test Case 19: View & Cart Brand Products', async ({ page, homePage, productPage }) => {
        await homePage.navigateToHome();

        await productPage.navigateToProductsViaHeaderLink();
        await expect(productPage.brandSidebar).toBeVisible();

        await productPage.getBrandLink('Polo').click();

        await expect(page).toHaveURL(/.*brand_products.*/);
        await expect(productPage.brandTitleHeader).toHaveText('Brand - Polo Products', { ignoreCase: true });

        await productPage.getBrandLink('H&M').click();

        await expect(page).toHaveURL(/.*brand_products.*/);
        await expect(productPage.brandTitleHeader).toHaveText('Brand - H&M Products', { ignoreCase: true });
    });

    test('Test Case 20: Search Products and Verify Cart After Login', async ({ page, testUser, homePage, navbarComponent, authPage, productPage, cartPage, checkoutPage }) => {
        // Pre-requisite: Register fresh account via UI using fixture
        await homePage.navigateToHome();
        await navbarComponent.clickSignupLogin();
        await authPage.fillSignupForm(testUser.name, testUser.email);
        await authPage.fillAccountDetailsForm(testUser);
        await checkoutPage.clickContinue();
        await navbarComponent.clickLogout();

        // 1-2. Navigate to home
        await homePage.navigateToHome();

        // 3-4. Navigate to Products page
        await productPage.navigateToProducts();
        await expect(page).toHaveURL(/.*products/);

        // 5-6. Execute search
        const searchTerm = 'dress';
        await productPage.searchProduct(searchTerm);
        await expect(productPage.searchedProductsTitle).toContainText('Searched Products');

        // 7-8. Add all matching products to cart
        await productPage.addAllVisibleProductsToCart();

        // 9. Verify cart items prior to authentication
        await cartPage.navbarCartLink.click();
        await page.waitForURL('**/view_cart');

        const totalItemsCount = await productPage.cartItemsTableRows.count();
        expect(totalItemsCount).toBeGreaterThan(0);

        // 10. Login
        await navbarComponent.clickSignupLogin();
        await authPage.loginUser(testUser.email, testUser.password);

        // 11. Return to Cart
        await cartPage.navbarCartLink.click();
        await page.waitForURL('**/view_cart');

        // 12. Verify cart items persist post-login
        await expect(productPage.cartItemsTableRows).toHaveCount(totalItemsCount);

        // Cleanup: Delete account
        await navbarComponent.clickDeleteAccount();
        await checkoutPage.clickContinue();
    });

    test('Test Case 21: Add review on product', async ({ page, testUser, homePage, productPage }) => {
        const reviewText = 'Great quality product! Very satisfied with the material and fast shipping.';

        await homePage.navigateToHome();
        await productPage.navigateToProducts();

        await expect(productPage.productHeader).toHaveText('All Products');

        await productPage.clickFirstProduct();
        await expect(page).toHaveURL(/.*product_details.*/);

        await expect(productPage.writeReviewHeader).toBeVisible();

        await productPage.submitReview(testUser.name, testUser.email, reviewText);

        await expect(productPage.reviewSuccessAlert).toBeVisible();
        await expect(productPage.reviewSuccessAlert).toContainText('Thank you for your review.');
    });
});