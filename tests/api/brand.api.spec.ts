import { test, expect } from '@playwright/test';
import { BrandService } from '../../pages/api/services/BrandService';

test.describe('BBrand API Suite (API 3, 4)', () => {
    let brandService: BrandService;

    test.beforeEach(async ({ request }) => {
        brandService = new BrandService(request);
    });

    test('API 3: Get All Brands List', async () => {
        const response = await brandService.getAllBrands();
        expect(response.status()).toBe(200);

        const body = await response.json();
        expect(body.responseCode).toBe(200);
        expect(Array.isArray(body.brands)).toBe(true);
        expect(body.brands.length).toBeGreaterThan(0);
    });

    test('API 4: Attempt PUT to All Brands List (Unsupported Method)', async () => {
        const response = await brandService.attemptPutToBrandsList();
        expect(response.status()).toBe(200); // Network status code is 200

        const body = await response.json();
        expect(body.responseCode).toBe(405); // Payload error code
        expect(body.message).toBe('This request method is not supported.');
    });
});