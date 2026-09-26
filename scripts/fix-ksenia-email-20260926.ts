import { prisma } from '@/lib/prisma'
import { sendWelcomeEmail, sendOrderConfirmationEmail, sendPasswordResetEmail } from '@/lib/email'
import { createPasswordResetToken } from '@/lib/passwordReset'
import { estimateOrderPoints } from '@/lib/loyalty'

// Ksenia Novikova typed "ksenis" at signup. Move the account, order GENCardW2609267134
// and the MoySklad counterparty to the correct address, then resend welcome, order
// confirmation and a password-reset link there.
//   npx tsx --env-file=.env --env-file=.env.local scripts/fix-ksenia-email-20260926.ts [--apply]
const USER_ID = 'cmuhwvozp000404k18fvgd3dc'
const ORDER = 'GENCardW2609267134'
const OLD_EMAIL = 'ksenis.legal.mb@gmail.com'
const NEW_EMAIL = 'ksenia.legal.mb@gmail.com'
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
  const [user, conflict, order] = await Promise.all([
    prisma.user.findUnique({ where: { id: USER_ID } }),
    prisma.user.findUnique({ where: { email: NEW_EMAIL } }),
    prisma.order.findUnique({ where: { orderNumber: ORDER }, include: { items: true } }),
  ])
  if (!user || user.name !== 'Ksenia Novikova') throw new Error('User not found / name mismatch')
  if (!order) throw new Error('Order not found')
  if (conflict && conflict.id !== user.id) throw new Error(`${NEW_EMAIL} already belongs to ${conflict.id}`)
  if (!user.password?.startsWith('$2')) throw new Error('Missing bcrypt hash')

  const so = order.moySkladOrderId
    ? await ms(`/entity/customerorder/${order.moySkladOrderId}`)
    : (await ms(`/entity/customerorder?filter=name=${ORDER}`)).rows[0]
  const agent = so ? await ms(so.agent.meta.href) : null
  const orderCount = await prisma.order.count({ where: { customerEmail: OLD_EMAIL } })
  console.log({ userEmail: user.email, orderEmail: order.customerEmail, orderCount, locale: order.locale,
    msAgent: agent?.name, msAgentEmail: agent?.email })
  if (!apply) { console.log('dry run; pass --apply'); return }

  if (user.email === OLD_EMAIL) {
    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: user.id },
        // tokenVersion bump signs out sessions that still carry the old address
        data: { email: NEW_EMAIL, tokenVersion: { increment: 1 },
          ...(user.contactEmail === OLD_EMAIL ? { contactEmail: NEW_EMAIL } : {}) },
      })
      await tx.order.updateMany({ where: { customerEmail: OLD_EMAIL }, data: { customerEmail: NEW_EMAIL } })
      await Promise.all([
        tx.pageView.updateMany({ where: { userEmail: OLD_EMAIL }, data: { userEmail: NEW_EMAIL } }),
        tx.userAction.updateMany({ where: { userEmail: OLD_EMAIL }, data: { userEmail: NEW_EMAIL } }),
        tx.userSession.updateMany({ where: { userEmail: OLD_EMAIL }, data: { userEmail: NEW_EMAIL } }),
        tx.pDFDownload.updateMany({ where: { userEmail: OLD_EMAIL }, data: { userEmail: NEW_EMAIL } }),
        tx.blogComment.updateMany({ where: { userEmail: OLD_EMAIL }, data: { userEmail: NEW_EMAIL } }),
        tx.productReview.updateMany({ where: { userEmail: OLD_EMAIL }, data: { userEmail: NEW_EMAIL } }),
        tx.chatConversation.updateMany({ where: { userEmail: OLD_EMAIL }, data: { userEmail: NEW_EMAIL } }),
        tx.newsletterSubscriber.updateMany({ where: { email: OLD_EMAIL }, data: { email: NEW_EMAIL } }),
      ])
    })
    console.log('DB updated')
  } else console.log('DB already on', user.email)

  if (agent && agent.email !== NEW_EMAIL) {
    await ms(agent.meta.href, { method: 'PUT', body: JSON.stringify({ email: NEW_EMAIL }) })
    console.log('MoySklad counterparty email updated')
  }

  const fresh = await prisma.user.findUniqueOrThrow({ where: { id: USER_ID } })
  const o = await prisma.order.findUniqueOrThrow({ where: { orderNumber: ORDER }, include: { items: true } })
  if (fresh.email !== NEW_EMAIL || o.customerEmail !== NEW_EMAIL) throw new Error('Verify failed')
  const locale = o.locale || 'en'

  console.log('welcome', JSON.stringify(await sendWelcomeEmail(fresh.name || 'Ksenia', NEW_EMAIL, locale)))
  console.log('confirmation', JSON.stringify(await sendOrderConfirmationEmail({
    orderNumber: o.orderNumber,
    customerName: o.customerName,
    customerEmail: NEW_EMAIL,
    items: o.items.map((i) => ({
      productName: i.productName || 'Product',
      quantity: i.quantity,
      price: i.price,
      image: i.image || '',
      ...(i.size ? { size: i.size } : {}),
      ...(i.color ? { color: i.color } : {}),
    })),
    subtotal: o.subtotal || 0,
    shipping: o.shipping || 0,
    vat: o.vat || 0,
    total: o.total || 0,
    address: o.customerAddress || '',
    emirate: o.customerEmirate || '',
    locale,
    discountAmount: o.discountAmount ?? undefined,
    bundleDiscountPercentage: o.bundleDiscountPercentage ?? undefined,
    bundleDiscountAmount: o.bundleDiscountAmount ?? undefined,
    loyaltyPointsRedeemed: o.loyaltyPointsRedeemed ?? undefined,
    loyaltyDiscountAmount: o.loyaltyDiscountAmount ?? undefined,
    loyaltyPointsExpected: estimateOrderPoints({ total: o.total, shipping: o.shipping || 0, user: fresh }),
    rewardsCreditTiming: 'paid',
  })))
  const token = await createPasswordResetToken(fresh.id)
  console.log('password reset', JSON.stringify(await sendPasswordResetEmail(NEW_EMAIL, fresh.name || 'Ksenia', token, locale)))
}

main().catch((e) => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect())
