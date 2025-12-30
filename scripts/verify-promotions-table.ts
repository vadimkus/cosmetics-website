/**
 * Verify that the promotions table exists in the database
 * Run this script to check if the migration was successful
 */

import { PrismaClient } from '@prisma/client'

async function verifyPromotionsTable() {
  const prisma = new PrismaClient()
  
  try {
    console.log('🔍 Checking if promotions table exists...\n')
    
    // Try to query the promotions table
    const count = await prisma.promotion.count()
    console.log(`✅ Promotions table exists! Found ${count} promotion(s).\n`)
    
    // List all promotions
    const promotions = await prisma.promotion.findMany({
      orderBy: { date: 'desc' },
      take: 5,
    })
    
    if (promotions.length > 0) {
      console.log('📋 Recent promotions:')
      promotions.forEach((p, i) => {
        console.log(`  ${i + 1}. ${p.textEn.substring(0, 50)}... (Active: ${p.isActive})`)
      })
    } else {
      console.log('📋 No promotions found (table is empty).')
    }
    
    console.log('\n✅ Verification complete!')
  } catch (error: any) {
    const errorMessage = error?.message || String(error)
    
    if (errorMessage.includes('does not exist') || 
        errorMessage.includes('Unknown table') || 
        errorMessage.includes('promotions') ||
        errorMessage.includes('relation') ||
        errorMessage.includes('Table')) {
      console.error('❌ Promotions table does NOT exist!\n')
      console.error('🔧 To fix this, run:')
      console.error('   npx prisma db push\n')
      console.error('Or apply the migration:')
      console.error('   npx prisma migrate deploy\n')
    } else {
      console.error('❌ Error checking promotions table:', errorMessage)
      console.error('\nFull error:', error)
    }
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

verifyPromotionsTable()


