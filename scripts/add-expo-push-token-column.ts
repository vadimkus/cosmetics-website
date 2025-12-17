import { Pool } from 'pg'

const DATABASE_URL = "postgres://bba1d642802ecf0af6b89802617217c7ee4bd9e45a9df009f7fcc332176072e7:sk_-vf4T6G2TVhfLC4FwIJsi@db.prisma.io:5432/postgres?sslmode=require"

/**
 * Add expoPushToken column to users table
 * 
 * Purpose: Store Expo push notification tokens for mobile app users to enable real-time notifications.
 * 
 * Column: expoPushToken TEXT (nullable)
 * Format: ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]
 * Usage: Send push notifications for order updates, promotions, etc.
 */
async function addExpoPushTokenColumn() {
  const pool = new Pool({
    connectionString: DATABASE_URL,
  })

  try {
    console.log('🔍 Checking for existing expoPushToken column in users table...')
    
    // Check if expoPushToken column exists
    const checkColumn = await pool.query(`
      SELECT column_name, data_type, is_nullable, character_maximum_length
      FROM information_schema.columns
      WHERE table_name = 'users'
      AND column_name = 'expoPushToken';
    `)

    if (checkColumn.rows.length > 0) {
      console.log('✅ Column "expoPushToken" already exists in users table')
      console.log('   Details:', {
        type: checkColumn.rows[0].data_type,
        nullable: checkColumn.rows[0].is_nullable,
        maxLength: checkColumn.rows[0].character_maximum_length || 'unlimited'
      })
    } else {
      console.log('➕ Adding "expoPushToken" column to users table...')
      await pool.query(`
        ALTER TABLE "users" 
        ADD COLUMN IF NOT EXISTS "expoPushToken" TEXT;
      `)
      console.log('✅ Successfully added "expoPushToken" column!')

      // Verify the column was added
      console.log('\n🔍 Verifying column was added...')
      const verifyColumn = await pool.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'users'
        AND column_name = 'expoPushToken';
      `)

      if (verifyColumn.rows.length > 0) {
        console.log('✅ Column verified:')
        console.log(`   - ${verifyColumn.rows[0].column_name}: ${verifyColumn.rows[0].data_type} (nullable: ${verifyColumn.rows[0].is_nullable})`)
      }
    }

    console.log('\n✅ Database migration completed successfully!')
    console.log('\n📝 Summary:')
    console.log('   - expoPushToken: TEXT (nullable) ✓')
    console.log('\n💡 Use cases:')
    console.log('   - Order status updates: "Your order has shipped!"')
    console.log('   - Delivery notifications: "Out for delivery"')
    console.log('   - Promotions: "20% off sale now live"')
    console.log('   - Abandoned cart: "Complete your order"')
    console.log('\n📱 Token format:')
    console.log('   ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]')
    console.log('\n🔒 Privacy:')
    console.log('   - Token cleared on logout')
    console.log('   - Token cleared on account deletion')
    console.log('   - User can disable push notifications')

    await pool.end()
    process.exit(0)
  } catch (error) {
    console.error('❌ Error adding expoPushToken column:', error)
    await pool.end()
    process.exit(1)
  }
}

addExpoPushTokenColumn()
