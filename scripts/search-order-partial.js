const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function searchOrder() {
  try {
    const searchTerm = '6x44v2vk'
    console.log(`🔍 Searching for orders containing "${searchTerm}"...\n`)
    
    // Try exact match first
    let order = await prisma.order.findUnique({
      where: { orderNumber: searchTerm },
      include: { items: true }
    })
    
    if (order) {
      console.log(`✅ Found exact match: #${order.orderNumber}\n`)
    } else {
      // Try partial match
      const orders = await prisma.order.findMany({
        where: {
          orderNumber: {
            contains: searchTerm
          }
        },
        include: { items: true },
        take: 10
      })
      
      if (orders.length > 0) {
        console.log(`✅ Found ${orders.length} orders with partial match:\n`)
        orders.forEach((o, i) => {
          console.log(`${i + 1}. Order #${o.orderNumber}`)
          console.log(`   Customer: ${o.customerName}`)
          console.log(`   Items: ${o.items.length}`)
        })
        order = orders[0]
      } else {
        // List recent orders to help identify
        const recentOrders = await prisma.order.findMany({
          select: {
            orderNumber: true,
            customerName: true,
            createdAt: true
          },
          orderBy: { createdAt: 'desc' },
          take: 20
        })
        
        console.log(`❌ Order not found. Recent orders:\n`)
        recentOrders.forEach((o, i) => {
          console.log(`${i + 1}. #${o.orderNumber} - ${o.customerName} - ${o.createdAt}`)
        })
        return
      }
    }
    
    if (order) {
      console.log(`\n📦 Order Details:\n`)
      console.log(`Order #: ${order.orderNumber}`)
      console.log(`Customer: ${order.customerName} (${order.customerEmail})`)
      console.log(`Items: ${order.items.length}\n`)
      
      order.items.forEach((item, index) => {
        console.log(`${index + 1}. ${item.productName}`)
        console.log(`   Size: ${item.size || '❌ MISSING'}`)
        console.log(`   Color: ${item.color || 'N/A'}`)
        console.log('')
      })
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

searchOrder()

