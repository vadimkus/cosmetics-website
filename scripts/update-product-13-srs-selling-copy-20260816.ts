/**
 * Product 13 SKIN RENEWAL PEELING SYSTEM (SRS) - selling-tone +
 * Intertek rewrite.
 *
 * Replaces the fruit-acid / healing-peptide / neutralize / licensed
 * practitioner / pregnancy pitch with copy that matches the Quali-quanti
 * formula, the English carton, and the COA pH. Function is soft peeling.
 * Glycolic 15%, lactic 13.5%, mandelic 2%. Apply, 15-20 minutes, cold
 * rinse. Peptide at 0.1 ppb. Not Epi.
 *
 * Shared Neon DB = production. The bespoke page reads these fields for
 * metadata and leftover generic PDP cards.
 */
import { PrismaClient } from '@prisma/client'
import { SRS_FULL_INCI } from '../components/product/srs/srsCopy'

const url = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL || ''
const prisma = new PrismaClient({ accelerateUrl: url } as never)

const DESCRIPTION =
  '2ml × 10. Professional AHA peel. Glycolic acid 15%, lactic acid 13.5%, mandelic acid 2%. Apply evenly, keep off the lips and the eye area, sit 15-20 minutes, rinse with cold water. Soft peeling. The peptide sits at 0.1 ppb. Not the home cellulose roll. Dermatologically tested.'

const DESCRIPTION_AR =
  '2 مل × 10. تقشير AHA مهني. حمض الجليكوليك 15%، حمض اللاكتيك 13.5%، حمض الماندليك 2%. وزّعي بالتساوي، أبعدي عن الشفاه ومحيط العين، انتظري 15-20 دقيقة، اشطفي بماء بارد. تقشير خفيف. الببتيد عند 0.1 جزء في البليون. ليس التدحرج المنزلي بالسليلوز. مختبر جلدياً.'

const DESCRIPTION_RU =
  '2 мл × 10. Профессиональный AHA-пилинг. Гликолевая кислота 15%, молочная 13,5%, миндальная 2%. Нанесите равномерно, не на губы и область глаз, держите 15-20 минут, смойте холодной водой. Мягкий пилинг. Пептид сидит на 0,1 ppb. Не домашний целлюлозный гоммаж. Дерматологически протестировано.'

const PRODUCT_DETAILS = JSON.stringify({
  form: 'Professional rinse-off AHA peel',
  size: '2ml × 10',
  target: 'Soft peeling, smoother brighter tone',
  technology: 'Glycolic 15%, lactic 13.5%, mandelic 2%',
  keyBenefits: 'Apply, sit 15-20 min, cold rinse',
  usage: 'Professional peeling system',
  application: 'Apply evenly, 15-20 minutes, rinse with cold water',
  testing: 'Dermatologically tested',
  origin: 'South Korea',
})

const KEY_FEATURES = JSON.stringify([
  {
    title: 'Apply, then rinse cold',
    description:
      'Even coat, keep off the lips and the eye area, sit 15-20 minutes, rinse with cold water. The carton stops here.',
  },
  {
    title: 'Glycolic acid 15%',
    description:
      'With lactic 13.5% and mandelic 2%. That is 30.5% acids in a 2 ml vial. That is the peel.',
  },
  {
    title: 'Soft peeling',
    description:
      'The carton function. High-AHA. The Korean carton says speak to a professional.',
  },
  {
    title: 'Not Epi',
    description:
      'Epi is enzyme and cellulose at home. This is the clinic AHA. The peptide sits at 0.1 ppb.',
  },
])

const BENEFITS = JSON.stringify([
  'Professional AHA peel in a 2 ml vial',
  'Apply, sit 15-20 minutes, rinse with cold water',
  'Glycolic 15%, lactic 13.5%, mandelic 2%',
  'Soft peeling. Not the home cellulose roll',
  'Dermatologically tested',
])

const INGREDIENTS = JSON.stringify([
  {
    name: 'Glycolic acid 15%',
    description: 'The largest AHA. This is why dead surface cells come off.',
  },
  {
    name: 'Lactic acid 13.5%',
    description:
      'The second AHA. With glycolic it is most of the vial after water and glycerin.',
  },
  {
    name: 'Mandelic acid 2%',
    description: 'The third AHA. A real figure on the card.',
  },
  {
    name: 'pH 3.02',
    description:
      'Inside a 3.00 to 5.00 specification. Sodium hydroxide 2.7% is the buffer. Glycerin is 25%.',
  },
  {
    name: 'Peptide at cosmetic trace',
    description:
      'sh-Polypeptide-7 sits at 0.1 ppb. It is in the formula. It is not the peel.',
  },
  {
    name: 'Full INCI',
    description: SRS_FULL_INCI,
  },
])

const HOW_TO_USE = JSON.stringify([
  {
    step: 'Patch test',
    instruction: 'Always patch test before the first use.',
  },
  {
    step: 'Apply',
    instruction: 'Spread evenly on the face. Keep off the lips and the eye area.',
  },
  {
    step: 'Sit',
    instruction:
      '15-20 minutes. Do not neutralize. The carton does not print a neutralize step.',
  },
  {
    step: 'Rinse',
    instruction: 'Rinse thoroughly with cold water. Then sunscreen.',
  },
])

const DIRECTIONS =
  'For external use only. Keep off the eyes and mucous membranes; rinse with cool water if contact occurs. Do not apply to broken, scratched, open or irritated skin. Always patch test. Use sunscreen after. Stop and speak to a doctor if redness, swelling or irritation appears. Keep cool and dry, out of reach of children. Dermatologically tested.'

const GALLERY = JSON.stringify([
  '/images/srs/carton-vial.jpeg',
  '/images/srs/kit-open.jpeg',
  '/images/srs/vial.jpeg',
])

async function main() {
  const product = await prisma.product.findFirst({
    where: {
      OR: [
        { id: '13' },
        { productNumber: '13' },
        { name: { contains: 'SKIN RENEWAL PEELING' } },
      ],
    },
  })
  if (!product) throw new Error('product 13 not found')

  await prisma.product.update({
    where: { id: product.id },
    data: {
      productNumber: '13',
      description: DESCRIPTION,
      descriptionAr: DESCRIPTION_AR,
      descriptionRu: DESCRIPTION_RU,
      productDetails: PRODUCT_DETAILS,
      keyFeatures: KEY_FEATURES,
      benefits: BENEFITS,
      ingredients: INGREDIENTS,
      howToUse: HOW_TO_USE,
      directions: DIRECTIONS,
      image: '/images/SRS.jpg',
      images: GALLERY,
    },
  })

  console.log('updated', product.id, product.productNumber, product.name)
}

main()
  .then(async () => {
    await prisma.$disconnect()
    process.exit(0)
  })
  .catch(async (error) => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })
