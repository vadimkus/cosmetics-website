require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function checkRecentOrders() {
  try {
    console.log('🔍 Checking the 2 most recent orders for size information...\n')
    
    const recentOrders = await prisma.order.findMany({
      include: {
        items: {
          select: {
            id: true,
            productName: true,
            quantity: true,
            price: true,
            color: true,
            size: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 2
    })
    
    if (recentOrders.length === 0) {
      console.log('❌ No orders found')
      return
    }
    
    recentOrders.forEach((order, idx) => {
      console.log(`\n📦 Order #${idx + 1}: ${order.orderNumber}`)
      console.log(`   Customer: ${order.customerName}`)
      console.log(`   Created: ${order.createdAt}`)
      console.log(`   Items: ${order.items.length}\n`)
      
      order.items.forEach((item, itemIdx) => {
        console.log(`   ${itemIdx + 1}. ${item.productName}`)
        console.log(`      Quantity: ${item.quantity}`)
        console.log(`      Size: ${item.size || '❌ MISSING'}`)
        console.log(`      Color: ${item.color || 'N/A'}`)
        console.log('')
      })
    })
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkRecentOrders()

