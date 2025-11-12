const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

/**
 * Script to update color for a specific order item
 * Usage: node scripts/update-specific-order-color.js <orderNumber> <productName> <color>
 * Example: node scripts/update-specific-order-color.js COD2511124899 "BLEMISH BALM CUSHION" "Ivory"
 */

async function updateOrderColor() {
  const args = process.argv.slice(2)
  
  if (args.length < 3) {
    console.log('Usage: node scripts/update-specific-order-color.js <orderNumber> <productName> <color>')
    console.log('Example: node scripts/update-specific-order-color.js COD2511124899 "BLEMISH BALM CUSHION" "Ivory"')
    console.log('\nAvailable colors: Beige, Ivory, Camel')
    process.exit(1)
  }
  
  const [orderNumber, productName, color] = args
  
  if (!['Beige', 'Ivory', 'Camel'].includes(color)) {
    console.error('❌ Invalid color. Available colors: Beige, Ivory, Camel')
    process.exit(1)
  }
  
  try {
    // Find the order
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: { items: true }
    })
    
    if (!order) {
      console.error(`❌ Order #${orderNumber} not found`)
      process.exit(1)
    }
    
    // Find the item
    const item = order.items.find(item => 
      item.productName.toLowerCase().includes(productName.toLowerCase())
    )
    
    if (!item) {
      console.error(`❌ Product "${productName}" not found in order #${orderNumber}`)
      console.log('Available products in this order:')
      order.items.forEach(i => console.log(`  - ${i.productName}`))
      process.exit(1)
    }
    
    // Update the color
    await prisma.orderItem.update({
      where: { id: item.id },
      data: { color }
    })
    
    console.log(`✅ Updated order #${orderNumber}`)
    console.log(`   Product: ${item.productName}`)
    console.log(`   Color: ${color}`)
    
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

updateOrderColor()

