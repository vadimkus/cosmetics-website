const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Product configurations with variants
const PRODUCT_VARIANTS = {
  // Color variants
  '41': { type: 'color', options: ['Beige', 'Ivory', 'Camel'] },
  
  // Size variants
  '1': { type: 'size', options: ['0.25mm', '0.5mm', '1.0mm', '1.5mm', '2.0mm'] },
  '10': { type: 'size', options: ['180ml', '500ml'] },
  '15': { type: 'size', options: ['200ml', '500ml'] },
  '16': { type: 'size', options: ['200ml', '1000ml'] },
  '25': { type: 'size', options: ['20g', '100g'] },
  '29': { type: 'size', options: ['50g', '250g'] },
  '30': { type: 'size', options: ['50g', '250g'] },
  '31': { type: 'size', options: ['50g', '230g'] },
  '32': { type: 'size', options: ['50g', '250g'] },
  '28': { type: 'size', options: ['50g', '250g'] },
}

async function addAllVariantsToOrders() {
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
    
    // Group by product to see distribution
    const productMap = new Map()
    orderItems.forEach(item => {
      const productId = item.productId
      if (!productMap.has(productId)) {
        productMap.set(productId, {
          productName: item.productName,
          count: 0,
          items: []
        })
      }
      const product = productMap.get(productId)
      product.count++
      product.items.push(item)
    })
    
    console.log('📋 Products needing variants:\n')
    productMap.forEach((product, productId) => {
      console.log(`  Product ID ${productId}: ${product.productName} (${product.count} items)`)
    })
    console.log('')
    
    let updatedCount = 0
    const variantStats = { color: 0, size: 0, none: 0 }
    
    for (const item of orderItems) {
      const productConfig = PRODUCT_VARIANTS[item.productId]
      let updateData = {}
      
      if (productConfig) {
        if (productConfig.type === 'color') {
          // Use first color as default (Beige)
          updateData.color = productConfig.options[0]
          variantStats.color++
        } else if (productConfig.type === 'size') {
          // Use first size as default
          updateData.size = productConfig.options[0]
          variantStats.size++
        }
      } else {
        // For products without variants, we could add a default size based on product name
        // or leave it null. Let's check if product name suggests a size
        const productName = item.productName.toLowerCase()
        
        // Try to infer size from product name or use a common default
        if (productName.includes('50g') || productName.includes('50 g')) {
          updateData.size = '50g'
          variantStats.size++
        } else if (productName.includes('100g') || productName.includes('100 g')) {
          updateData.size = '100g'
          variantStats.size++
        } else if (productName.includes('200ml') || productName.includes('200 ml')) {
          updateData.size = '200ml'
          variantStats.size++
        } else if (productName.includes('500ml') || productName.includes('500 ml')) {
          updateData.size = '500ml'
          variantStats.size++
        } else {
          // No variant available for this product
          variantStats.none++
          continue
        }
      }
      
      if (Object.keys(updateData).length > 0) {
        await prisma.orderItem.update({
          where: { id: item.id },
          data: updateData
        })
        updatedCount++
      }
    }
    
    console.log(`✅ Updated ${updatedCount} order items:\n`)
    console.log(`   Color variants: ${variantStats.color}`)
    console.log(`   Size variants: ${variantStats.size}`)
    console.log(`   No variants available: ${variantStats.none}`)
    console.log('\n✅ Variants added to existing orders!')
    
  } catch (error) {
    console.error('❌ Error:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

addAllVariantsToOrders()

