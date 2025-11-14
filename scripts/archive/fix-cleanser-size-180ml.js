require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function fixCleanserSize() {
  try {
    // Based on the check script, this order number is SUP2510224799
    const orderNumber = 'SUP2510224799'
    console.log(`🔍 Finding order #${orderNumber}...\n`)
    
    // Find order by orderNumber
    const order = await prisma.order.findUnique({
      where: {
        orderNumber: orderNumber
      },
      include: {
        items: true
      }
    })
    
    if (!order) {
      console.log('❌ Order not found')
      return
    }
    
    console.log(`✅ Found order #${order.orderNumber}`)
    console.log(`   Customer: ${order.customerName}\n`)
    
    // Find cleanser items
    const cleanserItems = order.items.filter(item => 
      item.productName.toLowerCase().includes('cleanser')
    )
    
    if (cleanserItems.length === 0) {
      console.log('⚠️  No cleanser products found in this order')
      return
    }
    
    console.log(`📦 Found ${cleanserItems.length} cleanser item(s):\n`)
    
    for (const item of cleanserItems) {
      console.log(`   Product: ${item.productName}`)
      console.log(`   Current Size: ${item.size || 'NOT SET'}`)
      console.log(`   Item ID: ${item.id}`)
      
      if (item.size === '200ml') {
        console.log(`   ⚠️  Size is 200ml, updating to 180ml...`)
        
        await prisma.orderItem.update({
          where: { id: item.id },
          data: { size: '180ml' }
        })
        
        console.log(`   ✅ Updated to 180ml\n`)
      } else if (item.size === '180ml') {
        console.log(`   ✅ Already 180ml, no change needed\n`)
      } else {
        console.log(`   ⚠️  Current size is "${item.size}", updating to 180ml...`)
        
        await prisma.orderItem.update({
          where: { id: item.id },
          data: { size: '180ml' }
        })
        
        console.log(`   ✅ Updated to 180ml\n`)
      }
    }
    
    // Verify the update
    const updatedOrder = await prisma.order.findUnique({
      where: { id: order.id },
      include: { items: true }
    })
    
    console.log(`\n🔍 Verification:`)
    updatedOrder?.items.forEach(item => {
      if (item.productName.toLowerCase().includes('cleanser')) {
        console.log(`   ${item.productName}: ${item.size || 'NOT SET'}`)
      }
    })
    
    console.log(`\n✅ Update complete!`)
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

fixCleanserSize()

