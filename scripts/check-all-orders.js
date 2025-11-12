const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function checkAllOrders() {
  try {
    console.log('🔍 Checking all orders in database...\n')
    
    // Get total count
    const totalCount = await prisma.order.count()
    console.log(`📦 Total orders in database: ${totalCount}\n`)
    
    if (totalCount === 0) {
      console.log('❌ No orders found in database')
      return
    }
    
    // Get all orders
    const allOrders = await prisma.order.findMany({
      select: {
        id: true,
        orderNumber: true,
        customerEmail: true,
        customerName: true,
        status: true,
        total: true,
        createdAt: true,
        items: {
          select: {
            id: true,
            productName: true,
            quantity: true,
            color: true,
            size: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 20
    })
    
    console.log(`📋 Showing last ${allOrders.length} orders:\n`)
    allOrders.forEach((order, index) => {
      console.log(`${index + 1}. Order #${order.orderNumber}`)
      console.log(`   ID: ${order.id}`)
      console.log(`   Customer: ${order.customerName} (${order.customerEmail})`)
      console.log(`   Status: ${order.status}`)
      console.log(`   Total: ${order.total} AED`)
      console.log(`   Created: ${order.createdAt}`)
      console.log(`   Items: ${order.items.length}`)
      order.items.forEach((item, itemIndex) => {
        console.log(`     ${itemIndex + 1}. ${item.productName} (Qty: ${item.quantity})`)
        if (item.color) console.log(`        Color: ${item.color}`)
        if (item.size) console.log(`        Size: ${item.size}`)
      })
      console.log('')
    })
    
    // Check for order #bkigmr8e specifically
    const specificOrder = await prisma.order.findUnique({
      where: { orderNumber: 'bkigmr8e' },
      include: { items: true }
    })
    
    if (specificOrder) {
      console.log('✅ Found order #bkigmr8e:')
      console.log(JSON.stringify(specificOrder, null, 2))
    } else {
      console.log('❌ Order #bkigmr8e not found')
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkAllOrders()

