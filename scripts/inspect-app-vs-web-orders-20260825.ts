/**
 * Monthly app vs website order counts from 1 Feb 2026 (Asia/Dubai).
 * Channel: lib/orderChannel.ts (CODM/GENCardM/PARTM = app, …W + legacy GEN = web).
 */
import { prisma } from '../lib/prisma'
import { resolveOrderChannel } from '../lib/orderChannel'

const TZ = 'Asia/Dubai'
const FROM = new Date('2026-01-31T20:00:00.000Z') // 1 Feb 2026 00:00 GST

function monthKey(d: Date): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: TZ,
    year: 'numeric',
    month: '2-digit',
  }).format(d)
}

function monthLabel(key: string): string {
  const [y, m] = key.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleString('en-US', {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

const VOID = new Set(['CANCELLED', 'DELETED', 'cancelled', 'deleted'])

function prefix(n: string): string {
  if (/^CODM/i.test(n)) return 'CODM'
  if (/^CODW/i.test(n)) return 'CODW'
  if (/^GENCardM/i.test(n)) return 'GENCardM'
  if (/^GENCardW/i.test(n)) return 'GENCardW'
  if (/^PARTM/i.test(n)) return 'PARTM'
  if (/^PARTW/i.test(n)) return 'PARTW'
  if (/^GEN\d/i.test(n)) return 'GEN-legacy'
  return 'other'
}

async function main() {
  const orders = await prisma.order.findMany({
    where: { createdAt: { gte: FROM } },
    select: {
      orderNumber: true,
      paymentMetadata: true,
      createdAt: true,
      status: true,
      paymentStatus: true,
      paymentMethod: true,
      total: true,
    },
    orderBy: { createdAt: 'asc' },
  })

  type Bucket = {
    app: number
    web: number
    appRev: number
    webRev: number
    appVoid: number
    webVoid: number
    byStatus: Record<string, { app: number; web: number }>
    byPrefix: Record<string, number>
  }

  const months = new Map<string, Bucket>()
  const ensure = (k: string): Bucket => {
    let b = months.get(k)
    if (!b) {
      b = { app: 0, web: 0, appRev: 0, webRev: 0, appVoid: 0, webVoid: 0, byStatus: {}, byPrefix: {} }
      months.set(k, b)
    }
    return b
  }

  let appAll = 0
  let webAll = 0
  let appDone = 0
  let webDone = 0
  let appRev = 0
  let webRev = 0
  const statusAll: Record<string, { app: number; web: number }> = {}
  const prefixAll: Record<string, { app: number; web: number }> = {}
  const otherNums: string[] = []

  for (const o of orders) {
    const ch = resolveOrderChannel(o)
    const mk = monthKey(o.createdAt)
    const b = ensure(mk)
    const p = prefix(o.orderNumber)
    const voided = VOID.has(o.status)
    b.byPrefix[p] = (b.byPrefix[p] || 0) + 1
    if (!statusAll[o.status]) statusAll[o.status] = { app: 0, web: 0 }
    if (!prefixAll[p]) prefixAll[p] = { app: 0, web: 0 }
    if (!b.byStatus[o.status]) b.byStatus[o.status] = { app: 0, web: 0 }

    if (ch === 'app') {
      appAll += 1
      b.app += 1
      statusAll[o.status].app += 1
      prefixAll[p].app += 1
      b.byStatus[o.status].app += 1
      if (voided) b.appVoid += 1
      else {
        appDone += 1
        appRev += o.total
        b.appRev += o.total
      }
    } else {
      webAll += 1
      b.web += 1
      statusAll[o.status].web += 1
      prefixAll[p].web += 1
      b.byStatus[o.status].web += 1
      if (voided) b.webVoid += 1
      else {
        webDone += 1
        webRev += o.total
        b.webRev += o.total
      }
    }
    if (p === 'other') otherNums.push(o.orderNumber)
  }

  const rows = [...months.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([k, b]) => ({
    month: monthLabel(k),
    key: k,
    app: b.app,
    web: b.web,
    total: b.app + b.web,
    appDone: b.app - b.appVoid,
    webDone: b.web - b.webVoid,
    appVoid: b.appVoid,
    webVoid: b.webVoid,
    appRev: Math.round(b.appRev * 100) / 100,
    webRev: Math.round(b.webRev * 100) / 100,
    byStatus: b.byStatus,
    byPrefix: b.byPrefix,
  }))

  console.log(
    JSON.stringify(
      {
        range: '2026-02-01 → now',
        timezone: TZ,
        queriedAt: new Date().toISOString(),
        totalRows: orders.length,
        placedExCancelled: { app: appDone, web: webDone, total: appDone + webDone },
        allIncludingCancelled: { app: appAll, web: webAll, total: appAll + webAll },
        revenueExCancelledAed: {
          app: Math.round(appRev * 100) / 100,
          web: Math.round(webRev * 100) / 100,
          total: Math.round((appRev + webRev) * 100) / 100,
        },
        status: statusAll,
        prefix: prefixAll,
        otherNumbers: otherNums,
        months: rows,
      },
      null,
      2
    )
  )
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
