const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function checkOrderVariants() {
  try {
    const order = await prisma.order.findUnique({
      where: { orderNumber: 'COD2511124899' },
      include: { items: true }
    })
    
    if (!order) {
      console.log('Order not found')
      return
    }
    
    console.log(`Order #${order.orderNumber} has ${order.items.length} items:\n`)
    order.items.forEach((item, idx) => {
      console.log(`${idx + 1}. ${item.productName}`)
      console.log(`   Color: ${item.color || 'null'}`)
      console.log(`   Size: ${item.size || 'null'}`)
      console.log('')
    })
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkOrderVariants()

