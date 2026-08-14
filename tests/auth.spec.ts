/// <reference types="node" />
import { test, expect } from '../baseTest';
import { AuthActions } from '../pages/actions/AuthActions';

test.describe('User Authentication Tests', () => {

  let authActions: AuthActions;

  // Use Credentials from your environment variables
  const staticEmail = process.env.TEST_EMAIL || 'tester_22072026@example.com';
  const commonPassword = process.env.TEST_PASSWORD || 'FallbackPass123!';

  test.beforeEach(({ page }) => {
    authActions = new AuthActions(page);
  });

  test('Test Case 1: Register User', async () => {
    const uniqueEmail = `tester_${Date.now()}@example.com`;

    // 1-3. Launch, navigate to url, and verify that home page is visible successfully
    await authActions.navigateToHome();
    await expect(authActions.authLocators.homeFeaturedItems).toBeVisible();

    // 4-5. Click on 'Signup / Login' button and verify 'New User Signup!' is visible
    await authActions.navigateToSignupLogin();
    await expect(authActions.getSignupHeader()).toHaveText('New User Signup!');

    // 6-8. Enter name and email address, click 'Signup', and verify 'ENTER ACCOUNT INFORMATION' is visible
    await authActions.fillSignupForm('QA Automation Tester', uniqueEmail);
    await expect(authActions.getAccountInfoHeader()).toHaveText('Enter Account Information');

    // 9-13. Fill details, select checkboxes, fill address fields, and click 'Create Account'
    await authActions.fillAccountDetailsForm(commonPassword);

    // 14. Verify that 'ACCOUNT CREATED!' is visible
    await expect(authActions.getAccountCreatedHeader()).toHaveText('Account Created!');

    // 15-16. Click 'Continue' button and verify that 'Logged in as username' is visible
    await authActions.clickContinueButton();
    await expect(authActions.getNavbarContainer()).toContainText('Logged in as QA Automation Tester');

    // 17-18. Click 'Delete Account' button, verify 'ACCOUNT DELETED!', and click 'Continue' button
    await authActions.deleteAccount();
    await expect(authActions.getAccountDeletedHeader()).toHaveText('Account Deleted!');
    await authActions.clickContinueButton();
  });

  test('Test Case 2: Login User with correct email and password', async () => {
    const tc2DynamicEmail = `tc2_tester_${Date.now()}@example.com`;

    // Background user creation so Test Case 2 has an active user account to log into and delete
    await authActions.navigateToHome();
    await authActions.navigateToSignupLogin();
    await authActions.fillSignupForm('QA Automation Tester', tc2DynamicEmail);
    await authActions.fillAccountDetailsForm(commonPassword);
    await authActions.clickContinueButton();
    await authActions.logout();

    // 1-3. Launch, navigate to url, and verify that home page is visible successfully
    await authActions.navigateToHome();
    await expect(authActions.authLocators.homeFeaturedItems).toBeVisible();

    // 4-5. Click on 'Signup / Login' button and verify 'Login to your account' is visible
    await authActions.navigateToSignupLogin();
    await expect(authActions.getLoginHeader()).toHaveText('Login to your account');

    // 6-7. Enter correct email address and password and click 'login' button
    await authActions.loginExistingUser(tc2DynamicEmail, commonPassword);

    // 8. Verify that 'Logged in as username' is visible
    await expect(authActions.getNavbarContainer()).toContainText('Logged in as QA Automation Tester');

    // 9-10. Click 'Delete Account' button and verify that 'ACCOUNT DELETED!' is visible
    await authActions.deleteAccount();
    await expect(authActions.getAccountDeletedHeader()).toHaveText('Account Deleted!');
  });

  test('Test Case 3: Login User with incorrect email and password', async () => {
    // 1-3. Launch, navigate to url, and verify that home page is visible successfully
    await authActions.navigateToHome();
    await expect(authActions.authLocators.homeFeaturedItems).toBeVisible();

    // 4-5. Click on 'Signup / Login' button and verify 'Login to your account' is visible
    await authActions.navigateToSignupLogin();
    await expect(authActions.getLoginHeader()).toHaveText('Login to your account');

    // 6-7. Enter incorrect email address and password and click 'login' button
    await authActions.loginExistingUser(`wrong_${Date.now()}@invalid.com`, 'IncorrectPass123!');

    // 8. Verify error 'Your email or password is incorrect!' is visible
    await expect(authActions.getLoginErrorMessage()).toHaveText('Your email or password is incorrect!');
  });

  test('Test Case 4: Logout User', async ({ page }) => {
    const tc4DynamicEmail = `tc4_tester_${Date.now()}@example.com`;

    // Dynamic background user creation so Test Case 4 has a guaranteed active user account
    await authActions.navigateToHome();
    await authActions.navigateToSignupLogin();
    await authActions.fillSignupForm('QA Automation Tester', tc4DynamicEmail);
    await authActions.fillAccountDetailsForm(commonPassword);
    await authActions.clickContinueButton();
    await authActions.logout();

    // 1-3. Launch, navigate to url, and verify that home page is visible successfully
    await authActions.navigateToHome();
    await expect(authActions.authLocators.homeFeaturedItems).toBeVisible();

    // 4-5. Click on 'Signup / Login' button and verify 'Login to your account' is visible
    await authActions.navigateToSignupLogin();
    await expect(authActions.getLoginHeader()).toHaveText('Login to your account');

    // 6-7. Enter correct email address and password and click 'login' button
    await authActions.loginExistingUser(tc4DynamicEmail, commonPassword);

    // 8. Verify that 'Logged in as username' is visible
    await expect(authActions.getNavbarContainer()).toContainText('Logged in as QA Automation Tester');

    // 9-10. Click 'Logout' button and verify that user is navigated to login page
    await authActions.logout();
    await expect(page).toHaveURL(/.*login/);
  });

  test('Test Case 5: Register User with existing email', async () => {
    // 1-3. Launch, navigate to url, and verify that home page is visible successfully
    await authActions.navigateToHome();
    await expect(authActions.authLocators.homeFeaturedItems).toBeVisible();

    // 4-5. Click on 'Signup / Login' button and verify 'New User Signup!' is visible
    await authActions.navigateToSignupLogin();
    await expect(authActions.getSignupHeader()).toHaveText('New User Signup!');

    // 6-7. Enter name and already registered email address and click 'Signup' button
    await authActions.fillSignupForm('QA Automation Tester', staticEmail);

    // 8. Verify error 'Email Address already exist!' is visible
    await expect(authActions.getSignupErrorMessage()).toHaveText('Email Address already exist!');
  });
});