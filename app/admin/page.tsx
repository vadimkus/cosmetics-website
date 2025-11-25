'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import { User as UserIcon, Package, Clock, CheckCircle, Truck, X, Trash2, RefreshCw, ArrowLeft, BarChart3, Plus, Edit, Image as ImageIcon, Shield, FileText } from 'lucide-react'
import AdminLogin from '@/components/AdminLogin'
import AnalyticsDashboard from '@/components/AnalyticsDashboard'
import CustomerProfile from '@/components/CustomerProfile'
import ProductForm from '@/components/ProductForm'
import BlogManagement from '@/components/BlogManagement'
import { Order, OrderItem } from '@prisma/client'
import { fetchCsrfToken, getCsrfHeaders, addCsrfToBody } from '@/lib/csrfClient'
import { debugLog, errorLog } from '@/lib/logger'
import StatusBadge from '@/components/shared/StatusBadge'
import { safeJsonParse } from '@/lib/utils'

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
}

interface Product {
  id: string
  name: string
  price: number
  description: string
  image: string
  images: string | null // JSON array of all images
  category: string
  inStock: boolean
  size?: string | null
  createdAt: string
  updatedAt: string
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([])
  const [orders, setOrders] = useState<OrderWithItems[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [usersRefreshing, setUsersRefreshing] = useState(false)
  const [ordersRefreshing, setOrdersRefreshing] = useState(false)
  const [productsRefreshing, setProductsRefreshing] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isCheckingSession, setIsCheckingSession] = useState(true)
  const [adminUser, setAdminUser] = useState<{ email: string; name: string } | null>(null)
  
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
  const [activeTab, setActiveTab] = useState<'analytics' | 'users' | 'orders' | 'products' | 'blog'>('analytics')
  const [selectedOrder, setSelectedOrder] = useState<OrderWithItems | null>(null)
  const [selectedCustomer, setSelectedCustomer] = useState<User | null>(null)
  const [showProductForm, setShowProductForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])
  const [isDeletingOrders, setIsDeletingOrders] = useState(false)

  const fetchUsers = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/users', {
        headers: getAdminHeaders()
      })
      const data = await response.json()
      if (data.success) {
        setUsers(data.users)
      }
    } catch (error) {
      errorLog('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }, [getAdminHeaders])

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

  const saveProduct = async (productData: Partial<Product>) => {
    try {
      // Ensure CSRF token is available
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
        await fetchProducts() // Refresh products list
        setShowProductForm(false)
        setEditingProduct(null)
        return true
      } else {
        const errorData = await response.json()
        errorLog('Product save failed:', errorData)
        alert(`Failed to save product: ${errorData.error || 'Unknown error'}`)
        return false
      }
    } catch (error) {
      errorLog('Error saving product:', error)
      alert('Failed to save product')
      return false
    }
  }

  const deleteProduct = async (productId: string, productName: string) => {
    if (!confirm(`Are you sure you want to delete product "${productName}"? This action cannot be undone.`)) {
      return
    }

    try {
      // Ensure CSRF token is available
      const csrfToken = await fetchCsrfToken()
      if (!csrfToken) {
        alert('Security error: Could not verify request. Please refresh the page and try again.')
        return
      }

      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
        headers: getAdminHeaders(),
        body: JSON.stringify(addCsrfToBody({}))
      })
      
      if (response.ok) {
        await fetchProducts() // Refresh products list
        alert('Product deleted successfully')
      } else {
        const errorData = await response.json()
        errorLog('Delete failed:', errorData)
        alert(`Failed to delete product: ${errorData.error || 'Unknown error'}`)
      }
    } catch (error) {
      errorLog('Error deleting product:', error)
      alert('Failed to delete product')
    }
  }

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
        alert('Request timed out. Please check your connection and try again.')
      }
      setOrders([])
      setOrdersLoading(false)
    } finally {
      setOrdersLoading(false)
    }
  }, [isAuthenticated, adminUser, getAdminHeaders])

  const refreshUsers = async () => {
    setUsersRefreshing(true)
    await fetchUsers()
    setUsersRefreshing(false)
  }

  const refreshOrders = async () => {
    setOrdersRefreshing(true)
    await fetchOrders()
    setOrdersRefreshing(false)
  }

  const updateUser = async (userId: string, updates: Partial<User>) => {
    try {
      // Ensure CSRF token is available
      const csrfToken = await fetchCsrfToken()
      if (!csrfToken) {
        alert('Security error: Could not verify request. Please refresh the page and try again.')
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

  const deleteOrder = async (orderId: string) => {
    if (!orderId) {
      alert('Error: Order ID is missing. Please refresh the page and try again.')
      return
    }

    // Confirm deletion
    if (!confirm(`Are you sure you want to delete this order? This action cannot be undone.`)) {
      return
    }

    try {
      // Ensure CSRF token is available
      const csrfToken = await fetchCsrfToken()
      if (!csrfToken) {
        alert('Security error: Could not verify request. Please refresh the page and try again.')
        return
      }

      debugLog(`🗑️ Attempting to delete order with ID: ${orderId}`)
      
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'DELETE',
        headers: getAdminHeaders(),
        body: JSON.stringify(addCsrfToBody({}))
      })
      
      const responseData = await response.json()
      
      if (response.ok) {
        debugLog(`✅ Order deleted successfully: ${orderId}`)
        setOrders(orders.filter(order => order.id && order.id !== orderId))
        alert('Order deleted successfully!')
      } else {
        const errorMessage = responseData.error || responseData.message || 'Unknown error'
        errorLog(`❌ Failed to delete order: ${errorMessage}`)
        errorLog(`❌ Response status: ${response.status}`)
        errorLog(`❌ Full response:`, JSON.stringify(responseData, null, 2))
        alert(`Failed to delete order: ${errorMessage}\n\nStatus: ${response.status}\n\nPlease check the console for more details.`)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      errorLog('❌ Error deleting order:', error)
      alert(`Error deleting order: ${errorMessage}\n\nPlease check the console for more details.`)
    }
  }

  const deleteSelectedOrders = async () => {
    if (selectedOrders.length === 0) return

    setIsDeletingOrders(true)
    try {
      // Ensure CSRF token is available
      const csrfToken = await fetchCsrfToken()
      if (!csrfToken) {
        alert('Security error: Could not verify request. Please refresh the page and try again.')
        setIsDeletingOrders(false)
        return
      }

      const deletePromises = selectedOrders.map(orderId => 
        fetch(`/api/admin/orders/${orderId}`, { 
          method: 'DELETE',
          headers: getAdminHeaders(),
          body: JSON.stringify(addCsrfToBody({}))
        })
      )
      
      await Promise.all(deletePromises)
      setOrders(orders.filter(order => order.id && !selectedOrders.includes(order.id)))
      setSelectedOrders([])
    } catch (error) {
      errorLog('Error deleting orders:', error)
    } finally {
      setIsDeletingOrders(false)
    }
  }

  const toggleOrderSelection = (orderId: string) => {
    if (!orderId) return
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    )
  }

  const selectAllOrders = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([])
    } else {
      setSelectedOrders(orders.filter(order => order.id).map(order => order.id))
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

        const session = safeJsonParse<{ authenticatedAt: string; [key: string]: any }>(savedSession, { authenticatedAt: new Date().toISOString() })
        
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
      
      // Auto-refresh users, orders, and products every 30 seconds to show new registrations/logins
      const refreshInterval = setInterval(() => {
        // Use refs to get latest values in closure
        if (isAuthenticatedRef.current && adminUserRef.current?.email) {
          fetchUsers()
          fetchOrders()
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
    // Only depend on the email string, not the whole adminUser object or functions
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isCheckingSession, adminUser?.email])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED'
    }).format(amount)
  }

  // Order Details Component
  const OrderDetails = ({ order, onBack, onUpdateStatus }: {
    order: OrderWithItems
    onBack: () => void
    onUpdateStatus: (orderId: string, status: string) => void
  }) => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Orders
        </button>
        <div className="text-sm text-gray-500">
          Order #{order.id?.slice(-8) || 'N/A'}
        </div>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
            <div className="space-y-2 text-sm">
              <div><span className="font-medium">Name:</span> {order.customerName}</div>
              <div><span className="font-medium">Email:</span> {order.customerEmail}</div>
              <div><span className="font-medium">Phone:</span> {order.customerPhone}</div>
              <div><span className="font-medium">Address:</span> {order.customerAddress}</div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Order Details</h3>
            <div className="space-y-2 text-sm">
              <div><span className="font-medium">Date:</span> {new Date(order.createdAt).toLocaleString()}</div>
              <div><span className="font-medium">Status:</span> 
                <select
                  value={order.status}
                  onChange={(e) => onUpdateStatus(order.id, e.target.value)}
                  className="ml-2 px-2 py-1 border rounded text-xs"
                >
                  <option value="PENDING">Pending</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="SHIPPED">Shipped</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
              <div><span className="font-medium">Total:</span> {formatCurrency(order.total)}</div>
            </div>
          </div>
        </div>

        <h3 className="text-lg font-semibold mb-4">Order Items</h3>
        <div className="space-y-3 mb-6">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div>
                <div className="font-medium">{item.productName}</div>
                <div className="text-sm text-gray-600">Quantity: {item.quantity}</div>
                {(item.color || item.size) && (
                  <div className="flex gap-4 mt-2 text-xs">
                    {item.color && (
                      <div className="text-gray-600">
                        <span className="text-gray-500">Color:</span> <span className="font-semibold text-gray-800 bg-blue-50 px-2 py-0.5 rounded">{item.color}</span>
                      </div>
                    )}
                    {item.size && (
                      <div className="text-gray-600">
                        <span className="text-gray-500">Size:</span> <span className="font-semibold text-gray-800 bg-green-50 px-2 py-0.5 rounded">{item.size}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="text-right">
                <div className="font-medium">{formatCurrency(item.price)}</div>
                <div className="text-sm text-gray-600">each</div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Breakdown */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Order Breakdown</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal:</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount:</span>
                <span>-{formatCurrency(order.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping:</span>
              <span>{formatCurrency(order.shipping)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">VAT (5%):</span>
              <span>{formatCurrency(order.vat)}</span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between text-lg font-semibold">
              <span>Total:</span>
              <span className="text-red-600">{formatCurrency(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Additional Order Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">Delivery Information</h4>
            <div className="space-y-1 text-sm">
              <div><span className="font-medium">Emirate:</span> {order.customerEmirate}</div>
              <div><span className="font-medium">Address:</span> {order.customerAddress}</div>
              <div><span className="font-medium">Phone:</span> {order.customerPhone}</div>
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-2">Order Summary</h4>
            <div className="space-y-1 text-sm">
              <div><span className="font-medium">Order Number:</span> {order.orderNumber}</div>
              <div><span className="font-medium">Items Count:</span> {order.items.length}</div>
              <div><span className="font-medium">Created:</span> {new Date(order.createdAt).toLocaleDateString()}</div>
              <div><span className="font-medium">Updated:</span> {new Date(order.updatedAt).toLocaleDateString()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )


  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Clock className="h-4 w-4" />
      case 'confirmed':
        return <CheckCircle className="h-4 w-4" />
      case 'shipped':
        return <Truck className="h-4 w-4" />
      case 'delivered':
        return <Package className="h-4 w-4" />
      case 'cancelled':
        return <X className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
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
    <div className="container mx-auto px-4 py-8 md:py-16">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <h1 className="text-4xl font-bold text-gray-800">Admin Dashboard</h1>
            {adminUser && (
              <span className="ml-4 text-sm text-gray-600">
                ({adminUser.name} - {adminUser.email})
              </span>
            )}
          </div>
          <button
            onClick={handleAdminLogout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'analytics'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <BarChart3 className="h-4 w-4 inline mr-2" />
            Analytics
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'users'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <UserIcon className="h-4 w-4 inline mr-2" />
            User Management
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'orders'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Package className="h-4 w-4 inline mr-2" />
            Order Management
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'products'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <ImageIcon className="h-4 w-4 inline mr-2" />
            Product Management
          </button>
          <button
            onClick={() => setActiveTab('blog')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'blog'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <FileText className="h-4 w-4 inline mr-2" />
            Blog Management
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-8">
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
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
                <button
                  onClick={refreshUsers}
                  disabled={usersRefreshing}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RefreshCw className={`h-4 w-4 ${usersRefreshing ? 'animate-spin' : ''}`} />
                  {usersRefreshing ? 'Refreshing...' : 'Refresh'}
                </button>
              </div>
              
              {/* User Summary */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">User Summary</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                      <p className="text-sm text-gray-600">Total Users</p>
                      <p className="text-2xl font-bold text-gray-900">{users.length || 0}</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                      <p className="text-sm text-blue-700 font-medium">Admin Users</p>
                      <p className="text-2xl font-bold text-blue-800">{users.filter(u => u.isAdmin).length || 0}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                      <p className="text-sm text-gray-600">Regular Users</p>
                      <p className="text-2xl font-bold text-gray-900">{users.filter(u => !u.isAdmin).length || 0}</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                      <p className="text-sm text-green-700 font-medium">Price Access</p>
                      <p className="text-2xl font-bold text-green-800">{users.filter(u => u.canSeePrices).length || 0}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                      <p className="text-sm text-gray-600">With Discount</p>
                      <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.discountType && u.discountPercentage).length || 0}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 lg:col-span-2">
                      <p className="text-sm text-gray-600 mb-2">Recent Logins (Last 7 Days)</p>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {(() => {
                          // Calculate 7 days ago in UTC to avoid timezone issues
                          const now = new Date()
                          const sevenDaysAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000))
                          
                          const recentLogins = users
                            .filter(u => {
                              if (!u.lastLoginAt) return false
                              // Parse lastLoginAt as UTC ISO string
                              const lastLogin = new Date(u.lastLoginAt)
                              // Check if login is within the last 7 days
                              return lastLogin >= sevenDaysAgo && lastLogin <= now
                            })
                            .sort((a, b) => {
                              if (!a.lastLoginAt || !b.lastLoginAt) return 0
                              const dateA = new Date(a.lastLoginAt).getTime()
                              const dateB = new Date(b.lastLoginAt).getTime()
                              return dateB - dateA // Most recent first
                            })
                            .slice(0, 5) // Show top 5 most recent
                          
                          const totalRecentLogins = users.filter(u => {
                            if (!u.lastLoginAt) return false
                            const lastLogin = new Date(u.lastLoginAt)
                            return lastLogin >= sevenDaysAgo && lastLogin <= now
                          }).length
                          
                          if (recentLogins.length === 0) {
                            return <p className="text-sm text-gray-500">No recent logins</p>
                          }
                          
                          return (
                            <>
                              <p className="text-2xl font-bold text-gray-900 mb-2">
                                {totalRecentLogins} total
                              </p>
                              {recentLogins.map(user => (
                                <div key={user.id} className="flex items-center justify-between text-xs border-b border-gray-200 pb-1">
                                  <span className="font-medium text-gray-900 truncate flex-1">{user.name}</span>
                                  <span className="text-gray-500 ml-2 flex-shrink-0">
                                    {user.lastLoginAt && new Date(user.lastLoginAt).toLocaleDateString('en-AE', {
                                      timeZone: 'Asia/Dubai',
                                      month: 'short',
                                      day: 'numeric',
                                      year: new Date(user.lastLoginAt).getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </span>
                                </div>
                              ))}
                            </>
                          )
                        })()}
                      </div>
                    </div>
                  </div>
                </div>
              
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading ? (
                      Array.from({ length: 6 }).map((_, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4 border animate-pulse">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
                            <div className="flex-1">
                              <div className="h-4 bg-gray-300 rounded mb-2"></div>
                              <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="h-3 bg-gray-300 rounded"></div>
                            <div className="h-3 bg-gray-300 rounded w-5/6"></div>
                          </div>
                        </div>
                      ))
            ) : (
              users.map((user) => (
                <div key={user.id} className="bg-gray-50 rounded-lg p-4 border">
                          <div className="flex items-center space-x-3 mb-3">
                            <div 
                              className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center cursor-pointer hover:bg-primary-200 transition-colors"
                              onClick={() => setSelectedCustomer(user)}
                            >
                          {user.profilePicture ? (
                                <Image
                              src={user.profilePicture}
                              alt={user.name}
                                  width={40}
                                  height={40}
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                              ) : user.isAdmin ? (
                                <Image
                                  src="/favicon/genosys-logo.png"
                                  alt="Admin"
                                  width={40}
                                  height={40}
                                  className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                                <Image
                                  src="/images/avatar/avatar.png"
                                  alt={user.name}
                                  width={40}
                                  height={40}
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                          )}
                        </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                {user.name}
                                {user.isAdmin && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                                    <Shield className="h-3 w-3 mr-1" />
                                    Admin
                                  </span>
                                )}
                              </h3>
                              <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                        </div>
                        
                          <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex justify-between">
                              <span>Phone:</span>
                              <span className="font-medium">{user.phone || 'Not provided'}</span>
                        </div>
                            <div className="flex justify-between">
                              <span>Address:</span>
                              <span className="font-medium text-right max-w-[150px] truncate" title={user.address || 'Not provided'}>
                                {user.address || 'Not provided'}
                              </span>
                      </div>
                            <div className="flex justify-between">
                              <span>Birthday:</span>
                              <span className="font-medium">
                                {user.birthday ? new Date(user.birthday).toLocaleDateString('en-AE') : 'Not provided'}
                              </span>
                    </div>
                            <div className="flex justify-between">
                              <span>Joined:</span>
                              <span className="font-medium">
                                {new Date(user.createdAt).toLocaleDateString('en-AE', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                        </span>
                      </div>
                            <div className="flex justify-between">
                              <span>Last Login:</span>
                              <span className="font-medium">
                                {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString('en-AE', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                }) : 'Never'}
                            </span>
                          </div>
                            <div className="flex justify-between">
                              <span>Can See Prices:</span>
                              <span className={`font-medium ${user.canSeePrices ? 'text-green-600' : 'text-red-600'}`}>
                                {user.canSeePrices ? 'Yes' : 'No'}
                            </span>
                          </div>
                            {user.discountType && user.discountPercentage && (
                              <div className="flex justify-between">
                                <span>Discount:</span>
                                <span className="font-medium text-green-600">
                                  {user.discountPercentage}% {user.discountType}
                                </span>
                          </div>
                        )}
                      </div>

                          {/* Action Buttons */}
                          <div className="pt-2 border-t border-gray-200 space-y-2">
                            <button
                              onClick={() => setSelectedCustomer(user)}
                              className="w-full px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 flex items-center justify-center gap-1"
                            >
                              <UserIcon className="h-3 w-3" />
                              View Profile
                            </button>
                        <button
                          onClick={() => deleteUser(user.id)}
                              className="w-full px-3 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 flex items-center justify-center gap-1"
                        >
                          <Trash2 className="h-3 w-3" />
                          Delete User
                        </button>
                  </div>
                </div>
              ))
            )}
          </div>
            </>
              )}
            </>
          )}

          {activeTab === 'orders' && (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Order Management</h2>
                <button
                  onClick={refreshOrders}
                  disabled={ordersRefreshing}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RefreshCw className={`h-4 w-4 ${ordersRefreshing ? 'animate-spin' : ''}`} />
                  {ordersRefreshing ? 'Refreshing...' : 'Refresh'}
                </button>
              </div>

              {/* Order Summary */}
              {!ordersLoading && orders.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Total Orders</p>
                      <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                      <p className="text-2xl font-bold text-blue-600">{formatCurrency(orders.reduce((sum, order) => sum + order.total, 0))}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Total Subtotal</p>
                      <p className="text-xl font-semibold text-gray-900">{formatCurrency(orders.reduce((sum, order) => sum + (order.subtotal || 0), 0))}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Total Shipping</p>
                      <p className="text-xl font-semibold text-gray-900">{formatCurrency(orders.reduce((sum, order) => sum + (order.shipping || 0), 0))}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Total VAT</p>
                      <p className="text-xl font-semibold text-gray-900">{formatCurrency(orders.reduce((sum, order) => sum + (order.vat || 0), 0))}</p>
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
                        alert('Order status updated successfully!')
                      } else {
                        const errorData = await response.json()
                        alert(`Failed to update order status: ${errorData.error || 'Unknown error'}`)
                      }
                    } catch (error) {
                      errorLog('Error updating order status:', error)
                      alert('Failed to update order status')
                    }
                  }}
                />
              ) : (
                <div className="bg-white rounded-lg border">
                    {ordersLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                      <span className="ml-2 text-gray-600">Loading orders...</span>
                      </div>
                    ) : orders.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                          <Package className="h-12 w-12 text-gray-300" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
                      <p className="text-gray-400">Orders will appear here when customers make purchases.</p>
                      </div>
                    ) : (
                      <div>
                        {/* Bulk Actions */}
                        {selectedOrders.length > 0 && (
                          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <span className="text-sm font-medium text-red-800">
                                  {selectedOrders.length} order{selectedOrders.length > 1 ? 's' : ''} selected
                                </span>
                              </div>
                              <button
                                onClick={deleteSelectedOrders}
                                disabled={isDeletingOrders}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {isDeletingOrders ? (
                                  <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    Deleting...
                                  </>
                                ) : (
                                  <>
                                    <Trash2 className="h-4 w-4" />
                                    Delete Selected
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        )}

                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  <input
                                    type="checkbox"
                                    checked={selectedOrders.length === orders.length && orders.length > 0}
                                    onChange={selectAllOrders}
                                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                                  />
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                              </tr>
                            </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {orders.map((order) => (
                              <tr key={order.id || order.orderNumber} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <input
                                    type="checkbox"
                                    checked={order.id ? selectedOrders.includes(order.id) : false}
                                    onChange={() => order.id && toggleOrderSelection(order.id)}
                                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                                    disabled={!order.id}
                                  />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  <div className="flex flex-col">
                                    <span>#{order.id?.slice(-8) || order.orderNumber || 'N/A'}</span>
                                    {order.orderNumber && order.orderNumber !== order.id?.slice(-8) && (
                                      <span className="text-xs text-gray-500">Order: {order.orderNumber}</span>
                                    )}
                                    {!order.id && (
                                      <span className="text-xs text-red-500">⚠️ No ID</span>
                                    )}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => setSelectedOrder(order)}
                                    className="text-primary-600 hover:text-primary-900 font-semibold"
                                  >
                                    View Details
                                  </button>
                                  {order.id && (
                                    <button
                                      onClick={() => deleteOrder(order.id)}
                                      className="text-red-600 hover:text-red-900 font-semibold flex items-center gap-1"
                                      title="Delete Order"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                      Delete
                                    </button>
                                  )}
                                </div>
                                </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {order.customerName}
                                <div className="text-xs text-gray-500">{order.customerEmail}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {new Date(order.createdAt).toLocaleDateString('en-AE', {
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <StatusBadge
                                    status={order.status}
                                    icon={getStatusIcon(order.status)}
                                    className="px-3 py-1 text-xs"
                                  />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {formatCurrency(order.total)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        </div>
                      </div>
                )}
              </div>
              )}
            </>
          )}

          {activeTab === 'products' && (
            <>
              {/* Products Header */}
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Product Management</h2>
                  <p className="text-gray-600 mt-1">Manage your product catalog, images, and descriptions</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setEditingProduct(null)
                      setShowProductForm(true)
                    }}
                    className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </button>
                  <button
                    onClick={fetchProducts}
                    disabled={productsRefreshing}
                    className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${productsRefreshing ? 'animate-spin' : ''}`} />
                    Refresh
                  </button>
                </div>
              </div>

              {/* Products List */}
              <div className="bg-white rounded-lg border">
                {products.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                      <ImageIcon className="h-12 w-12 text-gray-300" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No products yet</h3>
                    <p className="text-gray-400 mb-4">Add your first product to get started.</p>
                    <button
                      onClick={() => {
                        setEditingProduct(null)
                        setShowProductForm(true)
                      }}
                      className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Product
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {products.map((product) => (
                          <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-12 w-12">
                                  <Image
                                    src={product.image}
                                    alt={product.name}
                                    width={48}
                                    height={48}
                                    className="h-12 w-12 rounded-lg object-cover"
                                  />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                  <div className="text-sm text-gray-500 truncate max-w-xs">{product.description}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {product.category}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatCurrency(product.price)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                product.inStock 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {product.inStock ? 'In Stock' : 'Out of Stock'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(product.createdAt).toLocaleDateString('en-AE', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => {
                                    setEditingProduct(product)
                                    setShowProductForm(true)
                                  }}
                                  className="text-primary-600 hover:text-primary-900 transition-colors"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => deleteProduct(product.id, product.name)}
                                  className="text-red-600 hover:text-red-900 transition-colors"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                </div>
                )}
              </div>

              {/* Product Form Modal */}
              {showProductForm && (
                <ProductForm
                  product={editingProduct}
                  onSave={saveProduct}
                  onCancel={() => {
                    setShowProductForm(false)
                    setEditingProduct(null)
                  }}
                />
              )}
            </>
          )}

          {activeTab === 'blog' && (
            <BlogManagement adminEmail={adminUser?.email || ''} />
          )}
        </div>
      </div>
    </div>
  )
}
