/**
 * Product 36 — SOOTHING BOMB SEA ALGAE MASK.
 *
 * Aligns the record with the source audit in
 * docs/SESSION_CHANGES_2026-08-17_PRODUCT_36_SEA_ALGAE_SOURCE_AUDIT.md.
 *
 * The record leads on "sea algae complex" as the active. The DTS MG ingredient
 * report puts Jania Rubens and Undaria Pinnatifida at 10 ppm each, and
 * centella, bamboo, witch hazel and chestnut shell at 1 ppm each. What is
 * actually at a functional dose is methylpropanediol 10%, glycerin 5.035%,
 * betaine 0.5%, allantoin 0.1% and panthenol 0.1% — none of which the record
 * mentioned at all.
 *
 * So: the descriptions, keyFeatures, benefits and the actives list are rebuilt
 * around what the formula supports. The trace extracts stay named, with their
 * doses, because GENOSYS print those doses on the back of the pouch themselves.
 *
 * Also dropped: "Dermatologically tested" and "Efficacy test on skin hydration"
 * from the legacy copy. Neither is printed on either pouch face and there is no
 * report for either in the dossier folder.
 *
 * Run: npx tsx --env-file=.env.local scripts/update-product-36-sea-algae-record-20260817.ts
 */

import { prisma } from '../lib/prisma'

const DESCRIPTION_EN =
  'A single eucalyptus-fibre sheet soaked in 25 g of humectant essence, for the evenings when skin is ' +
  'tight, hot or has had too much sun. The hydration comes from glycerin at 5% with methylpropanediol at ' +
  '10% and betaine; the calm comes from allantoin and panthenol at 0.1% each. The Eucalace® spunlace ' +
  'sheet is finer and denser than a standard nonwoven, so it carries more essence and still breathes ' +
  'over a twenty-minute wear. pH 5.69. Green from gardenia fruit extract, not from artificial pigment. ' +
  'The sea algae and centella on the name are present at 10 ppm and 1 ppm — real ingredients, but the ' +
  'humectants are what do the work.'

const DESCRIPTION_RU =
  'Одно полотно из эвкалиптового волокна, пропитанное 25 г увлажняющей эссенции, — для вечеров, когда кожа ' +
  'стянута, разогрета или перебрала солнца. Увлажнение даёт глицерин 5% с метилпропандиолом 10% и бетаином; ' +
  'успокоение — аллантоин и пантенол по 0,1%. Полотно Eucalace® из спанлейса тоньше и плотнее стандартного ' +
  'нетканого, поэтому несёт больше эссенции и при этом дышит все двадцать минут. pH 5,69. Зелёный цвет — от ' +
  'экстракта плода гардении, а не от искусственного красителя. Водоросли и центелла из названия присутствуют ' +
  'в дозах 10 ppm и 1 ppm: это настоящие ингредиенты, но работают увлажнители.'

const DESCRIPTION_AR =
  'ورقة واحدة من ألياف الأوكالبتوس مشبعة بـ 25 غ من إسنس مرطّب، لأمسيات تكون فيها البشرة مشدودة أو ساخنة أو ' +
  'أخذت من الشمس أكثر مما ينبغي. الترطيب يأتي من الغليسرين بنسبة 5% مع الميثيل بروبانديول بنسبة 10% والبيتايين، ' +
  'والتهدئة من الألانتوين والبانثينول بنسبة 0.1% لكل منهما. وورقة Eucalace® السبانليس أدقّ وأكثف من النسيج ' +
  'القياسي، فتحمل إسنس أكثر وتظلّ تتنفّس طوال عشرين دقيقة. درجة الحموضة 5.69. واللون الأخضر من مستخلص ثمرة ' +
  'الغردينيا لا من صبغة صناعية. أما الطحالب البحرية والقنطورية في الاسم فموجودة بـ 10 و1 جزء من المليون — ' +
  'مكوّنات حقيقية، لكن المرطّبات هي التي تعمل.'

const KEY_FEATURES = [
  {
    title: 'Eucalace® Eucalyptus Sheet',
    description:
      'A spunlace nonwoven made from eucalyptus, with finer fibres at a higher count than a standard sheet. It carries more essence, hands more of it over, and stays breathable across a twenty-minute wear.',
  },
  {
    title: 'Glycerin 5% and Methylpropanediol 10%',
    description:
      'The humectant pair that does the hydrating, with betaine at 0.5% alongside them. These are the percent-level ingredients on the manufacturer\u2019s quantitative formula.',
  },
  {
    title: 'Allantoin and Panthenol, 0.1% each',
    description:
      'Both at a working dose. Allantoin is the anti-irritant and panthenol the provitamin B5 that supports comfort and the barrier.',
  },
  {
    title: 'No Artificial Pigment',
    description:
      'The green comes from gardenia fruit extract at 0.02%, listed on the formula as the colorant. Stated on the pouch and backed by the formula.',
  },
]

const BENEFITS = [
  'Hydration - Glycerin 5% with methylpropanediol 10% and betaine, the humectants that carry the mask',
  'Comfort - Allantoin and panthenol at 0.1% each, both at doses that do something',
  'Breathable sheet - Eucalyptus spunlace with air permeability above a standard nonwoven',
  'No chemical residue - Water-jet bonded fabric, so nothing but clean fibre sits against the skin',
  'Post-procedure friendly - No acids, no actives, and only a trace of peppermint',
  'Single use - One 25 g sheet per pouch, used straight after opening',
]

/** Named with their real doses. The trace extracts stay, without claims. */
const ACTIVES = [
  {
    name: 'Glycerin 5% + Methylpropanediol 10%',
    description:
      'The humectant base. Between them and betaine at 0.5% they account for most of what the mask does, drawing water into the top layers of the skin and holding it there for the wear.',
  },
  {
    name: 'Allantoin 0.1%',
    description: 'Soothing and anti-irritant at a dose that works, which is why the essence settles a hot face rather than only wetting it.',
  },
  {
    name: 'Panthenol 0.1%',
    description: 'Provitamin B5, for comfort and barrier support. The second of the two ingredients here that are genuinely at a functional level.',
  },
  {
    name: 'Sea algae, at 10 ppm',
    description:
      'Jania Rubens and Undaria Pinnatifida, both at 10 ppm — the figure GENOSYS print on the back of the pouch. They are on the ingredient list and they are not what calms the skin.',
  },
  {
    name: 'Botanical extracts, at 1 ppm',
    description:
      'Centella asiatica, bamboo, witch hazel leaf and chestnut shell, each at 1 ppm. Named because they are in the formula, with no effect attached at that dose.',
  },
  {
    name: 'Gardenia Fruit Extract 0.02%',
    description: 'The colorant. It is why the essence is green, and it is why the pouch can say the mask contains no artificial pigment.',
  },
]

async function main() {
  const product = await prisma.product.findFirst({
    where: { OR: [{ productNumber: '36' }, { id: '36' }] },
  })
  if (!product) throw new Error('product 36 not found')

  const existing = JSON.parse(product.ingredients || '[]') as Array<{ name?: string; description?: string }>
  const fullInci = existing.find(i => i?.name === 'Full INCI')
  if (!fullInci) throw new Error('Full INCI entry missing — refusing to overwrite the ingredient list')

  const details = JSON.parse(product.productDetails || '{}') as Record<string, string>
  details.technology = 'Eucalace® eucalyptus spunlace sheet with a humectant essence'
  details.formulation =
    'Methylpropanediol 10%, glycerin 5.04%, betaine 0.5%, allantoin 0.1%, panthenol 0.1%. Marine and botanical extracts at 10 ppm and 1 ppm.'
  details.ph = '5.00–6.00 (5.69 on the batch tested)'
  details.colour = 'Green from gardenia fruit extract — no artificial pigment'
  details.wearTime = '15–20 minutes, then pat in the remaining essence'
  details.keyBenefits = 'Hydration, soothing, comfort on hot or tight skin'
  delete details.target

  await prisma.product.update({
    where: { id: product.id },
    data: {
      description: DESCRIPTION_EN,
      descriptionRu: DESCRIPTION_RU,
      descriptionAr: DESCRIPTION_AR,
      productDetails: JSON.stringify(details),
      keyFeatures: JSON.stringify(KEY_FEATURES),
      benefits: JSON.stringify(BENEFITS),
      ingredients: JSON.stringify([...ACTIVES, fullInci]),
    },
  })

  console.log('Product 36 updated:')
  console.log('  descriptions -> rebuilt on the humectants in EN, RU and AR')
  console.log('  keyFeatures  -> ' + KEY_FEATURES.map(f => f.title).join(', '))
  console.log('  actives      -> ' + ACTIVES.map(a => a.name).join(', '))
  console.log('  dropped      -> dermatologically tested, hydration efficacy claim')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
