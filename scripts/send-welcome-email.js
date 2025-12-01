require('dotenv').config({ path: '.env.local' })
require('dotenv').config({ path: '.env' })

const http = require('http')

const targetEmail = process.argv[2] || 'f.this.that@gmail.com'
const userName = process.argv[3] || 'John Doe'
const password = process.argv[4] || 'TempPassword123!'
const baseUrl = 'http://localhost:3000'

// Function to make POST request
function makeRequest(path, data, headers = {}) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data)
    
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        ...headers
      }
    }

    const req = http.request(options, (res) => {
      let body = ''
      res.on('data', (chunk) => {
        body += chunk
      })
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body)
          resolve({ status: res.statusCode, data: parsed })
        } catch (e) {
          resolve({ status: res.statusCode, data: body })
        }
      })
    })

    req.on('error', (error) => {
      reject(error)
    })

    req.write(postData)
    req.end()
  })
}

async function sendWelcomeEmail() {
  try {
    console.log('📧 Sending welcome email to', targetEmail + '...')
    console.log(`👤 Name: ${userName}`)
    console.log(`🔑 Password: ${password}`)
    console.log('')
    
    // Try to use the test-email API endpoint
    // Note: This requires admin auth, so we'll need to handle that
    // For now, let's try direct import approach using a workaround
    
    // Use eval to dynamically import (not ideal but works for scripts)
    const emailModule = await Function('return import("../lib/email.ts")')()
    const { sendWelcomeEmail } = emailModule
    
    const result = await sendWelcomeEmail(userName, targetEmail, password)
    
    if (result.success) {
      console.log('✅ Welcome email sent successfully!')
      console.log(`📬 Message ID: ${result.messageId}`)
    } else {
      console.error('❌ Failed to send welcome email:', result.error)
      process.exit(1)
    }
  } catch (error) {
    console.error('❌ Error:', error.message)
    if (error.stack) {
      console.error(error.stack)
    }
    console.log('\n💡 Trying alternative method...')
    
    // Alternative: Use API if server is running
    try {
      const apiResult = await makeRequest('/api/test-email', {
        type: 'welcome',
        testEmail: targetEmail,
        userName: userName,
        password: password
      })
      
      if (apiResult.status === 200 && apiResult.data.success) {
        console.log('✅ Welcome email sent via API!')
        console.log(`📬 Message ID: ${apiResult.data.messageId}`)
      } else {
        console.error('❌ API Error:', apiResult.data)
        throw new Error('API method failed')
      }
    } catch (apiError) {
      console.error('❌ Both methods failed. Make sure:')
      console.error('   1. Development server is running: npm run dev')
      console.error('   2. You are logged in as admin')
      console.error('   3. Email configuration is set up correctly')
      process.exit(1)
    }
  }
}

sendWelcomeEmail()
