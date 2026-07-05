import { test, expect } from '../baseTest';
import { AuthActions } from '../pages/actions/AuthActions';
import { ProductActions } from '../pages/actions/ProductActions';
import { CartActions } from '../pages/actions/CartActions';


test.describe('Shopping Cart Flow Architecture Validation', () => {
    let auth: AuthActions;
    let product: ProductActions;
    let cart: CartActions;

    test.beforeEach(async ({ page }) => {
        auth = new AuthActions(page);
        product = new ProductActions(page);
        cart = new CartActions(page);
    });

    test('Test Case 12: Add Products in Cart', async ({ page }) => {
        // 1. Initialize Action Classes
        const product = new ProductActions(page);
        const cart = new CartActions(page);

        // 2. Execute steps
        await page.goto('/'); // Equivalent to auth.navigateToHome() if not using fixtures
        await product.navigateToProducts();
        await product.addTwoProductsSequential();

        // 3. Assertions
        await expect(cart.cartLocators.cartBreadcrumb).toBeVisible();
        await expect(cart.cartLocators.cartRows).toHaveCount(2);

        const rowOne = cart.cartLocators.getCartItemRowDetails(0);
        const rowTwo = cart.cartLocators.getCartItemRowDetails(1);

        await expect(rowOne.name).toBeVisible();
        await expect(rowOne.price).toBeVisible();
        await expect(rowOne.quantity).toHaveText('1');

        await expect(rowTwo.name).toBeVisible();
        await expect(rowTwo.price).toBeVisible();
        await expect(rowTwo.quantity).toHaveText('1');
    });

    test('Test 17: Remove All Products Dynamically From Cart', async ({ page }) => {
        await auth.navigateToHome();
        await page.waitForLoadState('networkidle');

        // 1. Add items and view the cart
        await product.addTwoProductsSequential();
        await cart.navigateToCart();

        // 2. Clear the cart dynamically by driving down the live item count
        let initialCount = await cart.cartLocators.cartRows.count();

        while (initialCount > 0) {
            // Always target the delete button inside the first active row
            const firstDeleteButton = cart.cartLocators.cartRows.first().locator('.cart_quantity_delete');
            await firstDeleteButton.click();

            // FIX: Instead of waiting for element detachment, expect the live row count to drop by 1
            await expect(cart.cartLocators.cartRows).toHaveCount(initialCount - 1);

            // Update the control counter to match the new live state
            initialCount = await cart.cartLocators.cartRows.count();
        }

        // 3. Final Assertions: Verify everything is completely cleared
        await expect(cart.cartLocators.cartRows).toHaveCount(0);
        await expect(page.locator('#empty_cart')).toBeVisible();
    });
});  