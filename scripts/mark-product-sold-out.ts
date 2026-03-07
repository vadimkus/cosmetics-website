import { prisma } from '../lib/prisma'

async function markProductSoldOut(productIdentifier: string) {
  try {
    // Try to find product by ID first
    let product = await prisma.product.findUnique({
      where: { id: productIdentifier }
    })
    
    // If not found, try by productNumber
    if (!product) {
      product = await prisma.product.findUnique({
        where: { productNumber: productIdentifier }
      })
    }
    
    if (!product) {
      console.error(`❌ Product not found: ${productIdentifier}`)
      console.log('💡 Tip: Try using the product ID or productNumber')
      process.exit(1)
    }
    
    const updatedProduct = await prisma.product.update({
      where: { id: product.id },
      data: { inStock: false }
    })
    
    console.log(`✅ Product marked as sold out:`)
    console.log(`   ID: ${updatedProduct.id}`)
    console.log(`   Product Number: ${updatedProduct.productNumber || 'N/A'}`)
    console.log(`   Name: ${updatedProduct.name}`)
    console.log(`   In Stock: ${updatedProduct.inStock}`)
    return updatedProduct
  } catch (error) {
    console.error(`❌ Failed to update product ${productIdentifier}:`, error)
    throw error
  }
}

// Get product identifier from command line argument
const productIdentifier = process.argv[2]

if (!productIdentifier) {
  console.error('Usage: npx tsx scripts/mark-product-sold-out.ts <product-id-or-number>')
  process.exit(1)
}

markProductSoldOut(productIdentifier)
  .then(() => {
    console.log('Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Error:', error)
    process.exit(1)
  })
