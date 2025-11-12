const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function removeSkinDefenderSize() {
  try {
    console.log('🔍 Finding SKIN DEFENDER LIP & EYE MAKEUP REMOVER items...\n')
    
    // Find all order items for this product
    const orderItems = await prisma.orderItem.findMany({
      where: {
        productName: { contains: 'SKIN DEFENDER LIP & EYE MAKEUP REMOVER', mode: 'insensitive' }
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
    
    // Remove size (set to null)
    for (const item of orderItems) {
      await prisma.orderItem.update({
        where: { id: item.id },
        data: { size: null }
      })
      console.log(`✅ Updated Order #${item.order.orderNumber}: ${item.productName} -> size removed`)
    }
    
    console.log(`\n✅ Removed size from ${orderItems.length} order item(s)`)
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

removeSkinDefenderSize()

