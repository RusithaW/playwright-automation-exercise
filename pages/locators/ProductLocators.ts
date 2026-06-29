import { Page, Locator } from '@playwright/test';

export class ProductLocators {
    readonly page: Page;

    // Product page selectors
    readonly productTitle: Locator;
    readonly productHeader: Locator;
    readonly addToCartButton: Locator;
    readonly productDescription: Locator;
    readonly viewProductButton: Locator; // Updated for the first product
    readonly productsGrid: Locator;       // Added for step 6

    // Product detail page selectors (Added for step 9)
    readonly productInfoContainer: Locator;
    readonly productName: Locator;
    readonly productCategory: Locator;
    readonly productPrice: Locator;
    readonly productAvailability: Locator;
    readonly productCondition: Locator;
    readonly productBrand: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators for the product page
        this.productTitle = page.locator('text= Products');
        this.productHeader = page.locator('h2:has-text("All Products")');
        this.addToCartButton = page.locator('text=Add to Cart');
        this.productDescription = page.locator('text=Product Description');
        this.productsGrid = page.locator('.features_items');

        // Fix: Use .first() so Playwright knows to grab the first "View Product" link in the grid
        this.viewProductButton = page.locator('text=View Product').first();

        // Product detail page locators
        this.productInfoContainer = page.locator('.product-information');
        this.productName = this.productInfoContainer.locator('h2');
        this.productCategory = this.productInfoContainer.getByText('Category:');
        this.productPrice = this.productInfoContainer.locator('span >> text=$');
        this.productAvailability = this.productInfoContainer.getByText('Availability:');
        this.productCondition = this.productInfoContainer.getByText('Condition:');
        this.productBrand = this.productInfoContainer.getByText('Brand:');
    }
}