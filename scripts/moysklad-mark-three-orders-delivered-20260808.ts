/**
 * Mark three fully paid/shipped orders delivered in MoySklad and website DB.
 *
 *   npx tsx scripts/moysklad-mark-three-orders-delivered-20260808.ts
 *   npx tsx scripts/moysklad-mark-three-orders-delivered-20260808.ts --commit
 */

const API = 'https://api.moysklad.ru/api/remap/1.2'
const LOGIN = process.env.MOYSKLAD_LOGIN
const PASSWORD = process.env.MOYSKLAD_PASSWORD
const COMMIT = process.argv.includes('--commit')

if (!LOGIN || !PASSWORD) throw new Error('MoySklad credentials required')

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const DELIVERED_STATE_ID = 'e1a0ae5f-33c5-11ea-0a80-043f000b275e'

const ORDERS = [
  {
    name: 'GENCardM2608086652',
    customer: 'Nur U',
    moyskladId: 'bf187050-933c-11f1-0a80-0eea0043fcf5',
    expectedMinor: 63500,
  },
  {
    name: 'GENCardM2608083639',
    customer: 'Alesya Sokolenko',
    moyskladId: 'b417c42d-9338-11f1-0a80-0eea00432c1f',
    expectedMinor: 51500,
  },
  {
    name: 'CODW2608085950',
    customer: 'Meryem Malak Lezzar',
    moyskladId: 'b84e2e32-9334-11f1-0a80-09e200446e80',
    expectedMinor: 65000,
  },
]

async function api(method: string, path: string, body?: unknown) {
  const response = await fetch(API + path, {
    method,
    headers: {
      Authorization: AUTH,
      Accept: 'application/json;charset=utf-8',
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const text = await response.text()
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} ${method} ${path}: ${text.slice(0, 1000)}`)
  }
  return text ? JSON.parse(text) : null
}

function money(minor: number) {
  return (minor / 100).toFixed(2)
}

async function main() {
  const { prisma } = await import('../lib/prisma')
  const { awardClinicPointsForOrder } = await import('../lib/homecare')
  const { awardPointsForDeliveredOrder } = await import('../lib/loyalty')
  try {
    console.log(`Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
    for (const cfg of ORDERS) {
      const msOrder = await api(
        'GET',
        `/entity/customerorder/${cfg.moyskladId}?expand=state,agent`
      )
      const webOrder = await prisma.order.findFirst({
        where: { moySkladOrderId: cfg.moyskladId },
        select: {
          id: true,
          orderNumber: true,
          status: true,
          paymentStatus: true,
          deliveredAt: true,
        },
      })

      if (msOrder.name !== cfg.name) {
        throw new Error(`${cfg.customer}: expected ${cfg.name}, got ${msOrder.name}`)
      }
      if (msOrder.sum !== cfg.expectedMinor) {
        throw new Error(
          `${cfg.name}: expected ${money(cfg.expectedMinor)}, got ${money(msOrder.sum)}`
        )
      }
      if ((msOrder.payedSum || 0) !== msOrder.sum) {
        throw new Error(`${cfg.name}: not fully paid`)
      }
      if ((msOrder.shippedSum || 0) !== msOrder.sum) {
        throw new Error(`${cfg.name}: not fully shipped`)
      }
      if (!webOrder) throw new Error(`${cfg.name}: linked website order not found`)

      console.log(
        `${cfg.name} | ${cfg.customer} | ${money(msOrder.sum)} AED | ` +
          `MS=${msOrder.state?.name} | web=${webOrder.status}/${webOrder.paymentStatus}`
      )

      if (!COMMIT) continue

      await api('PUT', `/entity/customerorder/${cfg.moyskladId}`, {
        state: {
          meta: {
            href: `${API}/entity/customerorder/metadata/states/${DELIVERED_STATE_ID}`,
            type: 'state',
            mediaType: 'application/json',
          },
        },
      })

      const now = new Date()
      await prisma.order.update({
        where: { id: webOrder.id },
        data: {
          status: 'DELIVERED',
          paymentStatus: 'paid',
          ...(webOrder.deliveredAt ? {} : { deliveredAt: now }),
        },
      })

      const clinic = await awardClinicPointsForOrder(webOrder.id)
      const loyalty = await awardPointsForDeliveredOrder(webOrder.id)

      const final = await api(
        'GET',
        `/entity/customerorder/${cfg.moyskladId}?expand=state`
      )
      console.log(
        `  ✓ MS=${final.state?.name} | web=DELIVERED/paid | ` +
          `clinicPoints=${clinic?.awarded ? clinic.points : 0} | ` +
          `loyalty=${loyalty?.awarded ? loyalty.points : 0}`
      )
    }
    if (!COMMIT) console.log('Dry run passed — rerun with --commit')
  } finally {
    await prisma.$disconnect()
  }
}

main().catch((error) => {
  console.error('FATAL:', error.message)
  process.exit(1)
})
