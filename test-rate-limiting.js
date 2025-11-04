const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testRateLimiting() {
  try {
    console.log('🔍 Testing rate limiting...')
    
    const identifier = 'test-ip-test-ua'
    
    // Clean up old entries
    await prisma.rateLimit.deleteMany({
      where: {
        resetTime: {
          lt: new Date()
        }
      }
    })
    
    console.log('✅ Cleaned up old entries')
    
    // Test rate limit creation
    const rateLimitEntry = await prisma.rateLimit.upsert({
      where: { identifier },
      update: {
        count: {
          increment: 1
        },
        resetTime: new Date(Date.now() + 15 * 60 * 1000)
      },
      create: {
        identifier,
        count: 1,
        resetTime: new Date(Date.now() + 15 * 60 * 1000)
      }
    })
    
    console.log('✅ Rate limit entry created:', rateLimitEntry.count)
    
    // Test increment
    const updatedEntry = await prisma.rateLimit.update({
      where: { identifier },
      data: {
        count: {
          increment: 1
        }
      }
    })
    
    console.log('✅ Rate limit incremented:', updatedEntry.count)
    
    // Test limit check
    const isOverLimit = updatedEntry.count > 3
    console.log('✅ Over limit check:', isOverLimit)
    
  } catch (error) {
    console.error('❌ Rate limiting test failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testRateLimiting()


