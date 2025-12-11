#!/usr/bin/env node

/**
 * Migration script to add payment-related fields to the orders table
 * This script adds Stripe payment fields to existing orders
 */

import { PrismaClient } from '@prisma/client'
import { debugLog, errorLog, warnLog } from '../lib/logger'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })
dotenv.config({ path: '.env' })

// Initialize Prisma client with proper configuration for Prisma 7
const databaseUrl = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error('Database URL not found in environment variables')
}

console.log('🔗 Using database URL:', databaseUrl.includes('prisma+') ? 'Prisma Accelerate' : 'Direct PostgreSQL')

let prisma: PrismaClient

if (databaseUrl.startsWith('prisma+')) {
  // Using Prisma Accelerate
  prisma = new PrismaClient({
    accelerateUrl: databaseUrl,
    log: ['error', 'warn'],
  })
} else {
  // Using direct PostgreSQL connection with adapter
  const { PrismaPg } = require('@prisma/adapter-pg')
  const { Pool } = require('pg')
  const pool = new Pool({ connectionString: databaseUrl })
  const adapter = new PrismaPg(pool)
  
  prisma = new PrismaClient({
    adapter,
    log: ['error', 'warn'],
  })
}

async function addPaymentFields() {
  try {
    console.log('🔄 Starting payment fields migration...')
    
    // Check if we're using a direct database connection or need to use raw SQL
    console.log('📊 Checking database connection...')
    
    // First, let's see if the fields already exist by trying to query them
    try {
      await prisma.$queryRaw`SELECT "paymentMethod" FROM orders LIMIT 1`
      console.log('✅ Payment fields already exist in database')
      return
    } catch (error) {
      console.log('📝 Payment fields do not exist yet, proceeding with migration...')
    }
    
    // Add the new columns with default values
    console.log('🔧 Adding paymentMethod column...')
    await prisma.$executeRaw`
      ALTER TABLE orders 
      ADD COLUMN IF NOT EXISTS "paymentMethod" VARCHAR(50) DEFAULT 'cod'
    `
    
    console.log('🔧 Adding paymentStatus column...')
    await prisma.$executeRaw`
      ALTER TABLE orders 
      ADD COLUMN IF NOT EXISTS "paymentStatus" VARCHAR(50) DEFAULT 'pending'
    `
    
    console.log('🔧 Adding stripeSessionId column...')
    await prisma.$executeRaw`
      ALTER TABLE orders 
      ADD COLUMN IF NOT EXISTS "stripeSessionId" VARCHAR(255)
    `
    
    console.log('🔧 Adding stripePaymentIntentId column...')
    await prisma.$executeRaw`
      ALTER TABLE orders 
      ADD COLUMN IF NOT EXISTS "stripePaymentIntentId" VARCHAR(255)
    `
    
    console.log('🔧 Adding stripeCustomerId column...')
    await prisma.$executeRaw`
      ALTER TABLE orders 
      ADD COLUMN IF NOT EXISTS "stripeCustomerId" VARCHAR(255)
    `
    
    console.log('🔧 Adding paidAt column...')
    await prisma.$executeRaw`
      ALTER TABLE orders 
      ADD COLUMN IF NOT EXISTS "paidAt" TIMESTAMP WITH TIME ZONE
    `
    
    console.log('🔧 Adding refundedAt column...')
    await prisma.$executeRaw`
      ALTER TABLE orders 
      ADD COLUMN IF NOT EXISTS "refundedAt" TIMESTAMP WITH TIME ZONE
    `
    
    console.log('🔧 Adding refundAmount column...')
    await prisma.$executeRaw`
      ALTER TABLE orders 
      ADD COLUMN IF NOT EXISTS "refundAmount" DECIMAL(10,2)
    `
    
    console.log('🔧 Adding paymentMetadata column...')
    await prisma.$executeRaw`
      ALTER TABLE orders 
      ADD COLUMN IF NOT EXISTS "paymentMetadata" TEXT
    `
    
    // Create indexes for better performance
    console.log('📊 Creating indexes for payment fields...')
    
    try {
      await prisma.$executeRaw`
        CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_payment_status 
        ON orders("paymentStatus")
      `
    } catch (error) {
      // Index might already exist or be created without CONCURRENTLY
      await prisma.$executeRaw`
        CREATE INDEX IF NOT EXISTS idx_orders_payment_status 
        ON orders("paymentStatus")
      `
    }
    
    try {
      await prisma.$executeRaw`
        CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_stripe_session_id 
        ON orders("stripeSessionId")
      `
    } catch (error) {
      await prisma.$executeRaw`
        CREATE INDEX IF NOT EXISTS idx_orders_stripe_session_id 
        ON orders("stripeSessionId")
      `
    }
    
    try {
      await prisma.$executeRaw`
        CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_stripe_payment_intent_id 
        ON orders("stripePaymentIntentId")
      `
    } catch (error) {
      await prisma.$executeRaw`
        CREATE INDEX IF NOT EXISTS idx_orders_stripe_payment_intent_id 
        ON orders("stripePaymentIntentId")
      `
    }
    
    // Update existing orders to have proper payment status
    console.log('🔄 Updating existing orders...')
    const updateResult = await prisma.$executeRaw`
      UPDATE orders 
      SET 
        "paymentMethod" = 'cod',
        "paymentStatus" = CASE 
          WHEN status = 'DELIVERED' THEN 'paid'
          WHEN status = 'CANCELLED' THEN 'cancelled'
          ELSE 'pending'
        END
      WHERE "paymentMethod" IS NULL OR "paymentStatus" = 'pending'
    `
    
    console.log(`✅ Updated ${updateResult} existing orders`)
    
    // Verify the migration
    console.log('🔍 Verifying migration...')
    const sampleOrder = await prisma.$queryRaw`
      SELECT "paymentMethod", "paymentStatus", "stripeSessionId"
      FROM orders 
      LIMIT 1
    `
    
    console.log('✅ Sample order fields:', sampleOrder)
    
    console.log('✅ Payment fields migration completed successfully!')
    
    // Regenerate Prisma client to include new fields
    console.log('🔄 Regenerating Prisma client...')
    const { exec } = await import('child_process')
    const { promisify } = await import('util')
    const execAsync = promisify(exec)
    
    await execAsync('npx prisma generate')
    console.log('✅ Prisma client regenerated')
    
  } catch (error) {
    errorLog('❌ Migration failed:', error)
    console.error('Migration error details:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the migration if this script is called directly
if (require.main === module) {
  addPaymentFields()
    .then(() => {
      console.log('🎉 Migration completed successfully!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Migration failed:', error)
      process.exit(1)
    })
}

export { addPaymentFields }