/**
 * The bespoke product copy, flattened into something a client can render.
 *
 * Each bespoke page keeps its own copy shape, because each page has its own
 * layout: a sunscreen has a UV filter table, a cushion has shades, a peel has a
 * day-by-day timeline. But the vocabulary underneath is strikingly consistent —
 * a section carries some combination of eyebrow, title, intro, a list of
 * title/body cards, a table of label/value rows, a set of bullets and a closing
 * note. Sixty-two products, and effectively eight shapes.
 *
 * So rather than write sixty-two adapters, this reads the shapes. A section
 * becomes a block with whichever of those parts it happens to have, and a client
 * that can draw those eight parts can draw any product, including ones that do
 * not exist yet.
 *
 * What is deliberately dropped: button labels, cart states and other interface
 * chrome that lives in the copy files because the web page renders it. The app
 * has its own words for "Add to bag".
 */

import { getBespokeCopy } from './bespokeCopyRegistry'

export interface BespokeEntry {
  title?: string | undefined
  body?: string | undefined
}

export interface BespokeRow {
  label: string
  value: string
}

export interface BespokeQuestion {
  question: string
  answer: string
}

export interface BespokeList {
  title?: string | undefined
  items: string[]
}

export interface BespokeBlock {
  key: string
  eyebrow?: string | undefined
  title?: string | undefined
  intro?: string | undefined
  body?: string | undefined
  note?: string | undefined
  disclaimer?: string | undefined
  bullets?: string[] | undefined
  entries?: BespokeEntry[] | undefined
  rows?: BespokeRow[] | undefined
  questions?: BespokeQuestion[] | undefined
  lists?: BespokeList[] | undefined
}

export interface BespokeContent {
  eyebrow?: string | undefined
  headline?: string | undefined
  subheadline?: string | undefined
  heroBullets?: string[] | undefined
  badges?: string[] | undefined
  stats?: BespokeRow[] | undefined
  blocks: BespokeBlock[]
}

/**
 * Interface chrome. These exist in the copy files because the web page renders
 * its own buttons and cart states; the app has its own.
 */
const CHROME = new Set([
  'addToBag', 'adding', 'added', 'inBag', 'viewBag', 'outOfStock', 'soldOut',
  'vatIncluded', 'freeDelivery', 'backToProducts', 'loginToShop', 'loginToSeePrice',
  'reviewsTitle', 'chooseSize', 'chooseOptions', 'decimalSeparator', 'currency',
  'shadeLabel', 'shadeHelp', 'shadeSelected', 'shadeRequired', 'quantity',
  'eyebrow', 'headline', 'subheadline', 'heroBullets', 'badges', 'stats',
  'weeklyNote', 'usageNote', 'packSize', 'brochure',
])

/**
 * A reading order for the sections we know. Anything unrecognised keeps its
 * position relative to the copy file, appended after these, so a new section on
 * one product still reaches the app without this list being updated.
 */
const ORDER = [
  'solution', 'working', 'science', 'functions', 'effects', 'mechanism',
  'engine', 'complex', 'actives', 'formula', 'inci', 'filters', 'fragrance',
  'shadeSection', 'shades', 'wear', 'puff', 'timeline', 'clinical', 'proof',
  'lab', 'quality', 'clean', 'freeFrom', 'howTo', 'sizes', 'range',
  'suited', 'safety', 'spec', 'details', 'faq', 'closing',
]

const text = (value: unknown): string | undefined => {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  return trimmed ? trimmed : undefined
}

const stringList = (value: unknown): string[] | undefined => {
  if (!Array.isArray(value)) return undefined
  const items = value.filter((v): v is string => typeof v === 'string' && v.trim().length > 0)
  return items.length ? items : undefined
}

/** title+body cards, however the copy file happened to name those two fields. */
const entries = (value: unknown): BespokeEntry[] | undefined => {
  if (!Array.isArray(value)) return undefined
  const mapped = value
    .filter((v): v is Record<string, unknown> => Boolean(v) && typeof v === 'object')
    .map((item) => ({
      title: text(item.title ?? item.name ?? item.day ?? item.step),
      body: text(item.body ?? item.description ?? item.text ?? item.detail),
    }))
    .filter((entry) => entry.title || entry.body)
  return mapped.length ? mapped : undefined
}

/**
 * label/value pairs. Spec tables use label/value, stats use value/label, and the
 * UV filter tables use name/amount/role — the third column folds into the value
 * rather than being lost.
 */
const rows = (value: unknown): BespokeRow[] | undefined => {
  if (!Array.isArray(value)) return undefined
  const mapped = value
    .filter((v): v is Record<string, unknown> => Boolean(v) && typeof v === 'object')
    .map((item) => {
      const label = text(item.label ?? item.name)
      const amount = text(item.amount)
      const role = text(item.role)
      const value_ = text(item.value) ?? (amount && role ? `${amount} · ${role}` : amount ?? role)
      return label && value_ ? { label, value: value_ } : null
    })
    .filter((row): row is BespokeRow => row !== null)
  return mapped.length ? mapped : undefined
}

/** stats are the mirror of a row: the number leads and the label explains it. */
const stats = (value: unknown): BespokeRow[] | undefined => {
  if (!Array.isArray(value)) return undefined
  const mapped = value
    .filter((v): v is Record<string, unknown> => Boolean(v) && typeof v === 'object')
    .map((item) => {
      const label = text(item.value)
      const value_ = text(item.label)
      return label && value_ ? { label, value: value_ } : null
    })
    .filter((row): row is BespokeRow => row !== null)
  return mapped.length ? mapped : undefined
}

const questions = (value: unknown): BespokeQuestion[] | undefined => {
  if (!Array.isArray(value)) return undefined
  const mapped = value
    .filter((v): v is Record<string, unknown> => Boolean(v) && typeof v === 'object')
    .map((item) => {
      const question = text(item.q ?? item.question)
      const answer = text(item.a ?? item.answer)
      return question && answer ? { question, answer } : null
    })
    .filter((qa): qa is BespokeQuestion => qa !== null)
  return mapped.length ? mapped : undefined
}

/**
 * The "right for you / look elsewhere if" pairs. Talking the wrong buyer out of
 * a purchase is some of the most valuable copy on these pages, so it travels
 * with its heading attached rather than collapsing into one bullet list.
 */
const lists = (section: Record<string, unknown>): BespokeList[] | undefined => {
  const found: BespokeList[] = []
  const pairs: Array<[unknown, unknown]> = [
    [section.forTitle, section.forList],
    [section.notTitle ?? section.notForTitle, section.notList ?? section.notForList],
  ]
  for (const [title, items] of pairs) {
    const values = stringList(items)
    if (values) found.push({ title: text(title), items: values })
  }
  return found.length ? found : undefined
}

function toBlock(key: string, section: Record<string, unknown>): BespokeBlock | null {
  const block: BespokeBlock = {
    key,
    eyebrow: text(section.eyebrow),
    title: text(section.title),
    intro: text(section.intro),
    body: text(section.body),
    note: text(section.note ?? section.inciNote ?? section.fullInciNote),
    disclaimer: text(section.disclaimer),
    bullets:
      stringList(section.points) ??
      stringList(section.items) ??
      stringList(section.feels),
    entries:
      entries(section.steps) ??
      entries(section.cards) ??
      entries(section.points) ??
      entries(section.items) ??
      entries(section.days),
    rows: rows(section.rows) ?? rows(section.entries) ?? rows(section.metrics),
    questions: questions(section.items) ?? questions(section.questions),
    lists: lists(section),
  }

  // The full INCI is the reason a clinic opens this section at all, and it is a
  // single long string rather than a list, so it rides in the body.
  const fullInci = text(section.fullInci)
  if (fullInci) block.body = block.body ? `${block.body}\n\n${fullInci}` : fullInci

  // A block that only carries a heading is noise on a phone.
  const hasContent = Boolean(
    block.intro || block.body || block.note || block.disclaimer ||
    block.bullets || block.entries || block.rows || block.questions || block.lists
  )
  if (!hasContent) return null

  for (const field of Object.keys(block) as Array<keyof BespokeBlock>) {
    if (block[field] === undefined) delete block[field]
  }
  return block
}

export function getBespokeContent(
  productNumber: string | number | null | undefined,
  locale: string
): BespokeContent | null {
  const copy = getBespokeCopy(productNumber, locale)
  if (!copy) return null

  const blocks: BespokeBlock[] = []
  for (const [key, value] of Object.entries(copy)) {
    if (CHROME.has(key)) continue
    if (!value || typeof value !== 'object' || Array.isArray(value)) continue
    const block = toBlock(key, value as Record<string, unknown>)
    if (block) blocks.push(block)
  }

  blocks.sort((a, b) => {
    const ai = ORDER.indexOf(a.key)
    const bi = ORDER.indexOf(b.key)
    return (ai === -1 ? ORDER.length : ai) - (bi === -1 ? ORDER.length : bi)
  })

  const content: BespokeContent = {
    eyebrow: text(copy.eyebrow),
    headline: text(copy.headline),
    subheadline: text(copy.subheadline),
    heroBullets: stringList(copy.heroBullets),
    badges: stringList(copy.badges),
    stats: stats(copy.stats),
    blocks,
  }
  for (const field of Object.keys(content) as Array<keyof BespokeContent>) {
    if (content[field] === undefined) delete content[field]
  }
  return content
}
