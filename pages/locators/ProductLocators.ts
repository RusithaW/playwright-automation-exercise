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

    // [TC13 Addition]: Core input handlers for fine-tuned details modifications
    readonly quantityInput: Locator;
    readonly addToCartDetailButton: Locator;

    // Product Review form locators
    readonly writeReviewHeader: Locator;
    readonly reviewNameInput: Locator;
    readonly reviewEmailInput: Locator;
    readonly reviewTextArea: Locator;
    readonly reviewSubmitButton: Locator;
    readonly reviewSuccessAlert: Locator;

    // Sidebar elements for category navigation
    readonly categorySidebar: Locator;
    readonly categoryTitleHeader: Locator;
    readonly brandSidebar: Locator;
    readonly brandTitleHeader: Locator;
    readonly productCards: Locator;

    // Navigation elements
    readonly productsNavLink: Locator;

    // Category and panel locators
    readonly womenCategoryPanel: Locator;
    readonly menCategoryPanel: Locator;
    readonly cartItemsTableRows: Locator;
    readonly searchedProductsTitle: Locator;

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
        this.productPrice = page.locator('.product-information span').filter({ hasText: /Rs\./ }).last();
        this.productAvailability = this.productInfoContainer.getByText('Availability:');
        this.productCondition = this.productInfoContainer.getByText('Condition:');
        this.productBrand = this.productInfoContainer.getByText('Brand:');

        // Additional product card elements for specific product interactions
        this.firstProductCard = page.locator('.features_items .col-sm-4').nth(0);
        this.secondProductCard = page.locator('.features_items .col-sm-4').nth(1);
        this.continueShoppingButton = page.locator('button.btn.btn-success.close-modal.btn-block');
        this.viewCartModalLink = page.locator('.modal-body a:has-text("View Cart")');

        // [TC13 Addition]: Core input handlers for fine-tuned details modifications
        this.quantityInput = page.locator('input#quantity');
        this.addToCartDetailButton = page.locator('button.btn.btn-default.cart');

        // Product Review form locators
        this.writeReviewHeader = page.locator('a[href="#reviews"]');
        this.reviewNameInput = page.locator('input#name');
        this.reviewEmailInput = page.locator('input#email');
        this.reviewTextArea = page.locator('textarea#review');
        this.reviewSubmitButton = page.locator('#button-review');
        this.reviewSuccessAlert = page.locator('#review-section').getByText('Thank you for your review.');

        this.categorySidebar = page.locator('#accordian');
        this.categoryTitleHeader = page.locator('.features_items h2.title');
        this.brandSidebar = page.locator('.brands_products');
        this.brandTitleHeader = page.locator('.features_items h2.title');
        this.productCards = page.locator('.features_items .col-sm-4');

        // Navigation elements
        this.productsNavLink = page.getByRole('link', { name: ' Products' });

        // Category and panel locators
        this.womenCategoryPanel = page.locator('#Women');
        this.menCategoryPanel = page.locator('#Men');
        this.cartItemsTableRows = page.locator('#cart_info_table tbody tr');
        this.searchedProductsTitle = page.locator('.title.text-center');
    }

    /**
     * [TC18 Fixed]: Dynamically target top-level category panel headers (Women, Men, Kids)
     */
    getCategoryGroupHeader(gender: 'Women' | 'Men' | 'Kids'): Locator {
        return this.page.locator(`a[href="#${gender}"]`);
    }
    /**
     * [TC18 Fixed]: Dynamically target inner category sub-links inside explicit accordion groups
     */
    getCategorySubLink(gender: 'Women' | 'Men' | 'Kids', subCategoryName: string): Locator {
        return this.page.locator(`#${gender} a`, { hasText: subCategoryName });
    }

    getBrandLink(brandName: string): Locator { return this.page.locator('.brands-name a', { hasText: brandName }); }
}