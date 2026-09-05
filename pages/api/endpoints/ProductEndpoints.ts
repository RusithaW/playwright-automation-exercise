import { APIRequestContext } from '@playwright/test';

export class ProductEndpoints {
    static readonly listProducts = '/api/productsList';
    static readonly brandList = '/api/brandsList';
    static readonly searchProduct = '/api/searchProduct';
}
