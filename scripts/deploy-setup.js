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
