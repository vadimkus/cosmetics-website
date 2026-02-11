# Mobile API Type Definitions

## Shared Types Between Website and Mobile App

This document defines the API contract between the cosmetics website backend
and the mobile app. Both codebases should conform to these types.

### Website Reference
- Types: `lib/validation/schemas.ts` (Zod schemas)
- API Routes: `app/api/mobile/`

### Mobile App Reference
- Types: `types/api.ts`
- API Service: `services/api.js`, `services/databaseService.js`

---

## Authentication

### POST /api/mobile/auth/login
```json
Request:
{
  "email": "string",
  "password": "string"
}

Response:
{
  "success": true,
  "token": "string (JWT)",
  "user": {
    "id": "string",
    "email": "string",
    "name": "string",
    "phone": "string?",
    "profilePicture": "string?",
    "discount": "number (0-100)",
    "isAdmin": "boolean",
    "canSeePrices": "boolean"
  }
}
```

### POST /api/mobile/auth/register
```json
Request:
{
  "name": "string",
  "email": "string",
  "password": "string (min 8 chars)",
  "phone": "string?"
}
```

### POST /api/mobile/auth/google
```json
Request:
{
  "idToken": "string (Google ID Token)"
}
```

### POST /api/mobile/auth/apple
```json
Request:
{
  "identityToken": "string (Apple Identity Token)",
  "fullName": { "givenName": "string?", "familyName": "string?" }
}
```

### GET /api/mobile/auth/validate
```
Headers: Authorization: Bearer <token>
```

### POST /api/mobile/auth/refresh
```json
Headers: Authorization: Bearer <expired-token>

Response:
{
  "success": true,
  "token": "string (new JWT)",
  "user": { ... }
}
```

---

## Products

### GET /api/mobile/products
```json
Query: ?category=string&search=string&page=number&limit=number

Response:
{
  "success": true,
  "products": [
    {
      "id": "string",
      "name": "string",
      "nameAr": "string?",
      "nameRu": "string?",
      "price": "number",
      "compareAtPrice": "number?",
      "images": ["string"],
      "category": "string?",
      "inStock": "boolean",
      "variants": [...]
    }
  ]
}
```

### GET /api/mobile/products/:id
```json
Response:
{
  "success": true,
  "product": { ... full product with variants, reviews }
}
```

---

## Orders

### POST /api/mobile/orders
```json
Request:
{
  "items": [{ "productId": "string", "quantity": "number", "price": "number", ... }],
  "shippingAddress": { "name": "string", "phone": "string", ... },
  "paymentMethod": "cod | stripe | apple_pay",
  "notes": "string?",
  "promoCode": "string?"
}
```

### GET /api/mobile/user/orders
```
Headers: Authorization: Bearer <token>
```

---

## User Profile

### PUT /api/mobile/user/profile
### GET/POST/PUT/DELETE /api/mobile/user/addresses
### GET/POST/DELETE /api/mobile/user/wishlist

---

## Headers Required for All Mobile API Requests

| Header | Value | Required |
|--------|-------|----------|
| x-api-key | MOBILE_APP_KEY | Yes |
| Content-Type | application/json | Yes (for POST/PUT) |
| Authorization | Bearer <JWT> | For authenticated routes |
| x-user-id | User ID | Optional (for personalized pricing) |

---

## Error Response Format

```json
{
  "success": false,
  "error": "Human-readable error message"
}
```

HTTP Status Codes:
- 200: Success
- 400: Bad request (validation error)
- 401: Unauthorized (invalid API key or token)
- 404: Not found
- 429: Rate limited
- 500: Server error
