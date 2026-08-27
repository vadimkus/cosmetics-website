/**
 * The floating buy bar is copied into every bespoke product page rather than
 * living in one component, so a change to it is 51 near-identical edits and it is
 * easy to miss one. These are structural checks over the source rather than
 * rendering tests: they catch the page that got skipped.
 *
 * The multiplication check is the important one. Before the stepper existed the
 * bar could only ever add one, so printing the unit price was correct. With a
 * stepper, a bar that still prints the unit price tells a shopper ordering six
 * that it costs 300 and then charges 1,800 - the same bug the mobile app hit and
 * fixed.
 */
import fs from 'fs'
import path from 'path'

const ROOT = path.join(__dirname, '..', '..', 'components', 'product')

function walk(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) return walk(full)
    return entry.name.endsWith('.tsx') ? [full] : []
  })
}

const bespokePages = walk(ROOT).filter(f =>
  fs.readFileSync(f, 'utf8').includes('Sticky add to bag')
)

const rel = (f: string) => path.relative(path.join(__dirname, '..', '..'), f)

describe('bespoke floating buy bar', () => {
  it('is present on the pages we expect', () => {
    expect(bespokePages.length).toBe(51)
  })

  describe.each(bespokePages.map(f => [rel(f), f] as const))('%s', (_name, file) => {
    const src = fs.readFileSync(file, 'utf8')
    const bar = src.slice(src.indexOf('Sticky add to bag'))

    it('offers a quantity stepper before the item is in the bag', () => {
      expect(src).toContain('CeraStickyQuantity')
      expect(bar).toContain('<CeraStickyQuantity')
      expect(bar).toContain('value={quantity}')
      expect(bar).toContain('onChange={setQuantity}')
    })

    it('imports the stepper rather than declaring its own', () => {
      expect(src).toMatch(/CeraStickyQuantity,\s*\n\s*useCeraStickyBar,/)
    })

    it('prices the whole tap, not one unit', () => {
      expect(bar).toContain(
        'pricing.displayPrice * Math.max(1, inCartQty || quantity)'
      )
    })

    it('shows the unit price alongside once more than one is selected', () => {
      expect(bar).toContain("t('product.pricePerUnit'")
      expect(bar).toContain('(inCartQty || quantity) > 1')
    })

    it('lets the row wrap so the button keeps its label on a phone', () => {
      expect(bar).toContain('flex-wrap')
      expect(bar).toContain('md:flex-nowrap')
    })
  })
})
