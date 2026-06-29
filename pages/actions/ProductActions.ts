import { Page } from '@playwright/test';
import { ProductLocators } from '../locators/ProductLocators';

export class ProductActions {
    readonly page: Page;
    readonly productLocators: ProductLocators;

    constructor(page: Page) {
        this.page = page;
        this.productLocators = new ProductLocators(page);
    }

    // Navigates to the Products page
    async navigateToProducts() {
        await this.page.goto('/products');
    }

    // Clicks on the first 'View Product' link (Added)
    async clickFirstProduct() {
        await this.productLocators.viewProductButton.click();
    }
}