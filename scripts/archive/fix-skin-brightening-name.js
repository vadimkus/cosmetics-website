const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function fixProductName() {
  try {
    console.log('🚀 Fixing product name for Skin Brightening Beauty Box...')
    
    // Find the product by product number
    const product = await prisma.product.findFirst({
      where: {
        productNumber: '56'
      }
    })
    
    if (!product) {
      console.error('❌ Product not found!')
      return
    }
    
    console.log(`📦 Found product: ${product.id}`)
    console.log(`   Current name: ${product.name}`)
    
    // Update product name
    const updatedProduct = await prisma.product.update({
      where: { id: product.id },
      data: {
        name: 'Skin Brightening Beauty Box'
      }
    })
    
    console.log('✅ Product name updated successfully!')
    console.log(`   New Name: ${updatedProduct.name}`)
    
  } catch (error) {
    console.error('❌ Error updating product:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

fixProductName()
  .then(() => {
    console.log('🎉 Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Failed:', error)
    process.exit(1)
  })

