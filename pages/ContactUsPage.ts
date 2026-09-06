import { Page, Locator } from '@playwright/test';

/**
 * ContactUsPage Class
 * Page Object representing the customer support feedback page (`/contact_us`).
 * Encapsulates support form submission, file upload handling, and browser dialog accepting.
 */
export class ContactUsPage {
    readonly page: Page;

    /** Locator for header link navigating to Contact Us form */
    readonly contactUsLink: Locator;

    /** Locator for 'GET IN TOUCH' header */
    readonly getInTouchHeader: Locator;

    /** Locator for form submission success message alert */
    readonly successMessage: Locator;

    /** Locator for home page return button */
    readonly homeButton: Locator;

    /** Locator for sender name input field */
    readonly nameInput: Locator;

    /** Locator for sender email input field */
    readonly emailInput: Locator;

    /** Locator for support request subject input field */
    readonly subjectInput: Locator;

    /** Locator for detailed message textarea */
    readonly messageInput: Locator;

    /** Locator for file attachment input button */
    readonly uploadFileInput: Locator;

    /** Locator for contact form submit button */
    readonly submitButton: Locator;

    /**
     * Initializes contact page locators.
     * 
     * @param page - Active Playwright Page instance.
     */
    constructor(page: Page) {
        this.page = page;

        // Navigation & Headers
        this.contactUsLink = page.locator('text=Contact Us');
        this.getInTouchHeader = page.locator('h2:has-text("Get In Touch")');
        this.successMessage = page.locator('div.status.alert.alert-success');
        this.homeButton = page.locator('.navbar-nav a:has-text("Home")');

        // Form Fields & Buttons
        this.nameInput = page.locator('input[data-qa="name"]');
        this.emailInput = page.locator('input[data-qa="email"]');
        this.subjectInput = page.locator('input[data-qa="subject"]');
        this.messageInput = page.locator('textarea[data-qa="message"]');
        this.uploadFileInput = page.locator('input[name="upload_file"]');
        this.submitButton = page.locator('input[data-qa="submit-button"]');
    }

    /**
     * Navigates to contact page via header link.
     */
    async navigateToContactUs(): Promise<void> {
        await this.contactUsLink.click();
    }

    /**
     * Populates support message, attaches specified file, handles confirm dialog, and submits form.
     * 
     * @param name - Sender full name.
     * @param email - Sender contact email.
     * @param subject - Message subject title.
     * @param message - Support request description.
     * @param filePath - Local path to attachment file (optional).
     */
    async fillAndSubmitContactForm(name: string, email: string, subject: string, message: string, filePath?: string): Promise<void> {
        await this.nameInput.fill(name);
        await this.emailInput.fill(email);
        await this.subjectInput.fill(subject);
        await this.messageInput.fill(message);

        if (filePath) {
            await this.uploadFileInput.setInputFiles(filePath);
        }

        this.page.once('dialog', async (dialog) => {
            await dialog.accept();
        });

        await this.submitButton.click();
    }

    /**
     * Navigates back to the landing page via home button click.
     */
    async clickHomeButton(): Promise<void> {
        await this.homeButton.click();
    }
}