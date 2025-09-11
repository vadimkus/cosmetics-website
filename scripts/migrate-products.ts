import { PrismaClient } from '@prisma/client'
import { products } from '../lib/products'

const prisma = new PrismaClient()

async function migrateProducts() {
  try {
    console.log('🚀 Starting product migration...')
    
    // Clear existing products
    console.log('🧹 Clearing existing products...')
    await prisma.product.deleteMany({})
    
    // Insert all products
    console.log('📦 Inserting products...')
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
      console.log(`✅ Migrated: ${product.name}`)
    }
    
    console.log(`🎉 Successfully migrated ${products.length} products to database!`)
    
    // Verify migration
    const count = await prisma.product.count()
    console.log(`📊 Total products in database: ${count}`)
    
  } catch (error) {
    console.error('❌ Migration failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

migrateProducts()
