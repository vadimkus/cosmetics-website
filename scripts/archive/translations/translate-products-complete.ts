import fs from 'fs'
import path from 'path'

/**
 * Complete Russian translation for products
 * This script reads the fetched products and creates proper Russian translations
 */

// Fetch products from API
async function fetchProducts() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const response = await fetch(`${baseUrl}/api/products`)
  if (!response.ok) throw new Error(`API returned ${response.status}`)
  return await response.json()
}

// Comprehensive translation function for skincare terms
function translateText(text: string): string {
  if (!text) return text
  
  // Common skincare term translations
  const translations: Record<string, string> = {
    // Basic terms
    'Professional': 'Профессиональный',
    'professional': 'профессиональный',
    'device': 'устройство',
    'ampoule': 'ампула',
    'serum': 'сыворотка',
    'cream': 'крем',
    'toner': 'тоник',
    'cleanser': 'очищающее средство',
    'mask': 'маска',
    'peeling': 'пилинг',
    'moisture': 'увлажнение',
    'hydration': 'гидратация',
    'moisturizing': 'увлажняющий',
    'hydrating': 'увлажняющий',
    
    // Skin types
    'dry': 'сухая',
    'oily': 'жирная',
    'combination': 'комбинированная',
    'normal': 'нормальная',
    'sensitive': 'чувствительная',
    'aging': 'стареющая',
    'mature': 'зрелая',
    
    // Concerns
    'anti-aging': 'антивозрастной',
    'anti aging': 'антивозрастной',
    'wrinkle': 'морщина',
    'wrinkles': 'морщины',
    'firming': 'укрепление',
    'brightening': 'осветление',
    'blemish': 'недостаток',
    'blemishes': 'недостатки',
    'acne': 'акне',
    'pigmentation': 'пигментация',
    'hyperpigmentation': 'гиперпигментация',
    
    // Actions
    'cleansing': 'очищение',
    'cleanses': 'очищает',
    'nourishes': 'питает',
    'soothes': 'успокаивает',
    'repairs': 'восстанавливает',
    'regenerates': 'регенерирует',
    'stimulates': 'стимулирует',
    'improves': 'улучшает',
    'reduces': 'уменьшает',
    'enhances': 'усиливает',
    'promotes': 'способствует',
    
    // Ingredients
    'hyaluronic acid': 'гиалуроновая кислота',
    'peptide': 'пептид',
    'peptides': 'пептиды',
    'collagen': 'коллаген',
    'ceramide': 'церамид',
    'ceramides': 'церамиды',
    'vitamin': 'витамин',
    'antioxidant': 'антиоксидант',
    
    // Directions
    'apply': 'нанесите',
    'cleanse': 'очистите',
    'massage': 'помассируйте',
    'rinse': 'смойте',
    'use': 'используйте',
    
    // Common phrases
    'for best results': 'для лучших результатов',
    'suitable for': 'подходит для',
    'all skin types': 'всех типов кожи',
    'dermatologically tested': 'дерматологически протестировано',
    'made in': 'произведено в',
    'South Korea': 'Южной Корее',
  }
  
  // Simple word-by-word translation (basic approach)
  // In production, use a proper translation API
  let translated = text
  
  // Replace common phrases
  for (const [en, ru] of Object.entries(translations)) {
    const regex = new RegExp(`\\b${en}\\b`, 'gi')
    translated = translated.replace(regex, ru)
  }
  
  return translated
}

// Translate JSON content properly
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
    // If not JSON, treat as plain text
    return translateText(jsonStr)
  }
}

async function main() {
  console.log('Fetching and translating products...')
  
  try {
    const products = await fetchProducts()
    console.log(`Found ${products.length} products`)
    
    const translations: Record<string, any> = {}
    
    for (const product of products) {
      const productId = product.productNumber || product.id
      console.log(`Translating ${productId}: ${product.name}`)
      
      const translation: any = {}
      
      if (product.description) {
        translation.description = translateText(product.description)
      }
      if (product.productDetails) {
        translation.productDetails = translateJSON(product.productDetails)
      }
      if (product.keyFeatures) {
        translation.keyFeatures = translateJSON(product.keyFeatures)
      }
      if (product.benefits) {
        translation.benefits = translateJSON(product.benefits)
      }
      if (product.ingredients) {
        translation.ingredients = translateJSON(product.ingredients)
      }
      if (product.howToUse) {
        translation.howToUse = translateJSON(product.howToUse)
      }
      if (product.directions) {
        translation.directions = translateText(product.directions)
      }
      
      translations[productId] = translation
    }
    
    // Generate file
    const fileContent = `/**
 * Russian translations for products
 * Auto-generated - contains basic translations
 * NOTE: Some translations may need refinement for natural Russian
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

export function getProductTranslationRu(
  productId: string,
  field: keyof ProductTranslation
): string | null {
  const translation = productTranslationsRu[productId]
  return translation?.[field] || null
}

export function getProductTranslationsRu(productId: string): ProductTranslation | null {
  return productTranslationsRu[productId] || null
}
`
    
    const filePath = path.join(process.cwd(), 'data', 'productTranslationsRu.ts')
    fs.writeFileSync(filePath, fileContent, 'utf-8')
    
    console.log(`\n✓ Generated ${filePath}`)
    console.log(`✓ Translated ${Object.keys(translations).length} products`)
    
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

main()



