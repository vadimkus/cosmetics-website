require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function fixSoothingBombMask() {
  try {
    // Find all SOOTHING BOMB SEA ALGAE MASK items with wrong size
    const items = await prisma.orderItem.findMany({
      where: {
        productName: {
          contains: 'SOOTHING BOMB SEA ALGAE MASK',
          mode: 'insensitive'
        },
        size: {
          not: '23g'
        }
      },
      include: {
        order: {
          select: {
            orderNumber: true,
            customerName: true
          }
        }
      }
    })
    
    console.log(`🔍 Found ${items.length} SOOTHING BOMB SEA ALGAE MASK items with incorrect size\n`)
    
    if (items.length === 0) {
      console.log('✅ No items found that need updating')
      return
    }
    
    for (const item of items) {
      console.log(`Order #${item.order.orderNumber} - ${item.order.customerName}`)
      console.log(`   Current Size: ${item.size || 'NOT SET'}`)
      console.log(`   Updating to: 23g`)
      
      await prisma.orderItem.update({
        where: { id: item.id },
        data: { size: '23g' }
      })
      
      console.log(`   ✅ Updated\n`)
    }
    
    console.log(`✅ Update complete! Updated ${items.length} items.`)
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

fixSoothingBombMask()

