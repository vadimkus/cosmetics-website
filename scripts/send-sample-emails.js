require('dotenv').config({ path: '.env.local' })
const http = require('http')

const targetEmail = 'f.this.that@gmail.com'
const baseUrl = 'http://localhost:3000'

// Function to make POST request
function makeRequest(path, data) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data)
    
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
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

async function sendSampleEmails() {
  try {
    console.log('📧 Sending COD template email to', targetEmail + '...')
    
    const codResult = await makeRequest('/api/send-sample-cod', {
      email: targetEmail
    })
    
    if (codResult.status === 200 && codResult.data.success) {
      console.log('✅ COD email sent successfully!')
      console.log('✅ Message:', codResult.data.message)
      console.log('✅ Message ID:', codResult.data.messageId)
    } else {
      console.error('❌ Failed to send COD email:', codResult.data)
      throw new Error('COD email failed')
    }

    await new Promise(resolve => setTimeout(resolve, 1000))

    console.log('📧 Sending SUP template email to', targetEmail + '...')
    
    const supResult = await makeRequest('/api/send-sample-support-link', {
      email: targetEmail
    })
    
    if (supResult.status === 200 && supResult.data.success) {
      console.log('✅ SUP email sent successfully!')
      console.log('✅ Message:', supResult.data.message)
      console.log('✅ Message ID:', supResult.data.messageId)
    } else {
      console.error('❌ Failed to send SUP email:', supResult.data)
      throw new Error('SUP email failed')
    }

    console.log('\n✅ Both sample emails sent successfully to:', targetEmail)
  } catch (error) {
    console.error('❌ Error sending emails:', error.message)
    console.log('\n💡 Make sure the development server is running on port 3000')
    console.log('   Run: npm run dev')
    process.exit(1)
  }
}

sendSampleEmails()
