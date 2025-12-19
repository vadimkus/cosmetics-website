import fs from 'fs'
import path from 'path'

/**
 * Translate all remaining products to professional Russian
 * This script creates proper Russian translations for all products
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
function translateText(text: string): string {
  if (!text) return text
  
  // This will contain professional Russian translations
  // For now, we'll create proper translations systematically
  return text // Placeholder - will be replaced with actual translations
}

// Translate JSON content
function translateJSON(jsonStr: string | null): string | null {
  if (!jsonStr) return null
  
  try {
    const parsed = JSON.parse(jsonStr)
    
    if (Array.isArray(parsed)) {
      const translated = parsed.map((item: any) => {
        if (typeof item === 'string') {
          return translateText(item)
        } else if (typeof item === 'object' && item !== null) {
          const result: Record<string, any> = {}
          for (const [key, value] of Object.entries(item)) {
            if (typeof value === 'string') {
              result[key] = translateText(value)
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
          translated[key] = translateText(value)
        } else {
          translated[key] = value
        }
      }
      return JSON.stringify(translated, null, 2)
    }
    
    return jsonStr
  } catch {
    return translateText(jsonStr)
  }
}

async function translateProduct(product: Product): Promise<ProductTranslation> {
  const translation: ProductTranslation = {}
  
  if (product.description) {
    translation.description = translateText(product.description)
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
    translation.directions = translateText(product.directions)
  }
  
  return translation
}

async function main() {
  console.log('Fetching products and creating professional Russian translations...')
  
  try {
    const products = await fetchProducts()
    console.log(`Found ${products.length} products`)
    
    // Read existing translations to preserve Products 1 and 10
    const existingFile = path.join(process.cwd(), 'data', 'productTranslationsRu.ts')
    let existingTranslations: Record<string, ProductTranslation> = {}
    
    if (fs.existsSync(existingFile)) {
      const fileContent = fs.readFileSync(existingFile, 'utf-8')
      const match = fileContent.match(/export const productTranslationsRu: Record<string, ProductTranslation> = ({[\s\S]*?});/)
      if (match) {
        try {
          existingTranslations = eval(`(${match[1]})`)
        } catch {
          console.log('Could not parse existing translations, starting fresh')
        }
      }
    }
    
    const translations: Record<string, ProductTranslation> = { ...existingTranslations }
    
    for (const product of products) {
      const productId = product.productNumber || product.id
      
      // Skip if already translated (Products 1 and 10)
      if (translations[productId] && productId === '1' || productId === '10') {
        console.log(`Skipping ${productId}: ${product.name} (already translated)`)
        continue
      }
      
      console.log(`Translating ${productId}: ${product.name}`)
      translations[productId] = await translateProduct(product)
    }
    
    console.log(`\n✓ Processed ${Object.keys(translations).length} products`)
    console.log('⚠️  NOTE: This script creates the structure.')
    console.log('⚠️  Professional translations need to be added manually or via translation API.')
    
  } catch {
    console.error('Error:', error)
    process.exit(1)
  }
}

main()



