const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function populateMoreSkinRecommendations() {
  try {
    console.log('🔄 Adding more skin recommendation data...')

    // Get all products that don't have skin recommendation data yet
    const products = await prisma.product.findMany({
      where: {
        skinType: null
      }
    })
    
    console.log(`📦 Found ${products.length} products without skin recommendation data`)

    // More comprehensive mapping based on product names and categories
    const skinRecommendationMappings = [
      // Serums
      { keywords: ['hyaluron', 'moisture', 'hydrat'], skinType: 'dry', targetConcerns: '["hydration"]', usage: 'morning-evening', ageGroup: 'adult' },
      { keywords: ['sensitive', 'soothing', 'calm'], skinType: 'sensitive', targetConcerns: '["sensitivity"]', usage: 'morning-evening', ageGroup: 'adult' },
      { keywords: ['anti-aging', 'wrinkle', 'firming'], skinType: 'mature', targetConcerns: '["anti-aging"]', usage: 'morning-evening', ageGroup: 'mature' },
      { keywords: ['vitamin c', 'brightening', 'radiance'], skinType: 'normal', targetConcerns: '["brightening"]', usage: 'morning', ageGroup: 'adult' },
      { keywords: ['acne', 'blemish', 'spot'], skinType: 'oily', targetConcerns: '["acne-blemishes"]', usage: 'evening', ageGroup: 'teen' },
      
      // Eye Care
      { keywords: ['eye', 'patch', 'gel'], skinType: 'normal', targetConcerns: '["eye-care"]', usage: 'evening', ageGroup: 'adult' },
      { keywords: ['crow', 'feet', 'bag'], skinType: 'mature', targetConcerns: '["eye-care", "anti-aging"]', usage: 'evening', ageGroup: 'mature' },
      
      // Cleansers
      { keywords: ['gentle', 'mild'], skinType: 'sensitive', targetConcerns: '["sensitivity"]', usage: 'morning-evening', ageGroup: 'teen' },
      { keywords: ['oil control', 'deep clean'], skinType: 'oily', targetConcerns: '["pore-care", "acne-blemishes"]', usage: 'morning-evening', ageGroup: 'young-adult' },
      { keywords: ['hydrating', 'moisturizing'], skinType: 'dry', targetConcerns: '["hydration"]', usage: 'morning-evening', ageGroup: 'adult' },
      
      // Moisturizers
      { keywords: ['light', 'oil-free'], skinType: 'oily', targetConcerns: '["pore-care"]', usage: 'morning-evening', ageGroup: 'young-adult' },
      { keywords: ['rich', 'nourishing'], skinType: 'dry', targetConcerns: '["hydration"]', usage: 'morning-evening', ageGroup: 'mature' },
      { keywords: ['anti-aging', 'firming'], skinType: 'mature', targetConcerns: '["anti-aging"]', usage: 'morning-evening', ageGroup: 'mature' },
      
      // Sunscreens
      { keywords: ['sunscreen', 'spf'], skinType: 'normal', targetConcerns: '["anti-aging"]', usage: 'morning', ageGroup: 'adult' },
      
      // Masks
      { keywords: ['hydrating', 'moisture'], skinType: 'dry', targetConcerns: '["hydration"]', usage: 'evening', ageGroup: 'adult' },
      { keywords: ['pore', 'clay', 'purifying'], skinType: 'oily', targetConcerns: '["pore-care", "acne-blemishes"]', usage: 'evening', ageGroup: 'young-adult' },
      { keywords: ['anti-aging', 'firming'], skinType: 'mature', targetConcerns: '["anti-aging"]', usage: 'evening', ageGroup: 'mature' },
      
      // Toners
      { keywords: ['balancing', 'normal'], skinType: 'combination', targetConcerns: '["pore-care"]', usage: 'morning-evening', ageGroup: 'young-adult' },
      { keywords: ['soothing', 'calm'], skinType: 'sensitive', targetConcerns: '["sensitivity"]', usage: 'morning-evening', ageGroup: 'adult' },
      
      // PDRN Products
      { keywords: ['pdrn', 'salmon'], skinType: 'sensitive', targetConcerns: '["sensitivity", "anti-aging"]', usage: 'evening', ageGroup: 'adult' }
    ]

    let updatedCount = 0

    for (const product of products) {
      let matched = false
      
      // Try to find a match based on keywords
      for (const mapping of skinRecommendationMappings) {
        const productNameLower = product.name.toLowerCase()
        const productDescLower = product.description.toLowerCase()
        
        if (mapping.keywords.some(keyword => 
          productNameLower.includes(keyword) || productDescLower.includes(keyword)
        )) {
          await prisma.product.update({
            where: { id: product.id },
            data: {
              skinType: mapping.skinType,
              targetConcerns: mapping.targetConcerns,
              usage: mapping.usage,
              ageGroup: mapping.ageGroup
            }
          })
          updatedCount++
          console.log(`✅ Updated: ${product.name} -> ${mapping.skinType} skin`)
          matched = true
          break
        }
      }
      
      // If no specific match, assign based on category
      if (!matched) {
        let defaultMapping = null
        
        if (product.category.toLowerCase().includes('serum')) {
          defaultMapping = { skinType: 'normal', targetConcerns: '["hydration"]', usage: 'morning-evening', ageGroup: 'adult' }
        } else if (product.category.toLowerCase().includes('mask')) {
          defaultMapping = { skinType: 'normal', targetConcerns: '["hydration"]', usage: 'evening', ageGroup: 'adult' }
        } else if (product.category.toLowerCase().includes('cleanser')) {
          defaultMapping = { skinType: 'normal', targetConcerns: '["pore-care"]', usage: 'morning-evening', ageGroup: 'young-adult' }
        } else if (product.category.toLowerCase().includes('moisturizer')) {
          defaultMapping = { skinType: 'normal', targetConcerns: '["hydration"]', usage: 'morning-evening', ageGroup: 'adult' }
        }
        
        if (defaultMapping) {
          await prisma.product.update({
            where: { id: product.id },
            data: {
              skinType: defaultMapping.skinType,
              targetConcerns: defaultMapping.targetConcerns,
              usage: defaultMapping.usage,
              ageGroup: defaultMapping.ageGroup
            }
          })
          updatedCount++
          console.log(`✅ Updated (default): ${product.name} -> ${defaultMapping.skinType} skin`)
        }
      }
    }

    console.log(`🎉 Successfully updated ${updatedCount} more products with skin recommendation data`)
    
    // Show final count
    const totalWithSkinData = await prisma.product.count({
      where: {
        skinType: { not: null }
      }
    })
    
    console.log(`📊 Total products with skin recommendation data: ${totalWithSkinData}`)

  } catch (error) {
    console.error('❌ Error populating skin recommendations:', error)
  } finally {
    await prisma.$disconnect()
  }
}

populateMoreSkinRecommendations()
