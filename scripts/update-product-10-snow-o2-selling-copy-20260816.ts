/**
 * Product 10 SNOW O2 CLEANSER - selling-tone + Intertek rewrite.
 *
 * Replaces the oxygen-therapy / Phytolex-as-engine / all-skin-types pitch
 * with copy that matches Formula_up + the English carton. The carton
 * function is facial cleanser. Apply on a dry face, wait for oxygen
 * bubbles, circular massage, rinse with tepid water. The bubbles come
 * from Methyl Perfluoroisobutyl Ether at 8%. Not oxygen therapy. Not a
 * Korean functional cosmetic.
 *
 * Shared Neon DB = production. The bespoke page reads these fields for
 * metadata and leftover generic PDP cards.
 */
import { prisma } from '../lib/prisma'
import { SNOW_O2_FULL_INCI } from '../components/product/snowo2/snowo2Copy'

const DESCRIPTION =
  '180 ml / 500 ml. Facial cleanser. Apply on a dry face, away from the eyes. Naturally generated oxygen bubbles lift make-up dirt and skin impurities; circular massage, then rinse with tepid water. The bubbles come from Methyl Perfluoroisobutyl Ether at 8%. Morning and evening. Dermatologically tested.'

const DESCRIPTION_AR =
  '180 مل / 500 مل. منظف وجه. يُوضع على وجه جاف، بعيداً عن العينين. فقاعات أكسجين تتولّد طبيعياً ترفع أوساخ المكياج وشوائب البشرة؛ تدليك دائري ثم شطف بماء فاتر. الفقاعات من Methyl Perfluoroisobutyl Ether بنسبة 8%. صباحاً ومساءً. مختبر جلدياً.'

const DESCRIPTION_RU =
  '180 мл / 500 мл. Очищающее средство для лица. Наносят на сухое лицо, в стороне от глаз. Естественно образующиеся кислородные пузырьки поднимают макияж и загрязнения; круговой массаж, затем смыть тёплой водой. Пузырьки даёт Methyl Perfluoroisobutyl Ether 8%. Утром и вечером. Дерматологически протестировано.'

const PRODUCT_DETAILS = JSON.stringify({
  form: 'Rinse-off facial cleanser',
  size: '180ml / 500ml',
  target: 'Make-up dirt and skin impurities',
  technology: 'Dry-face oxygen bubbles from ether 8%',
  keyBenefits: 'Dry-face wash, oxygen bubbles, tepid rinse',
  usage: 'Morning and evening',
  application: 'Dry face, bubbles, circular massage, tepid rinse',
  testing: 'Dermatologically tested',
  ph: '5.67, inside a 5.30 to 6.30 specification',
  appearance: 'Opaque viscous liquid',
  shelfLife: 'Three years unopened, expiry printed on the bottle',
  origin: 'South Korea',
})

const KEY_FEATURES = JSON.stringify([
  {
    title: 'Apply on a dry face',
    description:
      'The English carton starts here. No water first. Keep it off the eyes. The bubbles come up on dry skin.',
  },
  {
    title: 'Oxygen bubbles from ether 8%',
    description:
      'Methyl Perfluoroisobutyl Ether is the second-largest ingredient after water. That is why the bubbles form. The carton calls them naturally generated oxygen bubbles.',
  },
  {
    title: 'Massage, then rinse',
    description:
      'Circular movements, then tepid water. It is a wash, not a leave-on and not a scrub.',
  },
  {
    title: 'Two sizes, same formula',
    description:
      '180 ml at the sink. 500 ml on the clinic shelf. Same cleanser.',
  },
])

const BENEFITS = JSON.stringify([
  'Naturally generated oxygen bubbles lift make-up dirt and skin impurities - the carton sentence',
  'Starts on a dry face, away from the eyes',
  'Circular massage, then tepid water',
  'Ether 8% is why the bubbles form',
  '180 ml at home, 500 ml on the clinic shelf',
  'Dermatologically tested',
])

const INGREDIENTS = JSON.stringify([
  {
    name: 'Methyl Perfluoroisobutyl Ether 8%',
    description:
      'The reason the bubbles appear on a dry face. The carton calls them naturally generated oxygen bubbles. This is the figure that belongs on a card.',
  },
  {
    name: 'A wash that still feels comfortable',
    description:
      'Butylene glycol 4.1%, glycerin 4% and propanediol 1.8% sit under the foam, so the rinse does not leave the face tight. Humectant total 9.94%.',
  },
  {
    name: 'The clean itself',
    description:
      'Cocamide DEA, sodium laureth sulfate and decyl glucoside do the washing. This is a real cleanser, not a cream that happens to foam. Not sulfate-free.',
  },
  {
    name: 'Phytolex and MultiEx',
    description:
      'Named because leftover copy treated them as the reason to buy. Phytolex is a 0.2% premix; the finished extracts sit at 0.003%. MultiEx is a 0.01% premix. They are in the formula. They are not why the bubbles form.',
  },
  {
    name: 'Fragrance',
    description:
      'Parfum, limonene and hinoki water are in the formula. This is not a fragrance-free wash.',
  },
  {
    name: 'Full INCI',
    description: SNOW_O2_FULL_INCI,
  },
])

const HOW_TO_USE = JSON.stringify([
  {
    step: 'Apply',
    instruction: 'Put it on a dry face, away from the eyes. No water first.',
  },
  {
    step: 'Bubbles',
    instruction: 'Wait until the oxygen bubbles come up. That is the cleanser working.',
  },
  {
    step: 'Massage',
    instruction: 'Circular movements. The bubbles lift the make-up. You do not scrub.',
  },
  {
    step: 'Rinse',
    instruction: 'Tepid water, until the face is clear. Then toner, or whatever comes next.',
  },
])

const DIRECTIONS =
  'Dermatologically tested. For external use only. Avoid the eyes and mucous membranes; rinse with cool water if contact occurs. Avoid use during pregnancy and while breastfeeding. Stop and speak to a doctor if redness, swelling or irritation appears. Keep cool and dry, out of direct sunlight and out of reach of children.'

const GALLERY = JSON.stringify([
  '/images/cleanser/S1.jpg',
  '/images/cleanser/S2.jpg',
  '/images/cleanser/S3.jpg',
  '/images/cleanser/S4.jpg',
  '/images/cleanser/S5.jpg',
  '/images/cleanser/S6.jpg',
])

async function main() {
  const product = await prisma.product.findFirst({
    where: {
      OR: [
        { id: '10' },
        { productNumber: '10' },
        { name: { contains: 'SNOW O' } },
      ],
    },
  })
  if (!product) throw new Error('product 10 not found')

  await prisma.product.update({
    where: { id: product.id },
    data: {
      productNumber: '10',
      description: DESCRIPTION,
      descriptionAr: DESCRIPTION_AR,
      descriptionRu: DESCRIPTION_RU,
      productDetails: PRODUCT_DETAILS,
      keyFeatures: KEY_FEATURES,
      benefits: BENEFITS,
      ingredients: INGREDIENTS,
      howToUse: HOW_TO_USE,
      directions: DIRECTIONS,
      image: '/images/cleanser/main_clean.jpeg',
      images: GALLERY,
    },
  })

  console.log('updated', product.id, product.productNumber, product.name)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
