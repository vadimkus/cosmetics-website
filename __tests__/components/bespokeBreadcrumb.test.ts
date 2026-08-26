/**
 * The 51 bespoke product pages each hand-rolled the same breadcrumb trail, even
 * though PageBreadcrumb's own docstring calls it "the one breadcrumb on the
 * site". They now go through the component, and these keep them there — a page
 * that reintroduces its own `<nav aria-label="Breadcrumb">` puts the trail back
 * outside the one place that controls it.
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

describe('bespoke product breadcrumbs', () => {
  it('covers the pages we expect', () => {
    expect(bespokePages.length).toBe(51)
  })

  describe.each(bespokePages.map(f => [rel(f), f] as const))('%s', (_name, file) => {
    const src = fs.readFileSync(file, 'utf8')

    it('renders the trail through PageBreadcrumb', () => {
      expect(src).toContain("from '@/components/PageBreadcrumb'")
      expect(src).toContain('<PageBreadcrumb')
    })

    it('does not hand-roll its own trail', () => {
      expect(src).not.toContain('aria-label="Breadcrumb"')
    })

    it('drops the trail on a phone, where the floating back bar already covers it', () => {
      expect(src).toMatch(/<PageBreadcrumb\s*\n\s*bare\s*\n\s*hideOnMobile/)
    })
  })
})

describe('PageBreadcrumb', () => {
  const src = fs.readFileSync(
    path.join(__dirname, '..', '..', 'components', 'PageBreadcrumb.tsx'),
    'utf8'
  )

  it('hides the band as well as the nav, so no empty padding is left behind', () => {
    expect(src).toContain("hideOnMobile ? 'hidden md:flex' : 'flex'")
    expect(src).toContain("hideOnMobile ? 'hidden md:block' : ''")
  })

  it('keeps the trail on by default, because pages without a back bar still use it', () => {
    expect(src).toContain('hideOnMobile = false')
  })
})
