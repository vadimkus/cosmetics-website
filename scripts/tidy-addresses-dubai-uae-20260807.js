/**
 * Tidy duplicate Dubai/UAE/country tokens in website + MoySklad addresses.
 *
 *   node --import dotenv/config scripts/tidy-addresses-dubai-uae-20260807.js
 *   node --import dotenv/config scripts/tidy-addresses-dubai-uae-20260807.js --web-only
 *   node --import dotenv/config scripts/tidy-addresses-dubai-uae-20260807.js --ms-only
 */
const path = require('path')
const fs = require('fs')
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') })
const { PrismaClient } = require('@prisma/client')

const WEB_ONLY = process.argv.includes('--web-only')
const MS_ONLY = process.argv.includes('--ms-only')

const API = 'https://api.moysklad.ru/api/remap/1.2'
const AUTH = 'Basic ' + Buffer.from(`${process.env.MOYSKLAD_LOGIN}:${process.env.MOYSKLAD_PASSWORD}`).toString('base64')
const COUNTRY_UAE = '8afef359-33c6-11ea-0a80-0043000aceae'

const EMIRATE_MAP = {
  dubai: 'Dubai',
  'abu dhabi': 'Abu Dhabi',
  sharjah: 'Sharjah',
  ajman: 'Ajman',
  'ras al khaimah': 'Ras Al Khaimah',
  rak: 'Ras Al Khaimah',
  'umm al quwain': 'Umm Al Quwain',
  fujairah: 'Fujairah',
}

function isCountry(p) {
  return /^(uae|u\.a\.e\.?|united arab emirates|оаэ)$/i.test(String(p || '').trim())
}

function emirateKey(p) {
  const k = String(p || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
  return EMIRATE_MAP[k] ? k : null
}

function looksMessy(raw) {
  const s = String(raw || '')
  if (!s.trim()) return false
  return (
    /dubai\s*,\s*dubai/i.test(s) ||
    /\buae\b/i.test(s) ||
    /united arab emirates/i.test(s) ||
    /оаэ/i.test(s) ||
    /,\s*00000\b/.test(s) ||
    /\s{2,}/.test(s) ||
    /,\s*,/.test(s) ||
    /,\s*$/.test(s.trim()) ||
    Object.keys(EMIRATE_MAP).some((e) => new RegExp(`${e}\\s*,\\s*${e}`, 'i').test(s))
  )
}

function tidyAddress(raw) {
  if (raw == null) return { cleaned: raw, changed: false }
  const original = String(raw)
  let s = original.replace(/\s+/g, ' ').trim()
  if (!s) return { cleaned: s, changed: original !== s }

  s = s.replace(/\s*,\s*/g, ', ').replace(/\s*;\s*/g, ', ')
  s = s.replace(/^,+|,+$/g, '').trim()

  let parts = s.split(',').map((p) => p.trim()).filter(Boolean)
  const postals = []
  parts = parts.filter((p) => {
    if (/^00000$/.test(p)) return false
    if (/^\d{4,6}$/.test(p)) {
      postals.push(p)
      return false
    }
    const m = p.match(/^uae\s+(\d{4,6})$/i)
    if (m) {
      postals.push(m[1])
      return false
    }
    return true
  })

  parts = parts.filter((p) => !isCountry(p))

  const collapsed = []
  for (const p of parts) {
    if (collapsed.length && collapsed[collapsed.length - 1].toLowerCase() === p.toLowerCase()) continue
    collapsed.push(p)
  }
  parts = collapsed

  let emirate = null
  const rest = []
  for (const p of parts) {
    const ek = emirateKey(p)
    if (ek) {
      if (!emirate) emirate = EMIRATE_MAP[ek]
      continue
    }
    if (rest.some((x) => x.toLowerCase() === p.toLowerCase())) continue
    rest.push(p)
  }

  const cleanedParts = [...rest]
  if (emirate) {
    const already = rest.some((p) => p.toLowerCase().includes(emirate.toLowerCase()))
    if (!already) cleanedParts.push(emirate)
  }
  if (postals.length) cleanedParts.push(postals[0])

  const cleaned = cleanedParts
    .join(', ')
    .replace(/\s+/g, ' ')
    .replace(/,\s*,/g, ', ')
    .replace(/^,\s*|\s*,$/g, '')
    .trim()

  return { cleaned, changed: cleaned !== original.replace(/\s+/g, ' ').trim() }
}

function tidyLine1(line1, city, emirate) {
  const t = tidyAddress(line1)
  const cityKey = String(city || '')
    .trim()
    .toLowerCase()
  const emKey = String(emirate || '')
    .trim()
    .toLowerCase()
  return String(t.cleaned || '')
    .split(',')
    .map((p) => p.trim())
    .filter(Boolean)
    .filter((p) => {
      const k = p.toLowerCase()
      if (isCountry(p)) return false
      if (cityKey && k === cityKey) return false
      if (emKey && k === emKey) return false
      return true
    })
    .join(', ')
}

function makePrisma() {
  const databaseUrl = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL
  if (!databaseUrl) throw new Error('No DATABASE_URL')
  if (databaseUrl.startsWith('prisma+') || databaseUrl.includes('accelerate') || databaseUrl.includes('prisma.io')) {
    return new PrismaClient({ accelerateUrl: databaseUrl, log: ['error'] })
  }
  const { PrismaPg } = require('@prisma/adapter-pg')
  const { Pool } = require('pg')
  return new PrismaClient({
    adapter: new PrismaPg(new Pool({ connectionString: databaseUrl })),
    log: ['error'],
  })
}

async function api(method, pathStr, body, attempt = 1) {
  const res = await fetch(pathStr.startsWith('http') ? pathStr : API + pathStr, {
    method,
    headers: {
      Authorization: AUTH,
      Accept: 'application/json;charset=utf-8',
      'Accept-Encoding': 'gzip',
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const text = await res.text()
  if ((res.status === 429 || res.status >= 500) && attempt < 8) {
    await new Promise((r) => setTimeout(r, 800 * attempt))
    return api(method, pathStr, body, attempt + 1)
  }
  if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 800)}`)
  return text ? JSON.parse(text) : null
}

async function fetchAllCounterparties() {
  const rows = []
  let offset = 0
  for (;;) {
    const page = await api('GET', `/entity/counterparty?limit=1000&offset=${offset}`)
    rows.push(...(page.rows || []))
    if (!page.rows || page.rows.length < 1000) break
    offset += 1000
  }
  return rows
}

function msStreetFromCp(cp) {
  const full = cp.actualAddressFull || {}
  let street = String(full.street || '').trim()
  let addInfo = String(full.addInfo || '').trim()
  let city = String(full.city || '').trim() || 'Dubai'

  if (!street && cp.actualAddress) {
    const t = tidyAddress(
      String(cp.actualAddress)
        .replace(/^UAE,?\s*/i, '')
        .replace(/,\s*United Arab Emirates\s*$/i, '')
    )
    street = t.cleaned
    const parts = street.split(',').map((p) => p.trim()).filter(Boolean)
    if (parts.length && emirateKey(parts[parts.length - 1])) {
      city = EMIRATE_MAP[emirateKey(parts[parts.length - 1])]
      street = parts.slice(0, -1).join(', ')
    }
  }

  street = tidyAddress(street).cleaned
  addInfo = addInfo ? tidyAddress(addInfo).cleaned : ''

  if (addInfo && street && street.toLowerCase().includes(addInfo.toLowerCase())) addInfo = ''
  if (addInfo && street && addInfo.toLowerCase().includes(street.toLowerCase())) {
    street = addInfo
    addInfo = ''
  }

  street = street
    .split(',')
    .map((p) => p.trim())
    .filter((p) => p && !isCountry(p) && !emirateKey(p))
    .filter((p, i, arr) => arr.findIndex((x) => x.toLowerCase() === p.toLowerCase()) === i)
    .join(', ')

  addInfo = addInfo
    .split(',')
    .map((p) => p.trim())
    .filter((p) => p && !isCountry(p) && !emirateKey(p))
    .join(', ')

  return { street, addInfo, city: EMIRATE_MAP[emirateKey(city)] || city || 'Dubai' }
}

async function tidyWebsite(prisma) {
  const users = await prisma.user.findMany({
    where: { OR: [{ address: { not: null } }, { addresses: { some: {} } }] },
    select: {
      id: true,
      name: true,
      email: true,
      address: true,
      addresses: true,
    },
  })

  let userUpdated = 0
  let addrUpdated = 0
  const userLog = []
  const addrLog = []

  for (const u of users) {
    if (u.address) {
      const t = tidyAddress(u.address)
      if (t.cleaned !== u.address) {
        await prisma.user.update({ where: { id: u.id }, data: { address: t.cleaned } })
        userUpdated++
        userLog.push({ name: u.name, email: u.email, from: u.address, to: t.cleaned })
      }
    }

    for (const a of u.addresses) {
      const newLine1 = tidyLine1(a.addressLine1, a.city, a.emirate)
      const newLine2 = a.addressLine2 ? tidyAddress(a.addressLine2).cleaned : a.addressLine2
      const newCity = a.city ? EMIRATE_MAP[emirateKey(a.city)] || a.city.trim() : a.city
      const newEmirate = a.emirate ? EMIRATE_MAP[emirateKey(a.emirate)] || a.emirate.trim() : a.emirate
      let newCountry = a.country || 'United Arab Emirates'
      if (isCountry(newCountry) || /uae/i.test(String(newCountry))) newCountry = 'United Arab Emirates'

      const changed =
        newLine1 !== (a.addressLine1 || '') ||
        (newLine2 || '') !== (a.addressLine2 || '') ||
        (newCity || '') !== (a.city || '') ||
        (newEmirate || '') !== (a.emirate || '') ||
        (newCountry || '') !== (a.country || '')

      if (!changed) continue

      await prisma.address.update({
        where: { id: a.id },
        data: {
          addressLine1: newLine1,
          addressLine2: newLine2 || null,
          city: newCity,
          emirate: newEmirate,
          country: newCountry,
        },
      })
      addrUpdated++
      addrLog.push({ name: u.name, from: a.addressLine1, to: newLine1, city: newCity, emirate: newEmirate })
    }
  }

  return { userUpdated, addrUpdated, userLog, addrLog }
}

async function tidyMoySklad() {
  console.log('Fetching MoySklad counterparties...')
  const cps = await fetchAllCounterparties()
  const msCandidates = cps.filter(
    (cp) =>
      looksMessy(cp.actualAddress || '') ||
      looksMessy(cp.actualAddressFull?.street || '') ||
      looksMessy(cp.actualAddressFull?.addInfo || '')
  )
  console.log(`MoySklad messy candidates: ${msCandidates.length}`)

  let msUpdated = 0
  const msLog = []

  for (const cp of msCandidates) {
    const { street, addInfo, city } = msStreetFromCp(cp)
    if (!street && !addInfo) continue

    const before = cp.actualAddress || ''
    const nextStreet = street || addInfo
    const nextAdd = street ? addInfo : ''
    const prevStreet = String(cp.actualAddressFull?.street || '').trim()
    const prevAdd = String(cp.actualAddressFull?.addInfo || '').trim()
    if (prevStreet === nextStreet && prevAdd === nextAdd && !looksMessy(before)) continue

    try {
      const after = await api('PUT', `/entity/counterparty/${cp.id}`, {
        actualAddressFull: {
          country: {
            meta: {
              href: `${API}/entity/country/${COUNTRY_UAE}`,
              type: 'country',
              mediaType: 'application/json',
            },
          },
          city,
          street: nextStreet,
          addInfo: nextAdd,
        },
      })
      msUpdated++
      msLog.push({ name: cp.name, id: cp.id, from: before, to: after.actualAddress })
      if (msUpdated <= 40 || /sierova|kateryna/i.test(cp.name)) {
        console.log(`MS ✓ ${cp.name}: ${before} → ${after.actualAddress}`)
      }
    } catch (e) {
      console.log(`MS ✗ ${cp.name}: ${e.message.slice(0, 220)}`)
    }
  }

  const katSearch = await api('GET', `/entity/counterparty?search=${encodeURIComponent('Kateryna Sierova')}&limit=10`)
  for (const cp of katSearch.rows || []) {
    console.log(`Kateryna MS now: ${cp.name} | ${cp.actualAddress}`)
  }

  return { msUpdated, msLog }
}

async function main() {
  const prisma = makePrisma()
  const report = {
    generatedAt: new Date().toISOString(),
    userUpdated: 0,
    addrUpdated: 0,
    msUpdated: 0,
    userLog: [],
    addrLog: [],
    msLog: [],
  }

  try {
    if (!MS_ONLY) {
      const web = await tidyWebsite(prisma)
      Object.assign(report, web)
      console.log(`Website user.address updated: ${web.userUpdated}`)
      console.log(`Website Address rows updated: ${web.addrUpdated}`)
      const kat = web.userLog.find((x) => /sierova|kateryna/i.test(`${x.name} ${x.email}`))
      if (kat) console.log(`Kateryna web: ${kat.from} → ${kat.to}`)
    }

    if (!WEB_ONLY) {
      const ms = await tidyMoySklad()
      report.msUpdated = ms.msUpdated
      report.msLog = ms.msLog
      console.log(`MoySklad counterparties updated: ${ms.msUpdated}`)
    }

    const outPath = path.join(__dirname, '..', 'tmp', 'address-tidy-applied-20260807.json')
    fs.mkdirSync(path.dirname(outPath), { recursive: true })
    fs.writeFileSync(outPath, JSON.stringify(report, null, 2))
    console.log(`Report: ${outPath}`)
  } finally {
    await prisma.$disconnect()
  }
}

main().catch((e) => {
  console.error('FATAL:', e)
  process.exit(1)
})
