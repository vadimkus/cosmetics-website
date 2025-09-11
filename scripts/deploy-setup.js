#!/usr/bin/env node

/**
 * Deployment setup script for Vercel
 * This script handles database initialization and setup
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting deployment setup...');

try {
  // Ensure the database directory exists
  const dbDir = path.join(process.cwd(), 'prisma');
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  // Set default DATABASE_URL if not provided
  if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = 'file:./prisma/dev.db';
    console.log('📝 Set default DATABASE_URL:', process.env.DATABASE_URL);
  }

  // Generate Prisma client
  console.log('🔧 Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });

  // Only run db push in development or if explicitly requested
  if (process.env.NODE_ENV !== 'production' || process.env.FORCE_DB_PUSH === 'true') {
    console.log('🗄️ Pushing database schema...');
    execSync('npx prisma db push', { stdio: 'inherit' });
  } else {
    console.log('⏭️ Skipping database push in production');
  }

  console.log('✅ Deployment setup completed successfully!');
} catch (error) {
  console.error('❌ Deployment setup failed:', error.message);
  process.exit(1);
}
