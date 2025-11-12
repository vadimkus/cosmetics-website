const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function testAdminOrdersAPI() {
  try {
    console.log('🔍 Testing admin orders API logic...\n')
    
    // Simulate what readOrders does
    const allOrders = await prisma.order.findMany({
      select: {
        id: true,
        orderNumber: true,
        customerEmail: true,
        customerName: true,
        customerPhone: true,
        customerEmirate: true,
        customerAddress: true,
        subtotal: true,
        discountAmount: true,
        shipping: true,
        vat: true,
        total: true,
        status: true,
        sessionId: true,
        createdAt: true,
        updatedAt: true,
        items: {
          select: {
            id: true,
            productId: true,
            productName: true,
            price: true,
            quantity: true,
            image: true,
            color: true,
            size: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    
    console.log(`📦 Total orders from readOrders: ${allOrders.length}`)
    
    // Filter out cancelled orders (like the API does)
    const nonCancelledOrders = allOrders.filter(order => order.status !== 'CANCELLED')
    console.log(`✅ Non-cancelled orders: ${nonCancelledOrders.length}`)
    
    console.log('\n📋 Non-cancelled orders:')
    nonCancelledOrders.forEach((order, index) => {
      console.log(`${index + 1}. Order #${order.orderNumber} - ${order.status} - ${order.total} AED`)
      console.log(`   ID: ${order.id}`)
      console.log(`   Customer: ${order.customerName}`)
      console.log(`   Items: ${order.items.length}`)
    })
    
    // Check if orders have IDs
    const ordersWithoutIds = nonCancelledOrders.filter(order => !order.id)
    if (ordersWithoutIds.length > 0) {
      console.log(`\n⚠️ Found ${ordersWithoutIds.length} orders without IDs:`)
      ordersWithoutIds.forEach(order => {
        console.log(`   - Order #${order.orderNumber}`)
      })
    } else {
      console.log('\n✅ All orders have IDs')
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testAdminOrdersAPI()

