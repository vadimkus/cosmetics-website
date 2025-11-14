require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function fixSoothingBombMaskSize() {
  try {
    const orderNumber = 'COD2509286361'
    console.log(`🔍 Finding order #${orderNumber}...\n`)
    
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: { items: true }
    })
    
    if (!order) {
      console.log('❌ Order not found')
      return
    }
    
    console.log(`✅ Found order #${order.orderNumber}`)
    console.log(`   Customer: ${order.customerName}\n`)
    
    // Find SOOTHING BOMB SEA ALGAE MASK
    const maskItem = order.items.find(item => 
      item.productName.includes('SOOTHING BOMB SEA ALGAE MASK')
    )
    
    if (!maskItem) {
      console.log('❌ SOOTHING BOMB SEA ALGAE MASK not found in this order')
      return
    }
    
    console.log(`📦 Found: ${maskItem.productName}`)
    console.log(`   Current Size: ${maskItem.size || 'NOT SET'}`)
    console.log(`   Should be: 23g`)
    console.log(`   Item ID: ${maskItem.id}\n`)
    
    if (maskItem.size === '23g') {
      console.log(`✅ Already 23g, no change needed`)
    } else {
      await prisma.orderItem.update({
        where: { id: maskItem.id },
        data: { size: '23g' }
      })
      console.log(`✅ Updated to 23g`)
    }
    
    // Verify
    const updatedOrder = await prisma.order.findUnique({
      where: { id: order.id },
      include: { items: true }
    })
    
    const updatedItem = updatedOrder?.items.find(item => 
      item.productName.includes('SOOTHING BOMB SEA ALGAE MASK')
    )
    
    console.log(`\n🔍 Verification:`)
    console.log(`   ${updatedItem?.productName}: ${updatedItem?.size || 'NOT SET'}`)
    console.log(`\n✅ Update complete!`)
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

fixSoothingBombMaskSize()

