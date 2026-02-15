'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import dynamic from 'next/dynamic'
import { RefreshCw, Check, X as XIcon, AlertCircle } from 'lucide-react'
import AdminLogin from '@/components/AdminLogin'
import AdminTabNavigation from '@/components/admin/AdminTabNavigation'
import { Order, OrderItem } from '@prisma/client'
import { fetchCsrfToken, getCsrfHeaders, addCsrfToBody } from '@/lib/csrfClient'
import { debugLog, errorLog } from '@/lib/logger'
import { safeJsonParse } from '@/lib/utils'
import type { Product } from '@/types'

// Loading component for dynamic imports
const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-12">
    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
  </div>
)

// Code-split heavy components for better initial load time
const AnalyticsDashboard = dynamic(() => import('@/components/AnalyticsDashboard'), {
  loading: () => <LoadingSpinner />,
  ssr: false
})

const AdvancedReportingDashboard = dynamic(() => import('@/components/AdvancedReportingDashboard'), {
  loading: () => <LoadingSpinner />,
  ssr: false
})

const UserSegmentation = dynamic(() => import('@/components/UserSegmentation'), {
  loading: () => <LoadingSpinner />,
  ssr: false
})

const CustomerProfile = dynamic(() => import('@/components/CustomerProfile'), {
  loading: () => <LoadingSpinner />,
  ssr: false
})

const ProductForm = dynamic(() => import('@/components/ProductForm'), {
  loading: () => <LoadingSpinner />,
  ssr: false
})

const BlogManagement = dynamic(() => import('@/components/BlogManagement'), {
  loading: () => <LoadingSpinner />,
  ssr: false
})

const AdminUsersManager = dynamic(() => import('@/components/admin/AdminUsersManager'), {
  loading: () => <LoadingSpinner />,
  ssr: false
})

const AdminOrdersManager = dynamic(() => import('@/components/admin/AdminOrdersManager'), {
  loading: () => <LoadingSpinner />,
  ssr: false
})

const AdminProductsManager = dynamic(() => import('@/components/admin/AdminProductsManager'), {
  loading: () => <LoadingSpinner />,
  ssr: false
})

const AdminPromotionsManager = dynamic(() => import('@/components/admin/AdminPromotionsManager'), {
  loading: () => <LoadingSpinner />,
  ssr: false
})

const AdminFaqManager = dynamic(() => import('@/components/admin/AdminFaqManager'), {
  loading: () => <LoadingSpinner />,
  ssr: false
})

const ChatbotDashboard = dynamic(() => import('@/components/admin/ChatbotDashboard'), {
  loading: () => <LoadingSpinner />,
  ssr: false
})

const OrderDetails = dynamic(() => import('@/components/admin/OrderDetails'), {
  loading: () => <LoadingSpinner />,
  ssr: false
})

// Custom type that includes the items relation
type OrderWithItems = Order & {
  items: OrderItem[]
}

interface User {
  id: string
  name: string
  email: string
  phone?: string | null
  address?: string | null
  birthday?: string | null
  profilePicture?: string | null
  isAdmin?: boolean
  canSeePrices?: boolean
  discountType?: string | null
  discountPercentage?: number | null
  lastLoginAt?: string | null
  createdAt: string
  updatedAt?: string | null
  orderCount?: number
  totalSpent?: number
  lastOrderDate?: string | null
}

// Toast notification types
type ToastType = 'success' | 'error' | 'warning'
type Toast = {
  id: number
  message: string
  type: ToastType
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([])
  const [orders, setOrders] = useState<OrderWithItems[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [, setLoading] = useState(true)
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [usersRefreshing, setUsersRefreshing] = useState(false)
  const [ordersRefreshing, setOrdersRefreshing] = useState(false)
  const [productsRefreshing, setProductsRefreshing] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isCheckingSession, setIsCheckingSession] = useState(true)
  const [adminUser, setAdminUser] = useState<{ email: string; name: string } | null>(null)
  const [userSearch, setUserSearch] = useState('')
  
  // Toast state
  const [toasts, setToasts] = useState<Toast[]>([])
  const toastIdCounter = useRef(0)
  
  // Add toast notification
  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = toastIdCounter.current++
    setToasts(prev => [...prev, { id, message, type }])
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id))
    }, 4000)
  }, [])

  // Remove toast manually
  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])
  
  // Refs to track latest values for interval closure
  const adminUserRef = useRef(adminUser)
  const isAuthenticatedRef = useRef(isAuthenticated)
  
  // Update refs when values change
  useEffect(() => {
    adminUserRef.current = adminUser
    isAuthenticatedRef.current = isAuthenticated
  }, [adminUser, isAuthenticated])

  // Fetch CSRF token on mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchCsrfToken().catch(err => {
        errorLog('Failed to fetch CSRF token:', err)
      })
    }
  }, [isAuthenticated])

  // Helper function to get admin auth headers with CSRF
  const getAdminHeaders = useCallback((additionalHeaders: Record<string, string> = {}): HeadersInit => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...additionalHeaders,
      ...getCsrfHeaders() as Record<string, string>
    }
    
    if (adminUser?.email) {
      headers['X-Admin-Email'] = adminUser.email
    }
    
    return headers as HeadersInit
  }, [adminUser?.email])
  const [activeTab, setActiveTab] = useState<'analytics' | 'reporting' | 'segmentation' | 'users' | 'orders' | 'products' | 'promo' | 'blog' | 'faq' | 'chatbot'>('analytics')
  const [selectedOrder, setSelectedOrder] = useState<OrderWithItems | null>(null)
  const [selectedCustomer, setSelectedCustomer] = useState<User | null>(null)
  const [showProductForm, setShowProductForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])
  const [isDeletingOrders, setIsDeletingOrders] = useState(false)
  
  const fetchUsers = useCallback(async (search?: string) => {
    // Don't fetch if not authenticated or adminUser not set
    if (!isAuthenticated || !adminUser?.email) {
      debugLog('Cannot fetch users: Not authenticated or admin user not set', {
        isAuthenticated,
        adminUserEmail: adminUser?.email
      })
      setUsers([])
      setLoading(false)
      return
    }
    
    try {
      setLoading(true)
      const url = search && search.length > 0
        ? `/api/admin/users?search=${encodeURIComponent(search)}&limit=1000`
        : '/api/admin/users?limit=1000'
      
      debugLog('Fetching users:', { url, search, adminEmail: adminUser.email })
      
      const response = await fetch(url, {
        headers: getAdminHeaders()
      })
      
      debugLog('Users API response status:', response.status, response.statusText)
      
      if (!response.ok) {
        let errorData
        try {
          const errorText = await response.text()
          debugLog('Error response text:', errorText)
          try {
            errorData = JSON.parse(errorText)
          } catch {
            errorData = { error: errorText, raw: errorText }
          }
        } catch {
          errorData = { error: 'Failed to parse error response' }
        }
        errorLog('Failed to fetch users:', {
          status: response.status,
          statusText: response.statusText,
          errorData,
          url: response.url
        })
        setUsers([])
        setLoading(false)
        return
      }
      
      const data = await response.json()
      debugLog('Users API response:', { success: data.success, userCount: data.users?.length || 0, total: data.total })
      
      if (data.success && Array.isArray(data.users)) {
        setUsers(data.users)
        debugLog(`✅ Users set: ${data.users.length} users`)
      } else {
        errorLog('Invalid users response:', data)
        setUsers([])
      }
    } catch (error) {
      errorLog('Error fetching users:', error)
      setUsers([])
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated, adminUser, getAdminHeaders])

  const fetchProducts = useCallback(async () => {
    try {
      setProductsRefreshing(true)
      const response = await fetch('/api/admin/products', {
        headers: getAdminHeaders()
      })
      const data = await response.json()
      if (data.success) {
        setProducts(data.products)
      }
    } catch (error) {
      errorLog('Error fetching products:', error)
    } finally {
      setProductsRefreshing(false)
    }
  }, [getAdminHeaders])



  const fetchOrders = useCallback(async () => {
    // Don't fetch if not authenticated or adminUser not set
    if (!isAuthenticated || !adminUser?.email) {
      debugLog('Cannot fetch orders: Not authenticated or admin user not set', {
        isAuthenticated,
        adminUserEmail: adminUser?.email
      })
      setOrders([])
      setOrdersLoading(false)
      return
    }
    
    try {
      setOrdersLoading(true)
      const headers = getAdminHeaders()
      const headersObj = headers as Record<string, string>
      debugLog('Fetching orders:', {
        adminEmail: adminUser.email,
        headers: Object.keys(headersObj),
        hasXAdminEmail: !!headersObj['X-Admin-Email']
      })
      
      // Add timeout to prevent hanging
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout
      
      const response = await fetch('/api/admin/orders', {
        headers: headers,
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      
      debugLog('Response status:', response.status, response.statusText)
      
      if (!response.ok) {
        const errorText = await response.text()
        errorLog('Admin orders API error:', response.status, errorText)
        setOrders([])
        setOrdersLoading(false)
        return
      }
      
      const data = await response.json()
      debugLog('Admin orders API response:', {
        success: data.success,
        ordersCount: data.orders?.length || 0,
        orders: data.orders?.slice(0, 2) // Log first 2 orders as sample
      })
      
      if (data.success) {
        debugLog(`Setting ${data.orders?.length || 0} orders`)
        setOrders(data.orders || [])
      } else {
        errorLog('Failed to fetch orders:', data.error)
        setOrders([])
      }
    } catch (error) {
      errorLog('Error fetching orders:', error)
      if (error instanceof Error && error.name === 'AbortError') {
        errorLog('Request timed out after 10 seconds')
        showToast('Request timed out. Please check your connection and try again.', 'error')
      }
      setOrders([])
      setOrdersLoading(false)
    } finally {
      setOrdersLoading(false)
    }
  }, [isAuthenticated, adminUser, getAdminHeaders])

  const refreshUsers = async () => {
    setUsersRefreshing(true)
    await fetchUsers(userSearch)
    setUsersRefreshing(false)
  }

  const refreshOrders = async () => {
    setOrdersRefreshing(true)
    await fetchOrders()
    setOrdersRefreshing(false)
  }

  const refreshProducts = async () => {
    setProductsRefreshing(true)
    await fetchProducts()
    setProductsRefreshing(false)
  }

  // Handler for selecting a customer from users manager
  const handleSelectCustomer = (user: User) => {
    setSelectedCustomer(user)
  }

  // Handler for selecting an order from orders manager
  const handleSelectOrder = (order: OrderWithItems) => {
    setSelectedOrder(order)
  }

  // Handler for selecting multiple orders
  const handleSelectOrders = (orderIds: string[]) => {
    setSelectedOrders(orderIds)
  }

  // Handler for deleting selected orders
  const handleDeleteOrders = async () => {
    if (selectedOrders.length === 0) return

    const confirmMessage = `Are you sure you want to delete ${selectedOrders.length} order${selectedOrders.length === 1 ? '' : 's'}? This action cannot be undone.`
    
    if (!confirm(confirmMessage)) {
      return
    }

    setIsDeletingOrders(true)
    try {
      // Delete orders one by one
      for (const orderId of selectedOrders) {
        const response = await fetch(`/api/admin/orders/${orderId}`, {
          method: 'DELETE',
          headers: getAdminHeaders()
        })

        if (!response.ok) {
          throw new Error(`Failed to delete order ${orderId}: ${response.status}`)
        }
      }

      // Clear selection and refresh orders
      setSelectedOrders([])
      await fetchOrders()
    } catch (error) {
      errorLog('Error deleting orders:', error)
      alert('Failed to delete some orders. Please try again.')
    } finally {
      setIsDeletingOrders(false)
    }
  }

  // Handler for showing product form
  const handleShowProductForm = () => {
    setEditingProduct(null)
    setShowProductForm(true)
  }

  // Handler for editing a product
  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setShowProductForm(true)
  }

  const updateUser = async (userId: string, updates: Partial<User>) => {
    try {
      // Ensure CSRF token is available
      const csrfToken = await fetchCsrfToken()
      if (!csrfToken) {
        showToast('Security error: Could not verify request. Please refresh the page and try again.', 'error')
        return false
      }

      debugLog('Updating user:', { userId, updates })
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: getAdminHeaders(),
        body: JSON.stringify(addCsrfToBody(updates))
      })
      
      if (response.ok) {
        // Update local state
        setUsers(users.map(user => 
          user.id === userId ? { ...user, ...updates } : user
        ))
        debugLog('User updated successfully')
        return true
      } else {
        const errorData = await response.json()
        errorLog('Failed to update user:', errorData)
        alert(`Failed to update user: ${errorData.error || 'Unknown error'}`)
        return false
      }
    } catch (error) {
      errorLog('Error updating user:', error)
      alert('Failed to update user')
      return false
    }
  }

  const deleteUser = async (userId: string) => {
    try {
      // Ensure CSRF token is available
      const csrfToken = await fetchCsrfToken()
      if (!csrfToken) {
        alert('Security error: Could not verify request. Please refresh the page and try again.')
        return
      }

      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: getAdminHeaders(),
        body: JSON.stringify(addCsrfToBody({}))
      })
      
      if (response.ok) {
        setUsers(users.filter(user => user.id !== userId))
      } else {
        const errorData = await response.json()
        errorLog(`Failed to delete user: ${errorData.error || 'Unknown error'}`)
      }
    } catch (error) {
      errorLog('Error deleting user:', error)
    }
  }


  const handleAdminLogin = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setIsAuthenticated(true)
        setAdminUser({ email: data.user.email, name: data.user.name })
        
        // Store admin session in localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('admin_session', JSON.stringify({
            email: data.user.email,
            name: data.user.name,
            authenticatedAt: new Date().toISOString()
          }))
        }
        
        return true
      } else {
        errorLog('Admin login failed:', data.error)
        return false
      }
    } catch (error) {
      errorLog('Admin login error:', error)
      return false
    }
  }

  const handleAdminLogout = () => {
    setIsAuthenticated(false)
    setAdminUser(null)
    
    // Clear admin session from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_session')
    }
  }

  // Check for existing admin session on mount
  useEffect(() => {
    const checkAdminSession = async () => {
      setIsCheckingSession(true)
      
      if (typeof window === 'undefined') {
        setIsCheckingSession(false)
        return
      }

      try {
        const savedSession = localStorage.getItem('admin_session')
        
        if (!savedSession) {
          setIsCheckingSession(false)
          return
        }

        const session = safeJsonParse<{ authenticatedAt: string; [key: string]: unknown }>(savedSession, { authenticatedAt: new Date().toISOString() })
        
        // Verify session is still valid (check if less than 24 hours old)
        const authenticatedAt = new Date(session.authenticatedAt)
        const hoursSinceAuth = (Date.now() - authenticatedAt.getTime()) / (1000 * 60 * 60)
        
        if (hoursSinceAuth > 24) {
          // Session expired (24 hours)
          localStorage.removeItem('admin_session')
          setIsCheckingSession(false)
          return
        }

        // Verify session with server
        const response = await fetch('/api/auth/admin-verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: session.email }),
        })

        const data = await response.json()

        if (response.ok && data.success) {
          setIsAuthenticated(true)
          setAdminUser({ email: data.user.email, name: data.user.name })
        } else {
          // Invalid session, clear it
          localStorage.removeItem('admin_session')
        }
      } catch (error) {
        errorLog('Error checking admin session:', error)
        localStorage.removeItem('admin_session')
      } finally {
        setIsCheckingSession(false)
      }
    }

    checkAdminSession()
  }, [])

  useEffect(() => {
    // Wait for authentication and adminUser to be set before fetching
    if (isAuthenticated && !isCheckingSession && adminUser?.email) {
      debugLog('Admin authenticated, fetching data...', { adminEmail: adminUser.email })
      
      // Initial fetch
      fetchUsers()
      fetchOrders()
      fetchProducts()
      
      // Auto-refresh users and products every 30 seconds to show new registrations/logins
      // Orders are not auto-refreshed to prevent disruption while managing orders
      const refreshInterval = setInterval(() => {
        // Use refs to get latest values in closure
        if (isAuthenticatedRef.current && adminUserRef.current?.email) {
          fetchUsers()
          // fetchOrders() - Removed auto-refresh for orders
          fetchProducts()
        }
      }, 30000) // 30 seconds
      
      return () => {
        clearInterval(refreshInterval)
      }
    }
    
    // Not authenticated yet - log and return undefined (no cleanup needed)
    debugLog('Waiting for authentication...', {
      isAuthenticated,
      isCheckingSession,
      hasAdminUser: !!adminUser,
      adminEmail: adminUser?.email
    })
    
    return undefined
    // Note: fetchUsers, fetchOrders, and fetchProducts are stable useCallback hooks
    // that depend on values already in the dependency array. We use refs inside the
    // interval callback to avoid stale closures, so we intentionally exclude the
    // functions from the dependency array to prevent unnecessary effect re-runs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isCheckingSession, adminUser?.email])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED'
    }).format(amount)
  }

  if (isCheckingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking admin session...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleAdminLogin} />
  }

  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 md:py-16">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 md:mb-8">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800">Admin Dashboard</h1>
            {adminUser && (
              <span className="text-xs sm:text-sm text-gray-600 sm:ml-4 break-all sm:break-normal">
                ({adminUser.name} - {adminUser.email})
              </span>
            )}
          </div>
          <button
            onClick={handleAdminLogout}
            className="px-4 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm sm:text-base w-full sm:w-auto touch-manipulation"
          >
            Logout
          </button>
        </div>
        
        {/* Tab Navigation */}
        <AdminTabNavigation
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          userCount={users.length}
          orderCount={orders.length}
          productCount={products.length}
        />

        <div className="bg-white rounded-lg shadow-sm border p-3 sm:p-4 md:p-6 lg:p-8">
          {activeTab === 'analytics' && (
            <AnalyticsDashboard 
              onCustomerClick={async (userEmail) => {
                // Find the customer by email and set as selected
                const customer = users.find(user => user.email === userEmail)
                if (customer) {
                  setSelectedCustomer(customer)
                  setActiveTab('users') // Switch to users tab to show the profile
                }
              }}
            />
          )}

          {activeTab === 'reporting' && (
            <AdvancedReportingDashboard 
              adminEmail={adminUser?.email}
              onCustomerClick={async (userEmail) => {
                // Find the customer by email and set as selected
                const customer = users.find(user => user.email === userEmail)
                if (customer) {
                  setSelectedCustomer(customer)
                  setActiveTab('users') // Switch to users tab to show the profile
                }
              }}
            />
          )}

          {activeTab === 'segmentation' && (
            <UserSegmentation
              users={users}
              onUserClick={async (userEmail) => {
                // Find the customer by email and set as selected
                const customer = users.find(user => user.email === userEmail)
                if (customer) {
                  setSelectedCustomer(customer)
                  setActiveTab('users') // Switch to users tab to show the profile
                }
              }}
            />
          )}

          {activeTab === 'users' && (
            <>
              {selectedCustomer ? (
                <CustomerProfile
                  customer={selectedCustomer}
                  onBack={() => setSelectedCustomer(null)}
                  onUpdateCustomer={async (id, updates) => {
                    await updateUser(id, updates)
                    setSelectedCustomer({ ...selectedCustomer, ...updates })
                  }}
                  onDeleteCustomer={async (id) => {
                    await deleteUser(id)
                    setSelectedCustomer(null)
                  }}
                />
              ) : (
                <AdminUsersManager
                  users={users}
                  userSearch={userSearch}
                  setUserSearch={setUserSearch}
                  usersRefreshing={usersRefreshing}
                  onRefreshUsers={refreshUsers}
                  onSelectCustomer={handleSelectCustomer}
                  getAdminHeaders={getAdminHeaders}
                />
              )}
            </>
          )}

          {activeTab === 'segmentation' && (
            <UserSegmentation 
              users={users}
              onUserClick={async (userEmail) => {
                const customer = users.find(user => user.email === userEmail)
                if (customer) {
                  setSelectedCustomer(customer)
                  setActiveTab('users')
                }
              }}
            />
          )}
          {activeTab === 'orders' && (
            <>
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">Order Management</h2>
                <button
                  onClick={refreshOrders}
                  disabled={ordersRefreshing}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base w-full sm:w-auto touch-manipulation"
                >
                  <RefreshCw className={`h-4 w-4 ${ordersRefreshing ? 'animate-spin' : ''}`} />
                  {ordersRefreshing ? 'Refreshing...' : 'Refresh'}
                </button>
              </div>

              {/* Order Summary */}
              {!ordersLoading && orders.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">Order Summary</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
                    <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                      <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Orders</p>
                      <p className="text-xl sm:text-2xl font-bold text-gray-900">{orders.length}</p>
                    </div>
                    <div className="p-3 sm:p-4 bg-blue-50 rounded-lg">
                      <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Revenue</p>
                      <p className="text-lg sm:text-xl md:text-2xl font-bold text-blue-600 break-words">{formatCurrency(orders.reduce((sum, order) => sum + order.total, 0))}</p>
                    </div>
                    <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                      <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Subtotal</p>
                      <p className="text-lg sm:text-xl font-semibold text-gray-900 break-words">{formatCurrency(orders.reduce((sum, order) => sum + (order.subtotal || 0), 0))}</p>
                    </div>
                    <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                      <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Shipping</p>
                      <p className="text-lg sm:text-xl font-semibold text-gray-900 break-words">{formatCurrency(orders.reduce((sum, order) => sum + (order.shipping || 0), 0))}</p>
                    </div>
                    <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                      <p className="text-xs sm:text-sm text-gray-600 mb-1">Total VAT</p>
                      <p className="text-lg sm:text-xl font-semibold text-gray-900 break-words">{formatCurrency(orders.reduce((sum, order) => sum + (order.vat || 0), 0))}</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Total Items</p>
                    <p className="text-xl font-semibold text-gray-900">
                      {orders.reduce((sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0)} items
                    </p>
                  </div>
                </div>
              )}
              
              {selectedOrder && selectedOrder.id ? (
                <OrderDetails 
                  order={selectedOrder} 
                  onBack={() => setSelectedOrder(null)}
                  onUpdateStatus={async (orderId, status) => {
                    try {
                      // Ensure CSRF token is available
                      const csrfToken = await fetchCsrfToken()
                      if (!csrfToken) {
                        alert('Security error: Could not verify request. Please refresh the page and try again.')
                        return
                      }

                      const response = await fetch(`/api/admin/orders/${orderId}`, {
                        method: 'PUT',
                        headers: getAdminHeaders(),
                        body: JSON.stringify(addCsrfToBody({ status }))
                      })
                      
                      if (response.ok) {
                        setOrders(orders.map(order => 
                          order.id && order.id === orderId ? { ...order, status } : order
                        ))
                        setSelectedOrder(selectedOrder ? { ...selectedOrder, status } : null)
                        showToast('Order status updated successfully!', 'success')
                      } else {
                        const errorData = await response.json()
                        showToast(`Failed to update order status: ${errorData.error || 'Unknown error'}`, 'error')
                      }
                    } catch (error) {
                      errorLog('Error updating order status:', error)
                      showToast('Failed to update order status', 'error')
                    }
                  }}
                  getAdminHeaders={getAdminHeaders}
                  showToast={showToast}
                  onMoySkladPushed={(orderId, moySkladOrderId) => {
                    // Update orders list to reflect the sync
                    setOrders(orders.map(order =>
                      order.id === orderId ? { ...order, moySkladOrderId } : order
                    ))
                    if (selectedOrder && selectedOrder.id === orderId) {
                      setSelectedOrder({ ...selectedOrder, moySkladOrderId })
                    }
                  }}
                />
              ) : (
                <AdminOrdersManager
                  orders={orders}
                  ordersLoading={ordersLoading}
                  ordersRefreshing={ordersRefreshing}
                  selectedOrders={selectedOrders}
                  isDeletingOrders={isDeletingOrders}
                  onRefreshOrders={refreshOrders}
                  onSelectOrder={handleSelectOrder}
                  onSelectOrders={handleSelectOrders}
                  onDeleteOrders={handleDeleteOrders}
                  getAdminHeaders={getAdminHeaders}
                />
              )}
            </>
          )}

          {activeTab === 'products' && (
            <>
              {showProductForm ? (
                <ProductForm
                  product={editingProduct}
                  onCancel={() => {
                    setShowProductForm(false)
                    setEditingProduct(null)
                  }}
                  onSave={async (productData: Partial<Product>) => {
                    try {
                      const csrfToken = await fetchCsrfToken()
                      if (!csrfToken) {
                        alert('Security error: Could not verify request. Please refresh the page and try again.')
                        return false
                      }

                      const url = editingProduct ? `/api/admin/products/${editingProduct.id}` : '/api/admin/products'
                      const method = editingProduct ? 'PUT' : 'POST'
                      
                      const response = await fetch(url, {
                        method,
                        headers: getAdminHeaders(),
                        body: JSON.stringify(addCsrfToBody(productData))
                      })
                      
                      if (response.ok) {
                        await fetchProducts()
                        setShowProductForm(false)
                        setEditingProduct(null)
                        return true
                      } else {
                        const errorData = await response.json()
                        errorLog('Product save failed:', errorData)
                        showToast(`Failed to save product: ${errorData.error || 'Unknown error'}`, 'error')
                        return false
                      }
                    } catch (error) {
                      errorLog('Error saving product:', error)
                      showToast('Failed to save product', 'error')
                      return false
                    }
                  }}
                />
              ) : (
                <AdminProductsManager
                  products={products}
                  productsRefreshing={productsRefreshing}
                  onRefreshProducts={refreshProducts}
                  onShowProductForm={handleShowProductForm}
                  onEditProduct={handleEditProduct}
                />
              )}
            </>
          )}
          
          {activeTab === 'promo' && (
            <AdminPromotionsManager
              getAdminHeaders={getAdminHeaders}
              showToast={showToast}
            />
          )}

          {activeTab === 'reporting' && (
            <AdvancedReportingDashboard 
              onCustomerClick={async (userEmail) => {
                // Find the customer by email and set as selected
                const customer = users.find(user => user.email === userEmail)
                if (customer) {
                  setSelectedCustomer(customer)
                  setActiveTab('users') // Switch to users tab to show the profile
                }
              }}
              adminEmail={adminUser?.email || ''}
            />
          )}
          {activeTab === 'blog' && (
            <BlogManagement adminEmail={adminUser?.email || ''} />
          )}

          {activeTab === 'faq' && (
            <AdminFaqManager
              getAdminHeaders={getAdminHeaders}
              showToast={showToast}
            />
          )}

          {activeTab === 'chatbot' && (
            <ChatbotDashboard getAdminHeaders={getAdminHeaders} />
          )}
        </div>
      </div>

      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-start gap-3 p-4 rounded-xl shadow-lg backdrop-blur-sm transition-all duration-300 animate-slide-in ${
              toast.type === 'success' ? 'bg-green-50/95 border border-green-200' :
              toast.type === 'error' ? 'bg-red-50/95 border border-red-200' :
              'bg-yellow-50/95 border border-yellow-200'
            }`}
          >
            {toast.type === 'success' && <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />}
            {toast.type === 'error' && <XIcon className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />}
            {toast.type === 'warning' && <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />}
            
            <p className={`text-sm flex-1 ${
              toast.type === 'success' ? 'text-green-800' :
              toast.type === 'error' ? 'text-red-800' :
              'text-yellow-800'
            }`}>
              {toast.message}
            </p>
            
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
            >
              <XIcon className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
