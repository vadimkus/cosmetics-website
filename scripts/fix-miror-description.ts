import { prisma } from '../lib/prisma'

async function fixMirorDescription() {
  try {
    const product = await prisma.product.findUnique({
      where: { id: 'cmhf1a6p400000xfa0iu3bw42' } // Holiday Kit
    })
    
    if (!product) {
      console.error('Product not found')
      process.exit(1)
    }
    
    // Fix the MIROR description - remove duplicate "GENOSYS MIROR" from the description
    const updatedDescription = product.description.replace(
      '4. GENOSYS MIROR\nGENOSYS MIROR is a high-quality mirror designed for your daily skincare routine.',
      '4. GENOSYS MIROR\nA high-quality mirror designed for your daily skincare routine.'
    )
    
    const updatedProduct = await prisma.product.update({
      where: { id: product.id },
      data: { description: updatedDescription }
    })
    
    console.log('✅ Fixed MIROR description')
    console.log('\nUpdated description section:')
    const mirorSection = updatedDescription.split('4. GENOSYS MIROR')[1]?.split('\n\n')[0] || ''
    console.log('4. GENOSYS MIROR' + mirorSection)
    
    return updatedProduct
  } catch (error) {
    console.error('❌ Error:', error)
    throw error
  }
}

fixMirorDescription()
  .then(() => {
    console.log('Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Error:', error)
    process.exit(1)
  })

