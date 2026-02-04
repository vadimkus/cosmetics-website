'use client'

import { useState, useEffect, useCallback } from 'react'
import { 
  MessageCircle, 
  TrendingUp, 
  Globe, 
  Smartphone, 
  Monitor, 
  Tablet, 
  Clock, 
  RefreshCw,
  BarChart3,
  MessageSquare,
  Calendar
} from 'lucide-react'

interface ChatStats {
  overview: {
    totalConversations: number
    todayConversations: number
    totalMessages: number
    avgMessagesPerConversation: number
  }
  byLocale: Array<{ locale: string; count: number }>
  byDevice: Array<{ device: string; count: number }>
  dailyStats: Array<{ date: string; conversations: number; messages: number }>
  hourlyActivity: Array<{ hour: number; count: number }>
  recentConversations: Array<{
    id: string
    sessionId: string
    locale: string
    messageCount: number
    userMessages: number
    botMessages: number
    firstMessage: string | null
    deviceType: string | null
    browser: string | null
    country: string | null
    city: string | null
    startedAt: string
    lastMessageAt: string
  }>
}

interface ChatbotDashboardProps {
  getAdminHeaders: () => HeadersInit
}

export default function ChatbotDashboard({ getAdminHeaders }: ChatbotDashboardProps) {
  const [stats, setStats] = useState<ChatStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedDays, setSelectedDays] = useState(30)

  const fetchStats = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/admin/chat-stats?days=${selectedDays}`, {
        headers: getAdminHeaders(),
      })
      const data = await response.json()
      if (data.success) {
        setStats(data.stats)
      } else {
        setError(data.error || 'Failed to fetch stats')
      }
    } catch (err) {
      setError('Failed to fetch chatbot statistics')
      console.error('Error fetching chat stats:', err)
    } finally {
      setLoading(false)
    }
  }, [getAdminHeaders, selectedDays])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  const getDeviceIcon = (device: string | null) => {
    switch (device?.toLowerCase()) {
      case 'mobile':
        return <Smartphone className="h-4 w-4" />
      case 'tablet':
        return <Tablet className="h-4 w-4" />
      default:
        return <Monitor className="h-4 w-4" />
    }
  }

  const getLocaleLabel = (locale: string) => {
    const labels: Record<string, string> = {
      en: '🇬🇧 English',
      ar: '🇦🇪 Arabic',
      ru: '🇷🇺 Russian',
    }
    return labels[locale] || locale.toUpperCase()
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-AE', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatTime = (hour: number) => {
    const period = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}${period}`
  }

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        <p className="font-medium">Error loading chatbot statistics</p>
        <p className="text-sm mt-1">{error}</p>
        <button
          onClick={fetchStats}
          className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
        >
          Retry
        </button>
      </div>
    )
  }

  if (!stats) return null

  // Calculate max for hourly activity chart
  const maxHourlyCount = Math.max(...stats.hourlyActivity.map((h) => h.count), 1)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2">
            <MessageCircle className="h-6 w-6 text-primary-600" />
            Genie Chatbot Analytics
          </h2>
          <p className="text-sm text-gray-500 mt-1">Track conversations and engagement</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedDays}
            onChange={(e) => setSelectedDays(Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
          <button
            onClick={fetchStats}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 text-sm"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-200 rounded-lg">
              <MessageSquare className="h-5 w-5 text-purple-700" />
            </div>
            <span className="text-sm text-purple-700 font-medium">Total Chats</span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-purple-900">
            {stats.overview.totalConversations.toLocaleString()}
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-200 rounded-lg">
              <Calendar className="h-5 w-5 text-green-700" />
            </div>
            <span className="text-sm text-green-700 font-medium">Today</span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-green-900">
            {stats.overview.todayConversations.toLocaleString()}
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-200 rounded-lg">
              <MessageCircle className="h-5 w-5 text-blue-700" />
            </div>
            <span className="text-sm text-blue-700 font-medium">Total Messages</span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-blue-900">
            {stats.overview.totalMessages.toLocaleString()}
          </p>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-xl p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-200 rounded-lg">
              <TrendingUp className="h-5 w-5 text-amber-700" />
            </div>
            <span className="text-sm text-amber-700 font-medium">Avg Messages</span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-amber-900">
            {stats.overview.avgMessagesPerConversation}
          </p>
          <p className="text-xs text-amber-600 mt-1">per conversation</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Language Distribution */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-4">
            <Globe className="h-5 w-5 text-gray-600" />
            Languages
          </h3>
          <div className="space-y-3">
            {stats.byLocale.map((item) => {
              const total = stats.byLocale.reduce((sum, l) => sum + l.count, 0)
              const percentage = total > 0 ? Math.round((item.count / total) * 100) : 0
              return (
                <div key={item.locale}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{getLocaleLabel(item.locale)}</span>
                    <span className="text-gray-500">{item.count} ({percentage}%)</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary-500 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
            {stats.byLocale.length === 0 && (
              <p className="text-gray-500 text-sm text-center py-4">No data yet</p>
            )}
          </div>
        </div>

        {/* Device Distribution */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-4">
            <Smartphone className="h-5 w-5 text-gray-600" />
            Devices
          </h3>
          <div className="space-y-3">
            {stats.byDevice.map((item) => {
              const total = stats.byDevice.reduce((sum, d) => sum + d.count, 0)
              const percentage = total > 0 ? Math.round((item.count / total) * 100) : 0
              return (
                <div key={item.device}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium flex items-center gap-2">
                      {getDeviceIcon(item.device)}
                      {item.device || 'Unknown'}
                    </span>
                    <span className="text-gray-500">{item.count} ({percentage}%)</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
            {stats.byDevice.length === 0 && (
              <p className="text-gray-500 text-sm text-center py-4">No data yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Hourly Activity */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-4">
          <Clock className="h-5 w-5 text-gray-600" />
          Activity by Hour (Last 24h)
        </h3>
        <div className="flex items-end justify-between h-32 gap-1">
          {Array.from({ length: 24 }, (_, i) => {
            const activity = stats.hourlyActivity.find((h) => h.hour === i)
            const count = activity?.count || 0
            const height = maxHourlyCount > 0 ? (count / maxHourlyCount) * 100 : 0
            return (
              <div key={i} className="flex-1 flex flex-col items-center group">
                <div
                  className="w-full bg-primary-500 rounded-t transition-all hover:bg-primary-600 min-h-[2px]"
                  style={{ height: `${Math.max(height, 2)}%` }}
                  title={`${formatTime(i)}: ${count} chats`}
                />
                {i % 4 === 0 && (
                  <span className="text-xs text-gray-400 mt-1">{formatTime(i)}</span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Recent Conversations */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-4">
          <BarChart3 className="h-5 w-5 text-gray-600" />
          Recent Conversations
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-2 font-medium text-gray-600">Time</th>
                <th className="text-left py-3 px-2 font-medium text-gray-600">First Message</th>
                <th className="text-center py-3 px-2 font-medium text-gray-600">Messages</th>
                <th className="text-center py-3 px-2 font-medium text-gray-600">Language</th>
                <th className="text-center py-3 px-2 font-medium text-gray-600">Device</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentConversations.slice(0, 20).map((conv) => (
                <tr key={conv.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-2 text-gray-600 whitespace-nowrap">
                    {formatDate(conv.startedAt)}
                  </td>
                  <td className="py-3 px-2 max-w-xs truncate" title={conv.firstMessage || ''}>
                    {conv.firstMessage || <span className="text-gray-400 italic">No message</span>}
                  </td>
                  <td className="py-3 px-2 text-center">
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-xs">
                      <MessageCircle className="h-3 w-3" />
                      {conv.messageCount}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-center">
                    <span className="text-xs">{getLocaleLabel(conv.locale)}</span>
                  </td>
                  <td className="py-3 px-2 text-center">
                    <span className="inline-flex items-center gap-1 text-gray-600">
                      {getDeviceIcon(conv.deviceType)}
                    </span>
                  </td>
                </tr>
              ))}
              {stats.recentConversations.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">
                    No conversations yet. Start chatting with Genie!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
