#!/usr/bin/env node

/**
 * Migration script to add payment-related fields to the orders table
 * This script adds Stripe payment fields to existing orders
 */

import { PrismaClient } from '@prisma/client'
import { debugLog, errorLog, warnLog } from '../lib/logger'

const prisma = new PrismaClient()

async function addPaymentFields() {
  try {
    console.log('🔄 Starting payment fields migration...')
    
    // Check if we're using a direct database connection or need to use raw SQL
    console.log('📊 Checking database connection...')
    
    // First, let's see if the fields already exist by trying to query them
    try {
      await prisma.$queryRaw`SELECT payment_method FROM orders LIMIT 1`
      console.log('✅ Payment fields already exist in database')
      return
    } catch (error) {
      console.log('📝 Payment fields do not exist yet, proceeding with migration...')
    }
    
    // Add the new columns with default values
    console.log('🔧 Adding payment_method column...')
    await prisma.$executeRaw`
      ALTER TABLE orders 
      ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50) DEFAULT 'cod'
    `
    
    console.log('🔧 Adding payment_status column...')
    await prisma.$executeRaw`
      ALTER TABLE orders 
      ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'pending'
    `
    
    console.log('🔧 Adding stripe_session_id column...')
    await prisma.$executeRaw`
      ALTER TABLE orders 
      ADD COLUMN IF NOT EXISTS stripe_session_id VARCHAR(255)
    `
    
    console.log('🔧 Adding stripe_payment_intent_id column...')
    await prisma.$executeRaw`
      ALTER TABLE orders 
      ADD COLUMN IF NOT EXISTS stripe_payment_intent_id VARCHAR(255)
    `
    
    console.log('🔧 Adding stripe_customer_id column...')
    await prisma.$executeRaw`
      ALTER TABLE orders 
      ADD COLUMN IF NOT EXISTS stripe_customer_id VARCHAR(255)
    `
    
    console.log('🔧 Adding paid_at column...')
    await prisma.$executeRaw`
      ALTER TABLE orders 
      ADD COLUMN IF NOT EXISTS paid_at TIMESTAMP WITH TIME ZONE
    `
    
    console.log('🔧 Adding refunded_at column...')
    await prisma.$executeRaw`
      ALTER TABLE orders 
      ADD COLUMN IF NOT EXISTS refunded_at TIMESTAMP WITH TIME ZONE
    `
    
    console.log('🔧 Adding refund_amount column...')
    await prisma.$executeRaw`
      ALTER TABLE orders 
      ADD COLUMN IF NOT EXISTS refund_amount DECIMAL(10,2)
    `
    
    console.log('🔧 Adding payment_metadata column...')
    await prisma.$executeRaw`
      ALTER TABLE orders 
      ADD COLUMN IF NOT EXISTS payment_metadata TEXT
    `
    
    // Create indexes for better performance
    console.log('📊 Creating indexes for payment fields...')
    
    try {
      await prisma.$executeRaw`
        CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_payment_status 
        ON orders(payment_status)
      `
    } catch (error) {
      // Index might already exist or be created without CONCURRENTLY
      await prisma.$executeRaw`
        CREATE INDEX IF NOT EXISTS idx_orders_payment_status 
        ON orders(payment_status)
      `
    }
    
    try {
      await prisma.$executeRaw`
        CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_stripe_session_id 
        ON orders(stripe_session_id)
      `
    } catch (error) {
      await prisma.$executeRaw`
        CREATE INDEX IF NOT EXISTS idx_orders_stripe_session_id 
        ON orders(stripe_session_id)
      `
    }
    
    try {
      await prisma.$executeRaw`
        CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_stripe_payment_intent_id 
        ON orders(stripe_payment_intent_id)
      `
    } catch (error) {
      await prisma.$executeRaw`
        CREATE INDEX IF NOT EXISTS idx_orders_stripe_payment_intent_id 
        ON orders(stripe_payment_intent_id)
      `
    }
    
    // Update existing orders to have proper payment status
    console.log('🔄 Updating existing orders...')
    const updateResult = await prisma.$executeRaw`
      UPDATE orders 
      SET 
        payment_method = 'cod',
        payment_status = CASE 
          WHEN status = 'DELIVERED' THEN 'paid'
          WHEN status = 'CANCELLED' THEN 'cancelled'
          ELSE 'pending'
        END
      WHERE payment_method IS NULL OR payment_status = 'pending'
    `
    
    console.log(`✅ Updated ${updateResult} existing orders`)
    
    // Verify the migration
    console.log('🔍 Verifying migration...')
    const sampleOrder = await prisma.$queryRaw`
      SELECT payment_method, payment_status, stripe_session_id 
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