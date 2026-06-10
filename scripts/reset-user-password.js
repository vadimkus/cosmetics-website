/**
 * Reset a user's password by email or name.
 * Hashes the new password with bcrypt (cost 12) to match the login flow.
 *
 * Usage: node scripts/reset-user-password.js "<search-term>" "<new-password>"
 * Example: node scripts/reset-user-password.js "Inna Ageeva" "password001"
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const databaseUrl = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('❌ DATABASE_URL or PRISMA_DATABASE_URL not found in environment variables');
  process.exit(1);
}

let prisma;
const isAccelerate = databaseUrl.startsWith('prisma+');

if (isAccelerate) {
  prisma = new PrismaClient({ accelerateUrl: databaseUrl, log: ['error'] });
} else {
  const { PrismaPg } = require('@prisma/adapter-pg');
  const { Pool } = require('pg');
  const pool = new Pool({ connectionString: databaseUrl });
  const adapter = new PrismaPg(pool);
  prisma = new PrismaClient({ adapter, log: ['error'] });
}

async function resetPassword(searchTerm, newPassword) {
  console.log(`🔍 Searching for user: ${searchTerm}\n`);

  const users = await prisma.user.findMany({
    where: {
      OR: [
        { email: { contains: searchTerm, mode: 'insensitive' } },
        { name: { contains: searchTerm, mode: 'insensitive' } },
      ],
    },
    select: { id: true, email: true, name: true },
    orderBy: { createdAt: 'desc' },
  });

  if (users.length === 0) {
    console.error('❌ No user found matching that search term.');
    process.exit(1);
  }

  if (users.length > 1) {
    console.error(`❌ Found ${users.length} matching users. Refine the search term to match exactly one:\n`);
    users.forEach((u, i) => console.error(`   ${i + 1}. ${u.name} <${u.email}> (id: ${u.id})`));
    process.exit(1);
  }

  const user = users[0];
  console.log(`✅ Found user: ${user.name} <${user.email}> (id: ${user.id})`);

  const hashedPassword = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword },
  });

  console.log(`\n🔐 Password reset successfully for ${user.name} <${user.email}>`);
  console.log(`   New password: ${newPassword}`);
  console.log(`   Stored as: bcrypt hash (cost 12)`);
}

const searchTerm = process.argv[2];
const newPassword = process.argv[3];

if (!searchTerm || !newPassword) {
  console.error('Usage: node scripts/reset-user-password.js "<search-term>" "<new-password>"');
  console.error('Example: node scripts/reset-user-password.js "Inna Ageeva" "password001"');
  process.exit(1);
}

resetPassword(searchTerm, newPassword)
  .then(() => {
    console.log('\n✅ Done.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Fatal error:', error.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
