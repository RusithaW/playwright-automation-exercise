import { Page, Locator } from '@playwright/test';

export interface AccountDetails {
    password?: string;
    day?: string;
    month?: string;
    year?: string;
    firstName?: string;
    lastName?: string;
    company?: string;
    address?: string;
    address2?: string;
    country?: string;
    state?: string;
    city?: string;
    zipcode?: string;
    mobileNumber?: string;
}

export class AuthPage {
    readonly page: Page;

    // Navigation & General Locators
    readonly homeFeaturedItems: Locator;
    readonly signupLoginLink: Locator;
    readonly logoutLink: Locator;
    readonly deleteAccountLink: Locator;
    readonly continueButton: Locator;
    readonly loggedInAsUser: Locator;

    // Headers & Messages
    readonly signupHeader: Locator;
    readonly loginHeader: Locator;
    readonly accountInfoHeader: Locator;
    readonly accountCreatedHeader: Locator;
    readonly accountDeletedHeader: Locator;
    readonly signupErrorMessage: Locator;
    readonly loginErrorMessage: Locator;

    // Login Form Locators
    readonly loginEmailInput: Locator;
    readonly loginPasswordInput: Locator;
    readonly loginButton: Locator;

    // Signup Form Locators
    readonly signupNameInput: Locator;
    readonly signupEmailInput: Locator;
    readonly signupButton: Locator;

    // Account Registration Details Form Locators
    readonly genderTitleMr: Locator;
    readonly passwordInput: Locator;
    readonly daysSelect: Locator;
    readonly monthsSelect: Locator;
    readonly yearsSelect: Locator;
    readonly newsletterCheckbox: Locator;
    readonly partnersCheckbox: Locator;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly companyInput: Locator;
    readonly addressInput: Locator;
    readonly address2Input: Locator;
    readonly countrySelect: Locator;
    readonly stateInput: Locator;
    readonly cityInput: Locator;
    readonly zipcodeInput: Locator;
    readonly mobileNumberInput: Locator;
    readonly createAccountButton: Locator;

    constructor(page: Page) {
        this.page = page;

        // General Navigation Locators
        this.homeFeaturedItems = page.locator('.features_items');
        this.signupLoginLink = page.getByRole('link', { name: 'Signup / Login' });
        this.logoutLink = page.getByRole('link', { name: 'Logout' });
        this.deleteAccountLink = page.getByRole('link', { name: 'Delete Account' });
        this.continueButton = page.getByTestId('continue-button');
        this.loggedInAsUser = page.getByText(/Logged in as/i);

        // Header & Alert Locators
        this.signupHeader = page.getByRole('heading', { name: 'New User Signup!' });
        this.loginHeader = page.getByRole('heading', { name: 'Login to your account' });
        this.accountInfoHeader = page.getByRole('heading', { name: 'Enter Account Information' });
        this.accountCreatedHeader = page.getByTestId('account-created');
        this.accountDeletedHeader = page.getByTestId('account-deleted');
        this.signupErrorMessage = page.getByText('Email Address already exist!');
        this.loginErrorMessage = page.getByText('Your email or password is incorrect!');

        // Login Form
        this.loginEmailInput = page.getByTestId('login-email');
        this.loginPasswordInput = page.getByTestId('login-password');
        this.loginButton = page.getByTestId('login-button');

        // Signup Form
        this.signupNameInput = page.getByTestId('signup-name');
        this.signupEmailInput = page.getByTestId('signup-email');
        this.signupButton = page.getByTestId('signup-button');

        // Form Registration Inputs
        this.genderTitleMr = page.getByLabel('Mr.');
        this.passwordInput = page.getByTestId('password');
        this.daysSelect = page.getByTestId('days');
        this.monthsSelect = page.getByTestId('months');
        this.yearsSelect = page.getByTestId('years');
        this.newsletterCheckbox = page.getByLabel('Sign up for our newsletter!');
        this.partnersCheckbox = page.getByLabel('Receive special offers from our partners!');
        this.firstNameInput = page.getByTestId('first_name');
        this.lastNameInput = page.getByTestId('last_name');
        this.companyInput = page.getByTestId('company');
        this.addressInput = page.getByTestId('address');
        this.address2Input = page.getByTestId('address2');
        this.countrySelect = page.getByTestId('country');
        this.stateInput = page.getByTestId('state');
        this.cityInput = page.getByTestId('city');
        this.zipcodeInput = page.getByTestId('zipcode');
        this.mobileNumberInput = page.getByTestId('mobile_number');
        this.createAccountButton = page.getByTestId('create-account');
    }

    // Navigation Methods
    async navigateToHome() {
        await this.page.goto('/', { waitUntil: 'domcontentloaded' });
    }

    async clickSignupLogin() {
        await this.signupLoginLink.click();
    }

    // Form Action Methods
    async fillSignupForm(name: string, email: string) {
        await this.signupNameInput.fill(name);
        await this.signupEmailInput.fill(email);
        await this.signupButton.click();
    }

    async fillAccountDetailsForm(details: AccountDetails) {
        await this.genderTitleMr.check();
        await this.passwordInput.fill(details.password || 'FallbackPass123!');
        await this.daysSelect.selectOption(details.day || '15');
        await this.monthsSelect.selectOption(details.month || '5');
        await this.yearsSelect.selectOption(details.year || '1995');
        await this.newsletterCheckbox.check();
        await this.partnersCheckbox.check();
        await this.firstNameInput.fill(details.firstName || 'John');
        await this.lastNameInput.fill(details.lastName || 'Doe');
        await this.companyInput.fill(details.company || 'QA Solutions');
        await this.addressInput.fill(details.address || '123 Automation St.');
        await this.address2Input.fill(details.address2 || 'Suite 100');
        await this.countrySelect.selectOption(details.country || 'United States');
        await this.stateInput.fill(details.state || 'California');
        await this.cityInput.fill(details.city || 'Los Angeles');
        await this.zipcodeInput.fill(details.zipcode || '90001');
        await this.mobileNumberInput.fill(details.mobileNumber || '1234567890');
        await this.createAccountButton.click();
    }

    async loginUser(email: string, password: string) {
        await this.loginEmailInput.fill(email);
        await this.loginPasswordInput.fill(password);
        await this.loginButton.click();
    }

    async clickContinue() {
        await this.continueButton.click();
    }

    async logout() {
        await this.logoutLink.click();
    }

    async deleteAccount() {
        await this.deleteAccountLink.click();
    }
}