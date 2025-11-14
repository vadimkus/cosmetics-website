import { debugLog, errorLog } from '@/lib/logger'
import { PrismaClient } from '@prisma/client'
import { products } from '../lib/products'

const prisma = new PrismaClient()

async function migrateProducts() {
  try {
    debugLog('🚀 Starting product migration...')
    
    // Clear existing products
    debugLog('🧹 Clearing existing products...')
    await prisma.product.deleteMany({})
    
    // Insert all products
    debugLog('📦 Inserting products...')
    for (const product of products) {
      await prisma.product.create({
        data: {
          id: product.id,
          name: product.name,
          price: product.price,
          description: product.description,
          image: product.image,
          category: product.category,
          inStock: product.inStock,
          size: product.size || null,
        }
      })
      debugLog(`✅ Migrated: ${product.name}`)
    }
    
    debugLog(`🎉 Successfully migrated ${products.length} products to database!`)
    
    // Verify migration
    const count = await prisma.product.count()
    debugLog(`📊 Total products in database: ${count}`)
    
  } catch (error) {
    errorLog('❌ Migration failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

migrateProducts()
