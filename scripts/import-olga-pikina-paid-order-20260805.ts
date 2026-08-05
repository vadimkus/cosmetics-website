/**
 * Mirror the existing paid MoySklad order GENCardM260805PIKI into Olga
 * Pikina's website account, award normal server-authoritative rewards, and
 * optionally send one customer-only account update email.
 *
 * This script is read-only against MoySklad. It must never recreate or alter
 * the existing SO / invoice / shipment / payment chain.
 *
 * Preview:
 *   npx tsx --env-file=.env --env-file=.env.local scripts/import-olga-pikina-paid-order-20260805.ts
 * Import + award:
 *   npx tsx --env-file=.env --env-file=.env.local scripts/import-olga-pikina-paid-order-20260805.ts --commit
 * Send once, after reviewing the preview and successful import:
 *   npx tsx --env-file=.env --env-file=.env.local scripts/import-olga-pikina-paid-order-20260805.ts --send-email
 */
import { canonicalOrderItemImage } from '../lib/orderItemImage'
import { sendEmail } from '../lib/email/transporter'
import { LOGO_URL, renderEmailFooter } from '../lib/email/utils'
import {
  awardPointsForDeliveredOrder,
  estimateOrderPoints,
  getLedgerBalance,
  loyaltyTrackForUser,
} from '../lib/loyalty'
import { prisma } from '../lib/prisma'
import { SITE_URL } from '../lib/siteConfig'

const API = 'https://api.moysklad.ru/api/remap/1.2'
const EMAIL = 'olgaku4eryava@gmail.com'
const ORDER_NUMBER = 'GENCardM260805PIKI'
const INVOICE_NUMBER = '04893'
const DEMAND_NUMBER = '06639'
const PAYMENT_NUMBER = '06037'
const MOYSKLAD_CUSTOMER_ID = '0555788f-90db-11f1-0a80-040c001fd737'
const PRODUCT_ID = '41'
const PRODUCT_AED = 270
const SHIPPING_AED = 45
const TOTAL_AED = 315
const ADDRESS = 'The Greens and Views, Fairways East tower, Apt 1804'
const EMIRATE = 'Dubai'
const EMAIL_MARKER = 'olgaPaidOrderAccountEmail'

const COMMIT = process.argv.includes('--commit')
const SEND_EMAIL = process.argv.includes('--send-email')

if (COMMIT && SEND_EMAIL) {
  throw new Error('Run --commit and --send-email separately so the email is sent only after import verification.')
}

type MoySkladEntity = {
  id: string
  name: string
  moment?: string
  sum?: number
  phone?: string
  email?: string
  actualAddress?: string
  actualAddressFull?: {
    city?: string
    street?: string
    apartment?: string
    addInfo?: string
  }
  agent?: { meta?: { href?: string } }
  customerOrder?: { meta?: { href?: string } }
  description?: string
}

type EmailMarker = {
  recipient: string
  subject: string
  messageId: string
  acceptedAt: string
}

function money(value: number): string {
  return value.toFixed(2)
}

function normalizePhone(value: unknown): string | null {
  const phone = String(value || '').trim()
  return phone || null
}

function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function parseMetadata(raw: string | null): Record<string, unknown> {
  if (!raw) return {}
  try {
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {}
  } catch {
    throw new Error('Existing order paymentMetadata is not valid JSON; refusing to overwrite it.')
  }
}

function moySkladDate(value: string | undefined): Date {
  if (!value) return new Date('2026-08-05T12:00:00.000Z')
  const parsed = new Date(value.replace(' ', 'T') + '+04:00')
  if (Number.isNaN(parsed.getTime())) throw new Error(`Invalid MoySklad date: ${value}`)
  return parsed
}

async function moySkladGet<T>(path: string): Promise<T> {
  const login = process.env.MOYSKLAD_LOGIN
  const password = process.env.MOYSKLAD_PASSWORD
  if (!login || !password) throw new Error('MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD are required.')
  const authorization = `Basic ${Buffer.from(`${login}:${password}`).toString('base64')}`
  const response = await fetch(`${API}${path}`, {
    headers: { Authorization: authorization, Accept: 'application/json;charset=utf-8' },
  })
  if (!response.ok) {
    throw new Error(`MoySklad read failed: HTTP ${response.status} ${path}`)
  }
  return response.json() as Promise<T>
}

async function getNamedEntity(type: string, name: string): Promise<MoySkladEntity> {
  const result = await moySkladGet<{ rows: MoySkladEntity[] }>(
    `/entity/${type}?filter=${encodeURIComponent(`name=${name}`)}&limit=10`,
  )
  const exact = result.rows.filter((row) => row.name === name)
  if (exact.length !== 1) {
    throw new Error(`Expected one MoySklad ${type} named ${name}; found ${exact.length}.`)
  }
  return exact[0]
}

async function getAuthoritativeMoySkladData() {
  const [customer, order, invoice, demand, payment, contacts] = await Promise.all([
    moySkladGet<MoySkladEntity>(`/entity/counterparty/${MOYSKLAD_CUSTOMER_ID}`),
    getNamedEntity('customerorder', ORDER_NUMBER),
    getNamedEntity('invoiceout', INVOICE_NUMBER),
    getNamedEntity('demand', DEMAND_NUMBER),
    getNamedEntity('paymentin', PAYMENT_NUMBER),
    moySkladGet<{ rows: MoySkladEntity[] }>(
      `/entity/counterparty/${MOYSKLAD_CUSTOMER_ID}/contactpersons?limit=100`,
    ).catch(() => ({ rows: [] })),
  ])

  for (const [label, entity] of [
    ['SO', order],
    ['invoice', invoice],
    ['shipment', demand],
    ['payment', payment],
  ] as const) {
    if (entity.sum !== TOTAL_AED * 100) {
      throw new Error(`${label} ${entity.name} total is ${entity.sum}; expected ${TOTAL_AED * 100} minor units.`)
    }
    if (entity.agent?.meta?.href && !entity.agent.meta.href.endsWith(`/${MOYSKLAD_CUSTOMER_ID}`)) {
      throw new Error(`${label} ${entity.name} is linked to a different MoySklad customer.`)
    }
  }

  for (const entity of [invoice, demand, payment]) {
    const href = entity.customerOrder?.meta?.href
    if (href && !href.endsWith(`/${order.id}`)) {
      throw new Error(`${entity.name} is linked to a different MoySklad SO.`)
    }
  }

  const phones = [
    normalizePhone(customer.phone),
    ...contacts.rows.map((contact) => normalizePhone(contact.phone)),
  ].filter((phone): phone is string => Boolean(phone))
  const uniquePhones = [...new Set(phones)]
  if (uniquePhones.length > 1) {
    throw new Error(`Multiple authoritative phone values found in MoySklad; refusing to choose: ${uniquePhones.length}.`)
  }

  return {
    customer,
    order,
    invoice,
    demand,
    payment,
    phone: uniquePhones[0] || null,
  }
}

async function loadPlan() {
  const moySklad = await getAuthoritativeMoySkladData()
  const users = await prisma.user.findMany({
    where: { email: { equals: EMAIL, mode: 'insensitive' } },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      address: true,
      birthday: true,
      discountType: true,
      discountPercentage: true,
      memberTier: true,
      memberSince: true,
      loyaltyPoints: true,
      moyskladCounterpartyId: true,
    },
  })
  if (users.length !== 1) throw new Error(`Expected one production user for ${EMAIL}; found ${users.length}.`)
  const user = users[0]
  if (user.email !== EMAIL) {
    throw new Error(`Canonical user email differs from the authorized recipient: ${user.email}`)
  }

  const product = await prisma.product.findUnique({
    where: { id: PRODUCT_ID },
    select: { id: true, productNumber: true, name: true, price: true, image: true },
  })
  if (!product || !/cushion/i.test(product.name) || Number(product.price) !== 300) {
    throw new Error(`Website product ${PRODUCT_ID} is not the expected 300 AED cushion catalog record.`)
  }

  const [byNumber, byMoySkladId] = await Promise.all([
    prisma.order.findMany({
      where: { orderNumber: ORDER_NUMBER },
      include: { items: true },
    }),
    prisma.order.findMany({
      where: { moySkladOrderId: moySklad.order.id },
      include: { items: true },
    }),
  ])
  const existingIds = new Set([...byNumber, ...byMoySkladId].map((order) => order.id))
  if (existingIds.size > 1) {
    throw new Error(`Conflicting website duplicates found for ${ORDER_NUMBER} / ${moySklad.order.id}.`)
  }
  const existing = [...byNumber, ...byMoySkladId][0] || null
  if (existing && existing.customerEmail !== EMAIL) {
    throw new Error(`Existing website order belongs to ${existing.customerEmail}, not ${EMAIL}.`)
  }

  const track = loyaltyTrackForUser(user)
  const expectedPoints = estimateOrderPoints({
    total: TOTAL_AED,
    shipping: SHIPPING_AED,
    user,
  })
  const ledgerBalance = await getLedgerBalance(user.id)
  const existingEarn = existing
    ? await prisma.loyaltyTransaction.findUnique({
        where: { orderId_type: { orderId: existing.id, type: 'ORDER_EARN' } },
      })
    : null

  return {
    moySklad,
    user,
    product,
    existing,
    existingEarn,
    track,
    expectedPoints,
    ledgerBalance,
    image: canonicalOrderItemImage(product),
  }
}

function printPlan(plan: Awaited<ReturnType<typeof loadPlan>>) {
  const { user, product, moySklad, existing, existingEarn, track, expectedPoints, ledgerBalance, image } = plan
  console.log(`=== OLGA PIKINA WEBSITE IMPORT (${COMMIT ? 'COMMIT' : SEND_EMAIL ? 'SEND EMAIL' : 'DRY RUN'}) ===`)
  console.log(`User: ${user.name} <${user.email}> | unique production match: yes`)
  console.log(`Member since: ${user.memberSince?.toISOString() || 'not set'} | tier: ${user.memberTier} | track: ${track}`)
  console.log(`Authoritative phone: ${moySklad.phone ? `found (ends ${moySklad.phone.slice(-4)})` : 'not present in MoySklad'}`)
  console.log(`Address: ${ADDRESS}, ${EMIRATE}`)
  console.log(`MoySklad chain: ${ORDER_NUMBER} / ${INVOICE_NUMBER} / ${DEMAND_NUMBER} / ${PAYMENT_NUMBER}`)
  console.log(`MoySklad SO UUID: ${moySklad.order.id} | customer UUID: ${moySklad.customer.id}`)
  console.log(`Website item: ${product.name} | product ${product.id} | image ${image}`)
  console.log(`Amounts: product AED ${money(PRODUCT_AED)} + delivery AED ${money(SHIPPING_AED)} = AED ${money(TOTAL_AED)}`)
  console.log(`Rewards: ${existingEarn ? 'already awarded' : `would award +${expectedPoints}`} | ledger now ${ledgerBalance}`)
  console.log(`Expected resulting balance: ${existingEarn ? ledgerBalance : ledgerBalance + expectedPoints}`)
  console.log(`Existing website order: ${existing ? `${existing.id} (${existing.status}/${existing.paymentStatus})` : 'none'}`)
  console.log(`Email recipient: ${EMAIL}`)
  console.log(`Email subject: Your paid GENOSYS order is now in your account`)
  const metadata = existing ? parseMetadata(existing.paymentMetadata) : {}
  console.log(`Email already accepted: ${metadata[EMAIL_MARKER] ? 'yes — rerun will skip' : 'no'}`)
}

async function importOrder() {
  const plan = await loadPlan()
  printPlan(plan)
  const { user, product, moySklad, existing, image } = plan
  const orderDate = moySkladDate(moySklad.order.moment)
  const paidAt = moySkladDate(moySklad.payment.moment)
  const deliveredAt = moySkladDate(moySklad.demand.moment)
  const vat = Math.round(((TOTAL_AED * 5) / 105) * 100) / 100

  const order = await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: user.id },
      data: {
        address: ADDRESS,
        moyskladCounterpartyId: MOYSKLAD_CUSTOMER_ID,
        ...(moySklad.phone ? { phone: moySklad.phone } : {}),
      },
    })

    if (existing) return existing
    return tx.order.create({
      data: {
        orderNumber: ORDER_NUMBER,
        customerEmail: EMAIL,
        customerName: user.name,
        customerPhone: moySklad.phone || user.phone || '',
        customerEmirate: EMIRATE,
        customerAddress: ADDRESS,
        orderNotes:
          `Imported from existing paid MoySklad chain: SO ${ORDER_NUMBER}, invoice ${INVOICE_NUMBER}, ` +
          `shipment ${DEMAND_NUMBER}, payment ${PAYMENT_NUMBER}. DO NOT push to MoySklad again.`,
        subtotal: PRODUCT_AED,
        discountPercentage: 0,
        discountAmount: 0,
        shipping: SHIPPING_AED,
        vat,
        total: TOTAL_AED,
        status: 'DELIVERED',
        locale: 'en',
        paymentMethod: 'bank_transfer',
        paymentStatus: 'paid',
        paidAt,
        deliveredAt,
        moySkladOrderId: moySklad.order.id,
        moySkladSyncedAt: orderDate,
        createdAt: orderDate,
        paymentMetadata: JSON.stringify({
          source: 'manual_moysklad_mirror',
          moySkladCustomerId: MOYSKLAD_CUSTOMER_ID,
          moySkladOrderId: moySklad.order.id,
          moySkladInvoice: INVOICE_NUMBER,
          moySkladDemand: DEMAND_NUMBER,
          moySkladPaymentin: PAYMENT_NUMBER,
          duplicateGuard: ORDER_NUMBER,
        }),
        items: {
          create: {
            productId: product.id,
            productName: product.name,
            price: PRODUCT_AED,
            quantity: 1,
            image,
            color: 'Beige',
          },
        },
      },
      include: { items: true },
    })
  })

  const award = await awardPointsForDeliveredOrder(order.id)
  if (!award) throw new Error('Server-authoritative loyalty award returned no result.')
  console.log(`Imported order: ${order.id} / ${ORDER_NUMBER} / DELIVERED / paid`)
  console.log(`Rewards: awarded=${award.awarded} points=${award.points} balance=${award.balance} tier=${award.tier}`)
  await verifyFinalState()
}

function buildEmail(params: {
  firstName: string
  awardedPoints: number
  balance: number
}): { subject: string; html: string } {
  const subject = 'Your paid GENOSYS order is now in your account'
  const firstName = escapeHtml(params.firstName)
  const font = `-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif`
  const html = `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:0;background:#fff;font-family:${font};color:#1d1d1f">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
      <tr><td align="center" style="padding:40px 20px">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:580px">
          <tr><td align="center" style="padding-bottom:36px"><img src="${LOGO_URL}" alt="GENOSYS" style="height:32px;width:auto"></td></tr>
          <tr><td align="center"><h1 style="margin:0 0 16px;font-size:28px">Your order is now in your account</h1></td></tr>
          <tr><td style="font-size:16px;line-height:1.6;text-align:center;padding-bottom:24px">
            Hi ${firstName}, we added your existing paid order to your GENOSYS account.
            This is an account update only. You have not been charged again and no new shipment was created.
          </td></tr>
          <tr><td style="background:#fbfbfd;border-radius:16px;padding:22px">
            <div style="font-size:13px;color:#86868b;text-align:center;margin-bottom:14px">Order ${ORDER_NUMBER} · Paid · Delivered</div>
            <table role="presentation" width="100%" cellspacing="0" cellpadding="6" style="font-size:15px">
              <tr><td>Beige cushion × 1</td><td align="right">AED ${money(PRODUCT_AED)}</td></tr>
              <tr><td>Dubai delivery</td><td align="right">AED ${money(SHIPPING_AED)}</td></tr>
              <tr><td style="font-weight:600;border-top:1px solid #e5e5e7;padding-top:12px">Total paid</td><td align="right" style="font-weight:600;border-top:1px solid #e5e5e7;padding-top:12px">AED ${money(TOTAL_AED)}</td></tr>
            </table>
          </td></tr>
          <tr><td align="center" style="padding:28px 16px">
            <div style="font-size:14px;color:#86868b">GENOSYS Rewards</div>
            <div style="font-size:32px;font-weight:600;margin-top:6px">+${params.awardedPoints} points</div>
            <div style="font-size:14px;color:#86868b;margin-top:8px">Updated balance: ${params.balance} points</div>
            <div style="font-size:13px;color:#86868b;margin-top:6px">Points were awarded on the AED ${money(PRODUCT_AED)} product amount. Delivery does not earn points.</div>
          </td></tr>
          <tr><td align="center" style="padding-bottom:40px">
            <a href="${SITE_URL}/orders" style="display:inline-block;background:#0071e3;color:#fff;text-decoration:none;padding:12px 24px;border-radius:999px">View order history</a>
          </td></tr>
          ${renderEmailFooter('en')}
        </table>
      </td></tr>
    </table>
  </body>
</html>`
  return { subject, html }
}

async function sendCustomerEmail() {
  const plan = await loadPlan()
  printPlan(plan)
  if (!plan.existing) throw new Error('Import the website order with --commit before sending email.')
  const metadata = parseMetadata(plan.existing.paymentMetadata)
  if (metadata[EMAIL_MARKER]) {
    const marker = metadata[EMAIL_MARKER] as EmailMarker
    console.log(`Email already accepted as ${marker.messageId}; skipping to preserve exactly-once behavior.`)
    return
  }
  const earn = await prisma.loyaltyTransaction.findUnique({
    where: { orderId_type: { orderId: plan.existing.id, type: 'ORDER_EARN' } },
  })
  if (!earn || earn.points !== plan.expectedPoints) {
    throw new Error(`Expected one ORDER_EARN of ${plan.expectedPoints} points before email; found ${earn?.points ?? 'none'}.`)
  }
  const balance = await getLedgerBalance(plan.user.id)
  if (balance !== plan.user.loyaltyPoints) {
    throw new Error(`Ledger balance ${balance} differs from materialized balance ${plan.user.loyaltyPoints}.`)
  }
  const { subject, html } = buildEmail({
    firstName: plan.user.name.trim().split(/\s+/)[0] || 'Olga',
    awardedPoints: earn.points,
    balance,
  })

  console.log('=== FINAL EMAIL PRE-SEND CHECK ===')
  console.log(`Recipient: ${EMAIL}`)
  console.log(`Subject: ${subject}`)
  console.log(`Order: ${ORDER_NUMBER} | total: AED ${money(TOTAL_AED)} | points: +${earn.points} | balance: ${balance}`)
  console.log('Admin recipients: none')

  const result = await sendEmail(EMAIL, subject, html)
  if (!result.success || !result.messageId) {
    throw new Error(`SMTP provider did not accept the email: ${result.error || 'missing message ID'}`)
  }
  const marker: EmailMarker = {
    recipient: EMAIL,
    subject,
    messageId: result.messageId,
    acceptedAt: new Date().toISOString(),
  }
  await prisma.order.update({
    where: { id: plan.existing.id },
    data: {
      paymentMetadata: JSON.stringify({ ...metadata, [EMAIL_MARKER]: marker }),
    },
  })
  console.log(`Email accepted by Gmail SMTP: ${result.messageId}`)
  await verifyFinalState()
}

async function verifyFinalState() {
  const plan = await loadPlan()
  if (!plan.existing) throw new Error('Verification failed: website order missing.')
  const [numberCount, moySkladCount, earnCount] = await Promise.all([
    prisma.order.count({ where: { orderNumber: ORDER_NUMBER } }),
    prisma.order.count({ where: { moySkladOrderId: plan.moySklad.order.id } }),
    prisma.loyaltyTransaction.count({
      where: { orderId: plan.existing.id, type: 'ORDER_EARN' },
    }),
  ])
  const balance = await getLedgerBalance(plan.user.id)
  const metadata = parseMetadata(plan.existing.paymentMetadata)
  console.log('=== FINAL VERIFICATION ===')
  console.log(`Website duplicates: orderNumber=${numberCount}, moySkladOrderId=${moySkladCount}`)
  console.log(`Order items: ${plan.existing.items.length} | loyalty earn rows: ${earnCount}`)
  console.log(`Points: ledger=${balance}, user=${plan.user.loyaltyPoints}`)
  console.log(`Email acceptance marker: ${metadata[EMAIL_MARKER] ? 'present' : 'not sent'}`)
  if (numberCount !== 1 || moySkladCount !== 1 || plan.existing.items.length !== 1 || earnCount !== 1) {
    throw new Error('Duplicate or missing final records detected.')
  }
  if (balance !== plan.user.loyaltyPoints) throw new Error('Loyalty materialized balance mismatch.')
}

async function main() {
  if (COMMIT) {
    await importOrder()
  } else if (SEND_EMAIL) {
    await sendCustomerEmail()
  } else {
    const plan = await loadPlan()
    printPlan(plan)
    console.log('Dry run only. Use --commit after reviewing this preview.')
  }
}

main()
  .catch((error) => {
    console.error('FATAL:', error instanceof Error ? error.message : error)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
