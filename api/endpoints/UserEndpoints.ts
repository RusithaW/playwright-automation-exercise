/**
 * UserEndpoints Object
 * Centralizes static API route paths for user account management operations.
 */
export const UserEndpoints = {
    /**
     * Endpoint path for registering a new user account (POST).
     */
    createAccount: '/api/createAccount',

    /**
     * Endpoint path for deleting an existing user account (DELETE).
     */
    deleteAccount: '/api/deleteAccount',

    /**
     * Endpoint path for updating user account details (PUT).
     */
    updateAccount: '/api/updateAccount',

    /**
     * Endpoint path for fetching user account details by email (GET).
     */
    getUserDetail: '/api/getUserDetailByEmail'
} as const;