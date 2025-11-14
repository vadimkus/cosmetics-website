const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function updateProductNumber() {
  try {
    console.log('🚀 Updating product number for Problem Skin Care Beauty Box...')
    
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
    console.log(`   Current product number: ${product.productNumber}`)
    
    // Use product number 53 (next available)
    const productNumber = '53'
    
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
    if (error.code === 'P2002') {
      console.error('❌ Product number 53 is already taken! Trying 54...')
      // Try 54 instead
      const product = await prisma.product.findFirst({
        where: { name: 'GENOSYS Problem Skin Care Beauty Box' }
      })
      if (product) {
        const updatedProduct = await prisma.product.update({
          where: { id: product.id },
          data: { productNumber: '54' }
        })
        console.log('✅ Product updated to number 54!')
        console.log(`   URL: http://localhost:3000/products/${updatedProduct.productNumber}`)
      }
    } else {
      console.error('❌ Error updating product:', error)
      throw error
    }
  } finally {
    await prisma.$disconnect()
  }
}

updateProductNumber()
  .then(() => {
    console.log('🎉 Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Failed:', error)
    process.exit(1)
  })
