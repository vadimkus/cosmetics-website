#!/usr/bin/env node

/**
 * Test user registration validation with proper CSRF handling
 */

const baseUrl = process.env.TEST_URL || 'http://localhost:3000'

async function getCsrfToken() {
  try {
    const response = await fetch(`${baseUrl}/api/csrf-token`)
    const data = await response.json()
    const cookies = response.headers.get('set-cookie') || ''
    return { token: data.token, cookie: cookies }
  } catch (error) {
    console.error('Failed to get CSRF token:', error.message)
    return null
  }
}

async function testRegistration() {
  console.log('🧪 Testing User Registration Validation\n')
  console.log('='.repeat(60))
  
  // Get CSRF token first
  const csrfData = await getCsrfToken()
  if (!csrfData) {
    console.log('❌ Cannot proceed without CSRF token')
    return
  }
  
  console.log(`✅ CSRF Token obtained\n`)
  
  // Test 1: Normal registration (should work)
  console.log('Test 1: Normal Registration')
  try {
    const timestamp = Date.now()
    const testEmail = `test${timestamp}@example.com`
    
    const response = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfData.token,
        'Cookie': csrfData.cookie,
      },
      body: JSON.stringify({
        name: 'Test User',
        email: testEmail,
        password: 'password123',
        phone: '1234567890',
        csrfToken: csrfData.token,
      }),
    })
    
    const data = await response.json()
    if (response.ok && data.success) {
      console.log(`   ✅ Registration successful for ${testEmail}\n`)
    } else {
      console.log(`   ❌ Failed: ${data.error}\n`)
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}\n`)
  }
  
  // Test 2: Name too long
  console.log('Test 2: Name Length Validation (>100 chars)')
  try {
    const longName = 'A'.repeat(101)
    const timestamp = Date.now()
    
    const response = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfData.token,
        'Cookie': csrfData.cookie,
      },
      body: JSON.stringify({
        name: longName,
        email: `test${timestamp}@example.com`,
        password: 'password123',
        csrfToken: csrfData.token,
      }),
    })
    
    const data = await response.json()
    const isValidated = !response.ok && (data.error?.includes('100') || data.error?.includes('Name'))
    
    if (isValidated) {
      console.log(`   ✅ Validation working: ${data.error}\n`)
    } else {
      console.log(`   ❌ Expected validation error, got status ${response.status}\n`)
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}\n`)
  }
  
  // Test 3: Email too long
  console.log('Test 3: Email Length Validation (>255 chars)')
  try {
    const longEmail = 'a'.repeat(250) + '@example.com' // 250 + 11 = 261 chars
    
    const response = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfData.token,
        'Cookie': csrfData.cookie,
      },
      body: JSON.stringify({
        name: 'Test User',
        email: longEmail,
        password: 'password123',
        csrfToken: csrfData.token,
      }),
    })
    
    const data = await response.json()
    const isValidated = !response.ok && (data.error?.includes('255') || data.error?.includes('Email'))
    
    if (isValidated) {
      console.log(`   ✅ Validation working: ${data.error}\n`)
    } else {
      console.log(`   ❌ Expected validation error, got status ${response.status}\n`)
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}\n`)
  }
  
  // Test 4: Phone too long
  console.log('Test 4: Phone Length Validation (>20 chars)')
  try {
    const longPhone = '1'.repeat(21)
    const timestamp = Date.now()
    
    const response = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfData.token,
        'Cookie': csrfData.cookie,
      },
      body: JSON.stringify({
        name: 'Test User',
        email: `test${timestamp}@example.com`,
        password: 'password123',
        phone: longPhone,
        csrfToken: csrfData.token,
      }),
    })
    
    const data = await response.json()
    const isValidated = !response.ok && (data.error?.includes('20') || data.error?.includes('Phone'))
    
    if (isValidated) {
      console.log(`   ✅ Validation working: ${data.error}\n`)
    } else {
      console.log(`   ❌ Expected validation error, got status ${response.status}\n`)
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}\n`)
  }
  
  // Test 5: Missing required fields
  console.log('Test 5: Missing Required Fields')
  try {
    const response = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfData.token,
        'Cookie': csrfData.cookie,
      },
      body: JSON.stringify({
        name: 'Test User',
        // Missing email and password
        csrfToken: csrfData.token,
      }),
    })
    
    const data = await response.json()
    const isValidated = !response.ok && data.error?.includes('required')
    
    if (isValidated) {
      console.log(`   ✅ Validation working: ${data.error}\n`)
    } else {
      console.log(`   ❌ Expected validation error, got status ${response.status}\n`)
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}\n`)
  }
  
  console.log('='.repeat(60))
  console.log('✅ Registration validation tests completed!')
}

testRegistration().catch(console.error)

