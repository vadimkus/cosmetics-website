import { Pool } from 'pg'

const DATABASE_URL = "postgres://bba1d642802ecf0af6b89802617217c7ee4bd9e45a9df009f7fcc332176072e7:sk_-vf4T6G2TVhfLC4FwIJsi@db.prisma.io:5432/postgres?sslmode=require"

async function addAppleSubColumn() {
  const pool = new Pool({
    connectionString: DATABASE_URL,
  })

  try {
    console.log('🔌 Connecting to database...')
    
    // Test connection
    const testResult = await pool.query('SELECT NOW()')
    console.log('✅ Connected successfully at:', testResult.rows[0].now)
    
    // Add appleSub column
    console.log('\n📝 Adding appleSub column...')
    await pool.query(`
      ALTER TABLE "users"
      ADD COLUMN IF NOT EXISTS "appleSub" TEXT;
    `)
    console.log('✅ appleSub column added (or already exists)')
    
    // Add unique index
    console.log('\n🔑 Creating unique index...')
    await pool.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "users_appleSub_key"
      ON "users" ("appleSub");
    `)
    console.log('✅ Unique index users_appleSub_key created (or already exists)')
    
    // Verify the changes
    console.log('\n🔍 Verifying changes...')
    const columnCheck = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'users' AND column_name = 'appleSub';
    `)
    
    if (columnCheck.rows.length > 0) {
      console.log('✅ Column exists:', columnCheck.rows[0])
    } else {
      console.log('❌ Column not found!')
    }
    
    const indexCheck = await pool.query(`
      SELECT indexname, indexdef
      FROM pg_indexes
      WHERE tablename = 'users' AND indexname = 'users_appleSub_key';
    `)
    
    if (indexCheck.rows.length > 0) {
      console.log('✅ Index exists:', indexCheck.rows[0].indexname)
    } else {
      console.log('❌ Index not found!')
    }
    
    console.log('\n🎉 Migration completed successfully!')
    
  } catch (error) {
    console.error('❌ Migration failed:', error)
    throw error
  } finally {
    await pool.end()
    console.log('\n🔌 Database connection closed')
  }
}

addAppleSubColumn()
