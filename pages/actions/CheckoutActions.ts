import { Page } from '@playwright/test';
import { HomeLocators } from '../locators/HomeLocators';
import { CartLocators } from '../locators/CartLocators';
import { CheckoutLocators } from '../locators/CheckoutLocators';
import { AuthActions } from './AuthActions';

export class CheckoutActions {
    readonly page: Page;
    readonly homeLocators: HomeLocators;
    readonly cartLocators: CartLocators;
    readonly checkoutLocators: CheckoutLocators;
    readonly authActions: AuthActions;

    constructor(page: Page) {
        this.page = page;
        this.homeLocators = new HomeLocators(page);
        this.cartLocators = new CartLocators(page);
        this.checkoutLocators = new CheckoutLocators(page);
        this.authActions = new AuthActions(page);
    }

    async navigateToHome() {
        await this.authActions.navigateToHome();
    }

    async clickRegisterLoginFromCheckout() {
        await this.checkoutLocators.modalRegisterLoginButton.click();
    }

    async verifyAddressDetailsAndReviewOrder() {
        await this.checkoutLocators.addressDetailsHeader.waitFor({ state: 'visible' });
        await this.checkoutLocators.reviewYourOrderHeader.waitFor({ state: 'visible' });
    }

    async fillOrderCommentAndPlaceOrder(comment: string) {
        await this.checkoutLocators.orderCommentArea.fill(comment);
        await this.checkoutLocators.placeOrderButton.click();
    }

    async fillPaymentDetails(nameOnCard: string, cardNumber: string, cvc: string, expiryMonth: string, expiryYear: string) {
        await this.checkoutLocators.cardNameInput.fill(nameOnCard);
        await this.checkoutLocators.cardNumberInput.fill(cardNumber);
        await this.checkoutLocators.cardCVCInput.fill(cvc);
        await this.checkoutLocators.cardExpiryMonthInput.fill(expiryMonth);
        await this.checkoutLocators.cardExpiryYearInput.fill(expiryYear);
    }

    async submitPayment() {
        await this.checkoutLocators.submitPaymentButton.click();
    }

    async verifyOrderSuccess() {
        await this.checkoutLocators.orderSuccessAlert.waitFor({ state: 'visible' });
    }

    async clickContinue() {
        await this.checkoutLocators.continueButton.click();
    }

    async verifyDeliveryAndBillingAddress() {
        await this.checkoutLocators.deliveryAddressBox.waitFor({ state: 'visible' });
        await this.checkoutLocators.billingAddressBox.waitFor({ state: 'visible' });
    }

    async clickProceedToCheckout() {
        await this.checkoutLocators.proceedToCheckoutButton.click();
    }

    // Wait for cart modal to become visible
    async waitForCartModalVisible() {
        await this.checkoutLocators.cartModal.waitFor({ state: 'visible' });
    }

    // Wait for cart modal to be hidden
    async waitForCartModalHidden() {
        await this.checkoutLocators.cartModal.waitFor({ state: 'hidden' });
    }

    // Click the login link from checkout modal
    async clickLoginFromCheckoutModal() {
        await this.checkoutLocators.checkoutModal.locator('a[href="/login"]').click();
    }

    // Verify shopping cart breadcrumb is active
    async verifyShoppingCartBreadcrumbActive() {
        await this.checkoutLocators.shoppingCartBreadcrumb.waitFor({ state: 'visible' });
    }

    // Verify order placed successfully
    async verifyOrderPlaced() {
        await this.checkoutLocators.orderPlacedAlert.waitFor({ state: 'visible' });
    }

    // Download invoice
    async downloadInvoice() {
        const downloadPromise = this.page.waitForEvent('download');
        await this.checkoutLocators.downloadInvoiceLink.click();
        return downloadPromise;
    }
}