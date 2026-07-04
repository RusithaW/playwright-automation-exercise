import { Page, Locator } from '@playwright/test';

export class ProductLocators {
    readonly page: Page;

    // All Products grid & page elements
    readonly productTitle: Locator;
    readonly productHeader: Locator;
    readonly productsGrid: Locator;
    readonly viewProductButton: Locator;

    // Search bar elements
    readonly searchInput: Locator;
    readonly searchButton: Locator;
    readonly searchedProductsHeader: Locator;
    readonly productItems: Locator;

    // Product detail view card elements
    readonly productInfoContainer: Locator;
    readonly productName: Locator;
    readonly productCategory: Locator;
    readonly productPrice: Locator;
    readonly productAvailability: Locator;
    readonly productCondition: Locator;
    readonly productBrand: Locator;

    // Additional product card elements for specific product interactions
    readonly firstProductCard: Locator;
    readonly secondProductCard: Locator;
    readonly continueShoppingButton: Locator;
    readonly viewCartModalLink: Locator;

    constructor(page: Page) {
        this.page = page;

        // Base selectors
        this.productTitle = page.locator('text= Products');
        this.productHeader = page.locator('h2:has-text("All Products")');
        this.productsGrid = page.locator('.features_items');
        this.viewProductButton = page.locator('text=View Product').first();

        // Search bar selectors - Fixed syntax to use correct CSS attributes
        this.searchInput = page.locator('input#search_product');
        this.searchButton = page.locator('button#submit_search');
        this.searchedProductsHeader = page.locator('h2:has-text("Searched Products")');
        this.productItems = page.locator('.features_items .product-image-wrapper');

        // Individual item details card block selectors
        this.productInfoContainer = page.locator('.product-information');
        this.productName = this.productInfoContainer.locator('h2');
        this.productCategory = this.productInfoContainer.getByText('Category:');
        this.productPrice = this.productInfoContainer.locator('span', { hasText: /Rs\./ });
        this.productAvailability = this.productInfoContainer.getByText('Availability:');
        this.productCondition = this.productInfoContainer.getByText('Condition:');
        this.productBrand = this.productInfoContainer.getByText('Brand:');

        // Additional product card elements for specific product interactions
        this.firstProductCard = page.locator('.features_items .col-sm-4').nth(0);
        this.secondProductCard = page.locator('.features_items .col-sm-4').nth(1);
        this.continueShoppingButton = page.locator('button.btn.btn-success.close-modal.btn-block');
        this.viewCartModalLink = page.locator('.modal-body a:has-text("View Cart")');
    }
}