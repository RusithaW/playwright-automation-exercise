import { Page, Locator } from '@playwright/test';

export class AuthLocators {
    readonly page: Page;

    // Header Links & Top Navigation Items
    readonly signupLoginLink: Locator;
    readonly logoutLink: Locator;
    readonly deleteAccountLink: Locator;
    readonly homeFeaturedItems: Locator;

    // Login Form Elements
    readonly loginEmailInput: Locator;
    readonly loginPasswordInput: Locator;
    readonly loginButton: Locator;

    // Signup Form Locators
    readonly signupNameInput: Locator;
    readonly signupEmailInput: Locator;
    readonly signupButton: Locator;

    // Account Information Form Locators
    readonly genderTitleMr: Locator;
    readonly passwordInput: Locator;
    readonly daysSelect: Locator;
    readonly monthsSelect: Locator;
    readonly yearsSelect: Locator;
    readonly newsletterCheckbox: Locator;
    readonly partnersCheckbox: Locator;

    // Address Information Locators
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

    // Create Account Button
    readonly createAccountButton: Locator;

    constructor(page: Page) {
        this.page = page;

        // Navigation & Feature Items Layout Check
        this.homeFeaturedItems = page.locator('.features_items');
        this.signupLoginLink = page.locator('text=Signup / Login');
        this.logoutLink = page.locator('text=Logout');
        this.deleteAccountLink = page.locator('text=Delete Account');

        // Login Form Locators
        this.loginEmailInput = page.locator('input[data-qa="login-email"]');
        this.loginPasswordInput = page.locator('input[data-qa="login-password"]');
        this.loginButton = page.locator('button[data-qa="login-button"]');

        // Signup Form Locators
        this.signupNameInput = page.locator('input[data-qa="signup-name"]');
        this.signupEmailInput = page.locator('input[data-qa="signup-email"]');
        this.signupButton = page.locator('button[data-qa="signup-button"]');

        // Account Information Form Locators (Updated to precise data-qa or unique IDs)
        this.genderTitleMr = page.locator('#id_gender1');
        this.passwordInput = page.locator('[data-qa="password"]');
        this.daysSelect = page.locator('[data-qa="days"]');
        this.monthsSelect = page.locator('[data-qa="months"]');
        this.yearsSelect = page.locator('[data-qa="years"]');
        this.newsletterCheckbox = page.locator('#newsletter');
        this.partnersCheckbox = page.locator('#optin');

        // Address Information Locators
        this.firstNameInput = page.locator('[data-qa="first_name"]');
        this.lastNameInput = page.locator('[data-qa="last_name"]');
        this.companyInput = page.locator('[data-qa="company"]');
        this.addressInput = page.locator('[data-qa="address"]');
        this.address2Input = page.locator('[data-qa="address2"]');
        this.countrySelect = page.locator('[data-qa="country"]');
        this.stateInput = page.locator('[data-qa="state"]');
        this.cityInput = page.locator('[data-qa="city"]');
        this.zipcodeInput = page.locator('[data-qa="zipcode"]');
        this.mobileNumberInput = page.locator('[data-qa="mobile_number"]');

        // Create Account Button
        this.createAccountButton = page.locator('button[data-qa="create-account"]');
    }
}