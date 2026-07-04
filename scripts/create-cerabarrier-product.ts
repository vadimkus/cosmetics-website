/**
 * Creates the CERABARRIER BIOME GEL CLEANSER product (productNumber 66).
 *
 * Two retail sizes as DB variants (source of truth for the size selector):
 *   200ml (Homecare)     — 380 AED (default)
 *   600ml (Professional) — 620 AED
 *
 * Content sourced from the official GENOSYS CERABARRIER BIOME GEL CLEANSER
 * presentation (Jul 2026). Idempotent: re-running updates the same product.
 *
 * Run: npx tsx --env-file=.env.local scripts/create-cerabarrier-product.ts
 */
import { prisma } from '../lib/prisma'

const PRODUCT_NUMBER = '66'

const productData = {
  name: 'CERABARRIER BIOME GEL CLEANSER',
  productNumber: PRODUCT_NUMBER,
  price: 380, // default = 200ml retail
  category: 'Cleanser',
  image: '/images/cera/main.jpeg',
  // Gallery only — web + mobile prepend the main image automatically
  images: JSON.stringify([
    '/images/cera/S1.jpeg',
    '/images/cera/S2.jpeg',
    '/images/cera/S3.jpeg',
    '/images/cera/S4.jpeg',
    '/images/cera/S5.jpeg',
  ]),
  inStock: true,
  size: '200ml',

  description: `GENOSYS CERABARRIER BIOME GEL CLEANSER is a daily cleanser powered by the synergy of Pink Ceramide and the skin microbiome, supporting a long-lasting moisture barrier for a soft, hydrated finish. It goes beyond cleansing — cleansing, soothing and hydration all at once.

A soft gel texture transforms into a dense, rich foam upon contact with water. The smooth-rolling gel and abundant bubbles minimize skin friction for a gentle, comfortable cleansing experience — powerful enough to thoroughly remove sebum, impurities and base makeup, yet non-stripping, with a refreshing finish and no slippery or greasy residue.

Clinically proven hydration power in just one use: 145.8% immediate skin hydration improvement post-wash and a 2.4x increase in skin hydration — a powerful barrier cleanser that inhibits moisture loss.

Available in two sizes: 200ml (Homecare) and 600ml (Professional).`,

  productDetails: JSON.stringify({
    form: 'Gel-to-foam cleanser',
    size: '200ml (Homecare) / 600ml (Professional)',
    skinType: 'All skin types, including sensitive',
    technology: 'CERABARRIER BIOME™ — Barrier Lipid Complex + Microbiome Complex',
    keyBenefits: 'Superior cleansing, soothing, hydrating, barrier strengthening',
    usage: 'Daily, morning and evening',
    origin: 'South Korea',
    pdfBrochure: '/documents/ppt/GENOSYS%20CERABARRIER%20BIOME%20GEL%20CLEANSER.pdf',
  }),

  benefits: JSON.stringify([
    'Cleansing + soothing + hydration all at once — beyond cleansing',
    'Thoroughly removes sebum, impurities and base makeup in one wash',
    'Clinically proven: 145.8% immediate hydration improvement post-wash',
    '2.4x increase in skin hydration — inhibits moisture loss',
    'Gel-to-foam texture minimizes friction for a gentle, comfortable cleanse',
    'Non-stripping formula with a refreshing, residue-free finish',
    'Strengthens the skin barrier with Pink Ceramide complex and 5 ceramides',
    'Balances the skin microbiome with pro- and prebiotics',
  ]),

  ingredients: JSON.stringify([
    {
      name: 'CERABARRIER BIOME™ Complex',
      description: 'A synergistic complex that supports both the skin barrier and skin microbiome balance for a healthy skin environment.',
    },
    {
      name: '5 Ceramides (NP, AS, AP, NS, EOP)',
      description: 'Core barrier lipids making up ~50% of the skin barrier — essential for reinforcing the protective layer and preventing moisture loss.',
    },
    {
      name: 'Cholesterol & Phytosphingosine',
      description: 'Cholesterol stabilizes the lipid structure of the skin barrier; phytosphingosine is a ceramide precursor that strengthens the barrier to prevent water loss and maintain skin homeostasis.',
    },
    {
      name: 'Shea Butter',
      description: 'Rich in triglycerides and fatty acids, providing intensive hydration and helping protect the skin barrier — even after cleansing.',
    },
    {
      name: 'Probiotics (Bifida & Lactobacillus Ferment Lysates)',
      description: 'Lactobacillus-derived components that help maintain a balanced skin microbiome.',
    },
    {
      name: 'Prebiotics (Fructan, Chicory Root & Dandelion Root Extracts)',
      description: 'Nutritional sources that promote the growth of beneficial skin bacteria — pro- and prebiotics work together to balance the microbiome.',
    },
    {
      name: 'Pink Ceramide Complex',
      description: 'A vitality-boosting blend of Epilobium angustifolium (fireweed) extract, lactobacillus ferment lysate and ceramide NP to re-energize the skin.',
    },
    {
      name: 'Anastatica Hierochuntica (Resurrection Plant) Extract',
      description: 'Known for its resilient vitality in extreme desert environments. Rich in flavonoids and phenolic compounds for potent antioxidant, anti-inflammatory and soothing benefits.',
    },
    {
      name: 'Fructan',
      description: 'Excellent moisture retention and hydration power, soothing anti-inflammatory relief, and prebiotic support for a healthy microbiome.',
    },
  ]),

  howToUse: `Use daily, morning and evening.

1. Dispense an appropriate amount onto damp palms.
2. Work the gel into a dense, rich foam with a little water.
3. Gently massage over the face — the smooth-rolling foam minimizes friction.
4. Rinse thoroughly with lukewarm water.

Skin feels comfortable and hydrated after every wash — no tightness, no slippery or greasy residue. Suitable as the first step of every homecare routine (200ml) and professional treatment protocol (600ml).`,

  skinType: 'all',
  targetConcerns: JSON.stringify(['hydration', 'sensitive-skin', 'barrier-repair', 'cleansing']),
  usage: 'morning-evening',
  ageGroup: 'adult',
  rating: 5,
  noDiscount: false,
  isHidden: false,
}

const variants = [
  { size: '200ml', price: 380, isDefault: true, available: true },
  { size: '600ml', price: 620, isDefault: false, available: true },
]

async function main() {
  const existing = await prisma.product.findFirst({ where: { productNumber: PRODUCT_NUMBER } })

  let productId: string
  if (existing) {
    const updated = await prisma.product.update({ where: { id: existing.id }, data: productData })
    productId = updated.id
    console.log('Updated existing product:', updated.name, updated.id)
  } else {
    const created = await prisma.product.create({ data: productData })
    productId = created.id
    console.log('Created product:', created.name, created.id)
  }

  // Recreate variants idempotently
  await prisma.productVariant.deleteMany({ where: { productId } })
  for (const v of variants) {
    await prisma.productVariant.create({ data: { productId, ...v } })
  }
  console.log('Variants set:', variants.map(v => `${v.size} @ ${v.price} AED${v.isDefault ? ' (default)' : ''}`).join(' | '))

  const check = await prisma.product.findUnique({ where: { id: productId }, include: { variants: true } })
  console.log('Verify:', JSON.stringify({
    productNumber: check?.productNumber,
    price: check?.price,
    image: check?.image,
    gallery: check?.images ? JSON.parse(check.images).length + ' images' : 'none',
    variants: check?.variants.map(v => `${v.size}:${v.price}`),
  }, null, 2))
  console.log('URL: https://genosys.ae/products/' + PRODUCT_NUMBER)
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
