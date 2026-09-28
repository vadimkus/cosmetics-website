#!/usr/bin/env node
/**
 * Creates the five GENOSYS DTS Microneedle Stamp items in MoySklad (website product 67), one per
 * needle length, cloned from the Standard Detachable Roller 2.0mm (code 00005): same folder
 * (ROLLERS), unit, VAT 5% and price types, retail 230 / wholesale 115 like the rollers. No buy
 * price and no stock: those arrive with the first supply.
 *
 * Idempotent: an item whose code already exists is reported, not recreated.
 *   node scripts/moysklad-create-dts-stamp-items-20260928.js            (dry run)
 *   node scripts/moysklad-create-dts-stamp-items-20260928.js --apply
 * Credentials: MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD from .env.
 */
const API = 'https://api.moysklad.ru/api/remap/1.2'
const { MOYSKLAD_LOGIN: LOGIN, MOYSKLAD_PASSWORD: PASSWORD } = process.env
if (!LOGIN || !PASSWORD) { console.error('set MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD'); process.exit(1) }
const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const APPLY = process.argv.includes('--apply')

const TEMPLATE_ID = 'f4fb8b3a-343b-11ea-0a80-06a400010a65' // 00005 Standard Detachable Manual Roller 2.0mm
const ITEMS = [
  ['54504', 'Genosys DTS Microneedle Stamp 0.25mm'],
  ['54505', 'Genosys DTS Microneedle Stamp 0.5mm'],
  ['54506', 'Genosys DTS Microneedle Stamp 1.0mm'],
  ['54507', 'Genosys DTS Microneedle Stamp 1.5mm'],
  ['54508', 'Genosys DTS Microneedle Stamp 2.0mm'],
]
const RETAIL = 23000
const WHOLESALE = 11500

async function api(path, init = {}) {
  for (let i = 0; ; i++) {
    try {
      const res = await fetch(API + path, {
        ...init,
        headers: { Authorization: AUTH, Accept: 'application/json;charset=utf-8', 'Content-Type': 'application/json', 'Accept-Encoding': 'gzip', ...init.headers },
      })
      const text = await res.text()
      if ((res.status === 429 || res.status >= 500) && i < 4) { await new Promise(r => setTimeout(r, 1500 * (i + 1))); continue }
      if (!res.ok) throw new Error(`HTTP ${res.status} ${path}: ${text.slice(0, 400)}`)
      return text ? JSON.parse(text) : null
    } catch (e) {
      if (i < 4 && /fetch failed|ECONNRESET|ETIMEDOUT/.test(String(e))) { await new Promise(r => setTimeout(r, 1500 * (i + 1))); continue }
      throw e
    }
  }
}

;(async () => {
  const t = await api(`/entity/product/${TEMPLATE_ID}`)
  const base = {
    productFolder: t.productFolder,
    uom: t.uom,
    vat: t.vat,
    vatEnabled: t.vatEnabled,
    useParentVat: t.useParentVat,
    paymentItemType: t.paymentItemType,
    trackingType: t.trackingType,
    ...(t.country ? { country: t.country } : {}),
    ...(t.taxSystem ? { taxSystem: t.taxSystem } : {}),
    salePrices: t.salePrices.map(p => ({
      value: p.priceType.name === 'оптовая' ? WHOLESALE : RETAIL,
      currency: p.currency,
      priceType: { meta: p.priceType.meta },
    })),
  }
  console.log(`template ${t.code} ${t.name} | folder ${t.pathName} | vat ${t.vat} | prices ${t.salePrices.map(p => p.priceType.name).join(', ')}`)

  for (const [code, name] of ITEMS) {
    const found = await api(`/entity/product?filter=code=${code}`)
    if (found.rows.length) {
      const r = found.rows[0]
      console.log(`exists  ${code} ${r.name} ${r.id}`)
      continue
    }
    if (!APPLY) { console.log(`create  ${code} ${name} (dry run)`); continue }
    const created = await api('/entity/product', { method: 'POST', body: JSON.stringify({ ...base, code, name }) })
    console.log(`created ${created.code} ${created.name} ${created.id} | ${created.salePrices.map(p => `${p.priceType.name}:${p.value / 100}`).join(' ')}`)
  }
  if (!APPLY) console.log('Dry run - pass --apply to write.')
})().catch(e => { console.error(e.message); process.exit(1) })
