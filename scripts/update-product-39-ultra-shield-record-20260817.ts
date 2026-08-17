/**
 * Product 39 — ULTRA SHIELD SUN CREAM [SPF50+ / PA++++].
 *
 * Aligns the record with the source audit in
 * docs/SESSION_CHANGES_2026-08-17_PRODUCT_39_ULTRA_SHIELD_SOURCE_AUDIT.md.
 *
 * Six corrections, in rough order of how much they matter:
 *
 * 1. THE FULL INCI WAS FROM A SUPERSEDED FORMULA. It listed Cyclopentasiloxane
 *    and Cyclohexasiloxane, neither of which is in the registered formula or on
 *    the carton — the current formula uses Diisopropyl Sebacate and Dimethicone.
 *    D5 and D6 are regulated substances that people actively screen for, so
 *    listing them when they are absent is the worst error on the record. The
 *    list below is transcribed from the registered artwork.
 * 2. "7-filter UV system" appeared in the description, in keyFeatures and as an
 *    ingredient heading. It is SIX. The seventh being counted is butyloctyl
 *    salicylate, a photostabiliser the dossier classes as a skin-conditioning
 *    agent; the manufacturer's own deck lists six.
 * 3. "Reef-safe" in benefits and keyBenefits. Unregulated term, and the formula
 *    contains homosalate and octisalate. Replaced with the verifiable claim:
 *    no oxybenzone, no octinoxate.
 * 4. Ceramide NP credited with barrier strengthening at 0.00000001% — one part
 *    in ten billion. MicroHA and ProbioMETA credited with recovery at ~1 ppm.
 * 5. productDetails.technology was "MicroHA™ and ProbioMETA™ technology", i.e.
 *    the two trace ingredients, on a sunscreen whose technology is a 17.1%
 *    six-filter system measured at SPF 65.9.
 * 6. Nothing anywhere recorded the measured SPF 65.9 or the UVA-PF of 23.1-24.3,
 *    which are the best facts this product has.
 *
 * Run: npx tsx --env-file=.env.local scripts/update-product-39-ultra-shield-record-20260817.ts
 */

import { prisma } from '../lib/prisma'

const DESCRIPTION_EN =
  'A silky, non-greasy sunscreen whose protection was measured rather than estimated: SPF 65.9 in vivo and a ' +
  'UVA protection factor of 23.1 to 24.3, against the 22.0 European law requires at that strength. The label ' +
  'reads SPF50+ because 50+ is the highest figure a sunscreen is permitted to state. Six UV filters make up ' +
  '17.1% of the formula — five organic and one mineral, covering UVB and both halves of UVA — alongside ' +
  'niacinamide at 2% and adenosine at 0.04%, the doses Korea licenses the brightening and wrinkle functions ' +
  'against. No oxybenzone, no octinoxate. Dermatologically tested and assessed under EC Regulation 1223/2009. ' +
  'No water-resistance claim, so reapply after swimming or sweating.'

const DESCRIPTION_RU =
  'Шелковистый нежирный санскрин, защиту которого измерили, а не рассчитали: SPF 65,9 in vivo и фактор защиты ' +
  'от UVA 23,1–24,3 против 22,0, которых требует европейский закон при такой силе. На этикетке SPF50+, потому ' +
  'что 50+ — максимальное число, которое санскрину разрешено заявлять. Шесть УФ-фильтров составляют 17,1% ' +
  'формулы: пять органических и один минеральный, покрывающие UVB и обе половины UVA. Вместе с ними ' +
  'ниацинамид 2% и аденозин 0,04% — дозы, под которые Корея лицензирует осветление и уменьшение морщин. Без ' +
  'оксибензона и октиноксата. Дерматологически тестирован, оценка по регламенту EC 1223/2009. Водостойкость ' +
  'не заявлена — наносите заново после плавания или пота.'

const DESCRIPTION_AR =
  'واقٍ حريري غير دهني قيست حمايته ولم تُقدَّر: SPF 65.9 داخل الجسم الحي، وعامل حماية من UVA بين 23.1 و24.3، ' +
  'مقابل 22.0 التي يطلبها القانون الأوروبي عند هذه القوة. والملصق يقول SPF50+ لأن 50+ هو أعلى رقم يُسمح لواقٍ ' +
  'بذكره. ستة مرشحات تشكّل 17.1% من التركيبة — خمسة عضوية وواحد معدني، تغطي UVB وشطري UVA — إلى جانب ' +
  'نياسيناميد بنسبة 2% وأدينوزين بنسبة 0.04%، وهما الجرعتان اللتان ترخّص عليهما كوريا وظيفتي التفتيح وتحسين ' +
  'التجاعيد. بلا أوكسيبنزون وبلا أوكتينوكسات. مختبر جلدياً ومقيَّم وفق اللائحة EC 1223/2009. ولا ادعاء لمقاومة ' +
  'الماء، فأعيدي الوضع بعد السباحة أو التعرّق.'

/** Transcribed from the registered artwork. No cyclic silicones. */
const FULL_INCI =
  'Aqua (Water), Butyloctyl Salicylate, Homosalate, Ethylhexyl Salicylate, Terephthalylidene Dicamphor ' +
  'Sulfonic Acid, Bis-Ethylhexyloxyphenol Methoxyphenyl Triazine, Diisopropyl Sebacate, Ethylhexyl Triazone, ' +
  'Dimethicone, Niacinamide, Propanediol, Titanium Dioxide, Tromethamine, Glyceryl Stearate, Hydrogenated ' +
  'Poly(C6-14 Olefin), 1,2-Hexanediol, Caprylic/Capric/Myristic/Stearic Triglyceride, Lithospermum ' +
  'Erythrorhizon Root Extract, Scutellaria Baicalensis Root Extract, Ceramide NP, Hydrolyzed Sodium ' +
  'Hyaluronate, Lactobacillus Ferment Lysate, Ananas Sativus (Pineapple) Fruit Extract, Carica Papaya ' +
  '(Papaya) Fruit Extract, Litchi Chinensis Fruit Extract, Psidium Guajava Fruit Extract, Adenosine, ' +
  'Tocopherol, Glycerin, Jojoba Esters, Glucose, Hydrogenated Lecithin, Ethylhexylglycerin, Xanthan Gum, ' +
  'Methyl Trimethicone, Stearic Acid, Polyhydroxystearic Acid, Arachidyl Glucoside, Aluminum Hydroxide, ' +
  'Potassium Cetyl Phosphate, Polyurethane-15, Vinyl Dimethicone/Methicone Silsesquioxane Crosspolymer, ' +
  'Ammonium Acryloyldimethyltaurate/VP Copolymer, Polyacrylate Crosspolymer-6, Dimethicone/Vinyl Dimethicone ' +
  'Crosspolymer, Arachidyl Alcohol, Cetearyl Alcohol, Behenyl Alcohol, Dimethiconol, t-Butyl Alcohol, ' +
  'Butylene Glycol, Polymethylsilsesquioxane, C9-12 Alkane, C13-14 Alkane, Polyglyceryl-10 Laurate, ' +
  'PEG-100 Stearate, Parfum'

const KEY_FEATURES = [
  {
    title: 'SPF Measured at 65.9',
    description:
      'Tested in vivo and reported inside the product\u2019s EU safety assessment. The label reads 50+ because that is the highest figure European law lets a sunscreen state, however well it performs.',
  },
  {
    title: 'UVA Protection Factor 23.1–24.3',
    description:
      'Two separate test reports. European law requires a UVA factor of at least one third of the SPF, which here is 22.0. Both results clear it, and that is what earns the PA++++ grade.',
  },
  {
    title: 'Six Filters, 17.1% of the Formula',
    description:
      'Homosalate 4.00%, ethylhexyl salicylate 3.50%, terephthalylidene dicamphor sulfonic acid 3.07%, bis-ethylhexyloxyphenol methoxyphenyl triazine 3.00%, ethylhexyl triazone 2.00% and titanium dioxide 1.53%.',
  },
  {
    title: 'Niacinamide 2% and Adenosine 0.04%',
    description:
      'The two doses Korea licenses the brightening and wrinkle-improvement functions against, which is why this is registered as a triple-function cosmetic rather than a sunscreen alone.',
  },
]

const BENEFITS = [
  'Measured protection - SPF 65.9 in vivo, UVA factor 23.1 to 24.3 where 22.0 is required',
  'Six-filter system - 17.1% of the tube, five organic and one mineral, UVB through long UVA',
  'Niacinamide 2% - at the concentration the Korean brightening function is granted on',
  'Adenosine 0.04% - the licensed dose for wrinkle improvement',
  'No oxybenzone, no octinoxate - neither appears anywhere in the formula',
  'Barely any white cast - only 1.53% of the filter load is mineral, so the finish stays silky',
]

/** Doses first. The trace complex is named, with no effect attached. */
const ACTIVES = [
  {
    name: 'Six UV filters, 17.10%',
    description:
      'Homosalate 4.00%, ethylhexyl salicylate 3.50%, terephthalylidene dicamphor sulfonic acid 3.07%, bis-ethylhexyloxyphenol methoxyphenyl triazine 3.00%, ethylhexyl triazone 2.00%, titanium dioxide 1.53%. Together they measured SPF 65.9 and a UVA factor of 23.1 to 24.3.',
  },
  {
    name: 'Niacinamide 2.00%',
    description:
      'Vitamin B3 at the level the Korean brightening function is licensed on. It works on uneven tone and supports the barrier, which is the right thing to be wearing on high-UV days.',
  },
  {
    name: 'Adenosine 0.04%',
    description:
      'The exact dose Korea licenses for wrinkle improvement, and the same figure that appears in every functional anti-ageing product registered there.',
  },
  {
    name: 'Butyloctyl salicylate 5.00%',
    description:
      'Not a UV filter, despite sometimes being counted as a seventh. It is the solvent that keeps the real filters dissolved and photostable, which raises the SPF indirectly.',
  },
  {
    name: 'The recovery complex, at trace level',
    description:
      'Ceramide NP at 0.00000001%, hydrolyzed sodium hyaluronate and Lactobacillus ferment lysate at about 1 ppm each, and four fruit extracts at 25 ppb each. Named because they are in the formula; nothing on this page rests on them.',
  },
]

async function main() {
  const product = await prisma.product.findFirst({
    where: { OR: [{ productNumber: '39' }, { id: '39' }] },
  })
  if (!product) throw new Error('product 39 not found')

  const details = JSON.parse(product.productDetails || '{}') as Record<string, string>
  details.protection = 'SPF50+ / PA++++ — measured SPF 65.9, UVA-PF 23.1–24.3'
  details.technology = 'Six-filter UV system at 17.10%, five organic and one mineral'
  details.formulation =
    'Niacinamide 2.00%, adenosine 0.04%. Silky, non-greasy, minimal white cast. Contains fragrance at 0.5%.'
  details.waterResistance = 'None claimed — reapply after swimming, sweating or towelling'
  details.keyBenefits = 'UV protection, brightening, wrinkle improvement — the Korean triple function'
  details.ph = '7.20 ± 1.00 (7.23 on the batch tested)'
  details.assessment = 'EU safety assessment under EC Regulation 1223/2009'
  details.usage = 'Every morning as the last skincare step; reapply every two hours outdoors'
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
      ingredients: JSON.stringify([...ACTIVES, { name: 'Full INCI', description: FULL_INCI }]),
    },
  })

  console.log('Product 39 updated:')
  console.log('  INCI      -> retranscribed from the registered artwork; D5 and D6 removed')
  console.log('  filters   -> seven corrected to six throughout')
  console.log('  measured  -> SPF 65.9 and UVA-PF 23.1-24.3 now on the record')
  console.log('  dropped   -> reef-safe, Ceramide NP barrier claim, MicroHA/ProbioMETA recovery claim')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
