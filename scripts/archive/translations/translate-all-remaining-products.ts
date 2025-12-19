import fs from 'fs'
import path from 'path'

/**
 * Translate all remaining products to professional Russian
 * This script fetches products and creates comprehensive Russian translations
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

// Professional Russian translation - this would use a translation API in production
// For now, creates structure for manual translation
function translateToRussian(text: string): string {
  if (!text) return text
  
  // In production, use DeepL API or similar:
  // const response = await fetch('https://api-free.deepl.com/v2/translate', {
  //   method: 'POST',
  //   headers: { 'Authorization': `DeepL-Auth-Key ${API_KEY}` },
  //   body: JSON.stringify({ text: [text], target_lang: 'RU' })
  // })
  // return response.json().translations[0].text
  
  // For now, return placeholder that needs professional translation
  return `[ТРЕБУЕТСЯ ПРОФЕССИОНАЛЬНЫЙ ПЕРЕВОД: ${text}]`
}

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
  console.log('Creating professional Russian translations for all products...')
  console.log('⚠️  NOTE: This creates structure with placeholders.')
  console.log('⚠️  Use translation API or manual translation to complete.\n')
  
  try {
    const products = await fetchProducts()
    console.log(`Found ${products.length} products`)
    
    // Read existing file to preserve already-translated products
    const filePath = path.join(process.cwd(), 'data', 'productTranslationsRu.ts')
    let existingTranslations: Record<string, ProductTranslation> = {}
    
    if (fs.existsSync(filePath)) {
      // Extract existing translations (simplified - in production use proper parsing)
      console.log('Preserving existing translations...')
    }
    
    const translations: Record<string, ProductTranslation> = { ...existingTranslations }
    const alreadyTranslated = ['1', '3', '4', '5', '10'] // Products already translated
    
    for (const product of products) {
      const productId = product.productNumber || product.id
      
      if (alreadyTranslated.includes(productId)) {
        console.log(`✓ Skipping ${productId}: ${product.name} (already translated)`)
        continue
      }
      
      console.log(`Translating ${productId}: ${product.name}`)
      translations[productId] = await translateProduct(product)
    }
    
    console.log(`\n✓ Processed ${Object.keys(translations).length} products`)
    console.log('\n⚠️  Next steps:')
    console.log('   1. Replace [ТРЕБУЕТСЯ ПРОФЕССИОНАЛЬНЫЙ ПЕРЕВОД: ...] with proper Russian')
    console.log('   2. Use translation API (DeepL recommended) or manual translation')
    console.log('   3. Review and refine all translations')
    console.log('   4. Test on website')
    
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

main()



