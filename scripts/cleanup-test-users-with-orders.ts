import { prisma } from '../lib/database'
import { getAllUsers } from '../lib/userStorageDb'

async function cleanupTestUsersWithOrders() {
  try {
    console.log('🔍 Fetching all users and their orders...')
    const users = await getAllUsers()
    
    console.log(`📊 Found ${users.length} users in database:`)
    
    for (const user of users) {
      // Get orders for this user
      const orders = await prisma.order.findMany({
        where: { customerEmail: user.email }
      })
      
      console.log(`${user.name} (${user.email}) - ${orders.length} orders`)
    }
    
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
    
    for (const user of testUsers) {
      const orders = await prisma.order.findMany({
        where: { customerEmail: user.email }
      })
      
      console.log(`${user.name} (${user.email}) - ${orders.length} orders`)
      
      if (orders.length > 0) {
        console.log(`  ⚠️  This user has ${orders.length} orders. Options:`)
        console.log(`    1. Delete user and all their orders (${orders.length} orders will be lost)`)
        console.log(`    2. Keep user (has real order data)`)
        console.log(`    3. Skip this user`)
        
        // For now, let's skip users with orders to be safe
        console.log(`  ⏭️  Skipping ${user.name} (has orders)`)
        continue
      }
      
      // Delete user if no orders
      try {
        await prisma.user.delete({
          where: { id: user.id }
        })
        console.log(`  ✅ Deleted: ${user.name} (${user.email})`)
      } catch (error) {
        console.log(`  ❌ Failed to delete: ${user.name} - ${error}`)
      }
    }
    
    console.log(`\n🎉 Cleanup complete!`)
    
    // Show remaining users
    const remainingUsers = await getAllUsers()
    console.log(`\n📊 Remaining users: ${remainingUsers.length}`)
    for (const user of remainingUsers) {
      const orders = await prisma.order.findMany({
        where: { customerEmail: user.email }
      })
      console.log(`${user.name} (${user.email}) - ${orders.length} orders`)
    }
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the cleanup
cleanupTestUsersWithOrders()
