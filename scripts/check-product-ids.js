const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function checkProductIds() {
  try {
    // Get product with BLEMISH BALM CUSHION
    const cushion = await prisma.product.findFirst({
      where: {
        name: { contains: 'BLEMISH BALM CUSHION', mode: 'insensitive' }
      },
      select: {
        id: true,
        productNumber: true,
        name: true
      }
    })
    
    console.log('Cushion product:', cushion)
    
    // Get all unique product IDs from order items
    const orderItems = await prisma.orderItem.findMany({
      select: {
        productId: true,
        productName: true
      },
      distinct: ['productId']
    })
    
    console.log(`\n📦 Unique products in orders: ${orderItems.length}\n`)
    orderItems.forEach(item => {
      console.log(`  Product ID: ${item.productId}`)
      console.log(`  Product Name: ${item.productName}`)
      console.log('')
    })
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkProductIds()

