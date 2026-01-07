require('dotenv').config({ path: '.env.local' })

const { PrismaClient } = require('@prisma/client')

const databaseUrl = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL

if (!databaseUrl) {
  console.error('❌ DATABASE_URL or PRISMA_DATABASE_URL environment variable is required.')
  process.exit(1)
}

// Check if using Prisma Accelerate
const isAccelerate = databaseUrl.startsWith('prisma+')

let prisma
if (isAccelerate) {
  prisma = new PrismaClient({
    accelerateUrl: databaseUrl
  })
} else {
  prisma = new PrismaClient()
}

async function main() {
  // Product 33: EyeCell EYE PEPTIDE GEL PATCH
  // Add second image: /images/Second/Patches_2.jpg
  
  const productId = '33'
  const mainImage = '/images/Patch.jpg'
  const secondImage = '/images/Second/Patches_2.jpg'
  
  // Create JSON array of images
  const imagesJson = JSON.stringify([mainImage, secondImage])
  
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
