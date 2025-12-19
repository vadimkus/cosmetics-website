/**
 * Script to verify Prisma client has PasswordResetToken model
 * Run after build to ensure Prisma client is correctly generated
 * Usage: node scripts/verify-prisma-client.js
 */

const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const isAccelerateUrl = (url) => String(url || '').startsWith('prisma+postgres://');

async function verifyPrismaClient() {
  try {
    console.log('🔍 Verifying Prisma Client...\n');

    const directUrl =
      process.env.DATABASE_URL ||
      process.env.POSTGRES_URL ||
      (process.env.PRISMA_DATABASE_URL && !isAccelerateUrl(process.env.PRISMA_DATABASE_URL)
        ? process.env.PRISMA_DATABASE_URL
        : '');
    if (!directUrl) {
      if (process.env.PRISMA_DATABASE_URL && isAccelerateUrl(process.env.PRISMA_DATABASE_URL)) {
        console.log('⏭️  Skipping Prisma client verification (PRISMA_DATABASE_URL is Prisma Accelerate; direct postgres URL required)\n');
        process.exit(0);
      }
      throw new Error('No direct database URL available for Prisma client verification');
    }

    const pool = new Pool({ connectionString: directUrl });
    const adapter = new PrismaPg(pool);
    const prisma = new PrismaClient({ adapter });

    // Check if passwordResetToken model exists
    const hasPasswordResetToken = !!prisma.passwordResetToken;
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 Prisma Client Verification:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`   PasswordResetToken model: ${hasPasswordResetToken ? '✅ EXISTS' : '❌ MISSING'}`);
    
    // List all available models
    const allKeys = Object.keys(prisma).filter(k => !k.startsWith('$') && !k.startsWith('_'));
    console.log(`\n   Available models (${allKeys.length}):`);
    allKeys.forEach(key => {
      const hasModel = !!prisma[key];
      console.log(`   ${hasModel ? '✅' : '❌'} ${key}`);
    });

    // Try to query the table
    if (hasPasswordResetToken) {
      try {
        const count = await prisma.passwordResetToken.count();
        console.log(`\n   ✅ Table query successful: ${count} tokens found`);
      } catch (queryError) {
        console.log(`\n   ⚠️  Table query failed: ${queryError.message}`);
      }
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    if (hasPasswordResetToken) {
      console.log('✅ Prisma Client verification PASSED');
      console.log('   PasswordResetToken model is available and ready to use.\n');
      await prisma.$disconnect();
      await pool.end().catch(() => {});
      process.exit(0);
    } else {
      console.error('❌ Prisma Client verification FAILED');
      console.error('   PasswordResetToken model is missing!');
      console.error('   Please run: npx prisma generate\n');
      await prisma.$disconnect();
      await pool.end().catch(() => {});
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error verifying Prisma Client:', error.message);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

verifyPrismaClient();

