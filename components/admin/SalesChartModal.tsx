'use client'

import { useState, useEffect } from 'react'
import { X, TrendingUp, ShoppingCart, DollarSign, Calendar } from 'lucide-react'
import { errorLog } from '@/lib/logger'

interface MonthlyData {
  month: string
  revenue: number
  orders: number
}

interface SalesChartModalProps {
  isOpen: boolean
  onClose: () => void
}

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export default function SalesChartModal({ isOpen, onClose }: SalesChartModalProps) {
  const [data, setData] = useState<MonthlyData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'orders' | 'revenue'>('orders')

  useEffect(() => {
    if (isOpen) {
      fetchSalesData()
    }
  }, [isOpen])

  const fetchSalesData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/admin/reports/sales?days=all', {
        credentials: 'include',
        headers: {
          'x-admin-email': localStorage.getItem('adminEmail') || ''
        }
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }
      
      const result = await response.json()
      setData(result.revenueByMonth || [])
    } catch (err) {
      errorLog('Error fetching sales data:', err)
      const message = err instanceof Error ? err.message : 'Failed to load sales data'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  // Calculate totals
  const totalOrders = data.reduce((sum, item) => sum + item.orders, 0)
  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0)
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

  // Get max value for chart scaling
  const maxValue = Math.max(...data.map(d => viewMode === 'orders' ? d.orders : d.revenue), 1)

  // Format month label (YYYY-MM to Month YYYY)
  const formatMonthLabel = (monthStr: string) => {
    const parts = monthStr.split('-')
    const year = parts[0] || ''
    const month = parts[1] || '01'
    const monthIndex = parseInt(month) - 1
    return `${MONTH_NAMES[monthIndex] || 'Jan'} ${year.slice(2)}`
  }

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-indigo-600">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Monthly Sales Report</h2>
                <p className="text-purple-100 text-sm">Orders and revenue by month</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={fetchSalesData}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Retry
                </button>
              </div>
            ) : (
              <>
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                    <div className="flex items-center gap-2 text-purple-600 mb-2">
                      <ShoppingCart className="h-5 w-5" />
                      <span className="text-sm font-medium">Total Orders</span>
                    </div>
                    <p className="text-3xl font-bold text-purple-900">{totalOrders}</p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                    <div className="flex items-center gap-2 text-green-600 mb-2">
                      <DollarSign className="h-5 w-5" />
                      <span className="text-sm font-medium">Total Revenue</span>
                    </div>
                    <p className="text-3xl font-bold text-green-900">{formatCurrency(totalRevenue)}</p>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                    <div className="flex items-center gap-2 text-blue-600 mb-2">
                      <Calendar className="h-5 w-5" />
                      <span className="text-sm font-medium">Avg Order Value</span>
                    </div>
                    <p className="text-3xl font-bold text-blue-900">{formatCurrency(avgOrderValue)}</p>
                  </div>
                </div>

                {/* View Toggle */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Monthly Breakdown</h3>
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('orders')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        viewMode === 'orders' 
                          ? 'bg-white text-purple-600 shadow-sm' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Orders
                    </button>
                    <button
                      onClick={() => setViewMode('revenue')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        viewMode === 'revenue' 
                          ? 'bg-white text-green-600 shadow-sm' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Revenue
                    </button>
                  </div>
                </div>

                {/* Bar Chart */}
                {data.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No sales data available yet</p>
                  </div>
                ) : (
                  <div className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-2xl p-6 border border-gray-200/50 shadow-inner">
                    {/* Chart Container */}
                    <div className="relative">
                      {/* Horizontal Grid Lines */}
                      <div className="absolute inset-0 left-14 right-4 flex flex-col justify-between pointer-events-none">
                        {[0, 1, 2, 3, 4].map((i) => (
                          <div key={i} className="border-t border-gray-200/60 border-dashed" />
                        ))}
                      </div>
                      
                      {/* Y-axis labels */}
                      <div className="absolute left-0 top-0 bottom-12 w-14 flex flex-col justify-between text-[11px] font-medium text-gray-400 pr-2 text-right">
                        <span>{viewMode === 'orders' ? maxValue : formatCurrency(maxValue)}</span>
                        <span>{viewMode === 'orders' ? Math.round(maxValue * 0.75) : formatCurrency(maxValue * 0.75)}</span>
                        <span>{viewMode === 'orders' ? Math.round(maxValue * 0.5) : formatCurrency(maxValue * 0.5)}</span>
                        <span>{viewMode === 'orders' ? Math.round(maxValue * 0.25) : formatCurrency(maxValue * 0.25)}</span>
                        <span>0</span>
                      </div>
                      
                      {/* Bars Container */}
                      <div className="ml-16 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                        <div className="flex items-end gap-4 min-w-max h-72 pb-12 pt-8 px-2">
                          {data.map((item, index) => {
                            const value = viewMode === 'orders' ? item.orders : item.revenue
                            const heightPercent = (value / maxValue) * 100
                            
                            return (
                              <div 
                                key={item.month} 
                                className="flex flex-col items-center group relative"
                                style={{ 
                                  animation: `slideUp 0.5s ease-out ${index * 0.1}s both`
                                }}
                              >
                                {/* Tooltip */}
                                <div className="opacity-0 group-hover:opacity-100 absolute -top-4 transform -translate-y-full bg-gray-900/95 backdrop-blur-sm text-white text-xs rounded-xl px-4 py-3 pointer-events-none z-20 whitespace-nowrap transition-all duration-200 shadow-xl scale-95 group-hover:scale-100">
                                  <div className="font-bold text-sm mb-1">{formatMonthLabel(item.month)}</div>
                                  <div className="flex items-center gap-2 text-purple-300">
                                    <ShoppingCart className="h-3 w-3" />
                                    <span>Orders: <span className="text-white font-semibold">{item.orders}</span></span>
                                  </div>
                                  <div className="flex items-center gap-2 text-green-300">
                                    <DollarSign className="h-3 w-3" />
                                    <span>Revenue: <span className="text-white font-semibold">{formatCurrency(item.revenue)}</span></span>
                                  </div>
                                  {/* Arrow */}
                                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-gray-900/95 rotate-45" />
                                </div>
                                
                                {/* Value Label */}
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:-translate-y-1">
                                  <span className={`text-sm font-bold px-2 py-1 rounded-lg shadow-lg ${
                                    viewMode === 'orders' 
                                      ? 'bg-purple-600 text-white' 
                                      : 'bg-emerald-600 text-white'
                                  }`}>
                                    {viewMode === 'orders' ? item.orders : formatCurrency(item.revenue)}
                                  </span>
                                </div>
                                
                                {/* Bar with Gradient */}
                                <div 
                                  className={`w-14 rounded-xl transition-all duration-300 relative overflow-hidden cursor-pointer
                                    ${viewMode === 'orders' 
                                      ? 'bg-gradient-to-t from-purple-600 via-purple-500 to-violet-400 hover:from-purple-700 hover:via-purple-600 hover:to-violet-500' 
                                      : 'bg-gradient-to-t from-emerald-600 via-emerald-500 to-teal-400 hover:from-emerald-700 hover:via-emerald-600 hover:to-teal-500'
                                    }
                                    hover:shadow-lg hover:scale-105 group-hover:shadow-xl
                                    ${viewMode === 'orders' ? 'hover:shadow-purple-300/50' : 'hover:shadow-emerald-300/50'}
                                  `}
                                  style={{ 
                                    height: `${Math.max(heightPercent, 4)}%`,
                                    minHeight: '16px'
                                  }}
                                >
                                  {/* Shine effect */}
                                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                                  
                                  {/* Top highlight */}
                                  <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-b from-white/30 to-transparent rounded-t-xl" />
                                  
                                  {/* Inner value */}
                                  {heightPercent > 25 && (
                                    <div className="absolute inset-x-0 bottom-2 text-center">
                                      <span className="text-white/90 text-xs font-bold drop-shadow-lg">
                                        {viewMode === 'orders' ? item.orders : ''}
                                      </span>
                                    </div>
                                  )}
                                </div>
                                
                                {/* Month Label */}
                                <div className="mt-3 text-center">
                                  <span className="text-xs font-semibold text-gray-600 group-hover:text-gray-900 transition-colors">
                                    {formatMonthLabel(item.month)}
                                  </span>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                    
                    {/* CSS Animation */}
                    <style jsx>{`
                      @keyframes slideUp {
                        from {
                          opacity: 0;
                          transform: translateY(20px);
                        }
                        to {
                          opacity: 1;
                          transform: translateY(0);
                        }
                      }
                    `}</style>
                  </div>
                )}

                {/* Data Table */}
                {data.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Detailed Data</h3>
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Month</th>
                            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Orders</th>
                            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Revenue</th>
                            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Avg Order</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {data.map((item) => (
                            <tr key={item.month} className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                {formatMonthLabel(item.month)}
                              </td>
                              <td className="px-4 py-3 text-sm text-right text-gray-700">
                                {item.orders}
                              </td>
                              <td className="px-4 py-3 text-sm text-right text-gray-700 font-medium">
                                {formatCurrency(item.revenue)}
                              </td>
                              <td className="px-4 py-3 text-sm text-right text-gray-500">
                                {item.orders > 0 ? formatCurrency(item.revenue / item.orders) : '-'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-gray-50 font-semibold">
                          <tr>
                            <td className="px-4 py-3 text-sm text-gray-900">Total</td>
                            <td className="px-4 py-3 text-sm text-right text-gray-900">{totalOrders}</td>
                            <td className="px-4 py-3 text-sm text-right text-gray-900">{formatCurrency(totalRevenue)}</td>
                            <td className="px-4 py-3 text-sm text-right text-gray-700">{formatCurrency(avgOrderValue)}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
