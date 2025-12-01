/**
 * Script to call the Russian blog API endpoints
 * This uses HTTP requests to the Next.js API routes
 */

import { config } from 'dotenv'
import { resolve } from 'path'

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') })

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

async function callAPI(endpoint: string, adminEmail?: string) {
  const url = `${BASE_URL}${endpoint}`
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  
  if (adminEmail) {
    headers['X-Admin-Email'] = adminEmail
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error || `HTTP ${response.status}`)
    }

    return data
  } catch (error) {
    throw error
  }
}

async function setupRussianBlog() {
  const adminEmail = process.argv[2] || process.env.ADMIN_EMAIL

  if (!adminEmail) {
    console.error('❌ Admin email required')
    console.error('   Usage: npx tsx scripts/call-russian-blog-api.ts <admin-email>')
    console.error('   Or set ADMIN_EMAIL in .env.local')
    process.exit(1)
  }

  try {
    console.log('🚀 Starting Russian blog setup via API...\n')
    console.log(`📧 Using admin email: ${adminEmail}\n`)

    // Step 1: Add Russian fields
    console.log('📝 Step 1: Adding Russian fields to database...')
    try {
      const result1 = await callAPI('/api/admin/add-russian-blog-fields', adminEmail)
      console.log('   ✅', result1.message)
      if (result1.columnsAdded) {
        console.log('   📋 Columns:', result1.columnsAdded.join(', '))
      }
    } catch (error: any) {
      console.error('   ❌ Failed:', error.message)
      if (error.message.includes('Unauthorized')) {
        console.error('   💡 Make sure you are logged in as admin and the admin-email cookie is set')
      }
      throw error
    }

    // Step 2: Translate blog posts
    console.log('\n📝 Step 2: Translating blog posts...')
    try {
      const result2 = await callAPI('/api/admin/translate-blog-posts-ru', adminEmail)
      console.log('   ✅', result2.message)
      if (result2.results) {
        console.log(`   📊 Translated: ${result2.results.translated}`)
        console.log(`   ⏭️  Skipped: ${result2.results.skipped}`)
        console.log(`   ⚠️  Missing: ${result2.results.missing}`)
        if (result2.results.errors?.length > 0) {
          console.log(`   ❌ Errors: ${result2.results.errors.length}`)
        }
      }
    } catch (error: any) {
      console.error('   ❌ Failed:', error.message)
      throw error
    }

    console.log('\n✅ Russian blog setup completed successfully!')
  } catch (error) {
    console.error('\n💥 Fatal error:', error)
    process.exit(1)
  }
}

setupRussianBlog()

