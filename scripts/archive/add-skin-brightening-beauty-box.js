const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function addSkinBrighteningBeautyBox() {
  try {
    console.log('🚀 Adding Skin Brightening Beauty Box product...')
    
    // Calculate price: 330 + 260 + 330 + 290 + 250 + 36 = 1496 AED
    // With 15% discount: 1496 * 0.85 = 1271.6 AED
    const individualPrices = 330 + 260 + 330 + 290 + 250 + 36 // 1496 AED
    const discountedPrice = Math.round(individualPrices * 0.85 * 100) / 100 // 1271.60 AED
    const savings = Math.round((individualPrices - discountedPrice) * 100) / 100 // 224.40 AED
    
    const product = {
      name: 'Problem Skin Care Beauty Box',
      price: discountedPrice,
      productNumber: '56',
      description: `Designed to boost radiance and even skin tone. This collection helps smooth texture, reduce dullness, and reveal a brighter, more luminous complexion.

Regular price: ${individualPrices.toLocaleString()} AED | Bundle price: ${discountedPrice.toFixed(2)} AED | Save 15% (${savings.toFixed(2)} AED)

🧡 Beauty Box : Skin Brightening 

Kit includes:

1. Snow O2 180ml (1 pcs) = 330 AED
All in one gentle cleanser with oxygen bubbles. It is a gentle and effective cleanser which gives an excellent treatment sensation. Naturally generated oxygen bubbles clean make-up dirts and skin impurities without excessive cleansing movement and irritation to skin. Features oxygen therapy mechanism for deep cleansing and nutrifying. Key ingredients: Phytolex SC, MultiEx Phytrogen, Methyl Perfluoroisobutyl Ether.

2. Snow Booster 200ml (1 pcs) = 260 AED
Daily moisturizing and skin refining toner for all skin types. It is a daily toner used for all skin types that contains various botanical extracts to moisturize and soothe skin. It helps refining the skin with balancing pH level after cleansing. Key ingredients: Phytolex SC, Nelumbo Nucifera Flower Extract, Lactobacillus/Pumpkin Ferment Extract, Betaine.

3. Multi Vita Radiance Serum 30ml (1pcs) = 330 AED
Skin brightening serum with multi vitamins and patented melanin care complex, MELAZERO®. It helps even skin tone, revive skin's natural brightness and radiance with multi vitamins and patented melanin care complex, MELAZERO®. It gives skin a natural glow by forming a moisturizing barrier thanks to panthenol-rich formula. Key ingredients: 3-O-Ethyl Ascorbic Acid (derivative of pure vitamin C), VITA 12 Complex, MELAZERO®, Panthenol, Niacinamide, Glutathione, Gluconolactone (PHA), Anti-inflammatory Herb Complex.

4. Multi Vita Radiance Cream 50ml (1pcs) = 290 AED
Skin brightening cream with multi vitamins and patented melanin care complex, MELAZERO®. It helps even skin tone, revive skin's natural brightness and radiance with multi vitamins and patented melanin care complex, MELAZERO®. It gives skin a natural glow by forming a moisturizing barrier thanks to panthenol-rich formula. Key ingredients: 3-O-Ethyl Ascorbic Acid (derivative of pure vitamin C), VITA 12 Complex, MELAZERO®, Panthenol, Niacinamide, Glutathione, Gluconolactone (PHA), Anti-inflammatory Herb Complex.

5. EPI Turnover Boosting Peeling Gel 100ml (1pcs) = 250 AED
Mild peeling gel combining enzymatic peeling and cellulose peeling. It is the enzyme peeling gel that removes dead skin cells without irritation. Moringa, so-called "Miracle Tree" purifies and nourishes skin and the plant complex from desert moisturizes and soothes skin. Key ingredients: Carica Papaya (Papaya) Fruit Extract, Moringa Pterygosperma Seed Extract, Hyaluronic Acid, Simmondsia Chinensis (Jojoba) Seed Oil, Desert Complex.

6. Soothing Bomb Sea Algae Mask (1pcs) = 36 AED
Eucalace® sheet mask inspired by the healing power of the ocean. It provides intensive relief to the skin and moisturizes skin with sea algae complex and centella asiatica extract. Key ingredients: Jania Rubens Extract, Undaria Pinnatifida Extract, Bambusa Vulgaris Extract, Centella Asiatica Extract, Hamamelis Virginiana (Witch Hazel) Extract, Custanea Crenata Shell Extract, Panthenol, Allantoin.`,
      image: '/images/beauty_boxes/Skin_brightening_box.jpeg',
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

addSkinBrighteningBeautyBox()
  .then(() => {
    console.log('🎉 Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Failed:', error)
    process.exit(1)
  })

