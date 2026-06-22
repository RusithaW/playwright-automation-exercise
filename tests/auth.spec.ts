/// <reference types="node" />
import { test, expect } from '../baseTest';
import { AuthActions } from '../pages/actions/AuthActions';

test.describe('User Authentication Tests', () => {

  test('Test Case 1: Register User successfully', async ({ page }) => {
    // 1. Initialize your Actions Layer
    const auth = new AuthActions(page);

    // Generate unique values so the test passes consistently
    const uniqueEmail = `tester_${Date.now()}@example.com`;
    const securePassword = process.env.TEST_PASSWORD || 'FallbackPass123!';

    // 2. Navigate straight to the authentication view
    await auth.navigateToSignupLogin();

    // 3. Verify 'New User Signup!' header text is visible
    const signupHeader = page.locator('.signup-form h2');
    await expect(signupHeader).toHaveText('New User Signup!');

    // 4. Enter name and email address and click 'Signup'
    await auth.fillSignupForm('QA Automation Tester', uniqueEmail);

    // 5. Verify that 'ENTER ACCOUNT INFORMATION' heading page is visible
    const accountInfoHeader = page.locator('.login-form h2').first();
    await expect(accountInfoHeader).toHaveText('Enter Account Information');

    // 6. Fill full form details and click 'Create Account'
    await auth.fillAccountDetailsForm(securePassword);

    // 7. Verify that 'ACCOUNT CREATED!' status header is visible
    const statusHeader = page.locator('[data-qa="account-created"]');
    await expect(statusHeader).toHaveText('Account Created!');

    // 8. Click the 'Continue' navigation button
    await page.locator('[data-qa="continue-button"]').click();

    // 9. Verify that 'Logged in as username' is visible at the top header navbar
    const loggedInText = page.locator('header .navbar-nav');
    await expect(loggedInText).toContainText('Logged in as QA Automation Tester');
  });

  test('Test Case 2: Login User successfully', async ({ page }) => {
    // 1. Initialize your Actions Layer
    const auth = new AuthActions(page);

    // 2. Navigate straight to the authentication view
    await auth.navigateToSignupLogin();

    // 3. Verify 'Login to your account' header text is visible
    const loginHeader = page.locator('.login-form h2');
    await expect(loginHeader).toHaveText('Login to your account');

    // 4. Enter email address and password and click 'Login'
    await auth.loginExistingUser(
      process.env.TEST_EMAIL || 'tester_22072026@example.com',
      process.env.TEST_USER_PASSWORD || '4LREwhu74@XuYVi!');

    // 5. Verify that 'Logged in as username' is visible at the top header navbar 
    const loggedInText = page.locator('header .navbar-nav');
    await expect(loggedInText).toContainText('QA Automation Tester');
  });
}); 