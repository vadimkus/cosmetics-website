import { Pool } from 'pg'

const DATABASE_URL = "postgres://bba1d642802ecf0af6b89802617217c7ee4bd9e45a9df009f7fcc332176072e7:sk_-vf4T6G2TVhfLC4FwIJsi@db.prisma.io:5432/postgres?sslmode=require"

async function addGenderColumn() {
  const pool = new Pool({
    connectionString: DATABASE_URL,
  })

  try {
    console.log('🔌 Connecting to database...')
    
    // Check if column already exists
    const checkColumn = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      AND column_name = 'gender';
    `)
    
    if (checkColumn.rows.length > 0) {
      console.log('✅ Column "gender" already exists in users table')
    } else {
      console.log('➕ Adding "gender" column to users table...')
      
      // Add the gender column (nullable, type TEXT)
      await pool.query(`
        ALTER TABLE "users" 
        ADD COLUMN IF NOT EXISTS "gender" TEXT;
      `)
      
      console.log('✅ Successfully added "gender" column!')
    }
    
    // Verify the column was added
    const verifyColumn = await pool.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      AND column_name = 'gender';
    `)
    
    if (verifyColumn.rows.length > 0) {
      const col = verifyColumn.rows[0]
      console.log('\n📋 Column details:')
      console.log(`   - Name: ${col.column_name}`)
      console.log(`   - Type: ${col.data_type}`)
      console.log(`   - Nullable: ${col.is_nullable}`)
      console.log('\n✨ Migration completed successfully!')
    } else {
      console.error('❌ Column verification failed')
    }
    
  } catch (error) {
    console.error('❌ Error adding gender column:', error)
    throw error
  } finally {
    await pool.end()
    console.log('🔌 Database connection closed')
  }
}

addGenderColumn()
  .then(() => {
    console.log('\n🎉 Done! Users can now save their gender preference.')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Migration failed:', error)
    process.exit(1)
  })


