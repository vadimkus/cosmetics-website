/**
 * Two faces, one rule each: Inter for interface, Cormorant for display.
 *
 * September 2026 found the site rendering four families, Inter never drawn on
 * Apple devices because "SF Pro" sat ahead of it in the stack, the serif used
 * down to 13px where it stops being legible, the serif defined inside one
 * product page's CSS so it silently fell back elsewhere, and about a thousand
 * text nodes at half-pixel sizes. These keep each of those from coming back.
 */
import { readFileSync } from 'fs'
import { execSync } from 'child_process'
import path from 'path'

const ROOT = path.join(__dirname, '../..')
const read = (p: string) => readFileSync(path.join(ROOT, p), 'utf8')
const SIZE_PX: Record<string, number> = { xs: 12, sm: 14, base: 16, lg: 18, xl: 20, '2xl': 24, '3xl': 30, '4xl': 36, '5xl': 48, '6xl': 60 }

function tsxFiles(): string[] {
  return execSync(`rg -l --glob '!node_modules' --glob '!__tests__' 'className' app components -g '*.tsx'`, {
    cwd: ROOT,
    encoding: 'utf8',
  })
    .split('\n')
    .filter(Boolean)
}

describe('interface font', () => {
  const css = read('app/globals.css')

  it('puts Inter first in the body stack, with no Apple system face ahead of it', () => {
    const body = css.match(/--font-body:\s*([^;]+);/)?.[1] ?? ''
    expect(body.trim().startsWith('var(--font-inter')).toBe(true)
    expect(body).not.toMatch(/SF Pro/)
  })

  it('has no second sans: display is the body face', () => {
    expect(css).toMatch(/--font-display:\s*var\(--font-body\);/)
    expect(css).not.toMatch(/SF Pro Display/)
  })
})

describe('display serif', () => {
  it('is defined once, in globals.css, and its variable is mounted once, on <body>', () => {
    const defs = execSync(`rg -l --glob '!node_modules' '^\\.cera-serif \\{' app components -g '*.css' || true`, {
      cwd: ROOT,
      encoding: 'utf8',
    })
      .split('\n')
      .filter(Boolean)
    expect(defs).toEqual(['app/globals.css'])
    const mounts = execSync(`rg -l --glob '!node_modules' 'ceraSerif\\.variable' app components || true`, {
      cwd: ROOT,
      encoding: 'utf8',
    })
      .split('\n')
      .filter(Boolean)
    expect(mounts).toEqual(['app/layout.tsx'])
  })

  it('is never used below 18px', () => {
    const attr = /className=(?:"([^"]*)"|\{`([^`]*)`\}|\{'([^']*)'\})/g
    const sizeTok = /(?:[a-z]+:)*text-(?:\[(\d+)px\]|(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl))(?![a-z0-9-])/g
    const offenders: string[] = []
    for (const file of tsxFiles()) {
      const src = read(file)
      for (const m of src.matchAll(attr)) {
        const cls = m[1] ?? m[2] ?? m[3] ?? ''
        if (!cls.includes('cera-serif')) continue
        const sizes = [...cls.matchAll(sizeTok)].map((s) => (s[1] ? Number(s[1]) : SIZE_PX[s[2]!]!))
        if (sizes.length && Math.max(...sizes) < 18) offenders.push(`${file}: ${cls.slice(0, 80)}`)
      }
    }
    expect(offenders).toEqual([])
  })
})

describe('type scale', () => {
  it('has no half-pixel sizes', () => {
    const out = execSync(`rg -n --glob '!node_modules' --glob '!__tests__' 'text-\\[\\d+\\.\\d+px\\]' app components -g '*.tsx' || true`, {
      cwd: ROOT,
      encoding: 'utf8',
    }).trim()
    expect(out).toBe('')
  })
})
