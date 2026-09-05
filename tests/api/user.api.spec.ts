import { test, expect } from '@playwright/test';
import { UserService } from '../../pages/api/services/UserService';

test.describe.serial('User Account API Lifecycle Suite (API 11, 12, 13, 14)', () => {
    let userService: UserService;

    // Generate unique user details per test execution
    const testUser = {
        name: 'John Lifecycle',
        email: `lifecycle_user_${Date.now()}@example.com`,
        password: 'Password123',
        title: 'Mr',
        birth_date: '15',
        birth_month: '08',
        birth_year: '1990',
        firstname: 'John',
        lastname: 'Doe',
        company: 'QA Corp',
        address1: '100 Automation Ave',
        address2: 'Suite 200',
        country: 'United States',
        zipcode: '90001',
        state: 'California',
        city: 'Los Angeles',
        mobile_number: '9876543210'
    };

    test.beforeEach(async ({ request }) => {
        userService = new UserService(request);
    });

    test('API 11: POST To Create/Register User Account', async () => {
        const response = await userService.createUser(testUser);
        expect(response.status()).toBe(200);

        const body = await response.json();
        expect(body.responseCode).toBe(201);
        expect(body.message).toBe('User created!');
    });

    test('API 14: GET User Detail By Email', async () => {
        const response = await userService.getUserDetail(testUser.email);
        expect(response.status()).toBe(200);

        const body = await response.json();
        expect(body.responseCode).toBe(200);
        expect(body.user).toBeDefined();
        expect(body.user.email).toBe(testUser.email);
        expect(body.user.name).toBe(testUser.name);
    });

    test('API 13: PUT To Update User Account', async () => {
        const updatedUser = {
            ...testUser,
            name: 'John Lifecycle Updated',
            company: 'Updated QA Corp'
        };

        const response = await userService.updateUser(updatedUser);
        expect(response.status()).toBe(200);

        const body = await response.json();
        expect(body.responseCode).toBe(200);
        expect(body.message).toBe('User updated!');
    });

    test('API 12: DELETE To Delete User Account', async () => {
        const response = await userService.deleteUser({
            email: testUser.email,
            password: testUser.password
        });
        expect(response.status()).toBe(200);

        const body = await response.json();
        expect(body.responseCode).toBe(200);
        expect(body.message).toBe('Account deleted!');
    });
});