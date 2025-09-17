'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { User as UserIcon, Phone, MapPin, Percent, Crown, Building, Package, ShoppingBag, Clock, CheckCircle, Truck, X, CreditCard, Trash2, RefreshCw, ArrowLeft, BarChart3, Plus, Edit, Image as ImageIcon, Shield } from 'lucide-react'
import AdminLogin from '@/components/AdminLogin'
import AnalyticsDashboard from '@/components/AnalyticsDashboard'
import CustomerProfile from '@/components/CustomerProfile'
import ProductForm from '@/components/ProductForm'
import { Order, OrderItem } from '@prisma/client'

// Custom type that includes the items relation
type OrderWithItems = Order & {
  items: OrderItem[]
}

interface User {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
  birthday?: string
  profilePicture?: string
  isAdmin: boolean
  canSeePrices: boolean
  discountType?: string
  discountPercentage?: number
  createdAt: string
  updatedAt: string
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
  const [activeTab, setActiveTab] = useState<'analytics' | 'users' | 'orders' | 'products'>('analytics')
  const [selectedOrder, setSelectedOrder] = useState<OrderWithItems | null>(null)
  const [selectedCustomer, setSelectedCustomer] = useState<User | null>(null)
  const [showProductForm, setShowProductForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users')
      const data = await response.json()
      if (data.success) {
        setUsers(data.users)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchProducts = async () => {
    try {
      setProductsRefreshing(true)
      const response = await fetch('/api/admin/products')
      const data = await response.json()
      if (data.success) {
        setProducts(data.products)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setProductsRefreshing(false)
    }
  }

  const saveProduct = async (productData: Partial<Product>) => {
    try {
      const url = editingProduct ? `/api/admin/products/${editingProduct.id}` : '/api/admin/products'
      const method = editingProduct ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      })
      
      if (response.ok) {
        await fetchProducts() // Refresh products list
        setShowProductForm(false)
        setEditingProduct(null)
        return true
      } else {
        const errorData = await response.json()
        console.error('Product save failed:', errorData)
        alert(`Failed to save product: ${errorData.error || 'Unknown error'}`)
        return false
      }
    } catch (error) {
      console.error('Error saving product:', error)
      alert('Failed to save product')
      return false
    }
  }

  const deleteProduct = async (productId: string, productName: string) => {
    if (!confirm(`Are you sure you want to delete product "${productName}"? This action cannot be undone.`)) {
      return
    }

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        await fetchProducts() // Refresh products list
        alert('Product deleted successfully')
      } else {
        const errorData = await response.json()
        console.error('Delete failed:', errorData)
        alert(`Failed to delete product: ${errorData.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Failed to delete product')
    }
  }

  const fetchOrders = async () => {
    try {
      setOrdersLoading(true)
      const response = await fetch('/api/admin/orders')
      const data = await response.json()
      if (data.success) {
        setOrders(data.orders)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setOrdersLoading(false)
    }
  }

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
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })
      
      if (response.ok) {
        // Update local state
        setUsers(users.map(user => 
          user.id === userId ? { ...user, ...updates } : user
        ))
      }
    } catch (error) {
      console.error('Error updating user:', error)
    }
  }

  const deleteUser = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
      return
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setUsers(users.filter(user => user.id !== userId))
        alert('User deleted successfully')
      } else {
        const errorData = await response.json()
        alert(`Failed to delete user: ${errorData.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('Failed to delete user')
    }
  }

  const deleteOrder = async (orderId: string, orderNumber: string) => {
    if (!confirm(`Are you sure you want to delete order #${orderNumber}? This action cannot be undone.`)) {
      return
    }

    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setOrders(orders.filter(order => order.id !== orderId))
        alert('Order deleted successfully')
      } else {
        const errorData = await response.json()
        alert(`Failed to delete order: ${errorData.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error deleting order:', error)
      alert('Failed to delete order')
    }
  }

  const handleAdminLogin = async (email: string, password: string): Promise<boolean> => {
    // Simple admin authentication (in production, this should be more secure)
    if (email === 'admin@genosys.ae' && password === 'admin5') {
      setIsAuthenticated(true)
      return true
    }
    return false
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchUsers()
      fetchOrders()
      fetchProducts()
    }
  }, [isAuthenticated])

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
          Order #{order.id.slice(-8)}
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
        <div className="space-y-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div>
                <div className="font-medium">{item.productName}</div>
                <div className="text-sm text-gray-600">Quantity: {item.quantity}</div>
              </div>
              <div className="text-right">
                <div className="font-medium">{formatCurrency(item.price)}</div>
                <div className="text-sm text-gray-600">each</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'confirmed':
        return 'bg-blue-100 text-blue-800'
      case 'shipped':
        return 'bg-purple-100 text-purple-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

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

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleAdminLogin} />
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <h1 className="text-4xl font-bold text-gray-800">Admin Dashboard</h1>
          </div>
          <button
            onClick={() => setIsAuthenticated(false)}
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
                  onDeleteCustomer={async (id, name) => {
                    await deleteUser(id, name)
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
                                <UserIcon className="h-5 w-5 text-primary-600" />
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
                              onClick={() => deleteUser(user.id, user.name)}
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
              
              {selectedOrder ? (
                <OrderDetails 
                  order={selectedOrder} 
                  onBack={() => setSelectedOrder(null)}
                  onUpdateStatus={async (orderId, status) => {
                    try {
                      const response = await fetch(`/api/admin/orders/${orderId}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ status })
                      })
                      
                      if (response.ok) {
                        setOrders(orders.map(order => 
                          order.id === orderId ? { ...order, status } : order
                        ))
                        setSelectedOrder({ ...selectedOrder, status })
                        alert('Order status updated successfully!')
                      } else {
                        const errorData = await response.json()
                        alert(`Failed to update order status: ${errorData.error || 'Unknown error'}`)
                      }
                    } catch (error) {
                      console.error('Error updating order status:', error)
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
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {orders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                #{order.id.slice(-8)}
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
                                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                                  {getStatusIcon(order.status)}
                                  {order.status.toUpperCase()}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {formatCurrency(order.total)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => setSelectedOrder(order)}
                                    className="text-primary-600 hover:text-primary-900 font-semibold"
                                  >
                                    View Details
                                  </button>
                                  <button
                                    onClick={() => deleteOrder(order.id, order.id.slice(-8))}
                                    className="text-red-600 hover:text-red-900 font-semibold flex items-center gap-1"
                                    title="Delete Order"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    Delete
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
        </div>
      </div>
    </div>
  )
}
