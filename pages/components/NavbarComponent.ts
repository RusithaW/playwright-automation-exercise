import { Page, Locator } from '@playwright/test';

/**
 * NavbarComponent Class
 * Page Object Component representing the main navigation header present across the application.
 * Encapsulates global navigation locators and user action methods.
 */
export class NavbarComponent {
    /** Locator for the 'Signup / Login' link in the header */
    readonly signupLoginLink: Locator;

    /** Locator for the 'Logout' link in the header */
    readonly logoutLink: Locator;

    /** Locator for the 'Delete Account' link in the header */
    readonly deleteAccountLink: Locator;

    /** Locator for the 'Logged in as [Username]' banner text */
    readonly loggedInAsUser: Locator;

    /** Locator for the 'Contact us' link in the header */
    readonly contactUsLink: Locator;

    /**
     * Initializes header locators scoped to the provided Playwright Page instance.
     * 
     * @param page - Playwright Page object representing the active browser tab.
     */
    constructor(page: Page) {
        this.signupLoginLink = page.getByRole('link', { name: 'Signup / Login' });
        this.logoutLink = page.getByRole('link', { name: 'Logout' });
        this.deleteAccountLink = page.getByRole('link', { name: 'Delete Account' });
        this.loggedInAsUser = page.getByText(/Logged in as/i);
        this.contactUsLink = page.getByRole('link', { name: 'Contact us' });
    }

    /**
     * Navigates to the Authentication page by clicking the 'Signup / Login' link.
     */
    async clickSignupLogin(): Promise<void> {
        await this.signupLoginLink.click();
    }

    /**
     * Logs the current user out by clicking the 'Logout' link.
     */
    async clickLogout(): Promise<void> {
        await this.logoutLink.click();
    }

    /**
     * Triggers account deletion by clicking the 'Delete Account' link.
     */
    async clickDeleteAccount(): Promise<void> {
        await this.deleteAccountLink.click();
    }

    /**
     * Navigates to the support form by clicking the 'Contact us' link.
     */
    async clickContactUs(): Promise<void> {
        await this.contactUsLink.click();
    }
}