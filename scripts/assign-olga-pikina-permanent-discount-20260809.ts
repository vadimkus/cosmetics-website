/**
 * Assign Olga Pikina's verified website account a permanent 10% VIP discount
 * and optionally send one customer-only confirmation email.
 *
 * Dry run:
 *   npx tsx --env-file=.env --env-file=.env.local scripts/assign-olga-pikina-permanent-discount-20260809.ts
 * Apply:
 *   npx tsx --env-file=.env --env-file=.env.local scripts/assign-olga-pikina-permanent-discount-20260809.ts --apply
 * Send once, after apply verification:
 *   npx tsx --env-file=.env --env-file=.env.local scripts/assign-olga-pikina-permanent-discount-20260809.ts --send-email
 */
import { sendEmail } from '../lib/email/transporter'
import { LOGO_URL, renderEmailFooter } from '../lib/email/utils'
import { canRedeemPoints, loyaltyTrackForUser } from '../lib/loyalty'
import { prisma } from '../lib/prisma'
import { SITE_URL } from '../lib/siteConfig'

const ACCOUNT_EMAIL = 'olgaku4eryava@gmail.com'
const EXPECTED_NAME = 'Olga Pikina'
const EXPECTED_MOYSKLAD_COUNTERPARTY_ID = '0555788f-90db-11f1-0a80-040c001fd737'
const REQUIRED_ORDER_NUMBERS = ['GENCardM260805PIKI', 'GENCardM2606166868']
const DISCOUNT_TYPE = 'VIP'
const DISCOUNT_PERCENTAGE = 10
const ASSIGNMENT_ACTION = 'ACCOUNT_DISCOUNT_ASSIGNED_20260809'
const EMAIL_ACTION = 'ACCOUNT_DISCOUNT_EMAIL_ACCEPTED_20260809'

const APPLY = process.argv.includes('--apply')
const SEND_EMAIL = process.argv.includes('--send-email')

if (APPLY && SEND_EMAIL) {
  throw new Error('Run --apply and --send-email separately so the database write is verified before email.')
}

function maskEmail(email: string): string {
  const [local = '', domain = ''] = email.split('@')
  return `${local.slice(0, 2)}***@${domain}`
}

function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function parseDetails(value: string | null): Record<string, unknown> {
  if (!value) return {}
  try {
    const parsed = JSON.parse(value)
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {}
  } catch {
    return {}
  }
}

async function loadVerifiedAccount() {
  const users = await prisma.user.findMany({
    where: { email: { equals: ACCOUNT_EMAIL, mode: 'insensitive' } },
    select: {
      id: true,
      email: true,
      contactEmail: true,
      name: true,
      moyskladCounterpartyId: true,
      discountType: true,
      discountPercentage: true,
      memberTier: true,
      loyaltyPoints: true,
      orders: {
        where: { orderNumber: { in: REQUIRED_ORDER_NUMBERS } },
        select: { orderNumber: true, customerEmail: true, locale: true },
      },
    },
  })

  if (users.length !== 1) {
    throw new Error(`Expected one exact production account; found ${users.length}.`)
  }
  const user = users[0]
  if (user.email !== ACCOUNT_EMAIL) throw new Error('Canonical login email differs from the verified account email.')
  if (user.name.trim().toLowerCase() !== EXPECTED_NAME.toLowerCase()) {
    throw new Error(`Verified account name mismatch: expected ${EXPECTED_NAME}.`)
  }
  if (user.moyskladCounterpartyId !== EXPECTED_MOYSKLAD_COUNTERPARTY_ID) {
    throw new Error('Verified MoySklad counterparty link does not match prior authoritative imports.')
  }

  const importedOrders = new Set(user.orders.map((order) => order.orderNumber))
  for (const orderNumber of REQUIRED_ORDER_NUMBERS) {
    if (!importedOrders.has(orderNumber)) {
      throw new Error(`Required prior imported order ${orderNumber} is not linked to this account.`)
    }
  }
  if (user.orders.some((order) => order.customerEmail !== ACCOUNT_EMAIL)) {
    throw new Error('A required prior order has a conflicting customer email.')
  }

  // Keep these sequential: the production serverless pool can expose only one
  // connection to maintenance scripts.
  const assignmentMarkers = await prisma.userAction.findMany({
    where: { userId: user.id, action: ASSIGNMENT_ACTION },
    orderBy: { timestamp: 'desc' },
  })
  const emailMarkers = await prisma.userAction.findMany({
    where: { userId: user.id, action: EMAIL_ACTION },
    orderBy: { timestamp: 'desc' },
  })
  if (assignmentMarkers.length > 1 || emailMarkers.length > 1) {
    throw new Error('Duplicate operation markers found; refusing to continue.')
  }

  const locale = user.orders.find((order) => order.locale)?.locale || 'en'
  return {
    user,
    locale,
    assignmentMarker: assignmentMarkers[0] || null,
    emailMarker: emailMarkers[0] || null,
  }
}

function printPlan(plan: Awaited<ReturnType<typeof loadVerifiedAccount>>) {
  const { user, locale, assignmentMarker, emailMarker } = plan
  const active = user.discountType === DISCOUNT_TYPE && user.discountPercentage === DISCOUNT_PERCENTAGE
  console.log(`=== OLGA ACCOUNT DISCOUNT (${APPLY ? 'APPLY' : SEND_EMAIL ? 'SEND EMAIL' : 'DRY RUN'}) ===`)
  console.log(`Account: ${user.name} <${maskEmail(user.email)}> | exact unique match: yes`)
  console.log(`Identity evidence: MoySklad link matched; required imported orders matched: ${REQUIRED_ORDER_NUMBERS.length}`)
  console.log(`Current discount: ${user.discountType || 'none'} ${user.discountPercentage ?? 0}%`)
  console.log(`Target discount: ${DISCOUNT_TYPE} ${DISCOUNT_PERCENTAGE}% | already active: ${active ? 'yes' : 'no'}`)
  console.log(`Rewards track after assignment: ${loyaltyTrackForUser({ discountType: DISCOUNT_TYPE, discountPercentage: DISCOUNT_PERCENTAGE })}`)
  console.log(`Points redemption while active: ${canRedeemPoints({ discountType: DISCOUNT_TYPE, discountPercentage: DISCOUNT_PERCENTAGE }) ? 'enabled' : 'disabled (non-stacking rule)'}`)
  console.log(`Locale: ${locale} | assignment marker: ${assignmentMarker ? 'present' : 'absent'} | email marker: ${emailMarker ? 'present' : 'absent'}`)
}

async function applyDiscount() {
  const plan = await loadVerifiedAccount()
  printPlan(plan)
  const { user, assignmentMarker } = plan

  const alreadyActive =
    user.discountType === DISCOUNT_TYPE && user.discountPercentage === DISCOUNT_PERCENTAGE
  const hasConflictingDiscount =
    (user.discountType !== null || user.discountPercentage !== null) && !alreadyActive
  if (hasConflictingDiscount) {
    throw new Error(
      `Refusing to replace conflicting discount ${user.discountType || 'none'} ${user.discountPercentage ?? 0}%.`,
    )
  }

  await prisma.$transaction(async (tx) => {
    if (!alreadyActive) {
      await tx.user.update({
        where: { id: user.id },
        data: {
          discountType: DISCOUNT_TYPE,
          discountPercentage: DISCOUNT_PERCENTAGE,
        },
      })
    }
    if (!assignmentMarker) {
      await tx.userAction.create({
        data: {
          action: ASSIGNMENT_ACTION,
          userId: user.id,
          userEmail: user.email,
          details: JSON.stringify({
            discountType: DISCOUNT_TYPE,
            discountPercentage: DISCOUNT_PERCENTAGE,
            permanent: true,
            authorizedBy: 'Vadim',
          }),
        },
      })
    }
  })

  console.log(alreadyActive ? 'Discount already active; no account field changed.' : 'Discount assigned.')
  await verifyFinalState(false)
}

function buildEmail(firstName: string): { subject: string; html: string } {
  const safeName = escapeHtml(firstName)
  const subject = 'Your permanent 10% GENOSYS discount is active'
  const font = `-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif`
  return {
    subject,
    html: `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:0;background:#fff;font-family:${font};color:#1d1d1f">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
      <tr><td align="center" style="padding:40px 20px">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:580px">
          <tr><td align="center" style="padding-bottom:36px"><img src="${LOGO_URL}" alt="GENOSYS" style="height:32px;width:auto"></td></tr>
          <tr><td align="center">
            <div style="display:inline-block;background:#f3e8ff;color:#7e22ce;font-size:32px;font-weight:700;padding:18px 28px;border-radius:16px">10% OFF</div>
            <h1 style="margin:24px 0 14px;font-size:28px">Your account discount is active</h1>
          </td></tr>
          <tr><td style="font-size:16px;line-height:1.65;text-align:center;padding:0 12px 30px">
            Hi ${safeName}, your GENOSYS account now has a permanent 10% discount.
            It will be applied automatically to eligible future purchases when you are logged in.
          </td></tr>
          <tr><td align="center" style="padding-bottom:44px">
            <a href="${SITE_URL}/products" style="display:inline-block;background:#0071e3;color:#fff;text-decoration:none;padding:12px 24px;border-radius:999px">Shop GENOSYS</a>
          </td></tr>
          ${renderEmailFooter('en')}
        </table>
      </td></tr>
    </table>
  </body>
</html>`,
  }
}

async function sendConfirmationEmail() {
  const plan = await loadVerifiedAccount()
  printPlan(plan)
  const { user, assignmentMarker, emailMarker } = plan
  if (user.discountType !== DISCOUNT_TYPE || user.discountPercentage !== DISCOUNT_PERCENTAGE) {
    throw new Error('The verified 10% account discount is not active; run --apply first.')
  }
  if (!assignmentMarker) throw new Error('Assignment audit marker is missing; run --apply first.')
  if (emailMarker) {
    const details = parseDetails(emailMarker.details)
    console.log(`Email already accepted as ${String(details.messageId || 'recorded')}; skipping.`)
    return
  }

  const recipient = user.contactEmail || user.email
  if (recipient !== ACCOUNT_EMAIL) {
    throw new Error('Preferred recipient conflicts with the verified account email; refusing to guess.')
  }
  const firstName = user.name.trim().split(/\s+/)[0] || 'Olga'
  const { subject, html } = buildEmail(firstName)
  console.log(`Pre-send: ${maskEmail(recipient)} | ${subject} | admin recipients: none`)

  const result = await sendEmail(recipient, subject, html)
  if (!result.success || !result.messageId) {
    throw new Error(`SMTP provider did not accept the email: ${result.error || 'missing message ID'}`)
  }
  await prisma.userAction.create({
    data: {
      action: EMAIL_ACTION,
      userId: user.id,
      userEmail: user.email,
      details: JSON.stringify({
        recipient: user.email,
        subject,
        messageId: result.messageId,
        acceptedAt: new Date().toISOString(),
      }),
    },
  })
  console.log(`Email accepted by Gmail SMTP: ${result.messageId}`)
  await verifyFinalState(true)
}

async function verifyFinalState(requireEmail: boolean) {
  const plan = await loadVerifiedAccount()
  const { user, assignmentMarker, emailMarker } = plan
  console.log('=== FINAL VERIFICATION ===')
  console.log(`Account: ${user.name} <${maskEmail(user.email)}> | discount: ${user.discountType} ${user.discountPercentage}%`)
  console.log(`Assignment marker: ${assignmentMarker ? 'present' : 'missing'} | email acceptance marker: ${emailMarker ? 'present' : 'missing'}`)
  console.log(`Rewards track: ${loyaltyTrackForUser(user)} | points balance preserved: ${user.loyaltyPoints}`)
  if (user.discountType !== DISCOUNT_TYPE || user.discountPercentage !== DISCOUNT_PERCENTAGE) {
    throw new Error('Production discount verification failed.')
  }
  if (!assignmentMarker) throw new Error('Assignment audit marker verification failed.')
  if (requireEmail && !emailMarker) throw new Error('Email acceptance marker verification failed.')
}

async function main() {
  if (APPLY) return applyDiscount()
  if (SEND_EMAIL) return sendConfirmationEmail()
  const plan = await loadVerifiedAccount()
  printPlan(plan)
  console.log('Dry run only. Use --apply after reviewing this preview.')
}

main()
  .catch((error) => {
    console.error('FATAL:', error instanceof Error ? error.message : error)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
