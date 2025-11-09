# Password Reset Table Migration Guide

## Overview
This guide explains how to ensure the `password_reset_tokens` table exists in your production database.

## Quick Migration (Recommended)

### Option 1: Run Migration Script Locally (with Production DB)
```bash
# Set your production DATABASE_URL
export DATABASE_URL="your-production-database-url"

# Run migration script
npm run db:migrate-password-reset
```

### Option 2: Run Prisma DB Push
```bash
# Set your production DATABASE_URL
export DATABASE_URL="your-production-database-url"

# Push schema to database
npx prisma db push
```

### Option 3: Via Vercel CLI (if using Vercel)
```bash
# Connect to your Vercel project
vercel link

# Run migration with production environment
vercel env pull .env.production
export $(cat .env.production | xargs)
npx prisma db push
```

## Manual SQL Migration (Alternative)

If you prefer to run SQL directly, use this:

```sql
-- Create password_reset_tokens table
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  token TEXT NOT NULL,
  "expiresAt" TIMESTAMP NOT NULL,
  used BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT password_reset_tokens_userId_fkey FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS password_reset_tokens_userId_idx ON password_reset_tokens("userId");
CREATE INDEX IF NOT EXISTS password_reset_tokens_expiresAt_idx ON password_reset_tokens("expiresAt");
```

## Verification

After migration, verify the table exists:

```bash
# Run the check script
npm run db:migrate-password-reset
```

Or check via API endpoint (requires admin auth):
```
POST /api/admin/migrate-password-reset-table
```

## Troubleshooting

### Error: "Table does not exist"
- Run the migration script: `npm run db:migrate-password-reset`
- Or run: `npx prisma db push`

### Error: "Prisma client missing passwordResetToken"
- Regenerate Prisma client: `npx prisma generate`
- Redeploy your application

### Error: "Database connection failed"
- Verify `DATABASE_URL` is set correctly
- Check database credentials
- Ensure database is accessible from your network

## Production Deployment

The deployment script (`scripts/deploy-setup.js`) will:
1. ✅ Generate Prisma client (includes passwordResetToken model)
2. ⚠️ Attempt database push (may fail in serverless - that's OK)
3. 📋 Provide instructions for manual migration if needed

**After deployment:**
1. Run `npm run db:migrate-password-reset` with production DATABASE_URL
2. Or use the admin API endpoint to check table status
3. Verify password reset functionality works

## Notes

- The table is created automatically when you run `npx prisma db push`
- Prisma client is regenerated during build (`postinstall` script)
- In serverless environments, manual migration may be required
- The migration script is idempotent - safe to run multiple times

