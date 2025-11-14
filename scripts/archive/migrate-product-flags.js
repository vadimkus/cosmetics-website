const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

/**
 * Migration script to:
 * 1. Add isHidden field to products (handled by Prisma schema)
 * 2. Set isHidden: true for product 2
 * 3. Set noDiscount: true for products 35 and 54
 */
async function migrateProductFlags() {
  try {
    console.log('🚀 Starting product flags migration...')
    
    // First, push schema changes to add isHidden field
    console.log('📋 Schema changes will be applied via Prisma db push')
    console.log('   (Run: npx prisma db push)')
    
    // Find product 2 by ID or productNumber
    console.log('\n🔍 Finding product 2...')
    let product2 = await prisma.product.findFirst({
      where: {
        OR: [
          { id: '2' },
          { productNumber: '2' }
        ]
      }
    })
    
    if (product2) {
      console.log(`✅ Found product 2: ${product2.name} (ID: ${product2.id}, ProductNumber: ${product2.productNumber})`)
      await prisma.product.update({
        where: { id: product2.id },
        data: { isHidden: true }
      })
      console.log('   ✅ Set isHidden: true for product 2')
    } else {
      console.log('   ⚠️  Product 2 not found - skipping')
    }
    
    // Find products 35 and 54
    console.log('\n🔍 Finding products 35 and 54...')
    const productsToExclude = await prisma.product.findMany({
      where: {
        OR: [
          { id: '35' },
          { productNumber: '35' },
          { id: '54' },
          { productNumber: '54' }
        ]
      }
    })
    
    if (productsToExclude.length > 0) {
      for (const product of productsToExclude) {
        console.log(`✅ Found product: ${product.name} (ID: ${product.id}, ProductNumber: ${product.productNumber})`)
        await prisma.product.update({
          where: { id: product.id },
          data: { noDiscount: true }
        })
        console.log(`   ✅ Set noDiscount: true for product ${product.productNumber || product.id}`)
      }
    } else {
      console.log('   ⚠️  Products 35 and 54 not found - skipping')
    }
    
    // Verify changes
    console.log('\n🔍 Verifying changes...')
    const hiddenProducts = await prisma.product.findMany({
      where: { isHidden: true },
      select: { id: true, productNumber: true, name: true }
    })
    console.log(`   Hidden products: ${hiddenProducts.length}`)
    hiddenProducts.forEach(p => {
      console.log(`     - ${p.name} (ID: ${p.id}, ProductNumber: ${p.productNumber})`)
    })
    
    const noDiscountProducts = await prisma.product.findMany({
      where: { noDiscount: true },
      select: { id: true, productNumber: true, name: true, category: true }
    })
    console.log(`   Products excluded from discount: ${noDiscountProducts.length}`)
    noDiscountProducts.forEach(p => {
      console.log(`     - ${p.name} (ID: ${p.id}, ProductNumber: ${p.productNumber}, Category: ${p.category})`)
    })
    
    console.log('\n✅ Migration completed successfully!')
    
  } catch (error) {
    console.error('❌ Migration failed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

migrateProductFlags()
  .then(() => {
    console.log('🎉 Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Failed:', error)
    process.exit(1)
  })

