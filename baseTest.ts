import { test as base, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { AuthPage, AccountDetails } from './pages/AuthPage';
import userData from './data/userData.json';

export interface TestUser extends AccountDetails {
  name: string;
  email: string;
  password: string;
}

type MyFixtures = {
  authPage: AuthPage;
  testUser: TestUser;
};

export const test = base.extend<MyFixtures>({
  authPage: async ({ page }, use) => {
    await use(new AuthPage(page));
  },

  testUser: async ({ }, use) => {
    // Combines static defaults from userData.json with unique dynamic values per test
    const dynamicUser: TestUser = {
      name: faker.person.fullName(),
      email: faker.internet.email({ provider: 'qa.test' }),
      password: userData.defaultPassword,
      day: userData.defaultDay,
      month: userData.defaultMonth,
      year: userData.defaultYear,
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      company: faker.company.name(),
      address: faker.location.streetAddress(),
      address2: faker.location.secondaryAddress(),
      country: userData.defaultCountry,
      state: faker.location.state(),
      city: faker.location.city(),
      zipcode: faker.location.zipCode('#####'),
      mobileNumber: faker.phone.number({ style: 'national' })
    };
    await use(dynamicUser);
  }
});

export { expect };