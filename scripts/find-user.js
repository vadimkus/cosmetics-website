/**
 * Script to find user by email or name
 * Usage: node scripts/find-user.js <search-term>
 */

// Import Prisma client from the lib (which has proper configuration)
// We need to use require with the compiled JS path
const path = require('path');

// Since we can't easily import TypeScript files, let's use a simpler approach
// Load environment variables first
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const { PrismaClient } = require('@prisma/client');

// Initialize Prisma with proper adapter configuration
let prisma;

// Check if using Prisma Accelerate
const databaseUrl = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('❌ DATABASE_URL or PRISMA_DATABASE_URL not found in environment variables');
  process.exit(1);
}

const isAccelerate = databaseUrl.startsWith('prisma+');

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

async function findUser(searchTerm) {
  try {
    console.log(`🔍 Searching for user: ${searchTerm}\n`);
    
    // Search for user by email or name
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { email: { contains: searchTerm, mode: 'insensitive' } },
          { name: { contains: searchTerm, mode: 'insensitive' } }
        ]
      },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
        isAdmin: true,
        canSeePrices: true,
        phone: true,
        address: true,
        createdAt: true,
        lastLoginAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    if (users.length === 0) {
      console.log('❌ User not found');
      process.exit(1);
    }
    
    console.log(`✅ Found ${users.length} user(s):\n`);
    users.forEach((user, i) => {
      console.log(`${'='.repeat(60)}`);
      console.log(`${i + 1}. ${user.name}`);
      console.log(`${'='.repeat(60)}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Admin: ${user.isAdmin ? 'Yes ✅' : 'No'}`);
      console.log(`   Can See Prices: ${user.canSeePrices ? 'Yes' : 'No'}`);
      console.log(`   Phone: ${user.phone || 'N/A'}`);
      console.log(`   Address: ${user.address || 'N/A'}`);
      console.log(`   Created: ${user.createdAt ? new Date(user.createdAt).toLocaleString() : 'N/A'}`);
      console.log(`   Last Login: ${user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : 'Never'}`);
      console.log(`   Has Password: ${user.password ? 'Yes' : 'No'}`);
      
      if (user.password) {
        if (user.password.startsWith('$2')) {
          console.log(`   Password Type: Hashed (bcrypt) - Cannot retrieve plaintext`);
          console.log(`   Password Hash: ${user.password.substring(0, 20)}...`);
        } else {
          console.log(`   Password Type: Plaintext`);
          console.log(`   Password: ${user.password}`);
        }
      }
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Get search term from command line arguments
const searchTerm = process.argv[2];

if (!searchTerm) {
  console.error('Usage: node scripts/find-user.js <search-term>');
  console.error('Example: node scripts/find-user.js sadulaeva');
  console.error('Example: node scripts/find-user.js user@example.com');
  process.exit(1);
}

// Run the script
findUser(searchTerm)
  .then(() => {
    console.log('✅ Script completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Fatal error:', error);
    process.exit(1);
  });

