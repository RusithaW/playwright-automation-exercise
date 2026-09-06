import { APIRequestContext, APIResponse } from "@playwright/test";
import { AuthEndpoints } from "../endpoints/AuthEndpoints";

/**
 * AuthService Class
 * Encapsulates authentication API operations for AutomationExercise endpoints.
 * Manages user credential verification and HTTP method testing.
 */
export class AuthService {
    /**
     * @param request - Injected Playwright APIRequestContext instance.
     */
    constructor(private readonly request: APIRequestContext) { }

    /**
     * API 7, 8, 10: POST To Verify Login
     * 
     * Validates user login credentials against the backend. Supports flexible inputs
     * to allow testing valid, missing, or invalid parameter scenarios.
     * 
     * @param params - Optional credentials object containing email and/or password.
     * @returns Promise resolving to Playwright APIResponse object.
     */
    async verifyLogin(params?: { email?: string; password?: string }): Promise<APIResponse> {
        return await this.request.post(AuthEndpoints.verifyLogin, {
            form: params || {}
        });
    }

    /**
     * API 9: DELETE To Verify Login (Unsupported Method)
     * 
     * Attempts an unsupported DELETE request to the verify login endpoint to validate 
     * backend HTTP method rejection.
     * 
     * @returns Promise resolving to Playwright APIResponse object.
     */
    async deleteVerifyLogin(): Promise<APIResponse> {
        return await this.request.delete(AuthEndpoints.verifyLogin);
    }
}