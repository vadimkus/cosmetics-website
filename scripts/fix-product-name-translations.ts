/**
 * Script to remove Russian/Arabic name translations for specific products
 * These products should keep their English names in all languages
 */

import { Pool } from 'pg'

const DATABASE_URL = process.env.DATABASE_URL || process.env.POSTGRES_URL

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL or POSTGRES_URL environment variable is required')
  process.exit(1)
}

async function fixProductNames() {
  const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  })

  try {
    console.log('🚀 Fixing product name translations...\n')
    
    // Products that should keep English names
    const productsToKeepEnglish = [
      'MULTI FUNCTIONAL ANTI-WRINKLE CREAM',
      'MULTI FUNCTIONAL ANTI-WRINKLE SERUM',
      'INTENSIVE REPAIR COLLAGEN MASK'
    ]

    for (const productName of productsToKeepEnglish) {
      console.log(`📝 Processing: ${productName}`)
      
      // Find the product
      const findQuery = `
        SELECT id, name, "nameRu", "nameAr"
        FROM products
        WHERE UPPER(name) = UPPER($1)
      `
      const result = await pool.query(findQuery, [productName])
      
      if (result.rows.length === 0) {
        console.log(`  ⚠️  Product not found: ${productName}`)
        continue
      }

      const product = result.rows[0]
      console.log(`  ✓ Found product ID: ${product.id}`)
      console.log(`    Current nameRu: ${product.nameRu || 'NULL'}`)
      console.log(`    Current nameAr: ${product.nameAr || 'NULL'}`)

      // Set nameRu and nameAr to NULL (will use English name as fallback)
      const updateQuery = `
        UPDATE products
        SET "nameRu" = NULL, "nameAr" = NULL, "updatedAt" = NOW()
        WHERE id = $1
      `
      await pool.query(updateQuery, [product.id])
      
      console.log(`  ✅ Updated - nameRu and nameAr set to NULL (will display English name)\n`)
    }

    // Verify updates
    console.log('📊 Verification:')
    const verifyQuery = `
      SELECT id, name, "nameRu", "nameAr"
      FROM products
      WHERE UPPER(name) IN (${productsToKeepEnglish.map((_, i) => `$${i + 1}`).join(', ')})
    `
    const verifyResult = await pool.query(verifyQuery, productsToKeepEnglish.map(n => n.toUpperCase()))
    
    console.log('\nProducts updated:')
    verifyResult.rows.forEach((row: any) => {
      console.log(`  - ${row.name}`)
      console.log(`    nameRu: ${row.nameRu || 'NULL (English fallback)'}`)
      console.log(`    nameAr: ${row.nameAr || 'NULL (English fallback)'}`)
    })

    console.log('\n✅ All product names fixed!')

  } catch (error) {
    console.error('❌ Error:', error)
    throw error
  } finally {
    await pool.end()
  }
}

fixProductNames()
  .then(() => {
    console.log('\n🎉 Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Error:', error)
    process.exit(1)
  })





