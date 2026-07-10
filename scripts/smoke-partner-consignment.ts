/**
 * Smoke test (local dev): partner order paymentOption gating.
 *   npx tsx --env-file=.env.local scripts/smoke-partner-consignment.ts
 * No orders are created: negative paths only (401/403/400).
 */
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import { createSessionToken } from '../lib/jwt'

const dbUrl = String(process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL || '')
const prisma = dbUrl.startsWith('prisma+')
  ? new PrismaClient({ accelerateUrl: dbUrl } as ConstructorParameters<typeof PrismaClient>[0])
  : new PrismaClient({ adapter: new PrismaPg(new Pool({ connectionString: dbUrl })) })
const BASE = 'http://localhost:3000'

async function getCsrf(): Promise<{ token: string; cookie: string }> {
  const res = await fetch(`${BASE}/api/csrf-token`)
  const setCookie = res.headers.get('set-cookie') || ''
  const m = setCookie.match(/csrf-token=([^;]+)/)
  const data = await res.json().catch(() => ({}))
  const token = data?.csrfToken || data?.token || (m ? decodeURIComponent(m[1]) : '')
  return { token, cookie: m ? `csrf-token=${m[1]}` : '' }
}

async function post(session: string | null, csrf: { token: string; cookie: string }, body: object) {
  const cookies = [csrf.cookie, session ? `genosys_session=${session}` : ''].filter(Boolean).join('; ')
  const res = await fetch(`${BASE}/api/partners/order`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrf.token,
      Cookie: cookies,
    },
    body: JSON.stringify(body),
  })
  const data = await res.json().catch(() => ({}))
  return { status: res.status, data }
}

async function tokenFor(email: string): Promise<string> {
  const u = await prisma.user.findFirst({ where: { email: { equals: email, mode: 'insensitive' } } })
  if (!u) throw new Error(`user not found: ${email}`)
  return createSessionToken({
    id: u.id, email: u.email, name: u.name,
    isAdmin: u.isAdmin, canSeePrices: u.canSeePrices,
    tokenVersion: (u as { tokenVersion?: number }).tokenVersion ?? 0,
  })
}

async function main() {
  const csrf = await getCsrf()
  if (!csrf.token) throw new Error('no csrf token')

  const item = [{ id: '10', quantity: 1 }]

  // 1) No session → 401
  const r1 = await post(null, csrf, { items: item, paymentOption: 'cod' })
  console.log(`[1] unauth cod            → ${r1.status} ${JSON.stringify(r1.data).slice(0, 90)} ${r1.status === 401 ? 'PASS' : 'FAIL'}`)

  // 2) Partner WITHOUT consignment picks consignment → 403
  const tNo = await tokenFor('f.this.that@gmail.com') // CLINIC, consignmentActive=false
  const r2 = await post(tNo, csrf, { items: item, paymentOption: 'consignment' })
  console.log(`[2] no-agreement consign  → ${r2.status} ${JSON.stringify(r2.data).slice(0, 90)} ${r2.status === 403 ? 'PASS' : 'FAIL'}`)

  // 3) Partner WITH consignment + empty items → 400 (gating passed)
  const tYes = await tokenFor('klimenko.viktoria12@icloud.com') // consignmentActive=true
  const r3 = await post(tYes, csrf, { items: [], paymentOption: 'consignment' })
  console.log(`[3] agreement, no items   → ${r3.status} ${JSON.stringify(r3.data).slice(0, 90)} ${r3.status === 400 ? 'PASS' : 'FAIL'}`)

  // 4) Non-partner account → 403 (use any non-CLINIC/VIP user)
  const plain = await prisma.user.findFirst({ where: { discountType: null, isAdmin: false }, orderBy: { createdAt: 'desc' } })
  if (plain) {
    const tPlain = createSessionToken({
      id: plain.id, email: plain.email, name: plain.name,
      isAdmin: plain.isAdmin, canSeePrices: plain.canSeePrices,
      tokenVersion: (plain as { tokenVersion?: number }).tokenVersion ?? 0,
    })
    const r4 = await post(tPlain, csrf, { items: item, paymentOption: 'cod' })
    console.log(`[4] non-partner           → ${r4.status} ${JSON.stringify(r4.data).slice(0, 90)} ${r4.status === 403 ? 'PASS' : 'FAIL'}`)
  }

  // 5) Flag check straight from DB
  const flags = await prisma.user.findMany({
    where: { consignmentActive: true },
    select: { email: true, moyskladContractId: true },
  })
  console.log(`[5] consignmentActive users in DB: ${flags.length}`)
  for (const f of flags) console.log(`    ${f.email} contract=${f.moyskladContractId}`)
}

main()
  .catch((e) => { console.error(e); process.exitCode = 1 })
  .finally(() => prisma.$disconnect())
