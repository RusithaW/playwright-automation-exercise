import { Page, Locator } from '@playwright/test';

export class HomeLocators {
    readonly page: Page;

    // Navigation & headers
    readonly testCasesLink: Locator;
    readonly testCasesHeader: Locator;


    constructor(page: Page) {
        this.page = page;

        // Navigation & headers selectors
        this.testCasesLink = page.locator('.navbar-nav a:has-text("Test Cases")');
        this.testCasesHeader = page.locator('h2:has-text("Test Cases")');
    }
}