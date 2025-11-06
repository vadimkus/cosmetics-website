const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function checkCustomerOrders() {
  try {
    const email = 'yaprelestna@mail.ru'
    const normalizedEmail = email.trim().toLowerCase()
    
    console.log('🔍 Checking orders for:', email)
    console.log('📧 Normalized email:', normalizedEmail)
    
    // Check user
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    })
    
    if (user) {
      console.log('\n✅ User found:')
      console.log('  - ID:', user.id)
      console.log('  - Email:', user.email)
      console.log('  - Name:', user.name)
    } else {
      console.log('\n❌ User not found with email:', normalizedEmail)
    }
    
    // Check all orders with this email (case-insensitive)
    console.log('\n🔍 Checking orders...')
    
    // Try exact match
    const exactOrders = await prisma.order.findMany({
      where: { customerEmail: normalizedEmail },
      include: { items: true },
      orderBy: { createdAt: 'desc' }
    })
    
    console.log(`\n📦 Exact match orders: ${exactOrders.length}`)
    exactOrders.forEach(order => {
      console.log(`  - Order #${order.orderNumber}: ${order.status} - ${order.total} AED - ${order.createdAt}`)
      console.log(`    Customer Email: "${order.customerEmail}"`)
    })
    
    // Try case-insensitive search
    const caseInsensitiveOrders = await prisma.$queryRaw`
      SELECT * FROM orders 
      WHERE LOWER(TRIM(customer_email)) = LOWER(TRIM(${normalizedEmail}))
      ORDER BY created_at DESC
    `
    
    console.log(`\n📦 Case-insensitive match orders: ${caseInsensitiveOrders.length}`)
    caseInsensitiveOrders.forEach(order => {
      console.log(`  - Order #${order.order_number}: ${order.status} - ${order.total} AED`)
      console.log(`    Customer Email: "${order.customer_email}"`)
    })
    
    // Check all orders to see what emails exist
    console.log('\n🔍 All unique customer emails in orders:')
    const allEmails = await prisma.$queryRaw`
      SELECT DISTINCT customer_email, COUNT(*) as count
      FROM orders
      WHERE customer_email ILIKE '%yaprelestna%'
      GROUP BY customer_email
      ORDER BY count DESC
    `
    
    allEmails.forEach(row => {
      console.log(`  - "${row.customer_email}": ${row.count} orders`)
    })
    
    // Check all orders regardless of email
    const allOrders = await prisma.order.findMany({
      select: {
        orderNumber: true,
        customerEmail: true,
        status: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    })
    
    console.log('\n📦 Recent orders (last 10):')
    allOrders.forEach(order => {
      console.log(`  - Order #${order.orderNumber}: ${order.customerEmail} - ${order.status}`)
    })
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkCustomerOrders()

