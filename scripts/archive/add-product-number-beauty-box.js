const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function addProductNumber() {
  try {
    console.log('🚀 Adding product number to Problem Skin Care Beauty Box...')
    
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
    
    // Assign product number 47 (next available number after existing products)
    const productNumber = '47'
    
    const updatedProduct = await prisma.product.update({
      where: { id: product.id },
      data: {
        productNumber: productNumber
      }
    })
    
    console.log('✅ Product updated successfully!')
    console.log('📦 Updated product details:')
    console.log(`   ID: ${updatedProduct.id}`)
    console.log(`   Product Number: ${updatedProduct.productNumber}`)
    console.log(`   URL: http://localhost:3000/products/${updatedProduct.productNumber}`)
    
  } catch (error) {
    console.error('❌ Error updating product:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

addProductNumber()
  .then(() => {
    console.log('🎉 Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Failed:', error)
    process.exit(1)
  })

