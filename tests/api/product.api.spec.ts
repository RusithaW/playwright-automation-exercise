import { test, expect } from '@playwright/test';
import { ProductService } from '../../pages/api/services/ProductService';

test.describe('Product API Suite (API 1, 2, 5, 6)', () => {
    let productService: ProductService;

    test.beforeEach(async ({ request }) => {
        productService = new ProductService(request);
    });

    test('API 1: Get All Products List', async () => {
        const response = await productService.getAllProducts();
        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body.responseCode).toBe(200);
        expect(Array.isArray(body.products)).toBe(true);
        expect(body.products.length).toBeGreaterThan(0);
    });

    test('API 2: Attempt POST to products list (Unsupported Method)', async () => {
        const response = await productService.attemptPostToProductsList();
        expect(response.status()).toBe(200); // Network HTTP status is always 200

        const body = await response.json();
        expect(body.responseCode).toBe(405); // API payload code
        expect(body.message).toBe('This request method is not supported.');
    });

    test('API 5: POST To Search Product', async () => {
        const response = await productService.searchProducts('tshirt');
        expect(response.status()).toBe(200);

        const body = await response.json();
        expect(body.responseCode).toBe(200);
        expect(Array.isArray(body.products)).toBe(true);
    });

    test('API 6: POST To Search Product without search_product parameter', async () => {
        const response = await productService.searchProducts(); // No param passed
        const body = await response.json();

        expect(body.responseCode).toBe(400);
        expect(body.message).toBe('Bad request, search_product parameter is missing in POST request.');
    });
});