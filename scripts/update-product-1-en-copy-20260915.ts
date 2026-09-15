/**
 * Product 1 (Microneedle Roller): English DB copy aligned with the 21 Aug 2026
 * RU/AR audit (data/product1LocalizedCopy.ts). Sources: Overview of
 * Microneedling deck, Intertek/Rollers CE + ISO 13485.
 *
 * Drops: universal "450 needles", "25% thinner than competitors", "300% better
 * penetration", broad scar/pigment/pore/wrinkle promises, "every 4-6 weeks",
 * and the reuse instruction (the roller is single-use).
 *
 * Run: npx tsx --env-file=.env.local scripts/update-product-1-en-copy-20260915.ts
 */
import { PrismaClient } from '@prisma/client'

const databaseUrl = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL
if (!databaseUrl) throw new Error('DATABASE_URL or PRISMA_DATABASE_URL is required')
const prisma = new PrismaClient({ accelerateUrl: databaseUrl, log: ['error'] })

const description =
  'Professional single-use microneedle roller built on the GENOSYS Disk Needle Therapy System. ' +
  'The needles are SUS 304(H) stainless steel, 0.2 mm thick and gamma-sterilised in a sealed pouch. ' +
  'The 0.25 mm head carries 540 needles, the 0.5 mm head 450. Needles are formed on metal disks with no glue joints, ' +
  'so the roller runs evenly and creates controlled micro-channels inside a professional protocol. ' +
  'CE-marked; manufactured under ISO 13485.'

const productDetails = {
  type: 'Professional single-use microneedle roller',
  needleCount: '540 needles at 0.25 mm / 450 needles at 0.5 mm',
  needleThickness: '0.2 mm',
  needleMaterial: 'SUS 304(H) stainless steel',
  technology: 'GENOSYS Disk Needle Therapy System (DTS)',
  sterilization: 'Gamma-sterilised; individually sealed sterile pouch',
  usage: 'Professional protocols set by the practitioner',
  availableLengths: '0.1 / 0.15 / 0.2 / 0.25 / 0.5 mm',
  safety: 'Single use only; do not re-use',
  certification: 'CE; manufacturer quality system ISO 13485',
  origin: 'Made in Korea',
}

const keyFeatures = [
  {
    title: 'Disk Needle Therapy System',
    description:
      'Needles are formed on metal disks and evenly spaced. No glue joints, so there is nothing to shed a needle mid-pass.',
  },
  {
    title: '0.2 mm needles',
    description:
      'SUS 304(H) stainless steel, thinner than the 0.25-0.3 mm standard in the manufacturer comparison, for a more comfortable pass.',
  },
  {
    title: 'Sterile and checked',
    description:
      'Every roller is gamma-sterilised. The indicator on the pouch changes colour once sterilisation is complete.',
  },
  {
    title: 'CE and ISO 13485',
    description: 'CE-marked device from a manufacturer whose quality management system is certified to ISO 13485.',
  },
]

const benefits = [
  'Creates even, controlled micro-channels within a professional treatment',
  'Helps suitable microneedling products reach where they are applied',
  'Disk-mounted needles roll smoothly and are not held by glue',
  '0.2 mm needles make the pass more comfortable',
  'Several lengths let the practitioner match the roller to the area and the goal',
  'Sterile single-use pouch keeps the procedure hygienic',
]

const howToUse = [
  {
    step: 'Choose the length',
    instruction:
      'Needle length and treatment interval are set by a qualified practitioner for the area, skin condition and goal.',
  },
  {
    step: 'Prepare',
    instruction:
      'Cleanse and prepare the skin to the professional protocol. Open the sterile pouch immediately before the procedure.',
  },
  {
    step: 'Roll',
    instruction:
      'Work slowly with controlled pressure in horizontal, vertical and diagonal passes. Avoid zig-zag or abrupt movements.',
  },
  {
    step: 'Aftercare',
    instruction: 'Use only products suitable for post-procedure care, and always finish with sun protection.',
  },
  {
    step: 'Dispose',
    instruction: 'The roller is single-use. Do not clean, disinfect or re-use it.',
  },
]

const directions =
  'For professional use by a trained practitioner. Do not use with metal allergy, a tendency to keloid scarring, ' +
  'severe atopic dermatitis, rosacea, couperose, psoriasis, bleeding disorders, uncontrolled diabetes or severe hypertension. ' +
  'Do not use on damaged, inflamed or infected skin. Needle length, pressure and interval are set individually by the practitioner. ' +
  'Sterile, single use only.'

async function main() {
  const p = await prisma.product.findFirst({
    where: { productNumber: '1' },
    select: { id: true, name: true },
  })
  if (!p) throw new Error('Product 1 not found')

  const updated = await prisma.product.update({
    where: { id: p.id },
    data: {
      description,
      productDetails: JSON.stringify(productDetails),
      keyFeatures: JSON.stringify(keyFeatures),
      benefits: JSON.stringify(benefits),
      howToUse: JSON.stringify(howToUse),
      directions,
    },
    select: { id: true, name: true, description: true },
  })
  console.log('AFTER:', updated)
}

main().finally(() => prisma.$disconnect())
