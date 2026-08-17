/**
 * Product 40 — MULTI SUN CREAM [SPF40 / PA++].
 *
 * Aligns the record with the source audit in
 * docs/SESSION_CHANGES_2026-08-17_PRODUCT_40_MULTI_SUN_SOURCE_AUDIT.md.
 *
 * 1. THE RECORD HAD NO INCI AT ALL. The `ingredients` field was empty, so the
 *    site listed nothing for a sunscreen whose composition is the entire
 *    argument. Transcribed from the registered artwork.
 * 2. Nothing recorded the four filters, their concentrations, or the fact that
 *    every one of them was assayed on the batch and came back in spec. That is
 *    the best quality evidence in the sun range and it appeared nowhere.
 * 3. Nothing said the product contains OCTINOXATE at 7.50% — while product 39's
 *    page, which cross-sells to this one, advertises containing none.
 * 4. "Gentle Care - Suitable for sensitive skin" on a product fragranced at
 *    0.25% with five EU-declared allergens. Softened, and the allergens named.
 * 5. The legacy description sold "Mannan" (not an INCI name; the nearest thing
 *    is konjac root extract at 100 ppm) and "Lactobacillus/Soymilk Ferment
 *    Filtrate", which the manufacturer's own formula declares at 0.0000000%.
 *    Palmitoyl Pentapeptide-4, named on the carton as the calming active, is
 *    at 0.0000001% — one part per billion.
 *
 * Run: npx tsx --env-file=.env.local scripts/update-product-40-multi-sun-record-20260817.ts
 */

import { prisma } from '../lib/prisma'

const DESCRIPTION_EN =
  'The light everyday sunscreen in the GENOSYS pair. Four UV filters make up 18.5% of the tube — a heavier load ' +
  'than the SPF50+ in the range — but three of them absorb UVB and the only UVA cover is titanium dioxide, which ' +
  'is why this rates SPF40 / PA++ rather than PA++++. Every filter was assayed on the batch and came back in ' +
  'specification. Light enough for daily wear under make-up, pH 6.71, no parabens, drying alcohol or colourants. ' +
  'Contains octinoxate at 7.50%, within the 10% European limit — if you are avoiding it, the Ultra Shield has ' +
  'none. Fragranced at 0.25% with five declared allergens. No water-resistance claim, so reapply after water.'

const DESCRIPTION_RU =
  'Лёгкий ежедневный санскрин из пары GENOSYS. Четыре УФ-фильтра составляют 18,5% тюбика — больше, чем у SPF50+ в ' +
  'линейке, — но три из них поглощают UVB, а единственное покрытие UVA даёт диоксид титана, поэтому степень здесь ' +
  'SPF40 / PA++, а не PA++++. Каждый фильтр измерили в партии, и все прошли спецификацию. Достаточно лёгкий для ' +
  'ежедневного ношения под макияжем, pH 6,71, без парабенов, сушащего спирта и красителей. Содержит октиноксат ' +
  '7,50% в пределах европейского лимита 10% — если вы его избегаете, в Ultra Shield его нет. Отдушка 0,25% с пятью ' +
  'заявленными аллергенами. Водостойкость не заявлена, наносите заново после воды.'

const DESCRIPTION_AR =
  'الواقي اليومي الخفيف في زوج جينوسيس. أربعة مرشحات تشكّل 18.5% من الأنبوب — حمل أثقل من واقي SPF50+ في المجموعة — ' +
  'لكن ثلاثة منها تمتصّ UVB، والتغطية الوحيدة لـ UVA من ثاني أكسيد التيتانيوم، ولهذا درجته SPF40 / PA++ لا PA++++. ' +
  'وقد قيس كل مرشّح على الدفعة وجاء ضمن المواصفة. خفيف بما يكفي للاستعمال اليومي تحت المكياج، ودرجة حموضته 6.71، ' +
  'وبلا بارابين أو كحول مجفّف أو ملوّنات. يحتوي أوكتينوكسات بنسبة 7.50% ضمن الحدّ الأوروبي 10% — وإن كنتِ تتجنّبينه ' +
  'فألترا شيلد خالٍ منه. معطّر بنسبة 0.25% بخمسة مسبّبات حساسية معلنة. ولا ادعاء لمقاومة الماء، فأعيدي الوضع بعده.'

/** Transcribed from the registered artwork. The record previously had none. */
const FULL_INCI =
  'Aqua (Water), Ethylhexyl Methoxycinnamate, Butylene Glycol, Ethylhexyl Salicylate, Titanium Dioxide, ' +
  'Isoamyl p-Methoxycinnamate, Dimethicone, Polysorbate 60, Glyceryl Stearate, Glycerin, Palmitoyl ' +
  'Pentapeptide-4, Sodium Hyaluronate, Rosa Damascena Callus Culture Extract, Vitis Vinifera (Grape) Callus ' +
  'Culture Extract, Centella Asiatica Extract, Scutellaria Baicalensis Root Extract, Lactobacillus/Soymilk ' +
  'Ferment Filtrate, Stearyl Alcohol, Cetyl Alcohol, PEG-100 Stearate, VP/Eicosene Copolymer, Palmitic Acid, ' +
  'Isohexadecane, Stearic Acid, Sorbitan Stearate, Phytosterols, Polysorbate 80, Xanthan Gum, Magnesium ' +
  'Aluminum Silicate, Sorbitan Oleate, 1,2-Hexanediol, Disodium EDTA, Amorphophallus Konjac Root Extract, ' +
  'Myristic Acid, Myristyl Alcohol, Lauryl Alcohol, Dimethicone/Vinyl Dimethicone Crosspolymer, Sodium ' +
  'Acrylate/Sodium Acryloyldimethyl Taurate Copolymer, Parfum, Caprylyl Glycol, Ethylhexylglycerin, ' +
  'Tropolone, Benzyl Benzoate, Citronellol, Hexyl Cinnamal, Limonene, Alpha-Isomethyl Ionone'

const KEY_FEATURES = [
  {
    title: 'Four Filters, 18.50% of the Tube',
    description:
      'Ethylhexyl methoxycinnamate 7.50%, ethylhexyl salicylate 5.00%, titanium dioxide 3.00% and isoamyl p-methoxycinnamate 3.00%. A heavier filter load than the SPF50+ in the range.',
  },
  {
    title: 'Every Filter Assayed on the Batch',
    description:
      'Not just declared. The certificate of analysis reports 7.21%, 4.96%, 2.98% and 2.75% found against those four declarations, all clearing the 90% specification.',
  },
  {
    title: 'SPF40 / PA++ — Strong UVB, Moderate UVA',
    description:
      'Three of the four filters absorb UVB and the only UVA cover is titanium dioxide, which reaches short UVA and stops. That is what makes this the light daily cream rather than the one for a day outdoors.',
  },
  {
    title: 'Contains Octinoxate at 7.50%',
    description:
      'Within the 10% maximum European law permits. Stated openly because the Ultra Shield in the same range contains none, and anyone choosing on that basis should not have to find out later.',
  },
]

const BENEFITS = [
  'Daily UV protection - SPF40 / PA++, strong on UVB and moderate on UVA',
  'Four filters at 18.50% - and every one measured on the batch, not just declared',
  'Light under make-up - the lighter of the two GENOSYS sunscreens, and the carton says so',
  'No parabens, drying alcohol or colourants - stated on the pack and confirmed by the formula',
  'Dermatologically tested - printed on the registered carton',
  'Three-year shelf life - with the expiry date on the carton',
]

/** Filters first with their real numbers. The trace complex is named only. */
const ACTIVES = [
  {
    name: 'Four UV filters, 18.50%',
    description:
      'Ethylhexyl methoxycinnamate 7.50%, ethylhexyl salicylate 5.00% (exactly on its European ceiling), titanium dioxide 3.00% and isoamyl p-methoxycinnamate 3.00%. Assayed on the batch at 7.21%, 4.96%, 2.75% and 2.98%.',
  },
  {
    name: 'Octinoxate 7.50%',
    description:
      'The largest filter here, and the one worth knowing about. European law permits 10%; the EU scientific committee concluded in 2025 that it is safe at that level in a face cream while confirming it is endocrine-active, and did not assess environmental effects. The Ultra Shield contains none.',
  },
  {
    name: 'Butylene glycol 5.02%, dimethicone 2.30%, glycerin 1.00%',
    description:
      'The rest of what is at a working level. Between them they give the light, non-greasy, under-make-up feel the product is bought for.',
  },
  {
    name: 'Fragrance 0.25%, with five declared allergens',
    description:
      'Benzyl benzoate 0.025%, citronellol 0.011%, hexyl cinnamal 0.011%, alpha-isomethyl ionone 0.011% and limonene 0.004%, all named on the carton.',
  },
  {
    name: 'The soothing complex, at trace level',
    description:
      'Palmitoyl pentapeptide-4 at 0.0000001% (one part per billion), centella and scutellaria at 10 ppm each, rose and grape callus extracts at 3 ppm and 1 ppm, and the Lactobacillus/Soymilk ferment filtrate at a declared 0.0000000%. Named because they are in the formula; nothing on this page rests on them.',
  },
]

async function main() {
  const product = await prisma.product.findFirst({
    where: { OR: [{ productNumber: '40' }, { id: '40' }] },
  })
  if (!product) throw new Error('product 40 not found')

  const details = JSON.parse(product.productDetails || '{}') as Record<string, string>
  details.protection = 'SPF40 / PA++ — strong UVB, moderate UVA'
  details.technology = 'Four-filter UV system at 18.50%, three organic and one mineral'
  details.formulation =
    'Butylene glycol 5.02%, dimethicone 2.30%, glycerin 1.00%. Light, non-greasy, sits under make-up.'
  details.contains = 'Octinoxate 7.50%, within the 10% European limit'
  details.fragrance = 'Yes, 0.25%, with five EU-declared allergens'
  details.waterResistance = 'None claimed — reapply after swimming, sweating or towelling'
  details.ph = '5.00–7.00 (6.71 on the batch tested)'
  details.freeFrom = 'Parabens, drying alcohol, colourants'
  details.licence = 'Korean functional cosmetic for UV protection'
  details.usage = 'Every morning as the last skincare step; reapply every two hours outdoors'
  delete details.type
  delete details.skinType

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

  console.log('Product 40 updated:')
  console.log('  INCI        -> added; the record previously had none at all')
  console.log('  filters     -> four, 18.50%, with the batch assay on the record')
  console.log('  octinoxate  -> 7.50% now stated openly')
  console.log('  fragrance   -> 0.25% with five allergens named')
  console.log('  dropped     -> Mannan, the zero-dosed ferment, unqualified sensitive-skin claim')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
