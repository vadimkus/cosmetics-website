/**
 * Test script for mobile API localization
 * Tests EN, RU, and AR locales
 */

const API_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://genosys.ae'
const API_KEY = process.env.MOBILE_APP_KEY || 'genosys-mobile-2024-secure-key'

async function testLocalization() {
  console.log('🧪 Testing Mobile API Localization\n')
  console.log(`API URL: ${API_URL}`)
  console.log(`Using API Key: ${API_KEY.substring(0, 20)}...\n`)

  const locales = ['en', 'ru', 'ar']
  const testProductId = '1' // Microneedle Roller

  for (const locale of locales) {
    console.log(`\n📱 Testing locale: ${locale.toUpperCase()}`)
    console.log('─'.repeat(50))

    try {
      const response = await fetch(`${API_URL}/api/mobile/products/${testProductId}`, {
        headers: {
          'x-api-key': API_KEY,
          'x-locale': locale
        }
      })

      if (!response.ok) {
        console.error(`❌ Request failed with status: ${response.status}`)
        const error = await response.text()
        console.error(`Error: ${error}`)
        continue
      }

      const data = await response.json()

      if (!data.success) {
        console.error(`❌ API returned error: ${data.error}`)
        continue
      }

      const product = data.product

      console.log(`✅ Product fetched successfully`)
      console.log(`   ID: ${product.id}`)
      console.log(`   Name (canonical): ${product.name}`)
      console.log(`   Localized Name: ${product.localizedName || 'N/A'}`)
      console.log(`   Description (first 100 chars):`)
      console.log(`     ${(product.localizedDescription || product.description || '').substring(0, 100)}...`)
      
      // Verify localization worked
      if (locale === 'ru' && product.localizedName && product.localizedName !== product.name) {
        console.log(`   ✅ Russian localization working!`)
      } else if (locale === 'ar' && product.localizedName && product.localizedName !== product.name) {
        console.log(`   ✅ Arabic localization working!`)
      } else if (locale === 'en') {
        console.log(`   ✅ English (default) working!`)
      } else {
        console.log(`   ⚠️  Localization may not be working (using fallback)`)
      }

    } catch (error) {
      console.error(`❌ Test failed for ${locale}:`, error)
    }
  }

  console.log('\n' + '='.repeat(50))
  console.log('🎉 Localization test completed!')
}

// Run the test
testLocalization().catch(console.error)



