import { APIRequestContext, APIResponse } from "@playwright/test";
import { AuthEndpoints } from "../endpoints/AuthEndpoints";

/**
 * AuthService class
 * Encapsulates auth API interactions with built-in assertions
 */
export class AuthService {
    constructor(private readonly request: APIRequestContext) { }

    /**
     * API 7, 8, 10: Verify Login with flexible parameters
     */
    async verifyLogin(params?: { email?: string; password?: string }): Promise<APIResponse> {
        return await this.request.post(AuthEndpoints.verifyLogin, {
            form: params
        });
    }

    /**
     * API 9: Unsupported DELETE request to Verify Login
     */
    async deleteVerifyLogin(): Promise<APIResponse> {
        return await this.request.delete(AuthEndpoints.verifyLogin);
    }
}