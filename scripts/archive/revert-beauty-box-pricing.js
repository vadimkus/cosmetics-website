const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function revertProblemSkinBeautyBoxPricing() {
  try {
    console.log('🚀 Reverting Problem Skin Care Beauty Box pricing display...')
    
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
    
    // Calculate pricing
    const individualPrices = 330 + 260 + 330 + 290 + 108 // 1318 AED
    const discountedPrice = Math.round(individualPrices * 0.85 * 100) / 100 // 1120.30 AED
    const savings = Math.round((individualPrices - discountedPrice) * 100) / 100 // 197.70 AED
    
    // Get current description
    const currentDescription = product.description
    
    // Replace the multi-line pricing with single line format
    const updatedDescription = currentDescription.replace(
      /Regular price: [\d,]+\s+AED\s+Bundle price: [\d.]+\s+AED\s+Save 15% \([-\d.]+\s+AED\)/s,
      `Regular price: ${individualPrices.toLocaleString()} AED | Bundle price: ${discountedPrice.toFixed(2)} AED | Save 15% (${savings.toFixed(2)} AED)`
    )
    
    const updatedProduct = await prisma.product.update({
      where: { id: product.id },
      data: {
        description: updatedDescription
      }
    })
    
    console.log('✅ Product reverted successfully!')
    console.log('📦 Pricing display:')
    console.log(`   Regular price: ${individualPrices.toLocaleString()} AED | Bundle price: ${discountedPrice.toFixed(2)} AED | Save 15% (${savings.toFixed(2)} AED)`)
    
  } catch (error) {
    console.error('❌ Error updating product:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

revertProblemSkinBeautyBoxPricing()
  .then(() => {
    console.log('🎉 Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Failed:', error)
    process.exit(1)
  })

