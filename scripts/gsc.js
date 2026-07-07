#!/usr/bin/env node
/**
 * Google Search Console API helper (no dependencies).
 *
 * Authenticates with a service account key (JWT -> access token) and runs
 * common queries against the Search Console API for the genosys.ae property.
 *
 * Key file: pass via GSC_KEY_FILE env var. The key lives OUTSIDE the repo —
 * never commit it.
 *
 * Usage:
 *   GSC_KEY_FILE=~/path/to/key.json node scripts/gsc.js sites
 *   GSC_KEY_FILE=... node scripts/gsc.js query '{"startDate":"2026-06-01","endDate":"2026-07-04","dimensions":["page"],"rowLimit":20}'
 */

const fs = require('fs')
const crypto = require('crypto')
const os = require('os')

const SITE_URL = 'https://genosys.ae/'
// Full (non-readonly) scope so sitemap resubmission works; queries work with it too.
const SCOPE = 'https://www.googleapis.com/auth/webmasters'

function loadKey() {
  const keyPath = (process.env.GSC_KEY_FILE || '').replace(/^~/, os.homedir())
  if (!keyPath) {
    console.error('Set GSC_KEY_FILE to the service account JSON key path.')
    process.exit(1)
  }
  return JSON.parse(fs.readFileSync(keyPath, 'utf8'))
}

function base64url(input) {
  return Buffer.from(input).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

async function getAccessToken(key) {
  const now = Math.floor(Date.now() / 1000)
  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))
  const claims = base64url(JSON.stringify({
    iss: key.client_email,
    scope: SCOPE,
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
  const data = await res.json()
  if (!data.access_token) {
    console.error('Token exchange failed:', JSON.stringify(data, null, 2))
    process.exit(1)
  }
  return data.access_token
}

async function api(token, path, body) {
  const res = await fetch(`https://www.googleapis.com/webmasters/v3${path}`, {
    method: body ? 'POST' : 'GET',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await res.json()
  if (!res.ok) {
    console.error(`API error ${res.status}:`, JSON.stringify(data, null, 2))
    process.exit(1)
  }
  return data
}

async function main() {
  const [cmd, arg] = process.argv.slice(2)
  const key = loadKey()
  const token = await getAccessToken(key)
  const encodedSite = encodeURIComponent(SITE_URL)

  if (cmd === 'sites') {
    const data = await api(token, '/sites')
    console.log(JSON.stringify(data, null, 2))
  } else if (cmd === 'query') {
    const body = JSON.parse(arg)
    const data = await api(token, `/sites/${encodedSite}/searchAnalytics/query`, body)
    console.log(JSON.stringify(data, null, 2))
  } else if (cmd === 'sitemaps') {
    const data = await api(token, `/sites/${encodedSite}/sitemaps`)
    console.log(JSON.stringify(data, null, 2))
  } else if (cmd === 'resubmit-sitemap') {
    const feed = encodeURIComponent(`${SITE_URL}sitemap.xml`)
    const res = await fetch(`https://www.googleapis.com/webmasters/v3/sites/${encodedSite}/sitemaps/${feed}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
    })
    console.log(res.ok ? 'Sitemap resubmitted.' : `Failed: ${res.status} ${await res.text()}`)
  } else if (cmd === 'inspect') {
    // URL Inspection API lives on a different host than the webmasters v3 API.
    const res = await fetch('https://searchconsole.googleapis.com/v1/urlInspection/index:inspect', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ inspectionUrl: arg, siteUrl: SITE_URL }),
    })
    const data = await res.json()
    if (!res.ok) {
      console.error(`Inspect error ${res.status}:`, JSON.stringify(data, null, 2))
      process.exit(1)
    }
    const r = data.inspectionResult?.indexStatusResult || {}
    console.log(JSON.stringify({
      url: arg,
      verdict: r.verdict,
      coverageState: r.coverageState,
      lastCrawlTime: r.lastCrawlTime,
      googleCanonical: r.googleCanonical,
      userCanonical: r.userCanonical,
      robotsTxtState: r.robotsTxtState,
      indexingState: r.indexingState,
    }))
  } else {
    console.error('Commands: sites | query <jsonBody> | sitemaps | resubmit-sitemap | inspect <url>')
    process.exit(1)
  }
}

main().catch(err => { console.error(err); process.exit(1) })
