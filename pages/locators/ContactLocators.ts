import { Page, Locator } from '@playwright/test';

export class ContactLocators {
    readonly page: Page;

    // Navigation & headers
    readonly contactUsLink: Locator;
    readonly getInTouchHeader: Locator;
    readonly successMessage: Locator;
    readonly homeButton: Locator;

    // Contact form inputs & buttons
    readonly nameInput: Locator;
    readonly emailInput: Locator;
    readonly subjectInput: Locator;
    readonly messageInput: Locator;
    readonly uploadFileInput: Locator;
    readonly submitButton: Locator;

    constructor(page: Page) {
        this.page = page;

        // Navigation & headers selectors
        this.contactUsLink = page.locator('text=Contact Us');
        this.getInTouchHeader = page.locator('h2:has-text("Get In Touch")');
        this.successMessage = page.locator('div.status.alert.alert-success');
        this.homeButton = page.locator('.navbar-nav a:has-text("Home")');

        // Contact form field selectors
        this.nameInput = page.locator('input[data-qa="name"]');
        this.emailInput = page.locator('input[data-qa="email"]');
        this.subjectInput = page.locator('input[data-qa="subject"]');
        this.messageInput = page.locator('textarea[data-qa="message"]');
        this.uploadFileInput = page.locator('input[name="upload_file"]');
        this.submitButton = page.locator('input[data-qa="submit-button"]');
    }
}