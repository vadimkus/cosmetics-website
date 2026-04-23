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
  const isPostInstall = process.env.npm_lifecycle_event === 'postinstall';
  const requiresDatabase = isProduction || isVercel;
  
  if (!process.env.DATABASE_URL) {
    if (requiresDatabase && !isPostInstall) {
      // During postinstall on Vercel, environment variables might not be fully available yet
      // Only fail if this is NOT during postinstall phase
      console.error('❌ DATABASE_URL environment variable is required');
      console.error('   Please set DATABASE_URL in your environment or .env.local file');
      process.exit(1);
    } else {
      if (isPostInstall && isVercel) {
        console.log('⚠️  DATABASE_URL not available during postinstall on Vercel (this is normal)');
        console.log('   Database operations will be handled during the build phase');
      } else {
        console.log('⚠️  DATABASE_URL not set - skipping database operations (local development)');
        console.log('   Prisma client will still be generated, but database sync will be skipped');
      }
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

  // Verify PasswordResetToken model exists in generated client.
  // Note: This verification is non-blocking - build will continue even if it fails.
  //
  // IMPORTANT: When using Prisma Accelerate (prisma+postgres://...), PrismaClient construction during build-time
  // scripts can fail unless you use a DIRECT postgres:// URL with the pg adapter.
  const isAccelerateUrl = (url) => String(url || '').startsWith('prisma+postgres://');
  const directVerifyUrl =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    (process.env.PRISMA_DATABASE_URL && !isAccelerateUrl(process.env.PRISMA_DATABASE_URL)
      ? process.env.PRISMA_DATABASE_URL
      : '');

  if (directVerifyUrl) {
    console.log('🔍 Verifying PasswordResetToken model...');
    try {
      // Clear require cache to ensure we get the fresh client
      try {
        const prismaClientPath = require.resolve('@prisma/client');
        delete require.cache[prismaClientPath];
      } catch (resolveError) {
        // If we can't resolve, that's OK - might not be installed yet
        console.log('⚠️  Could not clear Prisma client cache (this is OK)');
      }
      
      const { PrismaClient } = require('@prisma/client');
      const { PrismaPg } = require('@prisma/adapter-pg');
      const { Pool } = require('pg');
      
      // Check if PrismaClient is properly exported
      if (!PrismaClient) {
        throw new Error('PrismaClient is not exported from @prisma/client');
      }
      
      const pool = new Pool({ connectionString: directVerifyUrl });
      const adapter = new PrismaPg(pool);
      const testClient = new PrismaClient({ adapter });
      
      // Check if PasswordResetToken model exists
      if (!testClient.passwordResetToken) {
        console.warn('⚠️  PasswordResetToken model NOT FOUND in Prisma client');
        console.warn('   Available models:', Object.keys(testClient).filter(k => !k.startsWith('$') && !k.startsWith('_')).join(', '));
        testClient.$disconnect().catch(() => {});
        pool.end().catch(() => {});
      } else {
        console.log('✅ PasswordResetToken model verified in Prisma client');
        console.log('✅ Password reset feature is properly configured');
        testClient.$disconnect().catch(() => {});
        pool.end().catch(() => {});
      }
    } catch (verifyError) {
      // In Vercel builds, Prisma client verification might fail due to environment
      // This is often OK - the client will work at runtime
      console.log('⚠️  Could not verify Prisma client:', verifyError.message);
      console.log('   This is often OK - Prisma client will work at runtime');
      console.log('   If password reset fails, check Prisma schema and migrations');
      // Don't throw error - allow build to continue
    }
  } else {
    if (process.env.PRISMA_DATABASE_URL && isAccelerateUrl(process.env.PRISMA_DATABASE_URL)) {
      console.log('⏭️  Skipping Prisma client verification (PRISMA_DATABASE_URL is Prisma Accelerate; direct postgres URL required)');
    } else {
      console.log('⏭️  Skipping Prisma client verification (no direct DATABASE_URL/POSTGRES_URL available)');
    }
  }

  // Apply pending database migrations.
  //
  // Previously this step ran `prisma db push --accept-data-loss`, which:
  //   1. bypasses the migration history (no row written to `_prisma_migrations`)
  //   2. can DROP columns/tables on schema drift (the `--accept-data-loss` part)
  //   3. failed silently (stdio: 'pipe' + empty catch) so broken deploys shipped
  //
  // `prisma migrate deploy` is the canonical production path:
  //   - applies only NEW migrations recorded in `prisma/migrations/`
  //   - is idempotent (safe to re-run; no-op if nothing pending)
  //   - fails loudly and blocks the build if a migration breaks — that's what we want
  //
  // Escape hatch: set SKIP_DB_MIGRATIONS=true in Vercel env to bypass this step
  // in an emergency (e.g. you need to ship a hotfix while a migration is broken).
  // Use sparingly — the schema will drift from the checked-in migrations.
  if (process.env.SKIP_DB_MIGRATIONS === 'true') {
    console.log('⏭️  SKIP_DB_MIGRATIONS=true — bypassing prisma migrate deploy');
    console.log('   Remember to re-run migrations manually: npm run db:migrate:deploy');
  } else if (directVerifyUrl) {
    console.log('📋 Applying pending database migrations (prisma migrate deploy)...');
    try {
      execSync('npx prisma migrate deploy', {
        stdio: 'inherit',
        timeout: 120000, // 2 min — migrations can be slow on cold Postgres
        env: {
          ...process.env,
          // prisma.config.ts is loaded automatically from cwd, but be explicit
          // in case the build runs from an unexpected directory.
          PRISMA_CONFIG_PATH: './prisma.config.ts',
        },
      });
      console.log('✅ Migrations applied successfully');
    } catch (migrateError) {
      console.error('❌ prisma migrate deploy FAILED — aborting build.');
      console.error('   To recover: inspect the SQL above, fix the offending migration,');
      console.error('   or set SKIP_DB_MIGRATIONS=true in Vercel env as a temporary bypass.');
      throw migrateError;
    }
  } else {
    // No direct postgres URL available. Could be: local dev without env,
    // postinstall phase on Vercel (env not yet hydrated), or DATABASE_URL
    // is an Accelerate URL (not valid for migrate deploy — see prisma.config.ts).
    if (isVercel && !isPostInstall) {
      console.error('❌ Cannot run migrations: no direct postgres URL available');
      console.error('   Set DATABASE_URL or POSTGRES_URL to a postgres://... string');
      console.error('   (PRISMA_DATABASE_URL with prisma+postgres:// is runtime-only)');
      process.exit(1);
    }
    console.log('⏭️  Skipping migrations (no direct DATABASE_URL/POSTGRES_URL available)');
    console.log('   To run manually: npm run db:migrate:deploy');
  }

  console.log('✅ Deployment setup completed successfully!');
} catch (error) {
  console.error('❌ Deployment setup failed:', error.message);
  process.exit(1);
}
