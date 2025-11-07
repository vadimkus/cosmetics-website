const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function addCharmingLookBeautyBox() {
  try {
    console.log('🚀 Adding Charming Look Beauty Box product...')
    
    // Calculate price: 330 + 260 + 300 + 290 + 340 = 1520 AED
    // With 15% discount: 1520 * 0.85 = 1292 AED
    const individualPrices = 330 + 260 + 300 + 290 + 340 // 1520 AED
    const discountedPrice = Math.round(individualPrices * 0.85 * 100) / 100 // 1292.00 AED
    const savings = Math.round((individualPrices - discountedPrice) * 100) / 100 // 228.00 AED
    
    const product = {
      name: 'Charming Look Beauty Box',
      price: discountedPrice,
      productNumber: '57',
      description: `Your daily glow-up set for a flawless, radiant look. Cleanses, nourishes, and enhances the skin while adding a fresh, luminous finish with our signature cushion foundation.

Regular price: ${individualPrices.toLocaleString()} AED | Bundle price: ${discountedPrice.toFixed(2)} AED | Save 15% (${savings.toFixed(2)} AED)

🌟 Beauty Box : Charming Look 

Kit includes:

1. Snow O2 180ml (1 pcs) = 330 AED
All in one gentle cleanser with oxygen bubbles. It is a gentle and effective cleanser which gives an excellent treatment sensation. Naturally generated oxygen bubbles clean make-up dirts and skin impurities without excessive cleansing movement and irritation to skin. Features oxygen therapy mechanism for deep cleansing and nutrifying. Key ingredients: Phytolex SC, MultiEx Phytrogen, Methyl Perfluoroisobutyl Ether.

2. Snow Booster 200ml (1 pcs) = 260 AED
Daily moisturizing and skin refining toner for all skin types. It is a daily toner used for all skin types that contains various botanical extracts to moisturize and soothe skin. It helps refining the skin with balancing pH level after cleansing. Key ingredients: Phytolex SC, Nelumbo Nucifera Flower Extract, Lactobacillus/Pumpkin Ferment Extract, Betaine.

3. Skin Caring Blemish Balm Cushion (1pcs) Ivory or Biege color = 300 AED
Professional BB cushion for post-treatment use with natural coverage and skin protection. It provides natural coverage while protecting skin from harmful environmental factors. Perfect for daily use to cover redness and blemishes while maintaining a natural skin tone. Key ingredients: SPF 50+ PA++++ protection, natural coverage formula.

4. Professional Biphasic Make Up Remover 200ml (1pcs) = 290 AED
Fresh, non-greasy lip & eye makeup remover. Biphasic layer of essence layer with vitamins, firming peptides and oil layer with a strong cleansing power turn into emulsion which cleans the delicate lip and eye area without irritation. Key ingredients: 10 Vitamin Complex, Palmitoyl Tripeptide-5, Acetyl Tetrapeptide-5, Saccharide Hydrolysate, Rosa Damascena Flower Water, Daucus Carota Sativa (Carrot) Root Extract, Brassica Oleracea Italica (Broccoli) Extract, Daucus Carota Sativa (Carrot) Seed Oil, Hippophae Rhamnoides Oil.

5. Skin Rescue Overnight Cream Mask 100ml (1pcs) = 340 AED
Revitalizing overnight mask that provides intensive care to the fatigued skin. It revitalizes skin and provides intensive care to the fatigued skin with oxygen capsules and a unique skin protecting complex - pink ceramide. Dual Formula: Oxygen capsule in Pink ceramide cream - It has dual formula where oxygen capsule (which contains Italian oxygenated water) bursts smoothly when touching the skin and melts together with pink ceramide cream. Key ingredients: Pink Ceramide Complex, Oxygen, Growth Factor Complex (EGF, aFGF, bFGF, PIGF, IGF), Swelling Controller, Cucurbita Pepo (Pumpkin) Fruit Extract, Phytosphingosine.`,
      image: '/images/beauty_boxes/Charming_look.jpeg',
      category: 'Beauty Boxes',
      inStock: true,
    }
    
    const newProduct = await prisma.product.create({
      data: product
    })
    
    console.log('✅ Product created successfully!')
    console.log('📦 Product details:')
    console.log(`   ID: ${newProduct.id}`)
    console.log(`   Product Number: ${newProduct.productNumber}`)
    console.log(`   Name: ${newProduct.name}`)
    console.log(`   Price: ${newProduct.price} AED (15% discount from ${individualPrices} AED)`)
    console.log(`   Category: ${newProduct.category}`)
    console.log(`   Image: ${newProduct.image}`)
    console.log(`   URL: http://localhost:3000/products/${newProduct.productNumber}`)
    
  } catch (error) {
    console.error('❌ Error creating product:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

addCharmingLookBeautyBox()
  .then(() => {
    console.log('🎉 Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Failed:', error)
    process.exit(1)
  })

