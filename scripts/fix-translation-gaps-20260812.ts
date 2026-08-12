/**
 * Closes the Arabic and Russian content gaps found by the element-by-element
 * translation audit of all 66 live products.
 *
 * Every ingredient change is checked against the Intertek / DTS MG filings under
 * /Users/vadimkus/Desktop/Drive/Genosys/Registration/Intertek, so nothing is
 * added that is not in the declared formula and nothing declared is left out:
 *
 *   9  AWS ampoule       Arbutin was missing. Formula-GENOSYS POWER SOLUTION AWS
 *                        declares Arbutin at 2.0000% — the highest-dosed active.
 *  19  All For Sensitive  Lactobacillus/Pumpkin Ferment Extract was missing (RU).
 *  24  Eye Contour Cream  Arbutin 2% was missing (RU).
 *  26  EGF Oxymask        Oxygen carrier and eucalyptus rows were missing (RU),
 *                        and EGF/madecassoside were split into two rows.
 *  27  Barrier Cream      Glycerin + Hydrogenated Polydecene was missing (RU).
 *  33  Eye Peptide Patch  RU listed Arbutin and Retinyl Palmitate, neither of
 *                        which is in the patch INCI. Rebuilt from the English record.
 *  43  Hair Tonic α       AR/RU held three placeholder rows ("peptide complex",
 *                        "botanical extracts", "active ingredients"). Rebuilt from
 *                        Formula-GENOSYS HR³ MATRIX HAIR TONIC α.
 *  46  Scalp Peeling α    AR/RU claimed Sophora Japonica and Grapefruit Seed Oil,
 *                        neither in Formula-GENOSYS HR³ MATRIX SCALP PEELING α,
 *                        and omitted Copper Tripeptide-1, which is.
 *  51  Bio-Ferment Mask   AR/RU claimed Fermented Green Tea, absent from the INCI.
 *  63  Revita Glow        AR/RU said 7 herbs where the filing lists 8, omitted
 *                        Niacinamide 2% (the highest-dosed active) and promoted two
 *                        excipients as key actives. Benefits also carried three
 *                        cushion-applicator claims that belong to product 41.
 *
 * Benefit rows added for 12, 17, 24, 26 and 38 are translations of English claims
 * that had no Arabic counterpart. productDetails rows are the spec rows that
 * existed only in English; keys already covered under a different name in the
 * locale (form vs type, benefits vs keyBenefits) are deliberately left alone so
 * the spec table does not show the same fact twice.
 *
 * Usage: npx tsx scripts/fix-translation-gaps-20260812.ts [--apply]
 */
import { join } from 'path'
import { loadFile, saveFile, readField, replaceField, parseLiteral, tsLiteral } from './lib/patchTranslationFile'

const APPLY = process.argv.includes('--apply')
const AR_PATH = join(process.cwd(), 'data', 'productTranslations.ts')
const RU_PATH = join(process.cwd(), 'data', 'productTranslationsRu.ts')

interface Item {
  name: string
  description: string
}

type ListOp =
  | { kind: 'insertAt'; index: number; item: Item }
  | { kind: 'append'; items: Item[] }
  | { kind: 'replaceAll'; items: Item[] }
  | { kind: 'dropNames'; names: string[] }
  | { kind: 'renameAt'; index: number; name: string }

type StringsOp = { kind: 'appendStrings'; items: string[] } | { kind: 'replaceStrings'; items: string[] }

interface Edit {
  key: string
  field: 'ingredients' | 'benefits'
  ops: Array<ListOp | StringsOp>
}

// ---------------------------------------------------------------------------
// Shared rows, so the Arabic and Russian wording stays derived from one source.
// ---------------------------------------------------------------------------

const AR = {
  arbutin2: {
    name: 'Arbutin 2%',
    description: 'أعلى تركيز فعّال في التركيبة — مكوّن تفتيح يثبّط تكوّن الميلانين ويعمل كمضاد للأكسدة.',
  },
  copperTripeptideScalp: {
    name: 'Copper Tripeptide-1',
    description: 'ببتيد نحاسي لفروة الرأس يدعم صحة البصيلات خلال خطوة التقشير التحضيرية.',
  },
  niacinamide2: {
    name: 'Niacinamide 2%',
    description: 'أعلى تركيز فعّال في التركيبة — فيتامين B3 يفتّح ويوحّد اللون ويدعم حاجز البشرة.',
  },
}

const RU = {
  copperTripeptideScalp: {
    name: 'Copper Tripeptide-1',
    description: 'Пептид меди для кожи головы, поддерживающий здоровье фолликулов на подготовительном этапе пилинга.',
  },
  niacinamide2: {
    name: 'Niacinamide 2%',
    description:
      'Самый концентрированный активный компонент формулы — витамин B3, осветляющий, выравнивающий тон и поддерживающий барьер кожи.',
  },
}

const HAIR_TONIC_AR: Item[] = [
  {
    name: 'Copper Tripeptide-1',
    description: 'ببتيد نحاسي يعزّز تخليق الكولاجين ويدعم قوة الشعر وصحة البصيلات.',
  },
  { name: 'Sophora Japonica Extract', description: 'مستخلص نباتي مضاد للأكسدة يساعد في حماية بيئة فروة الرأس.' },
  {
    name: 'Salicylic Acid',
    description: 'مقشّر كيراتيني لفروة الرأس (0.25%) يساعد في إبقاء البصيلات خالية من التراكمات.',
  },
  { name: 'Menthol', description: 'عامل تبريد منعش (0.30%) يهدّئ فروة الرأس.' },
  { name: 'Caffeine', description: 'منبّه معروف لفروة الرأس يدعم بيئة تثبيت الشعر.' },
  {
    name: 'Centella Asiatica + Scutellaria Baicalensis + Licorice Root',
    description: 'ثلاثي نباتي مهدّئ يلطّف فروة الرأس ويحسّن حالتها.',
  },
  { name: 'Allantoin', description: 'عامل ملطّف يحافظ على هدوء فروة الرأس مع الاستخدام اليومي.' },
]

const HAIR_TONIC_RU: Item[] = [
  {
    name: 'Copper Tripeptide-1',
    description: 'Медный пептид, стимулирующий синтез коллагена и поддерживающий прочность волос и здоровье фолликулов.',
  },
  {
    name: 'Sophora Japonica Extract',
    description: 'Антиоксидантный растительный экстракт, помогающий защитить среду кожи головы.',
  },
  {
    name: 'Salicylic Acid',
    description: 'Кератолитик для кожи головы (0,25%), помогающий сохранять фолликулы свободными от отложений.',
  },
  { name: 'Menthol', description: 'Освежающий охлаждающий компонент (0,30%), успокаивающий кожу головы.' },
  { name: 'Caffeine', description: 'Известный стимулятор кожи головы, поддерживающий среду закрепления волос.' },
  {
    name: 'Centella Asiatica + Scutellaria Baicalensis + Licorice Root',
    description: 'Успокаивающее растительное трио, смягчающее и улучшающее состояние кожи головы.',
  },
  {
    name: 'Allantoin',
    description: 'Смягчающий компонент, сохраняющий спокойствие кожи головы при ежедневном использовании.',
  },
]

const OXYMASK_RU: Item[] = [
  {
    name: 'Oxygen Carrier Technology (Methyl Perfluoroisobutyl Ether)',
    description:
      'Перфторуглерод, который растворяет и высвобождает кислород на коже, обеспечивая пузырьковое кислородное действие крем-маски.',
  },
  {
    name: 'Copper Tripeptide-1',
    description:
      'Стимулирует синтез коллагена и обладает ранозаживляющими свойствами, помогая улучшить текстуру кожи и уменьшить признаки старения.',
  },
  {
    name: 'SEPITONIC M3 (Минеральный комплекс)',
    description:
      'Усиливает клеточный метаболизм и оживляет кожу, поставляя минералы, необходимые для её оптимальной работы.',
  },
  {
    name: 'Масло лосося',
    description:
      'Богато ненасыщенными жирными кислотами, оказывает противовоспалительное и ранозаживляющее действие, глубоко питая кожу.',
  },
  {
    name: 'Аденозин',
    description:
      'Обеспечивает антивозрастной эффект, уменьшая выраженность морщин и тонких линий для более гладкой и молодой кожи.',
  },
  {
    name: 'sh-Oligopeptide-1 (EGF) + Мадекассозид',
    description: 'Поддерживающий пептид EGF и мадекассозид из центеллы в составе комплекса восстановления кожи.',
  },
  { name: 'Eucalyptus Globulus Leaf Oil', description: 'Обеспечивает освежающее охлаждающее ощущение формулы.' },
]

const EYE_PATCH_RU: Item[] = [
  {
    name: 'Niacinamide 2%',
    description:
      'Витамин B3, который осветляет вид тёмных кругов и поддерживает барьер деликатной кожи вокруг глаз.',
  },
  {
    name: 'Acetyl Hexapeptide-8',
    description: 'Пептид для работы с мимикой, помогающий сгладить вид тонких линий вокруг глаз.',
  },
  {
    name: 'Мадекассозид + Centella Asiatica',
    description: 'Успокаивающий восстанавливающий дуэт для деликатной зоны вокруг глаз.',
  },
  {
    name: 'Гидролизованный коллаген',
    description: 'Наполняющий белок, поддерживающий упругость и увлажнённость кожи.',
  },
  {
    name: 'Аденозин',
    description: 'Функциональный компонент против морщин, сглаживающий и оживляющий зону вокруг глаз.',
  },
  {
    name: 'Растительные экстракты',
    description:
      'Ромашка, розмарин, шлемник байкальский и пантенол успокаивают, улучшают состояние и оживляют деликатную зону вокруг глаз.',
  },
]

const REVITA_BENEFITS_AR = [
  'تنشيط فوري للبشرة مع توهج صافٍ كالزجاج',
  'تغطية طبيعية تخفي عيوب البشرة',
  'حماية من الأشعة فوق البنفسجية SPF 38 PA+++',
  'غني بمركب 10 فيتامينات لتنشيط البشرة',
  'مركب 8 أعشاب للتهدئة وحماية الحاجز',
  'نياسيناميد 2% للتفتيح ودعم حاجز البشرة',
  'أدينوسين 0.04% لتحسين التجاعيد',
  'يحافظ على بشرة ناعمة ومشرقة بدون جفاف',
  'تركيبة مرطبة بمكونات ترطيب مستخلصة من النباتات',
]

const REVITA_BENEFITS_RU = [
  'Мгновенно оживляет цвет лица с чистым, стеклянным сиянием',
  'Естественное покрытие, скрывающее несовершенства кожи',
  'УФ-защита SPF 38 PA+++',
  'Обогащён комплексом 10 витаминов для энергии кожи',
  'Комплекс 8 трав для успокоения и защиты барьера',
  'Ниацинамид 2% для осветления и поддержки барьера',
  'Аденозин 0,04% для улучшения морщин',
  'Поддерживает гладкий, сияющий цвет лица без сухости',
  'Увлажняющая формула с растительными увлажняющими ингредиентами',
]

// ---------------------------------------------------------------------------
// Edits
// ---------------------------------------------------------------------------

const AR_EDITS: Edit[] = [
  { key: '43', field: 'ingredients', ops: [{ kind: 'replaceAll', items: HAIR_TONIC_AR }] },
  {
    key: '46',
    field: 'ingredients',
    ops: [
      { kind: 'dropNames', names: ['مستخلص السوفورا اليابانية', 'زيت بذور الجريب فروت'] },
      { kind: 'append', items: [AR.copperTripeptideScalp] },
    ],
  },
  {
    key: '63',
    field: 'ingredients',
    ops: [
      { kind: 'renameAt', index: 1, name: 'مركب 8 أعشاب' },
      { kind: 'dropNames', names: ['هيدروكسي إيثيل سيليلوز', 'ديكسترين'] },
      { kind: 'insertAt', index: 2, item: AR.niacinamide2 },
    ],
  },
  { key: '63', field: 'benefits', ops: [{ kind: 'replaceStrings', items: REVITA_BENEFITS_AR }] },
  {
    key: '12',
    field: 'benefits',
    ops: [{ kind: 'appendStrings', items: ['نتائج احترافية - تقشير بمستوى العيادات في المنزل'] }],
  },
  {
    key: '17',
    field: 'benefits',
    ops: [{ kind: 'appendStrings', items: ['ترطيب وشد - يرطب بعمق ويمنح البشرة امتلاءً ومرونة أفضل'] }],
  },
  {
    key: '24',
    field: 'benefits',
    ops: [{ kind: 'appendStrings', items: ['شد ورفع - يمنح تأثير شد ورفع لمحيط العين'] }],
  },
  {
    key: '26',
    field: 'benefits',
    ops: [{ kind: 'appendStrings', items: ['تحفيز الكولاجين - يعزز مرونة البشرة وشدّها'] }],
  },
  {
    key: '38',
    field: 'benefits',
    ops: [{ kind: 'appendStrings', items: ['نتائج احترافية - علاج كاربوكسي بمستوى العيادات في المنزل'] }],
  },
]

const RU_EDITS: Edit[] = [
  { key: '43', field: 'ingredients', ops: [{ kind: 'replaceAll', items: HAIR_TONIC_RU }] },
  {
    key: '46',
    field: 'ingredients',
    ops: [
      { kind: 'dropNames', names: ['Экстракт Sophora Japonica Linn', 'Масло семян грейпфрута'] },
      { kind: 'append', items: [RU.copperTripeptideScalp] },
    ],
  },
  { key: '26', field: 'ingredients', ops: [{ kind: 'replaceAll', items: OXYMASK_RU }] },
  { key: '33', field: 'ingredients', ops: [{ kind: 'replaceAll', items: EYE_PATCH_RU }] },
  {
    key: '19',
    field: 'ingredients',
    ops: [
      {
        kind: 'append',
        items: [
          {
            name: 'Lactobacillus/Pumpkin Ferment Extract',
            description:
              'Ферментированный компонент, поддерживающий микробиом, помогает успокоить и улучшить состояние чувствительной кожи.',
          },
        ],
      },
    ],
  },
  {
    key: '24',
    field: 'ingredients',
    ops: [
      {
        kind: 'insertAt',
        index: 0,
        item: {
          name: 'Arbutin 2%',
          description:
            'Высококонцентрированный осветляющий актив, который напрямую работает с видом тёмных кругов и пигментации.',
        },
      },
    ],
  },
  {
    key: '27',
    field: 'ingredients',
    ops: [
      {
        kind: 'append',
        items: [
          {
            name: 'Глицерин + Hydrogenated Polydecene',
            description: 'Эмолентная основа, которая создаёт длительное ощущение увлажнённости крема.',
          },
        ],
      },
    ],
  },
  {
    key: '63',
    field: 'ingredients',
    ops: [
      { kind: 'renameAt', index: 1, name: 'Комплекс 8 трав' },
      { kind: 'dropNames', names: ['Гидроксиэтилцеллюлоза', 'Декстрин'] },
      { kind: 'insertAt', index: 2, item: RU.niacinamide2 },
    ],
  },
  { key: '63', field: 'benefits', ops: [{ kind: 'replaceStrings', items: REVITA_BENEFITS_RU }] },
]

// productDetails rows that existed only in English.
const AR_DETAILS: Record<string, Record<string, string>> = {
  '3': { size: 'جهاز واحد' },
  '26': { specialFeature: 'تأثير فقاعات الأكسجين الفريد' },
  '38': {
    kitContents: 'جل 20 غ × 5 قطع، قناع 12 غ × 5 قطع، قناع ببتيد واحد',
    specialFeature: 'قناع محفّز لتعزيز امتصاص العلاج',
  },
  '44': { approval: 'منتج وظيفي معتمد من KFDA' },
  '48': { size: 'جهاز واحد', features: 'تدليك، تسخين، وضع الموسيقى' },
  '50': { kitContents: '4 مكونات (سيروم، كريم، لصقات، رولر للعين)' },
  '65': { productType: 'أمبولة' },
}

const RU_DETAILS: Record<string, Record<string, string>> = {
  '2': {
    target: 'Выработка коллагена и трансдермальная доставка питательных веществ',
    skinType: 'Все типы кожи, особенно зрелая кожа и кожа с неровным рельефом',
    application: 'Создаёт микроканалы для усиленного впитывания ингредиентов',
    safety: 'Устройство профессионального класса с контролируемой глубиной проникновения',
  },
  '62': {
    target: 'Комплексный уход за чувствительной и реактивной кожей',
    technology: 'Успокаивающие и укрепляющие барьер ингредиенты',
    application: 'Используйте продукты согласно инструкциям',
  },
  '65': { productType: 'Ампула' },
}

// ---------------------------------------------------------------------------

function applyListOps(current: unknown, ops: Array<ListOp | StringsOp>, key: string, field: string): unknown {
  if (!Array.isArray(current)) throw new Error(`${key}.${field} is not an array`)
  let list = [...current] as Array<Item | string>

  for (const op of ops) {
    switch (op.kind) {
      case 'replaceAll':
      case 'replaceStrings':
        list = [...op.items]
        break
      case 'append':
      case 'appendStrings':
        list = [...list, ...op.items]
        break
      case 'insertAt':
        list.splice(op.index, 0, op.item)
        break
      case 'dropNames': {
        const before = list.length
        list = list.filter((i) => typeof i === 'string' || !op.names.includes(i.name ?? ''))
        if (list.length !== before - op.names.length) {
          throw new Error(`${key}.${field}: dropNames matched ${before - list.length} of ${op.names.length}`)
        }
        break
      }
      case 'renameAt': {
        const item = list[op.index]
        if (typeof item === 'string') throw new Error(`${key}.${field}[${op.index}] is a string`)
        list[op.index] = { ...item, name: op.name }
        break
      }
    }
  }
  return list
}

/** Adds keys before `origin`, which every spec table keeps last. */
function mergeDetails(current: Record<string, string>, additions: Record<string, string>): Record<string, string> {
  const out: Record<string, string> = {}
  for (const [k, v] of Object.entries(current)) {
    if (k === 'origin') for (const [ak, av] of Object.entries(additions)) if (!(ak in current)) out[ak] = av
    out[k] = v
  }
  if (!('origin' in current)) for (const [ak, av] of Object.entries(additions)) if (!(ak in current)) out[ak] = av
  return out
}

function run(path: string, style: 'compact' | 'pretty', edits: Edit[], details: Record<string, Record<string, string>>) {
  let source = loadFile(path)
  let count = 0

  for (const edit of edits) {
    const raw = parseLiteral(readField(source, edit.key, edit.field)) as string | null
    if (typeof raw !== 'string') throw new Error(`${edit.key}.${edit.field} is not a string literal`)
    const next = applyListOps(JSON.parse(raw), edit.ops, edit.key, edit.field)
    source = replaceField(source, edit.key, edit.field, tsLiteral(next, style))
    console.log(`  ${edit.key}.${edit.field}: ${(JSON.parse(raw) as unknown[]).length} -> ${(next as unknown[]).length} items`)
    count++
  }

  for (const [key, additions] of Object.entries(details)) {
    const raw = parseLiteral(readField(source, key, 'productDetails')) as string
    const merged = mergeDetails(JSON.parse(raw) as Record<string, string>, additions)
    source = replaceField(source, key, 'productDetails', tsLiteral(merged, style))
    console.log(`  ${key}.productDetails: + ${Object.keys(additions).join(', ')}`)
    count++
  }

  if (APPLY) saveFile(path, source)
  return count
}

console.log('Arabic:')
const ar = run(AR_PATH, 'compact', AR_EDITS, AR_DETAILS)
console.log('\nRussian:')
const ru = run(RU_PATH, 'pretty', RU_EDITS, RU_DETAILS)
console.log(`\n${ar + ru} field(s) patched. ${APPLY ? 'WRITTEN' : 'DRY RUN — pass --apply to write'}`)
