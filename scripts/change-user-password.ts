/**
 * Change user password
 * Updates password for f.this.that@gmail.com
 */

import { prisma } from '../lib/database'
import bcrypt from 'bcryptjs'

const POSTGRES_URL = process.env.POSTGRES_URL || process.env.PRISMA_DATABASE_URL

if (!POSTGRES_URL) {
  console.error('❌ Error: POSTGRES_URL or PRISMA_DATABASE_URL not set')
  process.exit(1)
}

async function changePassword() {
  const email = 'f.this.that@gmail.com'
  const newPassword = 'HappyDay99'

  console.log(`🔐 Changing password for user: ${email}\n`)

  try {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
      }
    })

    if (!user) {
      console.error(`❌ User not found: ${email}`)
      process.exit(1)
    }

    console.log(`✓ Found user:`)
    console.log(`  ID: ${user.id}`)
    console.log(`  Name: ${user.name}`)
    console.log(`  Email: ${user.email}\n`)

    // Hash new password
    console.log(`🔒 Hashing new password...`)
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    console.log(`✓ Password hashed\n`)

    // Update password
    console.log(`💾 Updating password in database...`)
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    })

    console.log(`✅ Password updated successfully!\n`)
    console.log(`User can now log in with:`)
    console.log(`  Email: ${email}`)
    console.log(`  Password: ${newPassword}`)

  } catch {
    console.error('❌ Error changing password:', error)
    throw error
  }
}

// Run the function
changePassword()
  .then(() => {
    console.log('\n✅ Script completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error)
    process.exit(1)
  })


