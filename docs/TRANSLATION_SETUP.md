# 🌍 Translation Setup Guide

This guide explains how to set up automatic translation for product descriptions using Google Translate API.

## 📋 Prerequisites

1. **Google Cloud Account** with billing enabled
2. **Translation API** enabled in Google Cloud Console
3. **API Key** or **Service Account** credentials

## 🔑 Setup Methods

### Method 1: API Key (Recommended for Development)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable the **Translation API**
3. Create an **API Key** in Credentials section
4. Add to your `.env` file:

```bash
# Google Translate API Key
GOOGLE_TRANSLATE_API_KEY=your-api-key-here
```

### Method 2: Service Account (Recommended for Production)

1. Create a **Service Account** in Google Cloud Console
2. Download the **JSON credentials file**
3. Add to your `.env` file:

```bash
# Google Cloud Service Account Credentials
GOOGLE_APPLICATION_CREDENTIALS=/path/to/your/service-account.json
```

## 🚀 Usage

### Run Translation Script

```bash
# Using npm script
npm run translate:products

# Or using npx directly
npx tsx scripts/translate-products-to-russian.ts
```

### Expected Output

```bash
🚀 Starting Russian product translation process...
📋 Fetching all products from database...
📦 Found 50 products to translate

[1/50] 🔄 Translating product 1: GENOSYS Dermal Roller
   📝 Translating description (234 chars)...
   📋 Translating productDetails (JSON)...
   ✅ Successfully translated product 1

[2/50] 🔄 Translating product 2: EGF Serum
   📝 Translating description (189 chars)...
   💎 Translating benefits (JSON)...
   ✅ Successfully translated product 2

...

🎉 ===== TRANSLATION COMPLETE =====
📁 File: /path/to/data/productTranslationsRu.ts
📊 Total products: 50
✅ Successfully translated: 48
⏭️  Skipped (no content): 1
❌ Errors: 1
⏱️  Total time: 45.67 seconds
```

## 📂 Generated Files

The script creates: `data/productTranslationsRu.ts`

This file contains:
- **TypeScript interfaces** for translations
- **Translation data** for all products
- **Helper functions** to retrieve translations
- **Metadata** about the translation process

### Usage in Code

```typescript
import { 
  getProductTranslationRu, 
  getProductTranslationsRu,
  getTranslationStats
} from '@/data/productTranslationsRu'

// Get specific field translation
const russianDescription = getProductTranslationRu('1', 'description')

// Get all translations for a product
const allTranslations = getProductTranslationsRu('1')

// Get translation statistics
const stats = getTranslationStats()
console.log(`Generated ${stats.translatedProducts} translations`)
```

## ⚡ Performance Features

### Rate Limiting
- **10 requests/second** maximum (configurable)
- **100ms delay** between requests (configurable)
- **Exponential backoff** on failures

### Caching
- **In-memory cache** prevents duplicate translations
- **Cache persistence** for session duration
- **Automatic cache size reporting**

### Error Handling
- **3 retry attempts** with exponential backoff
- **Fallback translations** when API unavailable
- **Detailed error logging** and progress tracking

## 🔧 Configuration

Edit `TRANSLATION_CONFIG` in the script:

```typescript
const TRANSLATION_CONFIG = {
  maxRequestsPerSecond: 10,    // API rate limit
  delayBetweenRequests: 100,   // Delay in milliseconds
  maxRetries: 3,               // Retry failed requests
  useCache: true               // Enable translation cache
}
```

## 💡 Fallback Mode

If no API credentials are provided, the script uses **fallback translation**:

- **Keyword replacement** for common cosmetics terms
- **Prefix indication**: `[ПЕРЕВОД]` marks fallback translations
- **Basic term mapping** for skincare vocabulary
- **No API costs** but limited translation quality

## 🛡️ Security Notes

- **Never commit** API keys to version control
- **Use service accounts** in production environments
- **Rotate API keys** regularly
- **Monitor API usage** in Google Cloud Console

## 📊 Cost Estimation

**Google Translate API Pricing** (as of 2024):
- **$20 per 1M characters** translated
- **Average product**: ~500 characters total
- **50 products**: ~25,000 characters ≈ **$0.50**

## 🐛 Troubleshooting

### Common Issues

1. **API Key Invalid**
   ```
   Error: API key is invalid
   ```
   - Verify API key in Google Cloud Console
   - Check Translation API is enabled

2. **Quota Exceeded**
   ```
   Error: Quota exceeded
   ```
   - Check API quotas in Google Cloud Console
   - Reduce `maxRequestsPerSecond` in config

3. **Network Errors**
   ```
   Translation attempt failed: Network timeout
   ```
   - Script will automatically retry with backoff
   - Check internet connection

### Debug Mode

Set environment variable for detailed logging:
```bash
DEBUG=true npx tsx scripts/translate-products-to-russian.ts
```

## 🔄 Integration with Existing Products

After running the translation script, update your product display components to use the Russian translations:

1. Import the translation functions
2. Check for Russian translations before fallback
3. Use `getProductTranslationRu()` in your product components

Example integration coming in future updates!