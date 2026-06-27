/// <reference types="node" />
import { test, expect } from '../baseTest';
import { AuthActions } from '../pages/actions/AuthActions';
import { ContactActions } from '../pages/actions/ContactActions';
import * as path from 'path';

test.describe('Contact Us Form Submissions', () => {
  let auth: AuthActions;
  let contact: ContactActions;

  test.beforeEach(({ page }) => {
    auth = new AuthActions(page);
    contact = new ContactActions(page);
  });

  test('Test Case 6: Contact Us Form Submission', async ({ page }) => {
    const uploadFilePath = path.join(__dirname, '../data/dummy_upload_file.txt');

    // Navigate to the application landing page and verify visibility
    await auth.navigateToHome();
    await expect(auth.authLocators.homeFeaturedItems).toBeVisible();

    // Navigate to the Contact Us view and verify the section header
    await contact.navigateToContactUs();
    await expect(contact.contactLocators.getInTouchHeader).toHaveText('Get In Touch');

    // Populate the contact form fields
    await contact.contactLocators.nameInput.fill('QA Engineer');
    await contact.contactLocators.emailInput.fill('test_engineer@example.com');
    await contact.contactLocators.subjectInput.fill('Automation Issue');
    await contact.contactLocators.messageInput.fill('This is an automated message testing the web contact forms.');

    // Attach the required document file
    await contact.contactLocators.uploadFileInput.setInputFiles(uploadFilePath);

    // Allow the form state to settle before submission
    await page.waitForTimeout(1000);

    // Concurrently trigger the form submission and accept the browser alert dialog
    await Promise.all([
      page.waitForEvent('dialog').then(async (dialog) => {
        await dialog.accept();
      }),
      contact.contactLocators.submitButton.click()
    ]);

    // Assert that the success banner appears and contains the correct text
    await expect(contact.contactLocators.successMessage).toBeVisible({ timeout: 15000 });
    await expect(contact.contactLocators.successMessage).toContainText('Success! Your details have been submitted successfully.');

    // Return to the home page and verify visibility of primary core elements
    await contact.clickHomeButton();
    await expect(auth.authLocators.homeFeaturedItems).toBeVisible();
  });
});