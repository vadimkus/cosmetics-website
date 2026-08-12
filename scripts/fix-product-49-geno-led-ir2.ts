/**
 * Product 49 (GENO-LED IR II) carried a fabricated English record: it described a
 * portable, FDA-cleared, battery-powered home device emitting 630-660nm and
 * 800-1000nm. The manufacturer's own listing (genosys.info/en/21_en/50) documents a
 * mains-powered professional dome emitting five wavelengths from 1,710 LED elements.
 * The Arabic translation already matched the manufacturer; English and Russian did not.
 *
 * This rewrites the English database record and the Russian translation entry, and
 * aligns the Arabic spec keys with the corrected English key set.
 *
 * Run with --apply to write; default is a dry run.
 */
import { mkdirSync, writeFileSync } from 'fs'
import { join } from 'path'
import { prisma } from '../lib/prisma'
import { loadFile, replaceField, saveFile, tsLiteral } from './lib/patchTranslationFile'

const APPLY = process.argv.includes('--apply')
const AR_PATH = join(__dirname, '..', 'data', 'productTranslations.ts')
const RU_PATH = join(__dirname, '..', 'data', 'productTranslationsRu.ts')

const EN = {
  description:
    'GENOSYS GENO-LED IR II is a professional low-level LED light therapy (LLLT) device that resolves complicated skin problems by irradiating five different wavelengths: 640nm (red), 423nm (blue), 532nm (green), 583nm (yellow) and 830nm (infrared). It uses high-brightness special near-infrared SMD LED elements, and its dome shape reduces light loss while holding the correct irradiation distance for even coverage of the face, body and scalp. Treatment is painless and gentle, avoiding the heat damage and photo-aging risks associated with coherent laser treatments.',
  keyFeatures: [
    {
      title: 'Five Wavelengths',
      description:
        'Red 640nm, blue 423nm, green 532nm, yellow 583nm and infrared 830nm, used alone or in combination to treat several indications in one session.',
    },
    {
      title: '1,710 LED Elements',
      description:
        '380 elements for each visible colour plus 190 infrared elements, delivering strong and even output across the whole treatment area.',
    },
    {
      title: 'Dome Design',
      description:
        'The dome shape reduces light loss and holds the correct irradiation distance, so coverage stays consistent across face and body.',
    },
    {
      title: 'Gentle and Safe',
      description:
        'Painless treatment with no downtime, no photo-aging, no scarring and no heat damage, and no direct contact with the skin.',
    },
  ],
  benefits: [
    'Cell Regeneration - Supports skin cell renewal and recovery after procedures',
    'Anti-Aging - Improves the appearance of wrinkles and other signs of aging',
    'Brightening - Evens skin tone and improves hyperpigmentation',
    'Soothing - Calms irritated and sensitive skin and relieves redness and erythema',
    'Acne Care - Targets acne-causing bacteria and helps control breakouts',
    'Hair Loss Care - Supports scalp health as part of a hair loss protocol',
    'Improved Circulation - Promotes blood circulation and helps relieve edema',
    'Whole-Body Treatment - Covers face, body and scalp in a single device',
  ],
  productDetails: {
    form: 'Professional dome-shaped low-level LED therapy (LLLT) device',
    technology: 'High-brightness special near-infrared SMD LED elements',
    lightWavelengths: 'Five wavelengths - blue 423nm, green 532nm, yellow 583nm, red 640nm, infrared 830nm',
    totalLEDs: '1,710 elements - 380 red, 380 blue, 380 green, 380 yellow, 190 infrared',
    design: 'Dome shape reduces light loss and holds the correct irradiation distance; compact and foldable',
    features: 'Less than 10% output loss after 20,000 hours of use',
    target: 'Complicated skin problems, hair loss care, muscle pain and aches',
    keyBenefits:
      'Cell regeneration, anti-aging, brightening, soothing, acne care, hair loss care, improved circulation',
    usage: 'Professional treatment for face, body and scalp',
    application: 'Whole-body total care device',
    skinType: 'All skin types',
    safety: 'Painless and hygienic - no heat damage, photo-aging or scarring, and no direct skin contact',
    origin: 'South Korea',
  },
  howToUse: [
    '1. Cleanse the treatment area and remove make-up or residue.',
    '2. Position the dome over the face, body or scalp so the light covers the full treatment area.',
    '3. Select the wavelength, or combination of wavelengths, that matches the indication being treated.',
    '4. Set the session time on the control panel and run the treatment; there is no direct contact with the skin.',
    '5. Use as post-care after microneedling, injection, thread lifting or chemical peel, or as a standalone course.',
  ].join('\n'),
  directions:
    'A professional device for use in clinics and salons, suitable for all skin types. Treatment is painless with no downtime and is safe for patients with antibiotic resistance. Follow the session times in the device manual and treat under the supervision of a trained practitioner.',
}

const AR_DETAILS = {
  form: 'جهاز LLLT احترافي بشكل قبة للعلاج بالضوء منخفض الشدة',
  technology: 'عناصر LED SMD عالية السطوع بضوء خاص قريب من الأشعة تحت الحمراء',
  lightWavelengths: 'خمسة أطوال موجية - أزرق 423nm، أخضر 532nm، أصفر 583nm، أحمر 640nm، تحت الحمراء 830nm',
  totalLEDs: '1,710 عنصر - 380 أحمر، 380 أزرق، 380 أخضر، 380 أصفر، 190 تحت الحمراء',
  design: 'شكل القبة يقلل فقدان الضوء ويحافظ على مسافة الإشعاع الصحيحة؛ مدمج وقابل للطي',
  features: 'أقل من 10% فقدان في الأداء بعد 20,000 ساعة من الاستخدام',
  target: 'مشاكل البشرة المعقدة، رعاية تساقط الشعر، آلام العضلات',
  keyBenefits: 'تجديد الخلايا، مكافحة الشيخوخة، تفتيح، تهدئة، علاج حب الشباب، رعاية الشعر، تحسين الدورة الدموية',
  usage: 'علاج احترافي للوجه والجسم وفروة الرأس',
  application: 'جهاز رعاية شاملة للجسم بالكامل',
  skinType: 'جميع أنواع البشرة',
  safety: 'علاج غير مؤلم وصحي - بدون تلف حراري أو شيخوخة ضوئية أو تندب، وبدون تلامس مباشر مع البشرة',
  origin: 'كوريا الجنوبية',
}

const AR_BENEFITS = [
  'تجديد الخلايا - يدعم تجديد خلايا البشرة والتعافي بعد الإجراءات',
  'مكافحة الشيخوخة - يحسن مظهر التجاعيد وعلامات الشيخوخة الأخرى',
  'تفتيح البشرة - يوحد لون البشرة ويحسن فرط التصبغ',
  'تهدئة البشرة - يهدئ البشرة المتهيجة والحساسة ويخفف الاحمرار والحمامى',
  'علاج حب الشباب - يستهدف البكتيريا المسببة لحب الشباب ويساعد في التحكم بالبثور',
  'رعاية تساقط الشعر - يدعم صحة فروة الرأس كجزء من بروتوكول تساقط الشعر',
  'تحسين الدورة الدموية - يعزز تدفق الدم ويساعد في تخفيف الوذمة',
  'علاج الجسم بالكامل - يغطي الوجه والجسم وفروة الرأس بجهاز واحد',
]

const AR_HOW_TO_USE = [
  '1. نظّف منطقة العلاج وأزل المكياج أو البقايا.',
  '2. ضع القبة فوق الوجه أو الجسم أو فروة الرأس بحيث يغطي الضوء كامل منطقة العلاج.',
  '3. اختر الطول الموجي، أو مجموعة الأطوال الموجية، المناسبة للحالة المعالجة.',
  '4. اضبط مدة الجلسة على لوحة التحكم وابدأ العلاج؛ لا يوجد تلامس مباشر مع البشرة.',
  '5. يُستخدم كرعاية لاحقة بعد الميكرونيدلينغ أو الحقن أو شد الخيوط أو التقشير الكيميائي، أو كبرنامج علاجي مستقل.',
].join('\n')

const AR_DIRECTIONS =
  'جهاز احترافي للاستخدام في العيادات والصالونات، مناسب لجميع أنواع البشرة. العلاج غير مؤلم وبدون فترة نقاهة وآمن للمرضى الذين لديهم مقاومة للمضادات الحيوية. اتبع مدد الجلسات الواردة في دليل الجهاز واستخدمه تحت إشراف متخصص مدرب.'

const RU = {
  description:
    'GENOSYS GENO-LED IR II — профессиональный аппарат низкоинтенсивной LED-терапии (LLLT), который решает комплексные проблемы кожи, излучая пять различных длин волн: 640 нм (красный), 423 нм (синий), 532 нм (зелёный), 583 нм (жёлтый) и 830 нм (инфракрасный). В аппарате используются яркие SMD-светодиоды со специальным ближним инфракрасным светом, а куполообразная форма снижает потери света и удерживает правильное расстояние облучения, обеспечивая равномерное покрытие лица, тела и кожи головы. Процедура безболезненна и деликатна: она исключает термические повреждения и фотостарение, свойственные лазерным методикам.',
  keyFeatures: [
    {
      title: 'Пять длин волн',
      description:
        'Красный 640 нм, синий 423 нм, зелёный 532 нм, жёлтый 583 нм и инфракрасный 830 нм — по отдельности или в комбинации для работы с несколькими показаниями за одну процедуру.',
    },
    {
      title: '1 710 светодиодов',
      description:
        'По 380 элементов на каждый видимый цвет плюс 190 инфракрасных элементов обеспечивают мощное и равномерное излучение по всей зоне обработки.',
    },
    {
      title: 'Куполообразная конструкция',
      description:
        'Форма купола снижает потери света и удерживает правильное расстояние облучения, поэтому покрытие лица и тела остаётся равномерным.',
    },
    {
      title: 'Деликатно и безопасно',
      description:
        'Безболезненная процедура без периода восстановления, без фотостарения, рубцов и термических повреждений, без прямого контакта с кожей.',
    },
  ],
  benefits: [
    'Регенерация клеток — поддерживает обновление клеток кожи и восстановление после процедур',
    'Anti-age — улучшает вид морщин и других признаков старения',
    'Осветление — выравнивает тон кожи и уменьшает гиперпигментацию',
    'Успокоение — снимает раздражение чувствительной кожи, уменьшает покраснение и эритему',
    'Уход при акне — воздействует на бактерии, вызывающие акне, и помогает контролировать высыпания',
    'Уход при выпадении волос — поддерживает здоровье кожи головы в составе протокола против выпадения',
    'Улучшение микроциркуляции — усиливает кровоток и помогает уменьшить отёчность',
    'Обработка всего тела — лицо, тело и кожа головы в одном аппарате',
  ],
  productDetails: {
    form: 'Профессиональный куполообразный аппарат низкоинтенсивной LED-терапии (LLLT)',
    technology: 'Яркие SMD-светодиоды со специальным ближним инфракрасным светом',
    lightWavelengths: 'Пять длин волн — синий 423 нм, зелёный 532 нм, жёлтый 583 нм, красный 640 нм, инфракрасный 830 нм',
    totalLEDs: '1 710 элементов — 380 красных, 380 синих, 380 зелёных, 380 жёлтых, 190 инфракрасных',
    design: 'Купол снижает потери света и удерживает правильное расстояние облучения; компактный и складной',
    features: 'Менее 10% потери мощности после 20 000 часов работы',
    target: 'Комплексные проблемы кожи, уход при выпадении волос, мышечные боли',
    keyBenefits:
      'Регенерация клеток, anti-age, осветление, успокоение, уход при акне, уход при выпадении волос, улучшение микроциркуляции',
    usage: 'Профессиональная процедура для лица, тела и кожи головы',
    application: 'Аппарат комплексного ухода за всем телом',
    skinType: 'Все типы кожи',
    safety:
      'Безболезненно и гигиенично — без термических повреждений, фотостарения и рубцов, без прямого контакта с кожей',
    origin: 'Южная Корея',
  },
  howToUse: [
    '1. Очистите зону обработки и удалите макияж и остатки средств.',
    '2. Расположите купол над лицом, телом или кожей головы так, чтобы свет покрывал всю зону обработки.',
    '3. Выберите длину волны или комбинацию длин волн, соответствующую показанию.',
    '4. Задайте время сеанса на панели управления и запустите процедуру; прямого контакта с кожей нет.',
    '5. Используйте как уход после микронидлинга, инъекций, тредлифтинга или химического пилинга либо как самостоятельный курс.',
  ].join('\n'),
  directions:
    'Профессиональный аппарат для клиник и салонов, подходит для всех типов кожи. Процедура безболезненна, без периода восстановления, и безопасна для пациентов с антибиотикорезистентностью. Соблюдайте длительность сеансов из руководства к аппарату и проводите процедуры под наблюдением обученного специалиста.',
}

async function main() {
  const product = (await prisma.product.findFirst({
    where: { OR: [{ productNumber: '49' }, { id: '49' }] },
  })) as Record<string, unknown> | null
  if (!product) throw new Error('product 49 not found')
  if (product.name !== 'GENO-LED IR II') throw new Error(`unexpected product: ${String(product.name)}`)

  const dir = join(process.cwd(), 'backups')
  mkdirSync(dir, { recursive: true })
  const backup = join(dir, 'product-49-before-geno-led-fix.json')
  writeFileSync(backup, JSON.stringify(product, null, 2))
  console.log(`backup: ${backup}`)

  const dbData = {
    description: EN.description,
    keyFeatures: JSON.stringify(EN.keyFeatures),
    benefits: JSON.stringify(EN.benefits),
    productDetails: JSON.stringify(EN.productDetails),
    howToUse: EN.howToUse,
    directions: EN.directions,
  }

  for (const [field, value] of Object.entries(dbData)) {
    const before = String(product[field] ?? '')
    console.log(`\n--- ${field} ---`)
    console.log(`  before: ${before.slice(0, 140)}${before.length > 140 ? '…' : ''}`)
    console.log(`  after:  ${value.slice(0, 140)}${value.length > 140 ? '…' : ''}`)
  }

  let ar = loadFile(AR_PATH)
  ar = replaceField(ar, '49', 'productDetails', tsLiteral(JSON.stringify(AR_DETAILS, null, 2), 'compact'))
  ar = replaceField(ar, '49', 'benefits', tsLiteral(JSON.stringify(AR_BENEFITS, null, 2), 'compact'))
  ar = replaceField(ar, '49', 'howToUse', tsLiteral(AR_HOW_TO_USE, 'compact'))
  ar = replaceField(ar, '49', 'directions', tsLiteral(AR_DIRECTIONS, 'compact'))

  let ru = loadFile(RU_PATH)
  ru = replaceField(ru, '49', 'description', tsLiteral(RU.description, 'compact'))
  ru = replaceField(ru, '49', 'keyFeatures', tsLiteral(JSON.stringify(RU.keyFeatures, null, 2), 'compact'))
  ru = replaceField(ru, '49', 'benefits', tsLiteral(JSON.stringify(RU.benefits, null, 2), 'compact'))
  ru = replaceField(ru, '49', 'productDetails', tsLiteral(JSON.stringify(RU.productDetails, null, 2), 'compact'))
  ru = replaceField(ru, '49', 'howToUse', tsLiteral(RU.howToUse, 'compact'))
  ru = replaceField(ru, '49', 'directions', tsLiteral(RU.directions, 'compact'))

  if (!APPLY) {
    console.log('\nDRY RUN — rerun with --apply to write')
    return
  }

  await prisma.product.update({ where: { id: String(product.id) }, data: dbData })
  saveFile(AR_PATH, ar)
  saveFile(RU_PATH, ru)
  console.log('\nApplied: English DB record, Arabic specs/benefits/usage, Russian entry')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
