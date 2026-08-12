/**
 * Set product 44 (HR³ MATRIX MEDI SCALP SHAMPOO α) ingredients from Intertek
 * MEDI SHAMPOO ALPHA formula (Full INCI + key actives).
 *
 * Source:
 *   Intertek/MEDI SHAMPOO ALPHA/Formula-GENOSYS HR3 MATRIX MEDI SCALP SHAMPOO α.pdf
 *
 * Dry run:
 *   npx tsx --env-file=.env.local scripts/update-product-44-ingredients.ts
 * Apply:
 *   npx tsx --env-file=.env.local scripts/update-product-44-ingredients.ts --apply
 */
import { prisma } from '../lib/prisma'

const FULL_INCI =
  'Aqua (Water), Sodium C14-16 Olefin Sulfonate, Coco-Betaine, Glycerin, C12-13 Alketh-9, Menthol, Caffeine, Copper Tripeptide-1, Biotin, Panthenol, Viscum Album (Mistletoe) Extract, Saccharomyces Cerevisiae Extract, Malt Extract, Acorus Calamus Root Extract, Panax Ginseng Root Extract, Glycine Soja (Soybean) Seed Extract, Serenoa Serrulata Fruit Extract, Piroctone Olamine, Tocopherol, Citric Acid, Diospyros Kaki Fruit Extract, Camellia Japonica Leaf Extract, Ceratonia Siliqua (Carob) Fruit Extract, Lecithin, Menthyl Lactate, Ethylhexylglycerin, Glycine, Glyceryl Oleate, 1,2-Hexanediol, Glyceryl Stearate, Butylene Glycol, Coco-Glucoside, Sorbitol, Polyquaternium-67, Decyl Glucoside, Disodium EDTA, Acrylates Copolymer, Propanediol, Potassium Benzoate, Parfum (Fragrance).'

const INGREDIENTS = [
  {
    name: 'Menthol',
    description:
      'Cooling scalp agent (1.12%) that helps reduce scalp heat and leaves a refreshing sensation after cleansing.',
  },
  {
    name: 'Caffeine',
    description:
      'Scalp stimulant (1%) that supports a healthier hair-anchoring environment and nutrient delivery to follicles.',
  },
  {
    name: 'Copper Tripeptide-1',
    description:
      'Signal peptide that supports collagen synthesis and helps strengthen the hair and scalp environment.',
  },
  {
    name: 'Biotin',
    description:
      'Vitamin B7 that supports hair structure and is part of the product’s functional scalp-care complex.',
  },
  {
    name: 'Panthenol (Provitamin B5)',
    description:
      'Humectant and conditioning agent that helps soothe and soften the scalp and hair after washing.',
  },
  {
    name: 'Viscum Album (Mistletoe) Extract',
    description:
      'Patented botanical extract used in the CSS complex to support scalp conditioning and hair-loss care claims.',
  },
  {
    name: 'Saccharomyces Cerevisiae Extract + Malt Extract',
    description:
      'Ferment and malt extracts that help nourish the scalp environment as part of the patented complex system.',
  },
  {
    name: 'Serenoa Serrulata (Saw Palmetto) Fruit Extract',
    description:
      'Botanical traditionally used in hair-thinning care to support a healthier follicle environment.',
  },
  {
    name: 'Piroctone Olamine',
    description:
      'Cosmetic biocide that helps control dandruff-related scalp imbalance while cleansing.',
  },
  {
    name: 'Acorus Calamus + Panax Ginseng + Soybean Extracts',
    description:
      'Botanical trio that conditions the scalp and complements the cooling, cleansing shampoo base.',
  },
  {
    name: 'Full INCI',
    description: FULL_INCI,
  },
]

async function main() {
  const product = await prisma.product.findFirst({
    where: { OR: [{ id: '44' }, { productNumber: '44' }] },
    select: { id: true, productNumber: true, name: true, ingredients: true },
  })
  if (!product) throw new Error('Product 44 not found')

  console.log('BEFORE ingredients:', product.ingredients ? `${product.ingredients.slice(0, 120)}…` : null)
  console.log('Would set', INGREDIENTS.length, 'ingredient cards including Full INCI')

  if (!process.argv.includes('--apply')) {
    console.log('DRY RUN — pass --apply to write')
    return
  }

  const updated = await prisma.product.update({
    where: { id: product.id },
    data: { ingredients: JSON.stringify(INGREDIENTS) },
    select: { id: true, name: true, ingredients: true },
  })
  console.log('AFTER cards:', JSON.parse(updated.ingredients || '[]').map((i: { name: string }) => i.name))
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
