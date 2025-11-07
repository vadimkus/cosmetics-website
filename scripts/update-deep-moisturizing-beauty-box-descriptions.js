const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function updateDeepMoisturizingBeautyBox() {
  try {
    console.log('🚀 Updating Deep Moisturizing Beauty Box product with descriptions...')
    
    // Find the product by product number
    const product = await prisma.product.findFirst({
      where: {
        productNumber: '59'
      }
    })
    
    if (!product) {
      console.error('❌ Product not found!')
      return
    }
    
    console.log(`📦 Found product: ${product.id}`)
    
    const individualPrices = 330 + 260 + 330 + 290 + 108 // 1318 AED
    const discountedPrice = Math.round(individualPrices * 0.85 * 100) / 100 // 1120.30 AED
    const savings = Math.round((individualPrices - discountedPrice) * 100) / 100 // 197.70 AED
    
    // Updated description with product descriptions for each kit item
    const updatedDescription = `An intensive hydration system designed to deeply replenish moisture, support the skin barrier, and leave the complexion soft, plump, and glowing. Perfect for dehydrated and dry skin.

Regular price: ${individualPrices.toLocaleString()} AED | Bundle price: ${discountedPrice.toFixed(2)} AED | Save 15% (${savings.toFixed(2)} AED)

🩵 Beauty Box: Deep Moisturizing 

Kit includes:

1. Snow O2 180ml (1 pcs) = 330 AED
All in one gentle cleanser with oxygen bubbles. It is a gentle and effective cleanser which gives an excellent treatment sensation. Naturally generated oxygen bubbles clean make-up dirts and skin impurities without excessive cleansing movement and irritation to skin. Features oxygen therapy mechanism for deep cleansing and nutrifying. Key ingredients: Phytolex SC, MultiEx Phytrogen, Methyl Perfluoroisobutyl Ether.

2. Snow Booster 200ml (1 pcs) = 260 AED
Daily moisturizing and skin refining toner for all skin types. It is a daily toner used for all skin types that contains various botanical extracts to moisturize and soothe skin. It helps refining the skin with balancing pH level after cleansing. Key ingredients: Phytolex SC, Nelumbo Nucifera Flower Extract, Lactobacillus/Pumpkin Ferment Extract, Betaine.

3. Moisture Replenishing Hyaluron serum 30ml (1pcs) = 330 AED
Coconut water-based hydrating serum with hyaluronic complex and various mushrooms. It is a coconut water-based serum that quickly replenishes moisture from the deep inside and infuses skin with multi depth hydration with hyaluronic acid complex and various mushrooms. 4 STEP Skin Hydration: 1) Electrolytes in coconut water lead moisture into the skin and balance the water content. 2) By stimulating the formation of aqua-porin, it opens water-transport channel, and attracts moisture to the skin with moisture magnet ingredient. 3) Low/middle molecular weight hyaluronic acids replenish moisture layer by layer from the inside of the skin. 4) High molecular weight hyaluronic acid prevents moisture evaporation by forming moisture barrier on the skin surface. Mushrooms nourish and protect skin with powerful anti-inflammatory and antioxidant properties. Key ingredients: Cocos Nucifera (Coconut) Water Complex (78%), Hyaluronan 11 Multi-Complex, Glyceryl Glucoside (aquaporin), PENTAVITIN™ (moisture magnet), Tremella Fuciformis, Mushroom Complex, Solanum Melongena (Eggplant) Fruit Extract.

4. Moisture Replenishing Hyaluron cream 50ml (1 pcs) = 290 AED
Long-lasting moisturizer with hyaluronic complex and various mushrooms. It is a refreshing moisturizer that strengthens moisture barrier and provides long-lasting hydration to skin with hyaluronic acid complex and various mushrooms. 4 STEP Skin Hydration: 1) When it touches the skin, natural-origin cooling agents help lower the skin temperature and make skin refreshed. 2) By stimulating the formation of aqua-porin, it opens water-transport channel, and attracts moisture to the skin with moisture magnet ingredient. 3) Low/middle molecular weight hyaluronic acids replenish moisture layer by layer form the inside of the skin. 4) High molecular weight hyaluronic acid prevents moisture evaporation by forming moisture barrier on the skin surface. Mushrooms nourish and protect skin with powerful anti-inflammatory and antioxidant properties. Clinical Study: 72-Hour Hydration Persistence. Key ingredients: Hyaluronan 11 Multi-Complex, Glyceryl Glucoside (aquaporin), PENTAVITIN™ (moisture magnet), Tremella Fuciformis, Mushroom Complex, Solanum Melongena (Eggplant) Fruit Extract, Aloe Barbadensis Flower Extract, Natural-Origin Cooling Agent (Xylitol, Erythritol).

5. Soothing Bomb Sea Algae Mask (3 pcs) x36 AED = 108 AED
Eucalace® sheet mask inspired by the healing power of the ocean. It provides intensive relief to the skin and moisturizes skin with sea algae complex and centella asiatica extract. Key ingredients: Jania Rubens Extract, Undaria Pinnatifida Extract, Bambusa Vulgaris Extract, Centella Asiatica Extract, Hamamelis Virginiana (Witch Hazel) Extract, Custanea Crenata Shell Extract, Panthenol, Allantoin.`
    
    const updatedProduct = await prisma.product.update({
      where: { id: product.id },
      data: {
        description: updatedDescription
      }
    })
    
    console.log('✅ Product updated successfully!')
    console.log('📦 Updated product details:')
    console.log(`   ID: ${updatedProduct.id}`)
    console.log(`   Product Number: ${updatedProduct.productNumber}`)
    console.log(`   Name: ${updatedProduct.name}`)
    console.log(`   URL: http://localhost:3000/products/${updatedProduct.productNumber}`)
    
  } catch (error) {
    console.error('❌ Error updating product:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

updateDeepMoisturizingBeautyBox()
  .then(() => {
    console.log('🎉 Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Failed:', error)
    process.exit(1)
  })

