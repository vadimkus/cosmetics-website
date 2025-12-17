import { Pool } from 'pg'

const DATABASE_URL = "postgres://bba1d642802ecf0af6b89802617217c7ee4bd9e45a9df009f7fcc332176072e7:sk_-vf4T6G2TVhfLC4FwIJsi@db.prisma.io:5432/postgres?sslmode=require"

async function checkProfilePictureColumn() {
  const pool = new Pool({
    connectionString: DATABASE_URL,
  })

  try {
    console.log('🔌 Connecting to database...')
    
    // Check if profilePicture column exists
    const checkColumn = await pool.query(`
      SELECT column_name, data_type, is_nullable, character_maximum_length
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      AND column_name = 'profilePicture';
    `)
    
    if (checkColumn.rows.length > 0) {
      const col = checkColumn.rows[0]
      console.log('✅ Column "profilePicture" exists in users table')
      console.log('\n📋 Column details:')
      console.log(`   - Name: ${col.column_name}`)
      console.log(`   - Type: ${col.data_type}`)
      console.log(`   - Nullable: ${col.is_nullable}`)
      console.log(`   - Max Length: ${col.character_maximum_length || 'unlimited (TEXT)'}`)
      console.log('\n✨ No migration needed - column already exists!')
    } else {
      console.log('❌ Column "profilePicture" NOT FOUND in users table')
      console.log('\n➕ Adding "profilePicture" column...')
      
      // Add the profilePicture column (nullable TEXT)
      await pool.query(`
        ALTER TABLE "users" 
        ADD COLUMN IF NOT EXISTS "profilePicture" TEXT;
      `)
      
      console.log('✅ Successfully added "profilePicture" column!')
      
      // Verify it was added
      const verifyColumn = await pool.query(`
        SELECT column_name, data_type, is_nullable 
        FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND column_name = 'profilePicture';
      `)
      
      if (verifyColumn.rows.length > 0) {
        const col = verifyColumn.rows[0]
        console.log('\n📋 New column details:')
        console.log(`   - Name: ${col.column_name}`)
        console.log(`   - Type: ${col.data_type}`)
        console.log(`   - Nullable: ${col.is_nullable}`)
        console.log('\n✨ Migration completed successfully!')
      }
    }
    
  } catch (error) {
    console.error('❌ Error checking/adding profilePicture column:', error)
    throw error
  } finally {
    await pool.end()
    console.log('🔌 Database connection closed')
  }
}

checkProfilePictureColumn()
  .then(() => {
    console.log('\n🎉 Done! Users can now save profile pictures.')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Migration failed:', error)
    process.exit(1)
  })


