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
});