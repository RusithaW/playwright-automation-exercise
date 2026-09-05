/// <reference types="node" />
import { test, expect } from '../baseTest';
import userData from '../data/userData.json';
import { AccountDetails } from '../pages/AuthPage';

test.describe('AutomationExercise - UI Authentication Suite', () => {

  test('Test Case 1: Register User', async ({ authPage, testUser }) => {
    // 1-3. Launch browser, navigate to home & verify home page is visible
    await authPage.navigateToHome();
    await expect(authPage.homeFeaturedItems).toBeVisible();

    // 4-5. Click 'Signup / Login' and verify 'New User Signup!' header
    await authPage.clickSignupLogin();
    await expect(authPage.signupHeader).toBeVisible();

    // 6-7. Enter name and email address, click 'Signup' button
    await authPage.fillSignupForm(testUser.name, testUser.email);

    // 8. Verify 'ENTER ACCOUNT INFORMATION' header
    await expect(authPage.accountInfoHeader).toBeVisible();

    // 9-13. Fill form details & click 'Create Account' button
    await authPage.fillAccountDetailsForm(testUser);

    // 14-15. Verify 'ACCOUNT CREATED!' is visible and click 'Continue'
    await expect(authPage.accountCreatedHeader).toBeVisible();
    await authPage.clickContinue();

    // 16. Verify that 'Logged in as username' is visible
    await expect(authPage.loggedInAsUser).toContainText(testUser.name);

    // 17-18. Click 'Delete Account', verify 'ACCOUNT DELETED!' and click 'Continue'
    await authPage.deleteAccount();
    await expect(authPage.accountDeletedHeader).toBeVisible();
    await authPage.clickContinue();
  });

  test('Test Case 2: Login User with correct email and password', async ({ authPage, testUser }) => {
    // Pre-condition: Register user via UI to create account credentials
    await authPage.navigateToHome();
    await authPage.clickSignupLogin();
    await authPage.fillSignupForm(testUser.name, testUser.email);
    await authPage.fillAccountDetailsForm(testUser);
    await authPage.clickContinue();
    await authPage.logout();

    // 1-3. Launch browser, navigate to url & verify home page
    await authPage.navigateToHome();
    await expect(authPage.homeFeaturedItems).toBeVisible();

    // 4-5. Click 'Signup / Login' & verify 'Login to your account' is visible
    await authPage.clickSignupLogin();
    await expect(authPage.loginHeader).toBeVisible();

    // 6-7. Enter correct email address and password, click 'login' button
    await authPage.loginUser(testUser.email, testUser.password);

    // 8. Verify that 'Logged in as username' is visible
    await expect(authPage.loggedInAsUser).toContainText(testUser.name);

    // 9-10. Click 'Delete Account' button & verify 'ACCOUNT DELETED!' is visible
    await authPage.deleteAccount();
    await expect(authPage.accountDeletedHeader).toBeVisible();
  });

  test('Test Case 3: Login User with incorrect email and password', async ({ authPage }) => {
    // 1-3. Launch browser, navigate to url & verify home page
    await authPage.navigateToHome();
    await expect(authPage.homeFeaturedItems).toBeVisible();

    // 4-5. Click 'Signup / Login' & verify 'Login to your account' is visible
    await authPage.clickSignupLogin();
    await expect(authPage.loginHeader).toBeVisible();

    // 6-7. Enter incorrect email address and password, click 'login'
    await authPage.loginUser('invalid_user_999@notreal.com', 'WrongPassword123!');

    // 8. Verify error 'Your email or password is incorrect!' is visible
    await expect(authPage.loginErrorMessage).toBeVisible();
  });

  test('Test Case 4: Logout User', async ({ authPage, testUser }) => {
    // Pre-condition: Register user via UI
    await authPage.navigateToHome();
    await authPage.clickSignupLogin();
    await authPage.fillSignupForm(testUser.name, testUser.email);
    await authPage.fillAccountDetailsForm(testUser);
    await authPage.clickContinue();

    // 1-3. Launch browser, navigate to url & verify home page
    await authPage.navigateToHome();
    await expect(authPage.homeFeaturedItems).toBeVisible();

    // 4-8. Verify user is currently logged in
    await expect(authPage.loggedInAsUser).toContainText(testUser.name);

    // 9. Click 'Logout' button
    await authPage.logout();

    // 10. Verify that user is navigated to login page
    await expect(authPage.loginHeader).toBeVisible();
  });

  test('Test Case 5: Register User with existing email', async ({ authPage, testUser }) => {
    // Pre-condition: Create an initial user account
    await authPage.navigateToHome();
    await authPage.clickSignupLogin();
    await authPage.fillSignupForm(testUser.name, testUser.email);
    await authPage.fillAccountDetailsForm(testUser);
    await authPage.clickContinue();
    await authPage.logout();

    // 1-3. Launch browser, navigate to url & verify home page
    await authPage.navigateToHome();
    await expect(authPage.homeFeaturedItems).toBeVisible();

    // 4-5. Click 'Signup / Login' & verify 'New User Signup!' is visible
    await authPage.clickSignupLogin();
    await expect(authPage.signupHeader).toBeVisible();

    // 6-7. Enter name and already registered email address, click 'Signup'
    await authPage.fillSignupForm('Duplicate User', testUser.email);

    // 8. Verify error 'Email Address already exist!' is visible
    await expect(authPage.signupErrorMessage).toBeVisible();
  });

});