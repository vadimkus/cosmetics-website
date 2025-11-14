const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Map product names/patterns to variants
const PRODUCT_VARIANT_MAP = {
  // Color variants
  'BLEMISH BALM CUSHION': { type: 'color', value: 'Beige' },
  
  // Size variants - match by product name patterns
  'MICRONEEDLE': { type: 'size', value: '0.5mm' },
  '180ml': { type: 'size', value: '180ml' },
  '500ml': { type: 'size', value: '500ml' },
  '200ml': { type: 'size', value: '200ml' },
  '1000ml': { type: 'size', value: '1000ml' },
  '50g': { type: 'size', value: '50g' },
  '100g': { type: 'size', value: '100g' },
  '230g': { type: 'size', value: '230g' },
  '250g': { type: 'size', value: '250g' },
  '20g': { type: 'size', value: '20g' },
}

// Products that typically come in standard sizes (add default size)
const DEFAULT_SIZE_PRODUCTS = [
  'CREAM',
  'SERUM',
  'TONER',
  'MASK',
  'CLEANSER',
  'MIST',
  'GEL',
  'PEELING',
  'BOOSTER',
  'HAIR TONIC'
]

async function addVariantsByProductName() {
  try {
    console.log('🔍 Finding all order items without variants...\n')
    
    // Find all order items that don't have color or size
    const orderItems = await prisma.orderItem.findMany({
      where: {
        AND: [
          { color: null },
          { size: null }
        ]
      },
      include: {
        order: {
          select: {
            orderNumber: true,
            customerName: true
          }
        }
      }
    })
    
    console.log(`📦 Found ${orderItems.length} order items without variants\n`)
    
    if (orderItems.length === 0) {
      console.log('✅ All items already have variants')
      return
    }
    
    let updatedCount = 0
    const variantStats = { color: 0, size: 0, skipped: 0 }
    const productStats = new Map()
    
    for (const item of orderItems) {
      const productName = item.productName.toUpperCase()
      let updateData = {}
      let matched = false
      
      // Check for exact product name matches first
      if (productName.includes('BLEMISH BALM CUSHION')) {
        updateData.color = 'Beige'
        variantStats.color++
        matched = true
      }
      
      // Check for size patterns in product name
      if (!matched) {
        for (const [pattern, config] of Object.entries(PRODUCT_VARIANT_MAP)) {
          if (productName.includes(pattern) && config.type === 'size') {
            updateData.size = config.value
            variantStats.size++
            matched = true
            break
          }
        }
      }
      
      // If no specific match, try to infer size from product type
      if (!matched) {
        for (const productType of DEFAULT_SIZE_PRODUCTS) {
          if (productName.includes(productType)) {
            // Add a default size based on product type
            if (productName.includes('CREAM') || productName.includes('SERUM')) {
              updateData.size = '50g'
            } else if (productName.includes('TONER') || productName.includes('CLEANSER') || productName.includes('MIST')) {
              updateData.size = '200ml'
            } else if (productName.includes('MASK')) {
              updateData.size = '50g'
            } else {
              updateData.size = '50g' // Default
            }
            variantStats.size++
            matched = true
            break
          }
        }
      }
      
      // Track statistics
      if (!productStats.has(item.productName)) {
        productStats.set(item.productName, { total: 0, updated: 0 })
      }
      const stats = productStats.get(item.productName)
      stats.total++
      
      if (matched && Object.keys(updateData).length > 0) {
        await prisma.orderItem.update({
          where: { id: item.id },
          data: updateData
        })
        stats.updated++
        updatedCount++
      } else {
        variantStats.skipped++
      }
    }
    
    console.log(`✅ Updated ${updatedCount} order items:\n`)
    console.log(`   Color variants: ${variantStats.color}`)
    console.log(`   Size variants: ${variantStats.size}`)
    console.log(`   Skipped (no variant available): ${variantStats.skipped}`)
    
    console.log('\n📋 Product breakdown:')
    productStats.forEach((stats, productName) => {
      if (stats.updated > 0) {
        console.log(`   ${productName}: ${stats.updated}/${stats.total} updated`)
      }
    })
    
    console.log('\n✅ Variants added to existing orders!')
    
  } catch (error) {
    console.error('❌ Error:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

addVariantsByProductName()

