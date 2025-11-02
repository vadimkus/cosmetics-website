#!/usr/bin/env node

/**
 * Test User Registration
 * Tests the new user creation functionality
 */

const baseUrl = process.env.TEST_URL || 'http://localhost:3000'

// Simple cookie store for Node.js fetch
const cookies = new Map()

async function getCsrfToken() {
  try {
    const response = await fetch(`${baseUrl}/api/csrf-token`, {
      credentials: 'include',
      headers: {
        'Cookie': Array.from(cookies.entries()).map(([name, value]) => `${name}=${value}`).join('; ')
      }
    })
    
    // Extract cookies from response
    const setCookie = response.headers.get('set-cookie')
    if (setCookie) {
      const tokenMatch = setCookie.match(/csrf-token=([^;]+)/)
      if (tokenMatch && tokenMatch[1]) {
        cookies.set('csrf-token', tokenMatch[1])
      }
    }
    
    const data = await response.json()
    const token = data.token || cookies.get('csrf-token')
    return token
  } catch (error) {
    console.error('Failed to get CSRF token:', error.message)
    return null
  }
}

async function testRegistration(name, email, password, phone) {
  const csrfToken = await getCsrfToken()
  if (!csrfToken) {
    console.error('❌ Failed to get CSRF token')
    return false
  }

  try {
    const startTime = Date.now()
    const response = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
        'Cookie': Array.from(cookies.entries()).map(([name, value]) => `${name}=${value}`).join('; ')
      },
      credentials: 'include',
      body: JSON.stringify({
        name,
        email,
        password,
        phone,
        csrfToken
      })
    })

    const data = await response.json()
    const elapsed = Date.now() - startTime

    if (response.ok) {
      console.log(`✅ Registration successful!`)
      console.log(`   User ID: ${data.user.id}`)
      console.log(`   Name: ${data.user.name}`)
      console.log(`   Email: ${data.user.email}`)
      console.log(`   Time: ${elapsed}ms`)
      return true
    } else {
      console.log(`❌ Registration failed: ${data.error}`)
      console.log(`   Status: ${response.status}`)
      console.log(`   Time: ${elapsed}ms`)
      return false
    }
  } catch (error) {
    console.error(`❌ Registration error: ${error.message}`)
    return false
  }
}

async function runTests() {
  console.log('\n🧪 Testing User Registration\n')
  console.log('='.repeat(60))

  // Test 1: Valid registration
  console.log('\n📝 Test 1: Valid new user registration')
  const testEmail = `test-${Date.now()}@example.com`
  const success = await testRegistration(
    'Test User',
    testEmail,
    'testpassword123',
    '+971 50 123 4567'
  )

  if (!success) {
    console.log('\n⚠️  Valid registration failed!')
    return
  }

  // Test 2: Duplicate email
  console.log('\n📝 Test 2: Duplicate email (should fail)')
  await testRegistration(
    'Another User',
    testEmail, // Same email as Test 1
    'password123',
    '+971 50 999 9999'
  )

  // Test 3: Weak password
  console.log('\n📝 Test 3: Weak password (should fail)')
  await testRegistration(
    'Test User 2',
    `test2-${Date.now()}@example.com`,
    '12345', // Too short
    '+971 50 111 1111'
  )

  // Test 4: Missing required fields
  console.log('\n📝 Test 4: Missing required fields (should fail)')
  const csrfToken = await getCsrfToken()
  try {
    const response = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
        'Cookie': Array.from(cookies.entries()).map(([name, value]) => `${name}=${value}`).join('; ')
      },
      credentials: 'include',
      body: JSON.stringify({
        name: 'Test User',
        // Missing email and password
        csrfToken
      })
    })
    const data = await response.json()
    if (!response.ok) {
      console.log(`✅ Correctly rejected: ${data.error}`)
    } else {
      console.log(`❌ Should have rejected missing fields`)
    }
  } catch (error) {
    console.error(`❌ Error: ${error.message}`)
  }

  // Test 5: Long name (should be validated)
  console.log('\n📝 Test 5: Name length validation')
  await testRegistration(
    'A'.repeat(200), // Very long name
    `test3-${Date.now()}@example.com`,
    'password123',
    '+971 50 222 2222'
  )

  console.log('\n' + '='.repeat(60))
  console.log('\n✅ Registration testing completed!\n')
}

runTests().catch(error => {
  console.error('\n❌ Fatal error:', error.message)
  process.exit(1)
})
