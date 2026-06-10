#!/usr/bin/env node

/**
 * Export active consignment (Commission) agreement customers to Excel.
 *
 *   node --import dotenv/config scripts/moysklad-export-active-consignment-customers-xlsx.js
 *
 * Output: ~/Desktop/GENOSYS_Active_Consignment_Customers.xlsx
 */

const fs = require('fs')
const path = require('path')
const os = require('os')
const { execFileSync } = require('child_process')

const API = 'https://api.moysklad.ru/api/remap/1.2'
const LOGIN = process.env.MOYSKLAD_LOGIN
const PASSWORD = process.env.MOYSKLAD_PASSWORD

if (!LOGIN || !PASSWORD) {
  console.error('ERROR: set MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD')
  process.exit(1)
}

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const OUT_PATH = path.join(os.homedir(), 'Desktop', 'GENOSYS_Active_Consignment_Customers.xlsx')

async function api(pathStr) {
  const res = await fetch(pathStr.startsWith('http') ? pathStr : API + pathStr, {
    headers: {
      Authorization: AUTH,
      Accept: 'application/json;charset=utf-8',
      'Accept-Encoding': 'gzip',
    },
  })
  const text = await res.text()
  if (!res.ok) throw new Error(`HTTP ${res.status} ${pathStr} — ${text.slice(0, 400)}`)
  return text ? JSON.parse(text) : null
}

async function fetchAll(pathStr) {
  const rows = []
  let offset = 0
  while (true) {
    const sep = pathStr.includes('?') ? '&' : '?'
    const data = await api(`${pathStr}${sep}limit=1000&offset=${offset}`)
    rows.push(...(data.rows || []))
    if ((data.rows || []).length < 1000) break
    offset += 1000
  }
  return rows
}

function isCommissionContract(c) {
  return c.contractType === 'Commission' || (!c.contractType && c.rewardType)
}

function isActiveContract(c) {
  return c.applicable !== false
}

function agentIdFromContract(c) {
  return c.agent?.meta?.href?.split('/').pop()?.split('?')[0] || null
}

async function fetchActiveConsignmentCustomerNames() {
  const contracts = await fetchAll('/entity/contract')
  const activeCommission = contracts.filter(
    (c) => isCommissionContract(c) && isActiveContract(c)
  )

  const agentIds = [...new Set(activeCommission.map(agentIdFromContract).filter(Boolean))]
  const names = []

  for (const id of agentIds) {
    const agent = await api(`/entity/counterparty/${id}`)
    if (agent?.name) names.push(agent.name)
  }

  names.sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' }))
  return { names, contractCount: activeCommission.length }
}

function writeXlsx(names, outPath) {
  const tmpJson = path.join(os.tmpdir(), `genosys-consignment-customers-${Date.now()}.json`)
  fs.writeFileSync(tmpJson, JSON.stringify(names))

  const py = `
import json, sys
from openpyxl import Workbook
from openpyxl.styles import Font

names = json.load(open(sys.argv[1]))
out = sys.argv[2]

wb = Workbook()
ws = wb.active
ws.title = "Consignment customers"
ws["A1"] = "Customer name"
ws["A1"].font = Font(bold=True)
for i, name in enumerate(names, start=2):
    ws[f"A{i}"] = name
ws.column_dimensions["A"].width = 60
wb.save(out)
print(len(names))
`

  const count = execFileSync('python3', ['-c', py, tmpJson, outPath], { encoding: 'utf8' }).trim()
  fs.unlinkSync(tmpJson)
  return Number(count)
}

async function main() {
  console.log('Fetching active consignment agreements from MoySklad…')
  const { names, contractCount } = await fetchActiveConsignmentCustomerNames()
  console.log(`  Commission contracts (active): ${contractCount}`)
  console.log(`  Unique customers: ${names.length}`)

  const written = writeXlsx(names, OUT_PATH)
  console.log(`\nSaved: ${OUT_PATH}`)
  console.log(`  Rows: ${written} customers (+ header)`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
