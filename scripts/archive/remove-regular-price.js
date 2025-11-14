const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function removeRegularPrice() {
  try {
    console.log('🚀 Removing Regular price from Problem Skin Care Beauty Box...')
    
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
    
    // Get current description
    const currentDescription = product.description
    
    // Remove "Regular price: 1,318 AED | " from the pricing line
    const updatedDescription = currentDescription.replace(
      /Regular price: [\d,]+\s+AED\s+\|\s+/g,
      ''
    )
    
    const updatedProduct = await prisma.product.update({
      where: { id: product.id },
      data: {
        description: updatedDescription
      }
    })
    
    console.log('✅ Product updated successfully!')
    console.log('📦 Updated pricing display:')
    console.log('   Regular price removed')
    
  } catch (error) {
    console.error('❌ Error updating product:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

removeRegularPrice()
  .then(() => {
    console.log('🎉 Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Failed:', error)
    process.exit(1)
  })

