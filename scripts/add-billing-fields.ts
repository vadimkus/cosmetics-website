import { Pool } from 'pg'

const DATABASE_URL = "postgres://bba1d642802ecf0af6b89802617217c7ee4bd9e45a9df009f7fcc332176072e7:sk_-vf4T6G2TVhfLC4FwIJsi@db.prisma.io:5432/postgres?sslmode=require"

/**
 * Add billingAddress and vatNumber columns to users table
 * 
 * Purpose: Support business customers who need billing addresses and VAT numbers
 * for invoicing and tax purposes in the UAE.
 * 
 * Columns:
 * - billingAddress: TEXT (nullable) - Separate billing address if different from shipping
 * - vatNumber: TEXT (nullable) - UAE VAT registration number for business customers
 */
async function addBillingFields() {
  const pool = new Pool({
    connectionString: DATABASE_URL,
  })

  try {
    console.log('🔍 Checking for existing billing columns in users table...')
    
    // Check if billingAddress column exists
    const checkBillingAddress = await pool.query(`
      SELECT column_name, data_type, is_nullable, character_maximum_length
      FROM information_schema.columns
      WHERE table_name = 'users'
      AND column_name = 'billingAddress';
    `)

    // Check if vatNumber column exists
    const checkVatNumber = await pool.query(`
      SELECT column_name, data_type, is_nullable, character_maximum_length
      FROM information_schema.columns
      WHERE table_name = 'users'
      AND column_name = 'vatNumber';
    `)

    let needsBillingAddress = checkBillingAddress.rows.length === 0
    let needsVatNumber = checkVatNumber.rows.length === 0

    // Add billingAddress if needed
    if (needsBillingAddress) {
      console.log('➕ Adding "billingAddress" column to users table...')
      await pool.query(`
        ALTER TABLE "users" 
        ADD COLUMN IF NOT EXISTS "billingAddress" TEXT;
      `)
      console.log('✅ Successfully added "billingAddress" column!')
    } else {
      console.log('✅ Column "billingAddress" already exists in users table')
      console.log('   Details:', {
        type: checkBillingAddress.rows[0].data_type,
        nullable: checkBillingAddress.rows[0].is_nullable,
        maxLength: checkBillingAddress.rows[0].character_maximum_length || 'unlimited'
      })
    }

    // Add vatNumber if needed
    if (needsVatNumber) {
      console.log('➕ Adding "vatNumber" column to users table...')
      await pool.query(`
        ALTER TABLE "users" 
        ADD COLUMN IF NOT EXISTS "vatNumber" TEXT;
      `)
      console.log('✅ Successfully added "vatNumber" column!')
    } else {
      console.log('✅ Column "vatNumber" already exists in users table')
      console.log('   Details:', {
        type: checkVatNumber.rows[0].data_type,
        nullable: checkVatNumber.rows[0].is_nullable,
        maxLength: checkVatNumber.rows[0].character_maximum_length || 'unlimited'
      })
    }

    // Verify final state
    if (needsBillingAddress || needsVatNumber) {
      console.log('\n🔍 Verifying columns were added...')
      
      const verifyColumns = await pool.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'users'
        AND column_name IN ('billingAddress', 'vatNumber')
        ORDER BY column_name;
      `)

      console.log('✅ Final column state:')
      verifyColumns.rows.forEach(row => {
        console.log(`   - ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable})`)
      })
    }

    console.log('\n✅ Database migration completed successfully!')
    console.log('\n📝 Summary:')
    console.log('   - billingAddress: TEXT (nullable) ✓')
    console.log('   - vatNumber: TEXT (nullable) ✓')
    console.log('\n💡 Use cases:')
    console.log('   - billingAddress: For business customers with separate billing address')
    console.log('   - vatNumber: For UAE VAT-registered businesses (TRN format)')

    await pool.end()
    process.exit(0)
  } catch (error) {
    console.error('❌ Error adding billing fields:', error)
    await pool.end()
    process.exit(1)
  }
}

addBillingFields()




