#!/usr/bin/env node
const API = 'https://api.moysklad.ru/api/remap/1.2'
const AUTH = 'Basic ' + Buffer.from(`${process.env.MOYSKLAD_LOGIN}:${process.env.MOYSKLAD_PASSWORD}`).toString('base64')
const AGENT_ID = 'dc883e47-f051-11f0-0a80-0f7100059e21'
const CONTRACT_ID = '383ebfbb-f052-11f0-0a80-0035000650e3'
const JULY_REPORT = '01428'

async function api(path) {
  const res = await fetch(API + path, {
    headers: { Authorization: AUTH, Accept: 'application/json;charset=utf-8' },
  })
  const text = await res.text()
  if (!res.ok) throw new Error(`${res.status} ${path} ${text.slice(0, 400)}`)
  return JSON.parse(text)
}

async function all(path) {
  const rows = []
  let offset = 0
  while (true) {
    const sep = path.includes('?') ? '&' : '?'
    const data = await api(`${path}${sep}limit=100&offset=${offset}`)
    rows.push(...(data.rows || []))
    if ((data.rows || []).length < 100) break
    offset += 100
  }
  return rows
}

function money(n) {
  return ((n || 0) / 100).toFixed(2)
}

;(async () => {
  const [agent, contract] = await Promise.all([
    api(`/entity/counterparty/${AGENT_ID}`),
    api(`/entity/contract/${CONTRACT_ID}`),
  ])
  console.log('Agent:', agent.name, agent.id)
  console.log('Contract:', contract.name, contract.id, 'agent=', contract.agent?.meta?.href)

  const reports = await all(
    `/entity/commissionreportin?filter=agent=${encodeURIComponent(`${API}/entity/counterparty/${AGENT_ID}`)};contract=${encodeURIComponent(`${API}/entity/contract/${CONTRACT_ID}`)}&order=moment,desc`,
  )
  console.log('\nReports on agr:')
  for (const r of reports.slice(0, 8)) {
    console.log(`  ${r.name} ${r.moment} sum=${money(r.sum)} appl=${r.applicable}`)
  }

  const july = reports.find((r) => r.name === JULY_REPORT)
  if (july) {
    const pos = await all(`/entity/commissionreportin/${july.id}/positions?expand=assortment`)
    const want = new Set(['00140', '00063', '00144', '00122'])
    console.log('\nJuly 01428 prices for Aug SKUs:')
    for (const p of pos) {
      const code = p.assortment?.code
      if (!want.has(code)) continue
      console.log(`  ${code} ${p.assortment.name} qty=${p.quantity} price=${money(p.price)}`)
    }
  }

  const codes = ['00140', '00063', '00144', '00122']
  console.log('\nAssortment:')
  for (const code of codes) {
    const d = await api(`/entity/assortment?filter=code=${encodeURIComponent(code)}&limit=5&stockMode=all`)
    const row = (d.rows || []).find((r) => r.code === code)
    const avail = Number(row?.stock || 0) - Number(row?.reserve || 0)
    console.log(`  ${code} ${row?.name} sale=${money(row?.salePrice)} stock=${avail}`)
  }
})().catch((e) => {
  console.error(e)
  process.exit(1)
})
