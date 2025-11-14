const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function fixSkinBarrierCreamSize() {
  try {
    console.log('🔍 Finding SKIN BARRIER PROTECTING CREAM items...\n')
    
    // Find all order items for this product
    const orderItems = await prisma.orderItem.findMany({
      where: {
        productName: { contains: 'SKIN BARRIER PROTECTING CREAM', mode: 'insensitive' }
      },
      include: {
        order: {
          select: {
            orderNumber: true
          }
        }
      }
    })
    
    console.log(`📦 Found ${orderItems.length} order items\n`)
    
    if (orderItems.length === 0) {
      console.log('No items found')
      return
    }
    
    // Update to correct size: 100g
    for (const item of orderItems) {
      await prisma.orderItem.update({
        where: { id: item.id },
        data: { size: '100g' }
      })
      console.log(`✅ Updated Order #${item.order.orderNumber}: ${item.productName} -> 100g`)
    }
    
    console.log(`\n✅ Updated ${orderItems.length} order item(s) to size: 100g`)
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

fixSkinBarrierCreamSize()

