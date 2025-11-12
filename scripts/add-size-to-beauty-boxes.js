const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function addSizeToBeautyBoxes() {
  try {
    console.log('🚀 Adding size "1 kit" to all Beauty Box products...')
    
    // Find all products in Beauty Boxes category
    const beautyBoxes = await prisma.product.findMany({
      where: {
        category: 'Beauty Boxes'
      }
    })
    
    console.log(`📦 Found ${beautyBoxes.length} beauty box products`)
    
    if (beautyBoxes.length === 0) {
      console.log('⚠️  No beauty box products found')
      return
    }
    
    // Update each beauty box with size "1 kit"
    for (const beautyBox of beautyBoxes) {
      await prisma.product.update({
        where: { id: beautyBox.id },
        data: { size: '1 kit' }
      })
      console.log(`✅ Updated: ${beautyBox.name} - Size: 1 kit`)
    }
    
    console.log('\n🎉 All beauty box products updated successfully!')
    console.log(`\n📊 Summary:`)
    console.log(`   Total beauty boxes updated: ${beautyBoxes.length}`)
    console.log(`   Size added: "1 kit"`)
    
  } catch (error) {
    console.error('❌ Error updating beauty boxes:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

addSizeToBeautyBoxes()
  .then(() => {
    console.log('\n✅ Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error)
    process.exit(1)
  })

