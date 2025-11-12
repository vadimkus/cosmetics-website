const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function checkOrder() {
  try {
    // Find order by partial ID match (last 8 chars)
    const allOrders = await prisma.order.findMany({
      where: {
        id: {
          endsWith: 'jy9m8n8y'
        }
      },
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
      }
    })
    
    if (allOrders.length === 0) {
      console.log('❌ Order not found')
      return
    }
    
    const order = allOrders[0]
    
    console.log(`✅ Found order:`)
    console.log(`   Full ID: ${order.id}`)
    console.log(`   Order Number: #${order.orderNumber}`)
    console.log(`   Customer: ${order.customerName}`)
    console.log(`   Status: ${order.status}`)
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
    
    // Find cleanser products
    const cleanserItems = order.items.filter(item => 
      item.productName.toLowerCase().includes('cleanser')
    )
    
    if (cleanserItems.length > 0) {
      console.log(`\n🧴 Cleanser products found (${cleanserItems.length}):\n`)
      cleanserItems.forEach((item, index) => {
        console.log(`${index + 1}. ${item.productName}`)
        console.log(`   Current Size: ${item.size || '❌ MISSING'}`)
        console.log(`   Should be: 200ml`)
        console.log(`   Item ID: ${item.id}`)
        console.log('')
      })
    } else {
      console.log('\n⚠️  No cleanser products found in this order')
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkOrder()

