import { Page, Locator } from '@playwright/test';

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
        await this.subscriptionSuccessAlert.waitFor({ state: 'visible' });
    }
}