import { errorLog } from '@/lib/logger'

const MOYSKLAD_API = 'https://api.moysklad.ru/api/remap/1.2'
const PAGE_LIMIT = 1000

type MoySkladMeta = {
  href: string
  type?: string
}

type MetaRef = {
  meta?: MoySkladMeta
  name?: string
  code?: string
}

type RowsResponse<T> = {
  rows?: T[]
}

type ProfitByProductRow = {
  assortment?: MetaRef
  sellQuantity?: number
  sellSum?: number
  sellCostSum?: number
  returnQuantity?: number
  returnSum?: number
  returnCostSum?: number
  profit?: number
}

type ProfitByCounterpartyRow = {
  counterparty?: MetaRef
  salesCount?: number
  sellSum?: number
  sellCostSum?: number
  returnSum?: number
  returnCostSum?: number
  profit?: number
}

type ProfitByEmployeeRow = {
  employee?: MetaRef
  salesCount?: number
  sellSum?: number
  sellCostSum?: number
  returnSum?: number
  returnCostSum?: number
  profit?: number
}

type MoySkladDocument = {
  name?: string
  moment?: string
  sum?: number
  description?: string
  agent?: MetaRef
  expenseItem?: MetaRef
}

type ResolvedPayment = {
  date: string
  number: string
  agent: string
  expense: string
  description: string
  amount: number
}

export type ProfitabilityPeriod = {
  from: string
  to: string
  label: string
}

export type ProfitabilitySummary = {
  netSales: number
  cogs: number
  grossProfit: number
  grossMarginPct: number
  salesCount: number
  averageCheck: number
  productNetSales: number
  productGrossProfit: number
  productQuantity: number
  cashCollected: number
  cashPaid: number
  cashNet: number
  goodsPurchasesPaid: number
  taxPaid: number
  operatingCashCosts: number
  estimatedOperatingProfitBeforeTax: number
}

export type ProfitabilityCategory = {
  category: string
  netSales: number
  cogs: number
  grossProfit: number
  grossMarginPct: number
  quantity: number
}

export type ProfitabilityProduct = {
  code: string
  name: string
  quantity: number
  netSales: number
  cogs: number
  grossProfit: number
  grossMarginPct: number
}

export type ProfitabilityCustomer = {
  name: string
  salesCount: number
  netSales: number
  grossProfit: number
  grossMarginPct: number
  averageCheck: number
}

export type ProfitabilityExpense = {
  name: string
  count: number
  amount: number
}

export type ProfitabilityDocs = {
  demands: { count: number; amount: number }
  customerOrders: { count: number; amount: number }
  invoiceOut: { count: number; amount: number }
  salesReturns: { count: number; amount: number }
  paymentIn: { count: number; amount: number }
  cashIn: { count: number; amount: number }
  paymentOut: { count: number; amount: number }
  cashOut: { count: number; amount: number }
  supply: { count: number; amount: number }
  invoiceIn: { count: number; amount: number }
}

export type ProfitabilityPeriodReport = {
  period: ProfitabilityPeriod
  summary: ProfitabilitySummary
  docs: ProfitabilityDocs
  categories: ProfitabilityCategory[]
  topProducts: ProfitabilityProduct[]
  topCustomers: ProfitabilityCustomer[]
  employees: Array<{ name: string; salesCount: number; netSales: number; grossProfit: number; grossMarginPct: number }>
  expenses: ProfitabilityExpense[]
  topPayments: ResolvedPayment[]
}

export type ProfitabilityComparison = {
  label: string
  period: ProfitabilityPeriod
  summary: ProfitabilitySummary
  changes: {
    netSalesPct: number | null
    grossProfitPct: number | null
    grossMarginDelta: number
    salesCountPct: number | null
    averageCheckPct: number | null
  }
}

export type ProfitabilityReport = {
  generatedAt: string
  primary: ProfitabilityPeriodReport
  comparisons: ProfitabilityComparison[]
}

function getAuthHeader(): string {
  const login = process.env.MOYSKLAD_LOGIN?.trim()
  const password = process.env.MOYSKLAD_PASSWORD?.trim()
  if (!login || !password) {
    throw new Error('MoySklad credentials are not configured')
  }
  return `Basic ${Buffer.from(`${login}:${password}`).toString('base64')}`
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function moySkladGet<T>(path: string, attempt = 1): Promise<T> {
  const url = path.startsWith('http') ? path : `${MOYSKLAD_API}${path}`
  const response = await fetch(url, {
    headers: {
      Authorization: getAuthHeader(),
      Accept: 'application/json;charset=utf-8',
      'Accept-Encoding': 'gzip',
    },
  })

  const text = await response.text()

  if (!response.ok) {
    if ((response.status === 429 || response.status >= 500) && attempt < 6) {
      await sleep(700 * attempt)
      return moySkladGet<T>(path, attempt + 1)
    }
    errorLog('[MOYSKLAD_PROFITABILITY] API error:', response.status, text.slice(0, 500))
    throw new Error(`MoySklad API returned ${response.status}`)
  }

  await sleep(100)
  return text ? (JSON.parse(text) as T) : ({} as T)
}

async function fetchAllRows<T>(path: string): Promise<T[]> {
  const rows: T[] = []
  let offset = 0

  while (true) {
    const separator = path.includes('?') ? '&' : '?'
    const page = await moySkladGet<RowsResponse<T>>(`${path}${separator}limit=${PAGE_LIMIT}&offset=${offset}`)
    const pageRows = page.rows ?? []
    rows.push(...pageRows)

    if (pageRows.length < PAGE_LIMIT) break
    offset += PAGE_LIMIT
  }

  return rows
}

function cents(value: number | undefined): number {
  return (value ?? 0) / 100
}

function roundMoney(value: number): number {
  return Number(value.toFixed(2))
}

function roundPct(value: number): number {
  if (!Number.isFinite(value)) return 0
  return Number((value * 100).toFixed(1))
}

function percentChange(current: number, previous: number): number | null {
  if (!previous) return null
  return Number((((current - previous) / previous) * 100).toFixed(1))
}

function sumCents<T>(rows: T[], selector: (row: T) => number | undefined): number {
  return rows.reduce((total, row) => total + cents(selector(row)), 0)
}

function sumNumber<T>(rows: T[], selector: (row: T) => number | undefined): number {
  return rows.reduce((total, row) => total + (selector(row) ?? 0), 0)
}

function netSales(row: { sellSum?: number; returnSum?: number }): number {
  return cents(row.sellSum) - cents(row.returnSum)
}

function netCost(row: { sellCostSum?: number; returnCostSum?: number }): number {
  return cents(row.sellCostSum) - cents(row.returnCostSum)
}

function formatMoment(date: string, endOfDay: boolean): string {
  return `${date} ${endOfDay ? '23:59:59' : '00:00:00'}`
}

function dateLabel(from: string, to: string): string {
  return `${from} to ${to}`
}

function addMonths(date: string, months: number): string {
  const [yearRaw, monthRaw, dayRaw] = date.split('-')
  const year = Number(yearRaw)
  const month = Number(monthRaw)
  const day = Number(dayRaw)
  const base = new Date(Date.UTC(year, month - 1 + months, 1))
  const maxDay = new Date(Date.UTC(base.getUTCFullYear(), base.getUTCMonth() + 1, 0)).getUTCDate()
  base.setUTCDate(Math.min(day, maxDay))
  return base.toISOString().slice(0, 10)
}

function addYears(date: string, years: number): string {
  const [yearRaw, monthRaw, dayRaw] = date.split('-')
  const year = Number(yearRaw)
  const month = Number(monthRaw)
  const day = Number(dayRaw)
  const base = new Date(Date.UTC(year + years, month - 1, 1))
  const maxDay = new Date(Date.UTC(base.getUTCFullYear(), base.getUTCMonth() + 1, 0)).getUTCDate()
  base.setUTCDate(Math.min(day, maxDay))
  return base.toISOString().slice(0, 10)
}

function isService(row: ProfitByProductRow): boolean {
  return row.assortment?.meta?.type === 'service'
}

function entityName(ref: MetaRef | undefined): string {
  return ref?.name || '(unknown)'
}

function classifyProduct(name: string): string {
  const normalized = name.toLowerCase()
  if (/delivery|shipping/.test(normalized)) return 'Delivery / service'
  if (/sun|spf|shield/.test(normalized)) return 'SPF'
  if (/mask|patch|co2|modeling/.test(normalized)) return 'Masks'
  if (/serum|solution|ampoule/.test(normalized)) return 'Serums'
  if (/cream|balm|bb|cushion/.test(normalized)) return 'Creams / BB'
  if (/cleanser|toner|mist|remover|peeling/.test(normalized)) return 'Cleanse / tone / peel'
  if (/hair|matrix|scalp|mesopecia|hr/.test(normalized)) return 'Hair'
  return 'Other'
}

function summarizeCounterparties(rows: ProfitByCounterpartyRow[]): Pick<ProfitabilitySummary, 'netSales' | 'cogs' | 'grossProfit' | 'grossMarginPct' | 'salesCount' | 'averageCheck'> {
  const netSalesTotal = sumCents(rows, (row) => row.sellSum) - sumCents(rows, (row) => row.returnSum)
  const costTotal = sumCents(rows, (row) => row.sellCostSum) - sumCents(rows, (row) => row.returnCostSum)
  const profitTotal = sumCents(rows, (row) => row.profit)
  const salesCount = Math.round(sumNumber(rows, (row) => row.salesCount))

  return {
    netSales: roundMoney(netSalesTotal),
    cogs: roundMoney(costTotal),
    grossProfit: roundMoney(profitTotal),
    grossMarginPct: roundPct(profitTotal / netSalesTotal),
    salesCount,
    averageCheck: salesCount ? roundMoney(netSalesTotal / salesCount) : 0,
  }
}

function summarizeProducts(rows: ProfitByProductRow[]): Pick<ProfitabilitySummary, 'productNetSales' | 'productGrossProfit' | 'productQuantity'> {
  const productRows = rows.filter((row) => !isService(row))
  return {
    productNetSales: roundMoney(sumCents(productRows, (row) => row.sellSum) - sumCents(productRows, (row) => row.returnSum)),
    productGrossProfit: roundMoney(sumCents(productRows, (row) => row.profit)),
    productQuantity: Number(
      productRows
        .reduce((total, row) => total + (row.sellQuantity ?? 0) - (row.returnQuantity ?? 0), 0)
        .toFixed(1)
    ),
  }
}

function buildDocSummary(rows: MoySkladDocument[]): { count: number; amount: number } {
  return {
    count: rows.length,
    amount: roundMoney(rows.reduce((total, row) => total + cents(row.sum), 0)),
  }
}

function buildCategories(rows: ProfitByProductRow[]): ProfitabilityCategory[] {
  const grouped = new Map<string, { netSales: number; cogs: number; grossProfit: number; quantity: number }>()

  for (const row of rows) {
    const name = entityName(row.assortment)
    const category = classifyProduct(name)
    const current = grouped.get(category) ?? { netSales: 0, cogs: 0, grossProfit: 0, quantity: 0 }
    current.netSales += netSales(row)
    current.cogs += netCost(row)
    current.grossProfit += cents(row.profit)
    current.quantity += (row.sellQuantity ?? 0) - (row.returnQuantity ?? 0)
    grouped.set(category, current)
  }

  return Array.from(grouped.entries())
    .map(([category, value]) => ({
      category,
      netSales: roundMoney(value.netSales),
      cogs: roundMoney(value.cogs),
      grossProfit: roundMoney(value.grossProfit),
      grossMarginPct: roundPct(value.grossProfit / value.netSales),
      quantity: Number(value.quantity.toFixed(1)),
    }))
    .sort((a, b) => b.netSales - a.netSales)
}

function buildTopProducts(rows: ProfitByProductRow[]): ProfitabilityProduct[] {
  return rows
    .filter((row) => !isService(row))
    .map((row) => {
      const sales = netSales(row)
      const profit = cents(row.profit)
      return {
        code: row.assortment?.code ?? '',
        name: entityName(row.assortment),
        quantity: Number(((row.sellQuantity ?? 0) - (row.returnQuantity ?? 0)).toFixed(1)),
        netSales: roundMoney(sales),
        cogs: roundMoney(netCost(row)),
        grossProfit: roundMoney(profit),
        grossMarginPct: roundPct(profit / sales),
      }
    })
    .sort((a, b) => b.netSales - a.netSales)
    .slice(0, 20)
}

function buildTopCustomers(rows: ProfitByCounterpartyRow[]): ProfitabilityCustomer[] {
  return rows
    .map((row) => {
      const sales = netSales(row)
      const profit = cents(row.profit)
      const salesCount = row.salesCount ?? 0
      return {
        name: entityName(row.counterparty),
        salesCount,
        netSales: roundMoney(sales),
        grossProfit: roundMoney(profit),
        grossMarginPct: roundPct(profit / sales),
        averageCheck: salesCount ? roundMoney(sales / salesCount) : 0,
      }
    })
    .sort((a, b) => b.netSales - a.netSales)
    .slice(0, 20)
}

function buildEmployees(rows: ProfitByEmployeeRow[]): ProfitabilityPeriodReport['employees'] {
  return rows
    .map((row) => {
      const sales = netSales(row)
      const profit = cents(row.profit)
      return {
        name: entityName(row.employee),
        salesCount: row.salesCount ?? 0,
        netSales: roundMoney(sales),
        grossProfit: roundMoney(profit),
        grossMarginPct: roundPct(profit / sales),
      }
    })
    .sort((a, b) => b.netSales - a.netSales)
}

async function resolveName(ref: MetaRef | undefined, cache: Map<string, string>): Promise<string> {
  if (ref?.name) return ref.name
  const href = ref?.meta?.href
  if (!href) return '(unknown)'
  const cached = cache.get(href)
  if (cached) return cached
  const data = await moySkladGet<MetaRef>(href)
  const name = data.name || '(unknown)'
  cache.set(href, name)
  return name
}

async function resolvePayments(rows: MoySkladDocument[]): Promise<ResolvedPayment[]> {
  const cache = new Map<string, string>()
  const payments: ResolvedPayment[] = []

  for (const row of rows) {
    payments.push({
      date: (row.moment ?? '').slice(0, 10),
      number: row.name ?? '',
      agent: await resolveName(row.agent, cache),
      expense: await resolveName(row.expenseItem, cache),
      description: row.description ?? '',
      amount: roundMoney(cents(row.sum)),
    })
  }

  return payments.sort((a, b) => b.amount - a.amount)
}

function isGoodsPurchase(payment: ResolvedPayment): boolean {
  return /закупка товаров|goods purchase|purchase/i.test(payment.expense)
}

function isTaxPayment(payment: ResolvedPayment): boolean {
  return /налоги|tax/i.test(`${payment.expense} ${payment.description}`)
}

function buildExpenses(payments: ResolvedPayment[]): ProfitabilityExpense[] {
  const grouped = new Map<string, { count: number; amount: number }>()

  for (const payment of payments) {
    const current = grouped.get(payment.expense) ?? { count: 0, amount: 0 }
    current.count += 1
    current.amount += payment.amount
    grouped.set(payment.expense, current)
  }

  return Array.from(grouped.entries())
    .map(([name, value]) => ({
      name,
      count: value.count,
      amount: roundMoney(value.amount),
    }))
    .sort((a, b) => b.amount - a.amount)
}

async function fetchDocuments(endpoint: string, fromMoment: string, toMoment: string): Promise<MoySkladDocument[]> {
  const filter = `moment>=${fromMoment};moment<=${toMoment}`
  return fetchAllRows<MoySkladDocument>(`/entity/${endpoint}?filter=${encodeURIComponent(filter)}&order=moment,asc`)
}

async function buildPeriodReport(period: ProfitabilityPeriod): Promise<ProfitabilityPeriodReport> {
  const fromMoment = formatMoment(period.from, false)
  const toMoment = formatMoment(period.to, true)
  const momentParams = `momentFrom=${encodeURIComponent(fromMoment)}&momentTo=${encodeURIComponent(toMoment)}`

  const [byProduct, byCounterparty, byEmployee] = await Promise.all([
    fetchAllRows<ProfitByProductRow>(`/report/profit/byproduct?${momentParams}`),
    fetchAllRows<ProfitByCounterpartyRow>(`/report/profit/bycounterparty?${momentParams}`),
    fetchAllRows<ProfitByEmployeeRow>(`/report/profit/byemployee?${momentParams}`),
  ])

  const [
    demands,
    customerOrders,
    invoiceOut,
    salesReturns,
    paymentIn,
    cashIn,
    paymentOut,
    cashOut,
    supply,
    invoiceIn,
  ] = await Promise.all([
    fetchDocuments('demand', fromMoment, toMoment),
    fetchDocuments('customerorder', fromMoment, toMoment),
    fetchDocuments('invoiceout', fromMoment, toMoment),
    fetchDocuments('salesreturn', fromMoment, toMoment),
    fetchDocuments('paymentin', fromMoment, toMoment),
    fetchDocuments('cashin', fromMoment, toMoment),
    fetchDocuments('paymentout', fromMoment, toMoment),
    fetchDocuments('cashout', fromMoment, toMoment),
    fetchDocuments('supply', fromMoment, toMoment),
    fetchDocuments('invoicein', fromMoment, toMoment),
  ])

  const outgoingPayments = await resolvePayments([...paymentOut, ...cashOut])
  const expenses = buildExpenses(outgoingPayments)
  const cashCollected = buildDocSummary(paymentIn).amount + buildDocSummary(cashIn).amount
  const cashPaid = buildDocSummary(paymentOut).amount + buildDocSummary(cashOut).amount
  const goodsPurchasesPaid = outgoingPayments.filter(isGoodsPurchase).reduce((total, payment) => total + payment.amount, 0)
  const taxPaid = outgoingPayments.filter(isTaxPayment).reduce((total, payment) => total + payment.amount, 0)
  const operatingCashCosts = cashPaid - goodsPurchasesPaid - taxPaid
  const counterpartySummary = summarizeCounterparties(byCounterparty)
  const productSummary = summarizeProducts(byProduct)

  return {
    period,
    summary: {
      ...counterpartySummary,
      ...productSummary,
      cashCollected: roundMoney(cashCollected),
      cashPaid: roundMoney(cashPaid),
      cashNet: roundMoney(cashCollected - cashPaid),
      goodsPurchasesPaid: roundMoney(goodsPurchasesPaid),
      taxPaid: roundMoney(taxPaid),
      operatingCashCosts: roundMoney(operatingCashCosts),
      estimatedOperatingProfitBeforeTax: roundMoney(counterpartySummary.grossProfit - operatingCashCosts),
    },
    docs: {
      demands: buildDocSummary(demands),
      customerOrders: buildDocSummary(customerOrders),
      invoiceOut: buildDocSummary(invoiceOut),
      salesReturns: buildDocSummary(salesReturns),
      paymentIn: buildDocSummary(paymentIn),
      cashIn: buildDocSummary(cashIn),
      paymentOut: buildDocSummary(paymentOut),
      cashOut: buildDocSummary(cashOut),
      supply: buildDocSummary(supply),
      invoiceIn: buildDocSummary(invoiceIn),
    },
    categories: buildCategories(byProduct),
    topProducts: buildTopProducts(byProduct),
    topCustomers: buildTopCustomers(byCounterparty),
    employees: buildEmployees(byEmployee),
    expenses,
    topPayments: outgoingPayments.slice(0, 12),
  }
}

function buildComparison(label: string, current: ProfitabilityPeriodReport, comparison: ProfitabilityPeriodReport): ProfitabilityComparison {
  return {
    label,
    period: comparison.period,
    summary: comparison.summary,
    changes: {
      netSalesPct: percentChange(current.summary.netSales, comparison.summary.netSales),
      grossProfitPct: percentChange(current.summary.grossProfit, comparison.summary.grossProfit),
      grossMarginDelta: Number((current.summary.grossMarginPct - comparison.summary.grossMarginPct).toFixed(1)),
      salesCountPct: percentChange(current.summary.salesCount, comparison.summary.salesCount),
      averageCheckPct: percentChange(current.summary.averageCheck, comparison.summary.averageCheck),
    },
  }
}

export async function generateProfitabilityReport(from: string, to: string): Promise<ProfitabilityReport> {
  const primaryPeriod: ProfitabilityPeriod = { from, to, label: dateLabel(from, to) }
  const previousMonthPeriod: ProfitabilityPeriod = {
    from: addMonths(from, -1),
    to: addMonths(to, -1),
    label: 'Previous month like-for-like',
  }
  const previousYearPeriod: ProfitabilityPeriod = {
    from: addYears(from, -1),
    to: addYears(to, -1),
    label: 'Same period last year',
  }

  const primary = await buildPeriodReport(primaryPeriod)
  const previousMonth = await buildPeriodReport(previousMonthPeriod)
  const previousYear = await buildPeriodReport(previousYearPeriod)

  return {
    generatedAt: new Date().toISOString(),
    primary,
    comparisons: [
      buildComparison('Previous month like-for-like', primary, previousMonth),
      buildComparison('Same period last year', primary, previousYear),
    ],
  }
}
