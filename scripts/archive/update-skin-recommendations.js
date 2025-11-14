const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function updateSkinRecommendations() {
  try {
    console.log('🔍 Starting comprehensive skin recommendation update...')
    
    // Get all products
    const products = await prisma.product.findMany()
    console.log(`📦 Found ${products.length} products to analyze`)
    
    // Comprehensive product analysis and recommendations
    const productRecommendations = [
      // Microneedling Devices
      {
        id: '1',
        name: 'Microneedle Roller',
        skinType: 'normal',
        targetConcerns: '["anti-aging", "pore-care"]',
        usage: 'evening',
        ageGroup: 'adult',
        keywords: ['microneedle', 'roller', 'collagen', 'rejuvenation']
      },
      {
        id: '2', 
        name: 'Needle Pen-K',
        skinType: 'normal',
        targetConcerns: '["anti-aging", "pore-care"]',
        usage: 'evening',
        ageGroup: 'adult',
        keywords: ['needle pen', 'microneedling', 'collagen', 'elastin']
      },
      
      // Hair Products
      {
        id: '3',
        name: 'HairGen BOOSTER',
        skinType: null,
        targetConcerns: '["hair"]',
        usage: 'evening',
        ageGroup: 'adult',
        keywords: ['hair', 'scalp', 'hair loss', 'booster']
      },
      
      // PRO Solutions - Microneedling Ampoules
      {
        id: '4',
        name: 'POWER SOLUTION HES',
        skinType: 'dry',
        targetConcerns: '["hydration", "anti-aging"]',
        usage: 'evening',
        ageGroup: 'adult',
        keywords: ['hydrating', 'firming', 'hyaluronic', 'moisturizing']
      },
      {
        id: '5',
        name: 'POWER SOLUTION CVS',
        skinType: 'normal',
        targetConcerns: '["hydration", "sensitivity"]',
        usage: 'evening',
        ageGroup: 'adult',
        keywords: ['revitalizing', 'soothing', 'hydrates', 'gentle']
      },
      {
        id: '6',
        name: 'POWER SOLUTION CTS',
        skinType: 'mature',
        targetConcerns: '["anti-aging"]',
        usage: 'evening',
        ageGroup: 'mature',
        keywords: ['remodeling', 'elasticity', 'collagen', 'firming']
      },
      {
        id: '7',
        name: 'POWER SOLUTION PCS',
        skinType: 'oily',
        targetConcerns: '["acne-blemishes", "pore-care"]',
        usage: 'evening',
        ageGroup: 'teen',
        keywords: ['anti-blemish', 'sebum', 'oil control', 'breakout']
      },
      {
        id: '8',
        name: 'POWER SOLUTION SWS',
        skinType: 'normal',
        targetConcerns: '["brightening"]',
        usage: 'evening',
        ageGroup: 'adult',
        keywords: ['anti-pigment', 'brighten', 'even tone', 'arbutin']
      },
      {
        id: '9',
        name: 'POWER SOLUTION AWS',
        skinType: 'mature',
        targetConcerns: '["anti-aging"]',
        usage: 'evening',
        ageGroup: 'mature',
        keywords: ['anti-aging', 'wrinkle', 'firming', 'adenosine']
      },
      
      // Cleansers
      {
        id: '10',
        name: 'SNOW O₂ CLEANSER',
        skinType: 'normal',
        targetConcerns: '["pore-care"]',
        usage: 'morning-evening',
        ageGroup: 'young-adult',
        keywords: ['gentle', 'oxygen', 'cleansing', 'all skin types']
      },
      {
        id: '11',
        name: 'SKIN DEFENDER LIP & EYE MAKEUP REMOVER',
        skinType: 'sensitive',
        targetConcerns: '["sensitivity"]',
        usage: 'evening',
        ageGroup: 'adult',
        keywords: ['gentle', 'non-greasy', 'delicate', 'vitamins']
      },
      
      // Peeling Products
      {
        id: '12',
        name: 'EPI TURNOVER BOOSTING PEELING GEL',
        skinType: 'normal',
        targetConcerns: '["pore-care"]',
        usage: 'evening',
        ageGroup: 'young-adult',
        keywords: ['mild', 'peeling', 'dead skin', 'gentle']
      },
      {
        id: '13',
        name: 'SKIN RENEWAL PEELING SYSTEM (SRS)',
        skinType: 'normal',
        targetConcerns: '["brightening", "pore-care"]',
        usage: 'evening',
        ageGroup: 'adult',
        keywords: ['peeling', 'brighten', 'even tone', 'AHA']
      },
      
      // Toners/Mists
      {
        id: '14',
        name: 'MICROBIOME ENERGY INFUSING MIST',
        skinType: 'normal',
        targetConcerns: '["hydration"]',
        usage: 'all-day',
        ageGroup: 'adult',
        keywords: ['mist', 'hydrating', 'glow', 'radiance']
      },
      {
        id: '15',
        name: 'INTENSIVE PROBLEM CONTROL TONER',
        skinType: 'oily',
        targetConcerns: '["acne-blemishes", "pore-care"]',
        usage: 'morning-evening',
        ageGroup: 'teen',
        keywords: ['blemish', 'sebum', 'oil control', 'acne']
      },
      {
        id: '16',
        name: 'SNOW BOOSTER',
        skinType: 'normal',
        targetConcerns: '["hydration"]',
        usage: 'morning-evening',
        ageGroup: 'young-adult',
        keywords: ['moisturizing', 'balancing', 'all skin types']
      },
      
      // Eye Care
      {
        id: '17',
        name: 'EyeCell EYE CONTOUR SERUM',
        skinType: 'mature',
        targetConcerns: '["eye-care", "anti-aging"]',
        usage: 'morning-evening',
        ageGroup: 'adult',
        keywords: ['eye', 'wrinkle', 'dark circle', 'puff']
      },
      {
        id: '24',
        name: 'EyeCell EYE CONTOUR CREAM',
        skinType: 'mature',
        targetConcerns: '["eye-care", "anti-aging"]',
        usage: 'morning-evening',
        ageGroup: 'adult',
        keywords: ['eye', 'wrinkle', 'dark circle', 'puff']
      },
      {
        id: '33',
        name: 'EyeCell EYE PEPTIDE GEL PATCH',
        skinType: 'mature',
        targetConcerns: '["eye-care", "anti-aging"]',
        usage: 'evening',
        ageGroup: 'adult',
        keywords: ['eye', 'patch', 'gel', 'cooling']
      },
      {
        id: '50',
        name: 'EyeCell EYE ZONE CARE KIT',
        skinType: 'mature',
        targetConcerns: '["eye-care", "anti-aging"]',
        usage: 'morning-evening',
        ageGroup: 'adult',
        keywords: ['eye', 'kit', 'comprehensive', 'care']
      },
      
      // Serums
      {
        id: '18',
        name: 'MOISTURE REPLENISHING HYALURON SERUM',
        skinType: 'dry',
        targetConcerns: '["hydration"]',
        usage: 'morning-evening',
        ageGroup: 'adult',
        keywords: ['hydrating', 'hyaluronic', 'moisture', 'coconut']
      },
      {
        id: '19',
        name: 'ALL FOR SENSITIVE SERUM',
        skinType: 'sensitive',
        targetConcerns: '["sensitivity"]',
        usage: 'morning-evening',
        ageGroup: 'adult',
        keywords: ['sensitive', 'repairing', 'soothing', 'barrier']
      },
      {
        id: '20',
        name: 'PROBLEM CONTROL SERUM',
        skinType: 'oily',
        targetConcerns: '["acne-blemishes", "pore-care"]',
        usage: 'morning-evening',
        ageGroup: 'teen',
        keywords: ['blemish', 'oil control', 'sebum', 'acne']
      },
      {
        id: '21',
        name: 'MULTI VITA RADIANCE SERUM',
        skinType: 'normal',
        targetConcerns: '["brightening"]',
        usage: 'morning',
        ageGroup: 'adult',
        keywords: ['brightening', 'vitamin', 'radiance', 'glow']
      },
      {
        id: '22',
        name: 'MULTI FUNCTIONAL ANTI-WRINKLE SERUM',
        skinType: 'mature',
        targetConcerns: '["anti-aging"]',
        usage: 'evening',
        ageGroup: 'mature',
        keywords: ['anti-wrinkle', 'bakuchiol', 'firming', 'aging']
      },
      
      // Creams
      {
        id: '23',
        name: 'ND Cell ANTI-WRINKLE CREAM',
        skinType: 'mature',
        targetConcerns: '["anti-aging"]',
        usage: 'morning-evening',
        ageGroup: 'mature',
        keywords: ['anti-wrinkle', 'neck', 'firming', 'peptide']
      },
      {
        id: '25',
        name: 'SOOTHING REPAIR POSTCREAM',
        skinType: 'sensitive',
        targetConcerns: '["sensitivity"]',
        usage: 'evening',
        ageGroup: 'adult',
        keywords: ['soothing', 'repair', 'recovery', 'gentle']
      },
      {
        id: '26',
        name: 'EGF REPAIR OXYMASK CREAM',
        skinType: 'sensitive',
        targetConcerns: '["sensitivity", "anti-aging"]',
        usage: 'evening',
        ageGroup: 'adult',
        keywords: ['repair', 'EGF', 'regenerating', 'oxygen']
      },
      {
        id: '27',
        name: 'SKIN BARRIER PROTECTING CREAM',
        skinType: 'sensitive',
        targetConcerns: '["sensitivity"]',
        usage: 'morning-evening',
        ageGroup: 'adult',
        keywords: ['barrier', 'protecting', 'ceramide', 'repair']
      },
      {
        id: '28',
        name: 'INTENSIVE HYDRO SOOTHING CREAM',
        skinType: 'sensitive',
        targetConcerns: '["sensitivity", "hydration"]',
        usage: 'morning-evening',
        ageGroup: 'adult',
        keywords: ['soothing', 'hydrating', 'aloe', 'gentle']
      },
      {
        id: '29',
        name: 'MOISTURE REPLENISHING HYALURON CREAM',
        skinType: 'dry',
        targetConcerns: '["hydration"]',
        usage: 'morning-evening',
        ageGroup: 'adult',
        keywords: ['moisture', 'hyaluronic', 'hydrating', 'mushroom']
      },
      {
        id: '30',
        name: 'INTENSIVE PROBLEM CONTROL CREAM',
        skinType: 'oily',
        targetConcerns: '["acne-blemishes", "pore-care"]',
        usage: 'morning-evening',
        ageGroup: 'teen',
        keywords: ['blemish', 'oil control', 'sebum', 'acne']
      },
      {
        id: '31',
        name: 'MULTI VITA RADIANCE CREAM',
        skinType: 'normal',
        targetConcerns: '["brightening"]',
        usage: 'morning-evening',
        ageGroup: 'adult',
        keywords: ['brightening', 'vitamin', 'radiance', 'glow']
      },
      {
        id: '32',
        name: 'MULTI FUNCTIONAL ANTI-WRINKLE CREAM',
        skinType: 'mature',
        targetConcerns: '["anti-aging"]',
        usage: 'morning-evening',
        ageGroup: 'mature',
        keywords: ['anti-wrinkle', 'bakuchiol', 'firming', 'aging']
      },
      
      // Masks
      {
        id: '34',
        name: 'SKIN RESCUE OVERNIGHT CREAM MASK',
        skinType: 'normal',
        targetConcerns: '["anti-aging", "hydration"]',
        usage: 'evening',
        ageGroup: 'adult',
        keywords: ['overnight', 'rescue', 'oxygen', 'revitalizing']
      },
      {
        id: '35',
        name: 'HYDRO COOL MODELING MASK',
        skinType: 'sensitive',
        targetConcerns: '["sensitivity", "hydration"]',
        usage: 'evening',
        ageGroup: 'adult',
        keywords: ['cooling', 'soothing', 'hydrating', 'gentle']
      },
      {
        id: '36',
        name: 'SOOTHING BOMB SEA ALGAE MASK',
        skinType: 'sensitive',
        targetConcerns: '["sensitivity", "hydration"]',
        usage: 'evening',
        ageGroup: 'adult',
        keywords: ['soothing', 'sea algae', 'healing', 'gentle']
      },
      {
        id: '37',
        name: 'PEPTIDE GEL MASK',
        skinType: 'sensitive',
        targetConcerns: '["sensitivity", "anti-aging"]',
        usage: 'evening',
        ageGroup: 'adult',
        keywords: ['peptide', 'cooling', 'soothing', 'gentle']
      },
      {
        id: '38',
        name: 'EZ CO₂ MASK KIT',
        skinType: 'normal',
        targetConcerns: '["brightening", "pore-care"]',
        usage: 'evening',
        ageGroup: 'adult',
        keywords: ['CO2', 'oxygen', 'firming', 'brightening']
      },
      {
        id: '52',
        name: 'SKIN REBOOT PDRN MASK PACK',
        skinType: 'sensitive',
        targetConcerns: '["sensitivity", "anti-aging"]',
        usage: 'evening',
        ageGroup: 'adult',
        keywords: ['PDRN', 'regeneration', 'repair', 'salmon']
      },
      
      // Sun Protection
      {
        id: '39',
        name: 'ULTRA SHIELD SUN CREAM [SPF 50+ PA++++]',
        skinType: 'normal',
        targetConcerns: '["sensitivity"]',
        usage: 'morning',
        ageGroup: 'adult',
        keywords: ['SPF', 'sun protection', 'UV', 'reef-safe']
      },
      {
        id: '40',
        name: 'MULTI SUN CREAM [SPF 40 PA++]',
        skinType: 'normal',
        targetConcerns: '["sensitivity"]',
        usage: 'morning',
        ageGroup: 'adult',
        keywords: ['SPF', 'sun protection', 'mild', 'daily']
      },
      
      // BB Creams
      {
        id: '41',
        name: 'SKIN CARING BLEMISH BALM CUSHION [SPF 50+ PA++++]',
        skinType: 'sensitive',
        targetConcerns: '["sensitivity"]',
        usage: 'morning',
        ageGroup: 'adult',
        keywords: ['BB cushion', 'coverage', 'protection', 'post-treatment']
      },
      {
        id: '42',
        name: 'INTENSIVE BLEMISH BALM CREAM [SPF 30 PA++]',
        skinType: 'sensitive',
        targetConcerns: '["sensitivity"]',
        usage: 'morning',
        ageGroup: 'adult',
        keywords: ['BB cream', 'coverage', 'protection', 'natural']
      },
      
      // Hair Products
      {
        id: '43',
        name: 'HR³ MATRIX HAIR TONIC α',
        skinType: null,
        targetConcerns: '["hair"]',
        usage: 'morning-evening',
        ageGroup: 'adult',
        keywords: ['hair tonic', 'hair loss', 'scalp', 'functional']
      },
      {
        id: '44',
        name: 'HR³ MATRIX SCALP SHAMPOO α',
        skinType: null,
        targetConcerns: '["hair"]',
        usage: 'morning-evening',
        ageGroup: 'adult',
        keywords: ['shampoo', 'scalp', 'hair loss', 'sebum']
      },
      {
        id: '45',
        name: 'HR³ MATRIX HAIR SOLUTION α',
        skinType: null,
        targetConcerns: '["hair"]',
        usage: 'evening',
        ageGroup: 'adult',
        keywords: ['hair solution', 'microneedling', 'hair loss', 'premium']
      },
      {
        id: '46',
        name: 'HR³ MATRIX SCALP PEELING α',
        skinType: null,
        targetConcerns: '["hair"]',
        usage: 'evening',
        ageGroup: 'adult',
        keywords: ['scalp peeling', 'hair loss', 'cleansing', 'cooling']
      },
      {
        id: '47',
        name: 'HR³ MATRIX MESOPECIA KIT',
        skinType: null,
        targetConcerns: '["hair"]',
        usage: 'evening',
        ageGroup: 'adult',
        keywords: ['mesopecia', 'hair loss', 'kit', 'systematic']
      },
      
      // Devices
      {
        id: '48',
        name: 'Hair-GENTRON',
        skinType: null,
        targetConcerns: '["hair"]',
        usage: 'evening',
        ageGroup: 'adult',
        keywords: ['hair device', 'LED', 'massaging', 'hair growth']
      },
      {
        id: '49',
        name: 'GENO-LED IR II',
        skinType: 'normal',
        targetConcerns: '["anti-aging", "acne-blemishes", "brightening", "sensitivity"]',
        usage: 'evening',
        ageGroup: 'adult',
        keywords: ['LED', 'light therapy', 'anti-aging', 'acne', 'brightening']
      }
    ]
    
    let updatedCount = 0
    
    for (const product of products) {
      const recommendation = productRecommendations.find(rec => rec.id === product.id)
      
      if (recommendation) {
        await prisma.product.update({
          where: { id: product.id },
          data: {
            skinType: recommendation.skinType,
            targetConcerns: recommendation.targetConcerns,
            usage: recommendation.usage,
            ageGroup: recommendation.ageGroup
          }
        })
        updatedCount++
        console.log(`✅ Updated: ${product.name} -> ${recommendation.skinType || 'hair'} skin, ${recommendation.targetConcerns}`)
      } else {
        console.log(`⚠️  No recommendation found for: ${product.name}`)
      }
    }
    
    console.log(`🎉 Successfully updated ${updatedCount} products with comprehensive skin recommendation data`)
    
    // Show summary by category
    const summary = await prisma.product.groupBy({
      by: ['skinType'],
      _count: {
        skinType: true
      }
    })
    
    console.log('\n📊 Summary by skin type:')
    summary.forEach(item => {
      console.log(`${item.skinType || 'Hair products'}: ${item._count.skinType} products`)
    })
    
    // Show some examples
    const sampleProducts = await prisma.product.findMany({
      where: {
        skinType: { not: null }
      },
      take: 10,
      select: {
        name: true,
        skinType: true,
        targetConcerns: true,
        usage: true,
        ageGroup: true
      }
    })
    
    console.log('\n📋 Sample updated products:')
    sampleProducts.forEach(product => {
      console.log(`${product.name}: ${product.skinType} skin, ${product.targetConcerns}, ${product.usage}, ${product.ageGroup}`)
    })
    
  } catch (error) {
    console.error('❌ Error updating skin recommendations:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateSkinRecommendations()
