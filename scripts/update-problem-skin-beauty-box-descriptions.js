const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function updateProblemSkinBeautyBox() {
  try {
    console.log('🚀 Updating Problem Skin Care Beauty Box product with descriptions...')
    
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
    
    // Updated description with product descriptions for each kit item
    const updatedDescription = `A targeted solution for acne-prone and congested skin. This set helps control breakouts, reduce inflammation, and balance oil production while restoring skin clarity and smoothness.

-15% OFF when purchased as a bundle

💙 Beauty Box: Problem Skin Care 

Kit includes:

1. Snow O2 180ml (1 pcs) = 330 AED
All in one gentle cleanser with oxygen bubbles. It is a gentle and effective cleanser which gives an excellent treatment sensation. Naturally generated oxygen bubbles clean make-up dirts and skin impurities without excessive cleansing movement and irritation to skin. Features oxygen therapy mechanism for deep cleansing and nutrifying. Key ingredients: Phytolex SC, MultiEx Phytrogen, Methyl Perfluoroisobutyl Ether.

2. Problem Control Toner 200ml (1 pcs) = 260 AED
Anti-blemish toner for acne-prone skin. It helps remove excess oil and sebum for blemish-prone skin while adding quick hydration to skin with patented Anti Sebum P complex, zinc PCA, tea tree extract and panthenol. Key ingredients: Anti Sebum P, Tea Tree Extract, Tea Tree Leaf Oil, Rosmarinus Officinalis (Rosemary) Leaf Extract, Zinc PCA, Tannic Acid, Salicylic Acid (BHA), SNOW ICE.

3. Problem control serum 30ml (1 pcs) = 330 AED
Anti-blemish serum for combination, oily acne-prone skin. It helps fight skin breakouts by regulating excessive oil and sebum and refines skin texture for a healthier-looking clear skin with a sebum regulating ingredient – zinc PCA and willow bark extract. Key ingredients: Zinc PCA, Salix Nigra (Willow) Bark Extract, Trehalose, Panthenol, Phytolex SC, Allantoin, Beta-Glucan.

4. Intensive problem control cream 50ml (1 pcs) = 290 AED
Anti-blemish cream for combination, oily acne-prone skin. It helps control blemish-prone skin by regulating excessive oil and sebum while keeping the skin hydrated with zinc PCA, xylitol and panthenol. Key ingredients: Zinc PCA, Xylitol, Trehalose, Panthenol, Phytolex SC, Allantoin, Beta-Glucan.

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
    console.log(`   Name: ${updatedProduct.name}`)
    console.log(`   Description length: ${updatedProduct.description.length} characters`)
    
  } catch (error) {
    console.error('❌ Error updating product:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

updateProblemSkinBeautyBox()
  .then(() => {
    console.log('🎉 Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Failed:', error)
    process.exit(1)
  })

