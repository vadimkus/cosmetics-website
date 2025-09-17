import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function updateProduct49Price() {
  try {
    console.log('🚀 Updating product 49 price to 11000...')
    
    const updatedProduct = await prisma.product.update({
      where: { id: '49' },
      data: {
        price: 11000,
        updatedAt: new Date()
      }
    })
    
    console.log('✅ Successfully updated product 49:')
    console.log(`   Name: ${updatedProduct.name}`)
    console.log(`   Price: ${updatedProduct.price}`)
    console.log(`   Updated: ${updatedProduct.updatedAt}`)
    
  } catch (error) {
    console.error('❌ Update failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateProduct49Price()
