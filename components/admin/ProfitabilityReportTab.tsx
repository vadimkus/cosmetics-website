'use client'

import { useMemo, useState } from 'react'
import {
  AlertCircle,
  BarChart3,
  Calendar,
  Coins,
  Package,
  RefreshCw,
  ShoppingCart,
  TrendingDown,
  TrendingUp,
  Users,
} from 'lucide-react'
import { addCsrfToBody } from '@/lib/csrfClient'
import { errorLog } from '@/lib/logger'

type MoneyMetric = {
  netSales: number
  cogs: number
  grossProfit: number
  grossMarginPct: number
  salesCount: number
  averageCheck: number
  cashCollected: number
  cashPaid: number
  cashNet: number
  goodsPurchasesPaid: number
  taxPaid: number
  operatingCashCosts: number
  estimatedOperatingProfitBeforeTax: number
}

type Period = {
  from: string
  to: string
  label: string
}

type CategoryRow = {
  category: string
  netSales: number
  grossProfit: number
  grossMarginPct: number
  quantity: number
}

type ProductRow = {
  code: string
  name: string
  quantity: number
  netSales: number
  grossProfit: number
  grossMarginPct: number
}

type CustomerRow = {
  name: string
  salesCount: number
  netSales: number
  grossProfit: number
  grossMarginPct: number
  averageCheck: number
}

type ExpenseRow = {
  name: string
  count: number
  amount: number
}

type PaymentRow = {
  date: string
  number: string
  agent: string
  expense: string
  description: string
  amount: number
}

type Comparison = {
  label: string
  period: Period
  summary: MoneyMetric
  changes: {
    netSalesPct: number | null
    grossProfitPct: number | null
    grossMarginDelta: number
    salesCountPct: number | null
    averageCheckPct: number | null
  }
}

type ProfitabilityReport = {
  generatedAt: string
  primary: {
    period: Period
    summary: MoneyMetric
    categories: CategoryRow[]
    topProducts: ProductRow[]
    topCustomers: CustomerRow[]
    expenses: ExpenseRow[]
    topPayments: PaymentRow[]
  }
  comparisons: Comparison[]
}

interface ProfitabilityReportTabProps {
  getAdminHeaders: () => HeadersInit
  showToast: (message: string, type?: 'success' | 'error' | 'warning') => void
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10)
}

function monthStartIso(dateIso: string): string {
  return `${dateIso.slice(0, 8)}01`
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: 'AED',
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-AE', { maximumFractionDigits: 1 }).format(value)
}

function formatDateTime(value: string): string {
  return new Date(value).toLocaleString('en-AE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatChange(value: number | null, suffix = '%'): string {
  if (value === null) return 'n/a'
  const sign = value > 0 ? '+' : ''
  return `${sign}${value.toFixed(1)}${suffix}`
}

function changeClass(value: number | null): string {
  if (value === null) return 'text-gray-500'
  return value >= 0 ? 'text-green-600' : 'text-red-600'
}

function MetricCard({
  title,
  value,
  subtitle,
  icon,
  tone = 'blue',
}: {
  title: string
  value: string
  subtitle?: string
  icon: React.ReactNode
  tone?: 'blue' | 'green' | 'purple' | 'orange' | 'red'
}) {
  const toneClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    orange: 'bg-orange-50 text-orange-600 border-orange-200',
    red: 'bg-red-50 text-red-600 border-red-200',
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2.5 rounded-lg border ${toneClasses[tone]}`}>{icon}</div>
      </div>
      <p className="text-xs md:text-sm font-medium text-gray-600 mb-1">{title}</p>
      <p className="text-2xl md:text-3xl font-bold text-gray-900">{value}</p>
      {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-lg bg-blue-50 text-blue-600 border border-blue-200">
          <BarChart3 className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Generate a MoySklad profitability report</h3>
          <p className="text-sm text-gray-600 mt-2 max-w-3xl">
            This report uses MoySklad profit data, not only website orders. It includes B2B/manual sales, sell cost, gross
            profit, margin, payments, top products, categories and customers.
          </p>
          <p className="text-xs text-gray-500 mt-3">
            Tip: for month-end reviews, choose the month start and today/month end, then press Generate Report.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function ProfitabilityReportTab({ getAdminHeaders, showToast }: ProfitabilityReportTabProps) {
  const initialToday = useMemo(() => todayIso(), [])
  const [from, setFrom] = useState(() => monthStartIso(initialToday))
  const [to, setTo] = useState(initialToday)
  const [report, setReport] = useState<ProfitabilityReport | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateReport = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/admin/reports/profitability', {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify(addCsrfToBody({ from, to })),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok || !data?.success) {
        const message = data?.error || 'Failed to generate profitability report'
        setError(message)
        showToast(message, 'error')
        return
      }

      setReport(data.report as ProfitabilityReport)
      showToast('Profitability report generated', 'success')
    } catch (caught) {
      errorLog('[PROFITABILITY_TAB] Generate report failed:', caught)
      const message = caught instanceof Error ? caught.message : 'Failed to generate profitability report'
      setError(message)
      showToast(message, 'error')
    } finally {
      setLoading(false)
    }
  }

  const setCurrentMonth = () => {
    const current = todayIso()
    setFrom(monthStartIso(current))
    setTo(current)
  }

  const setPreviousMonth = () => {
    const current = new Date(`${todayIso()}T00:00:00.000Z`)
    const firstOfThisMonth = new Date(Date.UTC(current.getUTCFullYear(), current.getUTCMonth(), 1))
    const lastOfPreviousMonth = new Date(firstOfThisMonth)
    lastOfPreviousMonth.setUTCDate(0)
    const firstOfPreviousMonth = new Date(Date.UTC(lastOfPreviousMonth.getUTCFullYear(), lastOfPreviousMonth.getUTCMonth(), 1))
    setFrom(firstOfPreviousMonth.toISOString().slice(0, 10))
    setTo(lastOfPreviousMonth.toISOString().slice(0, 10))
  }

  const summary = report?.primary.summary

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Profitability Report</h2>
          <p className="text-sm text-gray-500 mt-1">MoySklad net sales, COGS, gross profit, margin, cash and customer/product mix</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-3 md:p-4 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-3">
            <label className="text-xs font-medium text-gray-600">
              From
              <input
                type="date"
                value={from}
                onChange={(event) => setFrom(event.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </label>
            <label className="text-xs font-medium text-gray-600">
              To
              <input
                type="date"
                value={to}
                onChange={(event) => setTo(event.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </label>
            <button
              onClick={generateReport}
              disabled={loading}
              className="self-end flex items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Generating...' : 'Generate Report'}
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <button onClick={setCurrentMonth} className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200">
              Current month
            </button>
            <button onClick={setPreviousMonth} className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200">
              Previous month
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <div>
            <p className="font-semibold">Report generation failed</p>
            <p>{error}</p>
          </div>
        </div>
      )}

      {!report && !loading && <EmptyState />}

      {summary && report && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <MetricCard
              title="Net Sales"
              value={formatCurrency(summary.netSales)}
              subtitle={`${report.primary.period.from} to ${report.primary.period.to}`}
              icon={<Coins className="h-5 w-5" />}
              tone="green"
            />
            <MetricCard
              title="Gross Profit"
              value={formatCurrency(summary.grossProfit)}
              subtitle={`${summary.grossMarginPct.toFixed(1)}% gross margin`}
              icon={<TrendingUp className="h-5 w-5" />}
              tone="green"
            />
            <MetricCard
              title="Sales Count"
              value={formatNumber(summary.salesCount)}
              subtitle={`${formatCurrency(summary.averageCheck)} average check`}
              icon={<ShoppingCart className="h-5 w-5" />}
              tone="blue"
            />
            <MetricCard
              title="Operating Profit Read"
              value={formatCurrency(summary.estimatedOperatingProfitBeforeTax)}
              subtitle="Before treating tax remittance as period cost"
              icon={<BarChart3 className="h-5 w-5" />}
              tone={summary.estimatedOperatingProfitBeforeTax >= 0 ? 'purple' : 'red'}
            />
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
            <div className="flex items-center justify-between gap-3 mb-4">
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Comparisons
              </h3>
              <p className="text-xs text-gray-500">Generated {formatDateTime(report.generatedAt)}</p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Comparison</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Net Sales</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gross Profit</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Margin Delta</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sales Count</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Average Check</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {report.comparisons.map((comparison) => (
                    <tr key={comparison.label}>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {comparison.label}
                        <div className="text-xs text-gray-500">{comparison.period.from} to {comparison.period.to}</div>
                      </td>
                      <td className={`px-4 py-3 text-sm font-semibold ${changeClass(comparison.changes.netSalesPct)}`}>
                        {formatChange(comparison.changes.netSalesPct)}
                      </td>
                      <td className={`px-4 py-3 text-sm font-semibold ${changeClass(comparison.changes.grossProfitPct)}`}>
                        {formatChange(comparison.changes.grossProfitPct)}
                      </td>
                      <td className={`px-4 py-3 text-sm font-semibold ${changeClass(comparison.changes.grossMarginDelta)}`}>
                        {formatChange(comparison.changes.grossMarginDelta, ' pp')}
                      </td>
                      <td className={`px-4 py-3 text-sm font-semibold ${changeClass(comparison.changes.salesCountPct)}`}>
                        {formatChange(comparison.changes.salesCountPct)}
                      </td>
                      <td className={`px-4 py-3 text-sm font-semibold ${changeClass(comparison.changes.averageCheckPct)}`}>
                        {formatChange(comparison.changes.averageCheckPct)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Coins className="h-5 w-5" />
                Profitability View
              </h3>
              <div className="space-y-3 text-sm">
                {[
                  ['Net sales', summary.netSales],
                  ['COGS / sell cost', summary.cogs],
                  ['Gross profit', summary.grossProfit],
                  ['Cash collected', summary.cashCollected],
                  ['Cash paid', summary.cashPaid],
                  ['Goods purchases paid', summary.goodsPurchasesPaid],
                  ['Tax paid', summary.taxPaid],
                  ['Operating cash costs', summary.operatingCashCosts],
                  ['Cash net', summary.cashNet],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between border-b border-gray-100 pb-2 last:border-0">
                    <span className="text-gray-600">{label}</span>
                    <span className="font-semibold text-gray-900">{formatCurrency(Number(value))}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingDown className="h-5 w-5" />
                Expense Breakdown
              </h3>
              <div className="space-y-3 text-sm">
                {report.primary.expenses.slice(0, 8).map((expense) => (
                  <div key={expense.name} className="flex items-center justify-between border-b border-gray-100 pb-2 last:border-0">
                    <span className="text-gray-600">{expense.name} <span className="text-xs text-gray-400">({expense.count})</span></span>
                    <span className="font-semibold text-gray-900">{formatCurrency(expense.amount)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Package className="h-5 w-5" />
              Category Mix
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sales</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gross Profit</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Margin</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {report.primary.categories.map((category) => (
                    <tr key={category.category} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{category.category}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(category.netSales)}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(category.grossProfit)}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{category.grossMarginPct.toFixed(1)}%</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{formatNumber(category.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Package className="h-5 w-5" />
                Top Products
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sales</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Profit</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {report.primary.topProducts.slice(0, 10).map((product) => (
                      <tr key={`${product.code}-${product.name}`} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {product.name}
                          {product.code && <div className="text-xs text-gray-500">{product.code}</div>}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">{formatNumber(product.quantity)}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(product.netSales)}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(product.grossProfit)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="h-5 w-5" />
                Top Customers
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sales</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Profit</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Count</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {report.primary.topCustomers.slice(0, 10).map((customer) => (
                      <tr key={customer.name} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {customer.name}
                          <div className="text-xs text-gray-500">{formatCurrency(customer.averageCheck)} avg check</div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(customer.netSales)}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(customer.grossProfit)}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{customer.salesCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Outgoing Payments</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Agent</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expense</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {report.primary.topPayments.map((payment) => (
                    <tr key={`${payment.number}-${payment.amount}`} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-500">{payment.date}</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{payment.agent}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{payment.expense}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(payment.amount)}</td>
                      <td className="px-4 py-3 text-sm text-gray-500 max-w-xs truncate">{payment.description || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
