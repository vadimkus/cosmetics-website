import 'dotenv/config'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

async function addRussianColumns() {
  const adminEmail = process.argv[2] || process.env.ADMIN_EMAIL

  if (!adminEmail) {
    console.error('❌ Admin email required')
    console.error('   Usage: npx tsx scripts/add-russian-columns-via-api.ts <admin-email>')
    console.error('   Or set ADMIN_EMAIL in .env.local')
    console.error('')
    console.error('   Example: npx tsx scripts/add-russian-columns-via-api.ts admin@genosys.ae')
    process.exit(1)
  }

  try {
    console.log('🚀 Adding Russian columns via API...')
    console.log(`📧 Using admin email: ${adminEmail}\n`)

    const response = await fetch(`${BASE_URL}/api/admin/add-russian-blog-fields`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Email': adminEmail,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      if (response.status === 401) {
        console.error('❌ Unauthorized - Admin authentication failed')
        console.error('   Please make sure:')
        console.error('   1. The email is correct')
        console.error('   2. The user exists in the database')
        console.error('   3. The user has isAdmin = true')
        console.error('')
        console.error('   You can also log in via /admin and call the API from there')
      } else {
        console.error(`❌ Error: ${data.error || 'Unknown error'}`)
        if (data.details) {
          console.error(`   Details: ${data.details}`)
        }
      }
      process.exit(1)
    }

    console.log('✅', data.message)
    if (data.columnsAdded) {
      console.log('📋 Columns added:', data.columnsAdded.join(', '))
    }
    console.log('')
    console.log('🎉 Russian columns added successfully!')
    console.log('')
    console.log('📝 Next step: Run the translation update script:')
    console.log('   npx tsx scripts/update-russian-translations.ts')
    
  } catch (error: any) {
    console.error('❌ Failed to add Russian columns:', error.message)
    if (error.message.includes('fetch')) {
      console.error('   Make sure your Next.js server is running on', BASE_URL)
    }
    process.exit(1)
  }
}

addRussianColumns()

