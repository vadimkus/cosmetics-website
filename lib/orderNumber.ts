import crypto from 'crypto'
import { prisma } from '@/lib/prisma'

type OrderChannel = 'M' | 'W'
type PaymentKind = 'COD' | 'CARD'

function pad2(n: number) {
  return String(n).padStart(2, '0')
}

function yymmdd(d: Date) {
  const yy = String(d.getFullYear()).slice(-2)
  const mm = pad2(d.getMonth() + 1)
  const dd = pad2(d.getDate())
  return `${yy}${mm}${dd}`
}

function random4() {
  return String(crypto.randomInt(0, 10000)).padStart(4, '0')
}

/**
 * Canonical order number format (requested):
 * - COD mobile:     CODMYYMMDD####   (example: CODM2512160421)
 * - COD website:    CODWYYMMDD####   (example: CODW2512160421)
 * - Card mobile:    GENCardMYYMMDD#### (example: GENCardM2512160421)
 * - Card website:   GENCardWYYMMDD#### (example: GENCardW2512160421)
 */
function buildOrderNumber(channel: OrderChannel, payment: PaymentKind, datePart: string) {
  if (payment === 'COD') return `COD${channel}${datePart}${random4()}`
  return `GENCard${channel}${datePart}${random4()}`
}

/**
 * Partner (clinic/salon) replenishment orders use a distinct `PART` prefix so
 * they are unmistakable at a glance (e.g. PARTW2607100852). Channel letter is
 * preserved (W website, M app) so lib/orderChannel can still resolve the source.
 */
export async function generateUniquePartnerOrderNumber(args: {
  channel: OrderChannel
  date?: Date
}): Promise<string> {
  const datePart = yymmdd(args.date || new Date())
  for (let attempt = 0; attempt < 10; attempt++) {
    const candidate = `PART${args.channel}${datePart}${random4()}`
    const existing = await prisma.order.findUnique({
      where: { orderNumber: candidate },
      select: { id: true },
    })
    if (!existing) return candidate
  }
  return `PART${args.channel}${datePart}${random4()}${crypto.randomInt(0, 10)}`
}

/**
 * Generates a unique order number with collision detection.
 * 
 * Format: `{PREFIX}{CHANNEL}YYMMDD####`
 * - COD mobile: `CODM2512160421`
 * - COD website: `CODW2512160421`
 * - Card mobile: `GENCardM2512160421`
 * - Card website: `GENCardW2512160421`
 * 
 * @param args.channel - 'M' for mobile app, 'W' for website
 * @param args.payment - 'COD' for cash on delivery, 'CARD' for card payment
 * @param args.date - Optional date for the order (defaults to now)
 * @returns Unique order number string
 * 
 * @example
 * ```ts
 * const orderNumber = await generateUniqueOrderNumber({
 *   channel: 'W',
 *   payment: 'COD'
 * })
 * // Returns: "CODW2501280421"
 * ```
 */
export async function generateUniqueOrderNumber(args: {
  channel: OrderChannel
  payment: PaymentKind
  date?: Date
}) {
  const datePart = yymmdd(args.date || new Date())

  // Collision-resistant, but still check uniqueness due to unique constraint.
  for (let attempt = 0; attempt < 10; attempt++) {
    const candidate = buildOrderNumber(args.channel, args.payment, datePart)
    const existing = await prisma.order.findUnique({
      where: { orderNumber: candidate },
      select: { id: true },
    })
    if (!existing) return candidate
  }

  // Fallback: add random suffix if we somehow collide repeatedly.
  return `${buildOrderNumber(args.channel, args.payment, datePart)}${crypto.randomInt(0, 10)}`
}







