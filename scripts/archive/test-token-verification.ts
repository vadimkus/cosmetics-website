/**
 * Test token verification with a specific token
 */

import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testTokenVerification(testToken: string) {
  try {
    console.log('🔍 Testing token verification...\n')
    console.log(`Token to verify: ${testToken.substring(0, 20)}...`)
    console.log(`Token length: ${testToken.length} characters\n`)

    // Get all tokens
    // @ts-ignore - Prisma client type may not be updated, but model exists at runtime
    const tokens = await prisma.passwordResetToken.findMany({
      where: {
        used: false,
        expiresAt: {
          gt: new Date()
        }
      },
      include: {
        user: true
      }
    })

    console.log(`Found ${tokens.length} valid tokens\n`)

    let matchFound = false
    for (const tokenRecord of tokens) {
      console.log(`Checking token for user: ${tokenRecord.user.email}`)
      console.log(`  Token ID: ${tokenRecord.id}`)
      console.log(`  Created: ${tokenRecord.createdAt.toISOString()}`)
      console.log(`  Expires: ${tokenRecord.expiresAt.toISOString()}`)
      console.log(`  Hash preview: ${tokenRecord.token.substring(0, 30)}...`)
      
      try {
        const isValid = await bcrypt.compare(testToken, tokenRecord.token)
        console.log(`  Comparison result: ${isValid ? '✅ MATCH!' : '❌ No match'}`)
        
        if (isValid) {
          matchFound = true
          console.log(`\n✅ TOKEN VERIFIED!`)
          console.log(`   User: ${tokenRecord.user.email}`)
          console.log(`   Token ID: ${tokenRecord.id}`)
          break
        }
      } catch (compareError) {
        console.log(`  ❌ Comparison error:`, compareError)
      }
      console.log('')
    }

    if (!matchFound) {
      console.log('❌ No matching token found')
      console.log('\nPossible issues:')
      console.log('1. Token was already used')
      console.log('2. Token expired')
      console.log('3. Token hash mismatch (different server instance?)')
      console.log('4. Token format issue')
    }

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

const testToken = process.argv[2]
if (!testToken) {
  console.error('Usage: node scripts/test-token-verification.js <token>')
  process.exit(1)
}

testTokenVerification(testToken)

