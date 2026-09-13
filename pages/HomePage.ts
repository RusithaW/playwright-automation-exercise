import { Page, Locator, expect } from '@playwright/test';

/**
 * HomePage Class
 * Page Object representing the main application landing page (`/`).
 * Handles main banner verification, scroll positioning, and email newsletter subscriptions.
 */
export class HomePage {
    private readonly page: Page;

    /** Locator for featured items section grid */
    readonly featuredItems: Locator;

    /** Locator for test cases header link */
    readonly testCasesLink: Locator;

    /** Locator for test cases section title */
    readonly testCasesHeader: Locator;

    /** Locator for floating scroll-to-top button */
    readonly scrollUpButton: Locator;

    /** Locator for hero banner heading text */
    readonly topBannerHeader: Locator;

    /** Locator for footer subscription heading */
    readonly subscriptionText: Locator;

    /** Locator for newsletter subscription email input field */
    readonly subscriptionInput: Locator;

    /** Locator for subscription form submit button */
    readonly subscriptionButton: Locator;

    /** Locator for subscription confirmation alert banner */
    readonly subscriptionSuccessAlert: Locator;

    /** Locator for 'RECOMMENDED ITEMS' section header */
    readonly recommendedItemsHeader: Locator;

    /** Locator for recommended items carousel/container */
    readonly recommendedItemsSection: Locator;

    /**
     * Initializes home page locators.
     * 
     * @param page - Active Playwright Page instance.
     */
    constructor(page: Page) {
        this.page = page;

        // Elements
        this.featuredItems = page.locator('.features_items');
        this.testCasesLink = page.getByRole('link', { name: 'Test Cases' }).first();
        // Fixed strict mode violation by enforcing exact match
        this.testCasesHeader = page.getByRole('heading', { name: 'Test Cases', exact: true });
        this.scrollUpButton = page.locator('#scrollUp');
        this.topBannerHeader = page.getByRole('heading', { name: 'Full-Fledged practice website for Automation Engineers' }).first();

        // Footer / Subscription
        this.subscriptionText = page.getByRole('heading', { name: 'Subscription' });
        // Fixed locator strategy to target native element IDs directly
        this.subscriptionInput = page.locator('#susbscribe_email');
        this.subscriptionButton = page.locator('#subscribe');
        this.subscriptionSuccessAlert = page.locator('#success-subscribe .alert-success');

        // Recommended Items
        this.recommendedItemsHeader = page.locator('h2:has-text("RECOMMENDED ITEMS")');
        this.recommendedItemsSection = page.locator('#recommended-item-carousel');
    }

    /**
     * Directs browser to base application URL.
     * 
     * @returns Promise resolving when DOM loading completes.
     */
    async navigateToHome(): Promise<void> {
        await this.page.goto('/', { waitUntil: 'commit' });
    }

    /**
     * Clicks Test Cases navigation link in header.
     */
    async navigateToTestCases(): Promise<void> {
        await this.testCasesLink.click();
    }

    /**
     * Scrolls viewport down until footer subscription header is in view.
     */
    async scrollToFooter(): Promise<void> {
        await this.subscriptionText.scrollIntoViewIfNeeded();
    }

    /**
     * Scrolls window to maximum bottom position using JS evaluate execution.
     */
    async scrollToBottom(): Promise<void> {
        await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    }

    /**
     * Scrolls window back to top origin position using JS evaluate execution.
     */
    async scrollToTop(): Promise<void> {
        await this.page.evaluate(() => window.scrollTo(0, 0));
    }

    /**
     * Submits an email address into the footer subscription form.
     * 
     * @param email - Target subscription email address.
     */
    async subscribe(email: string): Promise<void> {
        await this.subscriptionInput.scrollIntoViewIfNeeded();
        await this.subscriptionInput.fill(email);
        await this.subscriptionButton.click();
    }

    /**
     * Waits for subscription success alert to become visible.
     */
    async waitForSubscriptionSuccessAlert(): Promise<void> {
        await expect(this.subscriptionSuccessAlert).toBeVisible({ timeout: 20000 });
    }

    /**
    * Adds the first visible product from the Recommended Items carousel to cart.
    */
    /**
* Adds the first product from the Recommended Items carousel to cart.
*/
    async addFirstRecommendedItemToCart(): Promise<void> {
        await this.recommendedItemsSection.scrollIntoViewIfNeeded();

        const activeItem = this.recommendedItemsSection.locator('.item.active').first();
        const addToCartLink = activeItem.locator('a:has-text("Add to cart")').first();

        // This site's modal occasionally fails to open on the first click
        // (cause unconfirmed, suspected JS-binding timing) — retry the click
        // itself rather than waiting once and failing.
        await expect(async () => {
            await addToCartLink.waitFor({ state: 'visible', timeout: 15000 });
            await addToCartLink.click();
            await this.page.locator('#cartModal').waitFor({ state: 'visible', timeout: 3000 });
        }).toPass({ timeout: 20000 });
    }
}