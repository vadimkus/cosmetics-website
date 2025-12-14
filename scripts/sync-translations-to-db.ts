/**
 * Script to sync translations from data files to database
 * Uses existing productTranslations.ts (Arabic) and productTranslationsRu.ts (Russian)
 */

import { Pool } from 'pg'

const DATABASE_URL = process.env.DATABASE_URL || process.env.POSTGRES_URL

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL or POSTGRES_URL environment variable is required')
  process.exit(1)
}

// Import translation data
const productTranslations = require('../data/productTranslations').productTranslations
const productTranslationsRu = require('../data/productTranslationsRu').productTranslationsRu

async function syncTranslations() {
  const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  })

  try {
    console.log('🚀 Starting translation sync...')
    
    // Get all products
    const productsQuery = `SELECT id, "productNumber", name FROM products ORDER BY id`
    const productsResult = await pool.query(productsQuery)
    const products = productsResult.rows

    console.log(`📦 Found ${products.length} products in database`)

    let updated = 0
    let skipped = 0

    for (const product of products) {
      const productId = product.id
      const productNumber = product.productNumber
      
      // Try to find translation by product number first, then by ID
      const arTranslation = productTranslations[productNumber] || productTranslations[productId]
      const ruTranslation = productTranslationsRu[productNumber] || productTranslationsRu[productId]

      if (!arTranslation && !ruTranslation) {
        console.log(`⏭️  Skipping product ${productId} (${product.name}) - no translations found`)
        skipped++
        continue
      }

      console.log(`\n📝 Processing product ${productId}: ${product.name}`)
      
      const updates: any = {}

      // Arabic translations
      if (arTranslation) {
        if (arTranslation.description) {
          updates.descriptionAr = arTranslation.description
          console.log('  🇦🇪 Added Arabic description')
        }
        // For name, we can extract from productDetails or use the product name
        // Most products don't have translated names in the translation files
        console.log('  🇦🇪 Arabic translation found')
      }

      // Russian translations
      if (ruTranslation) {
        if (ruTranslation.description) {
          updates.descriptionRu = ruTranslation.description
          console.log('  🇷🇺 Added Russian description')
        }
        console.log('  🇷🇺 Russian translation found')
      }

      // Update database if we have translations
      if (Object.keys(updates).length > 0) {
        const setClauses: string[] = []
        const values: any[] = []
        let paramIndex = 1

        if (updates.descriptionAr) {
          setClauses.push(`"descriptionAr" = $${paramIndex}`)
          values.push(updates.descriptionAr)
          paramIndex++
        }
        if (updates.descriptionRu) {
          setClauses.push(`"descriptionRu" = $${paramIndex}`)
          values.push(updates.descriptionRu)
          paramIndex++
        }

        values.push(productId)
        const updateQuery = `
          UPDATE products
          SET ${setClauses.join(', ')}, "updatedAt" = NOW()
          WHERE id = $${paramIndex}
        `

        await pool.query(updateQuery, values)
        updated++
        console.log(`  ✅ Updated product ${productId}`)
      } else {
        skipped++
      }
    }

    console.log('\n📊 Sync Summary:')
    console.log(`  ✅ Updated: ${updated} products`)
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

    console.log('\n📈 Database Statistics:')
    console.log(`  Total products: ${stats.total}`)
    console.log(`  Products with Russian name: ${stats.name_ru_count}`)
    console.log(`  Products with Arabic name: ${stats.name_ar_count}`)
    console.log(`  Products with Russian description: ${stats.desc_ru_count}`)
    console.log(`  Products with Arabic description: ${stats.desc_ar_count}`)

  } catch (error) {
    console.error('❌ Sync failed:', error)
    throw error
  } finally {
    await pool.end()
  }
}

syncTranslations()
  .then(() => {
    console.log('\n🎉 Translation sync completed!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Error:', error)
    process.exit(1)
  })
