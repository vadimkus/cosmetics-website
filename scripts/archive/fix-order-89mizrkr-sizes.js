require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function fixOrderSizes() {
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
    
    // Map of correct sizes based on product descriptions
    const correctSizes = {
      'SOOTHING BOMB SEA ALGAE MASK': '25g',
      'MICROBIOME ENERGY INFUSING MIST': '80ml',
      'MOISTURE REPLENISHING HYALURON CREAM': '50g', // Already correct
      'MULTI FUNCTIONAL ANTI-WRINKLE CREAM': '50g', // Already correct
      'MULTI FUNCTIONAL ANTI-WRINKLE SERUM': '30ml',
      'EyeCell EYE CONTOUR CREAM': '20g',
      'PEPTIDE GEL MASK': '38g'
    }
    
    console.log(`📦 Checking and updating ${order.items.length} items:\n`)
    
    let updatedCount = 0
    for (const item of order.items) {
      const correctSize = correctSizes[item.productName]
      
      if (!correctSize) {
        console.log(`⚠️  ${item.productName}: No size mapping found, skipping`)
        continue
      }
      
      console.log(`${item.productName}:`)
      console.log(`   Current: ${item.size || 'NOT SET'}`)
      console.log(`   Should be: ${correctSize}`)
      
      if (item.size === correctSize) {
        console.log(`   ✅ Already correct\n`)
      } else {
        await prisma.orderItem.update({
          where: { id: item.id },
          data: { size: correctSize }
        })
        console.log(`   ✅ Updated to ${correctSize}\n`)
        updatedCount++
      }
    }
    
    // Verify the updates
    const updatedOrder = await prisma.order.findUnique({
      where: { id: order.id },
      include: { items: true }
    })
    
    console.log(`\n🔍 Verification:\n`)
    updatedOrder?.items.forEach((item, idx) => {
      console.log(`${idx + 1}. ${item.productName}: ${item.size || 'NOT SET'}`)
    })
    
    console.log(`\n✅ Update complete! Updated ${updatedCount} items.`)
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

fixOrderSizes()

