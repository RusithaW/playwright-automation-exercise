import { Page } from '@playwright/test';
import { ProductLocators } from '../locators/ProductLocators';

export class ProductActions {
    readonly page: Page;
    readonly productLocators: ProductLocators;

    constructor(page: Page) {
        this.page = page;
        this.productLocators = new ProductLocators(page);
    }

    // Navigates directly to the global products overview catalog URL context
    async navigateToProducts() {
        await this.page.goto('/products');
    }

    // Opens the details sheet for the first product displayed in the active list
    async clickFirstProduct() {
        await this.productLocators.viewProductButton.click();
        await this.page.waitForURL('**/product_details/**');
    }

    // Enters a search parameter and submits the query
    async searchProduct(productName: string) {
        await this.productLocators.searchInput.fill(productName);
        await this.productLocators.searchButton.click();
    }

    // [TC12 / TC14]: Sequences multi-layered overlays without letting thread executions collide
    async addTwoProductsSequential() {
        // --- Product 1 ---
        await this.productLocators.firstProductCard.scrollIntoViewIfNeeded();
        await this.productLocators.firstProductCard.hover();

        // Wait explicitly for the hover overlay button to become visible before clicking
        const firstOverlayBtn = this.productLocators.firstProductCard.locator('.overlay-content .add-to-cart');
        await firstOverlayBtn.waitFor({ state: 'visible' });
        await firstOverlayBtn.click();

        // Wait for modal container to become visible
        await this.page.locator('#cartModal').waitFor({ state: 'visible' });
        await this.productLocators.continueShoppingButton.click();

        // Wait for modal backdrop to be completely hidden before interacting with product 2
        await this.page.locator('#cartModal').waitFor({ state: 'hidden' });

        // --- Product 2 ---
        await this.productLocators.secondProductCard.scrollIntoViewIfNeeded();
        await this.productLocators.secondProductCard.hover();

        const secondOverlayBtn = this.productLocators.secondProductCard.locator('.overlay-content .add-to-cart');
        await secondOverlayBtn.waitFor({ state: 'visible' });
        await secondOverlayBtn.click();

        // Wait for modal and click 'View Cart'
        await this.page.locator('#cartModal').waitFor({ state: 'visible' });
        await this.productLocators.viewCartModalLink.click();
    }

    // [TC13 Addition]: Core input handlers for fine-tuned details modifications
    async setProductQuantity(quantity: string | number) {
        await this.productLocators.quantityInput.fill(String(quantity));
    }

    async submitReview(name: string, email: string, reviewText: string) {
        await this.productLocators.reviewNameInput.fill(name);
        await this.productLocators.reviewEmailInput.fill(email);
        await this.productLocators.reviewTextArea.fill(reviewText);
        await this.productLocators.reviewSubmitButton.click();
    }

    async addToCartFromDetailPage() {
        await this.productLocators.addToCartDetailButton.waitFor({ state: 'visible' });
        await this.productLocators.addToCartDetailButton.click();
    }

    async addAllVisibleProductsToCart() {
        const count = await this.productLocators.productCards.count();

        for (let i = 0; i < count; i++) {
            const productCard = this.productLocators.productCards.nth(i);

            await productCard.scrollIntoViewIfNeeded();
            await productCard.hover();

            const overlayBtn = productCard.locator('.overlay-content .add-to-cart');
            await overlayBtn.waitFor({ state: 'visible' });
            await overlayBtn.click();

            await this.page.locator('#cartModal').waitFor({ state: 'visible' });
            await this.productLocators.continueShoppingButton.click();
            await this.page.locator('#cartModal').waitFor({ state: 'hidden' });
        }
    }
}