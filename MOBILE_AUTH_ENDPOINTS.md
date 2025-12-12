# Mobile Authentication Endpoints

## 🎯 Overview

Complete mobile authentication system integrated with your existing Prisma database and user management.

## 📋 API Endpoints

All endpoints require the `x-api-key` header with your `MOBILE_APP_KEY` environment variable.

### 1. 🔐 Login
**POST** `/api/mobile/auth/login`

**Headers:**
```
x-api-key: YOUR_MOBILE_APP_KEY
Content-Type: application/json
```

**Body:**
```json
{
  "email": "user@example.com",
  "password": "userpassword"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "User Name",
    "phone": "+971501234567",
    "address": "Dubai, UAE",
    "profilePicture": "https://...",
    "isAdmin": false,
    "canSeePrices": true,
    "discountType": "CLINIC",
    "discountPercentage": 10,
    "birthday": "1990-01-01",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "lastLoginAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Login successful"
}
```

### 2. 📝 Register
**POST** `/api/mobile/auth/register`

**Headers:**
```
x-api-key: YOUR_MOBILE_APP_KEY
Content-Type: application/json
```

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+971501234567",
  "address": "123 Main Street",
  "emirate": "Dubai",
  "birthday": "1990-01-01"
}
```

**Valid Emirates:**
- Dubai
- Abu Dhabi
- Sharjah
- Ajman
- Ras Al Khaimah
- Fujairah
- Umm Al Quwain

**Success Response (200):**
```json
{
  "success": true,
  "user": { /* user object */ },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Registration successful"
}
```

### 3. 🔍 Google OAuth
**POST** `/api/mobile/auth/google`

**Headers:**
```
x-api-key: YOUR_MOBILE_APP_KEY
Content-Type: application/json
```

**Body:**
```json
{
  "idToken": "google_id_token_from_mobile_app"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "user": { /* user object */ },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "isNewUser": true,
  "message": "Account created successfully"
}
```

### 4. ✅ Validate Token
**GET** `/api/mobile/auth/validate`

**Headers:**
```
x-api-key: YOUR_MOBILE_APP_KEY
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response (200):**
```json
{
  "success": true,
  "valid": true,
  "user": { /* fresh user data from database */ },
  "tokenInfo": {
    "userId": "user-id",
    "email": "user@example.com",
    "issuedAt": "2024-01-01T00:00:00.000Z",
    "expiresAt": "2024-01-31T00:00:00.000Z"
  },
  "message": "Token is valid"
}
```

### 5. 🚪 Logout
**POST** `/api/mobile/auth/logout`

**Headers:**
```
x-api-key: YOUR_MOBILE_APP_KEY
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (optional)
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Logout successful. Please remove the authentication token from your app.",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🔧 Environment Variables Required

Add these to your `.env.local`:

```bash
# Mobile App API Key (generate a secure random string)
MOBILE_APP_KEY=your-secure-api-key-here

# JWT Secret for token signing (generate a secure random string)
JWT_SECRET=your-jwt-secret-here

# Google OAuth (already configured)
GOOGLE_CLIENT_ID=590508205468-lom9rvmsm4058nkm4ivsk1g0k5j3sm8j.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## 🛡️ Security Features

1. **API Key Authentication**: All endpoints require valid API key
2. **Rate Limiting**: 
   - Login: 10 attempts per 15 minutes
   - Register: 5 attempts per hour
   - Google OAuth: 20 attempts per 15 minutes
3. **JWT Tokens**: 30-day expiration, signed and verified
4. **Password Security**: bcrypt hashing with salt rounds 12
5. **Input Validation**: Length limits and format validation
6. **Database Integration**: Real-time user validation

## 📱 Mobile App Integration

### Initial App Launch Flow:
1. Check if JWT token exists in secure storage
2. If exists, call `/api/mobile/auth/validate` to verify
3. If valid, user is logged in
4. If invalid/expired, redirect to login screen

### Login Flow:
1. User enters email/password or uses Google OAuth
2. Call appropriate auth endpoint
3. Store returned JWT token securely
4. Use token for authenticated requests

### Making Authenticated Requests:
```javascript
const headers = {
  'x-api-key': 'YOUR_MOBILE_APP_KEY',
  'Authorization': `Bearer ${userToken}`,
  'Content-Type': 'application/json'
}
```

## 🎯 Google OAuth Configuration

Your app should use these client IDs:

```javascript
const googleConfig = {
  expoClientId: '590508205468-lom9rvmsm4058nkm4ivsk1g0k5j3sm8j.apps.googleusercontent.com',
  iosClientId: '590508205468-7ek30vjj6o5k2jfpqpg3t6cr4bnu7rt5.apps.googleusercontent.com',
  androidClientId: '590508205468-vc262gtfqo5a94iifen6gqvlsr5h3to5.apps.googleusercontent.com',
  webClientId: '590508205468-lom9rvmsm4058nkm4ivsk1g0k5j3sm8j.apps.googleusercontent.com'
}
```

## ❌ Error Responses

All endpoints return consistent error format:

```json
{
  "success": false,
  "error": "Error message description"
}
```

**Common HTTP Status Codes:**
- `400` - Bad Request (missing/invalid data)
- `401` - Unauthorized (invalid credentials/token)
- `404` - Not Found (user doesn't exist)
- `429` - Too Many Requests (rate limited)
- `500` - Internal Server Error
- `503` - Service Unavailable (API key not configured)

## 🔍 Testing

Use tools like Postman or curl to test endpoints:

```bash
# Test login
curl -X POST https://www.genosys.ae/api/mobile/auth/login \
  -H "x-api-key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## 📊 Analytics Integration

All authentication actions are tracked in your analytics system:
- `mobile_user_registered` - New user registration
- `mobile_user_logout` - User logout

## 🎉 Ready to Use!

Your mobile authentication system is now fully integrated with:
- ✅ Existing user database
- ✅ Google OAuth credentials
- ✅ Email notifications
- ✅ Analytics tracking
- ✅ Admin notifications
- ✅ Security best practices
