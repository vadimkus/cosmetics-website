const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const { PrismaClient } = require('@prisma/client');

const databaseUrl = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('❌ DATABASE_URL or PRISMA_DATABASE_URL not found');
  process.exit(1);
}

const isAccelerate = databaseUrl.startsWith('prisma+');

let prisma;
if (isAccelerate) {
  prisma = new PrismaClient({
    accelerateUrl: databaseUrl,
    log: ['error']
  });
} else {
  const { PrismaPg } = require('@prisma/adapter-pg');
  const { Pool } = require('pg');
  const pool = new Pool({ connectionString: databaseUrl });
  const adapter = new PrismaPg(pool);
  prisma = new PrismaClient({
    adapter,
    log: ['error']
  });
}

async function checkUserDiscountStatus() {
  try {
    const email = process.argv[2] || 'kinga.uae@gmail.com'
    const normalizedEmail = email.trim().toLowerCase()
    
    console.log('🔍 Checking discount status for:', email)
    console.log('📧 Normalized email:', normalizedEmail)
    console.log('='.repeat(80))
    
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: {
        id: true,
        email: true,
        name: true,
        discountType: true,
        discountPercentage: true,
        createdAt: true,
        updatedAt: true
      }
    })
    
    if (!user) {
      console.log('\n❌ User NOT FOUND in database')
      console.log('\n🔎 Checking for traces in related tables...\n')
      
      // Check orders
      const orders = await prisma.order.findMany({
        where: { customerEmail: normalizedEmail },
        orderBy: { createdAt: 'desc' },
        take: 5
      })
      
      if (orders.length > 0) {
        console.log(`📦 Found ${orders.length} order(s) associated with this email:`)
        orders.forEach((order, index) => {
          console.log(`  Order ${index + 1}: ${order.orderNumber} - ${order.status} - ${order.total} AED - ${order.createdAt}`)
        })
      } else {
        console.log('📦 No orders found for this email')
      }
      
      await prisma.$disconnect()
      return
    }
    
    console.log('\n✅ User found:')
    console.log(`   ID: ${user.id}`)
    console.log(`   Name: ${user.name || 'N/A'}`)
    console.log(`   Email: ${user.email}`)
    console.log(`   Created: ${user.createdAt}`)
    console.log(`   Last Updated: ${user.updatedAt}`)
    console.log(`\n💰 Discount Information:`)
    console.log(`   Discount Type: ${user.discountType || 'None'}`)
    console.log(`   Discount Percentage: ${user.discountPercentage || 0}%`)
    
    if (user.discountType && user.discountPercentage && user.discountPercentage > 0) {
      console.log(`\n✅ User HAS a discount assigned!`)
      console.log(`   Type: ${user.discountType}`)
      console.log(`   Percentage: ${user.discountPercentage}%`)
      
      // Check when it was last updated
      const timeSinceUpdate = user.updatedAt ? 
        Math.floor((Date.now() - new Date(user.updatedAt).getTime()) / 1000 / 60) : null
      
      if (timeSinceUpdate !== null) {
        console.log(`\n⏰ Last updated: ${timeSinceUpdate} minutes ago`)
      }
    } else {
      console.log(`\n⚠️  User does NOT have a discount assigned`)
    }
    
    await prisma.$disconnect()
  } catch (error) {
    console.error('❌ Error:', error)
    if (error.stack) {
      console.error('Stack:', error.stack)
    }
    await prisma.$disconnect()
    process.exit(1)
  }
}

checkUserDiscountStatus()

