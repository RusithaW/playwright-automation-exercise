/// <reference types="node" />
import { test, expect } from '../baseTest';
import { AuthActions } from '../pages/actions/AuthActions';
import { ProductActions } from '../pages/actions/ProductActions';
import { CartActions } from '../pages/actions/CartActions';

test.describe('Products Page Navigation and Search Validations', () => {
    let auth: AuthActions;
    let product: ProductActions;
    let cart: CartActions;

    test.beforeEach(({ page }) => {
        auth = new AuthActions(page);
        product = new ProductActions(page);
        cart = new CartActions(page);
    });

    test('Test Case 8: Verify All Products and product detail page', async ({ page }) => {
        await auth.navigateToHome();
        await expect(auth.authLocators.homeFeaturedItems).toBeVisible();

        await product.navigateToProducts();
        await expect(product.productLocators.productHeader).toHaveText('All Products');
        await expect(product.productLocators.productsGrid).toBeVisible();

        await product.clickFirstProduct();
        await expect(page).toHaveURL(/.*product_details/);

        const locators = product.productLocators;
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
        await auth.navigateToHome();
        await expect(auth.authLocators.homeFeaturedItems).toBeVisible();

        await product.navigateToProducts();
        await expect(product.productLocators.productHeader).toHaveText('All Products');

        // Execute search query
        await product.searchProduct(searchTerm);
        await expect(product.productLocators.searchedProductsHeader).toBeVisible();

        // Assert search results matching parameters are displayed on the UI layout
        const searchResults = product.productLocators.productItems;
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
        await auth.navigateToHome();
        await expect(auth.authLocators.homeFeaturedItems).toBeVisible();

        // 4. Click 'View Product' for any product on home page
        await product.clickFirstProduct();

        // 5. Verify product detail is opened
        await expect(page).toHaveURL(/.*product_details.*/);
        await expect(product.productLocators.productName).toBeVisible();

        // 6. Increase quantity to 4
        await product.setProductQuantity(targetQuantity);

        // 7. Click 'Add to cart' button
        await product.addToCartFromDetailPage();

        // 8. Click 'View Cart' button from the confirmation modal
        await product.productLocators.viewCartModalLink.click();
        await expect(page).toHaveURL(/.*view_cart.*/);

        // 9. Verify that product is displayed in cart page with exact quantity
        const cartQuantityButton = page.locator('#cart_info_table .disabled');
        await expect(cartQuantityButton).toHaveText(targetQuantity);
    });

    test('Test Case 18: View Category Products', async ({ page }) => {
        // 1-2. Launch browser & Navigate to url
        await auth.navigateToHome();

        // 3. Verify that categories are visible on left side bar
        await expect(product.productLocators.categorySidebar).toBeVisible();

        // TIMING FIX: Give the platform's flaky Bootstrap script 1 second to bind its event handlers to the DOM
        await page.waitForTimeout(1000);

        // 4. Click on 'Women' category accordion heading to expand it
        await product.productLocators.getCategoryGroupHeader('Women').click();

        // Verify the container successfully toggled open by checking for the Bootstrap 'in' style class
        const womenPanel = page.locator('#Women');
        await expect(womenPanel).toHaveClass(/collapse in|collapsing/);

        // 5. Click on 'Dress' sub-category link under 'Women' category
        const dressLink = product.productLocators.getCategorySubLink('Women', 'Dress');
        await dressLink.click();

        // 6. Verify that category page is displayed and confirm header text matches
        await expect(page).toHaveURL(/.*category_products.*/);
        await expect(product.productLocators.categoryTitleHeader).toHaveText('Women - Dress Products', { ignoreCase: true });

        // TIMING FIX: Brief pause for page switch state normalization
        await page.waitForTimeout(1000);

        // 7. On left side bar, click on any sub-category link of 'Men' category (e.g., Tshirts)
        await product.productLocators.getCategoryGroupHeader('Men').click();

        // Verify the men's container toggled open successfully
        const menPanel = page.locator('#Men');
        await expect(menPanel).toHaveClass(/collapse in|collapsing/);

        const tshirtsLink = product.productLocators.getCategorySubLink('Men', 'Tshirts');
        await tshirtsLink.click();

        // 8. Verify that user is navigated to that category page successfully
        await expect(page).toHaveURL(/.*category_products.*/);
        await expect(product.productLocators.categoryTitleHeader).toHaveText('Men - Tshirts Products', { ignoreCase: true });
    });

    test('Test Case 19: View & Cart Brand Products', async ({ page }) => {
        // 1-2. Launch browser & Navigate to url
        await auth.navigateToHome();

        // 3. Click on 'Products' button
        // Assuming your 'product' POM instance has a navigation handler or header navigation
        await page.getByRole('link', { name: ' Products' }).click();

        // 4. Verify that Brands are visible on left side bar
        await expect(product.productLocators.brandSidebar).toBeVisible();

        // 5. Click on any brand name (e.g., Polo)
        await product.productLocators.getBrandLink('Polo').click();

        // 6. Verify that user is navigated to brand page and brand products are displayed
        await expect(page).toHaveURL(/.*brand_products.*/);
        await expect(product.productLocators.brandTitleHeader).toHaveText('Brand - Polo Products', { ignoreCase: true });

        // 7. On left side bar, click on any other brand link (e.g., H&M)
        await product.productLocators.getBrandLink('H&M').click();

        // 8. Verify that user is navigated to that brand page and can see products
        await expect(page).toHaveURL(/.*brand_products.*/);
        await expect(product.productLocators.brandTitleHeader).toHaveText('Brand - H&M Products', { ignoreCase: true });
    });

    test('Test Case 20: Search Products and Verify Cart After Login', async ({ page }) => {
        const staticEmail = process.env.TEST_EMAIL || 'tester_22072026@example.com';
        const staticPassword = process.env.TEST_USER_PASSWORD || '4LREwhu74@XuYVi!!';
        const searchTerm = 'Top';

        // 1-2. Launch browser & Navigate to url
        await auth.navigateToHome();

        // 3. Click on 'Products' button
        await product.navigateToProducts();

        // 4. Verify user is navigated to ALL PRODUCTS page successfully
        await expect(product.productLocators.productHeader).toHaveText('All Products');

        // 5. Enter product name in search input and click search button
        await product.searchProduct(searchTerm);

        // 6. Verify 'SEARCHED PRODUCTS' is visible
        await expect(product.productLocators.searchedProductsHeader).toBeVisible();

        // 7. Verify all the products related to search are visible
        const searchResults = product.productLocators.productItems;
        const totalItemsCount = await searchResults.count();
        await expect(totalItemsCount).toBeGreaterThan(0);

        // 8. Add those products to cart
        await product.addAllVisibleProductsToCart();

        // 9. Click 'Cart' button and verify that products are visible in cart
        await cart.navigateToCart();
        await expect(page).toHaveURL(/.*view_cart.*/);

        // Assert that the number of distinct row entries matches the items we added
        const initialCartItemsRow = page.locator('#cart_info_table tbody tr');
        await expect(initialCartItemsRow).toHaveCount(totalItemsCount);

        // 10. Click 'Signup / Login' button and submit login details
        await auth.navigateToSignupLogin();

        // Feed your standard test account credentials here
        await auth.loginExistingUser(staticEmail, staticPassword);

        // 11. Again, go to Cart page
        await cart.navigateToCart();
        await expect(page).toHaveURL(/.*view_cart.*/);

        // 12. Verify that those products are visible in cart after login as well
        const postLoginCartItemsRow = page.locator('#cart_info_table tbody tr');
        await expect(postLoginCartItemsRow).toHaveCount(totalItemsCount);
    });
});