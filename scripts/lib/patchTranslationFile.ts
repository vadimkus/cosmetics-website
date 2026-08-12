/**
 * Minimal-diff surgery on data/productTranslations*.ts.
 *
 * Both files are plain object literals keyed by product, one field per line.
 * Regenerating them from the parsed object would reformat thousands of lines and
 * make review impossible, so this locates a single product block and replaces
 * one field's value in place, leaving the rest of the file byte-identical.
 */
import { readFileSync, writeFileSync } from 'fs'

/** Serialises a value into the exact literal the two files use. */
export function tsLiteral(value: unknown, style: 'compact' | 'pretty'): string {
  if (value === null) return 'null'
  if (typeof value === 'string') return JSON.stringify(value)
  const json = style === 'pretty' ? JSON.stringify(value, null, 2) : JSON.stringify(value)
  return JSON.stringify(json)
}

interface Block {
  start: number
  end: number
}

function findBlock(lines: string[], key: string): Block {
  const open = new RegExp(`^\\s{2}['"]${key}['"]:\\s*\\{`)
  const start = lines.findIndex((l) => open.test(l))
  if (start === -1) throw new Error(`entry "${key}" not found`)
  const end = lines.findIndex((l, i) => i > start && /^\s{2}\},?\s*$/.test(l))
  if (end === -1) throw new Error(`entry "${key}" has no closing brace`)
  return { start, end }
}

/**
 * Replaces `field` inside the `key` entry with `literal`. The field must already
 * exist on a single line; throws otherwise so a silent no-op is impossible.
 */
export function replaceField(source: string, key: string, field: string, literal: string): string {
  const lines = source.split('\n')
  const { start, end } = findBlock(lines, key)
  const fieldRe = new RegExp(`^(\\s{4})['"]?${field}['"]?:\\s`)

  for (let i = start + 1; i < end; i++) {
    const m = lines[i].match(fieldRe)
    if (!m) continue
    const quoted = lines[i].trimStart().startsWith('"')
    const name = quoted ? `"${field}"` : field
    const trailingComma = /,\s*$/.test(lines[i])
    lines[i] = `${m[1]}${name}: ${literal}${trailingComma ? ',' : ''}`
    return lines.join('\n')
  }
  throw new Error(`field "${field}" not found in entry "${key}"`)
}

/** Reads the current literal for a field so callers can parse and mutate it. */
export function readField(source: string, key: string, field: string): string {
  const lines = source.split('\n')
  const { start, end } = findBlock(lines, key)
  const fieldRe = new RegExp(`^\\s{4}['"]?${field}['"]?:\\s(.*?),?\\s*$`)
  for (let i = start + 1; i < end; i++) {
    const m = lines[i].match(fieldRe)
    if (m) return m[1]
  }
  throw new Error(`field "${field}" not found in entry "${key}"`)
}

/** Parses a TS string literal (single- or double-quoted) into its value. */
export function parseLiteral(literal: string): unknown {
  const trimmed = literal.trim()
  if (trimmed === 'null') return null
  if (trimmed.startsWith('"')) return JSON.parse(trimmed)
  if (trimmed.startsWith("'")) {
    // Single-quoted literals in these files never contain escaped single quotes.
    return trimmed.slice(1, -1).replace(/\\'/g, "'")
  }
  throw new Error(`unsupported literal: ${literal.slice(0, 60)}`)
}

export function loadFile(path: string): string {
  return readFileSync(path, 'utf8')
}

export function saveFile(path: string, source: string): void {
  writeFileSync(path, source)
}
