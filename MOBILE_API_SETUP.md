# 📱 Mobile API Setup Guide

## ✅ Endpoint Created
Your secure mobile API endpoint is ready at: `app/api/mobile/products/route.ts`

## 🔧 Required Configuration

### 1. Add Environment Variable
Add this to your `.env.local` file:

```env
# Mobile App API Key - Generate a secure random key
MOBILE_APP_KEY=your-secure-mobile-api-key-here
```

**Generate a secure key:**
```bash
# Option 1: Using openssl (recommended)
openssl rand -base64 32

# Option 2: Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Option 3: Manual format
mob_sk_prod_[32_random_chars]
```

### 2. Restart Development Server
After adding the environment variable:
```bash
npm run dev
```

## 🧪 Testing the API

### Authentication Required
The API requires the `x-api-key` header:

```bash
curl -H "x-api-key: your-mobile-api-key" \
     http://localhost:3000/api/mobile/products
```

### Expected Response Format
```json
{
  "success": true,
  "data": [
    {
      "id": "clxxxxx",
      "name": "GENOSYS Product Name",
      "price": 150.00,
      "description": "Product description...",
      "image": "/images/product.jpg",
      "category": "skincare",
      "stock": true,
      "rating": 5.0,
      "size": "50ml"
    }
  ],
  "meta": {
    "count": 15,
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

### Error Responses

**401 - Unauthorized (Missing/Invalid Key):**
```json
{
  "success": false,
  "error": "Unauthorized - Invalid or missing API key"
}
```

**500 - Server Error:**
```json
{
  "success": false,
  "error": "Internal server error - Unable to fetch products"
}
```

**405 - Method Not Allowed (POST, PUT, DELETE):**
```json
{
  "success": false,
  "error": "Method not allowed"
}
```

## 🔒 Security Features

✅ **API Key Authentication**: Validates `x-api-key` header  
✅ **Environment Variable**: Secure key storage  
✅ **Hidden Products**: Excludes `isHidden: true` products  
✅ **Error Handling**: Generic error messages (no DB details leaked)  
✅ **Logging**: Comprehensive security and performance logging  
✅ **Method Restrictions**: Only GET requests allowed  

## 📱 Mobile Integration

### Android (Kotlin/Java)
```kotlin
val client = OkHttpClient()
val request = Request.Builder()
    .url("https://yourdomain.com/api/mobile/products")
    .addHeader("x-api-key", "your-mobile-api-key")
    .build()

client.newCall(request).enqueue(callback)
```

### iOS (Swift)
```swift
var request = URLRequest(url: URL(string: "https://yourdomain.com/api/mobile/products")!)
request.setValue("your-mobile-api-key", forHTTPHeaderField: "x-api-key")

URLSession.shared.dataTask(with: request) { data, response, error in
    // Handle response
}.resume()
```

### React Native
```javascript
fetch('https://yourdomain.com/api/mobile/products', {
  headers: {
    'x-api-key': 'your-mobile-api-key'
  }
})
.then(response => response.json())
.then(data => console.log(data));
```

## 🚀 Production Deployment

1. **Set Environment Variable** in your hosting platform:
   - Vercel: Project Settings → Environment Variables
   - Netlify: Site Settings → Environment Variables
   - AWS/Digital Ocean: Configure in deployment settings

2. **Update Mobile App** with production domain:
   ```
   https://genosys.ae/api/mobile/products
   ```

3. **Verify Security**: Test that requests without API key return 401

## 📊 Field Mapping

| Mobile JSON Key | Database Field | Type | Description |
|-----------------|----------------|------|-------------|
| `id` | `id` | String | Product ID (cuid) |
| `name` | `name` | String | Product name |
| `price` | `price` | Float | Price in AED |
| `description` | `description` | String | Product description |
| `image` | `image` | String | Main product image URL |
| `category` | `category` | String | Product category |
| `stock` | `inStock` | Boolean | Stock availability |
| `rating` | `rating` | Float | Product rating (1-5) |
| `size` | `size` | String | Product size (bonus field) |

## 🔧 Troubleshooting

### API Key Issues
- **Problem**: 401 Unauthorized
- **Solutions**: 
  - Check environment variable is set
  - Restart server after adding env var
  - Verify header name is exactly `x-api-key`

### Database Issues  
- **Problem**: 500 Server Error
- **Solutions**:
  - Check DATABASE_URL is configured
  - Verify Prisma client is generated: `npx prisma generate`
  - Check database connection: `npx prisma db push`

### No Products Returned
- **Problem**: Empty data array
- **Solutions**:
  - Check if products exist in database
  - Verify `isHidden: false` (hidden products excluded)
  - Check database connection

Need help? Check the server logs for detailed error messages with timestamps and performance metrics.# Mobile API Deployment
