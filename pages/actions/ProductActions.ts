import { Page } from '@playwright/test';
import { ProductLocators } from '../locators/ProductLocators';

export class ProductActions {
    readonly page: Page;
    readonly productLocators: ProductLocators;

    constructor(page: Page) {
        this.page = page;
        this.productLocators = new ProductLocators(page);
    }

    // Navigates directly to the global products overview catalog URL context
    async navigateToProducts() {
        await this.page.goto('/products');
    }

    // Opens the details sheet for the first product displayed in the active list
    async clickFirstProduct() {
        await this.productLocators.viewProductButton.click();
    }

    // Enters a search parameter and submits the query
    async searchProduct(productName: string) {
        await this.productLocators.searchInput.fill(productName);
        await this.productLocators.searchButton.click();
    }

    // [TC12 Addition]: Sequences multi-layered overlays without letting thread executions collide
    async addTwoProductsSequential() {
        await this.productLocators.firstProductCard.locator('.add-to-cart').first().click();
        await this.productLocators.continueShoppingButton.waitFor({ state: 'visible' });
        await this.productLocators.continueShoppingButton.click();
        await this.productLocators.secondProductCard.locator('.add-to-cart').first().click();
        await this.productLocators.viewCartModalLink.waitFor({ state: 'visible' });
        await this.productLocators.viewCartModalLink.click();
    }

    // [TC13 Addition]: Core input handlers for fine-tuned details modifications
    async setProductQuantityAndAddToCart(quantity: string) {
        await this.productLocators.quantityInput.fill(quantity.toString());
        await this.productLocators.addToCartDetailButton.click();
    }
}