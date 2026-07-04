import { Page } from '@playwright/test';
import { HomeLocators } from '../locators/HomeLocators';

export class HomeActions {
    readonly page: Page;
    readonly homeLocators: HomeLocators;

    constructor(page: Page) {
        this.page = page;
        this.homeLocators = new HomeLocators(page);
    }

    // Navigates to the Test Cases page
    async navigateToTestCases() {
        await this.homeLocators.testCasesLink.click();
    }

    //Scroll down to the footer widget container block
    async scrollToFooter() {
        await this.homeLocators.subscriptionText.scrollIntoViewIfNeeded();
    }

    // Fills the subscription form with the provided email and submits it
    async subscribe(email: string) {
        await this.homeLocators.subscriptionInput.fill(email);
        await this.homeLocators.subscriptionButton.click();
    }

    // Waits for the subscription success alert to be visible
    async waitForSubscriptionSuccessAlert() {
        await this.homeLocators.subscriptionSuccessAlert.waitFor({ state: 'visible' });
    }
}