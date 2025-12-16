/**
 * Script to add localization columns to Product table
 * Adds: nameRu, nameAr, descriptionRu, descriptionAr
 */

import { Pool } from 'pg'

const DATABASE_URL = process.env.DATABASE_URL || process.env.POSTGRES_URL

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL or POSTGRES_URL environment variable is required')
  process.exit(1)
}

async function addLocalizationColumns() {
  const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  })

  try {
    console.log('🚀 Starting database migration...')
    console.log('📊 Adding localization columns to products table...')

    // Check if columns already exist
    const checkQuery = `
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'products' 
        AND column_name IN ('nameRu', 'nameAr', 'descriptionRu', 'descriptionAr')
    `
    const existingCols = await pool.query(checkQuery)
    const existingColNames = existingCols.rows.map((r: any) => r.column_name)
    
    console.log('📋 Existing localization columns:', existingColNames.length > 0 ? existingColNames : 'none')

    // Add missing columns
    const columnsToAdd = [
      { name: 'nameRu', sql: 'ALTER TABLE products ADD COLUMN IF NOT EXISTS "nameRu" TEXT;' },
      { name: 'nameAr', sql: 'ALTER TABLE products ADD COLUMN IF NOT EXISTS "nameAr" TEXT;' },
      { name: 'descriptionRu', sql: 'ALTER TABLE products ADD COLUMN IF NOT EXISTS "descriptionRu" TEXT;' },
      { name: 'descriptionAr', sql: 'ALTER TABLE products ADD COLUMN IF NOT EXISTS "descriptionAr" TEXT;' }
    ]

    for (const col of columnsToAdd) {
      if (!existingColNames.includes(col.name)) {
        console.log(`➕ Adding column: ${col.name}`)
        await pool.query(col.sql)
      } else {
        console.log(`✅ Column already exists: ${col.name}`)
      }
    }

    console.log('✅ Migration completed successfully!')
    
    // Verify columns were added
    const verifyQuery = `
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'products' 
        AND column_name IN ('nameRu', 'nameAr', 'descriptionRu', 'descriptionAr')
      ORDER BY column_name
    `
    const result = await pool.query(verifyQuery)
    console.log('\n📊 Localization columns in products table:')
    result.rows.forEach((row: any) => {
      console.log(`  - ${row.column_name}: ${row.data_type}`)
    })

  } catch (error) {
    console.error('❌ Migration failed:', error)
    throw error
  } finally {
    await pool.end()
  }
}

addLocalizationColumns()
  .then(() => {
    console.log('\n🎉 Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Error:', error)
    process.exit(1)
  })

