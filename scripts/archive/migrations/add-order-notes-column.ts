import { Pool } from 'pg'

const DATABASE_URL = "postgres://bba1d642802ecf0af6b89802617217c7ee4bd9e45a9df009f7fcc332176072e7:sk_-vf4T6G2TVhfLC4FwIJsi@db.prisma.io:5432/postgres?sslmode=require"

/**
 * Add orderNotes column to orders table
 * 
 * Purpose: Store customer notes/comments for orders during checkout.
 * Examples: "Please deliver after 6 PM", "Gift wrapping requested", "Leave at door"
 * 
 * Column: orderNotes TEXT (nullable)
 */
async function addOrderNotesColumn() {
  const pool = new Pool({
    connectionString: DATABASE_URL,
  })

  try {
    console.log('🔍 Checking for existing orderNotes column in orders table...')
    
    // Check if orderNotes column exists
    const checkColumn = await pool.query(`
      SELECT column_name, data_type, is_nullable, character_maximum_length
      FROM information_schema.columns
      WHERE table_name = 'orders'
      AND column_name = 'orderNotes';
    `)

    if (checkColumn.rows.length > 0) {
      console.log('✅ Column "orderNotes" already exists in orders table')
      console.log('   Details:', {
        type: checkColumn.rows[0].data_type,
        nullable: checkColumn.rows[0].is_nullable,
        maxLength: checkColumn.rows[0].character_maximum_length || 'unlimited'
      })
    } else {
      console.log('➕ Adding "orderNotes" column to orders table...')
      await pool.query(`
        ALTER TABLE "orders" 
        ADD COLUMN IF NOT EXISTS "orderNotes" TEXT;
      `)
      console.log('✅ Successfully added "orderNotes" column!')

      // Verify the column was added
      console.log('\n🔍 Verifying column was added...')
      const verifyColumn = await pool.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'orders'
        AND column_name = 'orderNotes';
      `)

      if (verifyColumn.rows.length > 0) {
        console.log('✅ Column verified:')
        console.log(`   - ${verifyColumn.rows[0].column_name}: ${verifyColumn.rows[0].data_type} (nullable: ${verifyColumn.rows[0].is_nullable})`)
      }
    }

    console.log('\n✅ Database migration completed successfully!')
    console.log('\n📝 Summary:')
    console.log('   - orderNotes: TEXT (nullable) ✓')
    console.log('\n💡 Use cases:')
    console.log('   - Delivery instructions: "Please deliver after 6 PM"')
    console.log('   - Special requests: "Gift wrapping requested"')
    console.log('   - Customer comments: "Leave package at reception"')
    console.log('   - Address clarifications: "Building B, second entrance"')

    await pool.end()
    process.exit(0)
  } catch (error) {
    console.error('❌ Error adding orderNotes column:', error)
    await pool.end()
    process.exit(1)
  }
}

addOrderNotesColumn()




