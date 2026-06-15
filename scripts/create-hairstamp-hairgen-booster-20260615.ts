/**
 * Create product: "HairStamp For HAIRGEN BOOSTER" (HR³ MATRIX HAIR STAMP).
 *
 * - Category: Scalp/Hair
 * - Price: 600 AED retail (orderable, not price-on-request)
 * - Size: 1 box - 8 pcs of hair stamp
 * - Image: /images/BStamp1.png
 * - productNumber: next free numeric id (expected 64), verified before insert.
 *
 * Usage: npx tsx scripts/create-hairstamp-hairgen-booster-20260615.ts
 */
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })
if (!process.env.DATABASE_URL && !process.env.PRISMA_DATABASE_URL) {
  dotenv.config({ path: path.resolve(process.cwd(), '.env') })
}

const NAME = 'HairStamp For HAIRGEN BOOSTER'

async function main() {
  const { prisma } = await import('../lib/prisma')

  // Idempotency: don't create twice.
  const existing = await prisma.product.findFirst({ where: { name: NAME }, select: { id: true, productNumber: true } })
  if (existing) {
    console.log('Product already exists, skipping create:', existing)
    return
  }

  // Compute next free numeric product number from both `id` and `productNumber`.
  const rows = await prisma.product.findMany({ select: { id: true, productNumber: true } })
  const used = new Set<number>()
  for (const r of rows) {
    const a = Number(r.productNumber)
    const b = Number(r.id)
    if (Number.isInteger(a)) used.add(a)
    if (Number.isInteger(b)) used.add(b)
  }
  let next = 1
  while (used.has(next)) next++
  const productNumber = String(next)
  console.log('Assigning productNumber:', productNumber)

  const productData = {
    productNumber,
    name: NAME,
    price: 600,
    isPriceOnRequest: false,
    inStock: true,
    category: 'Scalp/Hair',
    image: '/images/BStamp1.png',
    size: '1 box - 8 pcs of hair stamp',

    description: `The GENOSYS HR³ MATRIX HAIR STAMP is a precision microneedle applicator developed for the GENOSYS HairGen Booster scalp treatment system. Each stamp head is fitted with an array of ultra-fine microneedles that create temporary microchannels in the scalp, dramatically increasing skin permeability so the active ingredients of HR³ MATRIX HAIR SOLUTION α are delivered directly to the hair follicles and surrounding tissue.

When mounted on the HairGen Booster, the stamp performs automatic microneedling — a gentle, massaging action that creates far more microchannels than manual stamping or rolling while minimizing discomfort. The micro-injuries also trigger the skin's natural wound-healing response, supporting scalp regeneration, improved blood circulation and a healthier environment for hair growth.

Supplied as 1 box containing 8 hair stamps. A fresh stamp is used together with a new dose of HR³ MATRIX HAIR SOLUTION α for every treatment to ensure hygienic, contamination-free application. Manufactured in South Korea.`,

    productDetails: JSON.stringify({
      form: 'Disposable microneedle stamp applicator',
      size: '1 box - 8 pcs of hair stamp',
      compatibility: 'GENOSYS HairGen Booster device; pairs with HR³ MATRIX HAIR SOLUTION α',
      needles: '140 ultra-fine microneedles per stamp',
      usage: 'Single use per treatment — replace stamp and solution each session',
      origin: 'South Korea',
    }),

    benefits: JSON.stringify([
      'Creates microchannels that boost absorption of HR³ MATRIX HAIR SOLUTION α',
      'Enables automatic microneedling with the HairGen Booster for more even, comfortable treatment',
      'Stimulates the scalp and triggers the natural wound-healing response',
      'Supports improved scalp circulation and a healthier hair-growth environment',
      'Single-use design prevents cross-contamination between treatments',
    ]),

    ingredients: JSON.stringify([
      {
        name: 'Microneedle stamp head',
        description: 'Array of 140 ultra-fine medical-grade microneedles that physically penetrate the upper scalp to open transient delivery channels.',
      },
    ]),

    howToUse: `1. Cleanse and dry the scalp (use HR³ MATRIX SCALP PEELING α / shampoo first if desired).
2. Mount a new HR³ MATRIX HAIR STAMP onto the HairGen Booster and load a fresh HR³ MATRIX HAIR SOLUTION α ampoule.
3. Switch on the device and glide the stamp over the treatment area; the automatic microneedling delivers the solution over a ~10-minute session.
4. Discard the stamp after the session — use a new stamp and solution for each treatment.

Recommended frequency: as advised in your professional or homecare protocol.`,

    directions: `For external scalp use only. Use a new, sterile stamp for every treatment and never share between clients. Do not use on broken, inflamed, infected or sunburned scalp. Discontinue if irritation persists. Keep out of reach of children. Store in a cool, dry place away from direct sunlight.`,

    skinType: 'all',
    targetConcerns: JSON.stringify(['hair-loss']),
    usage: 'as-needed',
    ageGroup: 'adult',
    rating: 5,
    noDiscount: false,
    isHidden: false,
  }

  const result = await prisma.product.create({ data: productData })
  console.log('✅ Created product:', result.name)
  console.log('   id:', result.id)
  console.log('   productNumber:', result.productNumber)
  console.log('   category:', result.category)
  console.log('   price:', result.price)
  console.log('   size:', result.size)
  console.log('   image:', result.image)
  console.log('   URL: https://genosys.ae/products/' + result.productNumber)
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
