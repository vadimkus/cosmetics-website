/**
 * Diagnostic script to check password reset tokens
 * Run with: node scripts/check-password-reset-tokens.js <email>
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkPasswordResetTokens(email?: string) {
  try {
    console.log('🔍 Checking password reset tokens...\n')

    // Check if table exists by trying to query it
    try {
      const allTokens = await prisma.passwordResetToken.findMany({
        include: {
          user: true
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 10
      })

      console.log(`✅ Found ${allTokens.length} tokens in database\n`)

      if (allTokens.length > 0) {
        console.log('📋 Recent tokens:')
        allTokens.forEach((token, index) => {
          console.log(`\n${index + 1}. Token ID: ${token.id}`)
          console.log(`   User: ${token.user.email}`)
          console.log(`   Created: ${token.createdAt.toISOString()}`)
          console.log(`   Expires: ${token.expiresAt.toISOString()}`)
          console.log(`   Used: ${token.used}`)
          console.log(`   Expired: ${token.expiresAt < new Date()}`)
          console.log(`   Token hash (first 20 chars): ${token.token.substring(0, 20)}...`)
        })
      }

      // If email provided, check tokens for that user
      if (email) {
        console.log(`\n🔍 Checking tokens for user: ${email}`)
        const user = await prisma.user.findUnique({
          where: { email },
          include: {
            passwordResetTokens: true
          }
        })

        if (user) {
          console.log(`✅ User found: ${user.email}`)
          console.log(`   Total tokens: ${user.passwordResetTokens.length}`)
          
          const validTokens = user.passwordResetTokens.filter(
            t => !t.used && t.expiresAt > new Date()
          )
          console.log(`   Valid tokens: ${validTokens.length}`)
          
          if (validTokens.length > 0) {
            console.log('\n📋 Valid tokens for this user:')
            validTokens.forEach((token, index) => {
              console.log(`\n${index + 1}. Token ID: ${token.id}`)
              console.log(`   Created: ${token.createdAt.toISOString()}`)
              console.log(`   Expires: ${token.expiresAt.toISOString()}`)
              console.log(`   Token hash (first 20 chars): ${token.token.substring(0, 20)}...`)
            })
          }
        } else {
          console.log(`❌ User not found: ${email}`)
        }
      }
    } catch (error) {
      console.error('❌ Error querying password reset tokens:', error)
      if (error instanceof Error) {
        console.error('Error message:', error.message)
        console.error('Error stack:', error.stack)
      }
    }

  } catch (error) {
    console.error('❌ Fatal error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Get email from command line arguments
const email = process.argv[2]
checkPasswordResetTokens(email)

