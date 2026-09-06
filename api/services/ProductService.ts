import { APIRequestContext, APIResponse } from '@playwright/test';
import { ProductEndpoints } from '../endpoints/ProductEndpoints';

/**
 * ProductService Class
 * Encapsulates product catalog and search API operations for AutomationExercise endpoints.
 * Handles product listing queries, product search parameter serialization, and method validation.
 */
export class ProductService {
    /**
     * @param request - Injected Playwright APIRequestContext instance.
     */
    constructor(private readonly request: APIRequestContext) { }

    /**
     * API 1: GET All Products List
     * 
     * Retrieves the complete catalog list of available products.
     * 
     * @returns Promise resolving to Playwright APIResponse object.
     */
    async getAllProducts(): Promise<APIResponse> {
        return await this.request.get(ProductEndpoints.listProducts);
    }

    /**
     * API 2: POST To All Products List (Unsupported Method)
     * 
     * Attempts an unsupported POST request to the product list endpoint to validate 
     * backend HTTP method rejection.
     * 
     * @returns Promise resolving to Playwright APIResponse object.
     */
    async attemptPostToProductsList(): Promise<APIResponse> {
        return await this.request.post(ProductEndpoints.listProducts);
    }

    /**
     * API 5 & 6: POST To Search Product
     * 
     * Searches the product catalog using a search term. Sends form-urlencoded payload
     * as required by the AutomationExercise backend. Supports omitted parameters for negative testing.
     * 
     * @param searchTerm - Optional keyword to filter products (e.g., 'tshirt').
     * @returns Promise resolving to Playwright APIResponse object.
     */
    async searchProducts(searchTerm?: string): Promise<APIResponse> {
        return await this.request.post(ProductEndpoints.searchProduct, {
            form: searchTerm !== undefined ? { search_product: searchTerm } : {}
        });
    }
}