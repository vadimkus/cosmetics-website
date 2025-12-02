'use client'
import { useState, useEffect, useCallback } from 'react'
import { 
  RefreshCw, 
  TrendingUp,
  Coins,
  ShoppingCart,
  Users,
  Package,
  Calendar,
  BarChart3,
  PieChart,
  LineChart,
  Filter,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import { errorLog } from '@/lib/logger'

interface SalesReport {
  totalRevenue: number
  totalOrders: number
  averageOrderValue: number
  revenueByDay: Array<{ date: string; revenue: number; orders: number }>
  revenueByMonth: Array<{ month: string; revenue: number; orders: number }>
  revenueByStatus: Array<{ status: string; revenue: number; orders: number }>
  topProducts: Array<{ productId: string; productName: string; revenue: number; quantity: number; orders: number }>
  topCustomers: Array<{ email: string; name: string; revenue: number; orders: number; lastOrderDate: string }>
}

interface RevenueTrend {
  period: string
  revenue: number
  orders: number
  averageOrderValue: number
  growth: number
}

interface ProductPerformance {
  productId: string
  productName: string
  category: string
  totalRevenue: number
  totalQuantity: number
  totalOrders: number
  averagePrice: number
  conversionRate: number
  views: number
}

interface CustomerLifetimeValue {
  email: string
  name: string
  totalRevenue: number
  totalOrders: number
  averageOrderValue: number
  firstOrderDate: string
  lastOrderDate: string
  daysSinceFirstOrder: number
  daysSinceLastOrder: number
  lifetimeValue: number
}

interface AdvancedReportingDashboardProps {
  onCustomerClick?: (userEmail: string) => void
  adminEmail?: string | undefined
}

type ReportType = 'sales' | 'revenue' | 'products' | 'customers'

const MetricCard = ({ 
  title, 
  value, 
  subtitle, 
  trend, 
  icon, 
  color = 'blue' 
}: { 
  title: string
  value: string | number
  subtitle?: string
  trend?: { value: number; isPositive: boolean }
  icon: React.ReactNode
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'indigo'
}) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    orange: 'bg-orange-50 text-orange-600 border-orange-200',
    red: 'bg-red-50 text-red-600 border-red-200',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-200'
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2.5 md:p-3 rounded-lg border ${colorClasses[color]}`}>
          {icon}
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {trend.isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {Math.abs(trend.value).toFixed(1)}%
          </div>
        )}
      </div>
      <div>
        <p className="text-xs md:text-sm font-medium text-gray-600 mb-1">{title}</p>
        <p className="text-2xl md:text-3xl font-bold text-gray-900">{value}</p>
        {subtitle && (
          <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  )
}

export default function AdvancedReportingDashboard({ onCustomerClick, adminEmail }: AdvancedReportingDashboardProps = {}) {
  const [activeReport, setActiveReport] = useState<ReportType>('sales')
  const [timeRange, setTimeRange] = useState<'7' | '30' | '90' | '365' | 'all'>('30')
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  
  const [salesReport, setSalesReport] = useState<SalesReport | null>(null)
  const [revenueTrends, setRevenueTrends] = useState<RevenueTrend[]>([])
  const [productPerformance, setProductPerformance] = useState<ProductPerformance[]>([])
  const [customerLifetimeValue, setCustomerLifetimeValue] = useState<CustomerLifetimeValue[]>([])

  const fetchSalesReport = useCallback(async () => {
    try {
      const adminEmailHeader = adminEmail || (typeof window !== 'undefined' && localStorage.getItem('admin_session') ? JSON.parse(localStorage.getItem('admin_session') || '{}').email : '')
      const response = await fetch(`/api/admin/reports/sales?days=${timeRange}`, {
        headers: adminEmailHeader ? {
          'X-Admin-Email': adminEmailHeader,
          'Content-Type': 'application/json'
        } : {
          'Content-Type': 'application/json'
        }
      })
      if (response.ok) {
        const data = await response.json()
        setSalesReport(data)
      } else {
        const errorData = await response.json().catch(() => ({}))
        errorLog('Error fetching sales report:', { status: response.status, error: errorData })
        setSalesReport(null)
      }
    } catch (error) {
      errorLog('Error fetching sales report:', error)
      setSalesReport(null)
    }
  }, [timeRange, adminEmail])

  const fetchRevenueTrends = useCallback(async () => {
    try {
      const adminEmailHeader = adminEmail || (typeof window !== 'undefined' && localStorage.getItem('admin_session') ? JSON.parse(localStorage.getItem('admin_session') || '{}').email : '')
      const response = await fetch(`/api/admin/reports/revenue-trends?days=${timeRange}`, {
        headers: adminEmailHeader ? {
          'X-Admin-Email': adminEmailHeader,
          'Content-Type': 'application/json'
        } : {
          'Content-Type': 'application/json'
        }
      })
      if (response.ok) {
        const data = await response.json()
        setRevenueTrends(data.trends || [])
      } else {
        errorLog('Error fetching revenue trends:', { status: response.status })
        setRevenueTrends([])
      }
    } catch (error) {
      errorLog('Error fetching revenue trends:', error)
      setRevenueTrends([])
    }
  }, [timeRange, adminEmail])

  const fetchProductPerformance = useCallback(async () => {
    try {
      const adminEmailHeader = adminEmail || (typeof window !== 'undefined' && localStorage.getItem('admin_session') ? JSON.parse(localStorage.getItem('admin_session') || '{}').email : '')
      const response = await fetch(`/api/admin/reports/product-performance?days=${timeRange}`, {
        headers: adminEmailHeader ? {
          'X-Admin-Email': adminEmailHeader,
          'Content-Type': 'application/json'
        } : {
          'Content-Type': 'application/json'
        }
      })
      if (response.ok) {
        const data = await response.json()
        setProductPerformance(data.products || [])
      } else {
        errorLog('Error fetching product performance:', { status: response.status })
        setProductPerformance([])
      }
    } catch (error) {
      errorLog('Error fetching product performance:', error)
      setProductPerformance([])
    }
  }, [timeRange, adminEmail])

  const fetchCustomerLifetimeValue = useCallback(async () => {
    try {
      const adminEmailHeader = adminEmail || (typeof window !== 'undefined' && localStorage.getItem('admin_session') ? JSON.parse(localStorage.getItem('admin_session') || '{}').email : '')
      const response = await fetch(`/api/admin/reports/customer-lifetime-value?days=${timeRange}`, {
        headers: adminEmailHeader ? {
          'X-Admin-Email': adminEmailHeader,
          'Content-Type': 'application/json'
        } : {
          'Content-Type': 'application/json'
        }
      })
      if (response.ok) {
        const data = await response.json()
        setCustomerLifetimeValue(data.customers || [])
      } else {
        errorLog('Error fetching customer lifetime value:', { status: response.status })
        setCustomerLifetimeValue([])
      }
    } catch (error) {
      errorLog('Error fetching customer lifetime value:', error)
      setCustomerLifetimeValue([])
    }
  }, [timeRange, adminEmail])

  const fetchAllReports = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }

      await Promise.all([
        fetchSalesReport(),
        fetchRevenueTrends(),
        fetchProductPerformance(),
        fetchCustomerLifetimeValue()
      ])
    } catch (error) {
      errorLog('Error fetching reports:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [fetchSalesReport, fetchRevenueTrends, fetchProductPerformance, fetchCustomerLifetimeValue])

  useEffect(() => {
    fetchAllReports()
  }, [fetchAllReports])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-AE', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const handleCustomerClick = (email: string) => {
    if (onCustomerClick) {
      onCustomerClick(email)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Advanced Reporting</h2>
          <p className="text-sm text-gray-500 mt-1">Detailed insights into sales, revenue, products, and customers</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as typeof timeRange)}
              className="pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white appearance-none"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last year</option>
              <option value="all">All time</option>
            </select>
          </div>
          <button
            onClick={() => fetchAllReports(true)}
            disabled={refreshing}
            className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* Report Type Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200">
        {([
          { id: 'sales' as const, label: 'Sales Report', icon: ShoppingCart },
          { id: 'revenue' as const, label: 'Revenue Trends', icon: TrendingUp },
          { id: 'products' as const, label: 'Product Performance', icon: Package },
          { id: 'customers' as const, label: 'Customer Lifetime Value', icon: Users }
        ] as const).map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveReport(id)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeReport === id
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* Sales Report */}
      {activeReport === 'sales' && salesReport && (
        <div className="space-y-4 md:space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Total Revenue"
              value={formatCurrency(salesReport.totalRevenue)}
              icon={<Coins className="h-5 w-5 md:h-6 md:w-6" />}
              color="green"
            />
            <MetricCard
              title="Total Orders"
              value={salesReport.totalOrders}
              icon={<ShoppingCart className="h-5 w-5 md:h-6 md:w-6" />}
              color="blue"
            />
            <MetricCard
              title="Average Order Value"
              value={formatCurrency(salesReport.averageOrderValue)}
              icon={<TrendingUp className="h-5 w-5 md:h-6 md:w-6" />}
              color="purple"
            />
            <MetricCard
              title="Orders per Day"
              value={(salesReport.totalOrders / (timeRange === 'all' ? 365 : Number(timeRange))).toFixed(1)}
              icon={<Calendar className="h-5 w-5 md:h-6 md:w-6" />}
              color="orange"
            />
          </div>

          {/* Revenue by Status */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
            <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 md:mb-6 flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Revenue by Order Status
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {salesReport.revenueByStatus.map((status) => (
                <div key={status.status} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="text-sm font-medium text-gray-600 mb-1">{status.status}</div>
                  <div className="text-xl font-bold text-gray-900">{formatCurrency(status.revenue)}</div>
                  <div className="text-xs text-gray-500 mt-1">{status.orders} orders</div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
            <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 md:mb-6 flex items-center gap-2">
              <Package className="h-5 w-5" />
              Top Products by Revenue
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {salesReport.topProducts.slice(0, 10).map((product) => (
                    <tr key={product.productId} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{product.productName}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{formatCurrency(product.revenue)}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{product.quantity}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{product.orders}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Customers */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
            <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 md:mb-6 flex items-center gap-2">
              <Users className="h-5 w-5" />
              Top Customers by Revenue
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Order</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {salesReport.topCustomers.slice(0, 10).map((customer) => (
                    <tr key={customer.email} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                        <button
                          onClick={() => handleCustomerClick(customer.email)}
                          className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {customer.email}
                        </button>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{formatCurrency(customer.revenue)}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{customer.orders}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{formatDate(customer.lastOrderDate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Revenue Trends */}
      {activeReport === 'revenue' && revenueTrends.length > 0 && (
        <div className="space-y-4 md:space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
            <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 md:mb-6 flex items-center gap-2">
              <LineChart className="h-5 w-5" />
              Revenue Trends Over Time
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Order Value</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Growth</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {revenueTrends.map((trend, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{trend.period}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{formatCurrency(trend.revenue)}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{trend.orders}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{formatCurrency(trend.averageOrderValue)}</td>
                      <td className={`px-4 py-3 whitespace-nowrap text-sm font-medium ${trend.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {trend.growth >= 0 ? '+' : ''}{trend.growth.toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Product Performance */}
      {activeReport === 'products' && productPerformance.length > 0 && (
        <div className="space-y-4 md:space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
            <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 md:mb-6 flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Product Performance Analysis
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Price</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conversion</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {productPerformance.map((product) => (
                    <tr key={product.productId} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{product.productName}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{formatCurrency(product.totalRevenue)}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{product.totalQuantity}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{product.totalOrders}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{formatCurrency(product.averagePrice)}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {product.conversionRate.toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Customer Lifetime Value */}
      {activeReport === 'customers' && customerLifetimeValue.length > 0 && (
        <div className="space-y-4 md:space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
            <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 md:mb-6 flex items-center gap-2">
              <Users className="h-5 w-5" />
              Customer Lifetime Value Analysis
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lifetime Value</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Revenue</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Order Value</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">First Order</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Order</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {customerLifetimeValue.map((customer) => (
                    <tr key={customer.email} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                        <button
                          onClick={() => handleCustomerClick(customer.email)}
                          className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {customer.email}
                        </button>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-green-600">{formatCurrency(customer.lifetimeValue)}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{formatCurrency(customer.totalRevenue)}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{customer.totalOrders}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{formatCurrency(customer.averageOrderValue)}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{formatDate(customer.firstOrderDate)}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{formatDate(customer.lastOrderDate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Empty States */}
      {activeReport === 'sales' && (!salesReport || salesReport.totalOrders === 0) && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <p className="text-gray-600">No sales data available for the selected time range.</p>
          <p className="text-sm text-gray-500 mt-2">
            {salesReport ? 'Try selecting a different time range or check if there are any orders in the system.' : 'Loading...'}
          </p>
        </div>
      )}

      {activeReport === 'revenue' && revenueTrends.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <p className="text-gray-600">No revenue trend data available for the selected time range.</p>
        </div>
      )}

      {activeReport === 'products' && productPerformance.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <p className="text-gray-600">No product performance data available for the selected time range.</p>
        </div>
      )}

      {activeReport === 'customers' && customerLifetimeValue.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <p className="text-gray-600">No customer lifetime value data available for the selected time range.</p>
        </div>
      )}
    </div>
  )
}

