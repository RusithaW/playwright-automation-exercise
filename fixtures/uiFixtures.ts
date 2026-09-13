import { test as base, expect } from '@playwright/test';
import { AuthPage } from '../pages/AuthPage';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { ContactUsPage } from '../pages/ContactUsPage';
import { HomePage } from '../pages/HomePage';
import { NavbarComponent } from '../pages/components/NavbarComponent';
import { createDynamicUser, TestUser } from '../data/userFactory';

type UiFixtures = {
    authPage: AuthPage;
    productPage: ProductPage;
    cartPage: CartPage;
    checkoutPage: CheckoutPage;
    contactUsPage: ContactUsPage;
    homePage: HomePage;
    navbarComponent: NavbarComponent;
    /** A freshly generated, not-yet-registered user's data (name/email/password/address fields). */
    testUser: TestUser;

    /**
     * A user that has already completed full UI registration by the time the test body runs.
     * Use this instead of `testUser` when account creation is pure setup for the test
     * (e.g. "I need to be logged in to test X"), not the behavior under test itself.
     * Do NOT use this for tests where the signup/registration flow is what's actually
     * being verified (e.g. TC1, TC5, TC14, TC24) — those must keep driving signup manually
     * so the test still exercises and asserts on that flow.
     */
    registeredUser: TestUser;
};

export const test = base.extend<UiFixtures>({
    // Override built-in 'page' fixture to block ad-network requests for every test.
    // automationexercise.com serves live Google ads that can render on top of the
    // product grid and intercept clicks intended for "Add to cart" buttons.
    page: async ({ page }, use) => {
        await page.route('**/*', (route) => {
            const url = route.request().url();
            const blockedHosts = [
                'pagead2.googlesyndication.com',
                'googleads.g.doubleclick.net',
                'tpc.googlesyndication.com',
            ];
            if (blockedHosts.some(host => url.includes(host))) {
                return route.abort();
            }
            route.continue();
        });
        await use(page);
    },

    authPage: async ({ page }, use) => {
        await use(new AuthPage(page));
    },

    productPage: async ({ page }, use) => {
        await use(new ProductPage(page));
    },

    cartPage: async ({ page }, use) => {
        await use(new CartPage(page));
    },

    checkoutPage: async ({ page }, use) => {
        await use(new CheckoutPage(page));
    },

    contactUsPage: async ({ page }, use) => {
        await use(new ContactUsPage(page));
    },

    homePage: async ({ page }, use) => {
        await use(new HomePage(page));
    },

    navbarComponent: async ({ page }, use) => {
        await use(new NavbarComponent(page));
    },

    testUser: async ({ }, use) => {
        await use(createDynamicUser());
    },
    // Drives a full UI signup for `testUser` before the test body runs, then
    // deletes that account via the UI after the test finishes — regardless
    // of whether the test passed or failed. This exists purely to remove
    // duplicated setup/teardown boilerplate from tests where "be a logged-in,
    // registered user" is a precondition, not the thing being tested
    // (see TC15, TC16, TC20, TC23).
    //
    // This fixture is 100% UI-driven — it uses only existing page objects
    // (no API calls) — so it doesn't blur the project's intentional UI/API
    // test separation. It's equivalent to a human tester manually creating
    // a throwaway account before starting the "real" test steps.
    registeredUser: async ({ homePage, navbarComponent, authPage, checkoutPage, testUser }, use) => {
        // --- Setup: register the user through the real UI flow ---
        await homePage.navigateToHome();
        await expect(homePage.featuredItems).toBeVisible();
        await navbarComponent.clickSignupLogin();
        await authPage.fillSignupForm(testUser.name, testUser.email);
        await authPage.fillAccountDetailsForm(testUser);
        await checkoutPage.accountCreatedHeader.waitFor({ state: 'visible' });
        await checkoutPage.clickContinue();

        // --- Hand control to the test ---
        // Everything after `use()` runs only once the test body has finished
        // (pass or fail), making this the fixture's teardown phase.
        await use(testUser);

        // --- Teardown: delete the account through the UI ---
        // Wrapped in .catch() so that if the test itself already deleted the
        // account, or left the page in an unexpected state, cleanup failing
        // doesn't mask the test's real pass/fail result or crash the run.
        await navbarComponent.clickDeleteAccount().catch(() => { });
        await checkoutPage.clickContinue().catch(() => { });
    },
});

export { expect };