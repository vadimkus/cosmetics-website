/**
 * Verify contactEmail column in database
 * 
 * This script checks if the contactEmail field was successfully added
 * to the users table for Apple Private Relay users.
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function verifyContactEmailColumn() {
  try {
    console.log('🔍 Verifying contactEmail column in users table...\n')

    // Try to query users with contactEmail field
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        contactEmail: true,
        name: true,
      },
      take: 5,
    })

    console.log('✅ SUCCESS: contactEmail column exists and is accessible!\n')
    console.log(`Found ${users.length} users in database\n`)

    // Check for Apple Private Relay users
    const applePrivateRelayUsers = users.filter(u => 
      u.email.includes('@privaterelay.appleid.com')
    )

    if (applePrivateRelayUsers.length > 0) {
      console.log(`📧 Apple Private Relay users found: ${applePrivateRelayUsers.length}`)
      applePrivateRelayUsers.forEach(user => {
        console.log(`   - ${user.name} (${user.email})`)
        console.log(`     Contact Email: ${user.contactEmail || 'Not set'}`)
      })
    } else {
      console.log('📧 No Apple Private Relay users found yet')
    }

    console.log('\n✅ Database schema is ready for Contact Email feature!')
    console.log('   Users can now add their real email address in profile settings.')

  } catch (error: any) {
    console.error('❌ ERROR: Failed to verify contactEmail column')
    console.error(error.message)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

verifyContactEmailColumn()


