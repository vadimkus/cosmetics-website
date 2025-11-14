const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function addSerumSize() {
  try {
    console.log('🔍 Finding orders with "ALL FOR SENSITIVE SERUM" missing size...\n')
    
    // Find all order items with this product name that are missing size
    const orderItems = await prisma.orderItem.findMany({
      where: {
        productName: {
          contains: 'ALL FOR SENSITIVE SERUM',
          mode: 'insensitive'
        },
        size: null
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
    
    console.log(`📦 Found ${orderItems.length} order items missing size\n`)
    
    if (orderItems.length === 0) {
      console.log('✅ No items found that need updating')
      return
    }
    
    // Group by order for display
    const ordersMap = new Map()
    orderItems.forEach(item => {
      const orderNum = item.order.orderNumber
      if (!ordersMap.has(orderNum)) {
        ordersMap.set(orderNum, {
          orderNumber: orderNum,
          customerName: item.order.customerName,
          items: []
        })
      }
      ordersMap.get(orderNum).items.push({
        id: item.id,
        productName: item.productName
      })
    })
    
    console.log('📋 Orders to update:\n')
    ordersMap.forEach((order, orderNum) => {
      console.log(`Order #${orderNum} - ${order.customerName}`)
      order.items.forEach(item => {
        console.log(`  - ${item.productName}`)
      })
    })
    
    // Update all items
    console.log(`\n🔄 Updating ${orderItems.length} items with size "30ml"...\n`)
    
    let updatedCount = 0
    for (const item of orderItems) {
      await prisma.orderItem.update({
        where: { id: item.id },
        data: { size: '30ml' }
      })
      updatedCount++
      console.log(`✅ Updated item ${updatedCount}/${orderItems.length}: ${item.productName} in order #${item.order.orderNumber}`)
    }
    
    console.log(`\n✅ Successfully updated ${updatedCount} order items with size "30ml"`)
    
    // Verify the update
    console.log('\n🔍 Verifying updates...\n')
    const remaining = await prisma.orderItem.count({
      where: {
        productName: {
          contains: 'ALL FOR SENSITIVE SERUM',
          mode: 'insensitive'
        },
        size: null
      }
    })
    
    if (remaining === 0) {
      console.log('✅ All serum items now have size information')
    } else {
      console.log(`⚠️  ${remaining} items still missing size`)
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

addSerumSize()

