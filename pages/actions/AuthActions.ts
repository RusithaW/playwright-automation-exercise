import { Page } from '@playwright/test';
import { AuthLocators } from '../locators/AuthLocators';

export class AuthActions {
    readonly page: Page;
    readonly authLocators: AuthLocators;

    constructor(page: Page) {
        this.page = page;
        this.authLocators = new AuthLocators(page);
    }

    // Navigates directly to the Auth view using the base URL setup
    async navigateToSignupLogin() {
        await this.page.goto('/login');
    }

    // Handles the initial signup card actions (Right side of screen)
    async fillSignupForm(name: string, email: string) {
        await this.authLocators.signupNameInput.fill(name);
        await this.authLocators.signupEmailInput.fill(email);
        await this.authLocators.signupButton.click();
    }

    // Handles the standard login flow card actions (Left side of screen)
    async loginExistingUser(email: string, password: string) {
        await this.authLocators.loginEmailInput.fill(email);
        await this.authLocators.loginPasswordInput.fill(password);
        await this.authLocators.loginButton.click();
    }

    // Handles filling out the massive detailed form after clicking 'Signup'
    async fillAccountDetailsForm(password: string) {
        // Select Title (Mr.)
        await this.authLocators.genderTitleMr.check();

        // Enter Account Info
        await this.authLocators.passwordInput.fill(password);
        await this.authLocators.daysSelect.selectOption('15');
        await this.authLocators.monthsSelect.selectOption('5');
        await this.authLocators.yearsSelect.selectOption('1995');

        // Enter Address Info
        await this.authLocators.firstNameInput.fill('John');
        await this.authLocators.lastNameInput.fill('Doe');
        await this.authLocators.addressInput.fill('123 Automation St.');
        await this.authLocators.countrySelect.selectOption('United States');
        await this.authLocators.stateInput.fill('California');
        await this.authLocators.cityInput.fill('Los Angeles');
        await this.authLocators.zipcodeInput.fill('90001');
        await this.authLocators.mobileNumberInput.fill('1234567890');

        // Submit the comprehensive registration form
        await this.authLocators.createAccountButton.click();
    }
}