#!/usr/bin/env node
/** GOCOSMO — list vs buyPrice damage calc. */
const API = 'https://api.moysklad.ru/api/remap/1.2'
const AUTH = 'Basic ' + Buffer.from(`${process.env.MOYSKLAD_LOGIN}:${process.env.MOYSKLAD_PASSWORD}`).toString('base64')
const AGENT = '465093a9-8ae0-11ef-0a80-0b5e00108550'
const CONTRACT = '4f49a970-8d22-11ef-0a80-157800079792'
const REPORT_ID = '7efa01fb-03f9-11f1-0a80-078e0016eec2'
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function api(method, pathStr) {
  for (let i = 0; i < 5; i++) {
    await sleep(400 + i * 300)
    const res = await fetch(API + pathStr, {
      headers: { Authorization: AUTH, Accept: 'application/json;charset=utf-8', 'Accept-Encoding': 'gzip' },
    })
    const text = await res.text()
    if (res.status === 503 || res.status === 429) continue
    if (!res.ok) throw new Error(`${res.status} ${pathStr} ${text.slice(0, 200)}`)
    return text ? JSON.parse(text) : null
  }
  throw new Error(`Failed after retries: ${pathStr}`)
}

async function fetchAll(pathStr) {
  const rows = []
  let offset = 0
  while (true) {
    const sep = pathStr.includes('?') ? '&' : '?'
    const data = await api('GET', `${pathStr}${sep}limit=100&offset=${offset}`)
    rows.push(...(data.rows || []))
    if ((data.rows || []).length < 100) break
    offset += 100
  }
  return rows
}

async function fetchPositions(metaHref) {
  return fetchAll(`${metaHref}/positions?expand=assortment`)
}

const productCache = new Map()
async function getProduct(href) {
  if (!href) return {}
  if (productCache.has(href)) return productCache.get(href)
  const p = await api('GET', href.replace(API, ''))
  productCache.set(href, p)
  return p
}

function buyPriceAed(product, salePriceMinor) {
  const v = product?.buyPrice?.value ?? product?.buyPrice
  if (typeof v === 'number' && v > 0) return v / 100
  return null
}

async function main() {
  const agentHref = `${API}/entity/counterparty/${AGENT}`
  const contractHref = `${API}/entity/contract/${CONTRACT}`
  const f = encodeURIComponent(`agent=${agentHref};moment>=2024-01-01`)

  const demands = (await fetchAll(`/entity/demand?filter=${f}`)).filter(
    (d) => d.contract?.meta?.href === contractHref
  )
  const reports = await fetchAll(`/entity/commissionreportin?filter=${f}`)
  const returns = await fetchAll(`/entity/salesreturn?filter=${f}`)

  const bal = new Map()
  const add = (code, name, qty, priceMinor, assHref) => {
    if (!code) return
    const x = bal.get(code) || { code, name, qty: 0, price: priceMinor || 0, assHref }
    x.qty += qty
    if (priceMinor) x.price = priceMinor
    if (assHref) x.assHref = assHref
    bal.set(code, x)
  }

  for (const d of demands) {
    for (const p of await fetchPositions(d.meta.href)) {
      add(p.assortment?.code, p.assortment?.name, p.quantity, p.price, p.assortment?.meta?.href)
    }
  }
  for (const r of reports) {
    for (const p of await fetchPositions(r.meta.href)) {
      add(p.assortment?.code, p.assortment?.name, -p.quantity, p.price, p.assortment?.meta?.href)
    }
  }
  for (const r of returns) {
    for (const p of await fetchPositions(r.meta.href)) {
      add(p.assortment?.code, p.assortment?.name, -p.quantity, p.price, p.assortment?.meta?.href)
    }
  }

  const stockRows = [...bal.values()].filter((x) => x.qty > 0.001)
  let listTotal = 0
  let buyTotal = 0
  let noBuy = []

  console.log('=== CONSIGNMENT STOCK (book balance) ===\n')
  for (const r of stockRows.sort((a, b) => b.qty * b.price - a.qty * a.price)) {
    const prod = await getProduct(r.assHref)
    const buy = buyPriceAed(prod, r.price)
    const listLine = r.qty * (r.price / 100)
    listTotal += listLine
    if (buy == null) {
      noBuy.push(r.code)
      continue
    }
    const buyLine = r.qty * buy
    buyTotal += buyLine
    console.log(
      `${r.code} qty ${r.qty} | list ${listLine.toFixed(2)} | buy ${buyLine.toFixed(2)} | ${(r.name || '').slice(0, 45)}`
    )
  }

  let rList = 0
  let rBuy = 0
  console.log('\n=== REPORT 01253 (unpaid sold) ===\n')
  for (const p of (await fetchPositions(`/entity/commissionreportin/${REPORT_ID}`)).rows || []) {
    const prod = await getProduct(p.assortment?.meta?.href)
    const buy = buyPriceAed(prod, p.price)
    const listLine = p.quantity * (p.price / 100)
    rList += listLine
    if (buy != null) rBuy += p.quantity * buy
    console.log(
      `${p.assortment?.code} qty ${p.quantity} | list ${listLine.toFixed(2)} | buy ${buy != null ? (p.quantity * buy).toFixed(2) : 'N/A'}`
    )
  }

  console.log('\n=== DAMAGE SUMMARY (AED) ===')
  console.log(`Consignment stock — list (revenue at risk):     ${listTotal.toFixed(2)}`)
  console.log(`Consignment stock — buyPrice (COGS at risk):    ${buyTotal.toFixed(2)}`)
  console.log(`Gross margin on stock if collected:             ${(listTotal - buyTotal).toFixed(2)}`)
  console.log(`Report 01253 — list unpaid:                     ${rList.toFixed(2)}`)
  console.log(`Report 01253 — buyPrice (COGS already consumed): ${rBuy.toFixed(2)}`)
  console.log(`Report 01253 — gross margin if collected:       ${(rList - rBuy).toFixed(2)}`)
  console.log('---')
  console.log(`TOTAL list at risk (stock + 01253):             ${(listTotal + rList).toFixed(2)}`)
  console.log(`TOTAL buyPrice at risk (real damage floor):       ${(buyTotal + rBuy).toFixed(2)}`)
  console.log(`Your consignment report shows:                    14011.00`)
  if (noBuy.length) console.log(`Missing buyPrice on codes: ${noBuy.join(', ')}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
