import { APIRequestContext } from "@playwright/test";

export class UserEndpoints {
    static readonly createAccount = '/api/createAccount';
    static readonly deleteAccount = '/api/deleteAccount';
    static readonly updateAccount = 'api/updateAccount';
    static readonly getUserDetail = '/api/getUserDetailByEmail';

}   