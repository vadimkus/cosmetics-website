import { prisma } from '@/lib/prisma'

// GENCardM2609255120 (Zhibek Rakhimbekova): the customer typed her building
// into Order notes and left the profile default "Dubai, Dubai" in the address.
// Correct the website order and the MoySklad SO -> INV -> SHIP addresses.
//   npx tsx --env-file=.env --env-file=.env.local scripts/fix-zhibek-address-20260925.ts [--apply]
const ORDER = 'GENCardM2609255120'
const STREET = 'Torino by oro 24, 2 block, 212'
const apply = process.argv.includes('--apply')
const BASE = 'https://api.moysklad.ru/api/remap/1.2'
const H = {
  Authorization: 'Basic ' + Buffer.from(`${process.env.MOYSKLAD_LOGIN?.trim()}:${process.env.MOYSKLAD_PASSWORD?.trim()}`).toString('base64'),
  'Content-Type': 'application/json',
  'Accept-Encoding': 'gzip',
}
const ms = async (path: string, init?: RequestInit) => {
  const r = await fetch(path.startsWith('http') ? path : BASE + path, { ...init, headers: H })
  const j = await r.json(); if (!r.ok) throw new Error(`${r.status} ${JSON.stringify(j).slice(0, 300)}`); return j
}

async function main() {
  const order = await prisma.order.findFirstOrThrow({ where: { orderNumber: ORDER }, select: { id: true, customerAddress: true, moySkladOrderId: true } })
  const so = await ms(`/entity/customerorder/${order.moySkladOrderId}?expand=invoicesOut`)
  const invoices = (so.invoicesOut || []) as Array<{ meta: { href: string } }>
  const demands: string[] = []
  for (const inv of invoices) {
    const full = await ms(inv.meta.href + '?expand=demands')
    for (const d of full.demands || []) demands.push(d.meta.href)
  }
  const addr = { ...so.shipmentAddressFull, street: STREET, addInfo: '' }
  console.log(`${ORDER}\n  website address: ${order.customerAddress}\n  MoySklad SO ${so.name}: ${JSON.stringify(so.shipmentAddressFull?.street ?? null)} -> ${STREET}`)
  console.log(`  invoices ${invoices.length}, shipments ${demands.length}`)
  if (!apply) return console.log('dry run. Re-run with --apply')
  await ms(`/entity/customerorder/${so.id}`, { method: 'PUT', body: JSON.stringify({ shipmentAddressFull: addr }) })
  for (const inv of invoices) await ms(inv.meta.href, { method: 'PUT', body: JSON.stringify({ shipmentAddressFull: addr }) })
  for (const d of demands) await ms(d, { method: 'PUT', body: JSON.stringify({ shipmentAddressFull: addr }) })
  await prisma.order.update({ where: { id: order.id }, data: { customerAddress: `${STREET}, Dubai, United Arab Emirates` } })
  console.log('updated')
}

main().catch((e) => { console.error(e); process.exitCode = 1 }).finally(() => prisma.$disconnect())
