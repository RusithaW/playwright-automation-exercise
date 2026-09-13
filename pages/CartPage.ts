import { Page, Locator } from '@playwright/test';

/**
 * CartPage Class
 * Page Object representing the Shopping Cart view (`/view_cart`).
 * Handles item table interactions and checkout navigation.
 */
export class CartPage {
    readonly page: Page;

    /** Locator for header navigation link to cart */
    readonly navbarCartLink: Locator;

    /** Locator for cart breadcrumb active indicator */
    readonly cartBreadcrumb: Locator;

    /** Locator for cart table row elements */
    readonly cartRows: Locator;

    /** Locator for disabled quantity display button */
    readonly cartQuantityButton: Locator;

    /** Locator for 'Proceed To Checkout' navigation button */
    readonly proceedToCheckoutButton: Locator;

    /**
     * Initializes cart page locators.
     *
     * @param page - Active Playwright Page instance.
     */
    constructor(page: Page) {
        this.page = page;
        this.navbarCartLink = page.locator('header .navbar-nav a[href="/view_cart"]');
        this.cartBreadcrumb = page.locator('.breadcrumb .active:has-text("Shopping Cart")');
        this.cartRows = page.locator('table#cart_info_table tbody tr');
        this.cartQuantityButton = page.locator('#cart_info_table .disabled');
        this.proceedToCheckoutButton = page.locator('a.btn.btn-default.check_out');
    }

    /**
     * Dynamic helper providing field-level locators for a specific cart row index.
     *
     * @param index - Zero-based index of target table row.
     * @returns Object containing sub-locators for name, price, quantity, total, and deletion.
     */
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

    /**
     * Triggers navigation to the shopping cart view via header link.
     */
    async navigateToCart(): Promise<void> {
        await this.navbarCartLink.click();
    }

    /**
     * Waits for page load stabilization and clicks 'Proceed To Checkout'.
     */
    async clickProceedToCheckout(): Promise<void> {
        await this.proceedToCheckoutButton.waitFor({ state: 'visible', timeout: 15000 });
        await this.proceedToCheckoutButton.click();
    }

    // Note: an earlier `removeAllProductsDynamically()` method previously
    // lived here but was never called anywhere in the suite — TC17
    // ("Remove All Products Dynamically From Cart") implements its own
    // inline delete loop directly in cart.spec.ts using
    // `expect().toPass()`, which is the version actually exercised.
    // Removed to avoid having two divergent implementations of the same
    // behavior, only one of which was live.
}