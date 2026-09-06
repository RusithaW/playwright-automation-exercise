/// <reference types="node" />
import { test, expect } from '../../fixtures/uiFixtures';
import * as path from 'path';

test.describe('Contact Us Form Submissions', () => {

  test('Test Case 6: Contact Us Form Submission', async ({ page, homePage, navbarComponent, contactUsPage }) => {
    const uploadFilePath = path.join(__dirname, '../../data/dummy_upload_file.txt');

    // 1. Navigate to landing page and verify visibility
    await homePage.navigateToHome();
    await expect(homePage.featuredItems).toBeVisible();

    // 2. Navigate to Contact Us view and verify header
    await navbarComponent.clickContactUs();
    await expect(contactUsPage.getInTouchHeader).toHaveText('Get In Touch');

    // 3. Fill form, attach file, submit form, and accept the alert dialog
    await page.waitForTimeout(1000);
    await contactUsPage.fillAndSubmitContactForm(
      'QA Engineer',
      'test_engineer@example.com',
      'Automation Issue',
      'This is an automated message testing the web contact forms.',
      uploadFilePath
    );

    // 4. Assert success message
    await expect(contactUsPage.successMessage).toBeVisible({ timeout: 15000 });
    await expect(contactUsPage.successMessage).toContainText('Success! Your details have been submitted successfully.');

    // 5. Return to home page and verify visibility
    await contactUsPage.clickHomeButton();
    await expect(homePage.featuredItems).toBeVisible();
  });
});