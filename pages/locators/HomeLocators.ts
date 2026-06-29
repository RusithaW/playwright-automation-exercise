import { Page, Locator } from '@playwright/test';

export class HomeLocators {
    readonly page: Page;

    // Navigation & headers
    readonly testCasesLink: Locator;
    readonly testCasesHeader: Locator;

    readonly subscriptionText: Locator;
    readonly subscriptionInput: Locator;
    readonly subscriptionButton: Locator;


    constructor(page: Page) {
        this.page = page;

        // Navigation & headers selectors
        this.testCasesLink = page.locator('.navbar-nav a:has-text("Test Cases")');
        this.testCasesHeader = page.locator('h2:has-text("Test Cases")');

        this.subscriptionText = page.locator('.footer-widget a:has-text("Subscription")');
        this.subscriptionInput = page.locator('#susbscribe_email');
        this.subscriptionButton = page.locator('#subscribe');
    }
}