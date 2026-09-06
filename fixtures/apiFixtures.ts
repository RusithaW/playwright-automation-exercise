import { test as base, expect } from '@playwright/test';
import { createDynamicUser, TestUser } from '../data/userFactory';

type ApiFixtures = {
    testUser: TestUser;
};

export const apiTest = base.extend<ApiFixtures>({
    testUser: async ({ }, use) => {
        await use(createDynamicUser());
    },
});

export { expect };