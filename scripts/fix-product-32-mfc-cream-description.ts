/**
 * Fix product 32 (MULTI FUNCTIONAL ANTI-WRINKLE CREAM) description:
 * remove false Peptide 6 claim (serum 22 only) and align copy with Intertek
 * PPTX / formula / artwork (Bakuchiol, propolis, collagen, adenosine,
 * niacinamide, mango butter, ceramides · AM/PM massage).
 *
 * Run:
 *   npx tsx --env-file=.env.local scripts/fix-product-32-mfc-cream-description.ts
 */
import { PrismaClient } from '@prisma/client'

const databaseUrl = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL
if (!databaseUrl) throw new Error('DATABASE_URL or PRISMA_DATABASE_URL is required')

const prisma = new PrismaClient(
  databaseUrl.includes('prisma.io') || databaseUrl.includes('accelerate')
    ? { accelerateUrl: databaseUrl, log: ['error'] }
    : { datasourceUrl: databaseUrl, log: ['error'] } as never,
)

const DESCRIPTION =
  '50g (Homecare) / 250g (Professional). Multi-functional anti-wrinkle and brightening cream with bakuchiol, a natural alternative to retinol. Helps visibly smooth wrinkles, reinforce skin firmness, and even skin tone with propolis, collagen, adenosine, niacinamide, mango seed butter, and a lipid barrier liposome. Gently massage morning and evening. Clinical study on improvement of skin age index, P&K Skin Research Center, Feb. 22 to May 13, 2024, 24 adult women aged 30~59 years. Key ingredients: Bakuchiol, Propolis Extract, Hydrolyzed Collagen & Elastin, Adenosine, Niacinamide, Mango Seed Butter, Lipid Barrier Liposome (Ceramide NP, Cholesterol, Phytosphingosine). Dermatologically tested. Efficacy test on improving wrinkles and skin tone balance.'

const INGREDIENTS = JSON.stringify([
  {
    name: 'Bakuchiol',
    description:
      'Natural plant-derived alternative to retinol (0.1%) that supports anti-aging benefits with a typically gentler, photostable profile.',
  },
  {
    name: 'Propolis Extract',
    description:
      'Bee-derived antioxidant that helps protect from oxidative stress and supports firming care alongside collagen.',
  },
  {
    name: 'Hydrolyzed Collagen & Elastin',
    description:
      'ECM support complex that helps reinforce the look of firmness and elasticity.',
  },
  {
    name: 'Adenosine',
    description:
      'Anti-aging active (0.04%) that helps improve the look of wrinkles and skin texture.',
  },
  {
    name: 'Niacinamide',
    description:
      'Vitamin B3 (2%) that helps brighten and even skin tone while supporting barrier function.',
  },
  {
    name: 'Mango Seed Butter',
    description:
      'Mangifera Indica seed butter (0.8%) that nourishes and supports the antioxidant / comfort pillar.',
  },
  {
    name: 'Lipid Barrier Liposome (Ceramide NP, Cholesterol, Phytosphingosine)',
    description:
      'Essential lipids that strengthen the skin barrier and support ingredient delivery.',
  },
])

const HOW_TO_USE =
  'Apply a thin layer to face, neck and décolleté. Gently massage until absorbed. Use morning and evening. Follow with SPF during the day.'

const DIRECTIONS =
  'Dermatologically tested. Opaque white cream. For best results, massage morning and evening as part of your daily routine. Pair with MULTI FUNCTIONAL ANTI-WRINKLE SERUM (product 22) when using the Bakuchiol line.'

async function main() {
  const p = await prisma.product.findFirst({
    where: { OR: [{ id: '32' }, { productNumber: '32' }] },
    select: { id: true, name: true, description: true, ingredients: true },
  })
  if (!p) throw new Error('Product 32 not found')
  console.log('BEFORE description:', p.description)
  console.log('BEFORE ingredients:', p.ingredients)

  const updated = await prisma.product.update({
    where: { id: p.id },
    data: {
      description: DESCRIPTION,
      ingredients: INGREDIENTS,
      howToUse: HOW_TO_USE,
      directions: DIRECTIONS,
      usage: 'morning-evening',
    },
    select: { id: true, name: true, description: true, ingredients: true, howToUse: true },
  })
  console.log('AFTER description:', updated.description)
  console.log('AFTER ingredients:', updated.ingredients)
  console.log('AFTER howToUse:', updated.howToUse)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
