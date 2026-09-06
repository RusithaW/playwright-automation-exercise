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
    testUser: TestUser;
};

export const test = base.extend<UiFixtures>({
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
});

export { expect };