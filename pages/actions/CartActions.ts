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
        await this.cartLocators.navbarCartLink.click();
    }

    async clickProceedToCheckout() {
        await this.page.waitForLoadState('networkidle');
        await this.cartLocators.proceedToCheckoutButton.waitFor({ state: 'visible' });
        await this.cartLocators.proceedToCheckoutButton.click();
    }
}