# API Testing Implementation - Real Endpoints

This document outlines the API testing layer now configured for the actual [automationexercise.com](https://automationexercise.com) API endpoints.

## Overview

The API testing layer follows the **Page Object Model (POM)** pattern with three layers:
- **Endpoints** — Define API routes and base URLs
- **Services** — Encapsulate API interactions with built-in assertions
- **Tests** — Orchestrate services and verify outcomes

## API Endpoints Documentation

All endpoints are documented at: https://automationexercise.com/api_list

### Base URL
```
https://automationexercise.com/api
```

## Supported APIs (14 Test Cases)

### Products & Brands

#### API 1: Get All Products List
```
GET /api/productsList
Response Code: 200
Returns: All products list
```

#### API 2: POST To All Products List
```
POST /api/productsList
Response Code: 405
Response: "This request method is not supported."
```

#### API 3: Get All Brands List
```
GET /api/brandsList
Response Code: 200
Returns: All brands list
```

#### API 4: PUT To All Brands List
```
PUT /api/brandsList
Response Code: 405
Response: "This request method is not supported."
```

### Search Products

#### API 5: POST To Search Product
```
POST /api/searchProduct
Request Parameters: search_product (e.g., 'top', 'tshirt', 'jean')
Response Code: 200
Returns: Searched products list
```

#### API 6: POST To Search Product Without Parameter
```
POST /api/searchProduct
(Missing search_product parameter)
Response Code: 400
Response: "Bad request, search_product parameter is missing in POST request."
```

### Authentication - Verify Login

#### API 7: POST To Verify Login With Valid Details
```
POST /api/verifyLogin
Request Parameters: email, password
Response Code: 200
Response: "User exists!"
```

#### API 8: POST To Verify Login Without Email Parameter
```
POST /api/verifyLogin
Request Parameter: password only
Response Code: 400
Response: "Bad request, email or password parameter is missing in POST request."
```

#### API 9: DELETE To Verify Login
```
DELETE /api/verifyLogin
Response Code: 405
Response: "This request method is not supported."
```

#### API 10: POST To Verify Login With Invalid Details
```
POST /api/verifyLogin
Request Parameters: email, password (invalid values)
Response Code: 404
Response: "User not found!"
```

### User Account Management

#### API 11: POST To Create/Register User Account
```
POST /api/createAccount
Response Code: 201
Request Parameters:
  - name
  - email
  - password
  - title (e.g., Mr, Mrs, Miss)
  - birth_date, birth_month, birth_year
  - firstname, lastname
  - company
  - address1, address2
  - country, zipcode, state, city
  - mobile_number
Response: "User created!"
```

#### API 12: DELETE To Delete User Account
```
DELETE /api/deleteAccount
Request Parameters: email, password
Response Code: 200
Response: "Account deleted!"
```

#### API 13: PUT To Update User Account
```
PUT /api/updateAccount
Request Parameters: (same as create account)
Response Code: 200
Response: "User updated!"
```

#### API 14: GET User Account Details By Email
```
GET /api/getUserDetailByEmail
Request Parameters: email
Response Code: 200
Returns: User details
```

## Running API Tests

### Run All API Tests
```bash
npm run test:api
```

### Run Specific API Test Suite
```bash
npx playwright test tests/api/auth.api.spec.ts
npx playwright test tests/api/products.api.spec.ts
```

### Run with Detailed Output
```bash
npx playwright test tests/api --reporter=verbose
```

### View Test Report
```bash
npm run test:api && npm run report
```

## Test Structure

### Product & Brand Tests (`tests/api/products.api.spec.ts`)
- 12 test cases covering Products, Brands, and Search functionality
- Tests for valid operations and error handling
- Validates response structure and required fields

### Auth Tests (`tests/api/auth.api.spec.ts`)
- 11 test cases covering login verification, account creation, deletion, and updates
- Tests for valid credentials, invalid credentials, and missing parameters
- Validates error responses (400, 404, 405 codes)

**Total: 23 API test cases**

## Service Classes

### ProductService
```typescript
async getAllProducts()                    // GET /api/productsList
async attemptPostToProductsList()         // POST /api/productsList (405 error)
async searchProducts(searchTerm)          // POST /api/searchProduct
async attemptSearchWithoutParameter()     // POST /api/searchProduct (400 error)
```

### BrandService
```typescript
async getAllBrands()                      // GET /api/brandsList
async attemptUpdateBrands()               // PUT /api/brandsList (405 error)
```

### AuthService
```typescript
async verifyLogin(email, password)                           // POST /api/verifyLogin
async attemptVerifyLoginWithoutEmail(password)              // POST /api/verifyLogin (400 error)
async attemptDeleteVerifyLogin()                            // DELETE /api/verifyLogin (405 error)
async attemptVerifyLoginInvalid(email, password)            // POST /api/verifyLogin (404 error)
async createAccount(accountData)                            // POST /api/createAccount
async deleteAccount(email, password)                        // DELETE /api/deleteAccount
async updateAccount(accountData)                            // PUT /api/updateAccount
async getUserDetailByEmail(email)                           // GET /api/getUserDetailByEmail
```

## Example Usage

### Search Products
```typescript
import { ProductService } from '../api/services/ProductService';

const productService = new ProductService(request);
const results = await productService.searchProducts('tshirt');

console.log(results.products); // Array of tshirt products
```

### Create User Account
```typescript
import { AuthService } from '../api/services/AuthService';

const authService = new AuthService(request);
const response = await authService.createAccount({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'SecurePass123!',
    firstname: 'John',
    lastname: 'Doe',
    address1: '123 Main St',
    country: 'United States',
    state: 'CA',
    city: 'Los Angeles',
    zipcode: '90001'
});
```

### Verify User Login
```typescript
const authService = new AuthService(request);

// Valid credentials
const response = await authService.verifyLogin('john@example.com', 'SecurePass123!');
console.log(response.message); // "User exists!"

// Invalid credentials
const invalidResponse = await authService.attemptVerifyLoginInvalid(
    'john@example.com',
    'WrongPassword'
);
console.log(invalidResponse.message); // "User not found!"
```

## Project Structure

```
pages/api/
├── endpoints/
│   ├── ProductEndpoints.ts      # Product & Brand API routes
│   └── AuthEndpoints.ts         # Auth API routes
├── services/
│   ├── ProductService.ts        # Product operations
│   ├── BrandService.ts          # Brand operations
│   └── AuthService.ts           # Auth operations

tests/api/
├── products.api.spec.ts         # Product & Brand test cases (12 tests)
└── auth.api.spec.ts             # Auth test cases (11 tests)
```

## Error Handling

All service methods include built-in `expect()` assertions that validate response codes before processing. If an API returns an unexpected status code, the test will fail with clear error messages.

### Response Code Reference
- **200** — Success (GET, DELETE, PUT operations)
- **201** — Created (POST operations for new resources)
- **400** — Bad Request (missing parameters)
- **404** — Not Found (invalid credentials, non-existent resources)
- **405** — Method Not Allowed (unsupported HTTP methods)

## Best Practices

1. **Use Unique Test Data** — Generate unique emails for account creation tests:
   ```typescript
   const email = `test_${Date.now()}@example.com`;
   ```

2. **Validate Response Structure** — Always check that responses contain expected fields:
   ```typescript
   const response = await authService.getUserDetailByEmail(email);
   expect(response.user.email).toBeDefined();
   expect(response.user.name).toBeDefined();
   ```

3. **Test Error Cases** — Verify proper error handling:
   ```typescript
   const response = await authService.attemptVerifyLoginInvalid('bad@email.com', 'wrong');
   expect(response.message).toBe('User not found!');
   ```

4. **Cleanup Test Data** — Delete test accounts after creation:
   ```typescript
   test.afterEach(async () => {
       if (testEmail) {
           await authService.deleteAccount(testEmail, testPassword);
       }
   });
   ```

## Troubleshooting

### Network Errors
If you see `getaddrinfo ENOTFOUND automationexercise.com`:
- Verify your internet connection
- Check if the website is accessible in your browser
- Run tests locally (not in sandboxed environments)

### 404 Responses
- Verify endpoint paths are correct (use exact paths from documentation)
- Check request parameters match API requirements
- Ensure email addresses are valid for user operations

### 400/405 Responses
- These are expected for error case tests
- Verify error message content matches specification

---
**For more details:** See the main [README.md](../README.md) for architecture and coverage overview.