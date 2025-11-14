const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function updateProductDescription() {
  try {
    console.log('🚀 Updating product description for Charming Look Beauty Box...')
    
    // Find the product by product number
    const product = await prisma.product.findFirst({
      where: {
        productNumber: '57'
      }
    })
    
    if (!product) {
      console.error('❌ Product not found!')
      return
    }
    
    console.log(`📦 Found product: ${product.id}`)
    console.log(`   Current name: ${product.name}`)
    
    // Update the description - replace "SKIN DEFENDER LIP & EYE MAKEUP REMOVER" with title case version
    const updatedDescription = product.description.replace(
      /SKIN DEFENDER LIP & EYE MAKEUP REMOVER 200ml \(1pcs\) = 290 AED/g,
      'Skin Defender Lip & Eye Makeup Remover 200ml (1pcs) = 290 AED'
    )
    
    // Update product description
    const updatedProduct = await prisma.product.update({
      where: { id: product.id },
      data: {
        description: updatedDescription
      }
    })
    
    console.log('✅ Product description updated successfully!')
    console.log(`   Product Number: ${updatedProduct.productNumber}`)
    console.log(`   Name: ${updatedProduct.name}`)
    
  } catch (error) {
    console.error('❌ Error updating product:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

updateProductDescription()
  .then(() => {
    console.log('🎉 Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Failed:', error)
    process.exit(1)
  })
