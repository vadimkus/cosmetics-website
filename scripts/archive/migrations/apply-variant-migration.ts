/**
 * Apply Product Variant Migration
 * 
 * This script applies the ProductVariant table migration directly using Prisma Client.
 */

import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

// Initialize Prisma Client with proper Prisma 7 configuration
function initializePrisma() {
  // Try DATABASE_URL first, then PRISMA_DATABASE_URL, then POSTGRES_URL
  const databaseUrl = process.env.DATABASE_URL || 
                     process.env.PRISMA_DATABASE_URL || 
                     process.env.POSTGRES_URL
  
  if (!databaseUrl) {
    throw new Error('No database URL found. Set DATABASE_URL, PRISMA_DATABASE_URL, or POSTGRES_URL')
  }
  
  console.log(`🔗 Connecting to database: ${databaseUrl.substring(0, 30)}...`)
  
  
  // Check if using Prisma Accelerate
  const isAccelerate = databaseUrl.startsWith('prisma+')
  
  if (isAccelerate) {
    return new PrismaClient({
      accelerateUrl: databaseUrl,
      log: ['error']
    })
  } else {
    // Regular PostgreSQL connection - use adapter
    const { PrismaPg } = require('@prisma/adapter-pg')
    const { Pool } = require('pg')
    const pool = new Pool({ connectionString: databaseUrl })
    const adapter = new PrismaPg(pool)
    return new PrismaClient({
      adapter,
      log: ['error']
    })
  }
}

const prisma = initializePrisma()

async function main() {
  console.log('🚀 Applying ProductVariant migration...\n')
  
  try {
    // Read the migration SQL file
    const migrationPath = path.join(
      process.cwd(), 
      'prisma/migrations/20251213213637_add_product_variants/migration.sql'
    )
    
    console.log(`📄 Reading migration file: ${migrationPath}`)
    const migrationSQL = fs.readFileSync(migrationPath, 'utf-8')
    
    console.log('📝 Migration SQL:')
    console.log(migrationSQL)
    console.log('')
    
    // Execute the migration
    console.log('⚙️  Executing migration...')
    await prisma.$executeRawUnsafe(migrationSQL)
    
    console.log('✅ Migration applied successfully!')
    console.log('✨ ProductVariant table created!')
    
  } catch (error) {
    if (error instanceof Error && error.message.includes('already exists')) {
      console.log('ℹ️  Table already exists, skipping migration.')
    } else {
      console.error('❌ Error applying migration:', error)
      throw error
    }
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch((error) => {
    console.error('Fatal error:', error)
    process.exit(1)
  })

