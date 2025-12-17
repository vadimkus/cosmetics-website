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




