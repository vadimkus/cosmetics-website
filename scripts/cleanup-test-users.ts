import { prisma } from '../lib/database'
import { getAllUsers, deleteUser } from '../lib/userStorageDb'

async function cleanupTestUsers() {
  try {
    console.log('🔍 Fetching all users from database...')
    const users = await getAllUsers()
    
    console.log(`📊 Found ${users.length} users in database:`)
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email}) - Created: ${user.createdAt}`)
    })
    
    // Identify test users (you can modify this logic as needed)
    const testUserPatterns = [
      'test',
      'demo',
      'example',
      'f.this.that', // Your test user
      'admin@test',
      'user@test'
    ]
    
    const testUsers = users.filter(user => 
      testUserPatterns.some(pattern => 
        user.email.toLowerCase().includes(pattern.toLowerCase()) ||
        user.name.toLowerCase().includes(pattern.toLowerCase())
      )
    )
    
    if (testUsers.length === 0) {
      console.log('✅ No test users found to delete.')
      return
    }
    
    console.log(`\n🗑️  Found ${testUsers.length} test users to delete:`)
    testUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email})`)
    })
    
    // Ask for confirmation (in a real scenario, you might want to add a prompt)
    console.log('\n⚠️  This will permanently delete these users and their associated data.')
    console.log('Proceeding with deletion...')
    
    let deletedCount = 0
    for (const user of testUsers) {
      try {
        const success = await deleteUser(user.id)
        if (success) {
          console.log(`✅ Deleted: ${user.name} (${user.email})`)
          deletedCount++
        } else {
          console.log(`❌ Failed to delete: ${user.name} (${user.email})`)
        }
      } catch (error) {
        console.log(`❌ Error deleting ${user.name}:`, error)
      }
    }
    
    console.log(`\n🎉 Cleanup complete! Deleted ${deletedCount} test users.`)
    
    // Show remaining users
    const remainingUsers = await getAllUsers()
    console.log(`\n📊 Remaining users: ${remainingUsers.length}`)
    remainingUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email})`)
    })
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the cleanup
cleanupTestUsers()
