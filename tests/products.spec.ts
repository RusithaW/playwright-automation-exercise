/// <reference types="node" />
import { test, expect } from '../baseTest';
import { AuthActions } from '../pages/actions/AuthActions';
import { HomeActions } from '../pages/actions/HomeActions';
import { ProductActions } from '../pages/actions/ProductActions';
import * as path from 'path';

test.describe('Products Page Navigation and Test Cases', () => {
    let auth: AuthActions;
    let home: HomeActions;
    let product: ProductActions;

    test.beforeEach(({ page }) => {
        auth = new AuthActions(page);
        home = new HomeActions(page);
        product = new ProductActions(page);
    });

    test('Test Case 8: Verify All Products and product detail page', async ({ page }) => {
        // 1-3. Navigate to the application landing page and verify visibility
        await auth.navigateToHome();
        await expect(auth.authLocators.homeFeaturedItems).toBeVisible();

        // 4-5. Navigate to the Products view and verify the section header
        await product.navigateToProducts();
        await expect(product.productLocators.productHeader).toHaveText('All Products');

        // 6. Verify the products list is visible
        await expect(product.productLocators.productsGrid).toBeVisible();

        // 7. Click on 'View Product' of first product
        await product.clickFirstProduct();

        // 8. User is landed to product detail page
        await expect(page).toHaveURL(/.*product_details/);

        // 9. Verify that detail block elements are visible
        const locators = product.productLocators;
        await expect(locators.productName).toBeVisible();
        await expect(locators.productCategory).toBeVisible();
        await expect(locators.productPrice).toBeVisible();
        await expect(locators.productAvailability).toBeVisible();
        await expect(locators.productCondition).toBeVisible();
        await expect(locators.productBrand).toBeVisible();
    });
});