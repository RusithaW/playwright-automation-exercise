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

    test('Test Case 13: Verify Product quantity in Cart', async () => {
        // [TC13 Added]: Verifies that deep modifications on product detail screens transfer to cart states accurately
        await auth.navigateToHome();
        await product.clickFirstProduct();

        const countSetting = '4';
        await product.setProductQuantityAndAddToCart(countSetting);
        await product.productLocators.viewCartModalLink.click();

        const matchedItem = cart.cartLocators.getCartItemRowDetails(0);
        await expect(matchedItem.quantity).toHaveText(countSetting);
    });
});  