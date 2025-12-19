/**
 * Script to populate product translations (Russian and Arabic)
 * Uses Google Translate API to translate product names and descriptions
 */

import { Pool } from 'pg'
import { Translate } from '@google-cloud/translate/build/src/v2'

const DATABASE_URL = process.env.DATABASE_URL || process.env.POSTGRES_URL
const GOOGLE_TRANSLATE_API_KEY = process.env.GOOGLE_TRANSLATE_API_KEY

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL or POSTGRES_URL environment variable is required')
  process.exit(1)
}

if (!GOOGLE_TRANSLATE_API_KEY) {
  console.error('❌ GOOGLE_TRANSLATE_API_KEY environment variable is required')
  console.error('⚠️  Set it in .env or pass as environment variable')
  process.exit(1)
}

const translate = new Translate({ key: GOOGLE_TRANSLATE_API_KEY })

interface Product {
  id: string
  name: string
  description: string
  nameRu: string | null
  nameAr: string | null
  descriptionRu: string | null
  descriptionAr: string | null
}

async function translateText(text: string, targetLanguage: 'ru' | 'ar'): Promise<string> {
  try {
    const [translation] = await translate.translate(text, targetLanguage)
    return translation
  } catch {
    console.error(`❌ Translation error for "${text.substring(0, 50)}...":`, error)
    return text // Return original text if translation fails
  }
}

async function populateTranslations() {
  const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  })

  try {
    console.log('🚀 Starting translation population...')
    
    // Get all products that need translation
    const query = `
      SELECT id, name, description, "nameRu", "nameAr", "descriptionRu", "descriptionAr"
      FROM products
      WHERE "nameRu" IS NULL OR "nameAr" IS NULL OR "descriptionRu" IS NULL OR "descriptionAr" IS NULL
      ORDER BY id
    `
    const result = await pool.query(query)
    const products: Product[] = result.rows

    console.log(`📦 Found ${products.length} products needing translation`)

    if (products.length === 0) {
      console.log('✅ All products already have translations!')
      return
    }

    let translated = 0
    let skipped = 0

    for (const product of products) {
      console.log(`\n📝 Processing: ${product.name} (${product.id})`)
      
      const updates: any = {}
      let needsUpdate = false

      // Translate name to Russian
      if (!product.nameRu) {
        console.log('  🇷🇺 Translating name to Russian...')
        updates.nameRu = await translateText(product.name, 'ru')
        needsUpdate = true
      }

      // Translate name to Arabic
      if (!product.nameAr) {
        console.log('  🇦🇪 Translating name to Arabic...')
        updates.nameAr = await translateText(product.name, 'ar')
        needsUpdate = true
      }

      // Translate description to Russian
      if (!product.descriptionRu && product.description) {
        console.log('  🇷🇺 Translating description to Russian...')
        updates.descriptionRu = await translateText(product.description, 'ru')
        needsUpdate = true
      }

      // Translate description to Arabic
      if (!product.descriptionAr && product.description) {
        console.log('  🇦🇪 Translating description to Arabic...')
        updates.descriptionAr = await translateText(product.description, 'ar')
        needsUpdate = true
      }

      if (needsUpdate) {
        // Build update query
        const setClauses: string[] = []
        const values: any[] = []
        let paramIndex = 1

        if (updates.nameRu) {
          setClauses.push(`"nameRu" = $${paramIndex}`)
          values.push(updates.nameRu)
          paramIndex++
        }
        if (updates.nameAr) {
          setClauses.push(`"nameAr" = $${paramIndex}`)
          values.push(updates.nameAr)
          paramIndex++
        }
        if (updates.descriptionRu) {
          setClauses.push(`"descriptionRu" = $${paramIndex}`)
          values.push(updates.descriptionRu)
          paramIndex++
        }
        if (updates.descriptionAr) {
          setClauses.push(`"descriptionAr" = $${paramIndex}`)
          values.push(updates.descriptionAr)
          paramIndex++
        }

        values.push(product.id)
        const updateQuery = `
          UPDATE products
          SET ${setClauses.join(', ')}, "updatedAt" = NOW()
          WHERE id = $${paramIndex}
        `

        await pool.query(updateQuery, values)
        translated++
        console.log(`  ✅ Updated product ${product.id}`)
      } else {
        skipped++
        console.log(`  ⏭️  Skipped (already translated)`)
      }

      // Add a small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    console.log('\n📊 Summary:')
    console.log(`  ✅ Translated: ${translated} products`)
    console.log(`  ⏭️  Skipped: ${skipped} products`)
    console.log(`  📦 Total: ${products.length} products`)

    // Verify translations
    const verifyQuery = `
      SELECT 
        COUNT(*) as total,
        COUNT("nameRu") as name_ru_count,
        COUNT("nameAr") as name_ar_count,
        COUNT("descriptionRu") as desc_ru_count,
        COUNT("descriptionAr") as desc_ar_count
      FROM products
    `
    const verifyResult = await pool.query(verifyQuery)
    const stats = verifyResult.rows[0]

    console.log('\n📈 Database statistics:')
    console.log(`  Total products: ${stats.total}`)
    console.log(`  Products with Russian name: ${stats.name_ru_count}`)
    console.log(`  Products with Arabic name: ${stats.name_ar_count}`)
    console.log(`  Products with Russian description: ${stats.desc_ru_count}`)
    console.log(`  Products with Arabic description: ${stats.desc_ar_count}`)

  } catch {
    console.error('❌ Translation population failed:', error)
    throw error
  } finally {
    await pool.end()
  }
}

populateTranslations()
  .then(() => {
    console.log('\n🎉 Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Error:', error)
    process.exit(1)
  })



