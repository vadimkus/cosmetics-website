const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function testReadOrders() {
  try {
    console.log('🔍 Testing readOrders function logic...\n')
    
    // Simulate exactly what readOrders does
    const orders = await prisma.order.findMany({
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
    
    console.log(`📦 Orders found: ${orders.length}\n`)
    
    if (orders.length === 0) {
      console.log('❌ No orders found with this query')
      
      // Try a simpler query
      const simpleOrders = await prisma.order.findMany({
        select: {
          id: true,
          orderNumber: true,
          status: true
        }
      })
      console.log(`📦 Simple query found: ${simpleOrders.length} orders`)
      
      if (simpleOrders.length > 0) {
        console.log('\n⚠️ Issue might be with the select fields')
        console.log('Sample order:', simpleOrders[0])
      }
    } else {
      console.log('✅ Orders found!')
      orders.slice(0, 3).forEach((order, index) => {
        console.log(`\n${index + 1}. Order #${order.orderNumber}`)
        console.log(`   ID: ${order.id}`)
        console.log(`   Status: ${order.status}`)
        console.log(`   Items: ${order.items.length}`)
      })
    }
    
    // Check for cancelled orders
    const cancelledCount = orders.filter(o => o.status === 'CANCELLED').length
    const nonCancelledCount = orders.filter(o => o.status !== 'CANCELLED').length
    console.log(`\n📊 Status breakdown:`)
    console.log(`   Total: ${orders.length}`)
    console.log(`   CANCELLED: ${cancelledCount}`)
    console.log(`   Non-cancelled: ${nonCancelledCount}`)
    
  } catch (error) {
    console.error('❌ Error:', error)
    console.error('Stack:', error.stack)
  } finally {
    await prisma.$disconnect()
  }
}

testReadOrders()

