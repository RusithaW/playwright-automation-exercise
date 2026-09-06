import { Page, Locator } from '@playwright/test';

/**
 * ProductPage Class
 * Page Object representing catalog view, product details, product searches, reviews, and category filtering.
 */
export class ProductPage {
    readonly page: Page;

    /** Locator for 'ALL PRODUCTS' section header */
    readonly productHeader: Locator;

    /** Locator for main catalog grid container */
    readonly productsGrid: Locator;

    /** Locator for first 'View Product' details button */
    readonly viewProductButton: Locator;

    /** Locator for product keyword search input field */
    readonly searchInput: Locator;

    /** Locator for search submit button */
    readonly searchButton: Locator;

    /** Locator for 'SEARCHED PRODUCTS' section header */
    readonly searchedProductsHeader: Locator;

    /** Locator for section sub-title text */
    readonly searchedProductsTitle: Locator;

    /** Locator for individual product wrapper elements */
    readonly productItems: Locator;

    /** Locator for product details information wrapper */
    readonly productInfoContainer: Locator;

    /** Locator for product name title on details page */
    readonly productName: Locator;

    /** Locator for category metadata text */
    readonly productCategory: Locator;

    /** Locator for price metadata display text */
    readonly productPrice: Locator;

    /** Locator for availability stock status text */
    readonly productAvailability: Locator;

    /** Locator for item condition metadata text */
    readonly productCondition: Locator;

    /** Locator for brand metadata text */
    readonly productBrand: Locator;

    /** Locator for first product item card in catalog */
    readonly firstProductCard: Locator;

    /** Locator for second product item card in catalog */
    readonly secondProductCard: Locator;

    /** Locator for 'Continue Shopping' modal dismissal button */
    readonly continueShoppingButton: Locator;

    /** Locator for 'View Cart' link inside addition modal */
    readonly viewCartModalLink: Locator;

    /** Collection locator for all visible product item cards */
    readonly productCards: Locator;

    /** Input locator for product purchase quantity count */
    readonly quantityInput: Locator;

    /** Locator for 'Add to cart' button on product details view */
    readonly addToCartDetailButton: Locator;

    /** Locator for 'Write Your Review' section heading */
    readonly writeReviewHeader: Locator;

    /** Input locator for reviewer name field */
    readonly reviewNameInput: Locator;

    /** Input locator for reviewer email field */
    readonly reviewEmailInput: Locator;

    /** Textarea locator for review content body */
    readonly reviewTextArea: Locator;

    /** Locator for review submission button */
    readonly reviewSubmitButton: Locator;

    /** Locator for review submission confirmation alert banner */
    readonly reviewSuccessAlert: Locator;

    /** Locator for category sidebar accordion wrapper */
    readonly categorySidebar: Locator;

    /** Locator for category section title heading */
    readonly categoryTitleHeader: Locator;

    /** Locator for brand sidebar panel container */
    readonly brandSidebar: Locator;

    /** Locator for brand section title heading */
    readonly brandTitleHeader: Locator;

    /** Locator for header navigation link to Products catalog */
    readonly productsNavLink: Locator;

    /** Locator for 'Women' category panel container */
    readonly womenCategoryPanel: Locator;

    /** Locator for 'Men' category panel container */
    readonly menCategoryPanel: Locator;

    /** Locator for cart table item rows */
    readonly cartItemsTableRows: Locator;

    /**
     * Initializes product page locators.
     * 
     * @param page - Active Playwright Page instance.
     */
    constructor(page: Page) {
        this.page = page;

        // Headers & Grids
        this.productHeader = page.locator('h2:has-text("All Products")');
        this.productsGrid = page.locator('.features_items');
        this.viewProductButton = page.locator('a:has-text("View Product")').first();

        // Search Bar
        this.searchInput = page.locator('input#search_product');
        this.searchButton = page.locator('button#submit_search');
        this.searchedProductsHeader = page.locator('h2:has-text("Searched Products")');
        this.searchedProductsTitle = page.locator('.title.text-center');
        this.productItems = page.locator('.features_items .product-image-wrapper');

        // Product Details Info Container
        this.productInfoContainer = page.locator('.product-information');
        this.productName = this.productInfoContainer.locator('h2');
        this.productCategory = this.productInfoContainer.getByText('Category:', { exact: false });
        this.productPrice = this.productInfoContainer.locator('span').filter({ hasText: /Rs\./ }).first();
        this.productAvailability = this.productInfoContainer.getByText('Availability:', { exact: false });
        this.productCondition = this.productInfoContainer.getByText('Condition:', { exact: false });
        this.productBrand = this.productInfoContainer.getByText('Brand:', { exact: false });

        // Product Cards & Modals
        this.firstProductCard = page.locator('.features_items .col-sm-4').nth(0);
        this.secondProductCard = page.locator('.features_items .col-sm-4').nth(1);
        this.productCards = page.locator('.features_items .col-sm-4');
        this.continueShoppingButton = page.locator('button.btn.btn-success.close-modal.btn-block');
        this.viewCartModalLink = page.locator('.modal-body a:has-text("View Cart")');

        // Quantity & Details Interactivity
        this.quantityInput = page.locator('input#quantity');
        this.addToCartDetailButton = page.locator('button.btn.btn-default.cart');

        // Review Form
        this.writeReviewHeader = page.getByRole('link', { name: 'Write Your Review' });
        this.reviewNameInput = page.locator('input#name');
        this.reviewEmailInput = page.locator('input#email');
        this.reviewTextArea = page.locator('textarea#review');
        this.reviewSubmitButton = page.locator('#button-review');
        this.reviewSuccessAlert = page.locator('#review-section').getByText('Thank you for your review.');

        // Sidebar & Navigation
        this.categorySidebar = page.locator('#accordian');
        this.categoryTitleHeader = page.locator('.features_items h2.title');
        this.brandSidebar = page.locator('.brands_products');
        this.brandTitleHeader = page.locator('.features_items h2.title');
        this.productsNavLink = page.getByRole('link', { name: 'Products' });

        // Panels & Tables
        this.womenCategoryPanel = page.locator('#Women');
        this.menCategoryPanel = page.locator('#Men');
        this.cartItemsTableRows = page.locator('#cart_info_table tbody tr');
    }

    /**
     * Builds a dynamic locator for a gender-based category accordion group header.
     * 
     * @param gender - Category group name ('Women', 'Men', or 'Kids').
     * @returns Playwright Locator targeting category expander link.
     */
    getCategoryGroupHeader(gender: 'Women' | 'Men' | 'Kids'): Locator {
        return this.page.locator(`a[href="#${gender}"]`);
    }

    /**
     * Builds a dynamic locator for a sub-category link under a gender group.
     * 
     * @param gender - Parent category group.
     * @param subCategoryName - Sub-category label (e.g., 'Dress', 'Tops').
     * @returns Playwright Locator targeting sub-category filter link.
     */
    getCategorySubLink(gender: 'Women' | 'Men' | 'Kids', subCategoryName: string): Locator {
        return this.page.locator(`#${gender} a`, { hasText: subCategoryName });
    }

    /**
     * Builds a dynamic locator for a brand link inside sidebar list.
     * 
     * @param brandName - Brand title (e.g., 'Polo', 'Madame').
     * @returns Playwright Locator targeting brand filter link.
     */
    getBrandLink(brandName: string): Locator {
        return this.page.locator('.brands-name a', { hasText: brandName });
    }

    /**
     * Directs browser to product catalog route `/products`.
     */
    async navigateToProducts(): Promise<void> {
        await this.page.goto('/products');
    }

    /**
     * Navigates to catalog view using header navigation link.
     */
    async navigateToProductsViaHeaderLink(): Promise<void> {
        await this.productsNavLink.click();
    }

    /**
     * Clicks first 'View Product' link in list and waits for detail URL to load.
     */
    async clickFirstProduct(): Promise<void> {
        await this.viewProductButton.click();
        await this.page.waitForURL('**/product_details/**');
    }

    /**
     * Executes product catalog search query.
     * 
     * @param productName - Search term keyword.
     */
    async searchProduct(productName: string): Promise<void> {
        await this.searchInput.fill(productName);
        await this.searchButton.click();
    }

    /**
     * Adds top two products to cart sequentially with modal handling, then views cart.
     */
    async addTwoProductsSequential(): Promise<void> {
        // Product 1
        await this.firstProductCard.scrollIntoViewIfNeeded();
        await this.firstProductCard.hover();
        const firstOverlayBtn = this.firstProductCard.locator('.overlay-content .add-to-cart');
        await firstOverlayBtn.waitFor({ state: 'visible' });
        await firstOverlayBtn.click();

        await this.page.locator('#cartModal').waitFor({ state: 'visible' });
        await this.continueShoppingButton.click();
        await this.page.locator('#cartModal').waitFor({ state: 'hidden' });

        // Product 2
        await this.secondProductCard.scrollIntoViewIfNeeded();
        await this.secondProductCard.hover();
        const secondOverlayBtn = this.secondProductCard.locator('.overlay-content .add-to-cart');
        await secondOverlayBtn.waitFor({ state: 'visible' });
        await secondOverlayBtn.click();

        await this.page.locator('#cartModal').waitFor({ state: 'visible' });
        await this.viewCartModalLink.click();
    }

    /**
     * Sets purchase quantity value inside product detail view.
     * 
     * @param quantity - Desired numerical count.
     */
    async setProductQuantity(quantity: string | number): Promise<void> {
        await this.quantityInput.fill(String(quantity));
    }

    /**
     * Fills out and submits product feedback review form.
     * 
     * @param name - Reviewer display name.
     * @param email - Reviewer email.
     * @param reviewText - Feedback description.
     */
    async submitReview(name: string, email: string, reviewText: string): Promise<void> {
        await this.reviewNameInput.fill(name);
        await this.reviewEmailInput.fill(email);
        await this.reviewTextArea.fill(reviewText);
        await this.reviewSubmitButton.click();
    }

    /**
     * Clicks cart addition button on product details view.
     */
    async addToCartFromDetailPage(): Promise<void> {
        await this.addToCartDetailButton.waitFor({ state: 'visible' });
        await this.addToCartDetailButton.click();
    }

    /**
     * Iterates over all currently visible product cards and adds each to cart with modal dismissals.
     */
    async addAllVisibleProductsToCart(): Promise<void> {
        const count = await this.productCards.count();

        for (let i = 0; i < count; i++) {
            const productCard = this.productCards.nth(i);

            await productCard.scrollIntoViewIfNeeded();
            await productCard.hover();

            const overlayBtn = productCard.locator('.overlay-content .add-to-cart');
            await overlayBtn.waitFor({ state: 'visible' });
            await overlayBtn.click();

            await this.page.locator('#cartModal').waitFor({ state: 'visible' });
            await this.continueShoppingButton.click();
            await this.page.locator('#cartModal').waitFor({ state: 'hidden' });
        }
    }
}