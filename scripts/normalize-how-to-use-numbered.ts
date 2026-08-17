/**
 * Normalize product.howToUse to plain text with 1. 2. 3. numbering
 * (Cerabarrier / product 66 style). Does not invent steps — only reformats.
 *
 *   npx tsx --env-file=.env.local scripts/normalize-how-to-use-numbered.ts
 *   npx tsx --env-file=.env.local scripts/normalize-how-to-use-numbered.ts --apply
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { prisma } from '../lib/prisma'

type Step = { step?: string; instruction?: string }

function isEmpty(v: string | null | undefined): boolean {
  if (v == null) return true
  const s = v.trim()
  return !s || s === 'null' || s === '[]' || s === '{}'
}

/** Split prose into sentences without inventing content. */
function splitSentences(text: string): string[] {
  const cleaned = text.replace(/\s+/g, ' ').trim()
  if (!cleaned) return []
  const parts = cleaned
    // Latin + Cyrillic sentence starts. Do not split on numbered-list dots (e.g. "1. Apply").
    .split(/(?<=(?<!\d)[.!?])\s+(?=[\p{Lu}\p{Nd}“"«])/u)
    .map((s) => s.trim())
    .filter(Boolean)
  return parts.length ? parts : [cleaned]
}

function numberLines(lines: string[]): string {
  return lines
    .map((line) => line.replace(/^\d+\.\s*/, '').trim())
    .filter(Boolean)
    .map((line, i) => `${i + 1}. ${line}`)
    .join('\n')
}

function convertJsonSteps(steps: Step[]): string {
  const lines = steps
    .map((s) => String(s.instruction || '').replace(/\s+/g, ' ').trim())
    .filter(Boolean)
  return numberLines(lines)
}

/** "Step 1 - Title: body" or "Step 1 - Title:\n• bullet" blocks → numbered. */
function convertStepDashBlocks(text: string): string | null {
  const re = /Step\s+(\d+)\s*[-–—:]\s*([^\n]+)/gi
  const matches = [...text.matchAll(re)]
  if (matches.length < 2) return null

  const blocks: { n: number; title: string; start: number }[] = matches.map((m) => ({
    n: Number(m[1]),
    title: m[2].trim().replace(/:$/, ''),
    start: m.index!,
  }))

  const intro = text.slice(0, blocks[0].start).trim()
  const parts: string[] = []

  for (let i = 0; i < blocks.length; i++) {
    const end = i + 1 < blocks.length ? blocks[i + 1].start : text.length
    let body = text.slice(blocks[i].start, end)
    // strip the Step N header line
    body = body.replace(/^Step\s+\d+\s*[-–—:]\s*[^\n]+\n?/i, '').trim()
    // flatten bullets into sentences
    const bullets = body
      .split(/\n/)
      .map((l) => l.replace(/^[\s•\-\*]+/, '').trim())
      .filter(Boolean)
    const title = blocks[i].title.replace(/:\s*$/, '')
    const detail = bullets.join(' ').replace(/\s+/g, ' ').trim()
    // If title already contains the full sentence after colon pattern "Title: rest"
    if (title.includes(':')) {
      parts.push(title.replace(/\s+/g, ' ').trim() + (detail && !title.includes(detail.slice(0, 20)) ? ` ${detail}` : ''))
    } else if (detail) {
      parts.push(`${title}: ${detail}`)
    } else {
      parts.push(title)
    }
  }

  // Preserve trailing sections that are not Step-N (e.g. ALTERNATIVE USES)
  const lastBlock = blocks[blocks.length - 1]
  const afterLastHeader = text.slice(lastBlock.start)
  const nextSection = afterLastHeader.search(/\n\n(?=[A-Z][A-Z\s/()]{3,}:?\n)/)
  let trailing = ''
  if (nextSection >= 0) {
    // find absolute position
    const abs = lastBlock.start + nextSection
    // only if after we've consumed step body — recompute from end of last step content
    const lastEndGuess = text.length
    // Better: trailing = text after last step block content ends at next ALLCAPS section
    const altIdx = text.search(/\n\nALTERNATIVE|\n\nWet Use|\n\nDaily /i)
    if (altIdx > blocks[0].start) {
      trailing = text.slice(altIdx).trim()
      // Also renumber any "Step N" left in trailing? usually already 1.2.3 or bullets
      trailing = trailing.replace(/^Step\s+(\d+)\s*[-–—:]\s*/gim, (_, n) => `${n}. `)
    }
  }

  // For 63-style, title already has "Title: body" in the header match group
  // Rebuild parts from header lines more carefully for "Step N - Title: rest of sentence"
  const rebuilt: string[] = []
  for (let i = 0; i < blocks.length; i++) {
    const end = i + 1 < blocks.length ? blocks[i + 1].start : trailing ? text.search(/\n\nALTERNATIVE|\n\nWet Use|\n\nDaily /i) : text.length
    const endPos = end < 0 ? text.length : end
    let chunk = text.slice(blocks[i].start, endPos)
    chunk = chunk.replace(/^Step\s+\d+\s*[-–—:]\s*/i, '').trim()
    const lines = chunk
      .split(/\n/)
      .map((l) => l.replace(/^[\s•\-\*]+/, '').trim())
      .filter(Boolean)
    if (!lines.length) continue
    const [titleLine, ...rest] = lines
    const body = rest
      .map((l) => (/[.!?]$/.test(l) ? l : `${l}.`))
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim()
    if (titleLine.endsWith(':')) {
      rebuilt.push(`${titleLine} ${body}`.replace(/\s+/g, ' ').trim())
    } else if (body) {
      const titled = /[.!?]$/.test(titleLine) ? titleLine : `${titleLine}.`
      rebuilt.push(`${titled} ${body}`.replace(/\s+/g, ' ').trim())
    } else {
      rebuilt.push(titleLine.replace(/\s+/g, ' ').trim())
    }
  }

  let out = numberLines(rebuilt.filter(Boolean))
  if (intro) out = `${intro}\n\n${out}`
  if (trailing) {
    // keep trailing as-is if it already has numbered wet use; just ensure Step labels → numbers
    const t = trailing
      .replace(/^Step\s+(\d+)\s*[-–—:]\s*/gim, (_, n) => `${n}. `)
      .replace(/^•\s*/gm, '') // leave bullets as plain lines under section headers, or number them?
    out = `${out}\n\n${t}`
  }
  return out.trim()
}

function convertPlainProse(text: string): string {
  // Preserve blank-line separated paragraphs: first may be intro if no action verbs?
  const paragraphs = text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)

  // Special: "Professional Treatment...:\n\nHome Care...:" labeled sections
  if (/^[A-Za-z][^:\n]{2,40}:\s/m.test(text) && paragraphs.length >= 2 && paragraphs.some((p) => /^[A-Za-z].{2,40}:/.test(p))) {
    const lines = paragraphs.map((p) => p.replace(/\s+/g, ' ').trim())
    return numberLines(lines)
  }

  // Multi-paragraph action steps (e.g. product 65)
  if (paragraphs.length >= 2) {
    return numberLines(paragraphs.map((p) => p.replace(/\s+/g, ' ').trim()))
  }

  const sentences = splitSentences(text)
  if (sentences.length >= 2) return numberLines(sentences)
  // Single short line — still number as 1.
  return numberLines([text.replace(/\s+/g, ' ').trim()])
}

export function normalizeHowToUse(raw: string | null | undefined): string | null {
  if (isEmpty(raw)) return null
  const text = String(raw).trim()

  // JSON step array
  if (text.startsWith('[')) {
    try {
      const parsed = JSON.parse(text)
      if (Array.isArray(parsed) && parsed.length && typeof parsed[0] === 'object') {
        return convertJsonSteps(parsed as Step[])
      }
    } catch {
      // fall through
    }
  }

  // Already 1. 2. 3. style — drop empty "N." lines, renumber, keep intro/trailing prose
  const numberedCount = (text.match(/^\s*\d+\.\s+/gm) || []).length
  if (numberedCount >= 1 && !/^Step\s+\d+/im.test(text)) {
    const lines = text.replace(/\r\n/g, '\n').split('\n')
    const intro: string[] = []
    const steps: string[] = []
    const trailing: string[] = []
    let phase: 'intro' | 'steps' | 'trailing' = 'intro'
    for (const line of lines) {
      const m = line.match(/^\s*\d+\.\s*(.*)$/)
      if (m) {
        phase = 'steps'
        if (m[1].trim()) steps.push(m[1].trim())
        continue
      }
      if (phase === 'intro') intro.push(line)
      else {
        phase = 'trailing'
        trailing.push(line)
      }
    }
    if (steps.length >= 1) {
      let out = numberLines(steps)
      const introText = intro.join('\n').trim()
      const trailText = trailing.join('\n').trim()
      if (introText) out = `${introText}\n\n${out}`
      if (trailText) out = `${out}\n\n${trailText}`
      return out.trim()
    }
  }

  // Step 1 - ... blocks
  if (/Step\s+\d+\s*[-–—:]/i.test(text)) {
    const converted = convertStepDashBlocks(text)
    if (converted) return converted
  }

  // Plain prose / paragraphs
  return convertPlainProse(text)
}

async function patchTranslationFile(path: string, updates: Map<string, string>): Promise<number> {
  let src = readFileSync(path, 'utf8')
  let n = 0
  for (const [id, newText] of updates) {
    for (const keyPat of [`'${id}'`, `"${id}"`]) {
      const keyIdx = src.indexOf(`${keyPat}:`)
      if (keyIdx < 0) continue
      const nextKey = src.slice(keyIdx + keyPat.length).search(/\n\s+['"]\d+['"]:\s*\{/)
      const blockEnd = nextKey >= 0 ? keyIdx + keyPat.length + nextKey : src.length
      const block = src.slice(keyIdx, blockEnd)
      const ingRe = /(howToUse:\s*)(`(?:\\`|[^`])*`|'(?:\\'|[^'])*'|"(?:\\"|[^"])*")/
      const m = block.match(ingRe)
      if (!m) continue
      const quote = m[2][0]
      let newLiteral: string
      if (quote === '`') {
        const escaped = newText.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${')
        newLiteral = `\`${escaped}\``
      } else if (quote === "'") {
        newLiteral = `'${newText.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`
      } else {
        newLiteral = JSON.stringify(newText)
      }
      const newBlock = block.replace(ingRe, `$1${newLiteral}`)
      if (newBlock === block) continue
      src = src.slice(0, keyIdx) + newBlock + src.slice(blockEnd)
      n++
      break
    }
  }
  writeFileSync(path, src, 'utf8')
  return n
}

async function main() {
  const apply = process.argv.includes('--apply')
  const products = await prisma.product.findMany({
    select: { id: true, productNumber: true, name: true, howToUse: true },
    orderBy: { id: 'asc' },
  })

  const localeUpdatesAr = new Map<string, string>()
  const localeUpdatesRu = new Map<string, string>()
  let changed = 0
  let skipped = 0

  for (const p of products) {
    const key = p.productNumber || p.id
    const next = normalizeHowToUse(p.howToUse)
    if (next == null) {
      skipped++
      continue
    }
    const prev = (p.howToUse || '').trim()
    if (next === prev) {
      console.log('OK', key, p.name?.slice(0, 40))
      continue
    }
    changed++
    console.log('\n---', key, p.name)
    console.log('BEFORE:', prev.slice(0, 160).replace(/\n/g, '⏎'))
    console.log('AFTER:', next.slice(0, 220).replace(/\n/g, '⏎'))

    if (apply) {
      await prisma.product.update({
        where: { id: p.id },
        data: { howToUse: next },
      })
    }
    localeUpdatesAr.set(key, next)
    localeUpdatesRu.set(key, next)
  }

  console.log(`\nProducts to update: ${changed}, empty skipped: ${skipped}`)

  if (apply) {
    // Locale files: re-normalize from their own howToUse text (translated), not EN overwrite
    for (const [label, file, map] of [
      ['AR', join(process.cwd(), 'data/productTranslations.ts'), localeUpdatesAr],
      ['RU', join(process.cwd(), 'data/productTranslationsRu.ts'), localeUpdatesRu],
    ] as const) {
      const src = readFileSync(file, 'utf8')
      const updates = new Map<string, string>()
      for (const id of map.keys()) {
        for (const keyPat of [`'${id}'`, `"${id}"`]) {
          const keyIdx = src.indexOf(`${keyPat}:`)
          if (keyIdx < 0) continue
          const nextKey = src.slice(keyIdx + keyPat.length).search(/\n\s+['"]\d+['"]:\s*\{/)
          const blockEnd = nextKey >= 0 ? keyIdx + keyPat.length + nextKey : src.length
          const block = src.slice(keyIdx, blockEnd)
          const m = block.match(/howToUse:\s*(`(?:\\`|[^`])*`|'(?:\\'|[^'])*'|"(?:\\"|[^"])*")/)
          if (!m) break
          const lit = m[1]
          let existing: string
          if (lit.startsWith('`')) {
            existing = lit.slice(1, -1).replace(/\\`/g, '`').replace(/\\\$\{/g, '${').replace(/\\\\/g, '\\')
          } else if (lit.startsWith("'")) {
            existing = lit.slice(1, -1).replace(/\\'/g, "'").replace(/\\\\/g, '\\')
          } else {
            existing = JSON.parse(lit)
          }
          const normalized = normalizeHowToUse(existing)
          if (normalized && normalized !== existing) updates.set(id, normalized)
          break
        }
      }
      const n = await patchTranslationFile(file, updates)
      console.log(`${label}: patched ${n} howToUse fields`)
    }
    console.log('Applied DB + locale updates')
  } else {
    console.log('DRY RUN — pass --apply to write')
  }
}

const isDirectRun =
  process.argv[1]?.includes('normalize-how-to-use-numbered') ||
  process.argv.some((a) => a.includes('normalize-how-to-use-numbered'))

if (isDirectRun) {
  main()
    .catch((e) => {
      console.error(e)
      process.exitCode = 1
    })
    .finally(async () => {
      await prisma.$disconnect()
    })
}
