import { prisma } from '../lib/prisma'

async function checkProductDescription(productId: string) {
  try {
    // Try to find product by ID first
    let product = await prisma.product.findUnique({
      where: { id: productId }
    })
    
    // If not found, try by productNumber
    if (!product) {
      product = await prisma.product.findUnique({
        where: { productNumber: productId }
      })
    }
    
    if (!product) {
      console.error(`❌ Product not found: ${productId}`)
      process.exit(1)
    }
    
    console.log(`\n📦 Product: ${product.name}`)
    console.log(`   ID: ${product.id}`)
    console.log(`   Product Number: ${product.productNumber || 'N/A'}`)
    console.log(`\n📝 Current Description:`)
    console.log(product.description)
    console.log(`\n📏 Description Length: ${product.description.length} characters`)
    
    return product
  } catch {
    console.error(`❌ Error:`, error)
    throw error
  }
}

const productId = process.argv[2] || '4'

checkProductDescription(productId)
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error('Error:', error)
    process.exit(1)
  })

