const bcrypt = require('bcryptjs')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function createAdminUser() {
  try {
    const email = process.env.ADMIN_EMAIL || 'admin@genosys.ae'
    const password = process.env.ADMIN_PASSWORD || 'admin5'
    const name = process.env.ADMIN_NAME || 'Admin User'

    // Check if admin user already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email }
    })

    if (existingAdmin) {
      console.log('Admin user already exists. Updating password...')
      
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 12)
      
      // Update existing admin user
      await prisma.user.update({
        where: { email },
        data: {
          password: hashedPassword,
          isAdmin: true,
          canSeePrices: true,
          updatedAt: new Date()
        }
      })
      
      console.log('✅ Admin user password updated successfully')
    } else {
      console.log('Creating new admin user...')
      
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 12)
      
      // Create new admin user
      await prisma.user.create({
        data: {
          email,
          name,
          password: hashedPassword,
          isAdmin: true,
          canSeePrices: true,
          phone: '+971 58 548 76 65',
          address: 'Dubai, UAE'
        }
      })
      
      console.log('✅ Admin user created successfully')
    }

    console.log(`Admin credentials:`)
    console.log(`Email: ${email}`)
    console.log(`Password: ${password}`)
    console.log('⚠️  Please change the password after first login!')

  } catch (error) {
    console.error('Error creating admin user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createAdminUser()




