import { prisma } from '../lib/prisma'

async function main() {
  // Product 33: EyeCell EYE PEPTIDE GEL PATCH
  // Add multiple images
  
  const productId = '33'
  const mainImage = '/images/Patch.jpg'
  const secondImage = '/images/Second/Patches_2.jpg'
  const thirdImage = '/images/Second/Patches_3.jpg'
  
  // Create JSON array of images
  const imagesJson = JSON.stringify([mainImage, secondImage, thirdImage])
  
  console.log(`Updating product ${productId} with images: ${imagesJson}`)
  
  const result = await prisma.product.update({
    where: { id: productId },
    data: {
      images: imagesJson
    }
  })
  
  console.log(`✅ Updated product: ${result.name}`)
  console.log(`   Images: ${result.images}`)
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

