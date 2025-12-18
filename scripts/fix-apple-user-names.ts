/**
 * Fix Apple Sign-In user names that are set to obfuscated email prefixes
 * 
 * When Apple doesn't provide a name (after first consent), the system
 * uses the email prefix as the name. For private relay emails, this
 * results in names like "mbwmkxgpgt" which are not user-friendly.
 * 
 * This script updates such users to have "Apple User" as their name
 * so they can then edit it to their real name in the profile page.
 */

import { prisma } from '../lib/database'

const POSTGRES_URL = process.env.POSTGRES_URL || process.env.PRISMA_DATABASE_URL

if (!POSTGRES_URL) {
  console.error('❌ Error: POSTGRES_URL or PRISMA_DATABASE_URL not set')
  process.exit(1)
}

async function fixAppleUserNames() {
  console.log('🔍 Finding Apple Sign-In users with obfuscated names...\n')

  try {
    // Find users with appleSub (Apple Sign-In) and private relay emails
    const appleUsers = await prisma.user.findMany({
      where: {
        AND: [
          { appleSub: { not: null } },
          { email: { contains: '@privaterelay.appleid.com' } },
          {
            OR: [
              // Name is the email prefix (obfuscated)
              { name: { contains: '@' } },
              // Name looks like random characters (length < 15, no spaces)
              {
                AND: [
                  { name: { not: { contains: ' ' } } },
                  // This is a heuristic - names without spaces and < 15 chars
                  // might be obfuscated email prefixes
                ]
              }
            ]
          }
        ]
      },
      select: {
        id: true,
        email: true,
        name: true,
        appleSub: true,
        createdAt: true,
      }
    })

    console.log(`Found ${appleUsers.length} Apple Sign-In user(s) with potentially obfuscated names:\n`)

    if (appleUsers.length === 0) {
      console.log('✅ No users need updating!')
      return
    }

    for (const user of appleUsers) {
      const emailPrefix = user.email.split('@')[0]
      const shouldUpdate = 
        user.name === emailPrefix || // Name is exactly the email prefix
        (user.name.length < 15 && !user.name.includes(' ')) // Short name without space

      if (shouldUpdate) {
        console.log(`📝 User: ${user.email}`)
        console.log(`   Current name: "${user.name}"`)
        console.log(`   Created: ${user.createdAt.toISOString()}`)
        
        // Update to "Apple User"
        await prisma.user.update({
          where: { id: user.id },
          data: { name: 'Apple User' }
        })
        
        console.log(`   ✅ Updated to: "Apple User"\n`)
      } else {
        console.log(`⏭️  Skipping ${user.email} (name: "${user.name}" looks valid)\n`)
      }
    }

    console.log('\n🎉 All Apple Sign-In users updated!')
    console.log('\nℹ️  Users can now edit their name to their real name in the profile page.')

  } catch (error) {
    console.error('❌ Error updating users:', error)
    throw error
  }
}

// Run the function
fixAppleUserNames()
  .then(() => {
    console.log('\n✅ Script completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error)
    process.exit(1)
  })
