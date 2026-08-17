/**
 * Product 61 (HR³ MATRIX SCALP BRUSH): strip unsourced claims and re-point the
 * product at the partner the manufacturer actually names.
 *
 * The only manufacturer document for this product is a four-slide DTS MG deck,
 * `public/documents/PPT/GENOSYS HR3 MATRIX SCALP BRUSH.pdf`. Everything it says
 * about the brush is quoted below, and nothing outside these quotes is claimed
 * by the record after this script runs.
 *
 *   Concept   "A scalp brush that provides gentle scalp cleansing and massage
 *              effects without irritation"
 *   How to use "After wetting hair with lukewarm water, apply shampoo to create
 *              sufficient lather. Massage scalp with the brush."
 *   Features  "Rich foam: It helps create rich foam when used with HR³ MATRIX
 *              SCALP SHAMPOO α."
 *             "Deeper scalp cleansing: It helps wash away scalp oil, dead skin
 *              cells and product buildup without irritation."
 *             "Improved blood circulation: It helps increase blood flow to the
 *              scalp, which can help prevent hair thinning."
 *             "Increased hair volume: Through deep cleansing effect, it helps
 *              increase hair volume."
 *             "Stable grip: Enables comfortable and stable usage"
 *             "Soft silicone brush: Allows for comfortable scalp scaling and
 *              massage without scratch"
 *
 * What was wrong, and why each removal is not a judgement call:
 *
 * 1. "Enhances absorption of hair care products by up to 50%" - a quantified
 *    efficacy claim with no study, no manufacturer mention and no source of any
 *    kind. Removed outright rather than softened.
 * 2. "Medical-grade silicone that is hypoallergenic" - DTS MG says "soft
 *    silicone brush" and nothing further. Both grades of claim are invented.
 * 3. "the KFDA-approved Hair Tonic" - the KFDA functional approval in this line
 *    belongs to MEDI SCALP SHAMPOO α (product 44), whose own record states it.
 *    Product 43's record makes no such claim. This was a regulatory claim
 *    pointing at the wrong product.
 * 4. "Prepares scalp for microneedling treatments" - that is SCALP PEELING α
 *    (product 46), whose record and instructions are explicit about it. The
 *    brush is documented purely as a wash-time cleansing and massage tool.
 * 5. Dry-brushing as the lead routine - the manufacturer's own How to Use is
 *    wet, in the shower, with shampoo. The record led with a dry massage step
 *    and buried the documented wet use under "ALTERNATIVE USES", where the
 *    "Wet Use (with shampoo):" heading had lost its body text entirely.
 * 6. `perfectCombination` pointed at the Hair Tonic. Re-pointed to the shampoo,
 *    which is the partner DTS MG names, in the one feature bullet about foam.
 *
 * The tonic is still a sensible next step after washing, and the copy says so,
 * but it is described as a sequence rather than as the brush making the tonic
 * work better, which is the part no document supports.
 *
 * Gallery images are deliberately left alone. `s1.jpg` and `s2.jpg` still carry
 * "+50% Product Absorption", "Soft Medical-Grade Silicone" and the tonic pairing
 * baked into the artwork; that was a considered decision to keep the existing
 * images. The text no longer echoes them. Do not "re-sync" the copy to the
 * artwork - the artwork is the side that is unsupported.
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/fix-product-61-scalp-brush-claims-20260813.ts
 *   npx tsx --env-file=.env.local scripts/fix-product-61-scalp-brush-claims-20260813.ts --apply
 */

import { writeFileSync } from 'fs'
import { join } from 'path'
import { prisma } from '../lib/prisma'

const APPLY = process.argv.includes('--apply')

const description = `The HR³ MATRIX SCALP BRUSH is a soft silicone brush for cleansing and massaging the scalp while you wash. Used with shampoo on wet hair it works the lather down to the skin and helps wash away scalp oil, dead skin cells and product buildup, without scratching.

Regular massage helps increase blood flow to the scalp, which can help prevent hair thinning, and the deeper cleansing it gives helps increase hair volume.

Its everyday partner is HR³ MATRIX MEDI SCALP SHAMPOO α, with which it builds a noticeably richer foam. Leave-on treatments from the HR³ MATRIX line go on afterwards, onto a clean scalp.`

const descriptionRu = `Мягкая силиконовая щётка HR³ MATRIX для очищения и массажа кожи головы во время мытья. С шампунем на влажных волосах она доводит пену до самой кожи и помогает удалить себум, отшелушенные клетки и остатки средств, не царапая кожу головы.

Регулярный массаж помогает усилить приток крови к коже головы, что может помочь предотвратить истончение волос, а более глубокое очищение помогает увеличить объём волос.

Её постоянный партнёр - HR³ MATRIX MEDI SCALP SHAMPOO α: вместе они дают заметно более густую пену. Несмываемые средства линии HR³ MATRIX наносятся после мытья, на чистую кожу головы.`

const descriptionAr = `فرشاة فروة الرأس HR³ MATRIX هي فرشاة سيليكون ناعمة لتنظيف فروة الرأس وتدليكها أثناء الغسل. مع الشامبو على شعر مبلل توصل الرغوة إلى الجلد وتساعد على إزالة زيوت فروة الرأس والخلايا الميتة وتراكم المنتجات، دون خدش فروة الرأس.

التدليك المنتظم يساعد على زيادة تدفق الدم إلى فروة الرأس، ما يمكن أن يساعد في الوقاية من ترقق الشعر، والتنظيف الأعمق الذي توفره يساعد على زيادة كثافة الشعر.

شريكها اليومي هو HR³ MATRIX MEDI SCALP SHAMPOO α، ومعه تصنع رغوة أغنى بشكل واضح. أما منتجات العلاج التي لا تُشطف من خط HR³ MATRIX فتوضع بعد الغسل، على فروة رأس نظيفة.`

const benefits = [
  'Builds a richer foam when used with HR³ MATRIX MEDI SCALP SHAMPOO α',
  'Helps wash away scalp oil, dead skin cells and product buildup',
  'Cleanses and massages without scratching the scalp',
  'Helps increase blood flow to the scalp, which can help prevent hair thinning',
  'Helps increase hair volume through deeper cleansing',
  'Stable grip stays comfortable with wet, soapy hands',
  'Soft silicone, gentle enough to use at every wash',
]

const benefitsRu = [
  'Даёт более густую пену вместе с HR³ MATRIX MEDI SCALP SHAMPOO α',
  'Помогает удалить себум, отшелушенные клетки и остатки средств',
  'Очищает и массирует, не царапая кожу головы',
  'Помогает усилить приток крови к коже головы, что может помочь предотвратить истончение волос',
  'Помогает увеличить объём волос за счёт более глубокого очищения',
  'Устойчивая ручка удобна даже в мокрых руках',
  'Мягкий силикон - подходит для каждого мытья',
]

const benefitsAr = [
  'تصنع رغوة أغنى مع HR³ MATRIX MEDI SCALP SHAMPOO α',
  'تساعد على إزالة زيوت فروة الرأس والخلايا الميتة وتراكم المنتجات',
  'تنظّف وتدلّك دون خدش فروة الرأس',
  'تساعد على زيادة تدفق الدم إلى فروة الرأس، ما يمكن أن يساعد في الوقاية من ترقق الشعر',
  'تساعد على زيادة كثافة الشعر من خلال تنظيف أعمق',
  'مقبض ثابت يبقى مريحاً بأيدٍ مبللة ومغطاة بالصابون',
  'سيليكون ناعم، لطيف بما يكفي للاستخدام في كل غسلة',
]

/** A brush has parts, not ingredients, but this is the field the spec block
 *  renders, so the two documented construction features live here. */
const ingredients = [
  {
    name: 'Soft silicone brush head',
    description:
      'Soft silicone allows for comfortable scalp scaling and massage without scratching.',
  },
  {
    name: 'Stable grip',
    description: 'Shaped for comfortable and stable use while your hands are wet.',
  },
]

const ingredientsRu = [
  {
    name: 'Мягкая силиконовая насадка',
    description:
      'Мягкий силикон позволяет комфортно очищать и массировать кожу головы, не царапая её.',
  },
  {
    name: 'Устойчивая ручка',
    description: 'Форма рассчитана на удобный и устойчивый хват мокрыми руками.',
  },
]

const ingredientsAr = [
  {
    name: 'رأس فرشاة من السيليكون الناعم',
    description: 'السيليكون الناعم يتيح تنظيف فروة الرأس وتدليكها بارتياح دون خدشها.',
  },
  {
    name: 'مقبض ثابت',
    description: 'شكله مصمم لاستخدام مريح وثابت واليدان مبللتان.',
  },
]

const howToUse = `1. Wet your hair thoroughly with lukewarm water
2. Apply HR³ MATRIX MEDI SCALP SHAMPOO α and work it into a sufficient lather
3. Massage the scalp with the brush in small circles, working section by section
4. Rinse thoroughly with lukewarm water
5. Rinse the brush after use and stand it somewhere it can air dry`

const howToUseRu = `1. Тщательно намочите волосы тёплой водой
2. Нанесите HR³ MATRIX MEDI SCALP SHAMPOO α и взбейте достаточную пену
3. Массируйте кожу головы щёткой круговыми движениями, зона за зоной
4. Тщательно смойте тёплой водой
5. Промойте щётку после использования и оставьте сушиться на воздухе`

const howToUseAr = `1. بلّلي شعرك جيداً بماء فاتر
2. ضعي HR³ MATRIX MEDI SCALP SHAMPOO α واعملي على تكوين رغوة كافية
3. دلّكي فروة الرأس بالفرشاة بحركات دائرية صغيرة، منطقة تلو الأخرى
4. اشطفي جيداً بماء فاتر
5. اغسلي الفرشاة بعد الاستخدام واتركيها تجف في الهواء`

const directions = `AFTER WASHING
Leave-on steps from the HR³ MATRIX line go onto a clean scalp once you have rinsed and towel-dried. Apply them with your fingertips, not the brush.

CARE
• Rinse the brush under warm water after every use
• Let it air dry completely before putting it away
• Store it somewhere dry rather than sealed in a wet bag
• Replace it if the silicone tears or loses its shape

PRECAUTIONS
• Do not use on broken, irritated or infected scalp
• Do not use immediately after a scalp procedure
• Stop using it if irritation appears, and see a doctor if it persists
• External use only. Keep out of reach of children`

const directionsRu = `ПОСЛЕ МЫТЬЯ
Несмываемые средства линии HR³ MATRIX наносятся на чистую кожу головы после смывания шампуня и подсушивания полотенцем. Распределяйте их кончиками пальцев, а не щёткой.

УХОД
• Промывайте щётку тёплой водой после каждого использования
• Дайте ей полностью высохнуть на воздухе перед хранением
• Храните в сухом месте, а не в закрытом влажном мешке
• Замените, если силикон порвался или потерял форму

МЕРЫ ПРЕДОСТОРОЖНОСТИ
• Не используйте на повреждённой, раздражённой или воспалённой коже головы
• Не используйте сразу после процедур на коже головы
• Прекратите использование при появлении раздражения, при сохранении - обратитесь к врачу
• Только для наружного применения. Хранить в недоступном для детей месте`

const directionsAr = `بعد الغسل
منتجات خط HR³ MATRIX التي لا تُشطف توضع على فروة رأس نظيفة بعد الشطف والتنشيف بالمنشفة. وزّعيها بأطراف الأصابع، لا بالفرشاة.

العناية بالفرشاة
• اغسلي الفرشاة بماء دافئ بعد كل استخدام
• اتركيها تجف تماماً في الهواء قبل تخزينها
• احفظيها في مكان جاف، لا في كيس مغلق ورطب
• استبدليها إذا تمزق السيليكون أو فقد شكله

تنبيهات
• لا تستخدميها على فروة رأس مجروحة أو متهيجة أو مصابة بالتهاب
• لا تستخدميها مباشرة بعد إجراء على فروة الرأس
• أوقفي الاستخدام إذا ظهر تهيج، وراجعي الطبيب إذا استمر
• للاستخدام الخارجي فقط. يُحفظ بعيداً عن متناول الأطفال`

/** Only keys already mapped in ProductContentDisplay's formatKey are used, so
 *  the spec table never falls back to showing a raw camelCase key. */
const productDetails = {
  form: 'Scalp brush',
  size: '1 piece',
  skinType: 'All scalp types',
  technology: 'Soft silicone brush head with stable grip',
  keyBenefits: 'Deeper cleansing, richer foam, scalp massage, blood flow',
  usage: 'In the shower, with shampoo',
  system: 'Part of the HR³ MATRIX hair care line',
  origin: 'South Korea',
}

const productDetailsRu = {
  form: 'Щётка для кожи головы',
  size: '1 шт',
  skinType: 'Любая кожа головы',
  technology: 'Мягкая силиконовая насадка с устойчивой ручкой',
  keyBenefits: 'Глубокое очищение, густая пена, массаж, кровоток',
  usage: 'В душе, вместе с шампунем',
  system: 'Часть линии HR³ MATRIX',
  origin: 'Южная Корея',
}

const productDetailsAr = {
  form: 'فرشاة لفروة الرأس',
  size: 'قطعة واحدة',
  skinType: 'جميع أنواع فروة الرأس',
  technology: 'رأس من السيليكون الناعم مع مقبض ثابت',
  keyBenefits: 'تنظيف أعمق، رغوة أغنى، تدليك، تدفق الدم',
  usage: 'في الحمّام، مع الشامبو',
  system: 'جزء من خط HR³ MATRIX',
  origin: 'كوريا الجنوبية',
}

async function main() {
  const product = await prisma.product.findFirst({
    where: { OR: [{ productNumber: '61' }, { id: '61' }] },
  })
  if (!product) throw new Error('Product 61 not found')

  const next = {
    description,
    descriptionRu,
    descriptionAr,
    benefits: JSON.stringify(benefits),
    ingredients: JSON.stringify(ingredients),
    howToUse,
    directions,
    productDetails: JSON.stringify(productDetails),
  }

  const changed = Object.entries(next).filter(
    ([k, v]) => (product as unknown as Record<string, unknown>)[k] !== v
  )

  console.log(`Product 61: ${product.name}`)
  console.log(`Fields changing: ${changed.length}\n`)
  for (const [k, v] of changed) {
    const before = String((product as unknown as Record<string, unknown>)[k] ?? '')
    console.log(`--- ${k} ---`)
    console.log(`  before (${before.length} chars): ${before.slice(0, 140).replace(/\n/g, ' ⏎ ')}`)
    console.log(`  after  (${v.length} chars): ${v.slice(0, 140).replace(/\n/g, ' ⏎ ')}\n`)
  }

  // Anything still asserting a removed claim means an edit above was missed.
  const banned = [/50\s*%/, /medical[- ]grade/i, /hypoallergenic/i, /KFDA/i, /microneedl/i]
  const combined = Object.values(next).join('\n')
  const leaks = banned.filter((re) => re.test(combined))
  if (leaks.length) {
    throw new Error(`Replacement text still contains removed claims: ${leaks.join(', ')}`)
  }
  console.log('Claim check: no removed claim appears in the replacement text.\n')

  console.log('Localised payloads for the translation files (applied separately):')
  console.log(
    JSON.stringify(
      {
        ru: {
          benefits: benefitsRu,
          ingredients: ingredientsRu,
          howToUse: howToUseRu,
          directions: directionsRu,
          productDetails: productDetailsRu,
        },
        ar: {
          benefits: benefitsAr,
          ingredients: ingredientsAr,
          howToUse: howToUseAr,
          directions: directionsAr,
          productDetails: productDetailsAr,
        },
      },
      null,
      2
    ).slice(0, 400) + '  ... (full values live in the translation files)\n'
  )

  if (!APPLY) {
    console.log('DRY RUN. Re-run with --apply to write.')
    return
  }

  const backup = join(
    process.cwd(),
    `backup-product-61-${new Date().toISOString().slice(0, 10)}.json`
  )
  writeFileSync(backup, JSON.stringify(product, null, 2))
  console.log(`Backup written to ${backup}`)

  await prisma.product.update({ where: { id: product.id }, data: next })
  console.log('Applied.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
