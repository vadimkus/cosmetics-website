/**
 * Create Promo Codes Table
 * 
 * Creates a new table for managing promotional codes (QR codes, referral codes, etc.)
 * that automatically apply discounts when users register.
 */

import { Pool } from 'pg'

// Use direct connection (not Prisma Accelerate) for schema changes
const DATABASE_URL = process.env.PRISMA_DATABASE_URL || process.env.POSTGRES_URL

if (!DATABASE_URL) {
  console.error('❌ Error: PRISMA_DATABASE_URL or POSTGRES_URL not set')
  process.exit(1)
}

// Extract direct connection URL (remove prisma+postgres:// prefix if present)
const directUrl = DATABASE_URL.includes('accelerate.prisma-data.net')
  ? process.env.POSTGRES_URL
  : DATABASE_URL

if (!directUrl) {
  console.error('❌ Error: Could not get direct database URL')
  process.exit(1)
}

const pool = new Pool({
  connectionString: directUrl,
  ssl: { rejectUnauthorized: false }
})

async function createPromoCodesTable() {
  console.log('🚀 Starting promo codes table creation...')
  console.log('📊 Database:', directUrl.split('@')[1]?.split('/')[0] || 'unknown')
  
  try {
    // Create promo_codes table
    console.log('\n📝 Creating promo_codes table...')
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "promo_codes" (
        "id" TEXT PRIMARY KEY,
        "code" TEXT UNIQUE NOT NULL,
        "discountType" TEXT NOT NULL,
        "discountPercent" DOUBLE PRECISION NOT NULL,
        "isActive" BOOLEAN NOT NULL DEFAULT true,
        "expiresAt" TIMESTAMP(3),
        "maxUses" INTEGER,
        "usedCount" INTEGER NOT NULL DEFAULT 0,
        "description" TEXT,
        "createdBy" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `)
    console.log('✅ promo_codes table created')

    // Create indexes for better query performance
    console.log('\n📝 Creating indexes...')
    
    await pool.query(`
      CREATE INDEX IF NOT EXISTS "promo_codes_code_idx" ON "promo_codes"("code");
    `)
    console.log('✅ Index created: promo_codes_code_idx')

    await pool.query(`
      CREATE INDEX IF NOT EXISTS "promo_codes_isActive_idx" ON "promo_codes"("isActive");
    `)
    console.log('✅ Index created: promo_codes_isActive_idx')

    await pool.query(`
      CREATE INDEX IF NOT EXISTS "promo_codes_expiresAt_idx" ON "promo_codes"("expiresAt");
    `)
    console.log('✅ Index created: promo_codes_expiresAt_idx')

    // Insert default promo codes
    console.log('\n📝 Adding default promo codes...')
    
    const defaultPromoCodes = [
      {
        id: 'promo_welcome20',
        code: 'WELCOME20',
        discountType: 'QR_SIGNUP',
        discountPercent: 20.0,
        description: 'Welcome discount for new QR code registrations',
      },
      {
        id: 'promo_qr20',
        code: 'QR20',
        discountType: 'QR_SIGNUP',
        discountPercent: 20.0,
        description: 'QR code scan discount for new users',
      },
    ]

    for (const promo of defaultPromoCodes) {
      await pool.query(`
        INSERT INTO "promo_codes" 
          ("id", "code", "discountType", "discountPercent", "isActive", "description", "createdAt", "updatedAt")
        VALUES 
          ($1, $2, $3, $4, true, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        ON CONFLICT ("code") DO NOTHING;
      `, [promo.id, promo.code, promo.discountType, promo.discountPercent, promo.description])
      
      console.log(`✅ Promo code added: ${promo.code} (${promo.discountPercent}% off)`)
    }

    // Verify table and data
    console.log('\n📊 Verifying table structure...')
    const tableInfo = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'promo_codes'
      ORDER BY ordinal_position;
    `)
    
    console.log('\n✅ Table columns created:')
    tableInfo.rows.forEach(col => {
      console.log(`   • ${col.column_name} (${col.data_type}, nullable: ${col.is_nullable})`)
    })

    // Count promo codes
    const countResult = await pool.query('SELECT COUNT(*) as count FROM "promo_codes";')
    const count = countResult.rows[0]?.count || 0
    console.log(`\n✅ Total promo codes: ${count}`)

    console.log('\n🎉 Promo codes table creation completed successfully!')
    console.log('\n📋 Summary:')
    console.log('   ✓ Table: promo_codes')
    console.log('   ✓ Columns: 12 fields')
    console.log('   ✓ Indexes: 3 indexes')
    console.log(`   ✓ Default promo codes: ${defaultPromoCodes.length}`)
    console.log('\n🔗 QR Code URLs:')
    console.log('   • https://genosys.ae/signup?promo=WELCOME20')
    console.log('   • https://genosys.ae/signup?promo=QR20')

  } catch {
    console.error('❌ Error creating promo codes table:', error)
    throw error
  } finally {
    await pool.end()
  }
}

// Run the function
createPromoCodesTable()
  .then(() => {
    console.log('\n✅ Migration completed')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Migration failed:', error)
    process.exit(1)
  })
