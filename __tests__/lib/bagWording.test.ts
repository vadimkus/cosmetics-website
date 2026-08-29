/**
 * The site shipped two vocabularies for one thing.
 *
 * A viewport flag (`useBagText = isPWA || isMobile`) rendered "Add to Cart" on
 * desktop and "Add to Bag" on mobile, so the same product changed its button
 * text when the window was resized - and the options dialog ignored the flag,
 * which put both words on one screen at once.
 *
 * Separately, the Arabic copy called the shopping container الحقيبة, a handbag,
 * across ~250 buttons. The correct term is السلة.
 *
 * These tests hold both fixes in place. They assert on rendered strings, not on
 * key names: `product.addToCart` may keep existing as an alias, it just has to
 * say "Bag".
 */

import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()

const read = (p: string) => fs.readFileSync(path.join(ROOT, p), 'utf8')
const messages = (locale: string) =>
  JSON.parse(read(`messages/${locale}.json`)) as Record<string, unknown>

function flatten(node: unknown, prefix = ''): Array<[string, string]> {
  if (typeof node === 'string') return [[prefix, node]]
  if (!node || typeof node !== 'object') return []
  return Object.entries(node as Record<string, unknown>).flatMap(([k, v]) =>
    flatten(v, prefix ? `${prefix}.${k}` : k)
  )
}

describe('shopping container is called a bag, in one voice', () => {
  describe('English message catalogue', () => {
    // "cart" as a standalone word. Key names are not checked - only what a
    // customer reads.
    const CART_WORD = /\bcarts?\b/i

    it('never says cart', () => {
      const offenders = flatten(messages('en')).filter(([, value]) =>
        CART_WORD.test(value)
      )
      expect(offenders).toEqual([])
    })

    it('says bag on the controls a customer actually presses', () => {
      const en = messages('en')
      const get = (key: string) =>
        key.split('.').reduce<unknown>((acc, k) => (acc as Record<string, unknown>)?.[k], en)

      expect(get('product.addToBag')).toBe('Add to Bag')
      expect(get('product.addToCart')).toBe('Add to Bag')
      expect(get('product.inBag')).toBe('In Bag')
      expect(get('product.inCart')).toBe('In Bag')
    })
  })

  describe('Arabic', () => {
    // حقيبة is a handbag. The shopping container is سلة.
    const HANDBAG = /حقيب/

    it('never calls the shopping container a handbag in the catalogue', () => {
      const offenders = flatten(messages('ar')).filter(([, value]) =>
        HANDBAG.test(value)
      )
      expect(offenders).toEqual([])
    })

    it('never calls it a handbag in the bespoke product copy', () => {
      // One line means an actual handbag - a list of places you keep the mist
      // bottle - and is allowed to keep the word.
      const GENUINE_HANDBAG = 'الرذاذ اليومي. المكتب والحقيبة وحوض المساء.'

      const offenders: string[] = []
      let sawGenuine = false

      const walk = (dir: string) => {
        for (const entry of fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true })) {
          const rel = `${dir}/${entry.name}`
          if (entry.isDirectory()) {
            walk(rel)
          } else if (/\.tsx?$/.test(entry.name)) {
            for (const line of read(rel).split('\n')) {
              if (!HANDBAG.test(line)) continue
              if (line.includes(GENUINE_HANDBAG)) {
                sawGenuine = true
                continue
              }
              offenders.push(`${rel}: ${line.trim()}`)
            }
          }
        }
      }
      walk('components/product')

      expect(offenders).toEqual([])
      // If the mist line is reworded, this exclusion is stale and should be
      // reviewed rather than left as dead permission.
      expect(sawGenuine).toBe(true)
    })
  })

  describe('the viewport switch is gone', () => {
    it('no component picks its wording from screen width', () => {
      const offenders: string[] = []
      const walk = (dir: string) => {
        for (const entry of fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true })) {
          const rel = `${dir}/${entry.name}`
          if (entry.isDirectory()) {
            if (entry.name === 'node_modules') continue
            walk(rel)
          } else if (/\.tsx?$/.test(entry.name) && read(rel).includes('useBagText')) {
            offenders.push(rel)
          }
        }
      }
      walk('components')
      walk('app')
      expect(offenders).toEqual([])
    })
  })
})
