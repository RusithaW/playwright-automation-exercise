/// <reference types="node" />
import { test, expect } from '../baseTest';
import { AuthActions } from '../pages/actions/AuthActions';
import { ContactActions } from '../pages/actions/ContactActions';
import * as path from 'path';

test.describe('Contact Us Form Submissions', () => {
  let authActions: AuthActions;
  let contactActions: ContactActions;

  test.beforeEach(({ page }) => {
    authActions = new AuthActions(page);
    contactActions = new ContactActions(page);
  });

  test('Test Case 6: Contact Us Form Submission', async ({ page }) => {
    const uploadFilePath = path.join(__dirname, '../data/dummy_upload_file.txt');

    // Navigate to the application landing page and verify visibility
    await authActions.navigateToHome();
    await expect(authActions.authLocators.homeFeaturedItems).toBeVisible();

    // Navigate to the Contact Us view and verify the section header
    await contactActions.navigateToContactUs();
    await expect(contactActions.contactLocators.getInTouchHeader).toHaveText('Get In Touch');

    // Populate the contact form fields
    await contactActions.contactLocators.nameInput.fill('QA Engineer');
    await contactActions.contactLocators.emailInput.fill('test_engineer@example.com');
    await contactActions.contactLocators.subjectInput.fill('Automation Issue');
    await contactActions.contactLocators.messageInput.fill('This is an automated message testing the web contact forms.');

    // Attach the required document file
    await contactActions.contactLocators.uploadFileInput.setInputFiles(uploadFilePath);

    // Allow the form state to settle before submission
    await page.waitForTimeout(1000);

    // Concurrently trigger the form submission and accept the browser alert dialog
    await Promise.all([
      page.waitForEvent('dialog').then(async (dialog) => {
        await dialog.accept();
      }),
      contactActions.contactLocators.submitButton.click()
    ]);

    // Assert that the success banner appears and contains the correct text
    await expect(contactActions.contactLocators.successMessage).toBeVisible({ timeout: 15000 });
    await expect(contactActions.contactLocators.successMessage).toContainText('Success! Your details have been submitted successfully.');

    // Return to the home page and verify visibility of primary core elements
    await contactActions.clickHomeButton();
    await expect(authActions.authLocators.homeFeaturedItems).toBeVisible();
  });
});