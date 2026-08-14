import { test, expect } from '../baseTest';
import { AuthActions } from '../pages/actions/AuthActions';
import { ProductActions } from '../pages/actions/ProductActions';
import { CartActions } from '../pages/actions/CartActions';

test.describe('Shopping Cart Flow Architecture Validation', () => {
    let authActions: AuthActions;
    let productActions: ProductActions;
    let cartActions: CartActions;

    test.beforeEach(async ({ page }) => {
        authActions = new AuthActions(page);
        productActions = new ProductActions(page);
        cartActions = new CartActions(page);
    });

    test('Test Case 12: Add Products in Cart', async () => {
        // 1. Navigate and add products using initialized page objects
        await authActions.navigateToHome();
        await productActions.navigateToProducts();
        await productActions.addTwoProductsSequential();

        // 2. Assertions
        await expect(cartActions.cartLocators.cartBreadcrumb).toBeVisible();
        await expect(cartActions.cartLocators.cartRows).toHaveCount(2);

        const rowOne = cartActions.cartLocators.getCartItemRowDetails(0);
        const rowTwo = cartActions.cartLocators.getCartItemRowDetails(1);

        await expect(rowOne.name).toBeVisible();
        await expect(rowOne.price).toBeVisible();
        await expect(rowOne.quantity).toHaveText('1');

        await expect(rowTwo.name).toBeVisible();
        await expect(rowTwo.price).toBeVisible();
        await expect(rowTwo.quantity).toHaveText('1');
    });

    test('Test Case 17: Remove All Products Dynamically From Cart', async ({ page }) => {
        // 1. Setup: Navigate and populate cart with products
        await authActions.navigateToHome();
        await productActions.navigateToProducts();
        await productActions.addTwoProductsSequential();

        // 2. Ensure cart table rows are loaded and visible
        await cartActions.cartLocators.cartRows.first().waitFor({ state: 'visible' });

        // 3. Dynamically loop through remaining rows and delete each item
        while ((await cartActions.cartLocators.cartRows.count()) > 0) {
            const targetRow = cartActions.cartLocators.cartRows.first();
            const rowId = await targetRow.getAttribute('id');

            // Retry click until jQuery fires and the DOM element is detached
            await expect(async () => {
                await targetRow.locator('.cart_quantity_delete').click();

                if (rowId) {
                    // ✨ FIX: Playwright uses .not.toBeAttached() to verify detachment
                    await expect(page.locator(`#${rowId}`)).not.toBeAttached({ timeout: 3000 });
                } else {
                    await expect(cartActions.cartLocators.cartRows).toHaveCount(
                        (await cartActions.cartLocators.cartRows.count()) - 1,
                        { timeout: 3000 }
                    );
                }
            }).toPass({ timeout: 15000 });
        }

        // 4. Verify empty cart container is displayed
        await expect(page.locator('#empty_cart')).toBeVisible();
    });
});