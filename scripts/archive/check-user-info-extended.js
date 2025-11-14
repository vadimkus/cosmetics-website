const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function checkUserInfoExtended() {
  try {
    const email = 'jeongmi.kim.korea@gmail.com'
    const normalizedEmail = email.trim().toLowerCase()
    
    console.log('🔍 Extended search for user:', email)
    console.log('='.repeat(80))
    
    // Get user information
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    })
    
    if (!user) {
      console.log('\n❌ User not found')
      return
    }
    
    console.log('\n👤 USER INFORMATION:')
    console.log('  ID:', user.id)
    console.log('  Name:', user.name)
    console.log('  Email:', user.email)
    console.log('  Phone:', user.phone || 'Not provided')
    console.log('  Address:', user.address || 'Not provided')
    console.log('  Created At:', user.createdAt)
    console.log('  Last Login At:', user.lastLoginAt || 'Never')
    
    // Check page views by userId
    console.log('\n🌐 PAGE VIEWS (by User ID):')
    const pageViewsByUserId = await prisma.pageView.findMany({
      where: { userId: user.id },
      orderBy: { timestamp: 'desc' },
      take: 50
    })
    
    console.log(`  Total Page Views (by User ID): ${pageViewsByUserId.length}`)
    
    const uniqueIPs = new Set()
    const ipDetails = {}
    
    pageViewsByUserId.forEach((pv, index) => {
      if (pv.ipAddress) {
        uniqueIPs.add(pv.ipAddress)
        if (!ipDetails[pv.ipAddress]) {
          ipDetails[pv.ipAddress] = {
            count: 0,
            firstSeen: pv.timestamp,
            lastSeen: pv.timestamp,
            countries: new Set(),
            cities: new Set(),
            pages: new Set()
          }
        }
        ipDetails[pv.ipAddress].count++
        ipDetails[pv.ipAddress].lastSeen = pv.timestamp > ipDetails[pv.ipAddress].lastSeen 
          ? pv.timestamp 
          : ipDetails[pv.ipAddress].lastSeen
        if (pv.country) ipDetails[pv.ipAddress].countries.add(pv.country)
        if (pv.city) ipDetails[pv.ipAddress].cities.add(pv.city)
        if (pv.page) ipDetails[pv.ipAddress].pages.add(pv.page)
      }
      
      if (index < 10) {
        console.log(`\n  View ${index + 1}:`)
        console.log(`    Page: ${pv.page}`)
        console.log(`    IP: ${pv.ipAddress || 'N/A'}`)
        console.log(`    Location: ${pv.city || 'N/A'}, ${pv.country || 'N/A'}`)
        console.log(`    Device: ${pv.deviceType || 'N/A'} | ${pv.browser || 'N/A'}`)
        console.log(`    Time: ${pv.timestamp}`)
      }
    })
    
    // Check sessions by userId
    console.log('\n📱 USER SESSIONS (by User ID):')
    const sessionsByUserId = await prisma.userSession.findMany({
      where: { userId: user.id },
      orderBy: { startTime: 'desc' },
      take: 20
    })
    
    console.log(`  Total Sessions (by User ID): ${sessionsByUserId.length}`)
    
    sessionsByUserId.forEach((session, index) => {
      if (session.ipAddress) {
        uniqueIPs.add(session.ipAddress)
        if (!ipDetails[session.ipAddress]) {
          ipDetails[session.ipAddress] = {
            count: 0,
            firstSeen: session.startTime,
            lastSeen: session.startTime,
            countries: new Set(),
            cities: new Set(),
            pages: new Set()
          }
        }
        ipDetails[session.ipAddress].count++
        if (session.country) ipDetails[session.ipAddress].countries.add(session.country)
        if (session.city) ipDetails[session.ipAddress].cities.add(session.city)
      }
      
      if (index < 5) {
        console.log(`\n  Session ${index + 1}:`)
        console.log(`    IP: ${session.ipAddress || 'N/A'}`)
        console.log(`    Location: ${session.city || 'N/A'}, ${session.country || 'N/A'}`)
        console.log(`    Device: ${session.deviceType || 'N/A'} | ${session.browser || 'N/A'}`)
        console.log(`    Duration: ${session.duration || 'N/A'}s | Views: ${session.pageViews}`)
        console.log(`    Start: ${session.startTime}`)
      }
    })
    
    // Check all page views with this email (case variations)
    console.log('\n🔍 PAGE VIEWS (by Email - all variations):')
    const allPageViews = await prisma.pageView.findMany({
      where: {
        OR: [
          { userEmail: { contains: 'jeongmi', mode: 'insensitive' } },
          { userEmail: { contains: 'kim.korea', mode: 'insensitive' } }
        ]
      },
      orderBy: { timestamp: 'desc' },
      take: 20
    })
    
    console.log(`  Found ${allPageViews.length} page views with similar email`)
    allPageViews.forEach((pv, index) => {
      if (index < 5) {
        console.log(`\n  View ${index + 1}:`)
        console.log(`    Email: ${pv.userEmail}`)
        console.log(`    IP: ${pv.ipAddress || 'N/A'}`)
        console.log(`    Page: ${pv.page}`)
        console.log(`    Time: ${pv.timestamp}`)
      }
    })
    
    // IP Address Summary
    console.log('\n' + '='.repeat(80))
    console.log('📊 IP ADDRESS DETAILED SUMMARY:')
    console.log(`  Total Unique IP Addresses: ${uniqueIPs.size}`)
    
    if (uniqueIPs.size > 0) {
      console.log('\n  IP Address Details:')
      Object.entries(ipDetails)
        .sort((a, b) => b[1].count - a[1].count)
        .forEach(([ip, details]) => {
          console.log(`\n    IP: ${ip}`)
          console.log(`      Visits: ${details.count}`)
          console.log(`      First Seen: ${details.firstSeen}`)
          console.log(`      Last Seen: ${details.lastSeen}`)
          console.log(`      Countries: ${Array.from(details.countries).join(', ') || 'N/A'}`)
          console.log(`      Cities: ${Array.from(details.cities).join(', ') || 'N/A'}`)
          console.log(`      Pages Visited: ${details.pages.size}`)
        })
    } else {
      console.log('\n  ⚠️  No IP addresses found for this user.')
      console.log('     This could mean:')
      console.log('     - User registered but hasn\'t visited while logged in')
      console.log('     - Analytics tracking wasn\'t active during their visits')
      console.log('     - User visited before analytics was implemented')
    }
    
    // Check orders for IP info (orders don't store IP, but check anyway)
    const orders = await prisma.order.findMany({
      where: { customerEmail: normalizedEmail },
      include: { items: true }
    })
    
    console.log('\n📦 ORDERS:')
    console.log(`  Total Orders: ${orders.length}`)
    if (orders.length > 0) {
      orders.forEach(order => {
        console.log(`\n    Order: ${order.orderNumber}`)
        console.log(`      Status: ${order.status}`)
        console.log(`      Total: ${order.total} AED`)
        console.log(`      Created: ${order.createdAt}`)
        console.log(`      Session ID: ${order.sessionId || 'N/A'}`)
      })
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkUserInfoExtended()

