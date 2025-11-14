const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function findAvailableProductNumber() {
  try {
    console.log('🔍 Finding available product number...')
    
    // Get all products with product numbers
    const products = await prisma.product.findMany({
      where: {
        productNumber: { not: null }
      },
      select: {
        productNumber: true,
        name: true
      },
      orderBy: {
        productNumber: 'asc'
      }
    })
    
    console.log('📦 Existing product numbers:')
    products.forEach(p => {
      console.log(`   ${p.productNumber}: ${p.name}`)
    })
    
    // Find the highest number
    const numbers = products
      .map(p => parseInt(p.productNumber || '0'))
      .filter(n => !isNaN(n))
      .sort((a, b) => b - a)
    
    const highestNumber = numbers.length > 0 ? numbers[0] : 0
    const nextAvailable = highestNumber + 1
    
    console.log(`\n✅ Next available product number: ${nextAvailable}`)
    
    // Update the beauty box
    const product = await prisma.product.findFirst({
      where: {
        name: 'GENOSYS Problem Skin Care Beauty Box'
      }
    })
    
    if (!product) {
      console.error('❌ Beauty box product not found!')
      return
    }
    
    const updatedProduct = await prisma.product.update({
      where: { id: product.id },
      data: {
        productNumber: nextAvailable.toString()
      }
    })
    
    console.log(`\n✅ Beauty box updated to product number: ${updatedProduct.productNumber}`)
    console.log(`   URL: http://localhost:3000/products/${updatedProduct.productNumber}`)
    
  } catch (error) {
    console.error('❌ Error:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

findAvailableProductNumber()
  .then(() => {
    console.log('\n🎉 Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Failed:', error)
    process.exit(1)
  })

