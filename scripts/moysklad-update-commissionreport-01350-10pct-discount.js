#!/usr/bin/env node

/**
 * Abeer Mekki — Полученный отчёт комиссионера **01350** (09.05.2026):
 * снижает цену каждой строки на 10% (цена × 0.9), выручка **2 745,00 AED**
 * вместо 3 050,00 AED.
 *
 *   node scripts/moysklad-update-commissionreport-01350-10pct-discount.js
 *   node scripts/moysklad-update-commissionreport-01350-10pct-discount.js --commit
 */

const API = 'https://api.moysklad.ru/api/remap/1.2'
const LOGIN = process.env.MOYSKLAD_LOGIN
const PASSWORD = process.env.MOYSKLAD_PASSWORD

if (!LOGIN || !PASSWORD) {
  console.error('ERROR: set MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD')
  process.exit(1)
}

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')

const REPORT_NAME = '01350'
const DISCOUNT_MULT = 0.9

/** Pre-discount unit prices (minor AED) from report 01350 before 10% line discount */
const ORIGINAL_UNIT_MINOR_BY_CODE = {
  '00021': 16500, // Snow O2 Cleanser
  '00030': 16500,
  '54457': 12500,
  '00194': 16500,
  '00122': 14500,
  '00037': 22500,
  '54464': 15000,
  '00059': 49000,
}

const hdr = {
  Authorization: AUTH,
  Accept: 'application/json;charset=utf-8',
  'Accept-Encoding': 'gzip',
  'Content-Type': 'application/json',
}

async function api(method, pathStr, body) {
  const res = await fetch(pathStr.startsWith('http') ? pathStr : API + pathStr, {
    method,
    headers: hdr,
    body: body ? JSON.stringify(body) : undefined,
  })
  const text = await res.text()
  if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} - ${text.slice(0, 1200)}`)
  return text ? JSON.parse(text) : null
}

function moneyMinor(n) {
  return (n / 100).toFixed(2)
}

async function main() {
  const list = await api(
    'GET',
    '/entity/commissionreportin?filter=' + encodeURIComponent(`name=${REPORT_NAME}`) + '&limit=5'
  )
  const rep = list.rows?.[0]
  if (!rep) throw new Error(`Отчёт ${REPORT_NAME} не найден`)
  if (rep.name !== REPORT_NAME) throw new Error(`Ожидался номер ${REPORT_NAME}, получено ${rep.name}`)

  console.log(`Отчёт: ${rep.name} | id=${rep.id}`)
  console.log(`Сумма до правок (API minor): ${rep.sum} → ${moneyMinor(rep.sum)} AED`)

  const pos = await api(
    'GET',
    `/entity/commissionreportin/${rep.id}/positions?limit=100&expand=assortment`
  )
  const rows = pos.rows || []
  console.log(`Позиций: ${rows.length}`)

  let sumNewMinor = 0
  const updates = []

  for (const p of rows) {
    const href = p.assortment?.meta?.href || ''
    const productId = href.split('/').pop()?.split('?')[0] || ''
    const code = p.assortment?.code
    if (!code || ORIGINAL_UNIT_MINOR_BY_CODE[code] == null) {
      throw new Error(
        `Позиция без code или неизвестный артикул: id=${p.id} code=${code ?? '—'} (нужен expand=assortment)`
      )
    }
    const originalMinor = ORIGINAL_UNIT_MINOR_BY_CODE[code]
    const oldP = Math.round(Number(p.price))
    const newP = Math.round(originalMinor * DISCOUNT_MULT)
    const qty = Number(p.quantity)
    sumNewMinor += newP * qty
    updates.push({ p, productId, code, oldP, newP, qty })
    console.log(
      `  ${code} | qty ${qty} | было ${moneyMinor(oldP)} → станет ${moneyMinor(newP)} (от ${moneyMinor(originalMinor)}) | строка ${moneyMinor(newP * qty)}`
    )
  }

  console.log(`\nНовая выручка (сумма строк): ${moneyMinor(sumNewMinor)} AED (ожид. 2745.00)`)
  if (Math.abs(sumNewMinor - 274500) > 1) {
    console.warn('WARN: сумма не ровно 274500 minor — перепроверьте позиции вручную.')
  }

  if (!COMMIT) {
    console.log('\nDRY RUN. Для записи: --commit')
    return
  }

  for (const u of updates) {
    const { p, newP } = u
    const body = {
      meta: p.meta,
      quantity: p.quantity,
      price: newP,
      assortment: p.assortment,
      vat: p.vat,
      vatEnabled: p.vatEnabled,
    }
    if (p.reward != null) body.reward = p.reward
    await api('PUT', `/entity/commissionreportin/${rep.id}/positions/${p.id}`, body)
  }

  const rep2 = await api('GET', `/entity/commissionreportin/${rep.id}`)
  console.log(`\nГотово. Новая sum (API): ${rep2.sum} → ${moneyMinor(rep2.sum)} AED`)
  console.log(`UI: https://online.moysklad.ru/app/#commissionreport/edit?id=${rep.id}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
