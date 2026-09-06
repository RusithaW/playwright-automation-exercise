import { Page, Locator } from '@playwright/test';

/**
 * CheckoutPage Class
 * Page Object representing order summary, delivery verification, and payment processing pages.
 * Manages checkout modals, address validation, credit card submission, and invoice downloads.
 */
export class CheckoutPage {
    readonly page: Page;

    /** Locator for 'Address Details' step header */
    readonly addressDetailsHeader: Locator;

    /** Locator for 'Review Your Order' step header */
    readonly reviewYourOrderHeader: Locator;

    /** Locator for delivery address container */
    readonly deliveryAddressDetails: Locator;

    /** Locator for billing/invoice address container */
    readonly billingAddressDetails: Locator;

    /** Alternative locator for delivery address box */
    readonly deliveryAddressBox: Locator;

    /** Alternative locator for billing address box */
    readonly billingAddressBox: Locator;

    /** Textarea locator for custom order instructions or comments */
    readonly orderCommentArea: Locator;

    /** Locator for 'Place Order' navigation link */
    readonly placeOrderButton: Locator;

    /** Locator for cardholder name input field */
    readonly cardNameInput: Locator;

    /** Locator for credit card number input field */
    readonly cardNumberInput: Locator;

    /** Locator for card security CVC input field */
    readonly cardCVCInput: Locator;

    /** Locator for card expiration month input field */
    readonly cardExpiryMonthInput: Locator;

    /** Locator for card expiration year input field */
    readonly cardExpiryYearInput: Locator;

    /** Locator for payment submission button */
    readonly submitPaymentButton: Locator;

    /** Locator for order confirmation success alert message */
    readonly orderSuccessAlert: Locator;

    /** Locator for 'ORDER PLACED!' header banner */
    readonly orderPlacedAlert: Locator;

    /** Locator for checkout modal register/login link */
    readonly modalRegisterLoginButton: Locator;

    /** Locator for account created header banner */
    readonly accountCreatedHeader: Locator;

    /** Locator for account deleted header banner */
    readonly accountDeletedHeader: Locator;

    /** Locator for post-action continuation button */
    readonly continueButton: Locator;

    /** Locator for header navigation container inside checkout */
    readonly navbarContainer: Locator;

    /** Locator for checkout modal button trigger */
    readonly proceedToCheckoutButton: Locator;

    /** Locator for cart modal overlay */
    readonly cartModal: Locator;

    /** Locator for guest checkout modal overlay */
    readonly checkoutModal: Locator;

    /** Locator for active 'Shopping Cart' breadcrumb tag */
    readonly shoppingCartBreadcrumb: Locator;

    /** Locator for 'Download Invoice' action link */
    readonly downloadInvoiceLink: Locator;

    /**
     * Initializes checkout page locators.
     * 
     * @param page - Active Playwright Page instance.
     */
    constructor(page: Page) {
        this.page = page;

        // Address & Order Details
        this.addressDetailsHeader = page.locator('h2:has-text("Address Details")');
        this.reviewYourOrderHeader = page.locator('h2:has-text("Review Your Order")');
        this.deliveryAddressDetails = page.locator('#address_delivery');
        this.billingAddressDetails = page.locator('#address_invoice');
        this.deliveryAddressBox = page.locator('#address_delivery');
        this.billingAddressBox = page.locator('#address_invoice');
        this.orderCommentArea = page.locator('textarea[name="message"]');
        this.placeOrderButton = page.locator('a[href="/payment"]');

        // Payment Form
        this.cardNameInput = page.locator('input[name="name_on_card"]');
        this.cardNumberInput = page.locator('input[name="card_number"]');
        this.cardCVCInput = page.locator('input[name="cvc"]');
        this.cardExpiryMonthInput = page.locator('input[name="expiry_month"]');
        this.cardExpiryYearInput = page.locator('input[name="expiry_year"]');
        this.submitPaymentButton = page.locator('#submit');
        this.orderSuccessAlert = page.locator('p', { hasText: 'Congratulations! Your order has been confirmed!' });
        this.orderPlacedAlert = page.locator('[data-qa="order-placed"]');

        // Modals & Navigation Headers
        this.modalRegisterLoginButton = page.locator('.modal-body a[href="/login"]');
        this.accountCreatedHeader = page.locator('[data-qa="account-created"]');
        this.accountDeletedHeader = page.locator('[data-qa="account-deleted"]');
        this.continueButton = page.locator('[data-qa="continue-button"]');
        this.navbarContainer = page.locator('header .navbar-nav');
        this.proceedToCheckoutButton = page.locator('.check_out');
        this.cartModal = page.locator('#cartModal');
        this.checkoutModal = page.locator('#checkoutModal');
        this.shoppingCartBreadcrumb = page.locator('li', { hasText: 'Shopping Cart' });
        this.downloadInvoiceLink = page.locator('a:has-text("Download Invoice")');
    }

    /**
     * Navigates to authentication page from the guest checkout warning modal.
     */
    async clickRegisterLoginFromCheckout(): Promise<void> {
        await this.modalRegisterLoginButton.click();
    }

    /**
     * Asserts visibility of delivery address and order review step headers.
     */
    async verifyAddressDetailsAndReviewOrder(): Promise<void> {
        await this.addressDetailsHeader.waitFor({ state: 'visible' });
        await this.reviewYourOrderHeader.waitFor({ state: 'visible' });
    }

    /**
     * Enters custom order comment and proceeds to the payment view.
     * 
     * @param comment - Text note to attach to the order.
     */
    async fillOrderCommentAndPlaceOrder(comment: string): Promise<void> {
        await this.orderCommentArea.fill(comment);
        await this.placeOrderButton.click();
    }

    /**
     * Fills out credit card details in payment form fields.
     * 
     * @param nameOnCard - Name printed on card.
     * @param cardNumber - 16-digit card number.
     * @param cvc - Card verification code.
     * @param expiryMonth - Two-digit expiration month.
     * @param expiryYear - Four-digit expiration year.
     */
    async fillPaymentDetails(nameOnCard: string, cardNumber: string, cvc: string, expiryMonth: string, expiryYear: string): Promise<void> {
        await this.cardNameInput.fill(nameOnCard);
        await this.cardNumberInput.fill(cardNumber);
        await this.cardCVCInput.fill(cvc);
        await this.cardExpiryMonthInput.fill(expiryMonth);
        await this.cardExpiryYearInput.fill(expiryYear);
    }

    /**
     * Submits payment form for final verification.
     */
    async submitPayment(): Promise<void> {
        await this.submitPaymentButton.click();
    }

    /**
     * Waits for order success notification alert to become visible.
     */
    async verifyOrderSuccess(): Promise<void> {
        await this.orderSuccessAlert.waitFor({ state: 'visible' });
    }

    /**
     * Clicks post-order confirmation continue button.
     */
    async clickContinue(): Promise<void> {
        await this.continueButton.click();
    }

    /**
     * Verifies delivery and billing address display panels are visible.
     */
    async verifyDeliveryAndBillingAddress(): Promise<void> {
        await this.deliveryAddressBox.waitFor({ state: 'visible' });
        await this.billingAddressBox.waitFor({ state: 'visible' });
    }

    /**
     * Clicks proceed to checkout trigger button.
     */
    async clickProceedToCheckout(): Promise<void> {
        await this.proceedToCheckoutButton.click();
    }

    /**
     * Waits for cart modal overlay to show.
     */
    async waitForCartModalVisible(): Promise<void> {
        await this.cartModal.waitFor({ state: 'visible' });
    }

    /**
     * Waits for cart modal overlay to close.
     */
    async waitForCartModalHidden(): Promise<void> {
        await this.cartModal.waitFor({ state: 'hidden' });
    }

    /**
     * Clicks login link directly inside checkout guest modal.
     */
    async clickLoginFromCheckoutModal(): Promise<void> {
        await this.checkoutModal.locator('a[href="/login"]').click();
    }

    /**
     * Verifies active presence of shopping cart breadcrumb link.
     */
    async verifyShoppingCartBreadcrumbActive(): Promise<void> {
        await this.shoppingCartBreadcrumb.waitFor({ state: 'visible' });
    }

    /**
     * Asserts order placed success banner presence.
     */
    async verifyOrderPlaced(): Promise<void> {
        await this.orderPlacedAlert.waitFor({ state: 'visible' });
    }

    /**
     * Initiates invoice download event and captures returning promise payload.
     * 
     * @returns Promise resolving to Playwright Download event object.
     */
    async downloadInvoice() {
        const downloadPromise = this.page.waitForEvent('download');
        await this.downloadInvoiceLink.click();
        return downloadPromise;
    }
}