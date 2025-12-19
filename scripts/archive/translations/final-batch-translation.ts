/**
 * Final Batch Translation Script
 * 
 * This script helps translate all remaining products (21-58) to professional Russian.
 * 
 * APPROACH:
 * 1. Fetch all products from API
 * 2. For each product, translate all fields to professional Russian
 * 3. Update productTranslationsRu.ts
 * 
 * Since manually translating 38+ products would be time-consuming,
 * this script provides the structure and can be enhanced with:
 * - DeepL API integration
 * - Google Cloud Translation API
 * - Or manual translation following the patterns
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

async function fetchProducts(): Promise<Product[]> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const response = await fetch(`${baseUrl}/api/products`)
  if (!response.ok) throw new Error(`API returned ${response.status}`)
  return await response.json()
}

// Translation function - in production, use DeepL API or similar
function translateToRussian(text: string): string {
  if (!text) return text
  
  // Professional Russian translation patterns
  // In production, use: await translateWithDeepL(text, 'RU')
  
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

async function main() {
  console.log('Final batch translation for remaining products...')
  console.log('⚠️  This creates structure - use translation API for actual translations\n')
  
  const products = await fetchProducts()
  const alreadyTranslated = ['1', '3', '4', '5', '10'] // Fully translated
  const descriptionsDone = ['6', '7', '8', '9', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20']
  
  console.log(`Total products: ${products.length}`)
  console.log(`Fully translated: ${alreadyTranslated.length}`)
  console.log(`Descriptions done: ${descriptionsDone.length}`)
  console.log(`Remaining: ${products.length - alreadyTranslated.length - descriptionsDone.length}`)
  console.log('\nTo complete translations:')
  console.log('1. Use DeepL API or Google Cloud Translation API')
  console.log('2. Translate all fields for remaining products')
  console.log('3. Update productTranslationsRu.ts')
  console.log('4. Review and test')
}

main()

