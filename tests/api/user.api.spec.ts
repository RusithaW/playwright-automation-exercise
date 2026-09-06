import { apiTest as test, expect } from '../../fixtures/apiFixtures';
import { UserService } from '../../api/services/UserService';
import { createDynamicUser, TestUser } from '../../data/userFactory';

test.describe.serial('User Account API Lifecycle Suite (API 11, 12, 13, 14)', () => {
    let userService: UserService;
    let testUser: TestUser;

    test.beforeAll(async () => {
        // Generate a single user instance for the entire serial lifecycle
        testUser = createDynamicUser();
    });

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
            name: `${testUser.name} Updated`,
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