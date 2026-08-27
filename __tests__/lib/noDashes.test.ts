import { readdirSync, readFileSync, statSync } from 'fs'
import { join } from 'path'

/**
 * No em dashes, no en dashes, anywhere a customer might read one.
 *
 * The house rule is absolute, and it had been broken quietly for a long time: 548 files
 * across the site and the app carried one, from the Black Friday banner to the delivery
 * window on the Lock Screen order card.
 *
 * A dash is easy to reintroduce, because it arrives by copy and paste from a document, a
 * translation or a model, and nothing about it looks wrong. This fails instead.
 *
 * Escape sequences are fine: `\u2014` inside a regex is not a dash in the output. Only the
 * literal characters are rejected.
 */
const ROOT = join(__dirname, '..', '..')
const DIRS = ['messages', 'lib', 'components', 'data', 'app']
const EXTS = ['.ts', '.tsx', '.js', '.jsx', '.json']
const DASH = /[\u2014\u2013]/

function walk(dir: string, out: string[] = []): string[] {
  let entries: string[]
  try {
    entries = readdirSync(dir)
  } catch {
    return out
  }
  for (const name of entries) {
    if (name === 'node_modules' || name.startsWith('.')) continue
    const full = join(dir, name)
    if (statSync(full).isDirectory()) walk(full, out)
    else if (EXTS.some(e => name.endsWith(e))) out.push(full)
  }
  return out
}

describe('house style', () => {
  it('uses a plain hyphen, never an em or en dash', () => {
    const offenders: string[] = []

    for (const dir of DIRS) {
      for (const file of walk(join(ROOT, dir))) {
        const lines = readFileSync(file, 'utf8').split('\n')
        lines.forEach((line, i) => {
          if (DASH.test(line)) {
            offenders.push(`${file.replace(ROOT + '/', '')}:${i + 1}  ${line.trim().slice(0, 100)}`)
          }
        })
      }
    }

    expect(offenders).toEqual([])
  })
})
