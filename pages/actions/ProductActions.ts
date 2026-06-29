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
}