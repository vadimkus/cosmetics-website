/**
 * Migration script: Migrate existing User.address data to Address table
 * 
 * This script:
 * 1. Finds all users with addresses in the User.address field
 * 2. Parses legacy GENOSYS_ADDR_V1 format or plain strings
 * 3. Creates Address records for each user
 * 4. Sets the first address as default
 * 
 * Usage: npx tsx scripts/migrate-user-addresses-to-table.ts
 */

import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

// Get database connection - use direct URL for migrations (not Accelerate)
const connectionString = 
  process.env.POSTGRES_URL || 
  process.env.DATABASE_URL ||
  (process.env.PRISMA_DATABASE_URL?.startsWith('prisma+postgres://') 
    ? null 
    : process.env.PRISMA_DATABASE_URL)

if (!connectionString) {
  console.error('❌ POSTGRES_URL or DATABASE_URL environment variable is required')
  console.error('   Note: Use direct postgres:// URL, not prisma+postgres:// (Accelerate)')
  process.exit(1)
}

// Always use direct connection for migrations (not Accelerate)
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)

const prisma = new PrismaClient({
  adapter,
  log: ['error', 'warn'],
})

// Helper to parse legacy address format
function parseLegacyAddress(addressString: string | null): {
  type: string
  label?: string
  name: string
  phone: string
  addressLine1: string
  addressLine2?: string
  city: string
  emirate: string
  country: string
} | null {
  if (!addressString) return null
  
  const V1_PREFIX = 'GENOSYS_ADDR_V1:'
  if (addressString.startsWith(V1_PREFIX)) {
    try {
      const jsonPart = addressString.slice(V1_PREFIX.length)
      const obj = JSON.parse(jsonPart)
      return {
        type: obj.type || 'home',
        label: obj.label,
        name: obj.name || '',
        phone: obj.phone || '',
        addressLine1: obj.address || '',
        addressLine2: obj.addressLine2,
        city: obj.city || '',
        emirate: obj.emirate || '',
        country: obj.country || 'United Arab Emirates'
      }
    } catch (error) {
      console.warn('Failed to parse GENOSYS_ADDR_V1 format:', error)
      return null
    }
  }
  
  // Plain string - return as addressLine1
  return {
    type: 'home',
    name: '',
    phone: '',
    addressLine1: addressString,
    city: '',
    emirate: '',
    country: 'United Arab Emirates'
  }
}

async function migrateAddresses() {
  console.log('🔄 Starting address migration...\n')

  try {
    // Find all users with addresses
    const usersWithAddresses = await prisma.user.findMany({
      where: {
        address: {
          not: null
        }
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        address: true
      }
    })

    console.log(`📋 Found ${usersWithAddresses.length} users with addresses\n`)

    let migratedCount = 0
    let skippedCount = 0
    let errorCount = 0

    for (const user of usersWithAddresses) {
      try {
        // Check if user already has addresses in Address table
        const existingAddresses = await prisma.address.findMany({
          where: { userId: user.id }
        })

        if (existingAddresses.length > 0) {
          console.log(`⏭️  Skipping ${user.email} - already has ${existingAddresses.length} address(es)`)
          skippedCount++
          continue
        }

        // Parse legacy address
        const parsedAddress = parseLegacyAddress(user.address)

        if (!parsedAddress) {
          console.warn(`⚠️  Could not parse address for ${user.email}`)
          errorCount++
          continue
        }

        // Fill in missing fields from user data
        const addressData = {
          userId: user.id,
          type: parsedAddress.type,
          label: parsedAddress.label || 'Primary Address',
          name: parsedAddress.name || user.name || '',
          phone: parsedAddress.phone || user.phone || '',
          addressLine1: parsedAddress.addressLine1,
          addressLine2: parsedAddress.addressLine2,
          city: parsedAddress.city,
          emirate: parsedAddress.emirate,
          country: parsedAddress.country,
          isDefault: true // First migrated address is default
        }

        // Validate required fields
        if (!addressData.addressLine1 || !addressData.name || !addressData.city || !addressData.emirate) {
          console.warn(`⚠️  Missing required fields for ${user.email}`)
          errorCount++
          continue
        }

        // Create address
        await prisma.address.create({
          data: addressData
        })

        console.log(`✅ Migrated address for ${user.email}`)
        migratedCount++

      } catch (error) {
        console.error(`❌ Error migrating address for ${user.email}:`, error)
        errorCount++
      }
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📊 Migration Summary:')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`✅ Migrated: ${migratedCount}`)
    console.log(`⏭️  Skipped: ${skippedCount}`)
    console.log(`❌ Errors: ${errorCount}`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Run migration
migrateAddresses()
  .then(() => {
    console.log('✅ Migration completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  })

