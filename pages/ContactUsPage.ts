import { Page, Locator } from '@playwright/test';

/**
 * ContactUsPage Class
 * Page Object representing the customer support feedback page (`/contact_us`).
 * Encapsulates support form submission, file upload handling, and browser dialog accepting.
 */
export class ContactUsPage {
    readonly page: Page;

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
        // Note: navigation to this page is handled by
        // NavbarComponent.clickContactUs(), which is what every spec
        // actually calls — a separate `contactUsLink`/navigateToContactUs()
        // pair used to live here but was dead code (never referenced).
        this.getInTouchHeader = page.locator('h2:has-text("Get In Touch")');
        this.successMessage = page.locator('div.status.alert.alert-success');
        this.homeButton = page.locator('.navbar-nav a:has-text("Home")');

        // Form Fields & Buttons
        // Uses getByTestId() against the site's `data-qa` attributes,
        // matching `testIdAttribute: 'data-qa'` in playwright.config.ts,
        // instead of hand-rolled `[data-qa="..."]` CSS selectors.
        this.nameInput = page.getByTestId('name');
        this.emailInput = page.getByTestId('email');
        this.subjectInput = page.getByTestId('subject');
        this.messageInput = page.getByTestId('message');
        this.uploadFileInput = page.locator('input[name="upload_file"]');
        this.submitButton = page.getByTestId('submit-button');
    }

    /**
     * Populates support message, attaches specified file, handles the
     * native browser confirm dialog, and submits the form.
     *
     * The confirm() dialog is registered with `page.once()` (not `page.on()`)
     * so it only intercepts this one expected dialog, rather than silently
     * auto-accepting any future dialog that might appear later in the test.
     * It's registered BEFORE the click to avoid a race where the dialog
     * fires and gets auto-dismissed by Playwright's default behavior
     * before our handler is attached.
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

        await this.submitButton.waitFor({ state: 'visible' });
        this.page.once('dialog', dialog => dialog.accept());
        await this.submitButton.click();
    }

    /**
     * Navigates back to the landing page via home button click.
     */
    async clickHomeButton(): Promise<void> {
        await this.homeButton.click();
    }
}