import crypto from 'crypto'
import { prisma } from '@/lib/prisma'
import { classifyPartnerLine } from '@/lib/partnerCatalog'
import { addOrder, type OrderData } from '@/lib/orderStorageDb'
import { calculateVatIncluded } from '@/lib/mobileCheckoutConfig'
import type { Product } from '@/types'
import type { Prisma } from '@prisma/client'

export const HOMECARE_SCRIPT_EXPIRY_DAYS = 30
export const CLINIC_POINT_HOLD_DAYS = 14
export const CLINIC_POINT_RATE = 0.05
export const UAE_VAT_RATE = 0.05
export const MAX_HOMECARE_ITEMS = 20
export const MAX_CARE_INSTRUCTIONS = 1000
export const MAX_PATIENT_LABEL = 80
export const CLINIC_POINT_VALUE_AED = 1

export interface HomecareScriptInputItem {
  productId: string
  size?: string | null
  quantity?: number
}

export interface HomecareScriptInput {
  patientLabel?: string | null
  careInstructions?: string | null
  items: HomecareScriptInputItem[]
}

export interface SubmittedHomecareAttribution {
  scriptId?: string
  versionId?: string
  scriptItemId?: string
  token?: string
  addedAt?: string
}

export interface ValidHomecareAttribution {
  scriptId: string
  versionId: string
  scriptItemId: string
  clinicUserId: string
  addedAt: Date
}

export interface HomecarePricedLine {
  lineTotal: number
  attribution: ValidHomecareAttribution | null
}

const round2 = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100

type HomecareDb = typeof prisma | Prisma.TransactionClient

export async function getClinicPointBalances(clinicUserId: string, db: HomecareDb = prisma) {
  const [pending, spendable] = await Promise.all([
    db.clinicPointTransaction.aggregate({
      where: { clinicUserId, status: 'PENDING' },
      _sum: { points: true },
    }),
    db.clinicPointTransaction.aggregate({
      where: { clinicUserId, status: { in: ['AVAILABLE', 'SPENT'] } },
      _sum: { points: true },
    }),
  ])
  return {
    pending: round2(Math.max(0, pending._sum.points || 0)),
    available: round2(Math.max(0, spendable._sum.points || 0)),
  }
}

export function computeClinicPoints(eligibleAmount: number): number {
  if (!Number.isFinite(eligibleAmount) || eligibleAmount <= 0) return 0
  return round2(eligibleAmount * CLINIC_POINT_RATE)
}

/**
 * Order item prices are VAT-inclusive. Allocate order-level loyalty redemption
 * proportionally across paid product lines, then strip VAT. Shipping and free
 * gifts never enter this function.
 */
export function computeHomecareEligibleAmounts(
  lines: HomecarePricedLine[],
  loyaltyDiscountAmount: number,
): number[] {
  const subtotal = lines.reduce((sum, line) => sum + Math.max(0, line.lineTotal || 0), 0)
  const discount = Math.max(0, Math.min(Number(loyaltyDiscountAmount) || 0, subtotal))

  return lines.map((line) => {
    if (!line.attribution || line.lineTotal <= 0 || subtotal <= 0) return 0
    const allocatedOrderDiscount = discount * (line.lineTotal / subtotal)
    const netVatInclusive = Math.max(0, line.lineTotal - allocatedOrderDiscount)
    return round2(netVatInclusive / (1 + UAE_VAT_RATE))
  })
}

export function isHomecareSelfReferral(params: {
  customerEmail?: string | null
  customerPhone?: string | null
  clinicEmail?: string | null
  clinicContactEmail?: string | null
  clinicPhone?: string | null
}): boolean {
  const email = (value?: string | null) => String(value || '').trim().toLowerCase()
  const phone = (value?: string | null) => String(value || '').replace(/\D/g, '').replace(/^00/, '')
  const customerEmail = email(params.customerEmail)
  const clinicEmails = [email(params.clinicEmail), email(params.clinicContactEmail)].filter(Boolean)
  if (customerEmail && clinicEmails.includes(customerEmail)) return true

  const customerPhone = phone(params.customerPhone)
  const clinicPhone = phone(params.clinicPhone)
  return Boolean(customerPhone && clinicPhone && customerPhone === clinicPhone)
}

async function validateScriptItems(items: HomecareScriptInputItem[]) {
  if (!Array.isArray(items) || items.length === 0) throw new Error('Select at least one retail product.')
  if (items.length > MAX_HOMECARE_ITEMS) throw new Error(`A script can contain up to ${MAX_HOMECARE_ITEMS} products.`)

  const normalized = items.map((item, index) => ({
    productId: String(item?.productId || '').trim(),
    size: item?.size ? String(item.size).trim() : null,
    quantity: Math.max(1, Math.min(20, Math.floor(Number(item?.quantity) || 1))),
    sortOrder: index,
  }))
  if (normalized.some(item => !item.productId)) throw new Error('Invalid product selection.')

  const productIds = [...new Set(normalized.map(item => item.productId))]
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, isHidden: false },
    include: { variants: true },
  })
  const byId = new Map(products.map(product => [product.id, product]))
  if (byId.size !== productIds.length) throw new Error('One or more products are no longer available.')

  for (const item of normalized) {
    const product = byId.get(item.productId)!
    if (classifyPartnerLine(product, item.size) !== 'retail') {
      throw new Error(`${product.name}${item.size ? ` (${item.size})` : ''} is not a retail homecare product.`)
    }
    if (item.size) {
      const sizeVariants = product.variants.filter(variant => variant.size && variant.size !== 'default')
      if (sizeVariants.length > 0 && !sizeVariants.some(variant => variant.size === item.size && variant.available)) {
        throw new Error(`${product.name} size ${item.size} is no longer available.`)
      }
    }
  }

  return normalized
}

function normalizeScriptText(input: HomecareScriptInput) {
  const patientLabel = String(input.patientLabel || '').trim().slice(0, MAX_PATIENT_LABEL) || null
  const careInstructions =
    String(input.careInstructions || '').trim().slice(0, MAX_CARE_INSTRUCTIONS) || null
  return { patientLabel, careInstructions }
}

export async function createHomecareScript(clinicUserId: string, input: HomecareScriptInput) {
  const items = await validateScriptItems(input.items)
  const { patientLabel, careInstructions } = normalizeScriptText(input)
  const publicToken = crypto.randomBytes(24).toString('base64url')
  const expiresAt = new Date(Date.now() + HOMECARE_SCRIPT_EXPIRY_DAYS * 24 * 60 * 60 * 1000)

  return prisma.homecareScript.create({
    data: {
      clinicUserId,
      publicToken,
      tokenPrefix: publicToken.slice(0, 8),
      patientLabel,
      expiresAt,
      versions: {
        create: {
          versionNumber: 1,
          careInstructions,
          items: { create: items },
        },
      },
    },
    include: {
      versions: {
        orderBy: { versionNumber: 'desc' },
        take: 1,
        include: { items: { include: { product: { include: { variants: true } } }, orderBy: { sortOrder: 'asc' } } },
      },
    },
  })
}

export async function updateHomecareScript(
  clinicUserId: string,
  scriptId: string,
  input: HomecareScriptInput,
) {
  const items = await validateScriptItems(input.items)
  const { patientLabel, careInstructions } = normalizeScriptText(input)

  return prisma.$transaction(async tx => {
    const script = await tx.homecareScript.findFirst({
      where: { id: scriptId, clinicUserId },
      include: { versions: { orderBy: { versionNumber: 'desc' }, take: 1 } },
    })
    if (!script) throw new Error('Homecare Script not found.')
    if (script.status === 'REVOKED') throw new Error('A revoked script cannot be edited.')

    const versionNumber = (script.versions[0]?.versionNumber || 0) + 1
    await tx.homecareScript.update({
      where: { id: script.id },
      data: { patientLabel, status: 'ACTIVE' },
    })
    return tx.homecareScriptVersion.create({
      data: {
        scriptId: script.id,
        versionNumber,
        careInstructions,
        items: { create: items },
      },
      include: { items: { include: { product: { include: { variants: true } } }, orderBy: { sortOrder: 'asc' } } },
    })
  })
}

export async function revokeHomecareScript(clinicUserId: string, scriptId: string) {
  const result = await prisma.homecareScript.updateMany({
    where: { id: scriptId, clinicUserId },
    data: { status: 'REVOKED' },
  })
  return result.count > 0
}

export async function listHomecareScripts(clinicUserId: string) {
  const [scripts, pointTransactions, pointBalances] = await Promise.all([
    prisma.homecareScript.findMany({
      where: { clinicUserId },
      orderBy: { createdAt: 'desc' },
      include: {
        versions: {
          orderBy: { versionNumber: 'desc' },
          take: 1,
          include: { items: { include: { product: true }, orderBy: { sortOrder: 'asc' } } },
        },
        orders: { select: { id: true, total: true, homecareAttributedSubtotal: true, status: true } },
      },
    }),
    prisma.clinicPointTransaction.findMany({
      where: { clinicUserId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    }),
    getClinicPointBalances(clinicUserId),
  ])

  const now = new Date()

  return {
    scripts: scripts.map(script => ({
      ...script,
      effectiveStatus:
        script.status === 'ACTIVE' && script.expiresAt <= now ? 'EXPIRED' : script.status,
    })),
    points: {
      pending: pointBalances.pending,
      available: pointBalances.available,
      transactions: pointTransactions,
    },
  }
}

export async function getPublicHomecareScript(publicToken: string, recordOpen = true) {
  const now = new Date()
  const script = await prisma.homecareScript.findUnique({
    where: { publicToken },
    include: {
      clinic: { select: { name: true } },
      versions: {
        orderBy: { versionNumber: 'desc' },
        take: 1,
        include: {
          items: {
            orderBy: { sortOrder: 'asc' },
            include: { product: { include: { variants: true } } },
          },
        },
      },
    },
  })
  if (!script) return null

  const status = script.status === 'ACTIVE' && script.expiresAt <= now ? 'EXPIRED' : script.status
  if (recordOpen && status === 'ACTIVE') {
    await prisma.homecareScript.update({
      where: { id: script.id },
      data: { openCount: { increment: 1 }, lastOpenedAt: now },
    })
  }

  const version = script.versions[0]
  const items = (version?.items || []).map(item => {
    const currentClass = classifyPartnerLine(item.product, item.size)
    const matchingVariant = item.size
      ? item.product.variants.find(variant => variant.size === item.size)
      : null
    const available =
      status === 'ACTIVE' &&
      item.product.inStock &&
      !item.product.isHidden &&
      currentClass === 'retail' &&
      (!matchingVariant || matchingVariant.available)
    return { ...item, available, currentClass }
  })

  return {
    id: script.id,
    publicToken: script.publicToken,
    clinicName: script.clinic.name,
    status,
    expiresAt: script.expiresAt,
    version: version ? { ...version, items } : null,
  }
}

export async function validateHomecareAttribution(params: {
  attribution?: SubmittedHomecareAttribution | null
  product: Pick<Product, 'id' | 'category'>
  selectedSize?: string | null
}): Promise<ValidHomecareAttribution | null> {
  const { attribution, product, selectedSize } = params
  if (
    !attribution?.scriptId ||
    !attribution.versionId ||
    !attribution.scriptItemId ||
    !attribution.token
  ) return null

  const item = await prisma.homecareScriptItem.findFirst({
    where: {
      id: attribution.scriptItemId,
      versionId: attribution.versionId,
      productId: product.id,
      version: {
        scriptId: attribution.scriptId,
        script: {
          publicToken: attribution.token,
          status: 'ACTIVE',
          expiresAt: { gt: new Date() },
        },
      },
      product: {
        isHidden: false,
        inStock: true,
      },
    },
    include: { version: { include: { script: true } } },
  })
  if (!item) return null
  if ((item.size || '') !== String(selectedSize || '')) return null
  if (classifyPartnerLine(product, selectedSize) !== 'retail') return null

  const parsedAddedAt = new Date(String(attribution.addedAt || ''))
  const now = new Date()
  const addedAt =
    Number.isNaN(parsedAddedAt.getTime()) || parsedAddedAt > now
      ? now
      : parsedAddedAt
  if (Date.now() - addedAt.getTime() > HOMECARE_SCRIPT_EXPIRY_DAYS * 24 * 60 * 60 * 1000) return null

  return {
    scriptId: item.version.script.id,
    versionId: item.version.id,
    scriptItemId: item.id,
    clinicUserId: item.version.script.clinicUserId,
    addedAt,
  }
}

export function selectWinningHomecareAttribution(
  attributions: Array<ValidHomecareAttribution | null>,
): ValidHomecareAttribution | null {
  return attributions
    .filter((value): value is ValidHomecareAttribution => Boolean(value))
    .sort((a, b) => b.addedAt.getTime() - a.addedAt.getTime())[0] || null
}

export async function awardClinicPointsForOrder(orderId: string) {
  try {
    return await prisma.$transaction(async tx => {
      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: {
          homecareScript: {
            include: {
              clinic: {
                select: { id: true, email: true, contactEmail: true, phone: true },
              },
            },
          },
        },
      })
      if (!order?.homecareScript || !order.homecareScriptVersionId) return null
      if (order.status !== 'DELIVERED') return null
      const paidOrCollected =
        order.paymentStatus === 'paid' || String(order.paymentMethod).toLowerCase().includes('cod')
      if (!paidOrCollected) return null

      const clinic = order.homecareScript.clinic
      if (isHomecareSelfReferral({
        customerEmail: order.customerEmail,
        customerPhone: order.customerPhone,
        clinicEmail: clinic.email,
        clinicContactEmail: clinic.contactEmail,
        clinicPhone: clinic.phone,
      })) return { awarded: false, reason: 'self_referral', points: 0 }

      const points = computeClinicPoints(order.homecareAttributedSubtotal)
      if (points <= 0) return null
      const existing = await tx.clinicPointTransaction.findUnique({
        where: { idempotencyKey: `earn:${order.id}` },
        select: { id: true },
      })
      if (existing) return { awarded: false, reason: 'already_awarded', points: 0 }
      const availableAt = new Date(Date.now() + CLINIC_POINT_HOLD_DAYS * 24 * 60 * 60 * 1000)
      const transaction = await tx.clinicPointTransaction.create({
        data: {
          clinicUserId: clinic.id,
          orderId: order.id,
          scriptVersionId: order.homecareScriptVersionId,
          points,
          eligibleAmount: order.homecareAttributedSubtotal,
          type: 'EARN',
          status: 'PENDING',
          idempotencyKey: `earn:${order.id}`,
          description: `Homecare Script order ${order.orderNumber}`,
          availableAt,
        },
      })
      return { awarded: true, points, availableAt, transaction }
    })
  } catch (error) {
    if ((error as { code?: string })?.code === 'P2002') {
      return { awarded: false, reason: 'already_awarded', points: 0 }
    }
    throw error
  }
}

export async function releaseMatureClinicPoints(now = new Date()) {
  return prisma.clinicPointTransaction.updateMany({
    where: { status: 'PENDING', availableAt: { lte: now } },
    data: { status: 'AVAILABLE' },
  })
}

export async function createPartnerOrderWithClinicPoints(params: {
  orderData: OrderData
  clinicUserId: string
  requestedPoints?: number | null
  allowRedemption?: boolean
}) {
  const requested = round2(Math.max(0, Number(params.requestedPoints) || 0))
  if (requested > 0 && params.allowRedemption === false) {
    throw new Error('Clinic Points cannot be used for consignment stock orders.')
  }

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      return await prisma.$transaction(async tx => {
        const balances = await getClinicPointBalances(params.clinicUserId, tx)
        const redeemed = round2(Math.min(requested, balances.available, Math.max(0, params.orderData.total)))
        const total = round2(Math.max(0, params.orderData.total - redeemed * CLINIC_POINT_VALUE_AED))
        const order = await addOrder({
          ...params.orderData,
          total,
          vat: round2(calculateVatIncluded(total)),
          clinicPointsRedeemed: redeemed,
          clinicPointsDiscountAmount: round2(redeemed * CLINIC_POINT_VALUE_AED),
          ...(total === 0 ? { paymentStatus: 'paid', paidAt: new Date() } : {}),
        }, tx)

        if (redeemed > 0) {
          await tx.clinicPointTransaction.create({
            data: {
              clinicUserId: params.clinicUserId,
              orderId: order.id,
              points: -redeemed,
              eligibleAmount: 0,
              type: 'REDEEM',
              status: 'SPENT',
              idempotencyKey: `redeem:${order.id}`,
              description: `Clinic Points used on partner order ${order.orderNumber}`,
            },
          })
        }

        return { order, redeemed, availableBefore: balances.available }
      }, { isolationLevel: 'Serializable' })
    } catch (error) {
      if ((error as { code?: string })?.code === 'P2034' && attempt < 3) continue
      throw error
    }
  }
  throw new Error('Unable to reserve Clinic Points.')
}

export async function restoreClinicPointsRedemptionForOrder(orderId: string, refundAmount?: number | null) {
  return prisma.$transaction(async tx => {
    const redemption = await tx.clinicPointTransaction.findUnique({
      where: { idempotencyKey: `redeem:${orderId}` },
    })
    if (!redemption || redemption.points >= 0) return null
    const order = await tx.order.findUnique({
      where: { id: orderId },
      select: { total: true, orderNumber: true },
    })
    if (!order) return null

    const ratio = refundAmount == null
      ? 1
      : order.total > 0
        ? Math.min(1, Math.max(0, Number(refundAmount) || 0) / order.total)
        : 1
    const target = round2(Math.abs(redemption.points) * ratio)
    const previous = await tx.clinicPointTransaction.aggregate({
      where: { orderId, type: 'REDEEM_RESTORE' },
      _sum: { points: true },
    })
    const points = round2(target - (previous._sum.points || 0))
    if (points <= 0) return { restored: false, reason: 'already_restored', points: 0 }

    const transaction = await tx.clinicPointTransaction.create({
      data: {
        clinicUserId: redemption.clinicUserId,
        orderId,
        points,
        eligibleAmount: 0,
        type: 'REDEEM_RESTORE',
        status: 'AVAILABLE',
        idempotencyKey: `redeem-restore:${orderId}:${target.toFixed(2)}`,
        description: refundAmount == null
          ? `Clinic Points restored after cancellation of ${order.orderNumber}`
          : `Clinic Points restored after refund on ${order.orderNumber}`,
      },
    })
    return { restored: true, points, transaction }
  })
}

export async function adjustClinicPoints(params: {
  clinicUserId: string
  points: number
  description: string
  adminId?: string | null
}) {
  const points = round2(Number(params.points))
  if (!Number.isFinite(points) || points === 0 || Math.abs(points) > 100000) {
    throw new Error('Adjustment must be between -100,000 and 100,000 points.')
  }
  const description = String(params.description || '').trim().slice(0, 300)
  if (!description) throw new Error('Adjustment reason is required.')

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      return await prisma.$transaction(async tx => {
        const clinic = await tx.user.findFirst({
          where: { id: params.clinicUserId, partnerPortalAccess: true },
          select: { id: true },
        })
        if (!clinic) throw new Error('Partner clinic not found.')
        if (points < 0) {
          const balances = await getClinicPointBalances(params.clinicUserId, tx)
          if (Math.abs(points) > balances.available) throw new Error('Adjustment exceeds available Clinic Points.')
        }
        return tx.clinicPointTransaction.create({
          data: {
            clinicUserId: params.clinicUserId,
            points,
            eligibleAmount: 0,
            type: 'ADJUST',
            status: 'AVAILABLE',
            idempotencyKey: `adjust:${params.adminId || 'admin'}:${crypto.randomUUID()}`,
            description,
          },
        })
      }, { isolationLevel: 'Serializable' })
    } catch (error) {
      if ((error as { code?: string })?.code === 'P2034' && attempt < 3) continue
      throw error
    }
  }
  throw new Error('Unable to adjust Clinic Points.')
}

export async function reverseClinicPointsForOrder(orderId: string, refundAmount?: number | null) {
  return prisma.$transaction(async tx => {
    const order = await tx.order.findUnique({ where: { id: orderId } })
    if (!order || order.homecareAttributedSubtotal <= 0) return null
    const earn = await tx.clinicPointTransaction.findUnique({
      where: { idempotencyKey: `earn:${orderId}` },
    })
    if (!earn) return null

    const alreadyReversed = await tx.clinicPointTransaction.aggregate({
      where: { orderId, type: 'REVERSE' },
      _sum: { points: true },
    })
    const reversedAbs = Math.abs(alreadyReversed._sum.points || 0)
    const refund = Math.max(0, Number(refundAmount) || order.total)
    // Shipping never earned Clinic Points, so it must not dilute a product
    // refund reversal. Mixed baskets are reversed proportionally across the
    // product amount until item-level refund data is available.
    const refundableProductTotal = Math.max(0, order.total - order.shipping)
    const ratio = refundableProductTotal > 0 ? Math.min(1, refund / refundableProductTotal) : 1
    const targetReversal = Math.min(earn.points, computeClinicPoints(order.homecareAttributedSubtotal * ratio))
    const delta = round2(targetReversal - reversedAbs)
    if (delta <= 0) return { reversed: false, points: 0 }

    if (earn.status === 'PENDING' && ratio >= 1) {
      await tx.clinicPointTransaction.update({
        where: { id: earn.id },
        data: { status: 'REVERSED' },
      })
      await tx.clinicPointTransaction.create({
        data: {
          clinicUserId: earn.clinicUserId,
          orderId,
          scriptVersionId: earn.scriptVersionId,
          points: -delta,
          eligibleAmount: -order.homecareAttributedSubtotal,
          type: 'REVERSE',
          status: 'REVERSED',
          idempotencyKey: `reverse:${orderId}:${targetReversal.toFixed(2)}`,
          description: `Pending Clinic Points cancelled for ${order.orderNumber}`,
        },
      })
      return { reversed: true, points: delta }
    }

    const reversalPending = earn.status === 'PENDING'
    await tx.clinicPointTransaction.create({
      data: {
        clinicUserId: earn.clinicUserId,
        orderId,
        scriptVersionId: earn.scriptVersionId,
        points: -delta,
        eligibleAmount: round2(-(order.homecareAttributedSubtotal * ratio)),
        type: 'REVERSE',
        status: reversalPending ? 'PENDING' : 'AVAILABLE',
        availableAt: reversalPending ? earn.availableAt : null,
        idempotencyKey: `reverse:${orderId}:${targetReversal.toFixed(2)}`,
        description: `Clinic Points reversed for ${order.orderNumber}`,
      },
    })
    return { reversed: true, points: delta }
  })
}
