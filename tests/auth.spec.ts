/// <reference types="node" />
import { test, expect } from '../baseTest';
import { AuthActions } from '../pages/actions/AuthActions';

test.describe('User Authentication Tests', () => {

  let auth: AuthActions;

  // Use Credentials from your environment variables
  const staticEmail = process.env.TEST_EMAIL || 'tester_22072026@example.com';
  const staticPassword = process.env.TEST_USER_PASSWORD || '4LREwhu74@XuYVi!!';
  const commonPassword = process.env.TEST_PASSWORD || 'FallbackPass123!';

  test.beforeEach(({ page }) => {
    auth = new AuthActions(page);
  });

  test('Test Case 1: Register User', async ({ page }) => {
    const uniqueEmail = `tester_${Date.now()}@example.com`;

    // 1-3. Launch, navigate to url, and verify that home page is visible successfully
    await auth.navigateToHome();
    await expect(auth.authLocators.homeFeaturedItems).toBeVisible();

    // 4-5. Click on 'Signup / Login' button and verify 'New User Signup!' is visible
    await auth.navigateToSignupLogin();
    const signupHeader = page.locator('.signup-form h2');
    await expect(signupHeader).toHaveText('New User Signup!');

    // 6-8. Enter name and email address, click 'Signup', and verify 'ENTER ACCOUNT INFORMATION' is visible
    await auth.fillSignupForm('QA Automation Tester', uniqueEmail);
    const accountInfoHeader = page.locator('.login-form h2').first();
    await expect(accountInfoHeader).toHaveText('Enter Account Information');

    // 9-13. Fill details, select checkboxes, fill address fields, and click 'Create Account'
    await auth.fillAccountDetailsForm(commonPassword);

    // 14. Verify that 'ACCOUNT CREATED!' is visible
    const statusHeader = page.locator('[data-qa="account-created"]');
    await expect(statusHeader).toHaveText('Account Created!');

    // 15-16. Click 'Continue' button and verify that 'Logged in as username' is visible
    await page.locator('[data-qa="continue-button"]').click();
    const loggedInText = page.locator('header .navbar-nav');
    await expect(loggedInText).toContainText('Logged in as QA Automation Tester');

    // 17-18. Click 'Delete Account' button, verify 'ACCOUNT DELETED!', and click 'Continue' button
    await auth.deleteAccount();
    const deletedHeader = page.locator('[data-qa="account-deleted"]');
    await expect(deletedHeader).toHaveText('Account Deleted!');
    await page.locator('[data-qa="continue-button"]').click();
  });

  test('Test Case 2: Login User with correct email and password', async ({ page }) => {
    const tc2DynamicEmail = `tc2_tester_${Date.now()}@example.com`;

    // Background user creation so Test Case 2 has an active user account to log into and delete
    await auth.navigateToHome();
    await auth.navigateToSignupLogin();
    await auth.fillSignupForm('QA Automation Tester', tc2DynamicEmail);
    await auth.fillAccountDetailsForm(commonPassword);
    await page.locator('[data-qa="continue-button"]').click();
    await auth.logout();

    // 1-3. Launch, navigate to url, and verify that home page is visible successfully
    await auth.navigateToHome();
    await expect(auth.authLocators.homeFeaturedItems).toBeVisible();

    // 4-5. Click on 'Signup / Login' button and verify 'Login to your account' is visible
    await auth.navigateToSignupLogin();
    const loginHeader = page.locator('.login-form h2');
    await expect(loginHeader).toHaveText('Login to your account');

    // 6-7. Enter correct email address and password and click 'login' button
    await auth.loginExistingUser(tc2DynamicEmail, commonPassword);

    // 8. Verify that 'Logged in as username' is visible
    const loggedInText = page.locator('header .navbar-nav');
    await expect(loggedInText).toContainText('Logged in as QA Automation Tester');

    // 9-10. Click 'Delete Account' button and verify that 'ACCOUNT DELETED!' is visible
    await auth.deleteAccount();
    const deletedHeader = page.locator('[data-qa="account-deleted"]');
    await expect(deletedHeader).toHaveText('Account Deleted!');
  });

  test('Test Case 3: Login User with incorrect email and password', async ({ page }) => {
    // 1-3. Launch, navigate to url, and verify that home page is visible successfully
    await auth.navigateToHome();
    await expect(auth.authLocators.homeFeaturedItems).toBeVisible();

    // 4-5. Click on 'Signup / Login' button and verify 'Login to your account' is visible
    await auth.navigateToSignupLogin();
    const loginHeader = page.locator('.login-form h2');
    await expect(loginHeader).toHaveText('Login to your account');

    // 6-7. Enter incorrect email address and password and click 'login' button
    await auth.loginExistingUser(`wrong_${Date.now()}@invalid.com`, 'IncorrectPass123!');

    // 8. Verify error 'Your email or password is incorrect!' is visible
    const errorMessage = page.locator('.login-form form p');
    await expect(errorMessage).toHaveText('Your email or password is incorrect!');
  });

  test('Test Case 4: Logout User', async ({ page }) => {
    // 1-3. Launch, navigate to url, and verify that home page is visible successfully
    await auth.navigateToHome();
    await expect(auth.authLocators.homeFeaturedItems).toBeVisible();

    // 4-5. Click on 'Signup / Login' button and verify 'Login to your account' is visible
    await auth.navigateToSignupLogin();
    const loginHeader = page.locator('.login-form h2');
    await expect(loginHeader).toHaveText('Login to your account');

    // 6-7. Enter correct email address and password and click 'login' button
    await auth.loginExistingUser(staticEmail, staticPassword);

    // 8. Verify that 'Logged in as username' is visible
    const loggedInText = page.locator('header .navbar-nav');
    await expect(loggedInText).toContainText('Logged in as');

    // 9-10. Click 'Logout' button and verify that user is navigated to login page
    await auth.logout();
    await expect(page).toHaveURL(/.*login/);
  });

  test('Test Case 5: Register User with existing email', async ({ page }) => {
    // 1-3. Launch, navigate to url, and verify that home page is visible successfully
    await auth.navigateToHome();
    await expect(auth.authLocators.homeFeaturedItems).toBeVisible();

    // 4-5. Click on 'Signup / Login' button and verify 'New User Signup!' is visible
    await auth.navigateToSignupLogin();
    const signupHeader = page.locator('.signup-form h2');
    await expect(signupHeader).toHaveText('New User Signup!');

    // 6-7. Enter name and already registered email address and click 'Signup' button
    await auth.fillSignupForm('QA Automation Tester', staticEmail);

    // 8. Verify error 'Email Address already exist!' is visible
    const signupError = page.locator('.signup-form form p');
    await expect(signupError).toHaveText('Email Address already exist!');
  });
});