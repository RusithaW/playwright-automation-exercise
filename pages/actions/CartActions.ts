import { Page } from '@playwright/test';
import { CartLocators } from '../locators/CartLocators';

export class CartActions {
    readonly page: Page;
    readonly cartLocators: CartLocators;

    constructor(page: Page) {
        this.page = page;
        this.cartLocators = new CartLocators(page);
    }

    // Navigates directly to the global checkout / cart bucket route context
    async navigateToCart() {
        await this.page.goto('/view_cart');
    }
}