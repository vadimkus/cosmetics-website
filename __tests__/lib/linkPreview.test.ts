import { isLinkPreviewBot } from '@/lib/linkPreviewBot'
import { renderProductLinkPreview } from '@/lib/linkPreview'
import type { Product } from '@/types'

const product = {
  id: 'cuid34',
  productNumber: '34',
  name: 'SKIN RESCUE OVERNIGHT CREAM MASK',
  description: 'Leave-on overnight cream mask. "Quoted" & <tagged>.',
  descriptionRu: 'Ночная крем-маска.',
  category: 'Mask',
  price: 320,
  inStock: true,
} as unknown as Product

describe('isLinkPreviewBot', () => {
  it.each([
    'WhatsApp/2.23.20.0 A',
    'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
    'facebookexternalhit/1.1 Facebot Twitterbot/1.0',
    'TelegramBot (like TwitterBot)',
    'Slackbot-LinkExpanding 1.0',
  ])('matches %s', (ua) => expect(isLinkPreviewBot(ua)).toBe(true))

  it.each([
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Safari/604.1',
    'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
    'Mozilla/5.0 (compatible; bingbot/2.0)',
    null,
    '',
  ])('leaves %s on the real page', (ua) => expect(isLinkPreviewBot(ua)).toBe(false))
})

describe('renderProductLinkPreview', () => {
  it('emits the OG card, canonical URL and branded image for English', () => {
    const html = renderProductLinkPreview(product, 'en', 'https://genosys.ae')
    expect(html).toContain('<title>SKIN RESCUE OVERNIGHT CREAM MASK | GENOSYS UAE</title>')
    expect(html).toContain('<meta property="og:url" content="https://genosys.ae/products/34">')
    expect(html).toContain('<meta property="og:image" content="https://genosys.ae/products/34/opengraph-image">')
    expect(html).toContain('<meta name="twitter:card" content="summary_large_image">')
    expect(html).toContain('<meta property="product:price:amount" content="320">')
    expect(html).toContain('&quot;Quoted&quot; &amp; &lt;tagged&gt;')
    expect(html).not.toContain('<tagged>')
  })

  it('localizes the Russian card and points at the /ru OG image', () => {
    const html = renderProductLinkPreview(product, 'ru', 'https://genosys.ae')
    expect(html).toContain('| GENOSYS ОАЭ</title>')
    expect(html).toContain('Ночная крем-маска.')
    expect(html).toContain('content="https://genosys.ae/ru/products/34/opengraph-image"')
    expect(html).toContain('<html lang="ru" dir="ltr">')
  })

  it('renders Arabic right-to-left', () => {
    expect(renderProductLinkPreview(product, 'ar', 'https://genosys.ae')).toContain('<html lang="ar" dir="rtl">')
  })

  it('stays small enough for impatient crawlers', () => {
    expect(renderProductLinkPreview(product, 'en', 'https://genosys.ae').length).toBeLessThan(4000)
  })
})
