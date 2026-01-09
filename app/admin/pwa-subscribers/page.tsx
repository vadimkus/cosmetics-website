'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, RefreshCw, Users, Smartphone, Mail, Phone, Calendar, Trash2 } from 'lucide-react'
import { addCsrfToBody } from '@/lib/csrfClient'
import { errorLog } from '@/lib/logger'

interface PWASubscriber {
  id: string
  userId: string
  endpoint: string
  userAgent: string | null
  createdAt: string
  updatedAt: string
  user: {
    id: string
    email: string
    name: string | null
    phone: string | null
    createdAt: string
  } | null
}

interface AdminSession {
  email: string
  name?: string
}

export default function PWASubscribersPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [subscribers, setSubscribers] = useState<PWASubscriber[]>([])
  const [error, setError] = useState<string | null>(null)
  const [adminSession, setAdminSession] = useState<AdminSession | null>(null)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  // Check admin session on mount
  useEffect(() => {
    const checkSession = () => {
      if (typeof window !== 'undefined') {
        const sessionStr = localStorage.getItem('admin_session')
        if (sessionStr) {
          try {
            const session = JSON.parse(sessionStr)
            if (session?.email) {
              setAdminSession(session)
            }
          } catch {
            // Invalid session
          }
        }
      }
      setIsCheckingAuth(false)
    }
    
    checkSession()
  }, [])

  // Get admin headers with CSRF and admin email
  const getAdminHeaders = useCallback((): Record<string, string> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    
    // Add CSRF token if available
    if (typeof window !== 'undefined') {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
      if (csrfToken) {
        headers['X-CSRF-Token'] = csrfToken
      }
    }
    
    if (adminSession?.email) {
      headers['X-Admin-Email'] = adminSession.email
    }
    
    return headers
  }, [adminSession?.email])

  // Load subscribers
  const loadSubscribers = useCallback(async () => {
    if (!adminSession?.email) {
      setError('Please log in to admin first.')
      setLoading(false)
      return
    }
    
    setLoading(true)
    setError(null)
    
    try {
      const res = await fetch('/api/admin/pwa-subscribers', {
        headers: getAdminHeaders()
      })
      
      const data = await res.json()
      
      if (!res.ok || !data.success) {
        if (res.status === 401 || res.status === 403) {
          setError('Authentication required. Please log in to admin.')
          return
        }
        setError(data.error || 'Failed to load subscribers')
        return
      }
      
      setSubscribers(data.subscribers || [])
    } catch (e: unknown) {
      const err = e as Error
      errorLog('Error loading subscribers:', err)
      setError(err?.message || 'Failed to load subscribers')
    } finally {
      setLoading(false)
    }
  }, [getAdminHeaders, adminSession?.email])

  // Load when admin session is ready
  useEffect(() => {
    if (!isCheckingAuth && adminSession?.email) {
      loadSubscribers()
    } else if (!isCheckingAuth && !adminSession?.email) {
      setError('Please log in to admin first.')
      setLoading(false)
    }
  }, [isCheckingAuth, adminSession?.email, loadSubscribers])

  // Group subscribers by user to get unique users
  const uniqueUsers = subscribers.reduce((acc, sub) => {
    const userId = sub.user?.id || sub.userId
    if (!acc.find(u => (u.user?.id || u.userId) === userId)) {
      acc.push(sub)
    }
    return acc
  }, [] as PWASubscriber[])

  // Get subscription count for a user
  const getSubscriptionCount = (userId: string) => {
    return subscribers.filter(s => (s.user?.id || s.userId) === userId).length
  }

  // Get all subscriptions for a user
  const getUserSubscriptions = (userId: string) => {
    return subscribers.filter(s => (s.user?.id || s.userId) === userId)
  }

  // Delete a subscription
  const handleDelete = async (subscriptionId: string, endpoint: string) => {
    if (!confirm('Are you sure you want to remove this PWA subscription? The user will need to re-enable push notifications.')) {
      return
    }

    try {
      const payload = addCsrfToBody({ endpoint })
      const res = await fetch('/api/push/subscribe', {
        method: 'DELETE',
        headers: getAdminHeaders(),
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        setSubscribers(prev => prev.filter(s => s.id !== subscriptionId))
      }
    } catch (e) {
      errorLog('Error deleting subscription:', e)
    }
  }

  // Parse user agent to get device info
  const getDeviceInfo = (userAgent: string | null) => {
    if (!userAgent) return 'Unknown device'
    
    if (userAgent.includes('iPhone')) return 'iPhone'
    if (userAgent.includes('iPad')) return 'iPad'
    if (userAgent.includes('Android')) return 'Android'
    if (userAgent.includes('Mac')) return 'Mac'
    if (userAgent.includes('Windows')) return 'Windows'
    
    return 'Unknown device'
  }

  // Format date
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/admin')}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">PWA Subscribers</h1>
                <p className="text-sm text-gray-500">Users with push notifications enabled</p>
              </div>
            </div>
            <button
              onClick={loadSubscribers}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">{uniqueUsers.length}</p>
                <p className="text-sm text-gray-500">Unique users</p>
              </div>
            </div>
            <div className="border-l border-gray-200 pl-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                  <Smartphone className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900">{subscribers.length}</p>
                  <p className="text-sm text-gray-500">Total subscriptions</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <p className="text-red-700 mb-3">{error}</p>
            {!adminSession?.email && (
              <button
                onClick={() => router.push('/admin')}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
              >
                Go to Admin Login
              </button>
            )}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="w-8 h-8 border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading subscribers...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && subscribers.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No PWA subscribers yet</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Users who enable push notifications in the PWA will appear here.
              Share the PWA installation guide to get more subscribers.
            </p>
          </div>
        )}

        {/* Subscribers List - Grouped by User */}
        {!loading && uniqueUsers.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="font-semibold text-gray-900">All Subscribers (grouped by user)</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {uniqueUsers.map((sub) => {
                const userId = sub.user?.id || sub.userId
                const subCount = getSubscriptionCount(userId)
                const userSubs = getUserSubscriptions(userId)
                
                return (
                  <div key={userId} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        {/* User Info */}
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <span className="text-blue-600 font-semibold">
                              {sub.user?.name?.charAt(0) || sub.user?.email?.charAt(0) || '?'}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-gray-900 truncate">
                                {sub.user?.name || 'Unknown User'}
                              </p>
                              {subCount > 1 && (
                                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                                  {subCount} devices
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <Mail className="w-3.5 h-3.5" />
                              <span className="truncate">{sub.user?.email || sub.userId}</span>
                            </div>
                          </div>
                        </div>

                        {/* Details */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 ml-13">
                          {sub.user?.phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="w-3.5 h-3.5" />
                              <span>{sub.user.phone}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Smartphone className="w-3.5 h-3.5" />
                            <span>{userSubs.map(s => getDeviceInfo(s.userAgent)).filter((v, i, a) => a.indexOf(v) === i).join(', ')}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>First subscribed {formatDate(userSubs.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())[0]?.createdAt || sub.createdAt)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Actions - Delete all subscriptions for this user */}
                      <div className="flex items-center gap-2">
                        {userSubs.map((userSub, idx) => (
                          <button
                            key={userSub.id}
                            onClick={() => handleDelete(userSub.id, userSub.endpoint)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title={`Remove ${getDeviceInfo(userSub.userAgent)} subscription`}
                          >
                            <Trash2 className="w-4 h-4" />
                            {subCount > 1 && <span className="sr-only">Device {idx + 1}</span>}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

