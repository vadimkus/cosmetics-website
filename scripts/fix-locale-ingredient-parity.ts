/**
 * Brings Arabic and Russian ingredient lists into line with the English record,
 * which is the INCI-verified source of truth.
 *
 *   41  add Niacinamide 2%        (present in the INCI, missing in both locales)
 *   42  add UV Filter System      (present in the INCI, missing in both locales)
 *   45  rebuild from English      (locales described a different formula)
 *   52  drop Hyaluronic Acid / "5 ceramide types" — not in this product's INCI
 *   53  drop Vitamin E, sea algae, argan oil, shea butter — not in this INCI
 *
 * Product 43 is deliberately untouched: its English list itself names
 * Copper Tripeptide-1 and Caffeine, neither of which appears in its INCI, so it
 * needs verification against the Intertek filing rather than translation.
 *
 * Usage: npx tsx scripts/fix-locale-ingredient-parity.ts [--apply]
 */
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

const APPLY = process.argv.includes('--apply')
const AR_FILE = join(process.cwd(), 'data', 'productTranslations.ts')
const RU_FILE = join(process.cwd(), 'data', 'productTranslationsRu.ts')

type Item = { name?: string; description?: string; subList?: string[]; [k: string]: unknown }
type Op = (items: Item[]) => Item[]

const insertAt = (index: number, item: Item): Op => (items) => [...items.slice(0, index), item, ...items.slice(index)]
const append = (item: Item): Op => (items) => [...items, item]
const keepIndexes = (...idx: number[]): Op => (items) => idx.map((i) => items[i]).filter(Boolean) as Item[]
const replaceAll = (next: Item[]): Op => () => next

const AR_OPS: Record<string, Op> = {
  '41': insertAt(1, {
    name: 'نياسيناميد 2%',
    description: 'فيتامين B3 بتركيز 2% — يفتّح البشرة ويدعم حاجزها، ويساعد في توحيد لون البشرة.',
  }),
  '42': append({
    name: 'نظام مرشحات الأشعة فوق البنفسجية',
    description:
      'ثاني أكسيد التيتانيوم مع Ethylhexyl Methoxycinnamate و Octocrylene — مرشحات معدنية وعضوية توفّر حماية SPF 30 PA++.',
  }),
  '45': replaceAll([
    {
      name: 'مركب الببتيدات',
      description:
        'sh-Polypeptide-71 و sh-Polypeptide-9 يدعمان صحة بصيلات الشعر؛ Copper Tripeptide-1 يعزّز تخليق الكولاجين وقوة الشعر؛ sh-Oligopeptide-1 (EGF) يدعم تجديد جلد فروة الرأس.',
    },
    {
      name: 'مستخلص فاكهة البالميتو المنشاري (Serenoa Serrulata)',
      description: 'مكوّن نباتي موثّق لترقّق الشعر المرتبط بهرمون DHT — يدعم بيئة صحية للبصيلات.',
    },
    { name: 'نياسيناميد (Niacinamide)', description: 'فيتامين B3 يدعم وظيفة حاجز فروة الرأس والدورة الدموية.' },
    { name: 'مينثول (Menthol)', description: 'يمنح إحساساً منعشاً بالبرودة يريح فروة الرأس.' },
    {
      name: 'مستخلص البروكلي (Brassica Oleracea Italica)',
      description: 'مكوّن نباتي مضاد للأكسدة يساعد في حماية فروة الرأس.',
    },
  ]),
  '52': keepIndexes(0, 1, 3),
}

const RU_OPS: Record<string, Op> = {
  '41': insertAt(1, {
    name: 'Ниацинамид 2%',
    description: 'Витамин B3 в концентрации 2% — осветляет кожу и поддерживает её барьер, помогает выровнять тон.',
  }),
  '42': append({
    name: 'Система UV-фильтров',
    description:
      'Диоксид титана с Ethylhexyl Methoxycinnamate и Octocrylene — минеральные и органические фильтры, обеспечивающие защиту SPF 30 PA++.',
  }),
  '45': replaceAll([
    {
      name: 'Пептидный комплекс',
      description:
        'sh-Polypeptide-71 и sh-Polypeptide-9 поддерживают здоровье волосяных фолликулов; Copper Tripeptide-1 стимулирует синтез коллагена и прочность волос; sh-Oligopeptide-1 (EGF) поддерживает обновление кожи головы.',
    },
    {
      name: 'Экстракт плодов сереноа (Serenoa Serrulata)',
      description:
        'Растительный компонент с документированным действием при истончении волос, связанном с ДГТ — поддерживает здоровую среду фолликулов.',
    },
    { name: 'Ниацинамид (Niacinamide)', description: 'Витамин B3, поддерживающий барьерную функцию кожи головы и кровообращение.' },
    { name: 'Ментол (Menthol)', description: 'Даёт освежающее охлаждающее ощущение, успокаивающее кожу головы.' },
    {
      name: 'Экстракт брокколи (Brassica Oleracea Italica)',
      description: 'Антиоксидантный растительный компонент, помогающий защитить кожу головы.',
    },
  ]),
  '52': keepIndexes(0, 1, 3),
  '53': keepIndexes(0, 1),
}

/** Locates the `ingredients` string literal inside one product entry and rewrites it. */
function rewrite(source: string, key: string, op: Op, style: 'single' | 'double'): string {
  const opener = style === 'single' ? `\n  '${key}': {` : `\n  "${key}": {`
  const start = source.indexOf(opener)
  if (start === -1) throw new Error(`entry ${key} not found`)
  const end = source.indexOf('\n  },', start)
  if (end === -1) throw new Error(`entry ${key} not terminated`)

  const block = source.slice(start, end)
  const pattern = style === 'single' ? /\n    ingredients: '(.*)',/ : /\n    "ingredients": "(.*)",/
  const match = pattern.exec(block)
  if (!match) throw new Error(`ingredients not found for ${key}`)

  // Decode the TS string literal to the JSON payload it carries.
  const raw = match[1]
  const jsonText = style === 'single' ? raw : (JSON.parse(`"${raw}"`) as string)
  const items = JSON.parse(jsonText) as Item[]

  const next = op(items)
  const nextJson = JSON.stringify(next)
  if (style === 'single' && nextJson.includes("'")) throw new Error(`single quote in payload for ${key}`)
  const nextLine =
    style === 'single' ? `\n    ingredients: '${nextJson}',` : `\n    "ingredients": ${JSON.stringify(nextJson)},`

  console.log(`  ${key}: ${items.length} -> ${next.length} items`)
  return source.slice(0, start) + block.replace(match[0], nextLine) + source.slice(end)
}

function processFile(file: string, ops: Record<string, Op>, style: 'single' | 'double') {
  let text = readFileSync(file, 'utf8')
  console.log(`\n${file.split('/').pop()}:`)
  for (const [key, op] of Object.entries(ops)) text = rewrite(text, key, op, style)
  if (APPLY) {
    writeFileSync(file, text, 'utf8')
    console.log('  written')
  }
}

processFile(AR_FILE, AR_OPS, 'single')
processFile(RU_FILE, RU_OPS, 'double')
if (!APPLY) console.log('\nDRY RUN — pass --apply to write.')
