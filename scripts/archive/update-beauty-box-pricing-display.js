const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function updateProblemSkinBeautyBoxPricing() {
  try {
    console.log('🚀 Updating Problem Skin Care Beauty Box pricing display...')
    
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
    
    // Replace the discount line with detailed pricing
    const updatedDescription = currentDescription.replace(
      '-15% OFF when purchased as a bundle',
      `Regular price: ${individualPrices.toLocaleString()} AED | Bundle price: ${discountedPrice.toFixed(2)} AED | Save 15% (${savings.toFixed(2)} AED)`
    )
    
    const updatedProduct = await prisma.product.update({
      where: { id: product.id },
      data: {
        description: updatedDescription
      }
    })
    
    console.log('✅ Product updated successfully!')
    console.log('📦 Updated pricing display:')
    console.log(`   Regular price: ${individualPrices.toLocaleString()} AED`)
    console.log(`   Bundle price: ${discountedPrice.toFixed(2)} AED`)
    console.log(`   Savings: ${savings.toFixed(2)} AED (15%)`)
    
  } catch (error) {
    console.error('❌ Error updating product:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

updateProblemSkinBeautyBoxPricing()
  .then(() => {
    console.log('🎉 Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Failed:', error)
    process.exit(1)
  })

