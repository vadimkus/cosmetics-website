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

async function checkUserAuthMethod() {
  try {
    const email = process.argv[2] || 'dali2015@bk.ru'
    const normalizedEmail = email.trim().toLowerCase()
    
    console.log('🔍 Checking registration method for:', email)
    console.log('📧 Normalized email:', normalizedEmail)
    console.log('='.repeat(80))
    
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
        createdAt: true,
        lastLoginAt: true,
        profilePicture: true
      }
    })
    
    if (!user) {
      console.log('\n❌ User NOT FOUND in database')
      await prisma.$disconnect()
      return
    }
    
    console.log('\n✅ User found:')
    console.log('   Email:', user.email)
    console.log('   Name:', user.name)
    console.log('   Created:', user.createdAt)
    console.log('   Last Login:', user.lastLoginAt || 'Never')
    console.log('   Has Profile Picture:', user.profilePicture ? 'Yes' : 'No')
    
    console.log('\n🔐 Authentication Method:')
    if (!user.password) {
      console.log('   ✅ Google Sign-In')
      console.log('   (Password field is NULL)')
    } else if (user.password.startsWith('$2')) {
      console.log('   ✅ Email/Password Registration')
      console.log('   (Password is bcrypt hashed)')
      console.log('   Password hash:', user.password.substring(0, 30) + '...')
    } else {
      console.log('   ⚠️  Email/Password Registration (Legacy)')
      console.log('   (Password appears to be plaintext - should be upgraded)')
    }
    
    await prisma.$disconnect()
  } catch (error) {
    console.error('❌ Error:', error)
    await prisma.$disconnect()
    process.exit(1)
  }
}

checkUserAuthMethod()

