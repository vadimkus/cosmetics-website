const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function addHolidayKit() {
  try {
    console.log('🚀 Adding Holiday Kit product...')
    
    const product = {
      name: 'Holiday Kit',
      price: 580,
      description: 'Special holiday skincare kit featuring premium GENOSYS products. Perfect gift set for the holiday season with essential skincare products for a complete routine.',
      image: '/images/Hol_kit.jpg',
      category: 'kits',
      inStock: true,
    }
    
    const newProduct = await prisma.product.create({
      data: product
    })
    
    console.log('✅ Product created successfully!')
    console.log('📦 Product details:')
    console.log(`   ID: ${newProduct.id}`)
    console.log(`   Name: ${newProduct.name}`)
    console.log(`   Price: ${newProduct.price} AED`)
    console.log(`   Category: ${newProduct.category}`)
    console.log(`   Image: ${newProduct.image}`)
    
  } catch (error) {
    console.error('❌ Error creating product:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

addHolidayKit()
  .then(() => {
    console.log('🎉 Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Failed:', error)
    process.exit(1)
  })

