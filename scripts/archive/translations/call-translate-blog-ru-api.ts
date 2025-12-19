/**
 * Script to call the translate-blog-posts-ru API endpoint
 * Usage: npx tsx scripts/call-translate-blog-ru-api.ts [admin-email] [--slug=slug] [--force]
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
const ENDPOINT = '/api/admin/translate-blog-posts-ru'

interface ScriptOptions {
  adminEmail: string
  slug?: string
  force: boolean
}

function parseArgs(): ScriptOptions {
  const args = process.argv.slice(2)
  
  let adminEmail = ''
  let slug: string | undefined
  let force = false

  for (const arg of args) {
    if (arg.startsWith('--slug=')) {
      slug = arg.split('=')[1]
    } else if (arg === '--force' || arg === '-f') {
      force = true
    } else if (!arg.startsWith('--')) {
      // First non-flag argument is the admin email
      if (!adminEmail) {
        adminEmail = arg
      }
    }
  }

  // Check environment variable if not provided as argument
  if (!adminEmail) {
    adminEmail = process.env.ADMIN_EMAIL || ''
  }

  if (!adminEmail) {
    console.error('❌ Admin email is required')
    console.log('\nUsage:')
    console.log('  npx tsx scripts/call-translate-blog-ru-api.ts <admin-email> [--slug=slug] [--force]')
    console.log('\nOr set ADMIN_EMAIL environment variable:')
    console.log('  ADMIN_EMAIL=admin@example.com npx tsx scripts/call-translate-blog-ru-api.ts --slug=bio-ferment-age-defying-powder-mask-launch --force')
    process.exit(1)
  }

  return { adminEmail, slug, force }
}

async function callTranslateAPI(options: ScriptOptions) {
  try {
    const { adminEmail, slug, force } = options

    // Build URL with query parameters
    const url = new URL(`${API_URL}${ENDPOINT}`)
    if (force) {
      url.searchParams.set('force', 'true')
    }
    if (slug) {
      url.searchParams.set('slug', slug)
    }

    console.log(`📡 Calling API endpoint: ${url.toString()}`)
    console.log(`   Admin Email: ${adminEmail}`)
    if (slug) {
      console.log(`   Target Slug: ${slug}`)
    }
    if (force) {
      console.log(`   Force Update: ${force}`)
    }
    console.log()

    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Email': adminEmail,
      },
      body: JSON.stringify({
        force,
        slug,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error(`❌ API Error (${response.status}):`, data.error || data.message || 'Unknown error')
      if (data.details) {
        console.error('   Details:', data.details)
      }
      process.exit(1)
    }

    console.log('✅ Success!')
    console.log(`   Message: ${data.message}`)
    console.log(`   Results:`)
    console.log(`     - Translated: ${data.results.translated}`)
    console.log(`     - Skipped: ${data.results.skipped}`)
    console.log(`     - Missing: ${data.results.missing}`)
    if (data.results.errors && data.results.errors.length > 0) {
      console.log(`     - Errors: ${data.results.errors.length}`)
      data.results.errors.forEach((error: string) => {
        console.log(`       • ${error}`)
      })
    }
    console.log(`   Force Update: ${data.forceUpdate}`)
    console.log(`   Target Slug: ${data.targetSlug}`)

  } catch {
    console.error('❌ Failed to call API:', error instanceof Error ? error.message : String(error))
    process.exit(1)
  }
}

// Run the script
const options = parseArgs()
callTranslateAPI(options)
  .then(() => {
    console.log('\n🎉 Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Fatal error:', error)
    process.exit(1)
  })




































