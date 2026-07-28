/**
 * Fix MULTI FUNCTIONAL ANTI-WRINKLE SERUM (22) usage + claim wording.
 * Artwork / brand deck: morning & evening; Bakuchiol photostable.
 *
 *   npx tsx --env-file=.env.local scripts/fix-product-22-bakuchiol-copy-20260728.ts
 *   npx tsx --env-file=.env.local scripts/fix-product-22-bakuchiol-copy-20260728.ts --apply
 */
import { PrismaClient } from '@prisma/client'

const databaseUrl = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL
if (!databaseUrl) throw new Error('DATABASE_URL or PRISMA_DATABASE_URL is required')

const prisma = new PrismaClient(
  databaseUrl.includes('prisma.io') || databaseUrl.includes('accelerate')
    ? { accelerateUrl: databaseUrl, log: ['error'] }
    : ({ datasourceUrl: databaseUrl, log: ['error'] } as never),
)

const HOW_TO_USE = JSON.stringify([
  {
    step: 'Preparation',
    instruction: 'Cleanse skin thoroughly and apply toner if desired',
  },
  {
    step: 'Application',
    instruction: 'Apply 2–3 drops to face and neck, avoiding the eye area',
  },
  {
    step: 'Massage',
    instruction: 'Gently massage in upward motions until fully absorbed',
  },
  {
    step: 'Follow-up',
    instruction: 'Apply moisturizer; always finish with sunscreen during daytime',
  },
  {
    step: 'Frequency',
    instruction:
      'Use morning and evening. Bakuchiol is photostable and daytime-friendly — still use SPF by day',
  },
  {
    step: 'Results',
    instruction: 'Visible improvements typically seen within 4–6 weeks of consistent use',
  },
])

const DIRECTIONS =
  'Dermatologically tested and clinically studied (skin age index, P&K Skin Research Center, 2024). For best results, use morning and evening as part of your daily routine. Suitable for most skin types; if irritation occurs, reduce frequency and stop if it continues. Store in a cool, dry place away from direct sunlight.'

const KEY_FEATURES = JSON.stringify([
  {
    title: 'Natural Retinol Alternative',
    description:
      'Features bakuchiol, a plant-derived alternative to retinol that supports anti-aging benefits with a typically gentler profile than classic retinol.',
  },
  {
    title: 'Advanced Peptide Complex',
    description:
      'Contains Anti-aging Peptide 6 and supporting peptides that target multiple signs of aging for comprehensive results.',
  },
  {
    title: 'Lipid Barrier Technology',
    description:
      'Liposome delivery with Ceramide NP, cholesterol, and phytosphingosine to support the barrier and ingredient delivery.',
  },
  {
    title: 'Clinical Validation',
    description:
      'Clinically studied for skin age index improvement (P&K Skin Research Center, Feb 22–May 13, 2024, 24 women aged 30–59). Efficacy tested on wrinkles and skin tone balance.',
  },
])

async function main() {
  const apply = process.argv.includes('--apply')
  const prod = await prisma.product.findFirst({
    where: { OR: [{ id: '22' }, { productNumber: '22' }] },
  })
  if (!prod) {
    console.log('Product 22 not found')
    return
  }

  console.log('id:', prod.id)
  console.log('current frequency step:', prod.howToUse)
  console.log('---')
  console.log('next howToUse:', HOW_TO_USE)
  console.log('next directions:', DIRECTIONS)

  if (!apply) {
    console.log('Dry run only. Pass --apply to update.')
    return
  }

  await prisma.product.update({
    where: { id: prod.id },
    data: {
      howToUse: HOW_TO_USE,
      directions: DIRECTIONS,
      keyFeatures: KEY_FEATURES,
    },
  })
  console.log('Updated product 22 howToUse, directions, keyFeatures.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
