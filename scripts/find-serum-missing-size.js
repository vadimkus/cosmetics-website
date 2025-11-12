const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function findSerumMissingSize() {
  try {
    console.log('🔍 Searching for orders with serum products missing size...\n')
    
    // Get all orders with items
    const orders = await prisma.order.findMany({
      include: {
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
      orderBy: { createdAt: 'desc' }
    })
    
    console.log(`📦 Checking ${orders.length} orders...\n`)
    
    let foundSerumIssues = false
    
    orders.forEach((order) => {
      const serumItems = order.items.filter(item => 
        (item.productName.toLowerCase().includes('serum') || 
         item.productName.toLowerCase().includes('sens')) &&
        !item.size
      )
      
      if (serumItems.length > 0) {
        foundSerumIssues = true
        console.log(`\n⚠️  Order #${order.orderNumber}`)
        console.log(`   Customer: ${order.customerName}`)
        console.log(`   Created: ${order.createdAt}`)
        console.log(`   Items missing size:`)
        serumItems.forEach((item) => {
          console.log(`     - ${item.productName} (Qty: ${item.quantity})`)
          console.log(`       Size: ${item.size || '❌ MISSING'}`)
          console.log(`       Color: ${item.color || 'N/A'}`)
        })
      }
    })
    
    if (!foundSerumIssues) {
      console.log('✅ No serum products found missing size information')
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

findSerumMissingSize()

