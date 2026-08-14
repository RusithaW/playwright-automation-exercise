/// <reference types="node" />
import { test, expect } from '../baseTest';
import { AuthActions } from '../pages/actions/AuthActions';
import { ProductActions } from '../pages/actions/ProductActions';
import { CartActions } from '../pages/actions/CartActions';
import { CheckoutActions } from '../pages/actions/CheckoutActions';

test.describe('Products Page Navigation and Search Validations', () => {
    let authActions: AuthActions;
    let productActions: ProductActions;
    let cartActions: CartActions;
    let checkoutActions: CheckoutActions;

    test.beforeEach(({ page }) => {
        authActions = new AuthActions(page);
        productActions = new ProductActions(page);
        cartActions = new CartActions(page);
        checkoutActions = new CheckoutActions(page);
    });

    test('Test Case 8: Verify All Products and product detail page', async ({ page }) => {
        await authActions.navigateToHome();
        await expect(authActions.authLocators.homeFeaturedItems).toBeVisible();

        await productActions.navigateToProducts();
        await expect(productActions.productLocators.productHeader).toHaveText('All Products');
        await expect(productActions.productLocators.productsGrid).toBeVisible();

        await productActions.clickFirstProduct();
        await expect(page).toHaveURL(/.*product_details/);

        const locators = productActions.productLocators;
        await expect(locators.productName).toBeVisible();
        await expect(locators.productCategory).toBeVisible();
        await expect(locators.productPrice).toBeVisible();
        await expect(locators.productAvailability).toBeVisible();
        await expect(locators.productCondition).toBeVisible();
        await expect(locators.productBrand).toBeVisible();
    });

    test('Test Case 9: Search Product', async () => {
        const searchTerm = 'Blue Top';

        // Navigate to home and proceed to the product list catalog view
        await authActions.navigateToHome();
        await expect(authActions.authLocators.homeFeaturedItems).toBeVisible();

        await productActions.navigateToProducts();
        await expect(productActions.productLocators.productHeader).toHaveText('All Products');

        // Execute search query
        await productActions.searchProduct(searchTerm);
        await expect(productActions.productLocators.searchedProductsHeader).toBeVisible();

        // Assert search results matching parameters are displayed on the UI layout
        const searchResults = productActions.productLocators.productItems;
        await expect(searchResults).not.toHaveCount(0);

        // Verify that each item returned explicitly matches the requested context criteria
        const productNames = searchResults.locator('.productinfo p');
        const count = await searchResults.count();

        for (let i = 0; i < count; i++) {
            const nameText = await productNames.nth(i).textContent();
            expect(nameText?.toLowerCase()).toContain(searchTerm.toLowerCase());
        }
    });

    test('Test Case 13: Verify Product quantity in Cart', async ({ page }) => {
        const targetQuantity = '4';

        // 1-3. Launch browser & Navigate to url, verify home page visible
        await authActions.navigateToHome();
        await expect(authActions.authLocators.homeFeaturedItems).toBeVisible();

        // 4. Click 'View Product' for any product on home page
        await productActions.clickFirstProduct();

        // 5. Verify product detail is opened
        await expect(page).toHaveURL(/.*product_details.*/);
        await expect(productActions.productLocators.productName).toBeVisible();

        // 6. Increase quantity to 4
        await productActions.setProductQuantity(targetQuantity);

        // 7. Click 'Add to cart' button
        await productActions.addToCartFromDetailPage();

        // 8. Click 'View Cart' button from the confirmation modal
        await productActions.productLocators.viewCartModalLink.click();
        await expect(page).toHaveURL(/.*view_cart.*/);

        // 9. Verify that product is displayed in cart page with exact quantity
        await expect(cartActions.cartLocators.cartQuantityButton).toHaveText(targetQuantity);
    });

    test('Test Case 18: View Category Products', async ({ page }) => {
        // 1-2. Launch browser & Navigate to url
        await authActions.navigateToHome();

        // 3. Verify that categories are visible on left side bar
        await expect(productActions.productLocators.categorySidebar).toBeVisible();

        // TIMING FIX: Give the platform's flaky Bootstrap script 1 second to bind its event handlers to the DOM
        await page.waitForTimeout(1000);

        // 4. Click on 'Women' category accordion heading to expand it
        await productActions.productLocators.getCategoryGroupHeader('Women').click();

        // Verify the container successfully toggled open by checking for the Bootstrap 'in' style class
        await expect(productActions.productLocators.womenCategoryPanel).toHaveClass(/collapse in|collapsing/);

        // 5. Click on 'Dress' sub-category link under 'Women' category
        const dressLink = productActions.productLocators.getCategorySubLink('Women', 'Dress');
        await dressLink.click();

        // 6. Verify that category page is displayed and confirm header text matches
        await expect(page).toHaveURL(/.*category_products.*/);
        await expect(productActions.productLocators.categoryTitleHeader).toHaveText('Women - Dress Products', { ignoreCase: true });

        // TIMING FIX: Brief pause for page switch state normalization
        await page.waitForTimeout(1000);

        // 7. On left side bar, click on any sub-category link of 'Men' category (e.g., Tshirts)
        await productActions.productLocators.getCategoryGroupHeader('Men').click();

        // Verify the men's container toggled open successfully
        await expect(productActions.productLocators.menCategoryPanel).toHaveClass(/collapse in|collapsing/);

        const tshirtsLink = productActions.productLocators.getCategorySubLink('Men', 'Tshirts');
        await tshirtsLink.click();

        // 8. Verify that user is navigated to that category page successfully
        await expect(page).toHaveURL(/.*category_products.*/);
        await expect(productActions.productLocators.categoryTitleHeader).toHaveText('Men - Tshirts Products', { ignoreCase: true });
    });

    test('Test Case 19: View & Cart Brand Products', async ({ page }) => {
        // 1-2. Launch browser & Navigate to url
        await authActions.navigateToHome();

        // 3. Click on 'Products' button
        await productActions.navigateToProductsViaHeaderLink();

        // 4. Verify that Brands are visible on left side bar
        await expect(productActions.productLocators.brandSidebar).toBeVisible();

        // 5. Click on any brand name (e.g., Polo)
        await productActions.productLocators.getBrandLink('Polo').click();

        // 6. Verify that user is navigated to brand page and brand products are displayed
        await expect(page).toHaveURL(/.*brand_products.*/);
        await expect(productActions.productLocators.brandTitleHeader).toHaveText('Brand - Polo Products', { ignoreCase: true });

        // 7. On left side bar, click on any other brand link (e.g., H&M)
        await productActions.productLocators.getBrandLink('H&M').click();

        // 8. Verify that user is navigated to that brand page and can see products
        await expect(page).toHaveURL(/.*brand_products.*/);
        await expect(productActions.productLocators.brandTitleHeader).toHaveText('Brand - H&M Products', { ignoreCase: true });
    });

    test('Test Case 20: Search Products and Verify Cart After Login', async ({ page }) => {
        const timestamp = Date.now();
        const userName = 'QA Cart Tester';
        const userEmail = `cart_tester_${timestamp}@example.com`;
        const userPassword = process.env.TEST_PASSWORD || 'FallbackPass123!';

        // PRE-REQ SETUP: Register a fresh user account (guarantees 0 pre-existing cart items)
        await authActions.navigateToHome();
        await authActions.navigateToSignupLogin();
        await authActions.fillSignupForm(userName, userEmail);
        await authActions.fillAccountDetailsForm(userPassword);
        await checkoutActions.clickContinue();
        await authActions.logout();

        // 1-2. Launch browser & Navigate to url
        await authActions.navigateToHome();

        // 3-4. Click 'Products' button & verify navigate to ALL PRODUCTS
        await productActions.navigateToProducts();
        await expect(page).toHaveURL(/.*products/);

        // 5-6. Enter product name in search input and click search button
        const searchTerm = 'dress';
        await productActions.searchProduct(searchTerm);
        await expect(productActions.productLocators.searchedProductsTitle).toContainText('Searched Products');

        // 7-8. Verify products related to search are visible and add all to cart
        await productActions.addAllVisibleProductsToCart();

        // 9. Click 'Cart' button and verify products are visible in cart
        await cartActions.cartLocators.navbarCartLink.click();
        await page.waitForURL('**/view_cart');

        const preLoginCartItemsRow = productActions.productLocators.cartItemsTableRows;
        const totalItemsCount = await preLoginCartItemsRow.count();
        expect(totalItemsCount).toBeGreaterThan(0);

        // 10. Click 'Signup / Login' button and submit login details
        await authActions.navigateToSignupLogin();
        await authActions.loginExistingUser(userEmail, userPassword);

        // 11. Again, go to Cart page
        await cartActions.cartLocators.navbarCartLink.click();
        await page.waitForURL('**/view_cart');

        // 12. Verify that those exact products are visible in cart after login
        const postLoginCartItemsRow = productActions.productLocators.cartItemsTableRows;
        await expect(postLoginCartItemsRow).toHaveCount(totalItemsCount);

        // Cleanup: Delete created account
        await authActions.deleteAccount();
        await checkoutActions.clickContinue();
    });

    test('Test Case 21: Add review on product', async ({ page }) => {
        const reviewData = {
            name: 'Rusitha Dilshan',
            email: 'testuser@example.com',
            text: 'Great quality product! Very satisfied with the material and fast shipping.'
        };

        // 1-2. Launch browser & Navigate to url
        await authActions.navigateToHome();

        // 3. Click on 'Products' button
        await productActions.navigateToProducts();

        // 4. Verify user is navigated to ALL PRODUCTS page successfully
        await expect(productActions.productLocators.productHeader).toHaveText('All Products');

        // 5. Click on 'View Product' button
        await productActions.clickFirstProduct();
        await expect(page).toHaveURL(/.*product_details.*/);

        // 6. Verify 'Write Your Review' is visible
        await expect(productActions.productLocators.writeReviewHeader).toBeVisible();

        // 7-8. Enter name, email, review and click 'Submit' button
        await productActions.submitReview(reviewData.name, reviewData.email, reviewData.text);

        // 9. Verify success message 'Thank you for your review.'
        await expect(productActions.productLocators.reviewSuccessAlert).toBeVisible();
        await expect(productActions.productLocators.reviewSuccessAlert).toContainText('Thank you for your review.');
    });
});