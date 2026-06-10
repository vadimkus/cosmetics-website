#!/usr/bin/env node

/**
 * Полученные отчёты комиссионера (продажи) для двух юрлиц Shakirovna:
 *   - ELITE SHAKIROVNA LADIES SALON L.L.C   (Salon block — 5 SKU)
 *   - SHAKIROVNA ESTHETIC CLINIC L.L.C      (Clinic — 1 SKU)
 *
 * Таблица от пользователя (2026-05-10). Маски в каталоге 23g, не 25g / 16g —
 * как в других отчётах GENOSYS.
 *
 * Dry-run:
 *   set -a && source .env && set +a
 *   node scripts/moysklad-create-shakirovna-elite-clinic-commission-20260510.js
 *
 * Одна организация:
 *   node scripts/moysklad-create-shakirovna-elite-clinic-commission-20260510.js --report=elite
 *   node scripts/moysklad-create-shakirovna-elite-clinic-commission-20260510.js --report=clinic
 *
 * Post:
 *   node scripts/moysklad-create-shakirovna-elite-clinic-commission-20260510.js --commit
 */

const API = 'https://api.moysklad.ru/api/remap/1.2'
const LOGIN = process.env.MOYSKLAD_LOGIN
const PASSWORD = process.env.MOYSKLAD_PASSWORD

if (!LOGIN || !PASSWORD) {
  console.error('ERROR: set MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD env vars')
  process.exit(1)
}

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')

const ARG_REPORT = (() => {
  const a = process.argv.find((x) => x.startsWith('--report='))
  return a ? a.split('=')[1] : 'all'
})()

const COMMON = {
  date: '2026-05-10',
  moment: '2026-05-10 20:05:00',
  organizationId: 'e18525a4-33c5-11ea-0a80-043f000b2738',
  stateNotPaidId: '3203736c-c43b-11eb-0a80-093a002b59a6',
}

/** Если API-поиск даст сбой, подставьте UUID из МойСклад (контрагент + договор комиссии). */
const FALLBACK = {
  elite: { agentId: null, contractId: null },
  clinic: { agentId: null, contractId: null },
}

const REPORTS = [
  {
    key: 'elite',
    title: 'ELITE SHAKIROVNA LADIES SALON L.L.C',
    exactName: 'ELITE SHAKIROVNA LADIES SALON L.L.C',
    marker: 'Shakirovna ELITE SALON consignment sold 2026-05-10 table',
    lines: [
      ['54458', 1], // Moisture Replenishing Hyaluron Cream 50g
      ['00041', 2], // Multi Sun Cream SPF40/PA++ 40g
      ['00063', 2], // Intensive Repair Collagen Mask 23g
      ['00144', 2], // Skin Caring Blemish Balm Cushion #2 Beige
      ['00140', 5], // Soothing Bomb Sea Algae Mask 23g (табл. 25g → каталог 23g)
    ],
  },
  {
    key: 'clinic',
    title: 'SHAKIROVNA ESTHETIC CLINIC L.L.C',
    exactName: 'SHAKIROVNA ESTHETIC CLINIC L.L.C',
    marker: 'Shakirovna ESTHETIC CLINIC consignment sold 2026-05-10 table',
    lines: [['00035', 1]], // Intensive Problem Control Cream 50g
  },
]

async function api(method, pathStr, body) {
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
  if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} - ${text.slice(0, 1200)}`)
  return text ? JSON.parse(text) : null
}

async function fetchAll(pathStr) {
  const rows = []
  let offset = 0
  const limit = 1000
  while (true) {
    const sep = pathStr.includes('?') ? '&' : '?'
    const data = await api('GET', `${pathStr}${sep}limit=${limit}&offset=${offset}`)
    const batch = data?.rows || []
    rows.push(...batch)
    if (batch.length < limit) break
    offset += limit
  }
  return rows
}

function href(type, id) {
  return {
    meta: {
      href: `${API}/entity/${type}/${id}`,
      type,
      mediaType: 'application/json',
    },
  }
}

function stateHref(entityType, stateId) {
  return {
    meta: {
      href: `${API}/entity/${entityType}/metadata/states/${stateId}`,
      type: 'state',
      mediaType: 'application/json',
    },
  }
}

function money(minor) {
  return (minor / 100).toFixed(2)
}

async function findCounterpartyByExactName(exactName) {
  const token = exactName.split(/\s+/)[0]
  const data = await api('GET', `/entity/counterparty?limit=100&search=${encodeURIComponent(token)}`)
  const rows = data?.rows || []
  const hit = rows.find((r) => r.name === exactName)
  if (!hit) {
    const names = rows.slice(0, 15).map((r) => r.name)
    throw new Error(
      `Контрагент не найден по точному имени "${exactName}". ` +
        `Первые совпадения по search="${token}": ${names.join(' | ') || '(нет)'}`
    )
  }
  return hit
}

function isCommissionContract(c) {
  const t = c.contractType || c.type
  return t === 'Commission' || String(t).toLowerCase() === 'commission'
}

async function findCommissionContractId(agentId) {
  const agentHref = `${API}/entity/counterparty/${agentId}`
  const filter = `agent=${agentHref}`
  const data = await api('GET', `/entity/contract?filter=${encodeURIComponent(filter)}&limit=100`)
  const rows = data?.rows || []
  const comm = rows.filter(isCommissionContract)
  const pick = (list) => {
    if (!list.length) return null
    if (list.length === 1) return list[0].id
    list.sort((a, b) => String(a.name || '').localeCompare(String(b.name || ''), 'ru'))
    return list[0].id
  }
  if (comm.length) {
    return pick(comm)
  }
  if (rows.length > 1) {
    throw new Error(
      `У контрагента ${agentId} несколько договоров, но ни один не помечен как Commission в API. ` +
        `Укажите contractId в FALLBACK в скрипте. Имена: ${rows.map((r) => r.name).join('; ')}`
    )
  }
  const id = pick(rows)
  if (!id) throw new Error(`Нет договоров у контрагента ${agentId}`)
  return id
}

async function resolveAgentAndContract(cfg) {
  const fb = FALLBACK[cfg.key]
  if (fb?.agentId && fb?.contractId) {
    return { agentId: fb.agentId, contractId: fb.contractId }
  }
  const agent = await findCounterpartyByExactName(cfg.exactName)
  const contractId = await findCommissionContractId(agent.id)
  return { agentId: agent.id, contractId }
}

async function fetchStockByCode() {
  const rows = await fetchAll('/report/stock/all?stockMode=all&stockMoreThan=-1')
  const stock = new Map()
  for (const row of rows) {
    if (!row.code) continue
    const id = row.meta?.href?.split('/').pop()?.split('?')[0]
    stock.set(row.code, {
      id,
      code: row.code,
      name: row.name,
      stock: Number(row.stock || 0),
      reserve: Number(row.reserve || 0),
      available: Number(row.stock || 0) - Number(row.reserve || 0),
      price: Number(row.salePrice || 0),
    })
  }
  return stock
}

async function ensureNoDuplicate(agentId, marker, date) {
  const filter = [
    `agent=${API}/entity/counterparty/${agentId}`,
    `moment>=${date} 00:00:00`,
    `moment<=${date} 23:59:59`,
  ].join(';')
  const reports = await fetchAll(`/entity/commissionreportin?filter=${encodeURIComponent(filter)}`)
  const dup = reports.find((report) => (report.description || '').includes(marker))
  if (dup) {
    throw new Error(`Уже есть отчёт с этим marker (${dup.name}, id=${dup.id})`)
  }
}

function printLines(resolved) {
  const totalMinor = resolved.reduce((sum, line) => sum + line.qty * line.price, 0)
  const totalQty = resolved.reduce((sum, line) => sum + line.qty, 0)
  console.log()
  console.log('  Позиции (AED, с НДС):')
  console.log('  ' + '-'.repeat(114))
  console.log(`  ${'Код'.padEnd(6)} | ${'Товар'.padEnd(62)} | ${'Кол'.padStart(4)} | ${'Цена'.padStart(9)} | ${'Сумма'.padStart(10)} | ${'Дост'.padStart(6)}`)
  console.log('  ' + '-'.repeat(114))
  for (const line of resolved) {
    console.log(
      `  ${line.code.padEnd(6)} | ${line.name.slice(0, 62).padEnd(62)} | ${String(line.qty).padStart(4)} | ${money(line.price).padStart(9)} | ${money(line.price * line.qty).padStart(10)} | ${String(line.available).padStart(6)}`
    )
  }
  console.log('  ' + '-'.repeat(114))
  console.log(`  Всего шт: ${totalQty} | Сумма с НДС: ${money(totalMinor)} AED`)
}

function positions(resolved) {
  return resolved.map((line) => ({
    quantity: line.qty,
    price: line.price,
    assortment: href('product', line.id),
    vat: 5,
    vatEnabled: true,
    reward: 0,
  }))
}

const filtered =
  ARG_REPORT === 'all'
    ? REPORTS
    : REPORTS.filter((r) => r.key === ARG_REPORT)

if (!filtered.length) {
  console.error(`Unknown --report=${ARG_REPORT} (elite|clinic|all)`)
  process.exit(1)
}

async function main() {
  console.log('====================================================================')
  console.log('  МойСклад — полученные отчёты комиссионера (Shakirovna Elite + Clinic)')
  console.log('====================================================================')
  console.log(`  Режим: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  Отчёты: ${filtered.map((f) => f.key).join(', ')}`)
  console.log(`  Дата : ${COMMON.date}`)

  const stock = await fetchStockByCode()

  for (const cfg of filtered) {
    console.log('\n--------------------------------------------------------------------')
    console.log(`  ${cfg.title}`)
    console.log('--------------------------------------------------------------------')

    const { agentId, contractId } = await resolveAgentAndContract(cfg)
    const agent = await api('GET', `/entity/counterparty/${agentId}`)
    const contract = await api('GET', `/entity/contract/${contractId}`)
    console.log(`  Контрагент: ${agent.name} (${agentId})`)
    console.log(`  Договор    : ${contract.name} (${contractId})`)

    await ensureNoDuplicate(agentId, cfg.marker, COMMON.date)

    const resolved = cfg.lines.map(([code, qty]) => {
      const item = stock.get(code)
      if (!item) throw new Error(`Нет кода в stock report: ${code}`)
      if (!item.id) throw new Error(`Нет product id для кода: ${code}`)
      return { ...item, qty }
    })

    printLines(resolved)

    const payload = {
      moment: COMMON.moment,
      applicable: true,
      vatEnabled: true,
      vatIncluded: true,
      organization: href('organization', COMMON.organizationId),
      agent: href('counterparty', agentId),
      contract: href('contract', contractId),
      state: stateHref('commissionreportin', COMMON.stateNotPaidId),
      commissionPeriodStart: COMMON.moment,
      commissionPeriodEnd: COMMON.moment,
      rewardType: 'PercentOfSales',
      rewardPercent: 0,
      description: [cfg.marker, `Строки по фото-таблице 2026-05-10, ${cfg.title}.`].join('\n'),
      positions: positions(resolved),
    }

    if (!COMMIT) {
      console.log('\n  DRY RUN — для создания добавьте --commit')
      continue
    }

    console.log('\n  Создание отчёта...')
    const created = await api('POST', '/entity/commissionreportin', payload)
    const readback = await fetchAll(`/entity/commissionreportin/${created.id}/positions`)
    console.log(`  Готово: ${created.name} | id=${created.id} | сумма ${money(created.sum)} AED | строк ${readback.length}`)
    console.log(
      `  UI: https://online.moysklad.ru/app/#commissionreport/edit?id=${created.id}`
    )
  }
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
