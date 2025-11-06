import { debugLog, errorLog } from '@/lib/logger'
import { prisma } from '../lib/database'
import { findUserByEmail } from '../lib/userStorageDb'

async function checkUserData() {
  try {
    debugLog('🔍 Checking user data for f.this.that@gmail.com...')
    
    const user = await findUserByEmail('f.this.that@gmail.com')
    
    if (!user) {
      debugLog('❌ User not found')
      return
    }
    
    debugLog('✅ User found:')
    debugLog('  - ID:', user.id)
    debugLog('  - Name:', user.name)
    debugLog('  - Email:', user.email)
    debugLog('  - Phone:', user.phone || 'Not set')
    debugLog('  - Address:', user.address || 'Not set')
    debugLog('  - Birthday:', user.birthday || 'Not set')
    debugLog('  - Created At:', user.createdAt)
    debugLog('  - Is Admin:', user.isAdmin)
    debugLog('  - Can See Prices:', user.canSeePrices)
    
    // Check if birthday is null or empty
    if (user.birthday === null || user.birthday === undefined || user.birthday === '') {
      debugLog('⚠️  Birthday is not set in the database')
    } else {
      debugLog('✅ Birthday is set:', user.birthday)
    }
    
  } catch (error) {
    errorLog('❌ Error checking user data:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the check
checkUserData()
