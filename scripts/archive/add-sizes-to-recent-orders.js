require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Import the default size function
function getDefaultSizeForProduct(productName) {
  const name = productName.toUpperCase()
  
  // Serums - typically 30ml
  if (name.includes('SERUM')) {
    if (name.includes('ALL FOR SENSITIVE')) return '30ml'
    if (name.includes('MOISTURE REPLENISHING HYALURON')) return '30ml'
    if (name.includes('MULTI FUNCTIONAL ANTI-WRINKLE')) return '30ml'
    if (name.includes('PROBLEM CONTROL')) return '30ml'
    if (name.includes('EYECELL EYE CONTOUR')) return '10ml'
    return '30ml' // Default for serums
  }
  
  // Creams - typically 50g (homecare) or 250g (professional)
  if (name.includes('CREAM')) {
    if (name.includes('MOISTURE REPLENISHING HYALURON')) return '50g'
    if (name.includes('MULTI FUNCTIONAL ANTI-WRINKLE')) return '50g'
    if (name.includes('EGF REPAIR OXYMASK')) return '50g'
    if (name.includes('SKIN BARRIER PROTECTING')) return '100g'
    if (name.includes('EYECELL EYE CONTOUR')) return '20g'
    return '50g' // Default for creams
  }
  
  // Mists/Toners
  if (name.includes('MIST') || name.includes('TONER')) {
    if (name.includes('MICROBIOME ENERGY INFUSING')) return '80ml'
    if (name.includes('SNOW BOOSTER')) return '200ml'
    if (name.includes('INTENSIVE PROBLEM CONTROL')) return '200ml'
    return '200ml' // Default for mists/toners
  }
  
  // Cleansers
  if (name.includes('CLEANSER')) {
    if (name.includes('SNOW O₂') || name.includes('SNOW O2')) return '180ml'
    return '180ml' // Default for cleansers
  }
  
  // Masks
  if (name.includes('MASK')) {
    if (name.includes('SOOTHING BOMB SEA ALGAE')) return '23g'
    if (name.includes('PEPTIDE GEL')) return '38g'
    if (name.includes('COLLAGEN')) return '25g'
    return '25g' // Default for masks
  }
  
  // Eye products
  if (name.includes('EYE')) {
    if (name.includes('SERUM')) return '10ml'
    if (name.includes('CREAM')) return '20g'
    if (name.includes('PATCH')) return '101g'
  }
  
  // No default size found
  return undefined
}

async function addSizesToRecentOrders() {
  try {
    console.log('🔍 Finding recent orders without sizes...\n')
    
    // Get the 2 most recent orders
    const recentOrders = await prisma.order.findMany({
      include: {
        items: true
      },
      orderBy: { createdAt: 'desc' },
      take: 2
    })
    
    if (recentOrders.length === 0) {
      console.log('❌ No orders found')
      return
    }
    
    let totalUpdated = 0
    
    for (const order of recentOrders) {
      console.log(`\n📦 Processing Order #${order.orderNumber}`)
      console.log(`   Customer: ${order.customerName}`)
      
      const itemsWithoutSize = order.items.filter(item => !item.size || item.size.trim() === '')
      
      if (itemsWithoutSize.length === 0) {
        console.log(`   ✅ All items already have sizes`)
        continue
      }
      
      console.log(`   Found ${itemsWithoutSize.length} items without size\n`)
      
      for (const item of itemsWithoutSize) {
        const defaultSize = getDefaultSizeForProduct(item.productName)
        
        if (defaultSize) {
          console.log(`   ${item.productName}`)
          console.log(`      Current: ${item.size || 'MISSING'}`)
          console.log(`      Setting: ${defaultSize}`)
          
          await prisma.orderItem.update({
            where: { id: item.id },
            data: { size: defaultSize }
          })
          
          console.log(`      ✅ Updated`)
          totalUpdated++
        } else {
          console.log(`   ${item.productName}`)
          console.log(`      ⚠️  No default size found`)
        }
      }
    }
    
    console.log(`\n✅ Update complete! Updated ${totalUpdated} items.`)
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

addSizesToRecentOrders()

