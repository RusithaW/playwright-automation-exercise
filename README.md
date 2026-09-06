# Playwright Automation Exercise

A Playwright and TypeScript automation framework for testing
[AutomationExercise.com](https://automationexercise.com).

The framework contains:

- UI end-to-end tests
- API tests
- Typed Playwright fixtures
- Page Object Model classes
- API service and endpoint layers
- Dynamic test-data generation
- HTML, JUnit, screenshot, video, and trace reporting

## Tech Stack

- Playwright Test
- TypeScript
- Faker.js
- Node.js
- GitHub Actions

## Project Structure

```text
playwright-automation-exercise/
├── api/
│   ├── endpoints/              # API route definitions
│   └── services/               # API request services
│
├── data/
│   ├── `dummy_upload_file.txt`   # Contact form upload fixture
│   ├── `userData.json`           # Default test-data values
│   └── `userFactory.ts`          # Dynamic UI/API user generation
│
├── fixtures/
│   ├── `apiFixtures.ts`          # API test fixtures
│   └── `uiFixtures.ts`           # UI page-object fixtures
│
├── pages/
│   ├── components/
│   │   └── `NavbarComponent.ts`  # Shared navigation component
│   ├── `AuthPage.ts`             # Login and registration
│   ├── `CartPage.ts`             # Shopping cart
│   ├── `CheckoutPage.ts`         # Checkout and payment
│   ├── `ContactUsPage.ts`        # Contact form
│   ├── `HomePage.ts`             # Home page and subscription
│   └── `ProductPage.ts`          # Products, search, filters, and reviews
│
├── tests/
│   ├── api/                    # API specifications
│   └── ui/                     # UI specifications
│
├── .github/workflows/
│   └── `playwright.yml`          # GitHub Actions workflow
│
├── `playwright.config.ts`        # Playwright configuration
├── `tsconfig.json`               # TypeScript configuration
├── `package.json`                # Scripts and dependencies
└── `README.md`
```

## Architecture

### UI Tests

```text
UI Test
  ↓
UI Fixture
  ↓
Page Object or Shared Component
  ↓
Playwright Locators and Actions
  ↓
Application UI
```

The UI fixture creates a fresh page object for each test:

```typescript
test('login user', async ({ authPage, navbarComponent }) => {
    await authPage.loginUser(email, password);
    await expect(navbarComponent.loggedInAsUser).toBeVisible();
});
```

Tests should contain:

- Business scenario orchestration
- Meaningful assertions
- Test-specific data

Page objects should contain:

- Locators
- Navigation
- Reusable UI interactions
- Reusable page workflows

Selectors should remain inside page objects wherever practical.

### API Tests

> Full endpoint-by-endpoint reference: [docs/api-reference.md](docs/api-reference.md)

```text
API Test
  ↓
API Fixture
  ↓
API Service
  ↓
Endpoint Definition
  ↓
Playwright APIRequestContext
  ↓
Application API
```

API services encapsulate request construction while tests validate:

- HTTP status codes
- Application response codes
- Response messages
- Business data

## Test Coverage

The repository currently contains:

| Area     | Test Count |
|----------|------------|
| UI tests |     25     |
| API tests|     15     |
| Total    |     40     |

### UI Coverage

- User registration
- Login with valid credentials
- Login with invalid credentials
- Logout
- Duplicate email registration
- Contact form submission
- Product search
- Product details
- Product quantity
- Category filtering
- Brand filtering
- Cart operations
- Checkout registration
- Checkout login
- Payment
- Address verification
- Invoice download
- Product reviews
- Newsletter subscription
- Scroll behavior

### API Coverage

- Get products
- Unsupported product method
- Get brands
- Unsupported brand method
- Search products
- Invalid product search
- Login verification
- Missing login parameters
- Invalid login credentials
- User creation
- User lookup
- User update
- User deletion

## Requirements

Recommended runtime versions:

- Node.js 20.19 or newer
- npm 10 or newer

Install dependencies:

```bash
npm ci
```

Install Playwright browsers:

```bash
npx playwright install
```

For Ubuntu-based CI environments:

```bash
npx playwright install --with-deps
```

## Environment Configuration

Create a local `.env` file:

```env
UI_BASE_URL=https://automationexercise.com
API_BASE_URL=https://automationexercise.com/api
TEST_EMAIL=your-test-user@example.com
TEST_USER_PASSWORD=your-test-user-password
TEST_PASSWORD=FallbackPass123!
```

Do not commit `.env`.

Use `.env.example` as the configuration template.

## Running Tests

Run all tests:

```bash
npm test
```

Run UI tests:

```bash
npm run test:ui
```

Run API tests:

```bash
npm run test:api
```

Run the UI suite in headed mode:

```bash
npm run test:headed
```

List UI tests without executing them:

```bash
npm run test:ui -- --list
```

List API tests without executing them:

```bash
npm run test:api -- --list
```

Run one test file:

```bash
npx playwright test `auth.spec.ts`
```

Run tests matching a title:

```bash
npx playwright test -g "Register User"
```

Run tests with Playwright UI mode:

```bash
npx playwright test --ui
```

## TypeScript Validation

Run the TypeScript validation command:

```bash
npm run lint
```

The project uses strict TypeScript settings, including:

- `strict`
- `noUnusedLocals`
- `noUnusedParameters`
- `noEmit`

## Reports and Debugging

The project generates:

- HTML reports
- JUnit XML reports
- Screenshots on failure
- Videos on failure
- Traces on the first retry

View the HTML report:

```bash
npm run report
```

Generated reports should not be committed to Git.

## Playwright Configuration

The project defines two Playwright projects:

| Project     | Test Directory | Purpose                |
|-------------|----------------|------------------------|
| `ui-chrome` | `tests/ui`     | Browser-based UI tests |
| `api`       | `tests/api`    | API tests              |

The configuration also defines:

- Shared timeouts
- Navigation timeout
- Action timeout
- Retry behavior in CI
- HTML and JUnit reporters
- Failure screenshots
- Failure videos
- Retry traces
- `data-qa` as the test ID attribute

## CI

GitHub Actions runs the test suite on:

- Pushes to `main`
- Pull requests targeting `main`

The workflow:

1. Checks out the repository
2. Installs Node.js
3. Installs dependencies with `npm ci`
4. Installs Playwright browsers
5. Runs the test suite
6. Uploads reports and failure artifacts

## Test Data

User accounts are generated dynamically with Faker.js.

Dynamic data helps reduce collisions during parallel execution. Test data should remain isolated per test and should not depend on a pre-existing shared account unless the scenario specifically requires it.

Sensitive values should be provided through environment variables rather than committed source files.

## Design Principles

This project follows these principles:

- Tests express business behavior.
- Page objects own UI selectors and interactions.
- API services own request construction.
- Endpoint definitions centralize API routes.
- Fixtures provide reusable test dependencies.
- Assertions remain close to the business scenario.
- Tests should avoid fixed waits.
- Tests should wait for application state rather than elapsed time.
- Test cleanup should be attempted for created external data.
- Selectors should prefer semantic or stable test-specific locators.
- New abstractions should be introduced only when they reduce duplication or coupling.

## Known Limitations

This project tests a publicly hosted external application. Test results can therefore be affected by:

- Network availability
- External application downtime
- Changes to the website
- Shared remote application state
- Third-party resources
- Account creation or cleanup failures

The test suite is intended for demonstration and portfolio purposes rather than production application certification.