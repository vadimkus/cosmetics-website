'use client'

import { useState, useCallback } from 'react'
import { Users, Search, RefreshCw, Edit, Trash2, Monitor, Smartphone, TabletSmartphone } from 'lucide-react'
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
        label: 'Mobile App',
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

// Helper function to format last active time
function formatLastActive(lastActiveAt: string | null | undefined): string {
  if (!lastActiveAt) return 'Never'
  
  const now = Date.now()
  const timestamp = new Date(lastActiveAt).getTime()
  const diffMs = now - timestamp
  const diffMinutes = Math.floor(diffMs / (60 * 1000))
  const diffHours = Math.floor(diffMs / (60 * 60 * 1000))
  const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000))

  if (diffMinutes < 5) return 'Online now'
  if (diffMinutes < 60) return `${diffMinutes}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays}d ago`
  
  return new Date(lastActiveAt).toLocaleDateString()
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
    return user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      user.email.toLowerCase().includes(userSearch.toLowerCase())
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
              <div className="flex items-center gap-3 mt-2 text-xs flex-wrap">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600">Online</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-green-50 border border-green-200 rounded"></div>
                  <span className="text-gray-600">Has orders</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-white border border-gray-200 rounded"></div>
                  <span className="text-gray-600">No orders</span>
                </div>
                <div className="flex items-center gap-1 ml-2 border-l pl-2 border-gray-300">
                  <Monitor className="h-3 w-3 text-gray-600" />
                  <span className="text-gray-600">Desktop</span>
                </div>
                <div className="flex items-center gap-1">
                  <TabletSmartphone className="h-3 w-3 text-blue-600" />
                  <span className="text-gray-600">Mobile Web</span>
                </div>
                <div className="flex items-center gap-1">
                  <Smartphone className="h-3 w-3 text-purple-600" />
                  <span className="text-gray-600">App</span>
                </div>
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
        {filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
              <Users className="h-12 w-12 text-gray-300" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No users found</h3>
            <p className="text-gray-400">
              {userSearch ? 'Try adjusting your search criteria.' : 'Users will appear here as they register.'}
            </p>
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
                              {/* Online indicator */}
                              {isUserOnline(user.lastActiveAt) && (
                                <div 
                                  className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 bg-green-500 border-2 border-white rounded-full"
                                  title="Online now"
                                />
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                                {user.name || 'Unknown'}
                                {isUserOnline(user.lastActiveAt) && (
                                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-green-100 text-green-700">
                                    Online
                                  </span>
                                )}
                              </div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                              {/* Last active time with login source icon */}
                              <div className="text-xs text-gray-400 flex items-center gap-1.5">
                                {formatLastActive(user.lastActiveAt)}
                                {user.lastLoginSource && (() => {
                                  const { icon, label, color } = getLoginSourceInfo(user.lastLoginSource)
                                  return icon ? (
                                    <span className={`${color} flex items-center`} title={label}>
                                      {icon}
                                    </span>
                                  ) : null
                                })()}
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