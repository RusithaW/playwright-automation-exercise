import { APIRequestContext, APIResponse } from '@playwright/test';
import { UserEndpoints } from '../endpoints/UserEndpoints';

export class UserService {
    constructor(private readonly request: APIRequestContext) { }

    /**
     * API 11: POST To Create/Register User Account
     */
    async createUser(userData: Record<string, string>): Promise<APIResponse> {
        return await this.request.post(UserEndpoints.createAccount, {
            form: userData
        });
    }

    /**
     * API 12: DELETE To Delete User Account
     */
    async deleteUser(credentials: { email?: string; password?: string }): Promise<APIResponse> {
        return await this.request.delete(UserEndpoints.deleteAccount, {
            form: credentials
        });
    }

    /**
     * API 13: PUT To Update User Account
     */
    async updateUser(userData: Record<string, string>): Promise<APIResponse> {
        return await this.request.put(UserEndpoints.updateAccount, {
            form: userData
        });
    }

    /**
     * API 14: GET User Detail By Email
     */
    async getUserDetail(email: string): Promise<APIResponse> {
        return await this.request.get(UserEndpoints.getUserDetail, {
            params: { email }
        });
    }
}