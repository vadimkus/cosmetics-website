const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function fixSkinBarrierSize() {
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
    
    // Check current sizes
    console.log('Current sizes:')
    orderItems.forEach(item => {
      console.log(`  Order #${item.order.orderNumber}: size = ${item.size || 'null'}`)
    })
    console.log('')
    
    // Update to correct size - need to know what the correct size is
    // Common sizes: 50g, 100g, 230g, 250g
    // Let me check what size it should be - user said it cannot be 50g
    // Most creams are 50g or 230g. Since user says not 50g, let's use 230g or check product info
    
    console.log('⚠️  Please specify the correct size for SKIN BARRIER PROTECTING CREAM')
    console.log('   Current size in orders: 50g')
    console.log('   Common options: 100g, 230g, 250g')
    console.log('')
    console.log('To update, run:')
    console.log('  node scripts/update-product-size.js "SKIN BARRIER PROTECTING CREAM" "<SIZE>"')
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

fixSkinBarrierSize()

