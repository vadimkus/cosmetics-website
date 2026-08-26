/**
 * Correct CODM2608193118 back to Hind Lougay's original email-confirmed order:
 * four Power Solution kits plus two FOC promo masks, AED 2,320 COD.
 *
 * This reverses the mistaken collagen-only / AED 18 paid state in MoySklad and
 * on the website. It does not send another customer email.
 *
 * Dry run:
 *   npx tsx --env-file=.env --env-file=.env.local scripts/restore-hind-codm3118-original-items-20260820.ts
 * Commit:
 *   npx tsx --env-file=.env --env-file=.env.local scripts/restore-hind-codm3118-original-items-20260820.ts --commit
 */
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { canonicalOrderItemImage } from '../lib/orderItemImage'
import { prisma } from '../lib/prisma'

const API = 'https://api.moysklad.ru/api/remap/1.2'
const COMMIT = process.argv.includes('--commit')

const EMAIL = 'hlougay@gmail.com'
const PHONE = '+971507086962'
const ORDER_NUMBER = 'CODM2608193118'
const ORDER_ID = '45ceef4f-9c02-11f1-0a80-00600002b283'
const INVOICE_NUMBER = '04950'
const INVOICE_ID = '46274c4f-9c02-11f1-0a80-084e0001f70f'
const DEMAND_NUMBER = '06716'
const DEMAND_ID = 'f85320ad-9c83-11f1-0a80-06a90022155b'
const WRONG_PAYMENT_NUMBER = '06101'
const WRONG_PAYMENT_ID = 'f8a1f278-9c83-11f1-0a80-00600023e456'
const CUSTOMER_ID = '45a12fb9-9c02-11f1-0a80-1f9d00026ae6'
const ORDER_COD_WAIT_STATE_ID = 'e1a0adae-33c5-11ea-0a80-043f000b275c'
const RETAIL_INVOICE_TEMPLATE_ID = 'b2cde0a1-ec18-4ea5-ac56-813a26308f10'
const TOTAL_AED = 2320
const VAT_AED = 110.48
const ORIGINAL_WEBSITE_DATE = new Date('2026-08-19T22:45:53+04:00')

const MS_LINES = [
  { code: '00020', id: 'e0ff2439-3448-11ea-0a80-044a00018f60', qty: 10, unitMinor: 5800, discount: 0 },
  { code: '00071', id: '4ba9c825-45d6-11ea-0a80-067800168f95', qty: 10, unitMinor: 5800, discount: 0 },
  { code: '00065', id: '8a43a8e9-45d4-11ea-0a80-048a00166b96', qty: 10, unitMinor: 5800, discount: 0 },
  { code: '00067', id: 'febec033-45d4-11ea-0a80-00ab0015bfa1', qty: 10, unitMinor: 5800, discount: 0 },
  { code: '00063', id: '51e74608-45cb-11ea-0a80-01f80015bea2', qty: 1, unitMinor: 3600, discount: 100 },
  { code: '00140', id: '9d634465-2690-11ec-0a80-0767000c229e', qty: 1, unitMinor: 3600, discount: 100 },
] as const

const WEB_LINES = [
  { productId: '8', qty: 1, price: 580, size: null },
  { productId: '4', qty: 1, price: 580, size: null },
  { productId: '7', qty: 1, price: 580, size: null },
  { productId: '5', qty: 1, price: 580, size: null },
  { productId: 'cmgj9ifoi00008o07p4eqmfb7', qty: 1, price: 0, size: '_PROMO_' },
  { productId: '36', qty: 1, price: 0, size: '_PROMO_' },
] as const

type MsDoc = {
  id: string
  name: string
  sum?: number
  payedSum?: number
  description?: string
  state?: { name?: string; meta?: { href?: string } }
  agent?: { id?: string }
  demands?: Array<{ meta?: { href?: string } }>
}

type MsPosition = {
  id: string
  quantity: number
  price: number
  discount?: number
  assortment?: { code?: string; id?: string; meta?: { type?: string } }
}

function auth(): string {
  const login = process.env.MOYSKLAD_LOGIN
  const password = process.env.MOYSKLAD_PASSWORD
  if (!login || !password) throw new Error('MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD are required.')
  return `Basic ${Buffer.from(`${login}:${password}`).toString('base64')}`
}

async function ms<T>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  route: string,
  body?: unknown,
  attempt = 1,
): Promise<T> {
  const response = await fetch(`${API}${route}`, {
    method,
    headers: {
      Authorization: auth(),
      Accept: 'application/json;charset=utf-8',
      'Content-Type': 'application/json',
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  const text = await response.text()
  if ((response.status === 429 || response.status >= 500) && attempt < 8) {
    await new Promise((resolve) => setTimeout(resolve, 800 * attempt))
    return ms(method, route, body, attempt + 1)
  }
  if (!response.ok) throw new Error(`MoySklad ${method} ${route}: HTTP ${response.status} ${text.slice(0, 700)}`)
  return (text ? JSON.parse(text) : null) as T
}

async function allPositions(type: string, id: string): Promise<MsPosition[]> {
  const result = await ms<{ rows: MsPosition[] }>(
    'GET',
    `/entity/${type}/${id}/positions?expand=assortment&limit=1000`,
  )
  return result.rows
}

function msProduct(id: string) {
  return {
    meta: {
      href: `${API}/entity/product/${id}`,
      type: 'product',
      mediaType: 'application/json',
    },
  }
}

function msState(id: string) {
  return {
    meta: {
      href: `${API}/entity/customerorder/metadata/states/${id}`,
      type: 'state',
      mediaType: 'application/json',
    },
  }
}

function desiredMsPayload() {
  return MS_LINES.map((line) => ({
    quantity: line.qty,
    price: line.unitMinor,
    discount: line.discount,
    assortment: msProduct(line.id),
    vat: 5,
    vatEnabled: true,
  }))
}

function positionsMatch(rows: MsPosition[]): boolean {
  if (rows.length !== MS_LINES.length) return false
  return MS_LINES.every((line) => {
    const row = rows.find((candidate) => candidate.assortment?.code === line.code)
    return (
      row?.assortment?.id === line.id &&
      row.quantity === line.qty &&
      row.price === line.unitMinor &&
      Number(row.discount || 0) === line.discount
    )
  })
}

async function replacePositions(type: string, id: string) {
  const current = await allPositions(type, id)
  if (positionsMatch(current)) {
    console.log(`  ${type}: positions already correct`)
    return
  }
  for (const position of current) {
    await ms('DELETE', `/entity/${type}/${id}/positions/${position.id}`)
  }
  await ms('POST', `/entity/${type}/${id}/positions`, desiredMsPayload())
  const check = await allPositions(type, id)
  if (!positionsMatch(check)) throw new Error(`${type} position verification failed.`)
  console.log(`  ${type}: restored six original lines`)
}

async function paymentExists(): Promise<boolean> {
  try {
    const payment = await ms<MsDoc>('GET', `/entity/paymentin/${WRONG_PAYMENT_ID}`)
    return payment.name === WRONG_PAYMENT_NUMBER
  } catch (error) {
    if (String(error).includes('HTTP 404')) return false
    throw error
  }
}

async function exportInvoicePdf(): Promise<string> {
  const response = await fetch(`${API}/entity/invoiceout/${INVOICE_ID}/export`, {
    method: 'POST',
    headers: {
      Authorization: auth(),
      Accept: '*/*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      template: {
        meta: {
          href: `${API}/entity/invoiceout/metadata/customtemplate/${RETAIL_INVOICE_TEMPLATE_ID}`,
          type: 'customtemplate',
          mediaType: 'application/json',
        },
      },
      extension: 'pdf',
    }),
    redirect: 'manual',
  })
  if (response.status !== 302 && response.status !== 303) {
    throw new Error(`Invoice export failed: HTTP ${response.status} ${(await response.text()).slice(0, 500)}`)
  }
  const location = response.headers.get('location')
  if (!location) throw new Error('Invoice export did not return a download URL.')
  const pdfResponse = await fetch(location)
  if (!pdfResponse.ok) throw new Error(`Invoice PDF download failed: HTTP ${pdfResponse.status}`)
  const outputDir = path.join(os.homedir(), 'Desktop', 'orders')
  const output = path.join(outputDir, 'GENOSYS_Hind_Lougay_04950.pdf')
  fs.mkdirSync(outputDir, { recursive: true })
  fs.writeFileSync(output, Buffer.from(await pdfResponse.arrayBuffer()))
  return output
}

async function loadPlan() {
  const [order, invoice, demand, wrongPayment, customer, webOrder, user, products] = await Promise.all([
    ms<MsDoc>('GET', `/entity/customerorder/${ORDER_ID}?expand=state,agent`),
    ms<MsDoc>('GET', `/entity/invoiceout/${INVOICE_ID}?expand=state,agent,demands`),
    ms<MsDoc>('GET', `/entity/demand/${DEMAND_ID}?expand=state,agent,invoicesOut`),
    paymentExists(),
    ms<MsDoc>('GET', `/entity/counterparty/${CUSTOMER_ID}`),
    prisma.order.findUnique({ where: { orderNumber: ORDER_NUMBER }, include: { items: true } }),
    prisma.user.findUnique({ where: { email: EMAIL }, include: { addresses: true } }),
    prisma.product.findMany({
      where: { id: { in: WEB_LINES.map((line) => line.productId) } },
      select: { id: true, productNumber: true, name: true, image: true },
    }),
  ])
  if (order.name !== ORDER_NUMBER || invoice.name !== INVOICE_NUMBER || demand.name !== DEMAND_NUMBER) {
    throw new Error('MoySklad document identity mismatch.')
  }
  if (order.agent?.id !== CUSTOMER_ID || customer.name !== 'Hind Lougay') {
    throw new Error('MoySklad customer mismatch.')
  }
  if (!webOrder || webOrder.customerEmail !== EMAIL) throw new Error('Website order mirror is missing or belongs to another user.')
  if (!user || user.name !== 'Hind Lougay') throw new Error('Website user mismatch.')
  if (products.length !== WEB_LINES.length) {
    throw new Error(`Expected ${WEB_LINES.length} website products; found ${products.length}.`)
  }
  const demandLinks = invoice.demands || []
  if (!demandLinks.some((item) => item.meta?.href?.endsWith(`/${DEMAND_ID}`))) {
    throw new Error(`Invoice ${INVOICE_NUMBER} is not linked to shipment ${DEMAND_NUMBER}.`)
  }
  return { order, invoice, demand, wrongPayment, customer, webOrder, user, products }
}

async function restoreWebsite(plan: Awaited<ReturnType<typeof loadPlan>>) {
  const byId = new Map(plan.products.map((product) => [product.id, product]))
  await prisma.$transaction(async (tx) => {
    await tx.loyaltyTransaction.deleteMany({
      where: { orderId: plan.webOrder.id, type: 'ORDER_EARN' },
    })
    await tx.orderItem.deleteMany({ where: { orderId: plan.webOrder.id } })
    await tx.order.update({
      where: { id: plan.webOrder.id },
      data: {
        customerPhone: PHONE,
        subtotal: TOTAL_AED,
        discountPercentage: 0,
        discountAmount: 0,
        bundleDiscountPercentage: null,
        bundleDiscountAmount: 0,
        shipping: 0,
        vat: VAT_AED,
        total: TOTAL_AED,
        status: 'PENDING',
        paymentMethod: 'cod',
        paymentStatus: 'pending',
        paidAt: null,
        deliveredAt: null,
        reviewRequestSentAt: null,
        createdAt: ORIGINAL_WEBSITE_DATE,
        moySkladOrderId: ORDER_ID,
        moySkladSyncedAt: new Date(),
        orderNotes:
          `Original email-confirmed COD order restored on 2026-08-20. SO ${ORDER_NUMBER}, ` +
          `invoice ${INVOICE_NUMBER}, shipment ${DEMAND_NUMBER}. Cash due on delivery.`,
        paymentMetadata: JSON.stringify({
          source: 'restored_original_cod_order',
          correctedPhone: PHONE,
          moySkladCustomerId: CUSTOMER_ID,
          moySkladOrderId: ORDER_ID,
          moySkladInvoice: INVOICE_NUMBER,
          moySkladDemand: DEMAND_NUMBER,
          removedIncorrectPaymentin: WRONG_PAYMENT_NUMBER,
          restoredAt: new Date().toISOString(),
        }),
        items: {
          create: WEB_LINES.map((line) => {
            const product = byId.get(line.productId)
            if (!product) throw new Error(`Missing website product ${line.productId}.`)
            return {
              productId: product.id,
              productName: product.name,
              price: line.price,
              quantity: line.qty,
              size: line.size,
              image: canonicalOrderItemImage(product),
            }
          }),
        },
      },
    })

    const [delivered, ledger] = await Promise.all([
      tx.order.aggregate({
        where: { customerEmail: EMAIL, status: 'DELIVERED' },
        _sum: { total: true },
        _count: true,
      }),
      tx.loyaltyTransaction.aggregate({
        where: { userId: plan.user.id },
        _sum: { points: true },
      }),
    ])
    await tx.user.update({
      where: { id: plan.user.id },
      data: {
        phone: PHONE,
        totalSpent: delivered._sum.total || 0,
        totalOrders: delivered._count,
        loyaltyPoints: ledger._sum.points || 0,
      },
    })
    await tx.address.updateMany({
      where: { userId: plan.user.id },
      data: { phone: PHONE },
    })
  })
}

async function verify() {
  const [order, invoice, demand, customer, webOrder, user, loyalty] = await Promise.all([
    ms<MsDoc>('GET', `/entity/customerorder/${ORDER_ID}?expand=state`),
    ms<MsDoc>('GET', `/entity/invoiceout/${INVOICE_ID}`),
    ms<MsDoc>('GET', `/entity/demand/${DEMAND_ID}`),
    ms<MsDoc>('GET', `/entity/counterparty/${CUSTOMER_ID}`),
    prisma.order.findUnique({ where: { orderNumber: ORDER_NUMBER }, include: { items: true } }),
    prisma.user.findUnique({ where: { email: EMAIL }, include: { addresses: true } }),
    prisma.loyaltyTransaction.findMany({ where: { orderId: planOrderId }, select: { id: true } }),
  ])
  for (const [type, id, doc] of [
    ['customerorder', ORDER_ID, order],
    ['invoiceout', INVOICE_ID, invoice],
    ['demand', DEMAND_ID, demand],
  ] as const) {
    if (doc.sum !== TOTAL_AED * 100 || !positionsMatch(await allPositions(type, id))) {
      throw new Error(`${type} final verification failed.`)
    }
  }
  if (order.state?.name !== 'Ждет доставки - Наличные' || invoice.payedSum !== 0) {
    throw new Error('MoySklad COD/unpaid state verification failed.')
  }
  if (await paymentExists()) throw new Error(`Wrong payment ${WRONG_PAYMENT_NUMBER} still exists.`)
  if (customer.phone !== PHONE) throw new Error('MoySklad phone verification failed.')
  if (
    !webOrder ||
    webOrder.status !== 'PENDING' ||
    webOrder.paymentStatus !== 'pending' ||
    webOrder.total !== TOTAL_AED ||
    webOrder.items.length !== WEB_LINES.length ||
    loyalty.length
  ) {
    throw new Error('Website order verification failed.')
  }
  if (user?.phone !== PHONE || user.addresses.some((address) => address.phone !== PHONE)) {
    throw new Error('Website phone verification failed.')
  }
  return { order, invoice, demand, webOrder, user }
}

let planOrderId = ''

async function main() {
  const plan = await loadPlan()
  planOrderId = plan.webOrder.id
  const currentPositions = await Promise.all([
    allPositions('customerorder', ORDER_ID),
    allPositions('invoiceout', INVOICE_ID),
    allPositions('demand', DEMAND_ID),
  ])

  console.log('====================================================================')
  console.log(`  Hind Lougay ${ORDER_NUMBER} — restore original six-line COD order`)
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log('====================================================================')
  console.log(`  Current MS totals: SO ${plan.order.sum! / 100} / INV ${plan.invoice.sum! / 100} / SHIP ${plan.demand.sum! / 100}`)
  console.log(`  Wrong payment ${WRONG_PAYMENT_NUMBER}: ${plan.wrongPayment ? 'present — will delete' : 'already absent'}`)
  console.log(`  Website: ${plan.webOrder.status} / ${plan.webOrder.paymentStatus} / AED ${plan.webOrder.total}`)
  console.log('  Desired:')
  console.log('    SWS, HES, PCS, CVS ×1 kit (10 vials each) @ AED 580')
  console.log('    Collagen promo ×1 FREE; Sea Algae promo ×1 FREE')
  console.log('    AED 2,320 total; COD pending; corrected phone retained')
  console.log(`  Documents already match: ${currentPositions.every(positionsMatch)}`)

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  await replacePositions('customerorder', ORDER_ID)
  await replacePositions('invoiceout', INVOICE_ID)
  await replacePositions('demand', DEMAND_ID)

  if (await paymentExists()) {
    await ms('DELETE', `/entity/paymentin/${WRONG_PAYMENT_ID}`)
    console.log(`  Deleted wrong payment ${WRONG_PAYMENT_NUMBER}`)
  }

  const cleanDescription = (plan.order.description || '')
    .split('\n')
    .filter((line) => !line.includes('reduced to 00063 collagen'))
    .join('\n')
    .trim()
  await ms('PUT', `/entity/customerorder/${ORDER_ID}`, {
    state: msState(ORDER_COD_WAIT_STATE_ID),
    description: [
      cleanDescription,
      '2026-08-20: restored original email-confirmed 6-line COD order at AED 2,320. Cash due on delivery.',
    ]
      .filter(Boolean)
      .join('\n'),
  })
  await ms('PUT', `/entity/invoiceout/${INVOICE_ID}`, {
    description: `Invoice for ${ORDER_NUMBER}. Original six-line COD order restored 2026-08-20; unpaid.`,
  })
  await ms('PUT', `/entity/demand/${DEMAND_ID}`, {
    description: `Shipment from invoice ${INVOICE_NUMBER} / ${ORDER_NUMBER}. Original six-line COD order restored; cash due on delivery.`,
  })

  await restoreWebsite(plan)
  const checked = await verify()
  const pdf = await exportInvoicePdf()

  console.log(`\n  MoySklad SO: ${checked.order.state?.name} / AED ${checked.order.sum! / 100}`)
  console.log(`  MoySklad invoice: paid AED ${checked.invoice.payedSum! / 100} / total AED ${checked.invoice.sum! / 100}`)
  console.log(`  Website: ${checked.webOrder.status} / ${checked.webOrder.paymentStatus} / ${checked.webOrder.items.length} items`)
  console.log(`  Website total: AED ${checked.webOrder.total}; rewards balance ${checked.user?.loyaltyPoints}`)
  console.log(`  PDF: ${pdf}`)
}

main()
  .catch((error) => {
    console.error('FATAL:', error instanceof Error ? error.message : error)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
