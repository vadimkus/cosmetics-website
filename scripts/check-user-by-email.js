const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function checkUserByEmail() {
  try {
    const email = process.argv[2] || 'emjhay_piedad@yahoo.com'
    const normalizedEmail = email.trim().toLowerCase()
    
    console.log('🔍 Checking user information for:', email)
    console.log('📧 Normalized email:', normalizedEmail)
    console.log('='.repeat(80))
    
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    })
    
    if (!user) {
      console.log('\n❌ User NOT FOUND in database')
      console.log('\n🔎 Checking for traces in related tables...\n')
      
      // Check orders
      const orders = await prisma.order.findMany({
        where: { customerEmail: normalizedEmail },
        orderBy: { createdAt: 'desc' }
      })
      
      if (orders.length > 0) {
        console.log(`📦 Found ${orders.length} order(s) associated with this email:`)
        orders.forEach((order, index) => {
          console.log(`  Order ${index + 1}: ${order.orderNumber} - ${order.status} - ${order.total} AED - ${order.createdAt}`)
        })
        console.log('\n⚠️  This suggests the user existed before but may have been deleted.')
      } else {
        console.log('📦 No orders found for this email')
      }
      
      // Check page views
      const pageViews = await prisma.pageView.findMany({
        where: { userEmail: normalizedEmail },
        orderBy: { timestamp: 'desc' },
        take: 5
      })
      
      if (pageViews.length > 0) {
        console.log(`\n🌐 Found ${pageViews.length} page view(s) associated with this email`)
        console.log('   (showing last 5)')
        pageViews.forEach((pv, index) => {
          console.log(`  View ${index + 1}: ${pv.page} - ${pv.timestamp}`)
        })
      } else {
        console.log('\n🌐 No page views found for this email')
      }
      
      // Check user actions
      const actions = await prisma.userAction.findMany({
        where: { userEmail: normalizedEmail },
        orderBy: { timestamp: 'desc' },
        take: 5
      })
      
      if (actions.length > 0) {
        console.log(`\n🎯 Found ${actions.length} user action(s) associated with this email`)
        console.log('   (showing last 5)')
        actions.forEach((action, index) => {
          console.log(`  Action ${index + 1}: ${action.action} - ${action.timestamp}`)
        })
      } else {
        console.log('\n🎯 No user actions found for this email')
      }
      
      // Check user sessions
      const sessions = await prisma.userSession.findMany({
        where: { userEmail: normalizedEmail },
        orderBy: { startTime: 'desc' },
        take: 5
      })
      
      if (sessions.length > 0) {
        console.log(`\n📱 Found ${sessions.length} session(s) associated with this email`)
        console.log('   (showing last 5)')
        sessions.forEach((session, index) => {
          console.log(`  Session ${index + 1}: ${session.startTime} - ${session.pageViews} page views`)
        })
      } else {
        console.log('\n📱 No sessions found for this email')
      }
      
      console.log('\n' + '='.repeat(80))
      console.log('💡 CONCLUSION:')
      if (orders.length > 0 || pageViews.length > 0 || actions.length > 0 || sessions.length > 0) {
        console.log('   The user likely existed before but has been DELETED from the database.')
        console.log('   Traces remain in related tables (orders, analytics, etc.)')
      } else {
        console.log('   No traces found. Either the user never existed,')
        console.log('   or all related data has been cleaned up.')
      }
      
      return
    }
    
    console.log('\n✅ USER FOUND IN DATABASE')
    console.log('\n👤 USER INFORMATION:')
    console.log('  ID:', user.id)
    console.log('  Name:', user.name)
    console.log('  Email:', user.email)
    console.log('  Phone:', user.phone || 'Not provided')
    console.log('  Address:', user.address || 'Not provided')
    console.log('  Birthday:', user.birthday || 'Not provided')
    console.log('  Is Admin:', user.isAdmin)
    console.log('  Can See Prices:', user.canSeePrices)
    console.log('  Discount Type:', user.discountType || 'None')
    console.log('  Discount Percentage:', user.discountPercentage || 'None')
    console.log('  Created At:', user.createdAt)
    console.log('  Updated At:', user.updatedAt)
    console.log('  Last Login At:', user.lastLoginAt || 'Never')
    
    // Get orders
    console.log('\n📦 ORDERS:')
    const orders = await prisma.order.findMany({
      where: { customerEmail: normalizedEmail },
      include: { items: true },
      orderBy: { createdAt: 'desc' }
    })
    
    console.log(`  Total Orders: ${orders.length}`)
    if (orders.length > 0) {
      orders.forEach((order, index) => {
        console.log(`\n  Order ${index + 1}:`)
        console.log(`    Order Number: ${order.orderNumber}`)
        console.log(`    Status: ${order.status}`)
        console.log(`    Total: ${order.total} AED`)
        console.log(`    Created At: ${order.createdAt}`)
        console.log(`    Items: ${order.items.length}`)
      })
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkUserByEmail()

