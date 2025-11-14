const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function updateAllRatings() {
  try {
    console.log('🚀 Updating all products to 5.0 rating...')
    
    // First, let's add the rating column if it doesn't exist (migration)
    // We'll use raw SQL to add the column safely
    try {
      await prisma.$executeRawUnsafe(`
        ALTER TABLE products 
        ADD COLUMN IF NOT EXISTS rating DOUBLE PRECISION DEFAULT 5.0;
      `)
      console.log('✅ Rating column added/verified')
    } catch (error) {
      console.log('⚠️ Column might already exist or migration needed:', error.message)
    }
    
    // Update all products to have rating 5.0
    const result = await prisma.product.updateMany({
      data: {
        rating: 5.0
      }
    })
    
    console.log(`✅ Updated ${result.count} products to 5.0 rating`)
    
    // Verify
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        rating: true
      },
      take: 5
    })
    
    console.log('\n📊 Sample products with ratings:')
    products.forEach(p => {
      console.log(`   ${p.name}: ${p.rating}/5`)
    })
    
    const totalCount = await prisma.product.count()
    console.log(`\n✅ Total products: ${totalCount}`)
    
  } catch (error) {
    console.error('❌ Error updating ratings:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

updateAllRatings()
  .then(() => {
    console.log('\n🎉 All products updated to 5.0 rating!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Failed:', error)
    process.exit(1)
  })

