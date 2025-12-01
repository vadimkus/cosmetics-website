#!/usr/bin/env node

/**
 * Migration script to change profilePicture and address columns from VARCHAR to TEXT
 * This allows storing large base64-encoded images and longer addresses
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function migrateColumnToText(tableName: string, columnName: string): Promise<boolean> {
  try {
    // Check current column type
    const result = await prisma.$queryRaw<Array<{ data_type: string }>>`
      SELECT data_type 
      FROM information_schema.columns 
      WHERE table_name = ${tableName} 
      AND column_name = ${columnName}
    `
    
    if (result.length === 0) {
      console.log(`⚠️  Column ${columnName} not found in ${tableName} table`)
      return false
    }
    
    const currentType = result[0].data_type
    console.log(`📊 ${columnName} current type: ${currentType}`)
    
    if (currentType === 'text') {
      console.log(`✅ ${columnName} is already TEXT type - no migration needed`)
      return true
    }
    
    if (currentType === 'character varying' || currentType === 'varchar') {
      console.log(`🔄 Converting ${columnName} from VARCHAR to TEXT...`)
      
      // Alter the column type to TEXT
      await prisma.$executeRawUnsafe(`
        ALTER TABLE ${tableName} 
        ALTER COLUMN "${columnName}" TYPE TEXT
      `)
      
      console.log(`✅ Successfully migrated ${columnName} column to TEXT`)
      return true
    } else {
      console.log(`⚠️  Unexpected column type for ${columnName}: ${currentType}`)
      console.log('   Manual migration may be required')
      return false
    }
  } catch (error) {
    console.error(`❌ Migration failed for ${columnName}:`, error)
    return false
  }
}

async function migrateUserColumns() {
  try {
    console.log('🔄 Starting migration: User table column type changes...')
    console.log('   - profilePicture: VARCHAR → TEXT (for large base64 images)')
    console.log('   - address: VARCHAR → TEXT (for longer addresses)\n')
    
    const profilePictureSuccess = await migrateColumnToText('users', 'profilePicture')
    const addressSuccess = await migrateColumnToText('users', 'address')
    
    if (profilePictureSuccess && addressSuccess) {
      console.log('\n✅ All migrations completed successfully!')
      console.log('✅ Users can now save larger profile pictures and longer addresses')
    } else {
      console.log('\n⚠️  Some migrations may have failed - check logs above')
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

migrateUserColumns()
  .then(() => {
    console.log('✅ Migration completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  })

