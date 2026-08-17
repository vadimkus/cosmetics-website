/**
 * Khadija Faidar CODM2608138202 — add Hair Tonic α to the website order + MoySklad SO
 * (invoice 04928 / shipment 06681 already have 00051 @ 145), then one-off COD
 * confirmation email to the customer only.
 *
 *   npx tsx --env-file=.env.local scripts/add-khadija-faidar-hair-tonic-email-20260813.ts
 *   npx tsx --env-file=.env.local scripts/add-khadija-faidar-hair-tonic-email-20260813.ts --commit
 */

import fs from 'fs'
import os from 'os'
import path from 'path'
import { prisma } from '../lib/prisma'
import { canonicalOrderItemImage } from '../lib/orderItemImage'
import { calculateVatIncluded } from '../lib/mobileCheckoutConfig'
import { estimateOrderPoints } from '../lib/loyalty'
import { getPreferredEmail } from '../lib/emailHelpers'
import { generateCODOrderHTML } from '../lib/email/htmlGenerators'
import { sendEmail } from '../lib/email/transporter'
import arMessages from '../messages/ar.json'

const COMMIT = process.argv.includes('--commit')
const ORDER_NUMBER = 'CODM2608138202'
const EXPECTED_EMAIL = 'khadijafaidar6@gmail.com'
const HAIR_TONIC_PRODUCT_ID = '43'
const HAIR_TONIC_AED = 145
const NEW_SUBTOTAL = 725 // 580 + 145
const NEW_SHIPPING = 45
const NEW_TOTAL = 770
const EMAIL_MARKER = 'khadijaHairTonicAdded20260813'

const MS_SO_ID = 'a0a896be-9725-11f1-0a80-09ec00337e7c'
const MS_INV_ID = 'a10a8824-9725-11f1-0a80-0360003338ff'
const MS_DEMAND_ID = 'a221a1c2-9725-11f1-0a80-03600033392a'
const MS_HAIR_TONIC_ID = 'b4763e83-42bc-11ea-0a80-01e3000bd569'
const HAIR_TONIC_CODE = '00051'
const INVOICE_RETAIL_PRINT_TEMPLATE_ID = 'b2cde0a1-ec18-4ea5-ac56-813a26308f10'

const API = 'https://api.moysklad.ru/api/remap/1.2'
const LOGIN = process.env.MOYSKLAD_LOGIN
const PASSWORD = process.env.MOYSKLAD_PASSWORD
const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')

type EmailMarker = {
  recipient: string
  subject: string
  messageId: string
  acceptedAt: string
}

function parseMetadata(raw: string | null | undefined): Record<string, unknown> {
  if (!raw) return {}
  try {
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? (parsed as Record<string, unknown>) : {}
  } catch {
    return {}
  }
}

async function api(method: string, pathStr: string, body?: unknown, attempt = 1): Promise<any> {
  const url = pathStr.startsWith('http') ? pathStr : API + pathStr
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: AUTH,
      Accept: 'application/json;charset=utf-8',
      'Accept-Encoding': 'gzip',
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

async function fetchAll(pathStr: string) {
  const rows: any[] = []
  let offset = 0
  while (true) {
    const sep = pathStr.includes('?') ? '&' : '?'
    const data = await api('GET', `${pathStr}${sep}limit=1000&offset=${offset}`)
    rows.push(...(data.rows || []))
    if ((data.rows || []).length < 1000) break
    offset += 1000
  }
  return rows
}

function href(type: string, id: string) {
  return { meta: { href: `${API}/entity/${type}/${id}`, type, mediaType: 'application/json' } }
}

function emailSize(size: string | null | undefined): string | undefined {
  if (!size || size.startsWith('__')) return undefined
  return size
}

async function exportInvoicePdf(invoiceId: string, invoiceName: string, attempt = 1): Promise<string> {
  const body = {
    template: {
      meta: {
        href: `${API}/entity/invoiceout/metadata/customtemplate/${INVOICE_RETAIL_PRINT_TEMPLATE_ID}`,
        type: 'customtemplate',
        mediaType: 'application/json',
      },
    },
    extension: 'pdf',
  }
  try {
    const res = await fetch(`${API}/entity/invoiceout/${invoiceId}/export`, {
      method: 'POST',
      headers: { Authorization: AUTH, Accept: '*/*', 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      redirect: 'manual',
    })
    if (res.status !== 303 && res.status !== 302) {
      throw new Error(`Invoice export ${res.status}: ${(await res.text()).slice(0, 600)}`)
    }
    const location = res.headers.get('location')
    if (!location) throw new Error('Export missing Location')
    const pdfRes = await fetch(location)
    if (!pdfRes.ok) throw new Error(`PDF download HTTP ${pdfRes.status}`)
    const buf = Buffer.from(await pdfRes.arrayBuffer())
    const dir = path.join(os.homedir(), 'Desktop', 'orders')
    fs.mkdirSync(dir, { recursive: true })
    const safe = String(invoiceName || 'invoice').replace(/[^\w.-]+/g, '_')
    const outPath = path.join(dir, `GENOSYS_Khadija_Faidar_${safe}.pdf`)
    fs.writeFileSync(outPath, buf)
    return outPath
  } catch (e) {
    if (attempt < 4) {
      await new Promise((r) => setTimeout(r, 1500 * attempt))
      return exportInvoicePdf(invoiceId, invoiceName, attempt + 1)
    }
    throw e
  }
}

async function ensureMoySkladHairTonic() {
  const soPos = await fetchAll(`/entity/customerorder/${MS_SO_ID}/positions?expand=assortment`)
  const hasOnSo = soPos.some((p) => p.assortment?.code === HAIR_TONIC_CODE)
  console.log(`  MoySklad SO hair tonic: ${hasOnSo ? 'already present' : 'will add @ 145'}`)
  if (!hasOnSo && COMMIT) {
    await api('POST', `/entity/customerorder/${MS_SO_ID}/positions`, {
      quantity: 1,
      price: HAIR_TONIC_AED * 100,
      discount: 0,
      assortment: href('product', MS_HAIR_TONIC_ID),
      vat: 5,
      vatEnabled: true,
    })
    const so = await api('GET', `/entity/customerorder/${MS_SO_ID}`)
    await api('PUT', `/entity/customerorder/${MS_SO_ID}`, {
      meta: so.meta,
      description: [so.description || '', 'Added 00051 Hair Tonic 70ml x1 @145 clinic.'].filter(Boolean).join('\n'),
    })
  }

  const soAfter = await api('GET', `/entity/customerorder/${MS_SO_ID}`)
  const inv = await api('GET', `/entity/invoiceout/${MS_INV_ID}`)
  const demand = await api('GET', `/entity/demand/${MS_DEMAND_ID}?expand=customerOrder`)
  if (COMMIT) {
    if (soAfter.sum !== NEW_TOTAL * 100) throw new Error(`SO sum ${soAfter.sum / 100} ≠ ${NEW_TOTAL}`)
    if (inv.sum !== NEW_TOTAL * 100) throw new Error(`INV sum ${inv.sum / 100} ≠ ${NEW_TOTAL}`)
    if (demand.sum !== NEW_TOTAL * 100) throw new Error(`SHIP sum ${demand.sum / 100} ≠ ${NEW_TOTAL}`)
    if (demand.customerOrder) throw new Error('Demand has customerOrder')
  } else {
    console.log(`  Current MS: SO ${soAfter.sum / 100} | INV ${inv.sum / 100} | SHIP ${demand.sum / 100}`)
  }
}

async function main() {
  if (!LOGIN || !PASSWORD) throw new Error('MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD missing')

  console.log('====================================================================')
  console.log('  Khadija Faidar — add Hair Tonic α + one-off COD email')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const order = await prisma.order.findUnique({
    where: { orderNumber: ORDER_NUMBER },
    include: { items: true, customer: true },
  })
  if (!order) throw new Error(`Order not found: ${ORDER_NUMBER}`)
  if (order.customerEmail.toLowerCase() !== EXPECTED_EMAIL) {
    throw new Error(`Email mismatch: ${order.customerEmail}`)
  }

  const product = await prisma.product.findUnique({
    where: { id: HAIR_TONIC_PRODUCT_ID },
    select: { id: true, name: true, image: true, size: true, price: true },
  })
  if (!product) throw new Error('Hair tonic product 43 not found')

  const already = order.items.find((i) => i.productId === HAIR_TONIC_PRODUCT_ID)
  console.log(`  Website order: ${order.orderNumber} total ${order.total}`)
  console.log(`  Hair tonic on website: ${already ? 'yes' : 'no'}`)

  const vat = calculateVatIncluded(NEW_TOTAL)

  if (!already && COMMIT) {
    await prisma.$transaction(async (tx) => {
      await tx.orderItem.create({
        data: {
          orderId: order.id,
          productId: product.id,
          productName: product.name,
          price: HAIR_TONIC_AED,
          quantity: 1,
          image: canonicalOrderItemImage(product),
          size: product.size || '70ml',
        },
      })
      await tx.order.update({
        where: { id: order.id },
        data: {
          subtotal: NEW_SUBTOTAL,
          vat,
          total: NEW_TOTAL,
          orderNotes: [order.orderNotes || '', 'Added HR³ MATRIX HAIR TONIC α ×1 @ 145 (clinic).'].filter(Boolean).join('\n'),
        },
      })
    })
  } else if (!already) {
    console.log(`  Would add ${product.name} @ ${HAIR_TONIC_AED}`)
    console.log(`  Would set subtotal ${NEW_SUBTOTAL} vat ${vat} total ${NEW_TOTAL}`)
  }

  await ensureMoySkladHairTonic()

  const updated = await prisma.order.findUnique({
    where: { id: order.id },
    include: { items: true, customer: true },
  })
  if (!updated) throw new Error('Order disappeared')

  if (COMMIT && updated.total !== NEW_TOTAL) {
    throw new Error(`Website total ${updated.total} ≠ ${NEW_TOTAL}`)
  }

  const metadata = parseMetadata(updated.paymentMetadata)
  if (metadata[EMAIL_MARKER]) {
    console.log(`  Email already sent (${(metadata[EMAIL_MARKER] as EmailMarker).messageId}) — skip`)
    return
  }

  const preferredEmail = getPreferredEmail(updated.customer) || updated.customerEmail
  const locale = updated.locale || 'ar'
  const translations = arMessages.orderEmail.cod
  const html = generateCODOrderHTML(
    {
      orderNumber: updated.orderNumber,
      customerName: updated.customerName,
      customerEmail: preferredEmail,
      customerPhone: updated.customerPhone,
      customerAddress: updated.customerAddress,
      emirate: updated.customerEmirate,
      items: updated.items.map((item) => ({
        name: item.productName,
        quantity: item.quantity,
        price: item.price,
        image: item.image,
        ...(emailSize(item.size) ? { size: emailSize(item.size) } : {}),
      })),
      subtotal: COMMIT ? updated.subtotal : NEW_SUBTOTAL,
      shippingCost: NEW_SHIPPING,
      vatAmount: COMMIT ? updated.vat : vat,
      total: COMMIT ? updated.total : NEW_TOTAL,
      loyaltyPointsExpected: estimateOrderPoints({
        total: NEW_TOTAL,
        shipping: NEW_SHIPPING,
        user: updated.customer,
      }),
    },
    locale,
  )
  const subject = (translations.subject || `Order Confirmation #{orderNumber} - GENOSYS Professional`)
    .replace('#{orderNumber}', updated.orderNumber)
    .replace('{orderNumber}', updated.orderNumber)

  console.log(`  Email to: ${preferredEmail}`)
  console.log(`  Subject: ${subject}`)
  console.log(`  Items:`)
  for (const item of updated.items) {
    console.log(`    ${item.productName} ×${item.quantity} @ ${item.price}`)
  }
  if (!already && !COMMIT) console.log(`    ${product.name} ×1 @ ${HAIR_TONIC_AED} (pending write)`)

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  let pdfPath: string | null = null
  try {
    pdfPath = await exportInvoicePdf(MS_INV_ID, '04928')
    console.log(`  PDF: ${pdfPath}`)
  } catch (e) {
    console.log(`  PDF export failed (email still sending): ${e instanceof Error ? e.message : e}`)
  }

  const result = await sendEmail(preferredEmail.trim(), subject, html)
  if (!result.success || !result.messageId) {
    throw new Error(`SMTP did not accept email: ${result.error || 'missing messageId'}`)
  }

  const marker: EmailMarker = {
    recipient: preferredEmail,
    subject,
    messageId: result.messageId,
    acceptedAt: new Date().toISOString(),
  }
  await prisma.order.update({
    where: { id: updated.id },
    data: {
      paymentMetadata: JSON.stringify({ ...parseMetadata(updated.paymentMetadata), [EMAIL_MARKER]: marker }),
    },
  })
  console.log(`  Sent. messageId=${result.messageId}`)
}

main()
  .catch((e) => {
    console.error('FATAL:', e instanceof Error ? e.message : e)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
