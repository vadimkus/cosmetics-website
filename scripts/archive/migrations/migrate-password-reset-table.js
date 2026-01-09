/**
 * Migration script to ensure password_reset_tokens table exists
 * This can be run manually or via API endpoint
 * Run with: node scripts/migrate-password-reset-table.js
 */

const { PrismaClient } = require('@prisma/client')
const { execSync } = require('child_process')

const prisma = new PrismaClient()

async function ensurePasswordResetTable() {
  try {
    console.log('🚀 Starting password reset table migration...\n')

    // Check if table exists by trying to query it
    try {
      const testQuery = await prisma.$queryRaw`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'password_reset_tokens'
        );
      `
      const tableExists = testQuery[0]?.exists || false

      if (tableExists) {
        console.log('✅ password_reset_tokens table already exists')
        
        // Check if it has the correct structure
        const columns = await prisma.$queryRaw`
          SELECT column_name, data_type 
          FROM information_schema.columns 
          WHERE table_name = 'password_reset_tokens'
          ORDER BY ordinal_position;
        `
        console.log('\n📋 Table structure:')
        columns.forEach((col) => {
          console.log(`   - ${col.column_name}: ${col.data_type}`)
        })

        // Check indexes
        const indexes = await prisma.$queryRaw`
          SELECT indexname 
          FROM pg_indexes 
          WHERE tablename = 'password_reset_tokens';
        `
        console.log('\n📋 Indexes:')
        if (indexes.length > 0) {
          indexes.forEach((idx) => {
            console.log(`   - ${idx.indexname}`)
          })
        } else {
          console.log('   ⚠️  No indexes found')
        }

        // Count existing tokens
        const tokenCount = await prisma.passwordResetToken.count()
        console.log(`\n📊 Existing tokens in table: ${tokenCount}`)
        
        console.log('\n✅ Migration check completed - table exists and is ready')
        return true
      } else {
        console.log('❌ password_reset_tokens table does not exist')
        console.log('📋 Running Prisma db push to create the table...\n')
        
        // Run prisma db push to sync schema
        execSync('npx prisma db push --skip-generate', { 
          stdio: 'inherit',
          cwd: process.cwd()
        })
        
        console.log('\n✅ Table created successfully')
        return true
      }
    } catch (error) {
      console.error('❌ Error checking table:', error)
      
      // Try to create table using db push
      console.log('\n📋 Attempting to create table via Prisma db push...')
      try {
        execSync('npx prisma db push --skip-generate', { 
          stdio: 'inherit',
          cwd: process.cwd()
        })
        console.log('\n✅ Table creation attempted')
        return true
      } catch (pushError) {
        console.error('❌ Failed to create table:', pushError)
        return false
      }
    }
  } catch (error) {
    console.error('❌ Migration failed:', error)
    return false
  } finally {
    await prisma.$disconnect()
  }
}

// Run migration
ensurePasswordResetTable()
  .then((success) => {
    if (success) {
      console.log('\n✅ Migration completed successfully!')
      process.exit(0)
    } else {
      console.log('\n❌ Migration failed')
      process.exit(1)
    }
  })
  .catch((error) => {
    console.error('❌ Fatal error:', error)
    process.exit(1)
  })

