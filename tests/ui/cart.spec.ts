import { test, expect } from '../../fixtures/uiFixtures';

test.describe('Shopping Cart Flow Architecture Validation', () => {

    test('Test Case 12: Add Products in Cart', async ({ homePage, productPage, cartPage }) => {
        // 1. Navigate and add products using page fixtures
        await homePage.navigateToHome();
        await productPage.navigateToProducts();
        await productPage.addTwoProductsSequential();

        // 2. Assertions
        await expect(cartPage.cartBreadcrumb).toBeVisible();
        await expect(cartPage.cartRows).toHaveCount(2);

        const rowOne = cartPage.getCartItemRowDetails(0);
        const rowTwo = cartPage.getCartItemRowDetails(1);

        await expect(rowOne.name).toBeVisible();
        await expect(rowOne.price).toBeVisible();
        await expect(rowOne.quantity).toHaveText('1');

        await expect(rowTwo.name).toBeVisible();
        await expect(rowTwo.price).toBeVisible();
        await expect(rowTwo.quantity).toHaveText('1');
    });

    test('Test Case 17: Remove All Products Dynamically From Cart', async ({ page, homePage, productPage, cartPage }) => {
        // 1. Setup: Navigate and populate cart with products
        await homePage.navigateToHome();
        await productPage.navigateToProducts();
        await productPage.addTwoProductsSequential();

        // 2. Ensure cart table rows are loaded
        await cartPage.cartRows.first().waitFor({ state: 'visible' });

        // 3. Dynamically loop through remaining rows and delete each item
        while ((await cartPage.cartRows.count()) > 0) {
            const targetRow = cartPage.cartRows.first();
            const rowId = await targetRow.getAttribute('id');

            await expect(async () => {
                await targetRow.locator('.cart_quantity_delete').click();

                if (rowId) {
                    await expect(page.locator(`#${rowId}`)).not.toBeAttached({ timeout: 3000 });
                } else {
                    await expect(cartPage.cartRows).toHaveCount(
                        (await cartPage.cartRows.count()) - 1,
                        { timeout: 3000 }
                    );
                }
            }).toPass({ timeout: 15000 });
        }

        // 4. Verify empty cart container is displayed
        await expect(page.locator('#empty_cart')).toBeVisible();
    });
});