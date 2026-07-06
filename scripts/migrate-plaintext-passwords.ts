/**
 * One-shot: bcrypt-hash any remaining legacy plaintext passwords.
 *
 * Historically the login routes upgraded plaintext passwords lazily on the
 * user's next login, which left dormant accounts in plaintext forever. This
 * migrates every non-bcrypt password now so the legacy comparison code path
 * could be removed from both login routes (web + mobile).
 *
 * Run: npx tsx scripts/migrate-plaintext-passwords.ts
 */
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const databaseUrl = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL
if (!databaseUrl) throw new Error('DATABASE_URL or PRISMA_DATABASE_URL is required')

const prisma = new PrismaClient({ accelerateUrl: databaseUrl, log: ['error'] })

async function main() {
  const users = await prisma.user.findMany({
    where: {
      password: { not: null },
      NOT: { password: { startsWith: '$2' } },
    },
    select: { id: true, email: true },
  })
  console.log(`Users with plaintext passwords: ${users.length}`)

  let migrated = 0
  for (const u of users) {
    const fresh = await prisma.user.findUnique({ where: { id: u.id }, select: { password: true } })
    if (!fresh?.password || fresh.password.startsWith('$2')) continue
    const hashed = await bcrypt.hash(fresh.password, 12)
    await prisma.user.update({ where: { id: u.id }, data: { password: hashed } })
    migrated++
    console.log(`migrated: ${u.email}`)
  }
  console.log(`Done. Migrated ${migrated} passwords to bcrypt.`)

  const remaining = await prisma.user.count({
    where: { password: { not: null }, NOT: { password: { startsWith: '$2' } } },
  })
  console.log(`Remaining plaintext passwords: ${remaining} (must be 0)`)
}

main().finally(() => prisma.$disconnect())
