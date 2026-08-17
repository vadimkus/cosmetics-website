/**
 * Gildaze Gamolod — capitalize / correct name on website + MoySklad.
 *
 *   npx tsx --env-file=.env --env-file=.env.local scripts/fix-gildaze-gamolod-name-20260817.ts
 *   npx tsx --env-file=.env --env-file=.env.local scripts/fix-gildaze-gamolod-name-20260817.ts --commit
 */

import { prisma } from '../lib/prisma'

const COMMIT = process.argv.includes('--commit')
const NAME = 'Gildaze Gamolod'
const EMAIL = 'jamolodgildaze@gmail.com'
const ORDER_NUMBER = 'CODM2608169758'
const AGENT_ID = '962b0b52-99e4-11f1-0a80-069a00ae356a'
const API = 'https://api.moysklad.ru/api/remap/1.2'
const AUTH = 'Basic ' + Buffer.from(`${process.env.MOYSKLAD_LOGIN}:${process.env.MOYSKLAD_PASSWORD}`).toString('base64')

async function api(method: string, pathStr: string, body?: unknown) {
  const res = await fetch(pathStr.startsWith('http') ? pathStr : API + pathStr, {
    method,
    headers: {
      Authorization: AUTH,
      Accept: 'application/json;charset=utf-8',
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const text = await res.text()
  if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 800)}`)
  return text ? JSON.parse(text) : null
}

async function main() {
  const order = await prisma.order.findUnique({
    where: { orderNumber: ORDER_NUMBER },
    select: { id: true, customerName: true, customerEmail: true },
  })
  if (!order || order.customerEmail !== EMAIL) throw new Error('Order mismatch')

  const user = await prisma.user.findUnique({
    where: { email: EMAIL },
    include: { addresses: true },
  })
  if (!user) throw new Error('User not found')

  const agent = await api('GET', `/entity/counterparty/${AGENT_ID}`)
  if (!/gildaze/i.test(agent.name || '')) throw new Error(`Unexpected agent: ${agent.name}`)

  console.log('====================================================================')
  console.log('  Name → Gildaze Gamolod')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log('====================================================================')
  console.log(`  Order name: ${order.customerName}`)
  console.log(`  User name:  ${user.name}`)
  console.log(`  Address:    ${user.addresses.map((a) => a.name).join(', ') || '—'}`)
  console.log(`  MoySklad:   ${agent.name}`)

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  await prisma.order.update({
    where: { id: order.id },
    data: { customerName: NAME },
  })
  await prisma.user.update({
    where: { id: user.id },
    data: { name: NAME },
  })
  for (const address of user.addresses) {
    if (address.name !== NAME) {
      await prisma.address.update({
        where: { id: address.id },
        data: { name: NAME },
      })
    }
  }

  const updated = await api('PUT', `/entity/counterparty/${AGENT_ID}`, {
    meta: agent.meta,
    name: NAME,
  })

  console.log(`\n  Website + MoySklad now: ${updated.name}`)
}

main()
  .catch((e) => {
    console.error('FATAL:', e.message)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
