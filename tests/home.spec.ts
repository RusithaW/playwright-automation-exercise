/// <reference types="node" />
import { test, expect } from '../baseTest';
import { AuthActions } from '../pages/actions/AuthActions';
import { HomeActions } from '../pages/actions/HomeActions';
import * as path from 'path';

test.describe('Home Page Navigation and Test Cases', () => {
    let auth: AuthActions;
    let home: HomeActions;

    test.beforeEach(({ page }) => {
        auth = new AuthActions(page);
        home = new HomeActions(page);
    });

    test('Test Case 7: Navigate to Test Cases Page', async ({ page }) => {
        // Navigate to the application landing page and verify visibility
        await auth.navigateToHome();
        await expect(auth.authLocators.homeFeaturedItems).toBeVisible();

        // Navigate to the Test Cases view and verify the section header
        await home.navigateToTestCases();
        await expect(home.homeLocators.testCasesHeader).toHaveText('Test Cases');
    });
});