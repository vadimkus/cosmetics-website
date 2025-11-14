const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function addRemainingVariants() {
  try {
    // Find remaining items without variants
    const orderItems = await prisma.orderItem.findMany({
      where: {
        AND: [
          { color: null },
          { size: null }
        ]
      }
    })
    
    console.log(`📦 Found ${orderItems.length} items still without variants\n`)
    
    for (const item of orderItems) {
      const productName = item.productName.toUpperCase()
      let updateData = {}
      
      if (productName.includes('SKIN DEFENDER') || productName.includes('MAKEUP REMOVER')) {
        updateData.size = '200ml'
      } else if (productName.includes('TEST')) {
        updateData.size = '50g' // Default for test products
      }
      
      if (Object.keys(updateData).length > 0) {
        await prisma.orderItem.update({
          where: { id: item.id },
          data: updateData
        })
        console.log(`✅ Updated: ${item.productName} -> ${updateData.size || updateData.color}`)
      } else {
        console.log(`⚠️  Skipped: ${item.productName} (no variant pattern matched)`)
      }
    }
    
    console.log('\n✅ Done!')
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

addRemainingVariants()

