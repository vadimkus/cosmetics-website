const { getAllProducts, getProductById, getProductsByCategory, searchProducts } = require('../lib/productsDb')
const { calculateDiscountedPrice } = require('../lib/discountUtils')

// Mock user with discount
const mockUser = {
  id: 'test-user',
  email: 'test@example.com',
  discountType: 'CLINIC',
  discountPercentage: 15
}

/**
 * Test the actual API functions to verify product hiding and discount exclusion
 */
async function testApiFunctions() {
  try {
    console.log('🧪 Testing API functions...\n')
    
    // Test 1: getAllProducts should not return product 2
    console.log('Test 1: getAllProducts() - Product 2 should be hidden')
    console.log('─'.repeat(50))
    const allProducts = await getAllProducts()
    const product2 = allProducts.find(p => p.id === '2' || p.productNumber === '2')
    if (!product2) {
      console.log('✅ PASS: Product 2 is not in getAllProducts results')
      console.log(`   Total products returned: ${allProducts.length}`)
    } else {
      console.log(`❌ FAIL: Product 2 (${product2.name}) is still visible`)
    }
    
    // Test 2: getProductById should return null for product 2
    console.log('\nTest 2: getProductById("2") - Should return null')
    console.log('─'.repeat(50))
    const productById = await getProductById('2')
    if (productById === null) {
      console.log('✅ PASS: getProductById("2") returns null (product is hidden)')
    } else {
      console.log(`❌ FAIL: getProductById("2") returned product: ${productById.name}`)
    }
    
    // Test 3: Discount exclusion for product 35
    console.log('\nTest 3: Discount exclusion - Product 35')
    console.log('─'.repeat(50))
    const product35 = await getProductById('35')
    if (product35) {
      const pricing = calculateDiscountedPrice(product35, mockUser)
      if (!pricing.hasDiscount) {
        console.log(`✅ PASS: Product 35 (${product35.name}) is excluded from discounts`)
        console.log(`   Original price: ${pricing.originalPrice} AED`)
        console.log(`   Discounted price: ${pricing.discountedPrice} AED (no discount applied)`)
      } else {
        console.log(`❌ FAIL: Product 35 should be excluded but discount was applied`)
        console.log(`   Discount: ${pricing.discountPercentage}%`)
      }
    } else {
      console.log('⚠️  Product 35 not found')
    }
    
    // Test 4: Discount exclusion for product 54
    console.log('\nTest 4: Discount exclusion - Product 54')
    console.log('─'.repeat(50))
    const product54 = await getProductById('54')
    if (product54) {
      const pricing = calculateDiscountedPrice(product54, mockUser)
      if (!pricing.hasDiscount) {
        console.log(`✅ PASS: Product 54 (${product54.name}) is excluded from discounts`)
        console.log(`   Original price: ${pricing.originalPrice} AED`)
        console.log(`   Discounted price: ${pricing.discountedPrice} AED (no discount applied)`)
      } else {
        console.log(`❌ FAIL: Product 54 should be excluded but discount was applied`)
        console.log(`   Discount: ${pricing.discountPercentage}%`)
      }
    } else {
      console.log('⚠️  Product 54 not found')
    }
    
    // Test 5: Beauty Boxes category exclusion
    console.log('\nTest 5: Category-based exclusion - Beauty Boxes')
    console.log('─'.repeat(50))
    const beautyBoxes = await getProductsByCategory('Beauty Boxes')
    if (beautyBoxes.length > 0) {
      const testBox = beautyBoxes[0]
      const pricing = calculateDiscountedPrice(testBox, mockUser)
      if (!pricing.hasDiscount) {
        console.log(`✅ PASS: Beauty Box (${testBox.name}) is excluded from discounts via category`)
        console.log(`   Original price: ${pricing.originalPrice} AED`)
        console.log(`   Discounted price: ${pricing.discountedPrice} AED (no discount applied)`)
      } else {
        console.log(`❌ FAIL: Beauty Box should be excluded but discount was applied`)
      }
    } else {
      console.log('⚠️  No Beauty Box products found')
    }
    
    // Test 6: Regular product should get discount
    console.log('\nTest 6: Regular product - Should get discount')
    console.log('─'.repeat(50))
    const regularProducts = allProducts.filter(p => 
      p.category !== 'Beauty Boxes' && 
      p.noDiscount !== true &&
      p.id !== '35' && 
      p.productNumber !== '35' &&
      p.id !== '54' && 
      p.productNumber !== '54'
    )
    
    if (regularProducts.length > 0) {
      const testProduct = regularProducts[0]
      const pricing = calculateDiscountedPrice(testProduct, mockUser)
      if (pricing.hasDiscount) {
        console.log(`✅ PASS: Regular product (${testProduct.name}) gets discount`)
        console.log(`   Original price: ${pricing.originalPrice} AED`)
        console.log(`   Discounted price: ${pricing.discountedPrice} AED`)
        console.log(`   Discount: ${pricing.discountPercentage}%`)
      } else {
        console.log(`❌ FAIL: Regular product should get discount but didn't`)
      }
    } else {
      console.log('⚠️  No regular products found for testing')
    }
    
    // Test 7: Search should not return hidden products
    console.log('\nTest 7: searchProducts() - Should not return hidden products')
    console.log('─'.repeat(50))
    const searchResults = await searchProducts('Needle')
    const hiddenInSearch = searchResults.find(p => p.id === '2' || p.productNumber === '2')
    if (!hiddenInSearch) {
      console.log('✅ PASS: Hidden product (Needle Pen-K) not in search results')
      console.log(`   Search results: ${searchResults.length} products`)
    } else {
      console.log(`❌ FAIL: Hidden product found in search results`)
    }
    
    console.log('\n✅ All API function tests completed!')
    
  } catch (error) {
    console.error('❌ Test failed:', error)
    throw error
  }
}

testApiFunctions()
  .then(() => {
    console.log('🎉 Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Failed:', error)
    process.exit(1)
  })

