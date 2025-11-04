const bcrypt = require('bcryptjs')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testAdminLogin() {
  try {
    console.log('🔍 Testing admin login logic...')
    
    // Test finding admin user
    const user = await prisma.user.findUnique({
      where: { email: 'admin@genosys.ae' }
    })
    
    if (!user) {
      console.log('❌ Admin user not found')
      return
    }
    
    console.log('✅ Admin user found:', user.email)
    console.log('✅ Is admin:', user.isAdmin)
    console.log('✅ Password hash starts with $2:', user.password.startsWith('$2'))
    
    // Test password verification
    const password = 'admin5'
    const isValid = await bcrypt.compare(password, user.password)
    console.log('✅ Password verification result:', isValid)
    
    if (isValid && user.isAdmin) {
      console.log('✅ Admin login would succeed')
    } else {
      console.log('❌ Admin login would fail')
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testAdminLogin()


