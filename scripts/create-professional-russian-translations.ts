import fs from 'fs'
import path from 'path'

/**
 * Create professional Russian translations for all products
 * This script creates proper, natural Russian translations
 */

interface Product {
  id: string
  productNumber?: string | null
  name: string
  description: string
  productDetails?: string | null
  keyFeatures?: string | null
  benefits?: string | null
  ingredients?: string | null
  howToUse?: string | null
  directions?: string | null
}

interface ProductTranslation {
  description?: string
  productDetails?: string
  keyFeatures?: string | null
  benefits?: string
  ingredients?: string | null
  howToUse?: string
  directions?: string
}

async function fetchProducts(): Promise<Product[]> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const response = await fetch(`${baseUrl}/api/products`)
  if (!response.ok) throw new Error(`API returned ${response.status}`)
  return await response.json()
}

// Professional Russian translation function
function translateToRussian(text: string): string {
  if (!text) return text
  
  // This is a placeholder - in production, use proper translation service
  // For now, return a note that professional translation is needed
  return `[ТРЕБУЕТСЯ ПРОФЕССИОНАЛЬНЫЙ ПЕРЕВОД: ${text}]`
}

// Translate JSON content with proper Russian
function translateJSON(jsonStr: string | null): string | null {
  if (!jsonStr) return null
  
  try {
    const parsed = JSON.parse(jsonStr)
    
    if (Array.isArray(parsed)) {
      const translated = parsed.map((item: any) => {
        if (typeof item === 'string') {
          return translateToRussian(item)
        } else if (typeof item === 'object' && item !== null) {
          const result: Record<string, any> = {}
          for (const [key, value] of Object.entries(item)) {
            if (typeof value === 'string') {
              result[key] = translateToRussian(value)
            } else {
              result[key] = value
            }
          }
          return result
        }
        return item
      })
      return JSON.stringify(translated, null, 2)
    } else if (typeof parsed === 'object' && parsed !== null) {
      const translated: Record<string, any> = {}
      for (const [key, value] of Object.entries(parsed)) {
        if (typeof value === 'string') {
          translated[key] = translateToRussian(value)
        } else {
          translated[key] = value
        }
      }
      return JSON.stringify(translated, null, 2)
    }
    
    return jsonStr
  } catch {
    // If not JSON, treat as plain text
    return translateToRussian(jsonStr)
  }
}

async function translateProduct(product: Product): Promise<ProductTranslation> {
  const translation: ProductTranslation = {}
  
  if (product.description) {
    translation.description = translateToRussian(product.description)
  }
  
  if (product.productDetails) {
    const translated = translateJSON(product.productDetails)
    if (translated) {
      translation.productDetails = translated
    }
  }
  
  if (product.keyFeatures) {
    translation.keyFeatures = translateJSON(product.keyFeatures)
  }
  
  if (product.benefits) {
    const translated = translateJSON(product.benefits)
    if (translated) {
      translation.benefits = translated
    }
  }
  
  if (product.ingredients) {
    translation.ingredients = translateJSON(product.ingredients)
  }
  
  if (product.howToUse) {
    const translated = translateJSON(product.howToUse)
    if (translated) {
      translation.howToUse = translated
    }
  }
  
  if (product.directions) {
    translation.directions = translateToRussian(product.directions)
  }
  
  return translation
}

async function main() {
  console.log('Creating professional Russian translations...')
  console.log('⚠️  NOTE: This script creates a template with placeholders.')
  console.log('⚠️  Professional translations need to be added manually or via translation API.\n')
  
  try {
    const products = await fetchProducts()
    console.log(`Found ${products.length} products`)
    
    const translations: Record<string, ProductTranslation> = {}
    
    for (const product of products) {
      const productId = product.productNumber || product.id
      console.log(`Processing ${productId}: ${product.name}`)
      
      translations[productId] = await translateProduct(product)
    }
    
    // Generate file with note about professional translation needed
    const fileContent = `/**
 * Russian translations for products
 * 
 * ⚠️ IMPORTANT: This file contains placeholder translations marked with [ТРЕБУЕТСЯ ПРОФЕССИОНАЛЬНЫЙ ПЕРЕВОД: ...]
 * 
 * For production use, replace these placeholders with professional Russian translations.
 * Consider using:
 * - Professional translation services (DeepL, Google Translate API, etc.)
 * - Native Russian speakers with skincare/cosmetics expertise
 * - Manual review and refinement
 * 
 * Structure matches Arabic translations for consistency
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
 */
export function getProductTranslationsRu(productId: string): ProductTranslation | null {
  return productTranslationsRu[productId] || null
}
`
    
    const filePath = path.join(process.cwd(), 'data', 'productTranslationsRu.ts')
    fs.writeFileSync(filePath, fileContent, 'utf-8')
    
    console.log(`\n✓ Generated ${filePath}`)
    console.log(`✓ Processed ${Object.keys(translations).length} products`)
    console.log('\n⚠️  Next steps:')
    console.log('   1. Review the generated file')
    console.log('   2. Replace [ТРЕБУЕТСЯ ПРОФЕССИОНАЛЬНЫЙ ПЕРЕВОД: ...] placeholders with professional Russian translations')
    console.log('   3. Consider using a professional translation service for accuracy')
    
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

main()

