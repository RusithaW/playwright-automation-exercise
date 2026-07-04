import { Page, Locator } from '@playwright/test';

export class CartLocators {
    readonly page: Page;
    readonly cartBreadcrumb: Locator;
    readonly cartRows: Locator;

    constructor(page: Page) {
        this.page = page;
        this.cartBreadcrumb = page.locator('.breadcrumb .active:has-text("Shopping Cart")');
        this.cartRows = page.locator('table#cart_info_table tbody tr');
    }

    // Method to get details of a specific cart item row by index
    getCartItemRowDetails(index: number) {
        const row = this.cartRows.nth(index);
        return {
            name: row.locator('.cart_description h4 a'),
            price: row.locator('.cart_price p'),
            quantity: row.locator('.cart_quantity button'),
            totalPrice: row.locator('.cart_total_price p')
        };
    }
}

