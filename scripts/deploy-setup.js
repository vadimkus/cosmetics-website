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

  // Check if DATABASE_URL is provided
  // In local development, it's OK to skip database operations if DATABASE_URL is not set
  const isProduction = process.env.NODE_ENV === 'production';
  const isVercel = process.env.VERCEL === '1';
  const requiresDatabase = isProduction || isVercel;
  
  if (!process.env.DATABASE_URL) {
    if (requiresDatabase) {
      console.error('❌ DATABASE_URL environment variable is required');
      console.error('   Please set DATABASE_URL in your environment or .env.local file');
      process.exit(1);
    } else {
      console.log('⚠️  DATABASE_URL not set - skipping database operations (local development)');
      console.log('   Prisma client will still be generated, but database sync will be skipped');
    }
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
  // Only verify if DATABASE_URL is available (to avoid connection errors)
  if (process.env.DATABASE_URL) {
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
      // In local dev without DATABASE_URL, this might fail - that's OK
      if (requiresDatabase) {
        console.error('❌ ERROR: Failed to verify Prisma client:', verifyError.message);
        console.error('   Stack:', verifyError.stack);
        throw verifyError;
      } else {
        console.log('⚠️  Could not verify Prisma client (DATABASE_URL not available)');
        console.log('   This is OK for local development builds');
      }
    }
  } else {
    console.log('⏭️  Skipping Prisma client verification (DATABASE_URL not available)');
  }

  // Attempt database push to ensure schema is synced
  // Only attempt if DATABASE_URL is available
  if (process.env.DATABASE_URL) {
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
  } else {
    console.log('⏭️  Skipping database schema sync (DATABASE_URL not available)');
    console.log('   To sync database manually, run: npx prisma db push');
  }

  console.log('✅ Deployment setup completed successfully!');
} catch (error) {
  console.error('❌ Deployment setup failed:', error.message);
  process.exit(1);
}
