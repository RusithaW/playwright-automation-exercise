# API Testing Guide

This document provides guidance on using the API testing layer in the Playwright automation framework.

## Overview

The API testing layer follows the same **Page Object Model (POM)** pattern as UI tests:
- **Endpoints** — Define API routes and base URLs (like Locators)
- **Services** — Encapsulate API interactions and assertions (like Actions)
- **Tests** — Orchestrate services and verify outcomes

## Architecture

### Layer 1: Endpoints (`pages/api/endpoints/*Endpoints.ts`)

Endpoints define the API structure, routes, and helper methods:

```typescript
export class AuthEndpoints {
    readonly baseURL = 'https://automationexercise.com/api';
    readonly loginEndpoint = `${this.baseURL}/auth/login`;
    readonly signupEndpoint = `${this.baseURL}/auth/signup`;
    
    constructor(request: APIRequestContext) {
        this.request = request;
    }
    
    getHeaders(authToken?: string) {
        // Returns common headers with optional auth token
    }
}
```

**Endpoints Available:**
- `AuthEndpoints` — Authentication routes (login, signup, logout)
- `ProductEndpoints` — Product listing and search
- `CartEndpoints` — Cart management
- `OrderEndpoints` — Order creation and management
- `UserEndpoints` — User profile and address management

### Layer 2: Services (`pages/api/services/*Service.ts`)

Services wrap API calls with built-in validation and error handling:

```typescript
export class AuthService {
    constructor(request: APIRequestContext) {
        this.authEndpoints = new AuthEndpoints(request);
    }
    
    async loginUser(email: string, password: string) {
        const response = await this.authEndpoints.request.post(
            this.authEndpoints.loginEndpoint,
            { data: { email, password } }
        );
        
        expect(response.status()).toBe(200);
        return await response.json();
    }
}
```

**Services Available:**
- `AuthService` — Handle authentication workflows
- `ProductService` — Query and manage products
- `CartService` — Manage shopping cart
- `OrderService` — Create and manage orders
- `UserService` — Manage user profile and addresses

### Layer 3: Tests (`tests/api/*.api.spec.ts`)

Tests orchestrate services to validate API behavior:

```typescript
test('POST /api/auth/login - Login with valid credentials', async () => {
    const response = await authService.loginUser(email, password);
    
    expect(response.responseCode).toBe(200);
    expect(response.token).toBeDefined();
});
```

## Running API Tests

### Run All API Tests
```bash
npm run test:api
```

### Run Specific API Test File
```bash
npx playwright test tests/api/auth.api.spec.ts
```

### Run Specific Test
```bash
npx playwright test tests/api/auth.api.spec.ts -g "login with valid credentials"
```

### Run API Tests with Detailed Output
```bash
npx playwright test tests/api --reporter=verbose
```

### Run API Tests and Show Report
```bash
npm run test:api && npm run report
```

## Available Test Suites

### 1. **Auth API Tests** (`tests/api/auth.api.spec.ts`)
Test authentication workflows:
- User signup
- User login
- User logout
- Delete account
- Refresh token
- Email verification

**Usage Example:**
```typescript
const authService = new AuthService(request);

// Signup
const signupResponse = await authService.signupUser(
    'user@example.com',
    'User Name',
    'password123'
);

// Login
const loginResponse = await authService.loginUser(
    'user@example.com',
    'password123'
);
const authToken = loginResponse.token;

// Logout
await authService.logoutUser(authToken);
```

### 2. **Product API Tests** (`tests/api/products.api.spec.ts`)
Test product operations:
- List all products
- Search products
- Filter by category
- Filter by brand
- Get product details
- Admin: Create/Update/Delete products

**Usage Example:**
```typescript
const productService = new ProductService(request);

// Get all products
const allProducts = await productService.getAllProducts();

// Search products
const searchResults = await productService.searchProducts('Blue Top');

// Filter by category
const womenProducts = await productService.getProductsByCategory(1);

// Get specific product
const product = await productService.getProductById(1);
```

### 3. **Cart API Tests** (`tests/api/cart.api.spec.ts`)
Test cart operations:
- Add to cart
- Get cart
- Update quantity
- Remove from cart
- Clear cart

**Usage Example:**
```typescript
const cartService = new CartService(request);

// Add product to cart
await cartService.addToCart(productId, 2, authToken);

// Get cart
const cart = await cartService.getCart(authToken);

// Check if product in cart
const isInCart = await cartService.isProductInCart(productId, authToken);

// Update quantity
await cartService.updateCartItem(productId, 5, authToken);

// Remove from cart
await cartService.removeFromCart(productId, authToken);

// Clear entire cart
await cartService.clearCart(authToken);
```

### 4. **Order API Tests** (`tests/api/orders.api.spec.ts`)
Test order operations:
- Create order
- Get order details
- Get user orders
- Update order
- Cancel order

**Usage Example:**
```typescript
const orderService = new OrderService(request);

// Create order
const orderData = {
    product_ids: [1, 2],
    quantities: [1, 2],
    payment_method: 'Credit Card'
};
const createResponse = await orderService.createOrder(orderData, authToken);

// Get order
const order = await orderService.getOrderById(orderId, authToken);

// Get all user orders
const userOrders = await orderService.getUserOrders(authToken);

// Cancel order
await orderService.cancelOrder(orderId, authToken);
```

### 5. **User API Tests** (`tests/api/users.api.spec.ts`)
Test user profile operations:
- Get user profile
- Update user profile
- Manage addresses (add, update, delete)

**Usage Example:**
```typescript
const userService = new UserService(request);

// Get profile
const profile = await userService.getUserProfile(authToken);

// Update profile
const updated = await userService.updateUserProfile(
    { name: 'New Name', phone: '1234567890' },
    authToken
);

// Add address
const addressResponse = await userService.addUserAddress(
    {
        firstname: 'John',
        lastname: 'Doe',
        address1: '123 Main St',
        city: 'Los Angeles',
        state: 'California',
        zipcode: '90001',
        country: 'United States'
    },
    authToken
);

// Get addresses
const addresses = await userService.getUserAddresses(authToken);

// Update address
await userService.updateUserAddress(
    addressId,
    { firstname: 'Jane' },
    authToken
);

// Delete address
await userService.deleteUserAddress(addressId, authToken);
```

## Best Practices for API Testing

### 1. **Reuse Authentication**
Store auth token and pass to subsequent requests:
```typescript
const loginResponse = await authService.loginUser(email, password);
const authToken = loginResponse.token;

// Use token in other services
const cart = await cartService.getCart(authToken);
```

### 2. **Cleanup Test Data**
Delete test data after tests via API:
```typescript
test.afterEach(async () => {
    if (createdOrderId) {
        await orderService.cancelOrder(createdOrderId, authToken);
    }
});
```

### 3. **Use Unique Test Data**
Generate unique values for tests:
```typescript
const uniqueEmail = `api_user_${Date.now()}@example.com`;
const signupResponse = await authService.signupUser(
    uniqueEmail,
    'Test User',
    'password123'
);
```

### 4. **Verify Response Structure**
Check that responses contain expected fields:
```typescript
const product = await productService.getProductById(1);

expect(product.id).toBeDefined();
expect(product.name).toBeDefined();
expect(product.price).toBeDefined();
expect(typeof product.price).toBe('number');
```

### 5. **Test Error Cases**
Verify API properly handles invalid inputs:
```typescript
const response = await productService.productEndpoints.request.get(
    `${productService.productEndpoints.getProductEndpoint}/99999`
);

expect(response.status()).toBe(404);
```

## Hybrid Testing: API + UI

Test complete workflows using both API and UI:

```typescript
test('Create order via API, verify in UI', async ({ page }) => {
    // Step 1: Setup via API
    const authResponse = await authService.loginUser(email, password);
    const authToken = authResponse.token;
    
    const orderData = { product_ids: [1], quantities: [1] };
    const orderResponse = await orderService.createOrder(orderData, authToken);
    const orderId = orderResponse.order_id;
    
    // Step 2: Verify in UI
    await page.goto('/orders');
    await expect(page.locator(`[data-order-id="${orderId}"]`)).toBeVisible();
    
    // Step 3: Verify status via API
    const order = await orderService.getOrderById(orderId, authToken);
    expect(order.status).toBe('Pending');
});
```

## Troubleshooting

### Authentication Failures
Ensure credentials are valid:
```typescript
const response = await authService.loginUser(email, password);

if (!response.token) {
    console.error('Login failed:', response.message);
}
```

### Endpoint Not Found (404)
Verify endpoints are correct in `*Endpoints.ts`:
```typescript
// Check endpoint URL is correct
console.log(authService.authEndpoints.loginEndpoint);
```

### Assertion Failures
Add detailed error messages:
```typescript
expect(response.status()).toBe(200, `Expected 200 but got ${response.status()}: ${response.statusText()}`);
```

### Timeout Errors
Increase timeout for slow APIs:
```typescript
test('Slow API call', async () => {
    // Test takes longer - allow 90 seconds
}, { timeout: 90000 });
```

## Environment Configuration

Create `.env` file in project root:
```
BASE_URL=https://automationexercise.com
API_BASE_URL=https://automationexercise.com/api
TEST_EMAIL=your-test-email@example.com
TEST_PASSWORD=your-test-password
```

Or copy `.env.example`:
```bash
cp .env.example .env
```

## Performance Tips

1. **Run API tests in parallel** — No UI, so safe to parallelize
2. **Reuse auth tokens** — Don't login for every test
3. **Use fixtures** — Store common test data in files
4. **Mock external APIs** — Use Playwright route interception if needed

## Integration with CI/CD

### GitHub Actions Example
```yaml
- name: Run API Tests
  run: npm run test:api

- name: Run UI Tests
  run: npm run test:ui

- name: Upload Report
  uses: actions/upload-artifact@v3
  if: always()
  with:
    name: test-report
    path: playwright-report/
```

---

**For more information:** See main [README.md](../README.md)
