/**
 * Migration script for PWA Push Notifications tables
 * 
 * Creates:
 * - push_subscriptions - Web Push subscriptions for PWA users
 * - pwa_notifications - Notifications sent by admin
 * - notification_reads - Track which users have read which notifications
 * 
 * Usage: DATABASE_URL="postgres://..." node scripts/migrate-push-notifications-tables.js
 */

const { Client } = require('pg')

async function main() {
  const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL
  
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL or POSTGRES_URL environment variable is required')
    process.exit(1)
  }
  
  const client = new Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false }
  })
  
  try {
    console.log('🔌 Connecting to database...')
    await client.connect()
    console.log('✅ Connected!')
    
    console.log('')
    console.log('🚀 Starting push notifications tables migration...')
    
    // Check if tables already exist
    const tableCheck = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('push_subscriptions', 'pwa_notifications', 'notification_reads')
    `)
    
    const existingTables = tableCheck.rows.map(t => t.table_name)
    console.log('Existing tables:', existingTables.length > 0 ? existingTables : 'none')
    
    // Create push_subscriptions table
    if (!existingTables.includes('push_subscriptions')) {
      console.log('')
      console.log('Creating push_subscriptions table...')
      await client.query(`
        CREATE TABLE IF NOT EXISTS push_subscriptions (
          id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
          "userId" TEXT NOT NULL,
          endpoint TEXT UNIQUE NOT NULL,
          p256dh TEXT NOT NULL,
          auth TEXT NOT NULL,
          "userAgent" TEXT,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
      `)
      await client.query(`CREATE INDEX IF NOT EXISTS push_subscriptions_userId_idx ON push_subscriptions("userId")`)
      console.log('✅ push_subscriptions table created')
    } else {
      console.log('⏭️ push_subscriptions table already exists')
    }
    
    // Create pwa_notifications table
    if (!existingTables.includes('pwa_notifications')) {
      console.log('')
      console.log('Creating pwa_notifications table...')
      await client.query(`
        CREATE TABLE IF NOT EXISTS pwa_notifications (
          id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
          "promotionId" TEXT,
          title TEXT NOT NULL,
          "titleRu" TEXT,
          "titleAr" TEXT,
          body TEXT NOT NULL,
          "bodyRu" TEXT,
          "bodyAr" TEXT,
          url TEXT,
          "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "sentBy" TEXT,
          "totalSent" INTEGER NOT NULL DEFAULT 0,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
      `)
      await client.query(`CREATE INDEX IF NOT EXISTS pwa_notifications_sentAt_idx ON pwa_notifications("sentAt")`)
      console.log('✅ pwa_notifications table created')
    } else {
      console.log('⏭️ pwa_notifications table already exists')
    }
    
    // Create notification_reads table
    if (!existingTables.includes('notification_reads')) {
      console.log('')
      console.log('Creating notification_reads table...')
      await client.query(`
        CREATE TABLE IF NOT EXISTS notification_reads (
          id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
          "notificationId" TEXT NOT NULL,
          "userId" TEXT NOT NULL,
          "readAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT notification_reads_notificationId_fkey FOREIGN KEY ("notificationId") REFERENCES pwa_notifications(id) ON DELETE CASCADE ON UPDATE CASCADE
        )
      `)
      await client.query(`CREATE UNIQUE INDEX IF NOT EXISTS notification_reads_notificationId_userId_key ON notification_reads("notificationId", "userId")`)
      await client.query(`CREATE INDEX IF NOT EXISTS notification_reads_userId_idx ON notification_reads("userId")`)
      await client.query(`CREATE INDEX IF NOT EXISTS notification_reads_notificationId_idx ON notification_reads("notificationId")`)
      console.log('✅ notification_reads table created')
    } else {
      console.log('⏭️ notification_reads table already exists')
    }
    
    console.log('')
    console.log('🎉 Migration completed successfully!')
    console.log('')
    console.log('Tables ready:')
    console.log('  - push_subscriptions: Stores PWA push subscriptions')
    console.log('  - pwa_notifications: Stores admin-sent notifications')
    console.log('  - notification_reads: Tracks read status per user')
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message)
    throw error
  } finally {
    await client.end()
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
