/**
 * Rewrites the product 61 entry in the two translation files to match the
 * corrected database record.
 *
 * See scripts/fix-product-61-scalp-brush-claims-20260813.ts for the full source
 * audit. In short: the Arabic entry repeated every unsourced claim the English
 * record carried ("امتصاص ... بنسبة تصل إلى 50%", "سيليكون طبي مضاد للحساسية",
 * "تونيك الشعر المعتمد من KFDA"), and the Russian file had no entry for 61 at
 * all, so Russian shoppers were served the English benefit list and saw the same
 * claims that way.
 *
 * These blocks use multi-line template literals, so the single-line
 * `replaceField` helper cannot touch them; this replaces the whole entry.
 *
 * The two files are not written the same way. The Arabic file uses single-quoted
 * keys and backtick template literals; the Russian file uses double-quoted keys
 * and JSON strings with escaped newlines. The Russian entry is therefore built
 * with JSON.stringify so the escaping matches the file byte for byte, rather
 * than hand-written.
 *
 * Usage:
 *   npx tsx scripts/fix-product-61-translations-20260813.ts
 *   npx tsx scripts/fix-product-61-translations-20260813.ts --apply
 */

import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

const APPLY = process.argv.includes('--apply')
const AR = join(process.cwd(), 'data/productTranslations.ts')
const RU = join(process.cwd(), 'data/productTranslationsRu.ts')

const AR_ENTRY = `  '61': {
    description: \`فرشاة فروة الرأس HR³ MATRIX هي فرشاة سيليكون ناعمة لتنظيف فروة الرأس وتدليكها أثناء الغسل. مع الشامبو على شعر مبلل توصل الرغوة إلى الجلد وتساعد على إزالة زيوت فروة الرأس والخلايا الميتة وتراكم المنتجات، دون خدش فروة الرأس.

التدليك المنتظم يساعد على زيادة تدفق الدم إلى فروة الرأس، ما يمكن أن يساعد في الوقاية من ترقق الشعر، والتنظيف الأعمق الذي توفره يساعد على زيادة كثافة الشعر.

شريكها اليومي هو HR³ MATRIX MEDI SCALP SHAMPOO α، ومعه تصنع رغوة أغنى بشكل واضح. أما منتجات العلاج التي لا تُشطف من خط HR³ MATRIX فتوضع بعد الغسل، على فروة رأس نظيفة.\`,
    productDetails: '{"form":"فرشاة لفروة الرأس","size":"قطعة واحدة","skinType":"جميع أنواع فروة الرأس","technology":"رأس من السيليكون الناعم مع مقبض ثابت","keyBenefits":"تنظيف أعمق، رغوة أغنى، تدليك، تدفق الدم","usage":"في الحمّام، مع الشامبو","system":"جزء من خط HR³ MATRIX","origin":"كوريا الجنوبية"}',
    benefits: '["تصنع رغوة أغنى مع HR³ MATRIX MEDI SCALP SHAMPOO α","تساعد على إزالة زيوت فروة الرأس والخلايا الميتة وتراكم المنتجات","تنظّف وتدلّك دون خدش فروة الرأس","تساعد على زيادة تدفق الدم إلى فروة الرأس، ما يمكن أن يساعد في الوقاية من ترقق الشعر","تساعد على زيادة كثافة الشعر من خلال تنظيف أعمق","مقبض ثابت يبقى مريحاً بأيدٍ مبللة ومغطاة بالصابون","سيليكون ناعم، لطيف بما يكفي للاستخدام في كل غسلة"]',
    ingredients: '[{"name":"رأس فرشاة من السيليكون الناعم","description":"السيليكون الناعم يتيح تنظيف فروة الرأس وتدليكها بارتياح دون خدشها."},{"name":"مقبض ثابت","description":"شكله مصمم لاستخدام مريح وثابت واليدان مبللتان."}]',
    howToUse: \`1. بلّلي شعرك جيداً بماء فاتر
2. ضعي HR³ MATRIX MEDI SCALP SHAMPOO α واعملي على تكوين رغوة كافية
3. دلّكي فروة الرأس بالفرشاة بحركات دائرية صغيرة، منطقة تلو الأخرى
4. اشطفي جيداً بماء فاتر
5. اغسلي الفرشاة بعد الاستخدام واتركيها تجف في الهواء\`,
    directions: \`بعد الغسل
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
• للاستخدام الخارجي فقط. يُحفظ بعيداً عن متناول الأطفال\`
  },`

const RU_FIELDS = {
  description: `Мягкая силиконовая щётка HR³ MATRIX для очищения и массажа кожи головы во время мытья. С шампунем на влажных волосах она доводит пену до самой кожи и помогает удалить себум, отшелушенные клетки и остатки средств, не царапая кожу головы.

Регулярный массаж помогает усилить приток крови к коже головы, что может помочь предотвратить истончение волос, а более глубокое очищение помогает увеличить объём волос.

Её постоянный партнёр - HR³ MATRIX MEDI SCALP SHAMPOO α: вместе они дают заметно более густую пену. Несмываемые средства линии HR³ MATRIX наносятся после мытья, на чистую кожу головы.`,
  productDetails: JSON.stringify(
    {
      form: 'Щётка для кожи головы',
      size: '1 шт.',
      skinType: 'Все типы кожи головы',
      technology: 'Мягкая силиконовая насадка с устойчивой ручкой',
      keyBenefits: 'Глубокое очищение, густая пена, массаж, кровоток',
      usage: 'В душе, вместе с шампунем',
      system: 'Часть линии HR³ MATRIX',
      origin: 'Южная Корея',
    },
    null,
    2
  ),
  benefits: JSON.stringify(
    [
      'Даёт более густую пену вместе с HR³ MATRIX MEDI SCALP SHAMPOO α',
      'Помогает удалить себум, отшелушенные клетки и остатки средств',
      'Очищает и массирует, не царапая кожу головы',
      'Помогает усилить приток крови к коже головы, что может помочь предотвратить истончение волос',
      'Помогает увеличить объём волос за счёт более глубокого очищения',
      'Устойчивая ручка удобна даже в мокрых руках',
      'Мягкий силикон - подходит для каждого мытья',
    ],
    null,
    2
  ),
  ingredients: JSON.stringify(
    [
      {
        name: 'Мягкая силиконовая насадка',
        description:
          'Мягкий силикон позволяет комфортно очищать и массировать кожу головы, не царапая её.',
      },
      {
        name: 'Устойчивая ручка',
        description: 'Форма рассчитана на удобный и устойчивый хват мокрыми руками.',
      },
    ],
    null,
    2
  ),
  howToUse: `1. Тщательно намочите волосы тёплой водой
2. Нанесите HR³ MATRIX MEDI SCALP SHAMPOO α и взбейте достаточную пену
3. Массируйте кожу головы щёткой круговыми движениями, зона за зоной
4. Тщательно смойте тёплой водой
5. Промойте щётку после использования и оставьте сушиться на воздухе`,
  directions: `ПОСЛЕ МЫТЬЯ
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
• Только для наружного применения. Хранить в недоступном для детей месте`,
}

/** Matches the Russian file's shape: double-quoted keys, JSON string values,
 *  two-space indent, sitting one level inside the exported object. */
const RU_ENTRY =
  '  "61": ' +
  JSON.stringify(RU_FIELDS, null, 2)
    .split('\n')
    .map((line, i) => (i === 0 ? line : '  ' + line))
    .join('\n') +
  ','

/** Locates the `'61': { ... },` block by brace depth, so multi-line template
 *  literals inside it cannot terminate the match early. */
function findEntry(source: string, key: string): { start: number; end: number } | null {
  const open = new RegExp(`^\\s{2}['"]${key}['"]:\\s*\\{`, 'm')
  const m = source.match(open)
  if (!m || m.index === undefined) return null

  const start = m.index
  let depth = 0
  // Braces inside a string or template literal must not move the depth counter,
  // which is the whole reason a regex cannot delimit these blocks.
  let quote: '`' | "'" | '"' | null = null

  for (let i = start; i < source.length; i++) {
    const c = source[i]
    if (source[i - 1] === '\\') continue

    if (quote) {
      if (c === quote) quote = null
      continue
    }
    if (c === '`' || c === "'" || c === '"') {
      quote = c
      continue
    }
    if (c === '{') depth++
    if (c === '}') {
      depth--
      if (depth === 0) {
        return { start, end: i + (source[i + 1] === ',' ? 2 : 1) }
      }
    }
  }
  return null
}

function report(label: string, before: string, after: string) {
  const banned: Array<[string, RegExp]> = [
    ['50%', /50\s*%/],
    ['medical-grade', /سيليكون طبي|Медицинский силикон|medical[- ]grade/i],
    ['hypoallergenic', /مضاد للحساسية|гипоаллергенн/i],
    ['KFDA', /KFDA/i],
    ['microneedling', /ميكرونيدلينغ|микронидлинг|microneedl/i],
    ['tonic pairing', /HAIR TONIC/],
  ]
  console.log(`\n=== ${label} ===`)
  console.log(`  size: ${before.length} -> ${after.length} chars`)
  for (const [name, re] of banned) {
    const had = re.test(before)
    const has = re.test(after)
    if (had || has) console.log(`  ${name}: ${had ? 'present' : 'absent'} -> ${has ? 'STILL PRESENT' : 'removed'}`)
  }
  if (banned.some(([, re]) => re.test(after))) {
    throw new Error(`${label}: replacement still contains a removed claim`)
  }
}

function main() {
  // Arabic: replace the existing entry.
  const arSource = readFileSync(AR, 'utf8')
  const arBlock = findEntry(arSource, '61')
  if (!arBlock) throw new Error("Arabic entry '61' not found")
  const arBefore = arSource.slice(arBlock.start, arBlock.end)
  const arNext = arSource.slice(0, arBlock.start) + AR_ENTRY + arSource.slice(arBlock.end)
  report('data/productTranslations.ts (ar)', arBefore, AR_ENTRY)

  // Russian: replace the existing entry, which repeats the same claims.
  const ruSource = readFileSync(RU, 'utf8')
  const ruBlock = findEntry(ruSource, '61')
  if (!ruBlock) throw new Error("Russian entry '61' not found")
  const ruBefore = ruSource.slice(ruBlock.start, ruBlock.end)
  const ruNext = ruSource.slice(0, ruBlock.start) + RU_ENTRY + ruSource.slice(ruBlock.end)
  report('data/productTranslationsRu.ts (ru)', ruBefore, RU_ENTRY)

  if (!APPLY) {
    console.log('\nDRY RUN. Re-run with --apply to write.')
    return
  }

  writeFileSync(AR, arNext)
  writeFileSync(RU, ruNext)
  console.log('\nApplied to both files.')
}

main()
