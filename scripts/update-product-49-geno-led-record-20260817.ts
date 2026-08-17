/**
 * Product 49 — GENO-LED IR II.
 *
 * Aligns the stored record with the source audit written alongside the new
 * bespoke page, docs/SESSION_CHANGES_2026-08-17_PRODUCT_49_GENO_LED_SOURCE_AUDIT.md.
 *
 * Three fixes:
 *
 *   1. `productDetails.features` claimed "Less than 10% output loss after
 *      20,000 hours of use". That figure appears nowhere in the IR II brochure
 *      and nowhere in the registration pack we hold. A durability number on a
 *      AED 5,500 device either has a source or comes off the record; it can go
 *      back the moment the manufacturer confirms it.
 *   2. The record carried no dosimetry at all, which is the one specification a
 *      clinician buying a light device actually needs. Irradiance, standard
 *      dose and treatment time per wavelength are now on it, read off brochure
 *      slides 5 to 7.
 *   3. Russian and Arabic descriptions were a third the length of the English
 *      one and mentioned none of the hardware. All three now say the same thing.
 *
 * Left alone deliberately: `keyFeatures` and `benefits` both check out against
 * the brochure, apart from the edema wording noted below.
 *
 * Run: npx tsx --env-file=.env.local scripts/update-product-49-geno-led-record-20260817.ts
 */

import { prisma } from '../lib/prisma'

const DESCRIPTION_EN =
  'GENO-LED IR II is a professional low-level LED therapy device for the treatment room: 1,710 diodes ' +
  'across five wavelengths — red 640nm, blue 423nm, green 532nm, yellow 583nm and infrared 830nm — run ' +
  'alone or in pairs over face, body or scalp. Every mode is published with its irradiance and its ' +
  'standard dose, so a session can be planned rather than guessed at: 42 mW/cm² and 28 J/cm² on red, ' +
  '46 mW/cm² and 28 J/cm² on blue. The dome holds each diode at a usable distance from the skin and ' +
  'loses less light than a flat panel, nothing touches the client, and there are no tips, cartridges ' +
  'or gels to reorder. 70 W rated, 2.6 kg, folds flat between rooms.'

const DESCRIPTION_RU =
  'GENO-LED IR II — профессиональный аппарат низкоинтенсивной LED-терапии для процедурного кабинета: ' +
  '1 710 диодов на пяти длинах волн — красный 640 нм, синий 423 нм, зелёный 532 нм, жёлтый 583 нм и ' +
  'инфракрасный 830 нм, по отдельности или парами, для лица, тела и кожи головы. Для каждого режима ' +
  'опубликованы плотность мощности и стандартная доза, поэтому сеанс можно рассчитать, а не угадать: ' +
  '42 мВт/см² и 28 Дж/см² у красного, 46 мВт/см² и 28 Дж/см² у синего. Купол удерживает каждый диод на ' +
  'рабочем расстоянии от кожи и теряет меньше света, чем плоская панель; кожи ничто не касается, и нет ' +
  'ни насадок, ни картриджей, ни гелей. 70 Вт, 2,6 кг, складывается между кабинетами.'

const DESCRIPTION_AR =
  'جهاز GENO-LED IR II هو جهاز احترافي للعلاج الضوئي منخفض المستوى لغرفة العلاج: 1,710 ديودات على خمسة ' +
  'أطوال موجية — الأحمر 640 نانومتر والأزرق 423 والأخضر 532 والأصفر 583 وتحت الأحمر 830 — تعمل منفردة أو ' +
  'مزدوجة على الوجه والجسم وفروة الرأس. وكل وضع منشور بشدّته وجرعته المعيارية، فتُخطَّط الجلسة بدل تقديرها: ' +
  '42 ملي واط/سم² و28 جول/سم² للأحمر، و46 ملي واط/سم² و28 جول/سم² للأزرق. والقبة تُبقي كل ديود على مسافة ' +
  'صالحة من البشرة وتفقد ضوءاً أقل من اللوحة المسطّحة، ولا شيء يلامس العميلة، ولا رؤوس ولا خراطيش ولا جل ' +
  'يُعاد طلبه. قدرة 70 واط، ووزن 2.6 كغ، وتُطوى بين الغرف.'

async function main() {
  const product = await prisma.product.findFirst({
    where: { OR: [{ productNumber: '49' }, { id: '49' }] },
  })
  if (!product) throw new Error('product 49 not found')

  const details = JSON.parse(product.productDetails || '{}') as Record<string, string>

  // Unsourced. See the header note.
  delete details.features

  details.dosimetry =
    'Red 42 mW/cm² at 28 J/cm²; blue 46 mW/cm² at 28 J/cm²; green 15 mW/cm² at 9 J/cm²; ' +
    'yellow 11 mW/cm² at 7 J/cm²; infrared 15 mW/cm² at 12 J/cm². Bandwidth 20 ±5 nm on every mode.'
  details.treatmentTime = '5 to 60 minutes on the visible wavelengths, 1 to 10 minutes on infrared'
  details.ratedPower = '70 W electrical. Total optical output is not published by the manufacturer.'
  details.dimensions = '520 × 220 × 315 mm, 2.6 kg'
  details.modes =
    'A colour runs simultaneously with infrared; red paired with another colour alternates every three seconds.'

  const benefits = JSON.parse(product.benefits || '[]') as string[]
  const correctedBenefits = benefits.map(b =>
    // The brochure credits red and infrared with circulation; the edema wording
    // came from the older copy dump and is not in the IR II pack.
    b.startsWith('Improved Circulation')
      ? 'Improved Circulation - Red and infrared are used to promote blood circulation'
      : b
  )

  await prisma.product.update({
    where: { id: product.id },
    data: {
      description: DESCRIPTION_EN,
      descriptionRu: DESCRIPTION_RU,
      descriptionAr: DESCRIPTION_AR,
      productDetails: JSON.stringify(details),
      benefits: JSON.stringify(correctedBenefits),
    },
  })

  console.log('Product 49 updated:')
  console.log('  removed  -> productDetails.features (unsourced 20,000-hour claim)')
  console.log('  added    -> dosimetry, treatmentTime, ratedPower, dimensions, modes')
  console.log('  rewrote  -> description in EN, RU and AR')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
