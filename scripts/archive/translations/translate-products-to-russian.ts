import { PrismaClient } from '@prisma/client'
import { Translate } from '@google-cloud/translate/build/src/v2'
import * as fs from 'fs'
import * as path from 'path'
import { debugLog, errorLog, warnLog } from '../lib/logger'

const prisma = new PrismaClient()

/**
 * Translate products from database to Russian
 * This script will:
 * 1. Fetch all products from the database
 * 2. Generate Russian translations for each product
 * 3. Create/update productTranslationsRu.ts file
 */

interface ProductTranslation {
  description?: string
  productDetails?: string
  keyFeatures?: string | null
  benefits?: string
  ingredients?: string | null
  howToUse?: string
  directions?: string
}

// Translation configuration
const TRANSLATION_CONFIG = {
  // Rate limiting: max requests per second
  maxRequestsPerSecond: 10,
  // Delay between requests (ms)
  delayBetweenRequests: 100,
  // Maximum retries for failed requests
  maxRetries: 3,
  // Cache translations to avoid re-translating
  useCache: true
}

// Translation cache to avoid duplicate API calls
const translationCache = new Map<string, string>()

// Initialize Google Translate API
let translate: Translate | null = null

function initializeGoogleTranslate(): Translate {
  if (!translate) {
    // Google Cloud Translate API can be initialized with:
    // 1. Service account key file (GOOGLE_APPLICATION_CREDENTIALS env var)
    // 2. API key (GOOGLE_TRANSLATE_API_KEY env var)
    // 3. Default credentials (if running on Google Cloud)
    
    const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY
    
    if (apiKey) {
      debugLog('🔧 Initializing Google Translate with API key')
      translate = new Translate({ key: apiKey })
    } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      debugLog('🔧 Initializing Google Translate with service account credentials')
      translate = new Translate()
    } else {
      warnLog('⚠️ No Google Translate credentials found. Using fallback translation.')
      warnLog('   Set GOOGLE_TRANSLATE_API_KEY or GOOGLE_APPLICATION_CREDENTIALS environment variable')
      return null as any
    }
  }
  
  return translate
}

// Helper function to add delay between requests
async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Helper function to translate text using Google Translate API
async function translateToRussian(text: string): Promise<string> {
  if (!text || text.trim() === '') {
    return text
  }
  
  // Check cache first
  const cacheKey = text.toLowerCase().trim()
  if (TRANSLATION_CONFIG.useCache && translationCache.has(cacheKey)) {
    debugLog(`📋 Using cached translation for: "${text.substring(0, 30)}..."`)
    return translationCache.get(cacheKey)!
  }
  
  const translateAPI = initializeGoogleTranslate()
  
  // Fallback if no API credentials
  if (!translateAPI) {
    warnLog(`⚠️ Using fallback translation for: "${text.substring(0, 50)}..."`)
    return generateFallbackTranslation(text)
  }
  
  // Retry logic
  for (let attempt = 1; attempt <= TRANSLATION_CONFIG.maxRetries; attempt++) {
    try {
      debugLog(`🔄 Translating (attempt ${attempt}/${TRANSLATION_CONFIG.maxRetries}): "${text.substring(0, 50)}..."`)
      
      // Add delay to respect rate limits
      if (attempt > 1) {
        await delay(TRANSLATION_CONFIG.delayBetweenRequests * attempt)
      }
      
      // Call Google Translate API
      const [translation] = await translateAPI.translate(text, {
        from: 'en',  // Source language: English
        to: 'ru',    // Target language: Russian  
        format: 'text'
      })
      
      const translatedText = Array.isArray(translation) ? translation[0] : translation
      
      debugLog(`✅ Translation successful: "${translatedText.substring(0, 50)}..."`)
      
      // Cache the translation
      if (TRANSLATION_CONFIG.useCache) {
        translationCache.set(cacheKey, translatedText)
      }
      
      // Add delay between requests to respect rate limits
      await delay(TRANSLATION_CONFIG.delayBetweenRequests)
      
      return translatedText
      
    } catch (error) {
      errorLog(`❌ Translation attempt ${attempt} failed:`, error)
      
      if (attempt === TRANSLATION_CONFIG.maxRetries) {
        warnLog(`⚠️ All translation attempts failed. Using fallback for: "${text.substring(0, 50)}..."`)
        return generateFallbackTranslation(text)
      }
      
      // Wait before retrying (exponential backoff)
      const waitTime = TRANSLATION_CONFIG.delayBetweenRequests * Math.pow(2, attempt)
      debugLog(`⏳ Waiting ${waitTime}ms before retry...`)
      await delay(waitTime)
    }
  }
  
  // This should never be reached, but just in case
  return generateFallbackTranslation(text)
}

// Fallback translation for when API is not available
function generateFallbackTranslation(text: string): string {
  // Simple keyword-based translation for common cosmetics terms
  const cosmeticsTranslations: Record<string, string> = {
    // Common skincare terms
    'serum': 'сыворотка',
    'cream': 'крем', 
    'mask': 'маска',
    'cleanser': 'очищающее средство',
    'toner': 'тоник',
    'moisturizer': 'увлажняющий крем',
    'sunscreen': 'солнцезащитный крем',
    'anti-aging': 'антивозрастной',
    'hydrating': 'увлажняющий',
    'nourishing': 'питательный',
    'gentle': 'мягкий',
    'sensitive skin': 'чувствительная кожа',
    'dry skin': 'сухая кожа',
    'oily skin': 'жирная кожа',
    'combination skin': 'комбинированная кожа',
    'apply': 'нанести',
    'twice daily': 'два раза в день',
    'morning and evening': 'утром и вечером',
    'ingredients': 'ингредиенты',
    'benefits': 'преимущества',
    'directions': 'инструкции',
    'how to use': 'способ применения'
  }
  
  let translated = text
  
  // Apply basic translations
  for (const [english, russian] of Object.entries(cosmeticsTranslations)) {
    const regex = new RegExp(english, 'gi')
    translated = translated.replace(regex, russian)
  }
  
  // Add prefix to indicate fallback translation
  return `[ПЕРЕВОД] ${translated}`
}

// Helper function to translate JSON string
async function translateJSONString(jsonStr: string | null): Promise<string | null> {
  if (!jsonStr) return null
  
  try {
    const parsed = JSON.parse(jsonStr)
    
    if (Array.isArray(parsed)) {
      // Translate array items
      const translated = await Promise.all(
        parsed.map(async (item) => {
          if (typeof item === 'string') {
            return await translateToRussian(item)
          } else if (typeof item === 'object' && item !== null) {
            const translatedObj: Record<string, string> = {}
            for (const [key, value] of Object.entries(item)) {
              if (typeof value === 'string') {
                translatedObj[key] = await translateToRussian(value)
              } else {
                translatedObj[key] = value as string
              }
            }
            return translatedObj
          }
          return item
        })
      )
      return JSON.stringify(translated, null, 2)
    } else if (typeof parsed === 'object' && parsed !== null) {
      // Translate object values
      const translated: Record<string, string> = {}
      for (const [key, value] of Object.entries(parsed)) {
        if (typeof value === 'string') {
          translated[key] = await translateToRussian(value)
        } else {
          translated[key] = value as string
        }
      }
      return JSON.stringify(translated, null, 2)
    }
    
    return jsonStr
  } catch (e) {
    console.error('Error parsing JSON:', e)
    return jsonStr
  }
}

async function translateProduct(product: any): Promise<ProductTranslation> {
  const translation: ProductTranslation = {}
  const productId = product.productNumber || product.id
  
  debugLog(`   🔄 Processing product ${productId} fields...`)
  
  if (product.description) {
    debugLog(`   📝 Translating description (${product.description.length} chars)...`)
    translation.description = await translateToRussian(product.description)
  }
  
  if (product.productDetails) {
    debugLog(`   📋 Translating productDetails (JSON)...`)
    const translated = await translateJSONString(product.productDetails)
    if (translated) {
      translation.productDetails = translated
    }
  }
  
  if (product.keyFeatures) {
    debugLog(`   ⭐ Translating keyFeatures (JSON)...`)
    translation.keyFeatures = await translateJSONString(product.keyFeatures)
  }
  
  if (product.benefits) {
    debugLog(`   💎 Translating benefits (JSON)...`)
    const translated = await translateJSONString(product.benefits)
    if (translated) {
      translation.benefits = translated
    }
  }
  
  if (product.ingredients) {
    debugLog(`   🧪 Translating ingredients (JSON)...`)
    translation.ingredients = await translateJSONString(product.ingredients)
  }
  
  if (product.howToUse) {
    debugLog(`   📖 Translating howToUse (JSON)...`)
    const translated = await translateJSONString(product.howToUse)
    if (translated) {
      translation.howToUse = translated
    }
  }
  
  if (product.directions) {
    debugLog(`   🎯 Translating directions (${product.directions.length} chars)...`)
    translation.directions = await translateToRussian(product.directions)
  }
  
  const fieldCount = Object.keys(translation).length
  debugLog(`   ✅ Completed ${fieldCount} fields for product ${productId}`)
  
  return translation
}

async function main() {
  debugLog('🚀 Starting Russian product translation process...')
  debugLog(`📊 Configuration: Max ${TRANSLATION_CONFIG.maxRequestsPerSecond} req/sec, ${TRANSLATION_CONFIG.delayBetweenRequests}ms delay, Cache: ${TRANSLATION_CONFIG.useCache}`)
  
  try {
    debugLog('📋 Fetching all products from database...')
    
    const products = await prisma.product.findMany({
      where: {
        isHidden: false
      },
      orderBy: {
        id: 'asc'
      }
    })
    
    debugLog(`📦 Found ${products.length} products to translate`)
    
    const translations: Record<string, ProductTranslation> = {}
    const startTime = Date.now()
    let translatedCount = 0
    let skippedCount = 0
    let errorCount = 0
    
    // Translate each product with progress tracking
    for (let i = 0; i < products.length; i++) {
      const product = products[i]
      const productId = product.productNumber || product.id
      const progress = `[${i + 1}/${products.length}]`
      
      debugLog(`${progress} 🔄 Translating product ${productId}: ${product.name}`)
      
      try {
        // Check if product has content to translate
        const hasContent = product.description || product.productDetails || 
                          product.keyFeatures || product.benefits || 
                          product.ingredients || product.howToUse || product.directions
        
        if (!hasContent) {
          warnLog(`${progress} ⏭️  Skipping product ${productId}: No content to translate`)
          skippedCount++
          continue
        }
        
        translations[productId] = await translateProduct(product)
        debugLog(`${progress} ✅ Successfully translated product ${productId}`)
        translatedCount++
        
        // Progress update every 10 products
        if ((i + 1) % 10 === 0) {
          const elapsed = (Date.now() - startTime) / 1000
          const rate = (i + 1) / elapsed
          const remaining = products.length - (i + 1)
          const eta = remaining / rate
          
          debugLog(`📊 Progress: ${i + 1}/${products.length} (${((i + 1) / products.length * 100).toFixed(1)}%) - Rate: ${rate.toFixed(1)}/sec - ETA: ${Math.round(eta)}sec`)
        }
        
      } catch (error) {
        errorLog(`${progress} ❌ Error translating product ${productId}:`, error)
        errorCount++
        
        // Add empty translation to maintain structure
        translations[productId] = {}
      }
    }
    
    // Ensure data directory exists
    const dataDir = path.join(process.cwd(), 'data')
    if (!fs.existsSync(dataDir)) {
      debugLog('📁 Creating data directory...')
      fs.mkdirSync(dataDir, { recursive: true })
    }
    
    // Generate TypeScript file with metadata
    const generationDate = new Date().toISOString()
    const totalTime = (Date.now() - startTime) / 1000
    
    const fileContent = `/**
 * Russian translations for products
 * Auto-generated by translate-products-to-russian.ts
 * 
 * Generation Info:
 * - Date: ${generationDate}
 * - Products processed: ${products.length}
 * - Successfully translated: ${translatedCount}
 * - Skipped (no content): ${skippedCount}
 * - Errors: ${errorCount}
 * - Total time: ${totalTime.toFixed(2)}s
 * - Translation method: ${process.env.GOOGLE_TRANSLATE_API_KEY ? 'Google Translate API' : process.env.GOOGLE_APPLICATION_CREDENTIALS ? 'Google Cloud Service Account' : 'Fallback translation'}
 * 
 * Structure:
 * - description: Russian description
 * - productDetails: Russian product details (JSON string)
 * - keyFeatures: Russian key features (JSON array string)
 * - benefits: Russian benefits (JSON array string)
 * - ingredients: Russian ingredients (JSON array string)
 * - howToUse: Russian usage instructions
 * - directions: Russian directions
 */

export interface ProductTranslation {
  description?: string
  productDetails?: string
  keyFeatures?: string | null
  benefits?: string
  ingredients?: string | null
  howToUse?: string
  directions?: string
}

export const productTranslationsRu: Record<string, ProductTranslation> = ${JSON.stringify(translations, null, 2)}

/**
 * Get Russian translation for a product field
 * @param productId - Product ID
 * @param field - Field name to translate
 * @returns Russian translation or null if not available
 */
export function getProductTranslationRu(
  productId: string,
  field: keyof ProductTranslation
): string | null {
  const translation = productTranslationsRu[productId]
  return translation?.[field] || null
}

/**
 * Get all Russian translations for a product
 * @param productId - Product ID
 * @returns ProductTranslation object or null
 */
export function getProductTranslationsRu(productId: string): ProductTranslation | null {
  return productTranslationsRu[productId] || null
}

/**
 * Get translation statistics
 * @returns Object with translation metadata
 */
export function getTranslationStats() {
  return {
    generatedAt: '${generationDate}',
    totalProducts: ${products.length},
    translatedProducts: ${translatedCount},
    skippedProducts: ${skippedCount},
    errorCount: ${errorCount},
    generationTimeSeconds: ${totalTime.toFixed(2)},
    translationMethod: '${process.env.GOOGLE_TRANSLATE_API_KEY ? 'Google Translate API' : process.env.GOOGLE_APPLICATION_CREDENTIALS ? 'Google Cloud Service Account' : 'Fallback translation'}',
    cacheEnabled: ${TRANSLATION_CONFIG.useCache},
    cacheSize: ${translationCache.size}
  }
}
`
    
    // Write to file
    const filePath = path.join(dataDir, 'productTranslationsRu.ts')
    fs.writeFileSync(filePath, fileContent, 'utf-8')
    
    // Final summary
    debugLog('\n🎉 ===== TRANSLATION COMPLETE =====')
    debugLog(`📁 File: ${filePath}`)
    debugLog(`📊 Total products: ${products.length}`)
    debugLog(`✅ Successfully translated: ${translatedCount}`)
    debugLog(`⏭️  Skipped (no content): ${skippedCount}`)
    debugLog(`❌ Errors: ${errorCount}`)
    debugLog(`⏱️  Total time: ${totalTime.toFixed(2)} seconds`)
    debugLog(`📋 Cache entries: ${translationCache.size}`)
    debugLog(`🔧 Translation method: ${process.env.GOOGLE_TRANSLATE_API_KEY ? 'Google Translate API' : process.env.GOOGLE_APPLICATION_CREDENTIALS ? 'Google Cloud Service Account' : 'Fallback translation'}`)
    
    if (errorCount > 0) {
      warnLog(`⚠️ ${errorCount} products had translation errors but were included with empty translations`)
    }
    
    if (!process.env.GOOGLE_TRANSLATE_API_KEY && !process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      warnLog('\n🔑 To use Google Translate API, set one of these environment variables:')
      warnLog('   GOOGLE_TRANSLATE_API_KEY=your-api-key')
      warnLog('   GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account.json')
      warnLog('   Current translations use fallback method with limited quality.')
    }
    
  } catch (error) {
    errorLog('💥 Fatal error:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
    debugLog('🔌 Database connection closed')
  }
}

main()



