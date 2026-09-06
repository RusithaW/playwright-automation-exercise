import { APIRequestContext, APIResponse } from "@playwright/test";
import { BrandEndpoints } from "../endpoints/BrandEndpoints";

/**
 * BrandService Class
 * Encapsulates brand catalog API operations for AutomationExercise endpoints.
 * Handles fetching brand listings and verifying unsupported HTTP verbs.
 */
export class BrandService {
    /**
     * @param request - Injected Playwright APIRequestContext instance.
     */
    constructor(private readonly request: APIRequestContext) { }

    /**
     * API 3: GET All Brands List
     * 
     * Retrieves the complete catalog list of product brands.
     * 
     * @returns Promise resolving to Playwright APIResponse object.
     */
    async getAllBrands(): Promise<APIResponse> {
        return await this.request.get(BrandEndpoints.listBrands);
    }

    /**
     * API 4: PUT To All Brands List (Unsupported Method)
     * 
     * Attempts an unsupported PUT request to the brands listing endpoint to validate 
     * backend HTTP method rejection.
     * 
     * @returns Promise resolving to Playwright APIResponse object.
     */
    async attemptPutToBrandsList(): Promise<APIResponse> {
        return await this.request.put(BrandEndpoints.listBrands);
    }
}