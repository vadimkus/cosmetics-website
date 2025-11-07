const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function addDeepMoisturizingBeautyBox() {
  try {
    console.log('🚀 Adding Deep Moisturizing Beauty Box product...')
    const individualPrices = 330 + 260 + 330 + 290 + 108 // 1318 AED
    const discountedPrice = Math.round(individualPrices * 0.85 * 100) / 100 // 1120.30 AED
    const savings = individualPrices - discountedPrice // 197.70 AED
    
    const product = {
      name: 'DEEP MOISTURIZING BEAUTY BOX',
      price: discountedPrice,
      description: `An intensive hydration system designed to deeply replenish moisture, support the skin barrier, and leave the complexion soft, plump, and glowing. Perfect for dehydrated and dry skin.

-15% OFF when purchased as a bundle

🩵 Beauty Box: Deep Moisturizing 

Kit includes:

1. Snow O2 180ml (1 pcs) = 330 AED

2. Snow Booster 200ml (1 pcs) = 260 AED

3. Moisture Replenishing Hyaluron serum 30ml (1pcs) = 330 AED

4. Moisture Replenishing Hyaluron cream 50ml (1 pcs) = 290 AED

5. Soothing Bomb Sea Algae Mask (3 pcs) x36 AED = 108 AED

Regular price: 1,318 AED
Bundle price: ${discountedPrice.toFixed(2)} AED
Save 15% (${savings.toFixed(2)} AED)`,
      image: '/images/beauty_boxes/Deep_moisturizing.jpeg',
      category: 'Beauty Boxes',
      inStock: true,
      productNumber: '59'
    }
    
    const newProduct = await prisma.product.create({ data: product })
    console.log('✅ Product created successfully!')
    console.log('📦 Product ID:', newProduct.id)
    console.log('💰 Regular price: 1,318 AED')
    console.log('💰 Bundle price:', discountedPrice.toFixed(2), 'AED')
    console.log('💵 Savings:', savings.toFixed(2), 'AED')
    
  } catch (error) {
    console.error('❌ Error creating product:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

addDeepMoisturizingBeautyBox()
  .then(() => {
    console.log('🎉 Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Failed:', error)
    process.exit(1)
  })

