import { Page, Locator } from '@playwright/test';

/**
 * Interface representing account registration details for form submission.
 */
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

/**
 * AuthPage Class
 * Page Object representing the Signup, Login, and Account Registration pages.
 * Encapsulates authentication forms, registration fields, and status headers.
 */
export class AuthPage {
    private readonly page: Page;

    /** Locator for the 'New User Signup!' header */
    readonly signupHeader: Locator;

    /** Locator for the 'Login to your account' header */
    readonly loginHeader: Locator;

    /** Locator for the 'Enter Account Information' registration header */
    readonly accountInfoHeader: Locator;

    /** Locator for the 'ACCOUNT CREATED!' success banner */
    readonly accountCreatedHeader: Locator;

    /** Locator for the 'ACCOUNT DELETED!' success banner */
    readonly accountDeletedHeader: Locator;

    /** Locator for duplicate email registration error alert */
    readonly signupErrorMessage: Locator;

    /** Locator for invalid credentials login error alert */
    readonly loginErrorMessage: Locator;

    /** Locator for the login email input field */
    readonly loginEmailInput: Locator;

    /** Locator for the login password input field */
    readonly loginPasswordInput: Locator;

    /** Locator for the login submission button */
    readonly loginButton: Locator;

    /** Locator for the initial signup name input field */
    readonly signupNameInput: Locator;

    /** Locator for the initial signup email input field */
    readonly signupEmailInput: Locator;

    /** Locator for the initial signup submission button */
    readonly signupButton: Locator;

    /** Radio button locator for Title 'Mr' selection */
    readonly genderTitleMr: Locator;

    /** Locator for the registration password field */
    readonly passwordInput: Locator;

    /** Dropdown locator for birth day selection */
    readonly daysSelect: Locator;

    /** Dropdown locator for birth month selection */
    readonly monthsSelect: Locator;

    /** Dropdown locator for birth year selection */
    readonly yearsSelect: Locator;

    /** Checkbox locator for newsletter subscription */
    readonly newsletterCheckbox: Locator;

    /** Checkbox locator for special offers from partners */
    readonly partnersCheckbox: Locator;

    /** Locator for the first name input field */
    readonly firstNameInput: Locator;

    /** Locator for the last name input field */
    readonly lastNameInput: Locator;

    /** Locator for the company name input field */
    readonly companyInput: Locator;

    /** Locator for primary street address input field */
    readonly addressInput: Locator;

    /** Locator for secondary address input field */
    readonly address2Input: Locator;

    /** Dropdown locator for country selection */
    readonly countrySelect: Locator;

    /** Locator for state input field */
    readonly stateInput: Locator;

    /** Locator for city input field */
    readonly cityInput: Locator;

    /** Locator for zipcode/postal code input field */
    readonly zipcodeInput: Locator;

    /** Locator for mobile phone number input field */
    readonly mobileNumberInput: Locator;

    /** Locator for 'Create Account' submission button */
    readonly createAccountButton: Locator;

    /** Locator for post-action 'Continue' button */
    readonly continueButton: Locator;

    /**
     * Initializes locators for authentication and registration forms.
     * 
     * @param page - Active Playwright Page instance.
     */
    constructor(page: Page) {
        this.page = page;

        // Headers & Alerts
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

        // Registration Form Inputs
        this.genderTitleMr = page.locator('#id_gender1');
        this.passwordInput = page.getByTestId('password');
        this.daysSelect = page.getByTestId('days');
        this.monthsSelect = page.getByTestId('months');
        this.yearsSelect = page.getByTestId('years');
        this.newsletterCheckbox = page.locator('#newsletter');
        this.partnersCheckbox = page.locator('#optin');
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
        this.continueButton = page.getByTestId('continue-button');
    }

    /**
     * Directs browser navigation to the '/login' route.
     * 
     * @returns Promise resolving when DOM loading completes.
     */
    async goto(): Promise<void> {
        await this.page.goto('/login', { waitUntil: 'domcontentloaded' });
    }

    /**
     * Fills out the initial signup form and initiates registration.
     * 
     * @param name - Display name for the new user account.
     * @param email - Target email address for registration.
     * @returns Promise resolving when submission button is clicked.
     */
    async fillSignupForm(name: string, email: string): Promise<void> {
        await this.signupNameInput.fill(name);
        await this.signupEmailInput.fill(email);
        await this.signupButton.click();
    }

    /**
     * Fills out detailed user account registration parameters and submits the creation request.
     * 
     * @param details - AccountDetails structure holding user information.
     * @returns Promise resolving when account creation completes.
     */
    async fillAccountDetailsForm(details: AccountDetails): Promise<void> {
        await this.genderTitleMr.check();
        if (details.password) await this.passwordInput.fill(details.password);
        if (details.day) await this.daysSelect.selectOption(details.day);
        if (details.month) await this.monthsSelect.selectOption(details.month);
        if (details.year) await this.yearsSelect.selectOption(details.year);

        await this.newsletterCheckbox.check();
        await this.partnersCheckbox.check();

        if (details.firstName) await this.firstNameInput.fill(details.firstName);
        if (details.lastName) await this.lastNameInput.fill(details.lastName);
        if (details.company) await this.companyInput.fill(details.company);
        if (details.address) await this.addressInput.fill(details.address);
        if (details.address2) await this.address2Input.fill(details.address2);
        if (details.country) await this.countrySelect.selectOption({ label: details.country });
        if (details.state) await this.stateInput.fill(details.state);
        if (details.city) await this.cityInput.fill(details.city);
        if (details.zipcode) await this.zipcodeInput.fill(details.zipcode);
        if (details.mobileNumber) await this.mobileNumberInput.fill(details.mobileNumber);

        await this.createAccountButton.click();
    }

    /**
     * Fills out the login credentials and submits the login form.
     * 
     * @param email - Registered account email.
     * @param password - Account password.
     * @returns Promise resolving on submission click.
     */
    async loginUser(email: string, password: string): Promise<void> {
        await this.loginEmailInput.fill(email);
        await this.loginPasswordInput.fill(password);
        await this.loginButton.click();
    }

    /**
     * Clicks the post-registration or post-deletion 'Continue' button.
     * 
     * @returns Promise resolving on click completion.
     */
    async clickContinue(): Promise<void> {
        await this.continueButton.click();
    }
}