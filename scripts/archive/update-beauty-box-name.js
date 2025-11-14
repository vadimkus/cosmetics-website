const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function updateProductName() {
  try {
    console.log('🚀 Updating product name for Problem Skin Care Beauty Box...')
    
    // Find the product by name
    const product = await prisma.product.findFirst({
      where: {
        name: 'GENOSYS Problem Skin Care Beauty Box'
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
        name: 'Problem Skin Care Beauty Box'
      }
    })
    
    console.log('✅ Product updated successfully!')
    console.log('📦 Updated product details:')
    console.log(`   ID: ${updatedProduct.id}`)
    console.log(`   Product Number: ${updatedProduct.productNumber}`)
    console.log(`   New Name: ${updatedProduct.name}`)
    
  } catch (error) {
    console.error('❌ Error updating product:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

updateProductName()
  .then(() => {
    console.log('🎉 Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Failed:', error)
    process.exit(1)
  })

