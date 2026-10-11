/**
 * FAQ items: return window 7 -> 10 days in EN / RU / AR (Vadim, 11 Oct 2026).
 *   npx tsx --env-file=.env.local scripts/faq-returns-10-days-20261011.ts          (dry run)
 *   npx tsx --env-file=.env.local scripts/faq-returns-10-days-20261011.ts --apply
 */
import { PrismaClient } from '@prisma/client'

const databaseUrl = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL
if (!databaseUrl) throw new Error('DATABASE_URL or PRISMA_DATABASE_URL is required')

const prisma = new PrismaClient(
  databaseUrl.includes('prisma.io') || databaseUrl.includes('accelerate')
    ? { accelerateUrl: databaseUrl, log: ['error'] }
    : { datasourceUrl: databaseUrl, log: ['error'] } as never,
)
const apply = process.argv.includes('--apply')

const SWAPS: [RegExp, string][] = [
  [/within 7 days of delivery/g, 'within 10 days of delivery'],
  [/(Refunds?[^.]*?)5-7/g, '$13-5'],
  [/(Возврат средств[^.]*?)5-7/g, '$13-5'],
  [/(الاسترداد[^.]*?)5-7/g, '$13-5'],
  [/within 7 days from delivery/g, 'within 10 days from delivery'],
  [/в течение 7 дней/g, 'в течение 10 дней'],
  [/خلال 7 أيام/g, 'خلال 10 أيام'],
  [/خلال ٧ أيام/g, 'خلال ١٠ أيام'],
]

function swap(s: string | null) {
  if (!s) return s
  return SWAPS.reduce((acc, [re, to]) => acc.replace(re, to), s)
}

async function main() {
  const items = await prisma.faqItem.findMany()
  for (const it of items) {
    const data: Record<string, string | null> = {}
    for (const f of ['answerEn', 'answerRu', 'answerAr'] as const) {
      const before = (it as Record<string, unknown>)[f] as string | null
      if (before === undefined) continue
      const after = swap(before)
      if (after !== before) data[f] = after
    }
    if (Object.keys(data).length) {
      console.log(`${it.id} ${it.questionEn}: ${Object.keys(data).join(', ')}`)
      if (apply) await prisma.faqItem.update({ where: { id: it.id }, data })
    }
  }
  console.log(apply ? 'applied' : 'dry run')
}

main().finally(() => prisma.$disconnect())
