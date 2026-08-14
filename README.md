# Playwright Automation Exercise

A robust, maintainable end-to-end test automation framework built with **Playwright** and **TypeScript**, enforcing the **Page Object Model (POM)** pattern at the compiler level.

## 🎯 Project Overview

This framework provides a structured approach to browser automation testing with:
- **Strict POM discipline** enforced through TypeScript compilation
- **Layered architecture** separating locators from actions from tests
- **Type-safe interactions** with Playwright's modern API
- **Zero dead code** through strict linting (`noUnusedLocals`, `noUnusedParameters`)
- **Comprehensive test coverage** for authentication, products, cart, checkout, contact, and subscription flows

## 📁 Project Structure

```
playwright-automation-exercise/
├── pages/
│   ├── actions/              # Business logic & user flows
│   │   ├── AuthActions.ts
│   │   ├── CartActions.ts
│   │   ├── CheckoutActions.ts
│   │   ├── ContactActions.ts
│   │   ├── HomeActions.ts
│   │   └── ProductActions.ts
│   │
│   └── locators/             # Centralized selectors
│       ├── AuthLocators.ts
│       ├── CartLocators.ts
│       ├── CheckoutLocators.ts
│       ├── ContactLocators.ts
│       ├── HomeLocators.ts
│       └── ProductLocators.ts
│
├── tests/                    # Test specs (orchestration only)
│   ├── auth.spec.ts
│   ├── cart.spec.ts
│   ├── checkout.spec.ts
│   ├── contact.spec.ts
│   ├── home.spec.ts
│   ├── products.spec.ts
│   └── subscription.spec.ts
│
├── data/                     # Test fixtures & uploads
│   └── dummy_upload_file.txt
│
├── baseTest.ts              # Custom test base (blocks ads/analytics)
├── playwright.config.ts     # Playwright configuration
├── tsconfig.json            # TypeScript strict mode config
├── package.json             # Dependencies & scripts
└── README.md                # This file
```

## 🏗️ Architecture: Page Object Model (POM)

This framework enforces a **three-layer POM pattern**:

### Layer 1: Locators (`pages/locators/*Locators.ts`)
**Responsibility:** Define all UI element selectors for a page/feature

```typescript
export class AuthLocators {
  readonly loginEmailInput: Locator;
  readonly loginPasswordInput: Locator;
  readonly loginButton: Locator;
  // ... more locators
  
  constructor(page: Page) {
    this.loginEmailInput = page.locator('input[data-qa="login-email"]');
    this.loginButton = page.locator('button[data-qa="login-button"]');
  }
}
```

### Layer 2: Actions (`pages/actions/*Actions.ts`)
**Responsibility:** Encapsulate user interactions & business workflows

```typescript
export class AuthActions {
  readonly authLocators: AuthLocators;
  
  async loginExistingUser(email: string, password: string) {
    await this.authLocators.loginEmailInput.fill(email);
    await this.authLocators.loginPasswordInput.fill(password);
    await this.authLocators.loginButton.click();
  }
  
  getLoginHeader() {
    return this.authLocators.loginHeader;
  }
}
```

### Layer 3: Tests (`tests/*.spec.ts`)
**Responsibility:** Orchestrate actions & assert outcomes (NO raw locators)

```typescript
test('Test Case: Login User', async () => {
  await authActions.navigateToSignupLogin();
  await expect(authActions.getLoginHeader()).toHaveText('Login to your account');
  await authActions.loginExistingUser(email, password);
  await expect(authActions.getNavbarContainer()).toContainText('Logged in as');
});
```

## 🚫 POM Rules (Enforced at Compile-Time)

✅ **Allowed in test files:**
- Call action methods: `authActions.login()`
- Use locator getters: `authActions.getLoginHeader()`
- Use action locator objects: `authActions.authLocators.homeFeaturedItems`
- Playwright utilities: `expect()`, `page.waitForURL()`, `page.waitForLoadState()`

❌ **Forbidden in test files:**
- Raw selectors: `page.locator('.login-form h2')`
- Direct `getByRole()`: `page.getByRole('button', { name: 'Login' })`
- Unused variables/parameters

**Enforcement:** TypeScript compiler with `noUnusedLocals: true` and custom linting scripts.

## 🛠️ Setup & Installation

### Prerequisites
- **Node.js** ≥ 16.x
- **npm** or **yarn**

### Install Dependencies

```bash
npm install
```

This installs:
- `@playwright/test` — Playwright testing framework
- `typescript` — Type safety and linting
- Supporting dev dependencies

### Install Browsers

```bash
npx playwright install
```

## ▶️ Running Tests

### Run All Tests
```bash
npx playwright test
```

### Run Specific Test File
```bash
npx playwright test tests/auth.spec.ts
```

### Run Tests in UI Mode (Interactive)
```bash
npx playwright test --ui
```

### Run Tests in Headed Mode (See Browser)
```bash
npx playwright test --headed
```

### Run Tests with Specific Browser
```bash
npx playwright test --project=chromium
# Options: chromium, firefox, webkit
```

### View Test Report
```bash
npx playwright show-report
```

## 🔍 Linting & Type Checking

### Run TypeScript Compiler Check
```bash
npm run lint
```

This enforces:
- ✅ No unused local variables
- ✅ No unused function parameters
- ✅ No unused imports
- ✅ Strict type checking

**Output:** 0 errors = clean, maintainable code

### Individual Check
```bash
npx tsc --noEmit --noUnusedLocals --noUnusedParameters
```

## 📋 Test Coverage

The framework includes **7 test suites** covering:

| Suite | Tests | Coverage |
|-------|-------|----------|
| **auth.spec.ts** | 5 | User registration, login, logout, error handling |
| **products.spec.ts** | 5 | Product browsing, search, category/brand filtering, reviews |
| **cart.spec.ts** | 1 | Add to cart, modify quantity, checkout flow |
| **checkout.spec.ts** | 4 | Full checkout workflows (pre/post login, guest, etc.) |
| **contact.spec.ts** | 1 | Contact form submission |
| **home.spec.ts** | 2 | Home page navigation, scrolling, subscription |
| **subscription.spec.ts** | 1 | Footer subscription |
| **TOTAL** | **19** | End-to-end user journeys |

## ⚙️ Configuration Files

### `playwright.config.ts`
Defines:
- Base URL, timeout settings
- Screenshot/video capture on failure
- Multiple browser configurations (Chromium, Firefox, WebKit)
- Custom test base that blocks analytics requests

### `tsconfig.json`
Enforces:
```json
{
  "compilerOptions": {
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

## 🔐 Best Practices

1. **Always create locators in `*Locators.ts`** — Never hardcode selectors in action or test files
2. **Encapsulate workflows in `*Actions.ts`** — Keep tests readable by abstracting complex interactions
3. **Use meaningful action method names** — `fillSignupForm()` not `fillForm()`
4. **Provide locator getters** — For test assertions: `getLoginHeader()` returns a locator
5. **No `page` parameter in tests** — If not using it directly, remove it
6. **Run linter before commits** — `npm run lint` must pass
7. **Keep tests focused** — One user journey per test case

## 🚀 Continuous Integration

To integrate into CI/CD:

```bash
# Install dependencies
npm install

# Install browsers
npx playwright install

# Run linter
npm run lint

# Run tests (headless by default in CI)
npm test
```

## 📚 Example: Adding a New Test

### Step 1: Create locators
**`pages/locators/FeatureLocators.ts`**
```typescript
export class FeatureLocators {
  readonly buttonElement: Locator;
  readonly resultMessage: Locator;
  
  constructor(page: Page) {
    this.buttonElement = page.locator('button[data-qa="feature-button"]');
    this.resultMessage = page.locator('.result-message');
  }
}
```

### Step 2: Create actions
**`pages/actions/FeatureActions.ts`**
```typescript
export class FeatureActions {
  readonly featureLocators: FeatureLocators;
  
  async clickButton() {
    await this.featureLocators.buttonElement.click();
  }
  
  getResultMessage() {
    return this.featureLocators.resultMessage;
  }
}
```

### Step 3: Write test
**`tests/feature.spec.ts`**
```typescript
test('Test Case: Feature works', async () => {
  const featureActions = new FeatureActions(page);
  await featureActions.clickButton();
  await expect(featureActions.getResultMessage()).toBeVisible();
});
```

## 🐛 Troubleshooting

### Tests fail with "Element not found"
- Check selectors in `*Locators.ts` are correct
- Verify application is running at the configured base URL
- Check for timing issues: add `waitFor()` in actions

### TypeScript errors on build
- Run `npm run lint` to see all type errors
- Ensure no unused variables: check error messages
- Verify imports are correct: `import { Type } from './path'`

### Linter complains about unused parameters
If a callback requires a parameter but you don't use it:
- Remove it: `async () =>` instead of `async ({ page }) =>`
- Or use it in the function body

## 📞 Support & Contributing

- **Questions?** Check the existing test files for examples
- **Found a bug?** Verify it's not a selector issue first
- **Adding features?** Follow the POM pattern strictly

---

**Last Updated:** August 2026  
**Framework:** Playwright + TypeScript  
**Pattern:** Page Object Model (POM) with Compiler Enforcement
