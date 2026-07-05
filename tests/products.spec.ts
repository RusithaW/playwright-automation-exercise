/// <reference types="node" />
import { test, expect } from '../baseTest';
import { AuthActions } from '../pages/actions/AuthActions';
import { ProductActions } from '../pages/actions/ProductActions';

test.describe('Products Page Navigation and Search Validations', () => {
    let auth: AuthActions;
    let product: ProductActions;

    test.beforeEach(({ page }) => {
        auth = new AuthActions(page);
        product = new ProductActions(page);
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
});