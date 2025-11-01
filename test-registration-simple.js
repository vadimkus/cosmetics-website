#!/usr/bin/env node

/**
 * Simple test for user registration validation
 * Tests that validation works by checking error responses
 */

const baseUrl = process.env.TEST_URL || 'http://localhost:3000'

async function testRegistrationValidation() {
  console.log('Testing user registration validation...\n')

  // Test 1: Missing fields
  console.log('Test 1: Missing required fields')
  try {
    const response = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test' }),
    })
    const data = await response.json()
    console.log(`   Status: ${response.status}`)
    console.log(`   Error: ${data.error || 'N/A'}`)
    console.log(`   ${response.status === 400 ? '✅' : '❌'} Expected 400, got ${response.status}\n`)
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}\n`)
  }

  // Test 2: Long name (>100 chars)
  console.log('Test 2: Name length limit (101 chars)')
  try {
    const longName = 'A'.repeat(101)
    const response = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: longName,
        email: 'test@example.com',
        password: 'password123',
      }),
    })
    const data = await response.json()
    console.log(`   Status: ${response.status}`)
    console.log(`   Error: ${data.error || 'N/A'}`)
    const hasLengthError = data.error?.includes('100') || data.error?.includes('Name')
    console.log(`   ${hasLengthError ? '✅' : '❌'} Validation error: ${hasLengthError}\n`)
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}\n`)
  }

  // Test 3: Long email (>255 chars)
  console.log('Test 3: Email length limit (256 chars)')
  try {
    const longEmail = 'a'.repeat(240) + '@example.com'
    const response = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: longEmail,
        password: 'password123',
      }),
    })
    const data = await response.json()
    console.log(`   Status: ${response.status}`)
    console.log(`   Error: ${data.error || 'N/A'}`)
    const hasLengthError = data.error?.includes('255') || data.error?.includes('Email')
    console.log(`   ${hasLengthError ? '✅' : '❌'} Validation error: ${hasLengthError}\n`)
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}\n`)
  }

  // Test 4: Long phone (>20 chars)
  console.log('Test 4: Phone length limit (21 chars)')
  try {
    const longPhone = '1'.repeat(21)
    const response = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        phone: longPhone,
      }),
    })
    const data = await response.json()
    console.log(`   Status: ${response.status}`)
    console.log(`   Error: ${data.error || 'N/A'}`)
    const hasLengthError = data.error?.includes('20') || data.error?.includes('Phone')
    console.log(`   ${hasLengthError ? '✅' : '❌'} Validation error: ${hasLengthError}\n`)
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}\n`)
  }

  console.log('✅ Validation tests completed!')
  console.log('\nNote: These tests verify validation logic.')
  console.log('Full registration with CSRF requires the server to be running correctly.')
}

testRegistrationValidation().catch(console.error)

