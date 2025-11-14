const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function updateSkinDefenderSize() {
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
    
    // Update to 200ml
    for (const item of orderItems) {
      await prisma.orderItem.update({
        where: { id: item.id },
        data: { size: '200ml' }
      })
      console.log(`✅ Updated Order #${item.order.orderNumber}: ${item.productName} -> 200ml`)
    }
    
    console.log(`\n✅ Updated ${orderItems.length} order item(s) to size: 200ml`)
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateSkinDefenderSize()

