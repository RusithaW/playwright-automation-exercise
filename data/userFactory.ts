import { faker } from '@faker-js/faker';
import userData from './userData.json';
import { AccountDetails } from '../pages/AuthPage';

/**
 * Interface representing a fully hydrated test user model.
 * Combines UI-driven AccountDetails with core credential fields.
 */
export interface TestUser extends AccountDetails {
    name: string;
    email: string;
    password: string;
}

/**
 * Generates a dynamic TestUser object populated with realistic mock data via Faker.js,
 * falling back to static default credentials from `userData.json` for deterministic fields.
 * 
 * @returns Fully populated TestUser instance for UI or API test execution.
 */
export function createDynamicUser(): TestUser {
    return {
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
        mobileNumber: faker.phone.number({ style: 'national' }),
    };
}

/**
 * Transforms TestUser (UI camelCase) into a form-urlencoded dictionary for API requests.
 * Uses explicit fallback strings to maintain absolute strict-type safety with Record<string, string>.
 * 
 * @param user - Strong-typed TestUser object.
 * @returns Key-value pair object matching backend form-data field names.
 */
export function toApiPayload(user: TestUser): Record<string, string> {
    return {
        name: user.name || '',
        email: user.email || '',
        password: user.password || '',
        title: 'Mr',
        birth_date: user.day || '15',
        birth_month: user.month || '05',
        birth_year: user.year || '1995',
        firstname: user.firstName || '',
        lastname: user.lastName || '',
        company: user.company || '',
        address1: user.address || '',
        address2: user.address2 || '',
        country: user.country || 'United States',
        state: user.state || '',
        city: user.city || '',
        zipcode: user.zipcode || '',
        mobile_number: user.mobileNumber || ''
    };
}