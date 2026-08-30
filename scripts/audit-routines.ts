/**
 * Audit of every PDP "Recommended Routine".
 *
 * Checks the things that make a routine wrong in a way nobody notices from a
 * single screenshot: a step whose key never resolves, a step that silently
 * disappears from the mobile payload because one locale is missing, a step that
 * deep-links nowhere, and copy that says one thing in English and a different
 * thing in Russian.
 *
 * Read-only. Run: npx tsx --env-file=.env.local scripts/audit-routines.ts
 */
import { PRODUCT_ROUTINES } from '../lib/productRoutines'
import { ROUTINE_STEP_PRODUCT_IDS } from '../lib/routineStepLinks'
import { getRoutineStepImage } from '../lib/routineStepImages'
import enMessages from '../messages/en.json'
import arMessages from '../messages/ar.json'
import ruMessages from '../messages/ru.json'
import { existsSync } from 'fs'
import { join } from 'path'

type Loc = 'en' | 'ru' | 'ar'
const MSG: Record<Loc, Record<string, string>> = {
  en: (enMessages as any).product,
  ru: (ruMessages as any).product,
  ar: (arMessages as any).product,
}
const LOCALES: Loc[] = ['en', 'ru', 'ar']
const PUBLIC = join(process.cwd(), 'public')

interface Finding {
  product: string
  step: string
  kind: string
  detail: string
}
const findings: Finding[] = []
const add = (product: string, step: string, kind: string, detail: string) =>
  findings.push({ product, step, kind, detail })

/** Percentages and INCI-style names, which the selling-tone rule keeps out of
 *  customer copy. A routine step is the most customer-facing string we have. */
const PERCENT = /\d+[.,]?\d*\s?%/
const PPM = /\bppm\b/i
const INCI = /\b(Sodium Cocoyl Glutamate|Cocamidopropyl Betaine|Decyl Glucoside|PENTAVITIN|Butylene Glycol|Tocopheryl|Dimethicone|Sodium Hyaluronate|Niacinamide|Adenosine|Panthenol|Allantoin|Glycerin|Squalane)\b/i
/** A lot or batch code must never reach customer copy. */
const LOT = /\b[A-Z]\d{3,4}[A-Z]\b/

/** Terminal punctuation, including the Arabic full stop. */
const ENDS_CLEAN = /[.!?…。]\s*$|[)\]]\s*$/

const digitsOf = (s: string): string[] => {
  // Arabic copy may use Arabic-Indic numerals (٢٠) where English uses 20. Fold
  // them to Western digits first or every Arabic figure reads as absent.
  const western = s.replace(/[\u0660-\u0669]/g, (d) => String(d.charCodeAt(0) - 0x0660))
  // Normalize the decimal comma so 0,615 and 0.615 compare equal, and strip
  // thousands separators (RU writes 1 000,9 for what EN writes 1,000.9).
  const norm = western.replace(/(\d)[  ](?=\d)/g, '$1').replace(/(\d),(?=\d{3}\b)/g, '$1')
  return (norm.match(/\d+[.,]?\d*/g) || []).map((d) => d.replace(',', '.'))
}

const productIds = new Set(Object.keys(PRODUCT_ROUTINES))

/**
 * Beauty boxes and kits. Their routine is the contents of the box, step by
 * step, so the box never links to itself. Every other product should appear at
 * its own natural position in its routine.
 */
export const BEAUTY_BOXES = new Set(['47', '50', '55', '56', '57', '58', '59', '62'])

for (const [product, routine] of Object.entries(PRODUCT_ROUTINES)) {
  // ── heading ──────────────────────────────────────────────────────────
  for (const loc of LOCALES) {
    if (!MSG[loc][routine.headingKey]) {
      add(product, '(heading)', 'MISSING_KEY', `${loc}: ${routine.headingKey}`)
    }
  }

  if (routine.steps.length === 0) add(product, '(steps)', 'EMPTY', 'routine has no steps')

  const seen = new Map<string, number>()
  let selfSteps = 0

  routine.steps.forEach((s, i) => {
    const label = `${i + 1}. ${s.titleKey}`

    // Duplicate step within one routine.
    if (seen.has(s.titleKey)) {
      add(product, label, 'DUPLICATE_STEP', `also step ${seen.get(s.titleKey)! + 1}`)
    } else {
      seen.set(s.titleKey, i)
    }

    // ── keys resolve in every locale ───────────────────────────────────
    const texts: Partial<Record<Loc, string>> = {}
    for (const loc of LOCALES) {
      const title = MSG[loc][s.titleKey]
      const desc = MSG[loc][s.descKey]
      if (!title) add(product, label, 'MISSING_KEY', `${loc} title: ${s.titleKey}`)
      if (!desc) add(product, label, 'MISSING_KEY', `${loc} desc: ${s.descKey}`)
      if (desc) texts[loc] = desc
    }

    // ── truncation ─────────────────────────────────────────────────────
    for (const loc of LOCALES) {
      const d = texts[loc]
      if (d && !ENDS_CLEAN.test(d)) {
        add(product, label, 'TRUNCATED', `${loc} ends without terminal punctuation: "...${d.slice(-32)}"`)
      }
    }

    // ── deep link and image ────────────────────────────────────────────
    const linkId = ROUTINE_STEP_PRODUCT_IDS[s.titleKey]
    if (!linkId) {
      add(product, label, 'NO_LINK', 'step deep-links nowhere')
    } else if (linkId === product) {
      selfSteps++
    }

    const img = getRoutineStepImage(s.titleKey)
    if (!img) {
      add(product, label, 'NO_IMAGE', 'no thumbnail')
    } else if (!existsSync(join(PUBLIC, img))) {
      add(product, label, 'DEAD_IMAGE', img)
    }

    // ── does every locale tell the same story? ─────────────────────────
    const en = texts.en
    if (en) {
      for (const loc of ['ru', 'ar'] as Loc[]) {
        const other = texts[loc]
        if (!other) continue
        const a = new Set(digitsOf(en))
        const b = new Set(digitsOf(other))
        const onlyOther = [...b].filter((d) => !a.has(d))
        const onlyEn = [...a].filter((d) => !b.has(d))
        if (onlyOther.length || onlyEn.length) {
          add(
            product,
            label,
            'FIGURE_MISMATCH',
            `${loc} has ${JSON.stringify(onlyOther)} that en lacks; en has ${JSON.stringify(onlyEn)} that ${loc} lacks`
          )
        }
      }
    }

    // ── selling tone ───────────────────────────────────────────────────
    for (const loc of LOCALES) {
      const d = texts[loc]
      if (!d) continue
      if (LOT.test(d)) add(product, label, 'LOT_CODE', `${loc}: "${d.match(LOT)![0]}"`)
      // Naming one active in plain language is ordinary selling copy ("arbutin
      // works on dark circles"). What the tone rule bans is the dossier form:
      // an ingredient name welded to its concentration. Only flag that pairing.
      const inciWithPct = new RegExp(`${INCI.source}[^.!?]{0,24}?\\d`, 'i')
      if (inciWithPct.test(d)) add(product, label, 'INCI_IN_COPY', `${loc}: "${d.match(INCI)![0]}" with a figure`)
      if (PPM.test(d)) add(product, label, 'PPM_IN_COPY', `${loc}`)
      const pcts = d.match(new RegExp(PERCENT, 'g')) || []
      if (pcts.length >= 2) add(product, label, 'PERCENT_STACK', `${loc}: ${pcts.length} percentages`)
    }
  })

  if (selfSteps === 0) {
    // Beauty boxes are the exception: the routine lists what is inside the box,
    // so the box itself is never one of its own steps.
    if (!BEAUTY_BOXES.has(product)) {
      add(product, '(self)', 'NO_SELF_STEP', 'the product does not appear in its own routine')
    }
  } else if (selfSteps > 1) {
    add(product, '(self)', 'SELF_TWICE', `${selfSteps} steps point at this product`)
  }
}

// ── report ───────────────────────────────────────────────────────────────
const byKind = new Map<string, Finding[]>()
for (const f of findings) {
  if (!byKind.has(f.kind)) byKind.set(f.kind, [])
  byKind.get(f.kind)!.push(f)
}

console.log(`Audited ${productIds.size} routines, ${Object.values(PRODUCT_ROUTINES).reduce((n, r) => n + r.steps.length, 0)} steps\n`)
const order = [
  'MISSING_KEY', 'EMPTY', 'TRUNCATED', 'DEAD_IMAGE', 'NO_IMAGE', 'NO_LINK',
  'DUPLICATE_STEP', 'SELF_TWICE', 'NO_SELF_STEP',
  'LOT_CODE', 'INCI_IN_COPY', 'PPM_IN_COPY', 'PERCENT_STACK', 'FIGURE_MISMATCH',
]
for (const kind of order) {
  const fs = byKind.get(kind)
  if (!fs?.length) continue
  console.log(`\n### ${kind} (${fs.length})`)
  const shown = fs.slice(0, 14)
  for (const f of shown) console.log(`  ${f.product.padStart(3)} ${f.step.padEnd(46)} ${f.detail}`)
  if (fs.length > shown.length) console.log(`  ... and ${fs.length - shown.length} more`)
}
for (const [kind, fs] of byKind) {
  if (!order.includes(kind)) console.log(`\n### ${kind} (${fs.length})  [uncategorised]`)
}
console.log(`\nTOTAL ${findings.length} findings`)
