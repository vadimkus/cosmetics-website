const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function populateSkinRecommendations() {
  try {
    console.log('🔄 Starting to populate skin recommendation data...')

    // Get all existing products
    const products = await prisma.product.findMany()
    console.log(`📦 Found ${products.length} existing products`)

    // Sample skin recommendation data for different products
    const skinRecommendationData = [
      // Serums
      { name: 'ALL FOR SENSITIVE SERUM', skinType: 'sensitive', targetConcerns: '["sensitivity", "hydration"]', usage: 'morning-evening', ageGroup: 'adult' },
      { name: 'MOISTURE REPLENISHING HYALURON SERUM', skinType: 'dry', targetConcerns: '["hydration", "anti-aging"]', usage: 'morning-evening', ageGroup: 'adult' },
      { name: 'MULTIFUNCTIONAL ANTI WRINKLE CREAM', skinType: 'mature', targetConcerns: '["anti-aging", "hydration"]', usage: 'morning-evening', ageGroup: 'mature' },
      { name: 'HYDROSOOTHING CREAM', skinType: 'dry', targetConcerns: '["hydration", "sensitivity"]', usage: 'morning-evening', ageGroup: 'adult' },
      
      // Eye Care
      { name: 'PEPTIDE GEL PATCH', skinType: 'normal', targetConcerns: '["eye-care", "anti-aging"]', usage: 'evening', ageGroup: 'adult' },
      { name: 'EYE BAG PATCH', skinType: 'sensitive', targetConcerns: '["eye-care", "sensitivity"]', usage: 'evening', ageGroup: 'adult' },
      { name: 'CROW\'S FEET PATCH', skinType: 'mature', targetConcerns: '["eye-care", "anti-aging"]', usage: 'evening', ageGroup: 'mature' },
      { name: 'EYE KIT', skinType: 'normal', targetConcerns: '["eye-care", "anti-aging"]', usage: 'morning-evening', ageGroup: 'adult' },
      { name: 'EYE SERUM', skinType: 'sensitive', targetConcerns: '["eye-care", "sensitivity"]', usage: 'morning-evening', ageGroup: 'adult' },
      { name: 'EYE CREAM', skinType: 'dry', targetConcerns: '["eye-care", "hydration"]', usage: 'morning-evening', ageGroup: 'mature' },
      
      // Cleansers
      { name: 'GENTLE CLEANSER', skinType: 'sensitive', targetConcerns: '["sensitivity"]', usage: 'morning-evening', ageGroup: 'teen' },
      { name: 'OIL CONTROL CLEANSER', skinType: 'oily', targetConcerns: '["acne-blemishes", "pore-care"]', usage: 'morning-evening', ageGroup: 'teen' },
      { name: 'HYDRATING CLEANSER', skinType: 'dry', targetConcerns: '["hydration"]', usage: 'morning-evening', ageGroup: 'adult' },
      
      // Moisturizers
      { name: 'LIGHT MOISTURIZER', skinType: 'oily', targetConcerns: '["pore-care"]', usage: 'morning-evening', ageGroup: 'young-adult' },
      { name: 'RICH MOISTURIZER', skinType: 'dry', targetConcerns: '["hydration", "anti-aging"]', usage: 'morning-evening', ageGroup: 'mature' },
      { name: 'ANTI-AGING MOISTURIZER', skinType: 'normal', targetConcerns: '["anti-aging"]', usage: 'morning-evening', ageGroup: 'mature' },
      
      // Sunscreens
      { name: 'DAILY SUNSCREEN', skinType: 'normal', targetConcerns: '["anti-aging"]', usage: 'morning', ageGroup: 'adult' },
      { name: 'SENSITIVE SKIN SUNSCREEN', skinType: 'sensitive', targetConcerns: '["sensitivity"]', usage: 'morning', ageGroup: 'adult' },
      
      // Masks
      { name: 'HYDRATING MASK', skinType: 'dry', targetConcerns: '["hydration"]', usage: 'evening', ageGroup: 'adult' },
      { name: 'PORE MINIMIZING MASK', skinType: 'oily', targetConcerns: '["pore-care", "acne-blemishes"]', usage: 'evening', ageGroup: 'young-adult' },
      { name: 'ANTI-AGING MASK', skinType: 'mature', targetConcerns: '["anti-aging"]', usage: 'evening', ageGroup: 'mature' },
      
      // Toners
      { name: 'BALANCING TONER', skinType: 'combination', targetConcerns: '["pore-care"]', usage: 'morning-evening', ageGroup: 'young-adult' },
      { name: 'SOOTHING TONER', skinType: 'sensitive', targetConcerns: '["sensitivity"]', usage: 'morning-evening', ageGroup: 'adult' },
      
      // Brightening
      { name: 'VITAMIN C SERUM', skinType: 'normal', targetConcerns: '["brightening", "anti-aging"]', usage: 'morning', ageGroup: 'adult' },
      { name: 'BRIGHTENING CREAM', skinType: 'normal', targetConcerns: '["brightening"]', usage: 'morning-evening', ageGroup: 'adult' },
      
      // Acne Treatment
      { name: 'ACNE TREATMENT', skinType: 'oily', targetConcerns: '["acne-blemishes"]', usage: 'evening', ageGroup: 'teen' },
      { name: 'SPOT TREATMENT', skinType: 'oily', targetConcerns: '["acne-blemishes"]', usage: 'evening', ageGroup: 'young-adult' },
      
      // PDRN Products
      { name: 'PDRN MASK', skinType: 'sensitive', targetConcerns: '["sensitivity", "anti-aging"]', usage: 'evening', ageGroup: 'adult' },
      { name: 'PDRN SERUM', skinType: 'sensitive', targetConcerns: '["sensitivity", "anti-aging"]', usage: 'morning-evening', ageGroup: 'adult' }
    ]

    let updatedCount = 0

    for (const product of products) {
      // Find matching skin recommendation data
      const recommendationData = skinRecommendationData.find(data => 
        product.name.toLowerCase().includes(data.name.toLowerCase()) ||
        data.name.toLowerCase().includes(product.name.toLowerCase())
      )

      if (recommendationData) {
        await prisma.product.update({
          where: { id: product.id },
          data: {
            skinType: recommendationData.skinType,
            targetConcerns: recommendationData.targetConcerns,
            usage: recommendationData.usage,
            ageGroup: recommendationData.ageGroup
          }
        })
        updatedCount++
        console.log(`✅ Updated: ${product.name}`)
      }
    }

    console.log(`🎉 Successfully updated ${updatedCount} products with skin recommendation data`)
    
    // Show some examples
    const sampleProducts = await prisma.product.findMany({
      where: {
        skinType: { not: null }
      },
      take: 5
    })
    
    console.log('\n📋 Sample updated products:')
    sampleProducts.forEach(product => {
      console.log(`- ${product.name}: ${product.skinType} skin, ${product.targetConcerns}, ${product.usage}`)
    })

  } catch (error) {
    console.error('❌ Error populating skin recommendations:', error)
  } finally {
    await prisma.$disconnect()
  }
}

populateSkinRecommendations()
