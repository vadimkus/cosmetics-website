import { NextResponse } from 'next/server'
import { getAllProducts } from '@/lib/productsDb'
import { SITE_URL } from '@/lib/siteConfig'
import { getCanonicalProductSlug } from '@/lib/seo'
import { errorLog } from '@/lib/logger'

/**
 * Google Merchant Center Product Feed (RSS 2.0)
 *
 * Generates an XML product data source compliant with Google's RSS 2.0 spec:
 * https://support.google.com/merchants/answer/14987622
 *
 * Required fields per item:
 *   g:id, g:title, g:description, g:link, g:image_link,
 *   g:price, g:availability, g:condition, g:brand
 *
 * Optional but recommended:
 *   g:product_type, g:shipping, g:mpn, g:gtin (placeholder)
 *
 * Feed URL: https://genosys.ae/feed/products.xml
 * Add this URL in Merchant Center > Products > Feeds > Add feed > Scheduled fetch
 */

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength - 3) + '...'
}

export async function GET() {
  try {
    const products = await getAllProducts()
    const baseUrl = SITE_URL

    const items = products
      .filter(p => !p.isPriceOnRequest && p.price > 0)
      .map(p => {
        // Google requires title ≤ 150 chars, description ≤ 5000 chars
        const title = escapeXml(truncate(p.name, 150))
        const description = escapeXml(truncate(p.description || p.name, 5000))
        const link = `${baseUrl}/products/${getCanonicalProductSlug(p)}`
        const imageLink = p.image.startsWith('http') ? p.image : `${baseUrl}${p.image}`
        const availability = p.inStock ? 'in stock' : 'out of stock'
        const price = `${p.price.toFixed(2)} AED`
        const mpn = p.productNumber || p.id

        // Category mapping for Google product taxonomy
        // https://support.google.com/merchants/answer/6324436
        const productType = escapeXml(`Health & Beauty > Skin Care > ${p.category || 'General'}`)

        let itemXml = `    <item>
      <g:id>${escapeXml(p.id)}</g:id>
      <g:title>${title}</g:title>
      <g:description>${description}</g:description>
      <g:link>${escapeXml(link)}</g:link>
      <g:image_link>${escapeXml(imageLink)}</g:image_link>
      <g:availability>${availability}</g:availability>
      <g:price>${price}</g:price>
      <g:condition>new</g:condition>
      <g:brand>GENOSYS</g:brand>
      <g:mpn>${escapeXml(mpn)}</g:mpn>
      <g:product_type>${productType}</g:product_type>
      <g:google_product_category>Health &amp; Beauty &gt; Skin Care</g:google_product_category>
      <g:shipping>
        <g:country>AE</g:country>
        <g:service>Standard</g:service>
        <g:price>0.00 AED</g:price>
      </g:shipping>`

        // Additional images (up to 10 per Google spec)
        if (p.images) {
          try {
            const additionalImages: string[] = JSON.parse(p.images)
            additionalImages.slice(0, 10).forEach((img: string) => {
              const imgUrl = img.startsWith('http') ? img : `${baseUrl}${img}`
              itemXml += `\n      <g:additional_image_link>${escapeXml(imgUrl)}</g:additional_image_link>`
            })
          } catch {
            // Silent fallback - no additional images
          }
        }

        // Size if available
        if (p.size) {
          itemXml += `\n      <g:size>${escapeXml(p.size)}</g:size>`
        }

        // Multilingual titles (for international feeds)
        if (p.nameAr) {
          itemXml += `\n      <g:title xml:lang="ar">${escapeXml(truncate(p.nameAr, 150))}</g:title>`
        }
        if (p.nameRu) {
          itemXml += `\n      <g:title xml:lang="ru">${escapeXml(truncate(p.nameRu, 150))}</g:title>`
        }

        itemXml += '\n    </item>'
        return itemXml
      })

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>GENOSYS Middle East - Professional Korean Dermacosmetics</title>
    <link>${baseUrl}</link>
    <description>Official distributor of GENOSYS professional Korean dermacosmetics in UAE. Microneedling devices, skincare products, and professional beauty treatments.</description>
${items.join('\n')}
  </channel>
</rss>`

    return new NextResponse(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    })
  } catch (error) {
    errorLog('Error generating product feed:', error)
    return new NextResponse(
      '<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Error</title></channel></rss>',
      {
        status: 500,
        headers: { 'Content-Type': 'application/xml; charset=utf-8' },
      }
    )
  }
}
