#!/usr/bin/env node
/**
 * One-shot alignment report: live product catalog vs Google index.
 *
 * For every product on genosys.ae, inspects the canonical EN URL via the
 * GSC URL Inspection API and cross-references 90-day impressions.
 *
 * Usage: GSC_KEY_FILE=<key.json> node scripts/gsc-product-alignment.js
 */

const fs = require('fs')
const crypto = require('crypto')
const os = require('os')

const SITE_URL = 'https://genosys.ae/'

function base64url(input) {
  return Buffer.from(input).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

async function getAccessToken() {
  const keyPath = (process.env.GSC_KEY_FILE || '').replace(/^~/, os.homedir())
  const key = JSON.parse(fs.readFileSync(keyPath, 'utf8'))
  const now = Math.floor(Date.now() / 1000)
  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))
  const claims = base64url(JSON.stringify({
    iss: key.client_email,
    scope: 'https://www.googleapis.com/auth/webmasters.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  }))
  const signature = crypto.createSign('RSA-SHA256').update(`${header}.${claims}`).sign(key.private_key)
  const jwt = `${header}.${claims}.${base64url(signature)}`
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=${encodeURIComponent('urn:ietf:params:oauth:grant-type:jwt-bearer')}&assertion=${jwt}`,
  })
  return (await res.json()).access_token
}

async function inspect(token, url) {
  const res = await fetch('https://searchconsole.googleapis.com/v1/urlInspection/index:inspect', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ inspectionUrl: url, siteUrl: SITE_URL }),
  })
  const data = await res.json()
  if (!res.ok) return { error: `${res.status} ${data.error?.message || ''}` }
  return data.inspectionResult?.indexStatusResult || {}
}

async function main() {
  const token = await getAccessToken()

  const catalogRes = await fetch('https://genosys.ae/api/products')
  const catalogData = await catalogRes.json()
  const products = catalogData.products || catalogData

  // 90-day impressions per page
  const impRes = await fetch(`https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE_URL)}/searchAnalytics/query`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      startDate: '2026-04-07', endDate: '2026-07-05',
      dimensions: ['page'],
      dimensionFilterGroups: [{ filters: [{ dimension: 'page', operator: 'contains', expression: '/products/' }] }],
      rowLimit: 500,
    }),
  })
  const impRows = (await impRes.json()).rows || []
  const impByPage = Object.fromEntries(impRows.map(r => [r.keys[0], r.impressions]))

  const results = []
  for (const p of products) {
    const slug = p.productNumber || p.id
    const url = `https://genosys.ae/products/${slug}`
    const r = await inspect(token, url)
    results.push({
      slug,
      name: p.name,
      inStock: p.inStock,
      url,
      verdict: r.verdict || r.error,
      coverageState: r.coverageState,
      lastCrawl: r.lastCrawlTime ? r.lastCrawlTime.slice(0, 10) : null,
      googleCanonical: r.googleCanonical,
      impressions90d: impByPage[url] || 0,
    })
    process.stderr.write(`${results.length}/${products.length} ${slug} ${r.verdict || r.error}\n`)
    await new Promise(res => setTimeout(res, 150))
  }

  fs.writeFileSync('/tmp/gsc_product_alignment.json', JSON.stringify(results, null, 2))

  const notIndexed = results.filter(r => r.verdict !== 'PASS')
  console.log(`\n=== ${results.length} products checked, ${results.length - notIndexed.length} indexed, ${notIndexed.length} NOT indexed ===\n`)
  for (const r of notIndexed) {
    console.log(`NOT INDEXED  ${r.url}\n  ${r.name}\n  state: ${r.coverageState} | lastCrawl: ${r.lastCrawl} | imp90d: ${r.impressions90d}\n`)
  }
  const canonicalMismatch = results.filter(r => r.verdict === 'PASS' && r.googleCanonical && r.googleCanonical !== r.url)
  if (canonicalMismatch.length) {
    console.log('=== Canonical mismatches (Google chose a different URL) ===')
    for (const r of canonicalMismatch) console.log(`${r.url} -> ${r.googleCanonical}`)
  }
}

main().catch(err => { console.error(err); process.exit(1) })
