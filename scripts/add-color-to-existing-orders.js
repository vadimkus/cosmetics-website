const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Product ID 41 has color variants: Beige, Ivory, Camel
const PRODUCT_WITH_COLORS = {
  productId: '41',
  productNamePattern: 'BLEMISH BALM CUSHION',
  availableColors: ['Beige', 'Ivory', 'Camel']
}

async function addColorToExistingOrders() {
  try {
    console.log('🔍 Finding orders with SKIN CARING BLEMISH BALM CUSHION...\n')
    
    // Find all order items for product ID 41 or matching product name
    const orderItems = await prisma.orderItem.findMany({
      where: {
        OR: [
          { productId: PRODUCT_WITH_COLORS.productId },
          { productName: { contains: PRODUCT_WITH_COLORS.productNamePattern, mode: 'insensitive' } }
        ],
        color: null // Only update items without color
      },
      include: {
        order: {
          select: {
            orderNumber: true,
            customerName: true,
            createdAt: true
          }
        }
      }
    })
    
    console.log(`📦 Found ${orderItems.length} order items without color data\n`)
    
    if (orderItems.length === 0) {
      console.log('✅ No items need updating')
      return
    }
    
    // Group by order to show summary
    const ordersMap = new Map()
    orderItems.forEach(item => {
      if (!ordersMap.has(item.orderId)) {
        ordersMap.set(item.orderId, {
          orderNumber: item.order.orderNumber,
          customerName: item.order.customerName,
          items: []
        })
      }
      ordersMap.get(item.orderId).items.push(item)
    })
    
    console.log(`📋 Affected orders: ${ordersMap.size}\n`)
    ordersMap.forEach((orderData, orderId) => {
      console.log(`Order #${orderData.orderNumber} (${orderData.customerName}): ${orderData.items.length} item(s)`)
    })
    console.log('')
    
    // Update each item with a default color (Beige, or distribute evenly)
    let updatedCount = 0
    const colorDistribution = { Beige: 0, Ivory: 0, Camel: 0 }
    
    for (const item of orderItems) {
      // Distribute colors evenly: Beige (most common), then Ivory, then Camel
      // Or use Beige as default for all
      const defaultColor = 'Beige' // You can change this to distribute: PRODUCT_WITH_COLORS.availableColors[updatedCount % 3]
      
      await prisma.orderItem.update({
        where: { id: item.id },
        data: { color: defaultColor }
      })
      
      colorDistribution[defaultColor]++
      updatedCount++
    }
    
    console.log(`✅ Updated ${updatedCount} order items with color data:\n`)
    console.log(`   Beige: ${colorDistribution.Beige}`)
    console.log(`   Ivory: ${colorDistribution.Ivory}`)
    console.log(`   Camel: ${colorDistribution.Camel}`)
    console.log('\n✅ All existing orders now have color data!')
    
  } catch (error) {
    console.error('❌ Error:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

addColorToExistingOrders()

