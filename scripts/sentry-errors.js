#!/usr/bin/env node
/**
 * Fetches recent issues from Sentry for the Genosys website project.
 *
 * Setup (one-time):
 *   1. Create a Personal Auth Token at https://sentry.io/settings/account/api/auth-tokens/
 *      Required scopes: project:read, event:read
 *   2. Add to .env.local:
 *      SENTRY_AUTH_TOKEN=sntrys_...
 *      SENTRY_ORG=genosys-middle-east-fz-llc   # optional, defaults to this
 *      SENTRY_PROJECT=javascript-nextjs         # optional, defaults to this
 *
 * Usage:
 *   npm run sentry:errors                           # last 10 unresolved issues
 *   npm run sentry:errors -- --limit 25             # last 25
 *   npm run sentry:errors -- --query "is:unresolved level:error"
 *   npm run sentry:errors -- --detail <issue-id>    # full event payload for one issue
 *   npm run sentry:errors -- --env production
 *   npm run sentry:errors -- --since 24h
 */

require('dotenv').config({ path: '.env.local' })

const TOKEN = process.env.SENTRY_AUTH_TOKEN
const ORG = process.env.SENTRY_ORG || 'genosys-middle-east-fz-llc'
const PROJECT = process.env.SENTRY_PROJECT || 'javascript-nextjs'
const BASE = 'https://sentry.io/api/0'

if (!TOKEN) {
  console.error('SENTRY_AUTH_TOKEN is not set.')
  console.error('')
  console.error('1. Create a token: https://sentry.io/settings/account/api/auth-tokens/')
  console.error('   Scopes: project:read, event:read')
  console.error('2. Add to .env.local: SENTRY_AUTH_TOKEN=sntrys_...')
  process.exit(1)
}

const args = process.argv.slice(2)
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`)
  return i !== -1 && args[i + 1] ? args[i + 1] : fallback
}

const limit = Number(flag('limit', 10))
const query = flag('query', 'is:unresolved')
const env = flag('env', 'production')
const since = flag('since', null)
const detailId = flag('detail', null)
const allEnvs = args.includes('--all-envs')

async function api(path) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Sentry API ${res.status}: ${body}`)
  }
  return res.json()
}

function sinceToStatsPeriod(s) {
  if (!s) return null
  const m = s.match(/^(\d+)(h|d|m|w)$/)
  return m ? s : null
}

function fmt(issue) {
  const last = new Date(issue.lastSeen).toLocaleString()
  const culprit = issue.culprit || '—'
  return [
    `${issue.shortId}  [${issue.level}]  ${issue.title}`,
    `  events=${issue.count}  users=${issue.userCount}  last=${last}`,
    `  where: ${culprit}`,
    `  link: ${issue.permalink}`,
  ].join('\n')
}

async function listIssues() {
  const url = new URL(`${BASE}/projects/${ORG}/${PROJECT}/issues/`)
  url.searchParams.set('limit', String(limit))
  url.searchParams.set('query', query)
  url.searchParams.set('sort', 'new')
  if (!allEnvs) url.searchParams.set('environment', env)
  const statsPeriod = sinceToStatsPeriod(since)
  if (statsPeriod) url.searchParams.set('statsPeriod', statsPeriod)

  const res = await fetch(url, { headers: { Authorization: `Bearer ${TOKEN}` } })
  if (!res.ok) throw new Error(`Sentry API ${res.status}: ${await res.text()}`)
  const issues = await res.json()

  console.log(`${ORG}/${PROJECT}  env=${allEnvs ? 'ALL' : env}  query="${query}"${since ? `  since=${since}` : ''}`)
  console.log('─'.repeat(80))
  if (issues.length === 0) {
    console.log('No issues match.')
    return
  }
  console.log(`${issues.length} issue(s):\n`)
  for (const i of issues) {
    console.log(fmt(i))
    console.log()
  }
}

async function detail(idOrShortId) {
  // Sentry's `query=shortId` doesn't work reliably — fall back to scanning the
  // recent issues list client-side. Numeric IDs hit the direct endpoint.
  let issue
  if (/^\d+$/.test(idOrShortId)) {
    issue = await api(`/organizations/${ORG}/issues/${idOrShortId}/`)
  } else {
    const list = await api(
      `/projects/${ORG}/${PROJECT}/issues/?limit=100&sort=new&query=`,
    )
    issue = list.find((i) => i.shortId === idOrShortId)
    if (!issue) {
      console.error(
        `Issue ${idOrShortId} not found in the last 100 issues. Try the numeric ID from the list output instead.`,
      )
      process.exit(1)
    }
  }
  const id = issue.id
  const [latest, events] = await Promise.all([
    api(`/organizations/${ORG}/issues/${id}/events/latest/`),
    api(`/organizations/${ORG}/issues/${id}/events/?limit=5`),
  ])

  console.log(fmt(issue))
  console.log('\n─ Latest event ─'.padEnd(80, '─'))
  console.log(`Event ID: ${latest.eventID}`)
  console.log(`Received: ${latest.dateReceived}`)
  console.log(`URL:      ${latest.tags?.find((t) => t.key === 'url')?.value || '—'}`)
  console.log(`Release:  ${latest.release?.version || '—'}`)
  console.log(`User:     ${latest.user ? JSON.stringify(latest.user) : '—'}`)

  const exception = latest.entries?.find((e) => e.type === 'exception')
  if (exception) {
    const values = exception.data?.values || []
    for (const v of values) {
      console.log(`\n${v.type}: ${v.value}`)
      const frames = v.stacktrace?.frames?.slice(-8) || []
      for (const f of frames.reverse()) {
        const loc = `${f.filename || f.module}:${f.lineNo || '?'}`
        console.log(`  at ${f.function || '<anonymous>'} (${loc})`)
      }
    }
  }

  console.log(`\nRecent ${events.length} event(s):`)
  for (const e of events) {
    console.log(`  ${e.dateReceived}  ${e.eventID.slice(0, 8)}  ${e.tags?.find((t) => t.key === 'browser')?.value || '—'}`)
  }
}

async function main() {
  if (detailId) await detail(detailId)
  else await listIssues()
}

main().catch((err) => {
  console.error(err.message)
  process.exit(1)
})
