const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function updateBeautyBoxNames() {
  try {
    console.log('🚀 Updating beauty box names to uppercase...')
    
    const beautyBoxes = [
      { productNumber: '55', newName: 'PROBLEM SKIN CARE BEAUTY BOX' },
      { productNumber: '56', newName: 'SKIN BRIGHTENING BEAUTY BOX' },
      { productNumber: '57', newName: 'CHARMING LOOK BEAUTY BOX' },
      { productNumber: '58', newName: 'ANTI-AGING BEAUTY BOX' },
    ]
    
    for (const box of beautyBoxes) {
      const product = await prisma.product.findFirst({
        where: {
          productNumber: box.productNumber
        }
      })
      
      if (!product) {
        console.error(`❌ Product ${box.productNumber} not found!`)
        continue
      }
      
      console.log(`📦 Updating product ${box.productNumber}:`)
      console.log(`   Old name: ${product.name}`)
      console.log(`   New name: ${box.newName}`)
      
      await prisma.product.update({
        where: { id: product.id },
        data: {
          name: box.newName
        }
      })
      
      console.log(`   ✅ Updated successfully!`)
    }
    
    console.log('\n🎉 All beauty box names updated!')
    
  } catch (error) {
    console.error('❌ Error updating products:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

updateBeautyBoxNames()
  .then(() => {
    console.log('🎉 Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Failed:', error)
    process.exit(1)
  })

