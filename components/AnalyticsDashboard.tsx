'use client'
import { errorLog } from '@/lib/logger'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { 
  RefreshCw, 
  Users, 
  Eye, 
  ShoppingCart, 
  TrendingUp,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  Download,
  FileText,
  Clock,
  BarChart3,
  MapPin,
  Activity,
  Coins,
  ArrowUpRight,
  ArrowDownRight,
  Filter
} from 'lucide-react'
import SalesChartModal from './admin/SalesChartModal'

interface AnalyticsData {
  totalVisitors: number
  totalPageViews: number
  uniqueVisitors: number
  topPages: Array<{ page: string; views: number }>
  topCountries: Array<{ country: string; visitors: number }>
  topCities: Array<{ city: string; country: string; visitors: number }>
  deviceAnalytics: {
    mobile: number
    tablet: number
    desktop: number
    topBrowsers: Array<{ browser: string; count: number }>
    topOS: Array<{ os: string; count: number }>
  }
  uxMetrics: {
    bounceRate: number
    avgSessionDuration: number
    avgPageViewsPerSession: number
  }
  recentActivity: Array<{ timestamp: string; action: string; details: string; userEmail?: string }>
  userRegistrations: number
  ordersPlaced: number
  conversionRate: number
  totalRevenue?: number
  pdfDownloads?: number
}

interface AnalyticsDashboardProps {
  onCustomerClick?: (userEmail: string) => void
}

interface PDFDownloadData {
  totalDownloads: number
  downloadsByFile: Record<string, number>
  downloadsByDevice: Record<string, number>
  downloadsByBrowser: Record<string, number>
  recentDownloads: Array<{
    filename: string
    userEmail: string | null
    timestamp: string
    deviceType: string | null
    browser: string | null
  }>
}

interface MetricCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  trend?: {
    value: number
    isPositive: boolean
    label: string
  }
  subtitle?: string
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'indigo'
  onClick?: () => void
}

const MetricCard = ({ title, value, icon, trend, subtitle, color = 'blue', onClick }: MetricCardProps) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    orange: 'bg-orange-50 text-orange-600 border-orange-200',
    red: 'bg-red-50 text-red-600 border-red-200',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-200'
  }

  return (
    <div 
      className={`bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 hover:shadow-md transition-shadow ${onClick ? 'cursor-pointer hover:border-purple-300' : ''}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2.5 md:p-3 rounded-lg border ${colorClasses[color]}`}>
          {icon}
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {trend.isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {Math.abs(trend.value)}%
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

type ActiveSection = 'overview' | 'traffic' | 'conversions' | 'content'

export default function AnalyticsDashboard({ onCustomerClick }: AnalyticsDashboardProps = {}) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [pdfDownloads, setPdfDownloads] = useState<PDFDownloadData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState<'all' | number>(30)
  const [activeSection, setActiveSection] = useState<ActiveSection>('overview')
  const [showSalesChart, setShowSalesChart] = useState(false)

  const fetchAnalytics = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }
      setFetchError(null)
      
      const daysParam = timeRange === 'all' ? 'all' : timeRange.toString()
      const [analyticsRes, citiesRes, pdfDownloadsRes] = await Promise.all([
        fetch(`/api/analytics?type=overview&days=${daysParam}`),
        fetch(`/api/analytics?type=cities&days=${daysParam}`),
        fetch(`/api/analytics?type=pdf-downloads&days=${daysParam}`)
      ])

      if (analyticsRes.ok) {
        const analyticsData = await analyticsRes.json()
        setAnalytics(analyticsData)
      } else {
        const errorText = await analyticsRes.text().catch(() => 'Unknown error')
        errorLog('Analytics API error:', { status: analyticsRes.status, error: errorText })
        try {
          const errorJson = JSON.parse(errorText)
          setFetchError(`Analytics API returned ${analyticsRes.status}: ${errorJson.detail || errorJson.error || errorText.slice(0, 200)}`)
        } catch {
          setFetchError(`Analytics API returned ${analyticsRes.status}: ${errorText.slice(0, 200)}`)
        }
      }

      if (citiesRes.ok) {
        const citiesData = await citiesRes.json()
        const transformedCities = citiesData.map((c: { city: string; count: number; country?: string }) => ({
          city: c.city,
          country: c.country || 'Unknown',
          visitors: c.count || 0
        }))
        setAnalytics(prev => prev ? { ...prev, topCities: transformedCities } : null)
      }

      if (pdfDownloadsRes.ok) {
        const pdfDownloadsData = await pdfDownloadsRes.json()
        setPdfDownloads(pdfDownloadsData)
      }
    } catch (error) {
      errorLog('Error fetching analytics:', error)
      setFetchError(`Network error: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [timeRange])

  useEffect(() => {
    fetchAnalytics()
    // Auto-refresh every 60 seconds
    const interval = setInterval(() => {
      fetchAnalytics(true)
    }, 60000)
    return () => clearInterval(interval)
  }, [fetchAnalytics])

  const handleRefresh = () => {
    fetchAnalytics(true)
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
  }

  const extractCustomerName = (details: string) => {
    const match = details.match(/New user registered: (.+)/)
    return match ? match[1] : null
  }

  const handleCustomerClick = (userEmail: string) => {
    if (onCustomerClick) {
      onCustomerClick(userEmail)
    }
  }

  // Calculate device percentages
  const deviceStats = useMemo(() => {
    if (!analytics) return null
    const total = analytics.deviceAnalytics.mobile + analytics.deviceAnalytics.tablet + analytics.deviceAnalytics.desktop
    if (total === 0) return null
    return {
      mobile: (analytics.deviceAnalytics.mobile / total) * 100,
      tablet: (analytics.deviceAnalytics.tablet / total) * 100,
      desktop: (analytics.deviceAnalytics.desktop / total) * 100
    }
  }, [analytics])

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

  if (!analytics) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">Analytics Dashboard</h2>
        <p className="text-gray-600 mb-3">No analytics data available.</p>
        {fetchError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-sm font-medium text-red-800 mb-1">Error loading analytics:</p>
            <p className="text-xs text-red-600 font-mono break-all">{fetchError}</p>
          </div>
        )}
        <button
          onClick={() => fetchAnalytics()}
          className="px-4 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 transition-colors"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Analytics Dashboard</h2>
          <p className="text-sm text-gray-500 mt-1">Comprehensive insights into your website performance</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={timeRange === 'all' ? 'all' : timeRange}
              onChange={(e) => setTimeRange(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white appearance-none"
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
              <option value="all">All time</option>
            </select>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Visitors"
          value={formatNumber(analytics.totalVisitors)}
          icon={<Users className="h-5 w-5 md:h-6 md:w-6" />}
          subtitle={`${analytics.uniqueVisitors} unique`}
          color="blue"
        />
        <MetricCard
          title="Page Views"
          value={formatNumber(analytics.totalPageViews)}
          icon={<Eye className="h-5 w-5 md:h-6 md:w-6" />}
          subtitle={`${(analytics.totalPageViews / Math.max(analytics.totalVisitors, 1)).toFixed(1)} per visitor`}
          color="green"
        />
        <MetricCard
          title="Delivered Orders"
          value={analytics.ordersPlaced}
          icon={<ShoppingCart className="h-5 w-5 md:h-6 md:w-6" />}
          subtitle={analytics.totalRevenue ? `${formatCurrency(analytics.totalRevenue)} • Click for details` : 'Click for monthly breakdown'}
          color="purple"
          onClick={() => setShowSalesChart(true)}
        />
        <MetricCard
          title="Conversion Rate"
          value={`${analytics.conversionRate.toFixed(1)}%`}
          icon={<TrendingUp className="h-5 w-5 md:h-6 md:w-6" />}
          subtitle={`${analytics.ordersPlaced} delivered from ${analytics.totalVisitors} visitors`}
          color="orange"
        />
            </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="New Users"
          value={analytics.userRegistrations}
          icon={<Users className="h-5 w-5 md:h-6 md:w-6" />}
          color="indigo"
        />
        {analytics.totalRevenue && (
          <MetricCard
            title="Total Revenue"
            value={formatCurrency(analytics.totalRevenue)}
            icon={<Coins className="h-5 w-5 md:h-6 md:w-6" />}
            color="green"
          />
        )}
        {analytics.pdfDownloads !== undefined && (
          <MetricCard
            title="PDF Downloads"
            value={analytics.pdfDownloads}
            icon={<Download className="h-5 w-5 md:h-6 md:w-6" />}
            color="blue"
          />
        )}
        <MetricCard
          title="Avg Session"
          value={`${Math.floor(analytics.uxMetrics.avgSessionDuration / 60)}m ${analytics.uxMetrics.avgSessionDuration % 60}s`}
          icon={<Clock className="h-5 w-5 md:h-6 md:w-6" />}
          subtitle={`${analytics.uxMetrics.avgPageViewsPerSession.toFixed(1)} pages/session`}
          color="purple"
        />
            </div>

      {/* Section Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200">
        {([
          { id: 'overview' as const, label: 'Overview', icon: BarChart3 },
          { id: 'traffic' as const, label: 'Traffic', icon: Activity },
          { id: 'conversions' as const, label: 'Conversions', icon: TrendingUp },
          { id: 'content' as const, label: 'Content', icon: FileText }
        ] as const).map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveSection(id)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeSection === id
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
        </div>

      {/* Overview Section */}
      {activeSection === 'overview' && (
        <div className="space-y-4 md:space-y-6">
          {/* Device Analytics */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
            <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 md:mb-6 flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Device Analytics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-gray-700">Mobile</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{analytics.deviceAnalytics.mobile}</span>
                </div>
                {deviceStats && (
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-green-600 h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${deviceStats.mobile}%` }}
                    ></div>
                  </div>
                )}
                {deviceStats && (
                  <p className="text-xs text-gray-500">{deviceStats.mobile.toFixed(1)}% of traffic</p>
                )}
            </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Tablet className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">Tablet</span>
            </div>
                  <span className="text-sm font-bold text-gray-900">{analytics.deviceAnalytics.tablet}</span>
          </div>
                {deviceStats && (
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${deviceStats.tablet}%` }}
                    ></div>
        </div>
                )}
                {deviceStats && (
                  <p className="text-xs text-gray-500">{deviceStats.tablet.toFixed(1)}% of traffic</p>
                )}
            </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Monitor className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium text-gray-700">Desktop</span>
            </div>
                  <span className="text-sm font-bold text-gray-900">{analytics.deviceAnalytics.desktop}</span>
          </div>
                {deviceStats && (
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-purple-600 h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${deviceStats.desktop}%` }}
                    ></div>
        </div>
                )}
                {deviceStats && (
                  <p className="text-xs text-gray-500">{deviceStats.desktop.toFixed(1)}% of traffic</p>
                )}
            </div>
            </div>
          </div>

          {/* UX Metrics */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
            <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 md:mb-6 flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              User Experience Metrics
            </h3>
            {analytics.uxMetrics.avgSessionDuration === 0 && analytics.uxMetrics.bounceRate === 0 && analytics.uxMetrics.avgPageViewsPerSession === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-gray-500">No data available</p>
                <p className="text-xs text-gray-400 mt-1">Session data will appear once users start browsing</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                <div className="text-center p-4 bg-red-50 rounded-lg border border-red-100">
                  <div className="text-2xl md:text-3xl font-bold text-red-600 mb-1">
                    {analytics.uxMetrics.bounceRate.toFixed(1)}%
                  </div>
                  <div className="text-sm font-medium text-gray-700">Bounce Rate</div>
                  <div className="text-xs text-gray-500 mt-1">Lower is better</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="text-2xl md:text-3xl font-bold text-blue-600 mb-1">
                    {Math.floor(analytics.uxMetrics.avgSessionDuration / 60)}m {analytics.uxMetrics.avgSessionDuration % 60}s
                  </div>
                  <div className="text-sm font-medium text-gray-700">Avg Session Duration</div>
                  <div className="text-xs text-gray-500 mt-1">Time on site</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg border border-green-100">
                  <div className="text-2xl md:text-3xl font-bold text-green-600 mb-1">
                    {analytics.uxMetrics.avgPageViewsPerSession.toFixed(1)}
                  </div>
                  <div className="text-sm font-medium text-gray-700">Pages per Session</div>
                  <div className="text-xs text-gray-500 mt-1">Engagement metric</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Traffic Section */}
      {activeSection === 'traffic' && (
        <div className="space-y-4 md:space-y-6">
          {/* Traffic Overview Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Total Visitors"
              value={formatNumber(analytics.totalVisitors)}
              icon={<Users className="h-5 w-5 md:h-6 md:w-6" />}
              subtitle={`${analytics.uniqueVisitors} unique`}
              color="blue"
            />
            <MetricCard
              title="Page Views"
              value={formatNumber(analytics.totalPageViews)}
              icon={<Eye className="h-5 w-5 md:h-6 md:w-6" />}
              subtitle={`${(analytics.totalPageViews / Math.max(analytics.totalVisitors, 1)).toFixed(1)} per visitor`}
              color="green"
            />
            <MetricCard
              title="Bounce Rate"
              value={`${analytics.uxMetrics.bounceRate.toFixed(1)}%`}
              icon={<Activity className="h-5 w-5 md:h-6 md:w-6" />}
              subtitle={analytics.uxMetrics.bounceRate < 40 ? 'Excellent' : analytics.uxMetrics.bounceRate < 60 ? 'Good' : 'Needs improvement'}
              color={analytics.uxMetrics.bounceRate < 40 ? 'green' : analytics.uxMetrics.bounceRate < 60 ? 'orange' : 'red'}
            />
            <MetricCard
              title="Avg Session"
              value={`${Math.floor(analytics.uxMetrics.avgSessionDuration / 60)}m ${analytics.uxMetrics.avgSessionDuration % 60}s`}
              icon={<Clock className="h-5 w-5 md:h-6 md:w-6" />}
              subtitle={`${analytics.uxMetrics.avgPageViewsPerSession.toFixed(1)} pages/session`}
              color="purple"
            />
          </div>

          {/* Geographic Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {/* Top Countries - Enhanced */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Top Countries
                </h3>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {analytics.topCountries.length} countries
                </span>
              </div>
              <div className="space-y-3">
                {analytics.topCountries.length > 0 ? (
                  <>
                    {analytics.topCountries.slice(0, 10).map((country, index) => {
                      const maxVisitors = Math.max(...analytics.topCountries.map(c => c.visitors))
                      const percentage = maxVisitors > 0 ? (country.visitors / maxVisitors) * 100 : 0
                      const totalVisitors = analytics.totalVisitors
                      const countryPercentage = totalVisitors > 0 ? (country.visitors / totalVisitors) * 100 : 0
                      
                      return (
                        <div key={index} className="group hover:bg-gray-50 p-2 rounded-lg transition-colors">
                          <div className="flex items-center justify-between gap-3 mb-1">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <span className="text-xs font-bold text-gray-400 w-6 flex-shrink-0 text-center">
                                {index + 1}
                              </span>
                              <span className="text-sm font-semibold text-gray-900 truncate">{country.country}</span>
                            </div>
                            <div className="flex items-center gap-3 flex-shrink-0">
                              <span className="text-xs text-gray-500 hidden sm:inline">{countryPercentage.toFixed(1)}%</span>
                              <span className="text-sm font-bold text-gray-900 w-12 text-right">{country.visitors}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2.5 overflow-hidden">
                              <div 
                                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 rounded-full transition-all duration-700 ease-out"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                    {analytics.topCountries.length > 10 && (
                      <div className="text-center pt-2 border-t border-gray-200">
                        <p className="text-xs text-gray-500">
                          +{analytics.topCountries.length - 10} more countries
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8">
                    <Globe className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No country data available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Top Cities - Enhanced */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Top Cities
                </h3>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {analytics.topCities?.length || 0} cities
                </span>
              </div>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {analytics.topCities && analytics.topCities.length > 0 ? (
                  <>
                    {analytics.topCities.slice(0, 15).map((city, index) => {
                      const maxVisitors = Math.max(...analytics.topCities.map(c => c.visitors || 0))
                      const percentage = maxVisitors > 0 ? ((city.visitors || 0) / maxVisitors) * 100 : 0
                      
                      return (
                        <div key={index} className="group hover:bg-gray-50 p-2 rounded-lg transition-colors border-b border-gray-50 last:border-b-0">
                          <div className="flex items-center justify-between gap-3 mb-1">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <span className="text-xs font-bold text-gray-400 w-6 flex-shrink-0 text-center">
                                {index + 1}
                              </span>
                              <div className="min-w-0 flex-1">
                                <span className="text-sm font-semibold text-gray-900 block truncate">{city.city}</span>
                                {city.country && city.country !== 'Unknown' && (
                                  <span className="text-xs text-gray-500">{city.country}</span>
                                )}
                              </div>
                            </div>
                            <span className="text-sm font-bold text-gray-900 w-10 text-right flex-shrink-0">{city.visitors || 0}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                              <div 
                                className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-700 ease-out"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                    {analytics.topCities.length > 15 && (
                      <div className="text-center pt-2 border-t border-gray-200">
                        <p className="text-xs text-gray-500">
                          +{analytics.topCities.length - 15} more cities
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8">
                    <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No city data available</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Device Analytics - Enhanced */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
            <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 md:mb-6 flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Device & Platform Analytics
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Device Types */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Device Types</h4>
                {deviceStats ? (
                  <>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Smartphone className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium text-gray-700">Mobile</span>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-bold text-gray-900">{analytics.deviceAnalytics.mobile}</span>
                            <span className="text-xs text-gray-500 ml-2">({deviceStats.mobile.toFixed(1)}%)</span>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-700"
                            style={{ width: `${deviceStats.mobile}%` }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Tablet className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium text-gray-700">Tablet</span>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-bold text-gray-900">{analytics.deviceAnalytics.tablet}</span>
                            <span className="text-xs text-gray-500 ml-2">({deviceStats.tablet.toFixed(1)}%)</span>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-700"
                            style={{ width: `${deviceStats.tablet}%` }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Monitor className="h-4 w-4 text-purple-600" />
                            <span className="text-sm font-medium text-gray-700">Desktop</span>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-bold text-gray-900">{analytics.deviceAnalytics.desktop}</span>
                            <span className="text-xs text-gray-500 ml-2">({deviceStats.desktop.toFixed(1)}%)</span>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full transition-all duration-700"
                            style={{ width: `${deviceStats.desktop}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-gray-500">No device data available</p>
                )}
              </div>

              {/* Top Browsers */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Top Browsers</h4>
                <div className="space-y-3">
                  {analytics.deviceAnalytics.topBrowsers.slice(0, 6).map((browser, index) => {
                    const maxCount = Math.max(...analytics.deviceAnalytics.topBrowsers.map(b => b.count))
                    const percentage = maxCount > 0 ? (browser.count / maxCount) * 100 : 0
                    const totalBrowsers = analytics.deviceAnalytics.topBrowsers.reduce((sum, b) => sum + b.count, 0)
                    const browserPercentage = totalBrowsers > 0 ? (browser.count / totalBrowsers) * 100 : 0
                    
                    return (
                      <div key={index} className="group">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700 flex-1 truncate">{browser.browser}</span>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className="text-xs text-gray-500 hidden sm:inline">{browserPercentage.toFixed(1)}%</span>
                            <span className="text-sm font-bold text-gray-900 w-10 text-right">{browser.count}</span>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full transition-all duration-700"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Operating Systems */}
              {analytics.deviceAnalytics.topOS && analytics.deviceAnalytics.topOS.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Operating Systems</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {analytics.deviceAnalytics.topOS.map((os, index) => {
                      const totalOS = analytics.deviceAnalytics.topOS.reduce((sum, o) => sum + o.count, 0)
                      const osPercentage = totalOS > 0 ? (os.count / totalOS) * 100 : 0
                      
                      return (
                        <div key={index} className="text-center p-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200 hover:shadow-md transition-all">
                          <div className="text-xl md:text-2xl font-bold text-gray-900 mb-1">{os.count}</div>
                          <div className="text-xs md:text-sm text-gray-600 truncate mb-1">{os.os}</div>
                          <div className="text-xs text-gray-500">{osPercentage.toFixed(1)}%</div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Traffic Quality Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 p-4 md:p-6">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold text-blue-900">Engagement Score</h4>
                <Activity className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-blue-900 mb-1">
                {analytics.uxMetrics.avgPageViewsPerSession > 0 
                  ? Math.round((analytics.uxMetrics.avgPageViewsPerSession / 5) * 100)
                  : 0}%
              </div>
              <p className="text-xs text-blue-700">
                Based on {analytics.uxMetrics.avgPageViewsPerSession.toFixed(1)} pages per session
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 p-4 md:p-6">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold text-green-900">Session Quality</h4>
                <Clock className="h-5 w-5 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-green-900 mb-1">
                {analytics.uxMetrics.avgSessionDuration > 60 ? 'High' : analytics.uxMetrics.avgSessionDuration > 30 ? 'Medium' : 'Low'}
              </div>
              <p className="text-xs text-green-700">
                Avg {Math.floor(analytics.uxMetrics.avgSessionDuration / 60)}m {analytics.uxMetrics.avgSessionDuration % 60}s per session
              </p>
            </div>

            <div className={`bg-gradient-to-br rounded-xl border p-4 md:p-6 ${
              analytics.uxMetrics.bounceRate < 40 
                ? 'from-green-50 to-green-100 border-green-200' 
                : analytics.uxMetrics.bounceRate < 60 
                ? 'from-yellow-50 to-yellow-100 border-yellow-200'
                : 'from-red-50 to-red-100 border-red-200'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <h4 className={`text-sm font-semibold ${
                  analytics.uxMetrics.bounceRate < 40 ? 'text-green-900' : analytics.uxMetrics.bounceRate < 60 ? 'text-yellow-900' : 'text-red-900'
                }`}>
                  Bounce Rate
                </h4>
                <TrendingUp className={`h-5 w-5 ${
                  analytics.uxMetrics.bounceRate < 40 ? 'text-green-600' : analytics.uxMetrics.bounceRate < 60 ? 'text-yellow-600' : 'text-red-600'
                }`} />
              </div>
              <div className={`text-3xl font-bold mb-1 ${
                analytics.uxMetrics.bounceRate < 40 ? 'text-green-900' : analytics.uxMetrics.bounceRate < 60 ? 'text-yellow-900' : 'text-red-900'
              }`}>
                {analytics.uxMetrics.bounceRate.toFixed(1)}%
              </div>
              <p className={`text-xs ${
                analytics.uxMetrics.bounceRate < 40 ? 'text-green-700' : analytics.uxMetrics.bounceRate < 60 ? 'text-yellow-700' : 'text-red-700'
              }`}>
                {analytics.uxMetrics.bounceRate < 40 ? 'Excellent engagement' : analytics.uxMetrics.bounceRate < 60 ? 'Good engagement' : 'Needs improvement'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Conversions Section */}
      {activeSection === 'conversions' && (
        <div className="space-y-4 md:space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
            <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 md:mb-6 flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Conversion Metrics
            </h3>
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Conversion Rate</span>
                  <span className="text-lg font-bold text-gray-900">{analytics.conversionRate.toFixed(2)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div 
                    className="bg-gradient-to-r from-blue-600 to-green-600 h-4 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                    style={{ width: `${Math.min(analytics.conversionRate, 100)}%` }}
                  >
                    {analytics.conversionRate > 5 && (
                      <span className="text-xs font-bold text-white">{analytics.conversionRate.toFixed(1)}%</span>
                    )}
                  </div>
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>{analytics.ordersPlaced} delivered</span>
                  <span>{analytics.totalVisitors} visitors</span>
                </div>
              </div>

              {analytics.totalRevenue && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl md:text-3xl font-bold text-green-600 mb-1">
                      {formatCurrency(analytics.totalRevenue)}
                    </div>
                    <div className="text-sm font-medium text-gray-700">Total Revenue</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl md:text-3xl font-bold text-blue-600 mb-1">
                      {analytics.ordersPlaced > 0 ? formatCurrency(analytics.totalRevenue / analytics.ordersPlaced) : '0'}
                    </div>
                    <div className="text-sm font-medium text-gray-700">Avg Order Value</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl md:text-3xl font-bold text-purple-600 mb-1">
                      {analytics.totalVisitors > 0 ? formatCurrency(analytics.totalRevenue / analytics.totalVisitors) : '0'}
                    </div>
                    <div className="text-sm font-medium text-gray-700">Revenue per Visitor</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Content Section */}
      {activeSection === 'content' && (
        <div className="space-y-4 md:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {/* Top Pages */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 md:mb-6 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Top Pages
              </h3>
              <div className="space-y-3">
                {analytics.topPages.slice(0, 10).map((page, index) => {
                  const maxViews = Math.max(...analytics.topPages.map(p => p.views))
                  return (
                    <div key={index} className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <span className="text-xs font-bold text-gray-400 w-4 flex-shrink-0">{index + 1}</span>
                        <span className="text-sm font-medium text-gray-900 truncate">{page.page}</span>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <div className="w-16 md:w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${(page.views / maxViews) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-bold text-gray-900 w-10 text-right">{page.views}</span>
                      </div>
                    </div>
                  )
                })}
          </div>
        </div>

        {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 md:mb-6 flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activity
              </h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {analytics.recentActivity.slice(0, 15).map((activity, index) => {
              const customerName = extractCustomerName(activity.details || activity.action)
              const isUserRegistration = activity.action === 'user_registered' && activity.userEmail
              
              return (
                    <div key={index} className="flex items-start justify-between gap-3 py-2 border-b border-gray-100 last:border-b-0">
                      <div className="flex-1 min-w-0">
                    {isUserRegistration && customerName ? (
                      <p className="text-sm font-medium text-gray-900">
                            New user:{' '}
                        <button
                          onClick={() => handleCustomerClick(activity.userEmail!)}
                              className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {customerName}
                        </button>
                      </p>
                    ) : (
                          <p className="text-sm font-medium text-gray-900 truncate">
                        {activity.details || activity.action}
                      </p>
                    )}
                  </div>
                      <span className="text-xs text-gray-500 flex-shrink-0 whitespace-nowrap">
                    {formatTimestamp(activity.timestamp)}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

          {/* PDF Downloads */}
          {pdfDownloads && pdfDownloads.totalDownloads > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 md:mb-6 flex items-center gap-2">
                <Download className="h-5 w-5" />
                PDF Downloads
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="text-2xl md:text-3xl font-bold text-blue-600 mb-1">{pdfDownloads.totalDownloads}</div>
                  <div className="text-sm font-medium text-gray-700">Total Downloads</div>
                </div>
                {Object.entries(pdfDownloads.downloadsByDevice).map(([device, count]) => (
                  <div key={device} className="text-center p-4 bg-green-50 rounded-lg border border-green-100">
                    <div className="text-2xl md:text-3xl font-bold text-green-600 mb-1">{count}</div>
                    <div className="text-sm font-medium text-gray-700">{device}</div>
              </div>
            ))}
              </div>
              
            {Object.keys(pdfDownloads.downloadsByFile).length > 0 && (
                <div>
                <h4 className="text-md font-semibold text-gray-700 mb-3">Downloads by File</h4>
                <div className="space-y-2">
                  {Object.entries(pdfDownloads.downloadsByFile)
                    .sort(([,a], [,b]) => b - a)
                      .slice(0, 10)
                    .map(([filename, count]) => (
                    <div key={filename} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm font-medium text-gray-700 truncate flex-1">{filename}</span>
                          <span className="text-sm font-bold text-blue-600 ml-2">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
              </div>
            )}
          </div>
        )}

      {/* Sales Chart Modal */}
      <SalesChartModal 
        isOpen={showSalesChart} 
        onClose={() => setShowSalesChart(false)} 
      />
    </div>
  )
}
