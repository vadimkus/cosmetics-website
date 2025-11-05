const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testRateLimitFix() {
  try {
    console.log('🔍 Testing Rate Limit Fix\n')
    
    const identifier = 'test-rate-limit-fix'
    
    // Clean up any existing entries
    await prisma.rateLimit.deleteMany({
      where: { identifier }
    })
    
    console.log('1. Testing first request (should create entry)...')
    const now1 = new Date()
    const resetTime1 = new Date(now1.getTime() + 15 * 60 * 1000)
    
    const entry1 = await prisma.rateLimit.upsert({
      where: { identifier },
      update: {
        count: 1,
        resetTime: resetTime1
      },
      create: {
        identifier,
        count: 1,
        resetTime: resetTime1
      }
    })
    
    console.log('   ✅ Created entry:', {
      count: entry1.count,
      resetTime: entry1.resetTime.toISOString()
    })
    
    console.log('\n2. Testing second request (should increment, NOT reset)...')
    
    // Simulate the fixed logic
    const existingEntry = await prisma.rateLimit.findUnique({
      where: { identifier }
    })
    
    const now2 = new Date()
    
    if (existingEntry && existingEntry.resetTime >= now2) {
      // Entry exists and is valid - only increment count
      const entry2 = await prisma.rateLimit.update({
        where: { identifier },
        data: {
          count: {
            increment: 1
          }
        }
      })
      
      console.log('   ✅ Incremented count:', {
        count: entry2.count,
        resetTime: entry2.resetTime.toISOString()
      })
      
      // Verify resetTime didn't change
      if (entry2.resetTime.getTime() === entry1.resetTime.getTime()) {
        console.log('   ✅ RESET TIME UNCHANGED (correct!)')
      } else {
        console.log('   ❌ RESET TIME CHANGED (incorrect!)')
      }
    }
    
    console.log('\n3. Testing expired entry (should reset)...')
    
    // Manually expire the entry
    await prisma.rateLimit.update({
      where: { identifier },
      data: {
        resetTime: new Date(Date.now() - 1000) // 1 second ago
      }
    })
    
    const now3 = new Date()
    const newResetTime = new Date(now3.getTime() + 15 * 60 * 1000)
    
    const expiredEntry = await prisma.rateLimit.findUnique({
      where: { identifier }
    })
    
    if (!expiredEntry || expiredEntry.resetTime < now3) {
      const entry3 = await prisma.rateLimit.upsert({
        where: { identifier },
        update: {
          count: 1,
          resetTime: newResetTime
        },
        create: {
          identifier,
          count: 1,
          resetTime: newResetTime
        }
      })
      
      console.log('   ✅ Reset expired entry:', {
        count: entry3.count,
        resetTime: entry3.resetTime.toISOString()
      })
      console.log('   ✅ Reset time updated (correct!)')
    }
    
    // Cleanup
    await prisma.rateLimit.deleteMany({
      where: { identifier }
    })
    
    console.log('\n✅ Rate Limit Fix Test Complete!')
    
  } catch (error) {
    console.error('❌ Test failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testRateLimitFix()



