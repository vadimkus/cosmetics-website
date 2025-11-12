require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function checkOrder() {
  try {
    // Find order by partial ID match (last 8 chars)
    const allOrders = await prisma.order.findMany({
      include: {
        items: {
          select: {
            id: true,
            productId: true,
            productName: true,
            quantity: true,
            price: true,
            color: true,
            size: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    
    // Find order with ID ending in 89mizrkr
    const order = allOrders.find(o => o.id.endsWith('89mizrkr'))
    
    if (!order) {
      console.log('❌ Order not found')
      console.log('\n📋 Available orders (last 8 chars of ID):')
      allOrders.forEach((o, idx) => {
        console.log(`${idx + 1}. ${o.id.slice(-8)} | #${o.orderNumber} | ${o.customerName}`)
      })
      return
    }
    
    console.log(`✅ Found order:`)
    console.log(`   Full ID: ${order.id}`)
    console.log(`   Order Number: #${order.orderNumber}`)
    console.log(`   Customer: ${order.customerName}`)
    console.log(`   Status: ${order.status}`)
    console.log(`   Created: ${order.createdAt}`)
    console.log(`\n📦 Order Items (${order.items.length}):\n`)
    
    order.items.forEach((item, index) => {
      console.log(`${index + 1}. ${item.productName}`)
      console.log(`   Product ID: ${item.productId}`)
      console.log(`   Quantity: ${item.quantity}`)
      console.log(`   Price: ${item.price} AED`)
      console.log(`   Color: ${item.color || 'N/A'}`)
      console.log(`   Size: ${item.size || '❌ NOT SET'}`)
      console.log('')
    })
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkOrder()

