import { test, expect } from '@playwright/test'; // Or your custom '../baseTest'
import { ProductActions } from '../pages/actions/ProductActions';
import { CartActions } from '../pages/actions/CartActions';

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