const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function checkUserInfo() {
  try {
    const email = 'jeongmi.kim.korea@gmail.com'
    const normalizedEmail = email.trim().toLowerCase()
    
    console.log('🔍 Checking user information for:', email)
    console.log('📧 Normalized email:', normalizedEmail)
    console.log('='.repeat(80))
    
    // Get user information
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    })
    
    if (!user) {
      console.log('\n❌ User not found in database')
      return
    }
    
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
    orders.forEach((order, index) => {
      console.log(`\n  Order ${index + 1}:`)
      console.log(`    Order Number: ${order.orderNumber}`)
      console.log(`    Status: ${order.status}`)
      console.log(`    Total: ${order.total} AED`)
      console.log(`    Created At: ${order.createdAt}`)
      console.log(`    Items: ${order.items.length}`)
      if (order.items.length > 0) {
        order.items.forEach(item => {
          console.log(`      - ${item.productName} (x${item.quantity}) - ${item.price} AED`)
        })
      }
    })
    
    // Get page views with IP addresses
    console.log('\n🌐 PAGE VIEWS & IP ADDRESSES:')
    const pageViews = await prisma.pageView.findMany({
      where: { userEmail: normalizedEmail },
      orderBy: { timestamp: 'desc' },
      take: 20
    })
    
    console.log(`  Total Page Views: ${pageViews.length} (showing last 20)`)
    
    const uniqueIPs = new Set()
    const ipCounts = {}
    
    pageViews.forEach((pv, index) => {
      if (pv.ipAddress) {
        uniqueIPs.add(pv.ipAddress)
        ipCounts[pv.ipAddress] = (ipCounts[pv.ipAddress] || 0) + 1
      }
      
      if (index < 10) {
        console.log(`\n  View ${index + 1}:`)
        console.log(`    Page: ${pv.page}`)
        console.log(`    IP Address: ${pv.ipAddress || 'Not recorded'}`)
        console.log(`    Country: ${pv.country || 'Not recorded'}`)
        console.log(`    City: ${pv.city || 'Not recorded'}`)
        console.log(`    Device: ${pv.deviceType || 'Not recorded'}`)
        console.log(`    Browser: ${pv.browser || 'Not recorded'}`)
        console.log(`    Timestamp: ${pv.timestamp}`)
      }
    })
    
    console.log('\n📊 IP ADDRESS SUMMARY:')
    console.log(`  Unique IP Addresses: ${uniqueIPs.size}`)
    if (uniqueIPs.size > 0) {
      console.log('\n  IP Addresses (with visit counts):')
      Object.entries(ipCounts)
        .sort((a, b) => b[1] - a[1])
        .forEach(([ip, count]) => {
          console.log(`    ${ip}: ${count} visits`)
        })
    }
    
    // Get user sessions
    console.log('\n📱 USER SESSIONS:')
    const sessions = await prisma.userSession.findMany({
      where: { userEmail: normalizedEmail },
      orderBy: { startTime: 'desc' },
      take: 10
    })
    
    console.log(`  Total Sessions: ${sessions.length} (showing last 10)`)
    sessions.forEach((session, index) => {
      console.log(`\n  Session ${index + 1}:`)
      console.log(`    IP Address: ${session.ipAddress || 'Not recorded'}`)
      console.log(`    Country: ${session.country || 'Not recorded'}`)
      console.log(`    City: ${session.city || 'Not recorded'}`)
      console.log(`    Device: ${session.deviceType || 'Not recorded'}`)
      console.log(`    Browser: ${session.browser || 'Not recorded'}`)
      console.log(`    Page Views: ${session.pageViews}`)
      console.log(`    Duration: ${session.duration ? session.duration + ' seconds' : 'N/A'}`)
      console.log(`    Start Time: ${session.startTime}`)
      console.log(`    End Time: ${session.endTime || 'Active'}`)
    })
    
    // Get PDF downloads
    console.log('\n📄 PDF DOWNLOADS:')
    const pdfDownloads = await prisma.pDFDownload.findMany({
      where: { userEmail: normalizedEmail },
      orderBy: { timestamp: 'desc' },
      take: 10
    })
    
    console.log(`  Total PDF Downloads: ${pdfDownloads.length} (showing last 10)`)
    pdfDownloads.forEach((pdf, index) => {
      console.log(`\n  Download ${index + 1}:`)
      console.log(`    File: ${pdf.filename}`)
      console.log(`    IP Address: ${pdf.ipAddress || 'Not recorded'}`)
      console.log(`    Country: ${pdf.country || 'Not recorded'}`)
      console.log(`    City: ${pdf.city || 'Not recorded'}`)
      console.log(`    Timestamp: ${pdf.timestamp}`)
    })
    
    // Get user actions
    console.log('\n🎯 USER ACTIONS:')
    const actions = await prisma.userAction.findMany({
      where: { userEmail: normalizedEmail },
      orderBy: { timestamp: 'desc' },
      take: 20
    })
    
    console.log(`  Total Actions: ${actions.length} (showing last 20)`)
    actions.forEach((action, index) => {
      if (index < 10) {
        console.log(`\n  Action ${index + 1}:`)
        console.log(`    Action: ${action.action}`)
        console.log(`    Details: ${action.details || 'None'}`)
        console.log(`    Timestamp: ${action.timestamp}`)
      }
    })
    
    // Summary
    console.log('\n' + '='.repeat(80))
    console.log('📊 SUMMARY:')
    console.log(`  User ID: ${user.id}`)
    console.log(`  Total Orders: ${orders.length}`)
    console.log(`  Total Spent: ${orders.reduce((sum, o) => sum + o.total, 0)} AED`)
    console.log(`  Total Page Views: ${pageViews.length}`)
    console.log(`  Unique IP Addresses: ${uniqueIPs.size}`)
    console.log(`  Total Sessions: ${sessions.length}`)
    console.log(`  Total PDF Downloads: ${pdfDownloads.length}`)
    console.log(`  Total Actions: ${actions.length}`)
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkUserInfo()

