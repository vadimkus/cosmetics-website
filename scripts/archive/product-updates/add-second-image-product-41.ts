import { prisma } from '../lib/prisma'

async function main() {
  // Product 41: SKIN CARING BLEMISH BALM CUSHION [SPF 50+ PA++++]
  // Add full_C.jpg image to existing images
  
  const productId = '41'
  const newImage = '/images/Second/full_C.jpg'
  
  // Find product by ID
  const product = await prisma.product.findUnique({
    where: { id: productId }
  })
  
  if (!product) {
    console.error(`❌ Product with ID ${productId} not found`)
    process.exit(1)
  }
  
  console.log(`Found product: ${product.name}`)
  console.log(`Current main image: ${product.image}`)
  console.log(`Current images: ${product.images}`)
  
  // Parse existing images and add new one
  let existingImages: string[] = []
  if (product.images) {
    try {
      existingImages = JSON.parse(product.images)
    } catch {
      existingImages = [product.image]
    }
  } else {
    existingImages = [product.image]
  }
  
  // Check if image already exists
  if (existingImages.includes(newImage)) {
    console.log(`\n⚠️ Image ${newImage} already exists in product images`)
    return
  }
  
  // Add new image after the main image (position 1)
  existingImages.splice(1, 0, newImage)
  
  const imagesJson = JSON.stringify(existingImages)
  
  console.log(`\nUpdating product ${productId} with images: ${imagesJson}`)
  
  const result = await prisma.product.update({
    where: { id: productId },
    data: {
      images: imagesJson
    }
  })
  
  console.log(`\n✅ Updated product: ${result.name}`)
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
