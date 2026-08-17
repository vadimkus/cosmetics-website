import { prisma } from '../lib/prisma'
import { productTranslations } from '../data/productTranslations'

async function main() {
  for (const id of ['10', '16', '44', '5', '18', '38']) {
    const p = await prisma.product.findFirst({
      where: { productNumber: id },
      select: { ingredients: true },
    })
    const cards = JSON.parse(p?.ingredients || '[]')
    const full = cards.filter((c: { name?: string }) => String(c.name || '').toLowerCase().includes('inci'))
    const t = productTranslations[id]
    let tCards: unknown[] = []
    try {
      tCards = JSON.parse(t?.ingredients || 'null') || []
    } catch {
      tCards = ['parse-fail']
    }
    const tFull =
      Array.isArray(tCards) && tCards[0] && typeof tCards[0] === 'object'
        ? (tCards as { name?: string }[]).filter((c) => String(c.name || '').toLowerCase().includes('inci'))
        : []
    console.log({
      id,
      dbFull: full.length,
      arIng: t?.ingredients == null ? 'null' : 'yes',
      arType: Array.isArray(tCards) ? typeof tCards[0] : typeof tCards,
      arFull: tFull.length,
      arLen: Array.isArray(tCards) ? tCards.length : 0,
    })
  }
}

main()
  .finally(() => prisma.$disconnect())
