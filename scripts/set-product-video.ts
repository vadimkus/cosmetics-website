import { prisma } from '../lib/prisma'

async function setProductVideo(productIdentifier: string, videoUrl: string) {
  try {
    // Try to find product by ID first
    let product = await prisma.product.findUnique({
      where: { id: productIdentifier }
    })
    
    // If not found, try by productNumber
    if (!product) {
      product = await prisma.product.findUnique({
        where: { productNumber: productIdentifier }
      })
    }
    
    if (!product) {
      console.error(`❌ Product not found: ${productIdentifier}`)
      console.log('💡 Tip: Try using the product ID or productNumber')
      process.exit(1)
    }
    
    const updatedProduct = await prisma.product.update({
      where: { id: product.id },
      data: { videoUrl }
    })
    
    console.log(`✅ Product video URL set:`)
    console.log(`   ID: ${updatedProduct.id}`)
    console.log(`   Product Number: ${updatedProduct.productNumber || 'N/A'}`)
    console.log(`   Name: ${updatedProduct.name}`)
    console.log(`   Video URL: ${updatedProduct.videoUrl}`)
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Usage: npx tsx scripts/set-product-video.ts <productNumber> <videoUrl>
const productId = process.argv[2]
const videoUrl = process.argv[3]

if (!productId || !videoUrl) {
  console.log('Usage: npx tsx scripts/set-product-video.ts <productNumber> <videoUrl>')
  console.log('Example: npx tsx scripts/set-product-video.ts 27 /videos/barrier.mp4')
  process.exit(1)
}

setProductVideo(productId, videoUrl)
