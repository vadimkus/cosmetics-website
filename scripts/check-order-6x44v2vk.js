const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function checkOrder() {
  try {
    const orderNumber = '6x44v2vk'
    console.log(`🔍 Checking order #${orderNumber}...\n`)
    
    const order = await prisma.order.findUnique({
      where: { orderNumber },
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
    
    if (!order) {
      console.log(`❌ Order #${orderNumber} not found`)
      return
    }
    
    console.log(`✅ Found order #${order.orderNumber}`)
    console.log(`   Customer: ${order.customerName} (${order.customerEmail})`)
    console.log(`   Status: ${order.status}`)
    console.log(`   Total: ${order.total} AED`)
    console.log(`   Created: ${order.createdAt}`)
    console.log(`\n📦 Order Items (${order.items.length}):\n`)
    
    order.items.forEach((item, index) => {
      console.log(`${index + 1}. ${item.productName}`)
      console.log(`   Product ID: ${item.productId}`)
      console.log(`   Quantity: ${item.quantity}`)
      console.log(`   Price: ${item.price} AED`)
      console.log(`   Color: ${item.color || '❌ NOT SET'}`)
      console.log(`   Size: ${item.size || '❌ NOT SET'}`)
      console.log('')
    })
    
    // Check for serum products
    const serumItems = order.items.filter(item => 
      item.productName.toLowerCase().includes('serum') || 
      item.productName.toLowerCase().includes('sens')
    )
    
    if (serumItems.length > 0) {
      console.log(`\n🔬 Serum products found (${serumItems.length}):\n`)
      serumItems.forEach((item, index) => {
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

checkOrder()

