/**
 * One-shot: add users.tokenVersion for session/token revocation.
 * Idempotent (IF NOT EXISTS). Run: npx tsx scripts/add-token-version-column.ts
 */
import { PrismaClient } from '@prisma/client'

const databaseUrl = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL
if (!databaseUrl) throw new Error('DATABASE_URL or PRISMA_DATABASE_URL is required')

const prisma = new PrismaClient({ accelerateUrl: databaseUrl, log: ['error'] })

async function main() {
  await prisma.$executeRawUnsafe(
    'ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "tokenVersion" INTEGER NOT NULL DEFAULT 0'
  )
  const sample = await prisma.$queryRawUnsafe(
    'SELECT COUNT(*)::int AS total, COUNT(*) FILTER (WHERE "tokenVersion" = 0)::int AS at_zero FROM "users"'
  )
  console.log('tokenVersion column ready:', JSON.stringify(sample))
}

main().finally(() => prisma.$disconnect())
