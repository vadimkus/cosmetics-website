import { prisma } from '../lib/database'
import { findUserByEmail } from '../lib/userStorageDb'

async function checkUserData() {
  try {
    console.log('🔍 Checking user data for f.this.that@gmail.com...')
    
    const user = await findUserByEmail('f.this.that@gmail.com')
    
    if (!user) {
      console.log('❌ User not found')
      return
    }
    
    console.log('✅ User found:')
    console.log('  - ID:', user.id)
    console.log('  - Name:', user.name)
    console.log('  - Email:', user.email)
    console.log('  - Phone:', user.phone || 'Not set')
    console.log('  - Address:', user.address || 'Not set')
    console.log('  - Birthday:', user.birthday || 'Not set')
    console.log('  - Created At:', user.createdAt)
    console.log('  - Is Admin:', user.isAdmin)
    console.log('  - Can See Prices:', user.canSeePrices)
    
    // Check if birthday is null or empty
    if (user.birthday === null || user.birthday === undefined || user.birthday === '') {
      console.log('⚠️  Birthday is not set in the database')
    } else {
      console.log('✅ Birthday is set:', user.birthday)
    }
    
  } catch (error) {
    console.error('❌ Error checking user data:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the check
checkUserData()
