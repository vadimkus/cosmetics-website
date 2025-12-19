/**
 * Check Apple Sign-In user data
 * Displays user information for mbwmkxgpgt@privaterelay.appleid.com
 */

import { prisma } from '../lib/database'

const POSTGRES_URL = process.env.POSTGRES_URL || process.env.PRISMA_DATABASE_URL

if (!POSTGRES_URL) {
  console.error('❌ Error: POSTGRES_URL or PRISMA_DATABASE_URL not set')
  process.exit(1)
}

async function checkUserData() {
  const email = 'mbwmkxgpgt@privaterelay.appleid.com'

  console.log(`🔍 Checking user data for: ${email}\n`)

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        address: true,
        birthday: true,
        appleSub: true,
        profilePicture: true,
        isAdmin: true,
        canSeePrices: true,
        discountType: true,
        discountPercentage: true,
        createdAt: true,
        lastLoginAt: true,
      }
    })

    if (!user) {
      console.error(`❌ User not found: ${email}`)
      process.exit(1)
    }

    console.log(`✅ User found:\n`)
    console.log(`ID: ${user.id}`)
    console.log(`Name: ${user.name}`)
    console.log(`Email: ${user.email}`)
    console.log(`Phone: ${user.phone || '(not set)'}`)
    console.log(`Address: ${user.address || '(not set)'}`)
    console.log(`Birthday: ${user.birthday || '(not set)'}`)
    console.log(`Apple Sub: ${user.appleSub || '(not Apple Sign-In)'}`)
    console.log(`Profile Picture: ${user.profilePicture ? 'Yes' : 'No'}`)
    console.log(`Is Admin: ${user.isAdmin ? 'Yes' : 'No'}`)
    console.log(`Can See Prices: ${user.canSeePrices ? 'Yes' : 'No'}`)
    console.log(`Discount: ${user.discountType ? `${user.discountType} ${user.discountPercentage}%` : 'None'}`)
    console.log(`Created: ${user.createdAt.toISOString()}`)
    console.log(`Last Login: ${user.lastLoginAt ? user.lastLoginAt.toISOString() : '(never)'}`)

    console.log(`\n📝 Summary:`)
    if (!user.phone && !user.address && !user.birthday) {
      console.log(`⚠️  This user has not filled in their profile yet.`)
      console.log(`   They need to click "Edit" and enter:`)
      console.log(`   - Full name (currently: "${user.name}")`)
      console.log(`   - Phone number`)
      console.log(`   - Address`)
      console.log(`   - Birthday (optional)`)
    } else {
      console.log(`✅ User profile is complete`)
    }

  } catch {
    console.error('❌ Error checking user:', error)
    throw error
  }
}

// Run the function
checkUserData()
  .then(() => {
    console.log('\n✅ Check completed')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Check failed:', error)
    process.exit(1)
  })
