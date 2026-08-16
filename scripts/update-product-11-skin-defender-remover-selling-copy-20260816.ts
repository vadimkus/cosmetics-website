/**
 * Product 11 SKIN DEFENDER LIP & EYE MAKEUP REMOVER - selling-tone +
 * Intertek rewrite.
 *
 * Replaces the vitamin / peptide / ophthalmology / all-skin-types pitch
 * with copy that matches the current DTS MG formula and the English
 * carton. Function is makeup remover. Shake, cotton pad, hold a few
 * seconds, wipe. The oil layer is cetyl ethylhexanoate 27.8%,
 * disiloxane 13%, isohexadecane 9%. Not a face wash. Not a peptide
 * treatment.
 *
 * Shared Neon DB = production. The bespoke page reads these fields for
 * metadata and leftover generic PDP cards.
 */
import { PrismaClient } from '@prisma/client'
import { REMOVER_FULL_INCI } from '../components/product/remover/removerCopy'

const url = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL || ''
const prisma = new PrismaClient({ accelerateUrl: url } as never)

const DESCRIPTION =
  '200ml. Fresh, non-greasy lip and eye makeup remover. Shake the yellow oil into the water, soak a cotton pad, hold a few seconds on the lips and the eye area, then wipe. Cetyl ethylhexanoate 27.8%, disiloxane 13%, isohexadecane 9%. The vitamins and peptides sit at cosmetic trace. Not a face wash. Dermatologically tested.'

const DESCRIPTION_AR =
  '200 مل. مزيل مكياج منعش غير دهني للشفاه والعين. رجّي الزيت الأصفر في الماء، بلّلي قطنة، انتظري ثوانٍ على الشفاه ومحيط العين، ثم امسحي. سيتيل إيثيل هكسانوات 27.8%، ديسيلوكسان 13%، إيزوهكسا ديكان 9%. الفيتامينات والببتيدات عند أثر تجميلي. ليس غسول وجه. مختبر جلدياً.'

const DESCRIPTION_RU =
  '200 мл. Свежее, нежирное средство для снятия макияжа с губ и глаз. Встряхните жёлтое масло в воду, смочите диск, подержите несколько секунд на губах и области глаз, затем сотрите. Цетилэтилгексаноат 27,8%, дисилоксан 13%, изогексадекан 9%. Витамины и пептиды в косметическом следе. Не умывание. Дерматологически протестировано.'

const PRODUCT_DETAILS = JSON.stringify({
  form: 'Wipe-off biphasic makeup remover',
  size: '200ml',
  target: 'Lip and eye makeup',
  technology: 'Shake oil into water, then wipe',
  keyBenefits: 'Oil layer 49.8%, fresh non-greasy wipe',
  usage: 'Whenever you take makeup off',
  application: 'Shake, cotton pad, hold a few seconds, wipe',
  testing: 'Dermatologically tested',
  afterOpening: '12 months',
  origin: 'South Korea',
})

const KEY_FEATURES = JSON.stringify([
  {
    title: 'Shake, then wipe',
    description:
      'Two layers. Shake until the oil meets the water, soak a cotton pad, hold a few seconds, wipe. The carton stops here.',
  },
  {
    title: 'Cetyl ethylhexanoate 27.8%',
    description:
      'With disiloxane 13% and isohexadecane 9%. The oil layer is nearly half the bottle. That is the remover.',
  },
  {
    title: 'Fresh, not greasy',
    description:
      'Disiloxane flashes off. The carton calls it a fresh, non-greasy wipe after an oil.',
  },
  {
    title: 'Lips and the eye area only',
    description:
      'Not a face wash. Cleanse after. The vitamins and peptides sit at cosmetic trace.',
  },
])

const BENEFITS = JSON.stringify([
  'Lip and eye makeup remover in one bottle',
  'Shake, cotton pad, hold a few seconds, wipe',
  'Cetyl ethylhexanoate 27.8%, disiloxane 13%, isohexadecane 9%',
  'Fresh, not greasy',
  'Dermatologically tested',
])

const INGREDIENTS = JSON.stringify([
  {
    name: 'Cetyl ethylhexanoate 27.8%',
    description: 'The largest oil. Carries color off the lips and the eye area.',
  },
  {
    name: 'Disiloxane 13%',
    description:
      'A light silicone that flashes off. This is why the carton can say fresh and non-greasy.',
  },
  {
    name: 'Isohexadecane 9%',
    description: 'A light solvent. Together the three oils are 49.8% of the bottle.',
  },
  {
    name: 'Lactobacillus ferment 0.5%',
    description:
      'The largest named extra in the water. It is in the formula. It is not the remover.',
  },
  {
    name: 'Peptides at cosmetic trace',
    description:
      'Palmitoyl Tripeptide-5 sits at 0.65 ppb. Acetyl Tetrapeptide-5 sits at 0.5 ppb. They are not the engine.',
  },
  {
    name: 'Full INCI',
    description: REMOVER_FULL_INCI,
  },
])

const HOW_TO_USE = JSON.stringify([
  {
    step: 'Shake',
    instruction: 'Shake the bottle well so the oil and the water mix.',
  },
  {
    step: 'Apply',
    instruction: 'Soak a cotton pad. Put it on the lips and the eye area.',
  },
  {
    step: 'Hold',
    instruction: 'Wait a few seconds. Let the emulsion sit. Do not rub hard.',
  },
  {
    step: 'Wipe',
    instruction:
      'Gently wipe the makeup off. Keep it out of the eyes. If it gets in, rinse with cool water.',
  },
])

const DIRECTIONS =
  'For external use only. Keep off the eyes and mucous membranes; rinse with cool water if contact occurs. Stop and speak to a doctor if redness, swelling or irritation appears. Keep cool and dry, out of reach of children. Use within 12 months of opening. Dermatologically tested.'

const GALLERY = JSON.stringify([
  '/images/remover/carton.jpeg',
  '/images/remover/pack.jpeg',
  '/images/remover/carton-side.jpeg',
])

async function main() {
  const product = await prisma.product.findFirst({
    where: {
      OR: [
        { id: '11' },
        { productNumber: '11' },
        { name: { contains: 'SKIN DEFENDER' } },
      ],
    },
  })
  if (!product) throw new Error('product 11 not found')

  await prisma.product.update({
    where: { id: product.id },
    data: {
      productNumber: '11',
      description: DESCRIPTION,
      descriptionAr: DESCRIPTION_AR,
      descriptionRu: DESCRIPTION_RU,
      productDetails: PRODUCT_DETAILS,
      keyFeatures: KEY_FEATURES,
      benefits: BENEFITS,
      ingredients: INGREDIENTS,
      howToUse: HOW_TO_USE,
      directions: DIRECTIONS,
      image: '/images/remover/Main2.jpg',
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
