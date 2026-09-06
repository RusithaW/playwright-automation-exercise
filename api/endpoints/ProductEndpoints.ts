/**
 * ProductEndpoints Object
 * Centralizes static API route paths for product catalog, brand listing, and search operations.
 */
export const ProductEndpoints = {
    /**
     * Endpoint path for retrieving the full product catalog (GET) or method testing (POST).
     */
    listProducts: '/api/productsList',

    /**
     * Endpoint path for retrieving the complete list of brands (GET) or method testing (PUT).
     */
    brandList: '/api/brandsList',

    /**
     * Endpoint path for executing keyword-based product searches (POST).
     */
    searchProduct: '/api/searchProduct'
} as const;