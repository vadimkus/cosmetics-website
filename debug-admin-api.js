const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function debugAdminAPI() {
  try {
    console.log('🔍 Testing admin API logic step by step...')
    
    // Test 1: Database connection
    console.log('\n1. Testing database connection...')
    await prisma.$connect()
    console.log('✅ Database connected')
    
    // Test 2: Find admin user
    console.log('\n2. Finding admin user...')
    const user = await prisma.user.findUnique({
      where: { email: 'admin@genosys.ae' }
    })
    
    if (!user) {
      console.log('❌ Admin user not found')
      return
    }
    
    console.log('✅ Admin user found:', user.email)
    console.log('✅ Is admin:', user.isAdmin)
    console.log('✅ Password hash:', user.password.substring(0, 20) + '...')
    
    // Test 3: Password verification
    console.log('\n3. Testing password verification...')
    const password = 'admin5'
    const isValid = await bcrypt.compare(password, user.password)
    console.log('✅ Password verification:', isValid)
    
    // Test 4: Rate limiting (simulate)
    console.log('\n4. Testing rate limiting...')
    const identifier = 'test-ip-test-ua'
    
    // Clean up old entries
    await prisma.rateLimit.deleteMany({
      where: {
        resetTime: {
          lt: new Date()
        }
      }
    })
    
    // Test rate limit creation
    const rateLimitEntry = await prisma.rateLimit.upsert({
      where: { identifier },
      update: {
        count: 1,
        resetTime: new Date(Date.now() + 15 * 60 * 1000)
      },
      create: {
        identifier,
        count: 1,
        resetTime: new Date(Date.now() + 15 * 60 * 1000)
      }
    })
    
    console.log('✅ Rate limiting works:', rateLimitEntry.count)
    
    // Test 5: Final admin check
    console.log('\n5. Final admin authentication check...')
    if (user && user.isAdmin && isValid) {
      console.log('✅ Admin authentication would succeed')
      console.log('✅ User data:', {
        id: user.id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin
      })
    } else {
      console.log('❌ Admin authentication would fail')
    }
    
  } catch (error) {
    console.error('❌ Debug failed:', error)
    console.error('Stack:', error.stack)
  } finally {
    await prisma.$disconnect()
  }
}

debugAdminAPI()




