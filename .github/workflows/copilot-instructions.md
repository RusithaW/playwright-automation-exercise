# Playwright Page Object Model (POM) Guidelines

This repository follows a strict Page Object Model (POM) architecture using **TypeScript** and **Playwright**. All generated code, refactorings, and suggestions must strictly comply with these rules.

---

## 🏛️ Framework Architecture & File Structure

The framework is strictly separated into three layers:

```text
├── pages/
│   ├── locators/         # Locators layer (*Locators.ts)
│   └── actions/          # Actions/Page layer (*Actions.ts)
└── tests/                # Spec files (*.spec.ts)
```

1. **Locators Layer (`pages/locators/*Locators.ts`)**: Defines page element selectors.
2. **Actions Layer (`pages/actions/*Actions.ts`)**: Encapsulates page interactions, navigation, and workflows.
3. **Tests Layer (`tests/*.spec.ts`)**: Declarative specs containing test steps, action calls, and assertions (`expect`).

---

## 🏷️ Naming & Variable Standards

- **Action Class Instances**: Must always append `Actions` to the variable name.
  - `authActions: AuthActions`
  - `productActions: ProductActions`
  - `cartActions: CartActions`
  - `checkoutActions: CheckoutActions`
  - `homeActions: HomeActions`
- **Class File Names**: PascalCase with appropriate suffix (`CartActions.ts`, `CartLocators.ts`).
- **Spec File Names**: Lowercase kebab-case with `.spec.ts` (`cart.spec.ts`, `checkout.spec.ts`).

---

## ⛔ Rule 1: No Direct Page Locators in Spec Files (`*.spec.ts`)

- **STRICTLY FORBIDDEN IN SPECS**:
  - `page.locator(...)`
  - `page.getByRole(...)`, `page.getByText(...)`, etc.
  - `page.evaluate(...)`
  - `page.goto(...)`
- **Allowed in Specs**:
  - Calling action methods (`await productActions.navigateToProducts()`).
  - Accessing locator properties for assertions (`await expect(cartActions.cartLocators.cartBreadcrumb).toBeVisible()`).
  - Standard Playwright assertions (`expect(...)`).

---

## ⛔ Rule 2: No Duplicate Object Instantiations

- Initialize all page action instances in `test.beforeEach()`.
- **NEVER** re-instantiate action classes inside individual `test()` blocks if they are already created in `beforeEach`.

```typescript
// ❌ WRONG
test('Test Case', async ({ page }) => {
    const productActions = new ProductActions(page); // Redundant
});

// ✅ CORRECT
test.beforeEach(async ({ page }) => {
    productActions = new ProductActions(page);
});

test('Test Case', async () => {
    await productActions.navigateToProducts();
});
```

---

## ⚡ Rule 3: Locators Layer Guidelines (`*Locators.ts`)

- Define all selectors as `readonly` properties in constructor or class properties.
- **NEVER** perform actions (`.click()`, `.fill()`) inside a `*Locators.ts` file.

```typescript
export class CartLocators {
    readonly page: Page;
    readonly cartBreadcrumb: Locator;
    readonly cartRows: Locator;
    readonly emptyCartContainer: Locator;

    constructor(page: Page) {
        this.page = page;
        this.cartBreadcrumb = page.locator('.breadcrumb');
        this.cartRows = page.locator('#cart_info_table tbody tr');
        this.emptyCartContainer = page.locator('#empty_cart');
    }
}
```

---

## ⚙️ Rule 4: Action Layer Guidelines (`*Actions.ts`)

- Wrap multi-step workflows into high-level descriptive methods (e.g., `submitPaymentDetails(details)`).
- **Avoid Race Conditions**:
  - Do NOT use `await locator.isVisible()` as an instantaneous check before clicking animated/hover elements. Use `await locator.waitFor({ state: 'visible' })` instead.
  - Avoid `{ force: true }` unless dealing with non-interactable hidden inputs (e.g., file inputs).
- **Handling Flaky DOM Removals**: Use `expect(...).toPass()` to retry clicks on elements dependent on dynamic JS/jQuery event binding.

---

## 🧪 Rule 5: Playwright Assertion Best Practices

- **Valid Detachment Matcher**: Playwright does **not** have `.toBeDetached()`. Use `expect(locator).not.toBeAttached()`.
- Use web-first auto-retrying assertions (`expect(locator).toBeVisible()`, `expect(locator).toHaveCount(...)`) instead of manual evaluation or standard Jest booleans.

---

## 🧹 Rule 6: Clean Code & TypeScript Compliance

- Keep code free of unused imports, dead variables, or unreferenced parameters (`noUnusedLocals: true`).
- Clean up test files to reflect declarative business intent rather than implementation code.