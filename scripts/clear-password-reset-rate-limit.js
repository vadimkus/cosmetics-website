/**
 * Script to clear rate limits for password reset
 * Usage: node scripts/clear-password-reset-rate-limit.js [identifier]
 * If no identifier provided, clears all password reset rate limits
 */

const { PrismaClient } = require('@prisma/client')
const crypto = require('crypto')

const prisma = new PrismaClient()

async function clearRateLimit(identifier) {
  try {
    // Show current rate limits first
    const allLimits = await prisma.rateLimit.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    if (allLimits.length > 0) {
      console.log('\n📋 Current rate limits:')
      allLimits.forEach((limit, index) => {
        const isExpired = limit.resetTime < new Date()
        console.log(`  ${index + 1}. ${limit.identifier}`)
        console.log(`     Count: ${limit.count}, Reset: ${limit.resetTime.toISOString()}${isExpired ? ' (EXPIRED)' : ''}`)
      })
      console.log('')
    }
    
    if (identifier) {
      // Clear specific identifier (can be IP address or full identifier)
      const result = await prisma.rateLimit.deleteMany({
        where: {
          identifier: {
            contains: identifier
          }
        }
      })
      console.log(`✅ Cleared ${result.count} rate limit(s) for identifier containing: ${identifier}`)
    } else {
      // Clear all password reset related rate limits
      // Password reset rate limits typically contain IP addresses or "forgot-password" in identifier
      const result = await prisma.rateLimit.deleteMany({
        where: {
          OR: [
            {
              identifier: {
                contains: 'forgot-password'
              }
            },
            {
              identifier: {
                contains: 'password-reset'
              }
            }
          ]
        }
      })
      console.log(`✅ Cleared ${result.count} password reset rate limit(s)`)
      
      // Also show all remaining rate limits
      const remaining = await prisma.rateLimit.findMany({
        orderBy: {
          createdAt: 'desc'
        },
        take: 10
      })
      
      if (remaining.length > 0) {
        console.log('\n📋 Remaining rate limits:')
        remaining.forEach((limit, index) => {
          console.log(`  ${index + 1}. ${limit.identifier} - Count: ${limit.count}, Reset: ${limit.resetTime.toISOString()}`)
        })
      }
    }
  } catch (error) {
    console.error('❌ Error clearing rate limit:', error)
  } finally {
    await prisma.$disconnect()
  }
}

const identifier = process.argv[2]
clearRateLimit(identifier)

