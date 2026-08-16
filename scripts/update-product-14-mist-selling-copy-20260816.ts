/**
 * Product 14 MICROBIOME ENERGY INFUSING MIST - selling-tone +
 * Intertek rewrite.
 *
 * Replaces the microbiome-correction / FENSEBIOME-as-engine / HA-plumping
 * / all-skin-types pitch with copy that matches the DTS MG formula, the
 * English carton, and the COA. Function is moisturizing, nourishing.
 * Shea 1.2%. Shake, spray 10-20 cm, eyes closed, through the day, over
 * makeup. Peptide at 0.000001%. Not a water toner.
 *
 * Shared Neon DB = production. The bespoke page reads these fields for
 * metadata and leftover generic PDP cards.
 */
import { PrismaClient } from '@prisma/client'
import { MIST_FULL_INCI } from '../components/product/mist/mistCopy'

const url = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL || ''
const prisma = new PrismaClient({ accelerateUrl: url } as never)

const DESCRIPTION =
  '80ml. Sprayable emulsion mist. Shea butter 1.2% with glycerin and four seed oils. Shake well, spray at 10-20 cm with eyes closed, through the day. Moisturizing and nourishing. Can go over makeup. The peptide sits at 0.000001%. Not a water toner.'

const DESCRIPTION_AR =
  '80 مل. رذاذ مستحلب يُرش. زبدة الشيا 1.2% مع الجليسرين وأربعة زيوت بذور. رجّي جيداً، رشي على بعد 10-20 سم والعينان مغلقتان، طوال اليوم. ترطيب وتغذية. يمكن فوق المكياج. الببتيد عند 0.000001%. ليس تونر ماء.'

const DESCRIPTION_RU =
  '80 мл. Эмульсионный мист. Масло ши 1,2% с глицерином и четырьмя маслами семян. Встряхните, распылите с 10-20 см, глаза закрыты, в течение дня. Увлажнение и питание. Можно поверх макияжа. Пептид на 0,000001%. Не водный тоник.'

const PRODUCT_DETAILS = JSON.stringify({
  form: 'Leave-on emulsion spray',
  size: '80ml',
  target: 'Moisturizing, nourishing',
  technology: 'Shea butter 1.2%',
  keyBenefits: 'Shake, spray 10-20 cm, over makeup',
  usage: 'Through the day',
  application: 'Shake well, spray with eyes closed, through the day',
  ph: '5.48, inside a 5.00 to 6.00 specification',
  appearance: 'Opaque viscous liquid, white',
  pao: '12 months after opening',
  shelfLife: 'Three years unopened, expiry printed on the bottle',
  origin: 'South Korea',
})

const KEY_FEATURES = JSON.stringify([
  {
    title: 'Shake, then spray',
    description:
      'Opaque emulsion. Shake well, spray at 10-20 cm with eyes closed, through the day. The carton stops here.',
  },
  {
    title: 'Shea butter 1.2%',
    description:
      'The largest named oil after the solvents. That is why the mist is opaque and why you shake first.',
  },
  {
    title: 'Over makeup',
    description:
      'The carton says it can be sprayed over make-up. Before makeup it is the glow pass.',
  },
  {
    title: 'Not a water toner',
    description:
      'That is Snow Booster. This is the 80 ml emulsion spray. The peptide sits at 0.000001%.',
  },
])

const BENEFITS = JSON.stringify([
  'Sprayable emulsion, not a water toner',
  'Shake, spray at 10-20 cm, eyes closed, through the day',
  'Shea 1.2% with glycerin and four seed oils',
  'Moisturizing and nourishing. Can go over makeup',
  'The peptide sits at 0.000001%',
])

const INGREDIENTS = JSON.stringify([
  {
    name: 'Shea butter 1.2%',
    description:
      'The reason the mist is opaque and the reason a shake comes first. It holds water on the surface. This is the figure that belongs on a card.',
  },
  {
    name: 'A spray that still feels comfortable',
    description:
      'Butylene glycol 4.01% and glycerin 3.245% sit under the oils, so the face does not feel tight after the mist lands.',
  },
  {
    name: 'CUREBIOME, hyaluronan, FENSEBIOME',
    description:
      'Named because leftover copy treated them as the reason to buy. Lactobacillus ferment is 0.088%. The seven hyaluronan names together are about 0.001%. Acetyl Heptapeptide-4 is 0.000001%. They are in the formula. They are not why the bottle is peach and opaque.',
  },
  {
    name: 'Fragrance',
    description:
      'Bergamot 0.024%, limonene 0.027% and linalool 0.009%. This is not a fragrance-free mist.',
  },
  {
    name: 'Full INCI',
    description: MIST_FULL_INCI,
  },
])

const HOW_TO_USE = JSON.stringify([
  {
    step: 'Shake',
    instruction: 'Well, before each use. The emulsion separates if it sits.',
  },
  {
    step: 'Spray',
    instruction: 'Over the face at 10-20 cm, eyes closed.',
  },
  {
    step: 'Through the day',
    instruction: 'Morning, evening, or whenever the face asks.',
  },
  {
    step: 'Over makeup',
    instruction: 'It can go over make-up. Before makeup it is the glow pass.',
  },
])

const DIRECTIONS =
  'For external use only. Avoid the eyes and mucous membranes; rinse with cool water if contact occurs. Stop if irritation appears. Keep cool and dry, out of reach of children. An opened bottle is a 12-month mist.'

const GALLERY = JSON.stringify([
  '/images/mist/bottle-front.jpeg',
  '/images/mist/bottle-box.jpeg',
  '/images/mist/carton-back.jpeg',
])

async function main() {
  const product = await prisma.product.findFirst({
    where: {
      OR: [
        { id: '14' },
        { productNumber: '14' },
        { name: { contains: 'MICROBIOME ENERGY INFUSING MIST' } },
      ],
    },
  })
  if (!product) throw new Error('product 14 not found')

  await prisma.product.update({
    where: { id: product.id },
    data: {
      productNumber: '14',
      description: DESCRIPTION,
      descriptionAr: DESCRIPTION_AR,
      descriptionRu: DESCRIPTION_RU,
      productDetails: PRODUCT_DETAILS,
      keyFeatures: KEY_FEATURES,
      benefits: BENEFITS,
      ingredients: INGREDIENTS,
      howToUse: HOW_TO_USE,
      directions: DIRECTIONS,
      image: '/images/mist/main2.jpeg',
      images: GALLERY,
      size: '80ml',
      videoUrl: '/videos/mist.mp4',
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
