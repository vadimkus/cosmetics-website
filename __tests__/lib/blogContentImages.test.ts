import { stripOpeningFeaturedImage } from '@/lib/blogContentImages'

describe('stripOpeningFeaturedImage', () => {
  const featured = '/blog/featured.jpg'

  it('removes a leading duplicate even when wrappers exceed an arbitrary byte limit', () => {
    const wrapper = `<div class="${'x'.repeat(900)}">`
    const html = `${wrapper}<img src="${featured}" alt="Hero"></div><p>Article</p>`

    expect(stripOpeningFeaturedImage(html, featured)).toBe('<p>Article</p>')
  })

  it('preserves later intentional uses of the featured image', () => {
    const html = `<p>Introduction</p><img src="${featured}" alt="Comparison">`

    expect(stripOpeningFeaturedImage(html, featured)).toBe(html)
  })
})
