import { APIRequestContext, APIResponse, expect } from '@playwright/test';
import { ProductEndpoints } from '../endpoints/ProductEndpoints';

/**
 * ProductService class
 * Encapsulates product API interactions with built-in assertions
 */
export class ProductService {
    constructor(private request: APIRequestContext) { }

    /**
     * API 1: Get All Products List
     */
    async getAllProducts(): Promise<APIResponse> {
        return await this.request.get(ProductEndpoints.listProducts);
    }

    /**
     * API 2: Attempt POST to products list (Unsupported Method)
     */
    async attemptPostToProductsList(): Promise<APIResponse> {
        return await this.request.post(ProductEndpoints.listProducts);
    }

    /**
     * API 5 & 6: Search Product
     * Uses `form:` payload required by AutomationExercise API
     */
    async searchProducts(searchTerm?: string): Promise<APIResponse> {
        return await this.request.post(ProductEndpoints.searchProduct, {
            form: searchTerm !== undefined ? { search_product: searchTerm } : {}
        });
    }
}


