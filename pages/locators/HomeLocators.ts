import { Page, Locator } from '@playwright/test';

export class HomeLocators {
    readonly page: Page;

    // Navigation & headers
    readonly testCasesLink: Locator;
    readonly testCasesHeader: Locator;

    //Subscription elements
    readonly subscriptionText: Locator;
    readonly subscriptionInput: Locator;
    readonly subscriptionButton: Locator;
    readonly subscriptionSuccessAlert: Locator;


    constructor(page: Page) {
        this.page = page;

        // Navigation & headers selectors
        this.testCasesLink = page.locator('.navbar-nav a:has-text("Test Cases")');
        this.testCasesHeader = page.locator('h2:has-text("Test Cases")');

        // Target the standard subscription elements
        this.subscriptionText = page.locator('.footer-widget h2, .single-widget h2');
        this.subscriptionInput = page.locator('#susbscribe_email');
        this.subscriptionButton = page.locator('#subscribe');
        this.subscriptionSuccessAlert = page.locator('#success-subscribe .alert-success');
    }
}