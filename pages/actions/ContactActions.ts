import { Page } from '@playwright/test';
import { ContactLocators } from '../locators/ContactLocators';

export class ContactActions {
    readonly page: Page;
    readonly contactLocators: ContactLocators;

    constructor(page: Page) {
        this.page = page;
        this.contactLocators = new ContactLocators(page);
    }

    // Navigates to the Contact Us page
    async navigateToContactUs() {
        await this.contactLocators.contactUsLink.click();
    }

    // Fills form inputs and uploads the specified attachment file
    async fillAndSubmitContactForm(name: string, email: string, subject: string, message: string, filePath: string) {
        await this.contactLocators.nameInput.fill(name);
        await this.contactLocators.emailInput.fill(email);
        await this.contactLocators.subjectInput.fill(subject);
        await this.contactLocators.messageInput.fill(message);
        await this.contactLocators.uploadFileInput.setInputFiles(filePath);
        await this.contactLocators.submitButton.click();
    }

    // Navigates back to the home page using the navigation bar link
    async clickHomeButton() {
        await this.contactLocators.homeButton.click();
    }
}