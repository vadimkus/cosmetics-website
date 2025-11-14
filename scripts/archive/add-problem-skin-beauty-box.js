const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function addProblemSkinBeautyBox() {
  try {
    console.log('🚀 Adding Problem Skin Care Beauty Box product...')
    
    // Calculate price: 330 + 260 + 330 + 290 + 108 = 1318 AED
    // With 15% discount: 1318 * 0.85 = 1120.3 AED
    const individualPrices = 330 + 260 + 330 + 290 + 108 // 1318 AED
    const discountedPrice = Math.round(individualPrices * 0.85 * 100) / 100 // 1120.30 AED
    
    const product = {
      name: 'GENOSYS Problem Skin Care Beauty Box',
      price: discountedPrice,
      description: `A targeted solution for acne-prone and congested skin. This set helps control breakouts, reduce inflammation, and balance oil production while restoring skin clarity and smoothness.

-15% OFF when purchased as a bundle

💙 Beauty Box: Problem Skin Care 

Kit includes:

1. Snow O2 180ml (1 pcs) = 330 AED

2. Problem Control Toner 200ml (1 pcs) = 260 AED

3. Problem control serum 30ml (1 pcs) = 330 AED

4. Intensive problem control cream 50ml (1 pcs) = 290 AED

5. Soothing Bomb Sea Algae Mask (3 pcs) x36 AED = 108 AED`,
      image: '/images/beauty_boxes/Problem_skin_box.jpeg',
      category: 'Beauty Boxes',
      inStock: true,
    }
    
    const newProduct = await prisma.product.create({
      data: product
    })
    
    console.log('✅ Product created successfully!')
    console.log('📦 Product details:')
    console.log(`   ID: ${newProduct.id}`)
    console.log(`   Name: ${newProduct.name}`)
    console.log(`   Price: ${newProduct.price} AED (15% discount from ${individualPrices} AED)`)
    console.log(`   Category: ${newProduct.category}`)
    console.log(`   Image: ${newProduct.image}`)
    
  } catch (error) {
    console.error('❌ Error creating product:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

addProblemSkinBeautyBox()
  .then(() => {
    console.log('🎉 Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Failed:', error)
    process.exit(1)
  })

