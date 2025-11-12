const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function findOrdersByPartialId() {
  try {
    const partialIds = ['6x44v2vk', 'q5oo8bdd']
    
    console.log('🔍 Searching for orders by partial ID...\n')
    
    // Get all orders
    const allOrders = await prisma.order.findMany({
      select: {
        id: true,
        orderNumber: true,
        customerName: true,
        customerEmail: true,
        status: true,
        createdAt: true,
        items: {
          select: {
            id: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    
    console.log(`📦 Checking ${allOrders.length} orders...\n`)
    
    for (const partialId of partialIds) {
      console.log(`\n🔍 Searching for orders with ID ending in "${partialId}":`)
      
      const matchingOrders = allOrders.filter(order => 
        order.id.endsWith(partialId) || order.id.includes(partialId)
      )
      
      if (matchingOrders.length > 0) {
        matchingOrders.forEach(order => {
          console.log(`\n✅ Found:`)
          console.log(`   Full ID: ${order.id}`)
          console.log(`   Order Number: #${order.orderNumber}`)
          console.log(`   Customer: ${order.customerName}`)
          console.log(`   Status: ${order.status}`)
          console.log(`   Items: ${order.items.length}`)
          console.log(`   Created: ${order.createdAt}`)
          console.log(`   Last 8 chars: ${order.id.slice(-8)}`)
        })
      } else {
        console.log(`   ❌ No orders found`)
      }
    }
    
    // Also show all order IDs for reference
    console.log(`\n\n📋 All order IDs (last 8 chars):`)
    allOrders.forEach((order, idx) => {
      console.log(`${idx + 1}. ${order.id.slice(-8)} | #${order.orderNumber} | ${order.customerName}`)
    })
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

findOrdersByPartialId()

