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
}