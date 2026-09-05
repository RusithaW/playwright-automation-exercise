import { APIRequestContext, APIResponse, expect } from "@playwright/test";
import { BrandEndpoints } from "../endpoints/BrandEndpoints";

/**
 * BrandService class
 * Encapsulates brand API interactions with built-in assertions
 */
export class BrandService {
    constructor(private request: APIRequestContext) { }

    /**
     * API 3: Get All Brands List
     */
    async getAllBrands(): Promise<APIResponse> {
        return await this.request.get(BrandEndpoints.listBrands);
    }

    /**
     * API 4: PUT To All Brands List (Unsupported Method)
     */
    async attemptPutToBrandsList(): Promise<APIResponse> {
        return await this.request.put(BrandEndpoints.listBrands);
    }
}