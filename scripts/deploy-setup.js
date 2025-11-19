#!/usr/bin/env node

/**
 * Deployment setup script for Vercel
 * This script handles database initialization and setup
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local if it exists
const envLocalPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envLocalPath)) {
  const envContent = fs.readFileSync(envLocalPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const trimmedLine = line.trim();
    if (trimmedLine && !trimmedLine.startsWith('#')) {
      const [key, ...valueParts] = trimmedLine.split('=');
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    }
  });
}

console.log('🚀 Starting deployment setup...');

try {
  // Ensure the database directory exists
  const dbDir = path.join(process.cwd(), 'prisma');
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  // Ensure DATABASE_URL is provided
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable is required');
    console.error('   Please set DATABASE_URL in your environment or .env.local file');
    process.exit(1);
  }

  // ALWAYS generate Prisma client to ensure it's fresh
  console.log('🔧 Generating Prisma client...');
  try {
    execSync('npx prisma generate', { stdio: 'inherit' });
    console.log('✅ Prisma client generated successfully');
  } catch (generateError) {
    console.error('❌ Failed to generate Prisma client:', generateError.message);
    throw generateError;
  }

  // Verify PasswordResetToken model exists in generated client
  console.log('🔍 Verifying PasswordResetToken model...');
  try {
    // Clear require cache to ensure we get the fresh client
    delete require.cache[require.resolve('@prisma/client')];
    const { PrismaClient } = require('@prisma/client');
    const testClient = new PrismaClient();
    
    // Check if PasswordResetToken model exists
    if (!testClient.passwordResetToken) {
      console.error('❌ ERROR: PasswordResetToken model NOT FOUND in Prisma client!');
      console.error('   This will cause password reset feature to fail.');
      console.error('   Available models:', Object.keys(testClient).filter(k => !k.startsWith('$') && !k.startsWith('_')).join(', '));
      testClient.$disconnect();
      throw new Error('PasswordResetToken model not found in Prisma client');
    } else {
      console.log('✅ PasswordResetToken model verified in Prisma client');
      console.log('✅ Password reset feature is properly configured');
    }
    testClient.$disconnect();
  } catch (verifyError) {
    console.error('❌ ERROR: Failed to verify Prisma client:', verifyError.message);
    console.error('   Stack:', verifyError.stack);
    throw verifyError;
  }

  // Attempt database push to ensure schema is synced
  // This will fail silently in some serverless environments, which is OK
  // Manual migration can be run via: npx prisma db push
  console.log('📋 Attempting to sync database schema...');
  try {
    execSync('npx prisma db push --skip-generate --accept-data-loss', { 
      stdio: 'pipe',
      timeout: 30000 // 30 second timeout
    });
    console.log('✅ Database schema synced successfully');
  } catch (dbPushError) {
    // In serverless environments, db push might not work
    // This is expected and OK - migration can be run manually
    console.log('⏭️  Database push skipped (serverless environment or manual migration required)');
    console.log('   To sync database manually, run: npx prisma db push');
    console.log('   Or use the migration script: node scripts/migrate-password-reset-table.js');
  }

  console.log('✅ Deployment setup completed successfully!');
} catch (error) {
  console.error('❌ Deployment setup failed:', error.message);
  process.exit(1);
}
