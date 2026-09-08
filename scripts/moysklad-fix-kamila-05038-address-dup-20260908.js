#!/usr/bin/env node

/**
 * Kamila Turdyshaeva — clear stale actualAddressFull.addInfo so Legal_TAX
 * does not append the previous address after the current street. Re-export 05038.
 *
 *   node --import dotenv/config scripts/moysklad-fix-kamila-05038-address-dup-20260908.js
 *   node --import dotenv/config scripts/moysklad-fix-kamila-05038-address-dup-20260908.js --commit
 */

const fs = require('fs')
const os = require('os')
const path = require('path')

const API = 'https://api.moysklad.ru/api/remap/1.2'
const LOGIN = process.env.MOYSKLAD_LOGIN
const PASSWORD = process.env.MOYSKLAD_PASSWORD
if (!LOGIN || !PASSWORD) throw new Error('Missing MoySklad credentials')

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')
const AGENT_ID = '13f83209-56a2-11f1-0a80-02ec00393eab'
const INVOICE_ID = '2c8145f4-ab5f-11f1-0a80-17d5013be201'
const COUNTRY_UAE_ID = '8afef359-33c6-11ea-0a80-0043000aceae'
const TEMPLATE_ID = '5e56cd7d-ce85-4db5-8771-d7531f9ffd71'
const STREET = 'Casa Dora villa 233'
const CITY = 'Dubai'
const OUT = path.join(os.homedir(), 'Desktop', 'orders', 'GENOSYS_Kamila_Turdyshaeva_05038.pdf')

async function api(method, pathStr, body) {
  const response = await fetch(pathStr.startsWith('http') ? pathStr : API + pathStr, {
    method,
    headers: {
      Authorization: AUTH,
      Accept: 'application/json;charset=utf-8',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const text = await response.text()
  if (!response.ok) throw new Error(`HTTP ${response.status}: ${text.slice(0, 1200)}`)
  return text ? JSON.parse(text) : null
}

function addressFull() {
  return {
    country: {
      meta: {
        href: `${API}/entity/country/${COUNTRY_UAE_ID}`,
        type: 'country',
        mediaType: 'application/json',
      },
    },
    city: CITY,
    street: STREET,
    addInfo: '',
  }
}

async function exportInvoice() {
  const response = await fetch(`${API}/entity/invoiceout/${INVOICE_ID}/export`, {
    method: 'POST',
    headers: { Authorization: AUTH, Accept: '*/*', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      template: {
        meta: {
          href: `${API}/entity/invoiceout/metadata/customtemplate/${TEMPLATE_ID}`,
          type: 'customtemplate',
          mediaType: 'application/json',
        },
      },
      extension: 'pdf',
    }),
    redirect: 'manual',
  })
  if (response.status !== 302 && response.status !== 303) {
    throw new Error(`Export HTTP ${response.status}: ${(await response.text()).slice(0, 600)}`)
  }
  const location = response.headers.get('location')
  if (!location) throw new Error('Export response missing Location')
  const pdf = await fetch(location)
  if (!pdf.ok) throw new Error(`PDF download HTTP ${pdf.status}`)
  fs.mkdirSync(path.dirname(OUT), { recursive: true })
  fs.writeFileSync(OUT, Buffer.from(await pdf.arrayBuffer()))
}

async function main() {
  const [agent, invoice] = await Promise.all([
    api('GET', `/entity/counterparty/${AGENT_ID}`),
    api('GET', `/entity/invoiceout/${INVOICE_ID}`),
  ])
  if (agent.name !== 'Kamila Turdyshaeva' || invoice.name !== '05038') {
    throw new Error(`Unexpected records: ${agent.name} / ${invoice.name}`)
  }

  console.log(`Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`Street: ${agent.actualAddressFull?.street || '—'}`)
  console.log(`Stale addInfo: ${agent.actualAddressFull?.addInfo || '—'}`)
  console.log(`New address: UAE, ${CITY}, ${STREET} (addInfo empty)`)
  if (!COMMIT) return

  await api('PUT', `/entity/counterparty/${AGENT_ID}`, {
    actualAddressFull: addressFull(),
  })
  const after = await api('GET', `/entity/counterparty/${AGENT_ID}`)
  if (after.actualAddressFull?.addInfo) {
    throw new Error(`addInfo was not cleared: ${after.actualAddressFull.addInfo}`)
  }
  await exportInvoice()
  console.log(`Verified address: ${after.actualAddress}`)
  console.log(`PDF: ${OUT}`)
}

main().catch((error) => {
  console.error('FATAL:', error.message)
  process.exit(1)
})
