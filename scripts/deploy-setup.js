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
    process.env.DATABASE_URL = 'postgres://bba1d642802ecf0af6b89802617217c7ee4bd9e45a9df009f7fcc332176072e7:sk_-vf4T6G2TVhfLC4FwIJsi@db.prisma.io:5432/postgres?sslmode=require';
    console.log('📝 Set default DATABASE_URL to PostgreSQL');
  }

  // Generate Prisma client
  console.log('🔧 Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });

  // Skip database push in serverless environments (Vercel)
  // Database will be initialized when first accessed
  console.log('⏭️ Skipping database push (serverless environment)');

  console.log('✅ Deployment setup completed successfully!');
} catch (error) {
  console.error('❌ Deployment setup failed:', error.message);
  process.exit(1);
}
