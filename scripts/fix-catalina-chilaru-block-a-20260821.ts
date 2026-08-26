/**
 * Catalina Chilaru — insert Block A into the Belgravia 1 address.
 *
 *   npx tsx --env-file=.env --env-file=.env.local scripts/fix-catalina-chilaru-block-a-20260821.ts
 *   npx tsx --env-file=.env --env-file=.env.local scripts/fix-catalina-chilaru-block-a-20260821.ts --commit
 */

import { prisma } from '../lib/prisma'

const COMMIT = process.argv.includes('--commit')
const API = 'https://api.moysklad.ru/api/remap/1.2'
const LOGIN = process.env.MOYSKLAD_LOGIN
const PASSWORD = process.env.MOYSKLAD_PASSWORD

if (!LOGIN || !PASSWORD) {
  throw new Error('set MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD')
}

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COUNTRY_UAE_ID = '8afef359-33c6-11ea-0a80-0043000aceae'

const EMAIL = 'catalina_chilaru@yahoo.com'
const PHONE = '+971521878908'
const ORDER_NUMBER = 'CODW2608206963'
const AGENT_ID = 'cd1c2df9-681e-11f1-0a80-1efd0088b1a2'
const ORDER_ID = '15f00bd1-9cb8-11f1-0a80-1a6200370afd'
const INVOICE_ID = '16519f99-9cb8-11f1-0a80-084e003640ec'
const DEMAND_ID = '16db60cc-9cb8-11f1-0a80-15b70036c0ba'

const OLD_WEB = 'JVC, Belgravia 1, ap.320, Dubai, UAE'
const NEW_WEB = 'JVC, Belgravia 1, Block A, ap.320, Dubai, UAE'
const STREET = 'JVC, Belgravia 1, Block A, ap.320'
const CITY = 'Dubai'

async function api(method: string, pathStr: string, body?: unknown, attempt = 1): Promise<any> {
  const url = pathStr.startsWith('http') ? pathStr : API + pathStr
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: AUTH,
      Accept: 'application/json;charset=utf-8',
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const text = await res.text()
  if ((res.status === 429 || res.status >= 500) && attempt < 8) {
    await new Promise((r) => setTimeout(r, 800 * attempt))
    return api(method, pathStr, body, attempt + 1)
  }
  if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 1200)}`)
  return text ? JSON.parse(text) : null
}

function href(type: string, id: string) {
  return { meta: { href: `${API}/entity/${type}/${id}`, type, mediaType: 'application/json' } }
}

function shipmentAddress() {
  return {
    country: href('country', COUNTRY_UAE_ID),
    city: CITY,
    street: STREET,
    addInfo: '',
  }
}

async function main() {
  console.log('====================================================================')
  console.log('  Catalina Chilaru — add Block A')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const [order, user, agent] = await Promise.all([
    prisma.order.findUnique({
      where: { orderNumber: ORDER_NUMBER },
      select: {
        id: true,
        orderNumber: true,
        customerName: true,
        customerEmail: true,
        customerPhone: true,
        customerAddress: true,
      },
    }),
    prisma.user.findUnique({
      where: { email: EMAIL },
      select: { id: true, name: true, phone: true, address: true },
    }),
    api('GET', `/entity/counterparty/${AGENT_ID}`),
  ])

  if (!order) throw new Error(`Website order not found: ${ORDER_NUMBER}`)
  if (order.customerEmail !== EMAIL) throw new Error(`Email mismatch: ${order.customerEmail}`)
  if (order.customerPhone !== PHONE) throw new Error(`Phone mismatch: ${order.customerPhone}`)
  if (order.customerName !== 'Catalina Chilaru') throw new Error(`Name mismatch: ${order.customerName}`)
  if (order.customerAddress !== OLD_WEB) {
    throw new Error(`Unexpected order address: ${order.customerAddress}`)
  }
  if (!user) throw new Error(`User not found: ${EMAIL}`)
  if (user.address !== OLD_WEB) throw new Error(`Unexpected user address: ${user.address}`)
  if (agent.name !== 'Catalina Chilaru') throw new Error(`Unexpected MS agent: ${agent.name}`)

  console.log(`  Order: ${order.orderNumber}`)
  console.log(`  Was:   ${OLD_WEB}`)
  console.log(`  Now:   ${NEW_WEB}`)
  console.log(`  MS ship street: ${STREET}`)

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  await prisma.order.update({
    where: { id: order.id },
    data: { customerAddress: NEW_WEB },
  })
  await prisma.user.update({
    where: { id: user.id },
    data: { address: NEW_WEB },
  })

  const ship = shipmentAddress()
  await api('PUT', `/entity/counterparty/${AGENT_ID}`, {
    meta: agent.meta,
    actualAddress: NEW_WEB,
    actualAddressFull: ship,
  })

  const so = await api('GET', `/entity/customerorder/${ORDER_ID}`)
  const inv = await api('GET', `/entity/invoiceout/${INVOICE_ID}`)
  const dem = await api('GET', `/entity/demand/${DEMAND_ID}`)
  if (so.name !== ORDER_NUMBER) throw new Error(`Unexpected SO ${so.name}`)
  if (inv.name !== '04958') throw new Error(`Unexpected invoice ${inv.name}`)
  if (dem.name !== '06720') throw new Error(`Unexpected demand ${dem.name}`)

  await api('PUT', `/entity/customerorder/${ORDER_ID}`, { meta: so.meta, shipmentAddressFull: ship })
  await api('PUT', `/entity/invoiceout/${INVOICE_ID}`, { meta: inv.meta, shipmentAddressFull: ship })
  await api('PUT', `/entity/demand/${DEMAND_ID}`, { meta: dem.meta, shipmentAddressFull: ship })

  const [orderAfter, userAfter, soAfter] = await Promise.all([
    prisma.order.findUnique({ where: { id: order.id }, select: { customerAddress: true } }),
    prisma.user.findUnique({ where: { id: user.id }, select: { address: true } }),
    api('GET', `/entity/customerorder/${ORDER_ID}`),
  ])
  if (orderAfter?.customerAddress !== NEW_WEB) throw new Error('Website order address not saved')
  if (userAfter?.address !== NEW_WEB) throw new Error('User address not saved')

  console.log(`  Website order + user updated`)
  console.log(`  MS ship: ${soAfter.shipmentAddress}`)
}

main()
  .catch((e) => {
    console.error('FATAL:', e.message)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
