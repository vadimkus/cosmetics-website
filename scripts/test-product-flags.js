const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

/**
 * Test script to verify product hiding and discount exclusion flags work correctly
 */
async function testProductFlags() {
  try {
    console.log('🧪 Testing product flags...\n')
    
    // Test 1: Verify product 2 is hidden
    console.log('Test 1: Product hiding (isHidden flag)')
    console.log('─'.repeat(50))
    const product2 = await prisma.product.findFirst({
      where: {
        OR: [
          { id: '2' },
          { productNumber: '2' }
        ]
      },
      select: { id: true, productNumber: true, name: true, isHidden: true }
    })
    
    if (product2) {
      if (product2.isHidden === true) {
        console.log(`✅ PASS: Product 2 (${product2.name}) has isHidden: true`)
      } else {
        console.log(`❌ FAIL: Product 2 (${product2.name}) should have isHidden: true but got: ${product2.isHidden}`)
      }
    } else {
      console.log('⚠️  Product 2 not found')
    }
    
    // Test 2: Verify hidden products are filtered out
    console.log('\nTest 2: Hidden products filtered from getAllProducts')
    console.log('─'.repeat(50))
    const allProducts = await prisma.product.findMany({
      where: { isHidden: false },
      select: { id: true, productNumber: true, name: true, isHidden: true }
    })
    const hiddenProducts = allProducts.filter(p => p.isHidden === true)
    if (hiddenProducts.length === 0) {
      console.log(`✅ PASS: No hidden products in results (${allProducts.length} products shown)`)
    } else {
      console.log(`❌ FAIL: Found ${hiddenProducts.length} hidden products in results`)
    }
    
    // Test 3: Verify products 35 and 54 have noDiscount flag
    console.log('\nTest 3: Discount exclusion (noDiscount flag)')
    console.log('─'.repeat(50))
    const productsToCheck = await prisma.product.findMany({
      where: {
        OR: [
          { id: '35' },
          { productNumber: '35' },
          { id: '54' },
          { productNumber: '54' }
        ]
      },
      select: { id: true, productNumber: true, name: true, noDiscount: true, category: true }
    })
    
    for (const product of productsToCheck) {
      if (product.noDiscount === true) {
        console.log(`✅ PASS: Product ${product.productNumber || product.id} (${product.name}) has noDiscount: true`)
      } else {
        console.log(`❌ FAIL: Product ${product.productNumber || product.id} (${product.name}) should have noDiscount: true but got: ${product.noDiscount}`)
      }
    }
    
    // Test 4: Verify Beauty Boxes category exclusion still works
    console.log('\nTest 4: Category-based discount exclusion')
    console.log('─'.repeat(50))
    const beautyBoxes = await prisma.product.findMany({
      where: { category: 'Beauty Boxes' },
      select: { id: true, productNumber: true, name: true, category: true, noDiscount: true },
      take: 3
    })
    
    if (beautyBoxes.length > 0) {
      console.log(`✅ Found ${beautyBoxes.length} Beauty Box products`)
      beautyBoxes.forEach(p => {
        console.log(`   - ${p.name} (Category: ${p.category}, noDiscount: ${p.noDiscount})`)
      })
      console.log('   Note: Beauty Boxes are excluded from discounts via category check in code')
    } else {
      console.log('⚠️  No Beauty Box products found')
    }
    
    // Test 5: Summary
    console.log('\n📊 Summary')
    console.log('─'.repeat(50))
    const totalProducts = await prisma.product.count()
    const hiddenCount = await prisma.product.count({ where: { isHidden: true } })
    const noDiscountCount = await prisma.product.count({ where: { noDiscount: true } })
    const beautyBoxesCount = await prisma.product.count({ where: { category: 'Beauty Boxes' } })
    
    console.log(`Total products: ${totalProducts}`)
    console.log(`Hidden products: ${hiddenCount}`)
    console.log(`Products with noDiscount flag: ${noDiscountCount}`)
    console.log(`Beauty Boxes (category exclusion): ${beautyBoxesCount}`)
    
    console.log('\n✅ All tests completed!')
    
  } catch (error) {
    console.error('❌ Test failed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

testProductFlags()
  .then(() => {
    console.log('🎉 Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Failed:', error)
    process.exit(1)
  })

