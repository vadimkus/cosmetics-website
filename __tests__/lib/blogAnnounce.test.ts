import { postCopy, buildAnnouncementHtml, trimForPush, type Locale } from '@/lib/blogAnnounceCopy'

const post = {
  id: 'p1',
  slug: 'my-post',
  title: 'English title',
  titleRu: 'Русский заголовок',
  titleAr: 'العنوان العربي',
  excerpt: 'English excerpt',
  excerptRu: 'Русское описание',
  excerptAr: 'الملخص العربي',
  featuredImage: '/images/hero.jpg',
}

describe('postCopy', () => {
  it('picks the translation for each locale', () => {
    expect(postCopy(post, 'en').title).toBe('English title')
    expect(postCopy(post, 'ru').title).toBe('Русский заголовок')
    expect(postCopy(post, 'ar').excerpt).toBe('الملخص العربي')
  })

  it('prefixes the URL for non-English locales only', () => {
    expect(postCopy(post, 'en').url).toBe('/blog/my-post')
    expect(postCopy(post, 'ru').url).toBe('/ru/blog/my-post')
    expect(postCopy(post, 'ar').url).toBe('/ar/blog/my-post')
  })

  it('falls back to English rather than sending an empty notification', () => {
    const untranslated = { ...post, titleRu: null, excerptRu: null, titleAr: null, excerptAr: null }
    expect(postCopy(untranslated, 'ru').title).toBe('English title')
    expect(postCopy(untranslated, 'ar').excerpt).toBe('English excerpt')
  })

  it('tolerates a post with no excerpt at all', () => {
    const bare = { ...post, excerpt: null, excerptRu: null, excerptAr: null }
    expect(postCopy(bare, 'en').excerpt).toBe('')
  })
})

describe('trimForPush', () => {
  it('leaves a short line alone', () => {
    expect(trimForPush('Short enough')).toBe('Short enough')
  })

  it('collapses whitespace so a lock screen gets one clean line', () => {
    expect(trimForPush('two   words\nwrapped')).toBe('two words wrapped')
  })

  it('cuts on a word boundary and marks the truncation', () => {
    const out = trimForPush('word '.repeat(60), 40)
    expect(out.length).toBeLessThanOrEqual(41)
    expect(out.endsWith('…')).toBe(true)
    expect(out).not.toContain('wor…')
  })
})

describe('buildAnnouncementHtml', () => {
  it('links the title and the button to the localized URL', () => {
    const html = buildAnnouncementHtml(postCopy(post, 'ru'), post.featuredImage, 'ru')
    expect(html).toContain('/ru/blog/my-post')
    expect(html).toContain('Читать статью')
  })

  it('sets RTL for Arabic and LTR otherwise', () => {
    expect(buildAnnouncementHtml(postCopy(post, 'ar'), null, 'ar')).toContain('dir="rtl"')
    expect(buildAnnouncementHtml(postCopy(post, 'en'), null, 'en')).toContain('dir="ltr"')
  })

  it('absolutizes the featured image and omits the block when there is none', () => {
    expect(buildAnnouncementHtml(postCopy(post, 'en'), '/images/hero.jpg', 'en')).toContain('https://genosys.ae/images/hero.jpg')
    expect(buildAnnouncementHtml(postCopy(post, 'en'), null, 'en')).not.toContain('<img')
  })

  it('escapes markup in the title so a post cannot inject HTML into an email', () => {
    const evil = { ...post, title: '<script>alert(1)</script>', titleRu: null, titleAr: null }
    const html = buildAnnouncementHtml(postCopy(evil, 'en'), null, 'en')
    expect(html).not.toContain('<script>')
    expect(html).toContain('&lt;script&gt;')
  })

  it('produces a body for every supported locale', () => {
    const locales: Locale[] = ['en', 'ru', 'ar']
    for (const locale of locales) {
      expect(buildAnnouncementHtml(postCopy(post, locale), post.featuredImage, locale).length).toBeGreaterThan(100)
    }
  })
})
