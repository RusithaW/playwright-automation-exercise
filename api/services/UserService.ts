import { APIRequestContext, APIResponse } from '@playwright/test';
import { UserEndpoints } from '../endpoints/UserEndpoints';
import { TestUser, toApiPayload } from '../../data/userFactory';

/**
 * UserService Class
 * Encapsulates user management API operations for AutomationExercise endpoints.
 * Handles payload normalization, form-data encoding, and network requests.
 */
export class UserService {
    /**
     * @param request - Injected Playwright APIRequestContext instance.
     */
    constructor(private readonly request: APIRequestContext) { }

    /**
     * API 11: POST To Create/Register User Account.
     * 
     * Normalizes UI-centric user data (camelCase) to backend-expected form fields before posting.
     * 
     * @param userData - Strong-typed TestUser object or raw key-value pair payload.
     * @returns Promise resolving to Playwright APIResponse object.
     */
    async createUser(userData: TestUser | Record<string, unknown>): Promise<APIResponse> {
        // Normalize payload keys if passed a UI model instance
        const payload = 'firstName' in userData
            ? toApiPayload(userData as TestUser)
            : userData as Record<string, string>;

        return await this.request.post(UserEndpoints.createAccount, {
            form: payload
        });
    }

    /**
     * API 12: DELETE To Delete User Account.
     * 
     * Submits a form-encoded request to remove an existing account using credentials.
     * 
     * @param credentials - Object containing account email and password.
     * @returns Promise resolving to Playwright APIResponse object.
     */
    async deleteUser(credentials: { email?: string; password?: string }): Promise<APIResponse> {
        return await this.request.delete(UserEndpoints.deleteAccount, {
            form: credentials
        });
    }

    /**
     * API 13: PUT To Update User Account.
     * 
     * Modifies profile information for an existing registered account.
     * 
     * @param userData - Strong-typed TestUser object or raw key-value pair payload.
     * @returns Promise resolving to Playwright APIResponse object.
     */
    async updateUser(userData: TestUser | Record<string, unknown>): Promise<APIResponse> {
        // Normalize payload keys if passed a UI model instance
        const payload = 'firstName' in userData
            ? toApiPayload(userData as TestUser)
            : userData as Record<string, string>;

        return await this.request.put(UserEndpoints.updateAccount, {
            form: payload
        });
    }

    /**
     * API 14: GET User Detail By Email.
     * 
     * Queries user profile details given a target email address.
     * 
     * @param email - Target user email address.
     * @returns Promise resolving to Playwright APIResponse object.
     */
    async getUserDetail(email: string): Promise<APIResponse> {
        return await this.request.get(UserEndpoints.getUserDetail, {
            params: { email }
        });
    }
}