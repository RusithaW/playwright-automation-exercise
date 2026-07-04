import { Page, Locator } from '@playwright/test';

export class CartLocators {
    readonly page: Page;

    readonly cartBreadcrumb: Locator;
    readonly cartRows: Locator;

    constructor(page: Page) {
        this.page = page;

        // This structural breadcrumb element checks that you are truly on the view_cart page context
        this.cartBreadcrumb = page.locator('.breadcrumb .active:has-text("Shopping Cart")');
        this.cartRows = page.locator('table#cart_info_table tbody tr');
    }
}
