const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function addAntiAgingBeautyBox() {
  try {
    console.log('🚀 Adding Anti-Aging Beauty Box product...')
    
    // Calculate price: 330 + 260 + 330 + 290 + 180 = 1390 AED
    // With 15% discount: 1390 * 0.85 = 1181.50 AED
    const individualPrices = 330 + 260 + 330 + 290 + 180 // 1390 AED
    const discountedPrice = Math.round(individualPrices * 0.85 * 100) / 100 // 1181.50 AED
    const savings = Math.round((individualPrices - discountedPrice) * 100) / 100 // 208.50 AED
    
    const product = {
      name: 'Anti-Aging Beauty Box',
      price: discountedPrice,
      productNumber: '58',
      description: `A powerful rejuvenating set to improve firmness, smooth fine lines, and enhance elasticity. Supports youthful, lifted, and radiant skin with clinically proven anti-aging actives.

Regular price: ${individualPrices.toLocaleString()} AED | Bundle price: ${discountedPrice.toFixed(2)} AED | Save 15% (${savings.toFixed(2)} AED)

❤️ Beauty Box: Anti-Aging 

Kit includes:

1. Snow O2 180ml (1 pcs) = 330 AED
All in one gentle cleanser with oxygen bubbles. It is a gentle and effective cleanser which gives an excellent treatment sensation. Naturally generated oxygen bubbles clean make-up dirts and skin impurities without excessive cleansing movement and irritation to skin. Features oxygen therapy mechanism for deep cleansing and nutrifying. Key ingredients: Phytolex SC, MultiEx Phytrogen, Methyl Perfluoroisobutyl Ether.

2. Snow Booster 200ml (1 pcs) = 260 AED
Daily moisturizing and skin refining toner for all skin types. It is a daily toner used for all skin types that contains various botanical extracts to moisturize and soothe skin. It helps refining the skin with balancing pH level after cleansing. Key ingredients: Phytolex SC, Nelumbo Nucifera Flower Extract, Lactobacillus/Pumpkin Ferment Extract, Betaine.

3. Multi Functional Anti-wrinkle serum 30ml (1pcs) = 330 AED
Anti-aging serum with bakuchiol, a natural alternative to retinol and anti-wrinkle peptide complex. It is an anti-aging serum that helps visibly smooth the signs of wrinkles and reinforces skin firmness with a nourishing ingredient – bakuchiol, a natural alternative to retinol and anti-wrinkle peptide complex. Clinical study on improvement of skin age index, P&K Skin Research Center, Feb. 22 to May 13, 2024, 24 adult women aged 30~59 years. Key ingredients: Bakuchiol, Anti-aging Peptide 6, Lipid Barrier Liposome (Ceramide NP, Cholesterol, Phytosphingosine), Collagen, Elastin, Propolis Extract, Adenosine, Niacinamide.

4. Multifunctional Anti-Wrinkle cream 50ml (1 pcs) = 290 AED
Anti-aging cream with bakuchiol, a natural alternative to retinol and anti-wrinkle peptide complex. It is an anti-aging cream that helps visibly smooth the signs of wrinkles and reinforces skin firmness with a nourishing ingredient – bakuchiol, a natural alternative to retinol and anti-wrinkle peptide complex. Clinical study on improvement of skin age index, P&K Skin Research Center, Feb. 22 to May 13, 2024, 24 adult women aged 30~59 years. Key ingredients: Bakuchiol, Anti-aging Peptide 6, Lipid Barrier Liposome (Ceramide NP, Cholesterol, Phytosphingosine), Collagen, Elastin, Propolis Extract, Adenosine, Niacinamide.

5. Collagen mask (5 pcs) x 36 AED = 180 AED
Revitalizing sheet mask that provides intensive hydration and collagen support for youthful, lifted skin. It helps improve skin elasticity and firmness while providing deep moisturization. The mask delivers collagen and anti-aging peptides directly to the skin for enhanced anti-aging benefits. Key ingredients: Hydrolyzed Collagen, Hyaluronic Acid, Peptides, Botanical Extracts.`,
      image: '/images/beauty_boxes/Anti_aging_box.jpeg',
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

addAntiAgingBeautyBox()
  .then(() => {
    console.log('🎉 Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Failed:', error)
    process.exit(1)
  })

