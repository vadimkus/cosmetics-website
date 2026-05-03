import { NextResponse } from 'next/server'
import { getAllProducts } from '@/lib/productsDb'
import { errorLog } from '@/lib/logger'
import { buildUrl } from '@/lib/siteConfig'
import {
  getLocalizedProductDescription,
  getLocalizedProductName,
  getProductImageUrls,
  parseStringArray,
  truncateText,
} from '@/lib/seo'

export const revalidate = 3600

export async function GET() {
  try {
    const products = await getAllProducts()
    const visibleProducts = products.filter(product => !product.isHidden)

    const lines = visibleProducts.map(product => {
      const concerns = parseStringArray(product.targetConcerns)
      const images = getProductImageUrls(product)
      const price = product.isPriceOnRequest || !product.price
        ? 'Price on request'
        : `${product.price} AED`

      return [
        `## ${getLocalizedProductName(product, 'en')}`,
        `- URL: ${buildUrl(`/products/${product.id}`)}`,
        `- Product ID: ${product.id}`,
        product.productNumber ? `- Product number: ${product.productNumber}` : null,
        `- Category: ${product.category}`,
        product.size ? `- Size: ${product.size}` : null,
        `- Price: ${price}`,
        `- Availability: ${product.inStock ? 'In stock' : 'Out of stock'}`,
        `- Arabic name: ${getLocalizedProductName(product, 'ar')}`,
        `- Russian name: ${getLocalizedProductName(product, 'ru')}`,
        `- Description: ${truncateText(getLocalizedProductDescription(product, 'en'), 700)}`,
        product.descriptionAr ? `- Arabic description: ${truncateText(getLocalizedProductDescription(product, 'ar'), 500)}` : null,
        product.descriptionRu ? `- Russian description: ${truncateText(getLocalizedProductDescription(product, 'ru'), 500)}` : null,
        product.skinType ? `- Suitable skin type: ${product.skinType}` : null,
        concerns.length > 0 ? `- Target concerns: ${concerns.join(', ')}` : null,
        product.usage ? `- Usage timing: ${product.usage}` : null,
        product.howToUse ? `- How to use: ${truncateText(product.howToUse, 400)}` : null,
        images[0] ? `- Primary image: ${images[0]}` : null,
      ].filter(Boolean).join('\n')
    })

    const body = `# GENOSYS AI Product Index

Generated for AI search, answer engines, and product discovery crawlers.

- Website: ${buildUrl('/')}
- Product feed: ${buildUrl('/feed/products.xml')}
- Full LLM index: ${buildUrl('/llms-full.txt')}
- Currency: AED
- Market: United Arab Emirates
- Languages: English, Arabic, Russian
- Official distributor: Genosys Middle East FZ-LLC
- Brand origin: South Korea

${lines.join('\n\n')}
`

    return new NextResponse(body, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    })
  } catch (error) {
    errorLog('Error generating AI product index:', error)
    return new NextResponse('Error generating AI product index', { status: 500 })
  }
}
