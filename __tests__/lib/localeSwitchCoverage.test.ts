import { readFileSync } from 'fs'
import { join } from 'path'
import { isSimpleHeaderPage } from '@/lib/simpleHeaderPages'
import { getLocalizedPath } from '@/lib/i18n'

const root = join(__dirname, '..', '..')
const read = (p: string) => readFileSync(join(root, p), 'utf8')

/**
 * Product and blog routes hide all three site headers, which is how the
 * language switcher went missing on mobile for every product page and every
 * article. These tests pin the two halves of the fix: that those routes really
 * are header-less, and that each one now carries its own control.
 */
describe('language control on header-less routes', () => {
  it('product detail and blog routes hide the site headers', () => {
    expect(isSimpleHeaderPage('/products/8')).toBe(true)
    expect(isSimpleHeaderPage('/ru/products/8')).toBe(true)
    expect(isSimpleHeaderPage('/ar/products/8')).toBe(true)
    expect(isSimpleHeaderPage('/blog/some-article')).toBe(true)
    expect(isSimpleHeaderPage('/ru/blog/some-article')).toBe(true)
    // Listing pages keep the site header, so they need no bar of their own.
    expect(isSimpleHeaderPage('/products')).toBe(false)
  })

  it.each([
    ['app/products/[id]/page.tsx', 'PdpLocaleBar'],
    ['app/ru/products/[id]/page.tsx', 'PdpLocaleBar'],
    ['app/ar/products/[id]/page.tsx', 'PdpLocaleBar'],
    ['app/products/[id]/ProductPageClientRefactored.tsx', 'LocaleSwitchInline'],
    ['app/blog/BlogPageClient.tsx', 'LocaleSwitchInline'],
    ['components/blog/BlogArticleBar.tsx', 'LocaleSwitchInline'],
  ])('%s renders %s', (file, control) => {
    const src = read(file)
    expect(src).toContain(`<${control}`)
  })

  /**
   * All three article routes have their own client, and the other two used to reach for
   * the product locale bar, so the same page had one bar in English and a different one
   * in Arabic and Russian — the latter with no account control. They share one bar now.
   */
  it.each([
    'app/blog/[slug]/BlogPostClient.tsx',
    'app/ar/blog/[slug]/ArabicBlogPostClient.tsx',
    'app/ru/blog/[slug]/RussianBlogPostClient.tsx',
  ])('%s renders the shared article bar', file => {
    const src = read(file)
    expect(src).toContain('<BlogArticleBar')
    expect(src).not.toContain('<PdpLocaleBar')
  })

  it('the PWA header keeps the reader on the current page', () => {
    const src = read('components/pwa/PWAHeader.tsx')
    // It used to pass a literal '/', dropping readers on the homepage whenever
    // they changed language from a product or an article.
    expect(src).not.toMatch(/switchLocaleHardNav\(\s*l\s*,\s*['"]\/['"]\s*\)/)
    expect(src).toContain('switchLocaleHardNav(l, pathname')
  })

  it('switching locale preserves product and article paths', () => {
    expect(getLocalizedPath('/products/8', 'ru')).toBe('/ru/products/8')
    expect(getLocalizedPath('/ru/products/8', 'ar')).toBe('/ar/products/8')
    expect(getLocalizedPath('/ar/products/8', 'en')).toBe('/products/8')
    expect(getLocalizedPath('/blog/a-post', 'ru')).toBe('/ru/blog/a-post')
    expect(getLocalizedPath('/ru/blog/a-post', 'en')).toBe('/blog/a-post')
  })
})
