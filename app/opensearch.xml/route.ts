import { NextResponse } from 'next/server'
import { buildUrl } from '@/lib/siteConfig'
import { escapeXml } from '@/lib/seo'

export const revalidate = 86400

export async function GET() {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<OpenSearchDescription xmlns="http://a9.com/-/spec/opensearch/1.1/">
  <ShortName>GENOSYS</ShortName>
  <Description>Search GENOSYS UAE professional Korean dermacosmetics, skincare products, and clinic guides.</Description>
  <InputEncoding>UTF-8</InputEncoding>
  <Image height="32" width="32" type="image/x-icon">${escapeXml(buildUrl('/favicon.ico'))}</Image>
  <Url type="text/html" method="get" template="${escapeXml(buildUrl('/products?search={searchTerms}'))}" />
  <Url type="application/rss+xml" rel="results" template="${escapeXml(buildUrl('/feed/products.xml'))}" />
</OpenSearchDescription>`

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/opensearchdescription+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
    },
  })
}
