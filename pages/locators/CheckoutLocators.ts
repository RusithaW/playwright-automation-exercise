import { Page, Locator } from '@playwright/test';

export class CheckoutLocators {
    readonly page: Page;

    readonly addressDetailsHeader: Locator;
    readonly reviewYourOrderHeader: Locator;
    readonly deliveryAddressDetails: Locator;
    readonly billingAddressDetails: Locator;
    readonly orderCommentArea: Locator;
    readonly placeOrderButton: Locator;

    readonly cardNameInput: Locator;
    readonly cardNumberInput: Locator;
    readonly cardCVCInput: Locator;
    readonly cardExpiryMonthInput: Locator;
    readonly cardExpiryYearInput: Locator;
    readonly submitPaymentButton: Locator;
    readonly orderSuccessAlert: Locator;

    // Post-Auth Modal & State Locators
    readonly modalRegisterLoginButton: Locator;
    readonly accountCreatedHeader: Locator;
    readonly accountDeletedHeader: Locator;
    readonly continueButton: Locator;
    readonly navbarContainer: Locator;

    constructor(page: Page) {
        this.page = page;

        this.addressDetailsHeader = page.locator('h2:has-text("Address Details")');
        this.reviewYourOrderHeader = page.locator('h2:has-text("Review Your Order")');
        this.deliveryAddressDetails = page.locator('#address_delivery');
        this.billingAddressDetails = page.locator('#address_invoice');
        this.orderCommentArea = page.locator('textarea[name="message"]');
        this.placeOrderButton = page.locator('a[href="/payment"]');

        this.cardNameInput = page.locator('input[name="name_on_card"]');
        this.cardNumberInput = page.locator('input[name="card_number"]');
        this.cardCVCInput = page.locator('input[name="cvc"]');
        this.cardExpiryMonthInput = page.locator('input[name="expiry_month"]');
        this.cardExpiryYearInput = page.locator('input[name="expiry_year"]');
        this.submitPaymentButton = page.locator('#submit');
        this.orderSuccessAlert = page.locator('p', { hasText: 'Congratulations! Your order has been confirmed!' });

        // Fixed/Added Element Hooks
        this.modalRegisterLoginButton = page.locator('.modal-body a[href="/login"]');
        this.accountCreatedHeader = page.locator('[data-qa="account-created"]');
        this.accountDeletedHeader = page.locator('[data-qa="account-deleted"]');
        this.continueButton = page.locator('[data-qa="continue-button"]');
        this.navbarContainer = page.locator('header .navbar-nav');
    }
}