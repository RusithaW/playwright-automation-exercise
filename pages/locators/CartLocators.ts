import { Page, Locator } from '@playwright/test';

export class CartLocators {
    readonly page: Page;

    //Core Locators for the Cart page
    readonly navbarCartLink: Locator;
    readonly cartBreadcrumb: Locator;
    readonly cartRows: Locator;
    readonly cartDeleteButtons: Locator;

    readonly proceedToCheckoutButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.navbarCartLink = page.locator('header .navbar-nav a[href="/view_cart"]');
        this.cartBreadcrumb = page.locator('.breadcrumb .active:has-text("Shopping Cart")');
        this.cartRows = page.locator('table#cart_info_table tbody tr');
        this.proceedToCheckoutButton = page.locator('a.btn.btn-default.check_out');
        this.cartDeleteButtons = page.locator('a.cart_quantity_delete');
    }

    // Method to get details of a specific cart item row by index
    getCartItemRowDetails(index: number) {
        const row = this.cartRows.nth(index);
        return {
            name: row.locator('.cart_description h4 a'),
            price: row.locator('.cart_price p'),
            quantity: row.locator('.cart_quantity button'),
            totalPrice: row.locator('.cart_total_price p'),
            deleteButton: row.locator('a.cart_quantity_delete')
        };
    }
}

