'use client'

import { useState, useCallback } from 'react'
import { Users, Search, RefreshCw, Edit, Trash2, Monitor, Smartphone, TabletSmartphone, Clock, UserPlus } from 'lucide-react'
import { errorLog } from '@/lib/logger'

interface User {
  id: string
  name: string
  email: string
  phone?: string | null
  address?: string | null
  birthday?: string | null
  isAdmin?: boolean
  canSeePrices?: boolean
  discountType?: string | null
  discountPercentage?: number | null
  lastLoginAt?: string | null
  lastLoginSource?: string | null // desktop_web, mobile_web, mobile_app
  lastActiveAt?: string | null // For online status tracking
  createdAt: string
  orderCount?: number
  totalSpent?: number
  lastOrderDate?: string | null
}

// Helper function to get login source icon and label
function getLoginSourceInfo(source: string | null | undefined): { icon: React.ReactNode; label: string; color: string } {
  switch (source) {
    case 'mobile_app':
      return {
        icon: <Smartphone className="h-3.5 w-3.5" />,
        label: 'App',
        color: 'text-purple-600'
      }
    case 'mobile_web':
      return {
        icon: <TabletSmartphone className="h-3.5 w-3.5" />,
        label: 'Mobile Web',
        color: 'text-blue-600'
      }
    case 'desktop_web':
      return {
        icon: <Monitor className="h-3.5 w-3.5" />,
        label: 'Desktop',
        color: 'text-gray-600'
      }
    default:
      return {
        icon: null,
        label: '',
        color: ''
      }
  }
}

// Helper function to check if user is online (active within last 5 minutes)
function isUserOnline(lastActiveAt: string | null | undefined): boolean {
  if (!lastActiveAt) return false
  const fiveMinutesAgo = Date.now() - 5 * 60 * 1000
  return new Date(lastActiveAt).getTime() > fiveMinutesAgo
}

// Helper function to format relative time (e.g., "5m ago", "2h ago")
function formatRelativeTime(dateStr: string | null | undefined): string {
  if (!dateStr) return 'Never'
  
  const now = Date.now()
  const timestamp = new Date(dateStr).getTime()
  if (isNaN(timestamp)) return 'Never'
  
  const diffMs = now - timestamp
  const diffMinutes = Math.floor(diffMs / (60 * 1000))
  const diffHours = Math.floor(diffMs / (60 * 60 * 1000))
  const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000))

  if (diffMinutes < 1) return 'Just now'
  if (diffMinutes < 5) return 'Online now'
  if (diffMinutes < 60) return `${diffMinutes}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays}d ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`
  
  return formatDateTime(dateStr)
}

// Helper function to format a date/time stamp in short format
function formatDateTime(dateStr: string | null | undefined): string {
  if (!dateStr) return '—'
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return '—'
  
  const now = new Date()
  const isThisYear = date.getFullYear() === now.getFullYear()
  
  // Show time if within last 24 hours
  const diffMs = now.getTime() - date.getTime()
  const isToday = diffMs < 24 * 60 * 60 * 1000
  
  if (isToday) {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })
  }
  
  if (isThisYear) {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }
  
  return date.toLocaleDateString('en-US', { 
    year: 'numeric',
    month: 'short', 
    day: 'numeric'
  })
}

// Helper function to format date for tooltip (full precision)
function formatFullDateTime(dateStr: string | null | undefined): string {
  if (!dateStr) return 'Never'
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return 'Never'
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  })
}

interface AdminUsersManagerProps {
  users: User[]
  userSearch: string
  setUserSearch: (search: string) => void
  usersRefreshing: boolean
  onRefreshUsers: () => Promise<void>
  onSelectCustomer: (user: User) => void
  getAdminHeaders: (additionalHeaders?: Record<string, string>) => HeadersInit
}

// Filter types
type StatusFilter = 'online' | 'hasOrders' | 'noOrders' | null
type DeviceFilter = 'desktop_web' | 'mobile_web' | 'mobile_app' | null

export default function AdminUsersManager({
  users,
  userSearch,
  setUserSearch,
  usersRefreshing,
  onRefreshUsers,
  onSelectCustomer,
  getAdminHeaders
}: AdminUsersManagerProps) {
  const [deletingUser, setDeletingUser] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(null)
  const [deviceFilter, setDeviceFilter] = useState<DeviceFilter>(null)

  // Toggle filter - clicking same filter again clears it
  const toggleStatusFilter = (filter: StatusFilter) => {
    setStatusFilter(prev => prev === filter ? null : filter)
  }
  const toggleDeviceFilter = (filter: DeviceFilter) => {
    setDeviceFilter(prev => prev === filter ? null : filter)
  }

  // Format currency in AED
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED'
    }).format(amount)
  }

  const handleDeleteUser = useCallback(async (userId: string, userEmail: string) => {
    if (!confirm(`Are you sure you want to delete user ${userEmail}? This action cannot be undone.`)) {
      return
    }

    setDeletingUser(userId)
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: getAdminHeaders()
      })

      if (!response.ok) {
        throw new Error(`Failed to delete user: ${response.status}`)
      }

      // Refresh users list
      await onRefreshUsers()
    } catch (error) {
      errorLog('Error deleting user:', error)
      // This will be handled by parent component's error handling
    } finally {
      setDeletingUser(null)
    }
  }, [getAdminHeaders, onRefreshUsers])

  const filteredUsers = users.filter(user => {
    // Filter out deleted users
    if (user.name === 'Deleted User' || user.email.includes('deleted+')) {
      return false
    }
    
    // Apply search filter
    const matchesSearch = user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      user.email.toLowerCase().includes(userSearch.toLowerCase())
    if (!matchesSearch) return false

    // Apply status filter
    if (statusFilter === 'online' && !isUserOnline(user.lastActiveAt)) return false
    if (statusFilter === 'hasOrders' && (!user.orderCount || user.orderCount === 0)) return false
    if (statusFilter === 'noOrders' && user.orderCount && user.orderCount > 0) return false

    // Apply device filter
    if (deviceFilter && user.lastLoginSource !== deviceFilter) return false

    return true
  })

  return (
    <div className="space-y-6">
      {/* Users Header */}
      <div className="bg-white rounded-lg border p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-lg p-2 mr-3">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Users</h2>
              <p className="text-sm text-gray-500">Manage registered users</p>
              <div className="flex items-center gap-2 mt-2 text-xs flex-wrap">
                {/* Status Filters */}
                <button
                  onClick={() => toggleStatusFilter('online')}
                  className={`flex items-center gap-1 px-2 py-1 rounded-full border transition-all cursor-pointer ${
                    statusFilter === 'online'
                      ? 'bg-green-100 border-green-400 ring-2 ring-green-300'
                      : 'border-gray-200 hover:border-green-300 hover:bg-green-50'
                  }`}
                  title="Filter: Online users"
                >
                  <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">Online</span>
                </button>
                <button
                  onClick={() => toggleStatusFilter('hasOrders')}
                  className={`flex items-center gap-1 px-2 py-1 rounded-full border transition-all cursor-pointer ${
                    statusFilter === 'hasOrders'
                      ? 'bg-green-100 border-green-400 ring-2 ring-green-300'
                      : 'border-gray-200 hover:border-green-300 hover:bg-green-50'
                  }`}
                  title="Filter: Users with orders"
                >
                  <div className="w-3 h-3 bg-green-50 border border-green-300 rounded"></div>
                  <span className="text-gray-700">Has orders</span>
                </button>
                <button
                  onClick={() => toggleStatusFilter('noOrders')}
                  className={`flex items-center gap-1 px-2 py-1 rounded-full border transition-all cursor-pointer ${
                    statusFilter === 'noOrders'
                      ? 'bg-gray-200 border-gray-400 ring-2 ring-gray-300'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  title="Filter: Users without orders"
                >
                  <div className="w-3 h-3 bg-white border border-gray-300 rounded"></div>
                  <span className="text-gray-700">No orders</span>
                </button>

                {/* Separator */}
                <div className="h-4 w-px bg-gray-300 mx-1"></div>

                {/* Device Filters */}
                <button
                  onClick={() => toggleDeviceFilter('desktop_web')}
                  className={`flex items-center gap-1 px-2 py-1 rounded-full border transition-all cursor-pointer ${
                    deviceFilter === 'desktop_web'
                      ? 'bg-gray-200 border-gray-400 ring-2 ring-gray-300'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  title="Filter: Desktop users"
                >
                  <Monitor className="h-3 w-3 text-gray-600" />
                  <span className="text-gray-700">Desktop</span>
                </button>
                <button
                  onClick={() => toggleDeviceFilter('mobile_web')}
                  className={`flex items-center gap-1 px-2 py-1 rounded-full border transition-all cursor-pointer ${
                    deviceFilter === 'mobile_web'
                      ? 'bg-blue-100 border-blue-400 ring-2 ring-blue-300'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                  title="Filter: Mobile Web users"
                >
                  <TabletSmartphone className="h-3 w-3 text-blue-600" />
                  <span className="text-gray-700">Mobile Web</span>
                </button>
                <button
                  onClick={() => toggleDeviceFilter('mobile_app')}
                  className={`flex items-center gap-1 px-2 py-1 rounded-full border transition-all cursor-pointer ${
                    deviceFilter === 'mobile_app'
                      ? 'bg-purple-100 border-purple-400 ring-2 ring-purple-300'
                      : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                  }`}
                  title="Filter: Mobile App users"
                >
                  <Smartphone className="h-3 w-3 text-purple-600" />
                  <span className="text-gray-700">App</span>
                </button>

                {/* Clear Filters */}
                {(statusFilter || deviceFilter) && (
                  <button
                    onClick={() => { setStatusFilter(null); setDeviceFilter(null); }}
                    className="flex items-center gap-1 px-2 py-1 rounded-full border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 transition-all cursor-pointer ml-1"
                    title="Clear all filters"
                  >
                    <span>Clear</span>
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm w-full sm:w-64"
              />
            </div>
            <button
              onClick={onRefreshUsers}
              disabled={usersRefreshing}
              className="inline-flex items-center justify-center px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 active:bg-gray-300 transition-colors disabled:opacity-50 text-sm sm:text-base w-full sm:w-auto touch-manipulation"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${usersRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Users List */}
      <div className="bg-white rounded-lg border">
        {/* Results count when filters are active */}
        {(statusFilter || deviceFilter || userSearch) && (
          <div className="px-4 py-2 bg-gray-50 border-b text-sm text-gray-600">
            Showing {filteredUsers.length} of {users.filter(u => u.name !== 'Deleted User' && !u.email.includes('deleted+')).length} users
            {statusFilter && <span className="ml-2 text-green-600">• {statusFilter === 'online' ? 'Online' : statusFilter === 'hasOrders' ? 'Has orders' : 'No orders'}</span>}
            {deviceFilter && <span className="ml-2 text-blue-600">• {deviceFilter === 'desktop_web' ? 'Desktop' : deviceFilter === 'mobile_web' ? 'Mobile Web' : 'App'}</span>}
            {userSearch && <span className="ml-2 text-purple-600">• Search: &quot;{userSearch}&quot;</span>}
          </div>
        )}
        {filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
              <Users className="h-12 w-12 text-gray-300" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No users found</h3>
            <p className="text-gray-400">
              {(statusFilter || deviceFilter || userSearch) 
                ? 'Try adjusting your filters or search criteria.' 
                : 'Users will appear here as they register.'}
            </p>
            {(statusFilter || deviceFilter) && (
              <button
                onClick={() => { setStatusFilter(null); setDeviceFilter(null); }}
                className="mt-4 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto -mx-3 sm:-mx-4 md:mx-0 scrollbar-hide">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-2 sm:px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">User</th>
                      <th className="px-2 sm:px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap hidden sm:table-cell">Contact</th>
                      <th className="px-2 sm:px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap hidden md:table-cell">Orders</th>
                      <th className="px-2 sm:px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap hidden lg:table-cell">Status</th>
                      <th className="px-2 sm:px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((user) => {
                      // Determine if user has orders
                      const hasOrders = (user.orderCount || 0) > 0
                      const online = isUserOnline(user.lastActiveAt)
                      
                      return (
                        <tr 
                          key={user.id} 
                          className={`hover:bg-gray-50 ${hasOrders ? 'bg-green-50' : ''}`}
                        >
                        <td className="px-2 sm:px-3 md:px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 relative">
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <span className="text-sm font-medium text-gray-700">
                                  {user.name?.charAt(0)?.toUpperCase() || '?'}
                                </span>
                              </div>
                              {/* Online indicator dot */}
                              {online && (
                                <div 
                                  className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 bg-green-500 border-2 border-white rounded-full animate-pulse"
                                  title="Online now"
                                />
                              )}
                            </div>
                            <div className="ml-4 min-w-0">
                              <div className="text-sm font-medium text-gray-900 flex items-center gap-1.5 flex-wrap">
                                {user.name || 'Unknown'}
                                {online && (
                                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-green-100 text-green-700">
                                    Online
                                  </span>
                                )}
                                {/* Login source device badge */}
                                {(() => {
                                  const { icon, label, color } = getLoginSourceInfo(user.lastLoginSource)
                                  if (icon) {
                                    const bgMap: Record<string, string> = {
                                      'text-purple-600': 'bg-purple-50 border-purple-200 text-purple-700',
                                      'text-blue-600': 'bg-blue-50 border-blue-200 text-blue-700',
                                      'text-gray-600': 'bg-gray-50 border-gray-200 text-gray-600',
                                    }
                                    const badgeStyle = bgMap[color] || 'bg-gray-50 border-gray-200 text-gray-600'
                                    return (
                                      <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded border text-[10px] font-medium ${badgeStyle}`} title={`Last login via ${label}`}>
                                        {icon}
                                        <span className="hidden sm:inline">{label}</span>
                                      </span>
                                    )
                                  }
                                  return null
                                })()}
                              </div>
                              <div className="text-sm text-gray-500 truncate">{user.email}</div>
                              {/* Activity & timestamps row */}
                              <div className="flex items-center gap-2 mt-0.5 text-[11px] text-gray-400 flex-wrap">
                                {/* Last active / online status */}
                                <span 
                                  className={`inline-flex items-center gap-0.5 ${online ? 'text-green-600 font-medium' : ''}`}
                                  title={`Last active: ${formatFullDateTime(user.lastActiveAt)}`}
                                >
                                  <Clock className="h-3 w-3" />
                                  {formatRelativeTime(user.lastActiveAt)}
                                </span>
                                {/* Last login timestamp */}
                                {user.lastLoginAt && (
                                  <>
                                    <span className="text-gray-300">·</span>
                                    <span title={`Last login: ${formatFullDateTime(user.lastLoginAt)}`}>
                                      Login {formatDateTime(user.lastLoginAt)}
                                    </span>
                                  </>
                                )}
                                {/* Registration date */}
                                <span className="text-gray-300 hidden lg:inline">·</span>
                                <span className="hidden lg:inline" title={`Registered: ${formatFullDateTime(user.createdAt)}`}>
                                  <UserPlus className="h-3 w-3 inline mr-0.5" />
                                  {formatDateTime(user.createdAt)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-2 sm:px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                          <div>
                            <div>{user.phone || 'No phone'}</div>
                            {user.address && (
                              <div className="text-xs text-gray-400 truncate max-w-32">{user.address}</div>
                            )}
                          </div>
                        </td>
                        <td className="px-2 sm:px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                          <div>
                            <div>{user.orderCount || 0} orders</div>
                            <div className="text-xs text-gray-400">
                              {formatCurrency(user.totalSpent || 0)} total
                            </div>
                          </div>
                        </td>
                        <td className="px-2 sm:px-3 md:px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                          <div className="flex flex-col gap-1">
                            {user.isAdmin && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                Admin
                              </span>
                            )}
                            {user.canSeePrices && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Can see prices
                              </span>
                            )}
                            {user.discountType && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {user.discountType} {user.discountPercentage}%
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-2 sm:px-3 md:px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => onSelectCustomer(user)}
                              className="text-primary-600 hover:text-primary-900 transition-colors touch-manipulation p-1"
                              title="View Details"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id, user.email)}
                              disabled={deletingUser === user.id}
                              className="text-red-600 hover:text-red-900 transition-colors disabled:opacity-50 touch-manipulation p-1"
                              title="Delete User"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}