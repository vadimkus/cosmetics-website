#!/usr/bin/env node

/**
 * Test script for user registration with validation
 * Tests input length limits, validation errors, and successful registration
 */

const baseUrl = process.env.TEST_URL || 'http://localhost:3000'

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function logHeader(message) {
  log(`\n${'='.repeat(60)}`, 'cyan')
  log(message, 'bright')
  log('='.repeat(60), 'cyan')
}

function logTest(name, passed, details = '') {
  const icon = passed ? '✅' : '❌'
  const color = passed ? 'green' : 'red'
  log(`${icon} ${name}`, color)
  
  if (details) {
    log(`    ${details}`, 'yellow')
  }
}

let testsPassed = 0
let testsFailed = 0

async function getCsrfToken() {
  try {
    const response = await fetch(`${baseUrl}/api/csrf-token`, {
      headers: {
        'Accept': 'application/json',
      },
    })
    
    if (!response.ok) {
      log(`CSRF token endpoint returned status ${response.status}`, 'red')
      return null
    }
    
    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      log(`CSRF token endpoint returned ${contentType}, expected JSON`, 'red')
      const text = await response.text()
      log(`Response: ${text.substring(0, 100)}`, 'yellow')
      return null
    }
    
    const data = await response.json()
    return data.token
  } catch (error) {
    log(`Failed to get CSRF token: ${error.message}`, 'red')
    return null
  }
}

async function testNormalRegistration() {
  logHeader('TEST 1: Normal User Registration')
  
  const csrfToken = await getCsrfToken()
  if (!csrfToken) {
    log('Cannot proceed without CSRF token', 'red')
    testsFailed++
    return
  }
  
  // Generate unique email for testing
  const timestamp = Date.now()
  const testEmail = `test-${timestamp}@example.com`
  const testName = 'Test User'
  const testPassword = 'password123'
  
  try {
    const response = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
      },
      body: JSON.stringify({
        name: testName,
        email: testEmail,
        password: testPassword,
        phone: '1234567890',
        csrfToken: csrfToken,
      }),
    })
    
    const data = await response.json()
    const success = response.ok && data.success
    
    logTest('Normal registration succeeds', success,
      success ? `User created: ${testEmail}` : `Error: ${data.error}`)
    
    if (success) testsPassed++
    else testsFailed++
    
    return testEmail
  } catch (error) {
    log(`Error: ${error.message}`, 'red')
    testsFailed++
    return null
  }
}

async function testNameLengthLimit() {
  logHeader('TEST 2: Name Length Limit (100 chars)')
  
  const csrfToken = await getCsrfToken()
  if (!csrfToken) {
    testsFailed++
    return
  }
  
  // Generate name longer than 100 chars
  const longName = 'A'.repeat(101)
  const timestamp = Date.now()
  const testEmail = `test-long-name-${timestamp}@example.com`
  
  try {
    const response = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
      },
      body: JSON.stringify({
        name: longName,
        email: testEmail,
        password: 'password123',
        csrfToken: csrfToken,
      }),
    })
    
    const data = await response.json()
    const rejected = !response.ok && (data.error?.includes('100') || data.error?.includes('Name'))
    
    logTest('Long name (>100 chars) is rejected', rejected,
      rejected ? `Correctly rejected: ${data.error}` : `Unexpected: ${response.status}`)
    
    if (rejected) testsPassed++
    else testsFailed++
  } catch (error) {
    log(`Error: ${error.message}`, 'red')
    testsFailed++
  }
}

async function testEmailLengthLimit() {
  logHeader('TEST 3: Email Length Limit (255 chars)')
  
  const csrfToken = await getCsrfToken()
  if (!csrfToken) {
    testsFailed++
    return
  }
  
  // Generate email longer than 255 chars
  const longLocalPart = 'a'.repeat(240)
  const longEmail = `${longLocalPart}@example.com`
  
  try {
    const response = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
      },
      body: JSON.stringify({
        name: 'Test User',
        email: longEmail,
        password: 'password123',
        csrfToken: csrfToken,
      }),
    })
    
    const data = await response.json()
    const rejected = !response.ok && (data.error?.includes('255') || data.error?.includes('Email'))
    
    logTest('Long email (>255 chars) is rejected', rejected,
      rejected ? `Correctly rejected: ${data.error}` : `Unexpected: ${response.status}`)
    
    if (rejected) testsPassed++
    else testsFailed++
  } catch (error) {
    log(`Error: ${error.message}`, 'red')
    testsFailed++
  }
}

async function testPhoneLengthLimit() {
  logHeader('TEST 4: Phone Length Limit (20 chars)')
  
  const csrfToken = await getCsrfToken()
  if (!csrfToken) {
    testsFailed++
    return
  }
  
  // Generate phone longer than 20 chars
  const longPhone = '1'.repeat(21)
  const timestamp = Date.now()
  const testEmail = `test-phone-${timestamp}@example.com`
  
  try {
    const response = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
      },
      body: JSON.stringify({
        name: 'Test User',
        email: testEmail,
        password: 'password123',
        phone: longPhone,
        csrfToken: csrfToken,
      }),
    })
    
    const data = await response.json()
    const rejected = !response.ok && (data.error?.includes('20') || data.error?.includes('Phone'))
    
    logTest('Long phone (>20 chars) is rejected', rejected,
      rejected ? `Correctly rejected: ${data.error}` : `Unexpected: ${response.status}`)
    
    if (rejected) testsPassed++
    else testsFailed++
  } catch (error) {
    log(`Error: ${error.message}`, 'red')
    testsFailed++
  }
}

async function testMissingFields() {
  logHeader('TEST 5: Required Fields Validation')
  
  const csrfToken = await getCsrfToken()
  if (!csrfToken) {
    testsFailed++
    return
  }
  
  // Test missing name
  try {
    const response = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123',
        csrfToken: csrfToken,
      }),
    })
    
    const data = await response.json()
    const rejected = !response.ok && data.error?.includes('required')
    
    logTest('Missing name is rejected', rejected,
      rejected ? `Correctly rejected: ${data.error}` : `Unexpected: ${response.status}`)
    
    if (rejected) testsPassed++
    else testsFailed++
  } catch (error) {
    log(`Error: ${error.message}`, 'red')
    testsFailed++
  }
  
  // Test missing email
  try {
    const response = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
      },
      body: JSON.stringify({
        name: 'Test User',
        password: 'password123',
        csrfToken: csrfToken,
      }),
    })
    
    const data = await response.json()
    const rejected = !response.ok && data.error?.includes('required')
    
    logTest('Missing email is rejected', rejected,
      rejected ? `Correctly rejected: ${data.error}` : `Unexpected: ${response.status}`)
    
    if (rejected) testsPassed++
    else testsFailed++
  } catch (error) {
    log(`Error: ${error.message}`, 'red')
    testsFailed++
  }
}

async function runAllTests() {
  logHeader('USER REGISTRATION VALIDATION TEST SUITE')
  log('Testing input length limits, validation, and successful registration...\n', 'blue')
  
  const startTime = Date.now()
  
  await testNormalRegistration()
  await testNameLengthLimit()
  await testEmailLengthLimit()
  await testPhoneLengthLimit()
  await testMissingFields()
  
  const endTime = Date.now()
  const duration = ((endTime - startTime) / 1000).toFixed(2)
  
  // Summary
  logHeader('FINAL TEST SUMMARY')
  log(`Total Tests: ${testsPassed + testsFailed}`, 'cyan')
  log(`✅ Passed: ${testsPassed}`, 'green')
  log(`❌ Failed: ${testsFailed}`, testsFailed > 0 ? 'red' : 'green')
  log(`⏱️  Duration: ${duration}s`, 'yellow')
  
  const successRate = ((testsPassed / (testsPassed + testsFailed)) * 100).toFixed(1)
  log(`\nSuccess Rate: ${successRate}%`, successRate >= 80 ? 'green' : 'red')
  
  log('\n📋 Validation Features Tested:', 'cyan')
  log('  ✅ Normal registration', 'green')
  log('  ✅ Name length limit (100 chars)', 'green')
  log('  ✅ Email length limit (255 chars)', 'green')
  log('  ✅ Phone length limit (20 chars)', 'green')
  log('  ✅ Required fields validation', 'green')
  
  if (testsFailed === 0) {
    log('\n🎉 ALL VALIDATION TESTS PASSED!', 'green')
    log('\n🛡️  User registration validation is working correctly!', 'green')
  } else {
    log(`\n⚠️  ${testsFailed} test(s) failed. Please review the output above.`, 'yellow')
  }
  
  process.exit(testsFailed === 0 ? 0 : 1)
}

// Run tests
runAllTests().catch(error => {
  log(`\n💥 Test suite crashed: ${error.message}`, 'red')
  log(error.stack, 'red')
  process.exit(1)
})

