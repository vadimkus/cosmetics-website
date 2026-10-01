/**
 * Product 18 MOISTURE REPLENISHING HYALURON SERUM: slide 4 becomes s4b ("Drink from drop one."),
 * and the record stops citing the test panel. The benefit stays, in our own voice.
 *
 * Run: npx tsx --env-file=.env.local scripts/update-product-18-drink-from-drop-one-20261001.ts
 */
import { prisma } from '../lib/prisma'

const OLD_SLIDE = '/images/hsserum_v2/s4.jpg'
const NEW_SLIDE = '/images/hsserum_v2/s4b.jpg'
const OLD_SENTENCE = 'In a DTS MG test on 21 women, deep skin hydration rose immediately after one use.'
const NEW_SENTENCE = 'Deep hydration rises from the very first use.'
const BENEFIT_SWAP: Record<string, string> = {
  'Deep skin hydration up right after one use (DTS MG test, 21 women)': 'Deep hydration rises from the very first use',
  'Dermatologically tested. Made in Korea, DTS MG': 'Dermatologically tested. Made in Korea',
}

async function main() {
  const p = await prisma.product.findFirst({ where: { productNumber: '18' } })
  if (!p) throw new Error('product 18 not found')
  const gallery: string[] = JSON.parse(p.images || '[]')
  if (!gallery.includes(OLD_SLIDE)) throw new Error('s4 not in the gallery')
  if (!p.description?.includes(OLD_SENTENCE)) throw new Error('test sentence not in the description')
  const benefits: string[] = JSON.parse(p.benefits || '[]')
  const nextBenefits = benefits.map(b => BENEFIT_SWAP[b] ?? b)
  if (nextBenefits.filter((b, i) => b !== benefits[i]).length !== 2) throw new Error('expected 2 benefits to change')
  await prisma.product.update({
    where: { id: p.id },
    data: {
      images: JSON.stringify(gallery.map(g => (g === OLD_SLIDE ? NEW_SLIDE : g))),
      description: p.description.replace(OLD_SENTENCE, NEW_SENTENCE),
      benefits: JSON.stringify(nextBenefits),
    },
  })
  console.log('product 18 updated: gallery s4 -> s4b, description and benefits without the test panel')
}

main().finally(() => prisma.$disconnect())
