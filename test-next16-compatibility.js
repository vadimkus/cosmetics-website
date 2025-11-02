#!/usr/bin/env node

/**
 * Next.js 16 Compatibility Test Suite
 * Tests critical functionality after upgrade to Next.js 16.0.1
 */

const baseUrl = process.env.TEST_URL || 'http://localhost:3000'

const tests = {
  passed: 0,
  failed: 0,
  warnings: 0,
  results: []
}

function log(message, type = 'info') {
  const colors = {
    info: '\x1b[36m',    // Cyan
    success: '\x1b[32m', // Green
    error: '\x1b[31m',  // Red
    warning: '\x1b[33m', // Yellow
    reset: '\x1b[0m'
  }
  console.log(`${colors[type]}${message}${colors.reset}`)
}

function recordResult(testName, passed, message = '', isWarning = false) {
  if (passed) {
    tests.passed++
    tests.results.push({ test: testName, status: 'PASS', message })
  } else if (isWarning) {
    tests.warnings++
    tests.results.push({ test: testName, status: 'WARN', message })
  } else {
    tests.failed++
    tests.results.push({ test: testName, status: 'FAIL', message })
  }
}

async function testEndpoint(name, url, expectedStatus = 200, validateFn = null) {
  try {
    const response = await fetch(url)
    const status = response.status
    const passed = status === expectedStatus
    
    if (validateFn) {
      const data = await response.json().catch(() => null)
      const validated = await validateFn(data, response)
      recordResult(name, passed && validated, `Status: ${status}${validated ? '' : ' (validation failed)'}`)
    } else {
      recordResult(name, passed, `Status: ${status}`)
    }
    
    return { success: passed, status }
  } catch (error) {
    recordResult(name, false, `Error: ${error.message}`)
    return { success: false, error: error.message }
  }
}

async function runTests() {
  log('\n🧪 Next.js 16 Compatibility Test Suite\n', 'info')
  log('='.repeat(60), 'info')
  
  // Test 1: Static Pages
  log('\n📄 Testing Static Pages...', 'info')
  await testEndpoint('Homepage', `${baseUrl}/`)
  await testEndpoint('Products Page', `${baseUrl}/products`)
  await testEndpoint('Cart Page', `${baseUrl}/cart`)
  await testEndpoint('Login Page', `${baseUrl}/login`)
  await testEndpoint('Profile Page', `${baseUrl}/profile`)
  await testEndpoint('Checkout Page', `${baseUrl}/checkout`)
  await testEndpoint('Training Page', `${baseUrl}/training`)
  await testEndpoint('About Page', `${baseUrl}/about`)
  await testEndpoint('Contact Page', `${baseUrl}/contact`)
  
  // Test 2: API Routes - Health & Core
  log('\n🔌 Testing API Routes...', 'info')
  await testEndpoint('Health Check', `${baseUrl}/api/health`, 200, async (data) => {
    return data && data.status === 'healthy' && data.database === 'connected'
  })
  
  await testEndpoint('Products API', `${baseUrl}/api/products`, 200, async (data) => {
    return Array.isArray(data) && data.length > 0
  })
  
  await testEndpoint('CSRF Token', `${baseUrl}/api/csrf-token`, 200, async (data) => {
    return data && typeof data.token === 'string'
  })
  
  // Test 3: Dynamic Routes
  log('\n🔀 Testing Dynamic Routes...', 'info')
  // Get first product ID from products API
  try {
    const productsRes = await fetch(`${baseUrl}/api/products`)
    const products = await productsRes.json()
    if (products && products.length > 0) {
      const firstProduct = products[0]
      await testEndpoint('Product Detail Page', `${baseUrl}/products/${firstProduct.id}`)
      await testEndpoint('Product API', `${baseUrl}/api/products/${firstProduct.id}`, 200, async (data) => {
        return data && data.id === firstProduct.id
      })
    } else {
      recordResult('Product Detail Page', false, 'No products found to test')
    }
  } catch (error) {
    recordResult('Product Detail Page', false, `Error: ${error.message}`)
  }
  
  // Test 4: Image Loading
  log('\n🖼️  Testing Image Configuration...', 'info')
  try {
    const homepage = await fetch(`${baseUrl}/`)
    const html = await homepage.text()
    
    // Check for image errors in HTML
    const hasImageErrors = html.includes('next-image-unconfigured-localpatterns')
    const hasLogo = html.includes('/Logo/') || html.includes('Logo')
    
    recordResult('Image Configuration', !hasImageErrors, hasImageErrors ? 'Image errors detected' : 'No image errors')
    recordResult('Logo Loading', hasLogo, hasLogo ? 'Logo found in page' : 'Logo not found')
  } catch (error) {
    recordResult('Image Configuration', false, `Error: ${error.message}`)
  }
  
  // Test 5: Authentication Routes
  log('\n🔐 Testing Authentication...', 'info')
  // Test POST to admin-verify (should return 400 for missing email - correct validation)
  try {
    const authResponse = await fetch(`${baseUrl}/api/auth/admin-verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    })
    const status = authResponse.status
    const passed = status === 400 || status === 401 // 400 for missing email, 401 for invalid admin
    recordResult('Admin Auth Validation', passed, `Status: ${status} (proper validation)`)
  } catch (error) {
    recordResult('Admin Auth Validation', false, `Error: ${error.message}`)
  }
  
  // Test 6: Error Handling
  log('\n⚠️  Testing Error Handling...', 'info')
  await testEndpoint('404 Page', `${baseUrl}/non-existent-page-12345`, 404)
  
  // Test 7: Metadata & SEO
  log('\n📊 Testing Metadata & SEO...', 'info')
  try {
    const homepage = await fetch(`${baseUrl}/`)
    const html = await homepage.text()
    
    const hasTitle = html.includes('<title>') || html.includes('GENOSYS')
    const hasMetaDescription = html.includes('meta') && html.includes('description')
    const hasCanonical = html.includes('canonical') || html.includes('genosys.ae')
    
    recordResult('Page Metadata', hasTitle && hasMetaDescription, 
      `Title: ${hasTitle}, Description: ${hasMetaDescription}`)
    recordResult('SEO Canonical', hasCanonical, hasCanonical ? 'Canonical URL present' : 'Canonical URL missing')
  } catch (error) {
    recordResult('Page Metadata', false, `Error: ${error.message}`)
  }
  
  // Test 8: Middleware (Redirects)
  log('\n🔄 Testing Middleware Redirects...', 'info')
  try {
    const redirectResponse = await fetch(`${baseUrl}/about-genosys-middle-east`, { redirect: 'manual' })
    const redirected = redirectResponse.status === 307 || redirectResponse.status === 308
    recordResult('Middleware Redirects', redirected, `Status: ${redirectResponse.status}`)
  } catch (error) {
    recordResult('Middleware Redirects', false, `Error: ${error.message}`)
  }
  
  // Summary
  log('\n' + '='.repeat(60), 'info')
  log('\n📊 Test Results Summary\n', 'info')
  
  tests.results.forEach(result => {
    const symbol = result.status === 'PASS' ? '✅' : result.status === 'WARN' ? '⚠️ ' : '❌'
    const color = result.status === 'PASS' ? 'success' : result.status === 'WARN' ? 'warning' : 'error'
    log(`${symbol} ${result.test}: ${result.message}`, color)
  })
  
  log('\n' + '='.repeat(60), 'info')
  log(`\nTotal Tests: ${tests.passed + tests.failed + tests.warnings}`, 'info')
  log(`✅ Passed: ${tests.passed}`, 'success')
  log(`⚠️  Warnings: ${tests.warnings}`, 'warning')
  log(`❌ Failed: ${tests.failed}`, tests.failed > 0 ? 'error' : 'success')
  
  const successRate = ((tests.passed / (tests.passed + tests.failed)) * 100).toFixed(1)
  log(`\nSuccess Rate: ${successRate}%`, tests.failed === 0 ? 'success' : 'info')
  
  if (tests.failed === 0) {
    log('\n🎉 All critical tests passed! Next.js 16 upgrade is successful.', 'success')
  } else {
    log('\n⚠️  Some tests failed. Please review the results above.', 'warning')
  }
  
  log('\n', 'info')
  
  process.exit(tests.failed > 0 ? 1 : 0)
}

// Run tests
runTests().catch(error => {
  log(`\n❌ Fatal error running tests: ${error.message}`, 'error')
  console.error(error)
  process.exit(1)
})

