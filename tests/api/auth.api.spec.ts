import { test, expect } from '@playwright/test';
import { AuthService } from '../../pages/api/services/AuthService';

test.describe('Auth API Suite (API 7, 8, 9, 10)', () => {
    let authService: AuthService;

    test.beforeEach(async ({ request }) => {
        authService = new AuthService(request);
    });

    test('API 7: POST To Verify Login with valid details', async () => {
        // Read credentials safely from .env
        const email = process.env.TEST_EMAIL!;
        const password = process.env.TEST_USER_PASSWORD!;

        const response = await authService.verifyLogin({ email, password });
        expect(response.status()).toBe(200);

        const body = await response.json();
        expect(body.responseCode).toBe(200);
        expect(body.message).toBe('User exists!');
    });

    test('API 8: POST To Verify Login without email parameter', async () => {
        const password = process.env.TEST_USER_PASSWORD!;

        const response = await authService.verifyLogin({ password });
        expect(response.status()).toBe(200);

        const body = await response.json();
        expect(body.responseCode).toBe(400);
        expect(body.message).toBe('Bad request, email or password parameter is missing in POST request.');
    });

    test('API 9: DELETE To Verify Login (Unsupported Method)', async () => {
        const response = await authService.deleteVerifyLogin();
        expect(response.status()).toBe(200);

        const body = await response.json();
        expect(body.responseCode).toBe(405);
        expect(body.message).toBe('This request method is not supported.');
    });

    test('API 10: POST To Verify Login with invalid details', async () => {
        const response = await authService.verifyLogin({
            email: 'nonexistent_user_999@example.com',
            password: 'WrongPassword'
        });
        expect(response.status()).toBe(200);

        const body = await response.json();
        expect(body.responseCode).toBe(404);
        expect(body.message).toBe('User not found!');
    });
});