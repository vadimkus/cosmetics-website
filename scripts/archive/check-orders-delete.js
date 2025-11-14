const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function checkOrders() {
  try {
    const orderNumbers = ['6x44v2vk', 'q5oo8bdd']
    
    console.log('🔍 Checking orders for deletion issues...\n')
    
    for (const orderNumber of orderNumbers) {
      console.log(`\n📦 Checking Order #${orderNumber}:`)
      
      // Try to find by orderNumber
      let order = await prisma.order.findUnique({
        where: { orderNumber },
        include: {
          items: true
        }
      })
      
      if (!order) {
        // Try partial match
        const orders = await prisma.order.findMany({
          where: {
            orderNumber: {
              contains: orderNumber
            }
          },
          include: { items: true }
        })
        
        if (orders.length > 0) {
          order = orders[0]
          console.log(`   ⚠️  Found partial match: #${order.orderNumber}`)
        } else {
          console.log(`   ❌ Order not found`)
          continue
        }
      }
      
      if (order) {
        console.log(`   ✅ Found order:`)
        console.log(`      ID: ${order.id}`)
        console.log(`      Order Number: ${order.orderNumber}`)
        console.log(`      Customer: ${order.customerName}`)
        console.log(`      Status: ${order.status}`)
        console.log(`      Items: ${order.items.length}`)
        console.log(`      Created: ${order.createdAt}`)
        
        // Check if order has items that might prevent deletion
        if (order.items.length > 0) {
          console.log(`   📋 Order Items:`)
          order.items.forEach((item, idx) => {
            console.log(`      ${idx + 1}. ${item.productName} (ID: ${item.id})`)
          })
        }
        
        // Try to check if we can delete it
        try {
          // Just check, don't actually delete
          console.log(`   🔍 Checking deletion constraints...`)
          
          // Check for foreign key constraints
          const itemCount = await prisma.orderItem.count({
            where: { orderId: order.id }
          })
          console.log(`      Order items count: ${itemCount}`)
          
        } catch (error) {
          console.log(`      ⚠️  Error checking: ${error.message}`)
        }
      }
    }
    
    // Also list all orders to see if these might be using different IDs
    console.log(`\n\n📋 All orders in database:`)
    const allOrders = await prisma.order.findMany({
      select: {
        id: true,
        orderNumber: true,
        customerName: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' },
      take: 20
    })
    
    allOrders.forEach((o, idx) => {
      console.log(`${idx + 1}. ID: ${o.id.substring(0, 8)}... | #${o.orderNumber} | ${o.customerName}`)
    })
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkOrders()

