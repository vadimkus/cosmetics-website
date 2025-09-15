'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { User as UserIcon, Phone, MapPin, Percent, Crown, Building, Package, ShoppingBag, Clock, CheckCircle, Truck, X, CreditCard, Trash2, RefreshCw, ArrowLeft, BarChart3 } from 'lucide-react'
import AdminLogin from '@/components/AdminLogin'
import AnalyticsDashboard from '@/components/AnalyticsDashboard'
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
  profilePicture?: string
  isAdmin?: boolean
  canSeePrices?: boolean
  discountType?: string | null
  discountPercentage?: number | null
  createdAt: string
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([])
  const [orders, setOrders] = useState<OrderWithItems[]>([])
  const [loading, setLoading] = useState(true)
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [usersRefreshing, setUsersRefreshing] = useState(false)
  const [ordersRefreshing, setOrdersRefreshing] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState<'analytics' | 'users' | 'orders'>('analytics')
  const [selectedOrder, setSelectedOrder] = useState<OrderWithItems | null>(null)

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

  const fetchOrders = async () => {
    setOrdersLoading(true)
    try {
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
    try {
      const response = await fetch('/api/admin/users')
      const data = await response.json()
      if (data.success) {
        setUsers(data.users)
      }
    } catch (error) {
      console.error('Error refreshing users:', error)
    } finally {
      setUsersRefreshing(false)
    }
  }

  const refreshOrders = async () => {
    setOrdersRefreshing(true)
    try {
      const response = await fetch('/api/admin/orders')
      const data = await response.json()
      if (data.success) {
        setOrders(data.orders)
      }
    } catch (error) {
      console.error('Error refreshing orders:', error)
    } finally {
      setOrdersRefreshing(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchUsers()
      fetchOrders()
    }
  }, [isAuthenticated])

  const handleAdminLogin = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      
      if (response.ok) {
        setIsAuthenticated(true)
        return true
      }
      return false
    } catch (error) {
      console.error('Admin login error:', error)
      return false
    }
  }

  const togglePriceAccess = async (userId: string, canSeePrices: boolean) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ canSeePrices })
      })
      
      if (response.ok) {
        // Update local state
        setUsers(users.map(user => 
          user.id === userId ? { ...user, canSeePrices } : user
        ))
      }
    } catch (error) {
      console.error('Error updating user:', error)
    }
  }

  const updateDiscount = async (userId: string, discountType: string | null, discountPercentage: number | null) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ discountType, discountPercentage })
      })
      
      if (response.ok) {
        // Update local state
        setUsers(users.map(user => 
          user.id === userId ? { ...user, discountType, discountPercentage } : user
        ))
      }
    } catch (error) {
      console.error('Error updating user discount:', error)
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
        // Remove from local state
        setUsers(users.filter(user => user.id !== userId))
        alert('User deleted successfully')
      } else {
        const errorData = await response.json()
        console.error('Delete failed:', errorData)
        alert(`Failed to delete user: ${errorData.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('Failed to delete user')
    }
  }

  const updateOrderStatus = async (orderId: string, status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled') => {
    try {
      const encodedOrderId = encodeURIComponent(orderId)
      const response = await fetch(`/api/admin/orders/${encodedOrderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      
      if (response.ok) {
        // Refresh orders from server to get the latest data
        await fetchOrders()
        alert('Order status updated successfully')
      } else {
        const errorData = await response.json()
        console.error('Status update failed:', errorData)
        alert(`Failed to update order status: ${errorData.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error updating order status:', error)
      alert('Failed to update order status')
    }
  }

  const deleteOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      return
    }

    try {
      const encodedOrderId = encodeURIComponent(orderId)
      const response = await fetch(`/api/admin/orders/${encodedOrderId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        // Remove the order from local state immediately
        setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId))
        // Also refresh orders from server to get the latest data
        await fetchOrders()
        alert('Order deleted successfully')
      } else {
        const errorData = await response.json()
        console.error('Delete failed:', errorData)
        alert(`Failed to delete order: ${errorData.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error deleting order:', error)
      alert('Failed to delete order')
    }
  }

  // Helper functions
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
      case 'shipped':
        return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
      case 'delivered':
        return 'bg-gradient-to-r from-purple-500 to-violet-500 text-white shadow-lg'
      case 'cancelled':
        return 'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg'
      default:
        return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CreditCard className="h-4 w-4" />
      case 'shipped':
        return <Truck className="h-4 w-4" />
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />
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
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-8">
          {activeTab === 'analytics' ? (
            <AnalyticsDashboard />
          ) : activeTab === 'users' ? (
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
          
          <div className="space-y-4">
            {loading ? (
              <p>Loading users...</p>
            ) : (
              users.map((user) => (
                <div key={user.id} className="bg-gray-50 rounded-lg p-4 border">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start space-x-4 flex-1">
                      {/* User Avatar */}
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 border-2 border-gray-300 flex items-center justify-center">
                          {user.profilePicture ? (
                            <img
                              src={user.profilePicture}
                              alt={user.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <UserIcon className="h-6 w-6 text-gray-400" />
                          )}
                        </div>
                      </div>
                      
                      {/* User Information */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-800 truncate">{user.name}</h3>
                        <p className="text-sm text-gray-600 truncate">{user.email}</p>
                        
                        {/* Mobile Number */}
                        <div className="flex items-center mt-1">
                          <Phone className="h-3 w-3 text-gray-400 mr-1" />
                          <p className="text-xs text-gray-500">{user.phone || 'Not provided'}</p>
                        </div>
                        
                        {/* Address */}
                        <div className="flex items-center mt-1">
                          <MapPin className="h-3 w-3 text-gray-400 mr-1" />
                          <p className="text-xs text-gray-500 truncate">{user.address || 'Not provided'}</p>
                        </div>
                        
                        {/* Member Since */}
                        <p className="text-xs text-gray-400 mt-1">
                          Member since: {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    {/* Controls */}
                    <div className="text-right flex-shrink-0 ml-4 space-y-2">
                      {/* Price Access Controls */}
                      <div>
                        <span className={`px-2 py-1 rounded text-xs ${
                          user.canSeePrices ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {user.canSeePrices ? 'Can See Prices' : 'No Price Access'}
                        </span>
                        <button
                          onClick={() => togglePriceAccess(user.id, !user.canSeePrices)}
                          className={`ml-2 px-3 py-1 rounded text-xs ${
                            user.canSeePrices 
                              ? 'bg-red-500 text-white hover:bg-red-600' 
                              : 'bg-green-500 text-white hover:bg-green-600'
                          }`}
                        >
                          {user.canSeePrices ? 'Remove Access' : 'Grant Access'}
                        </button>
                      </div>

                      {/* Discount Controls */}
                      <div className="flex items-center gap-2">
                        {user.discountType ? (
                          <div className="flex items-center gap-1">
                            {user.discountType === 'CLINIC' ? (
                              <Building className="h-3 w-3 text-blue-600" />
                            ) : (
                              <Crown className="h-3 w-3 text-purple-600" />
                            )}
                            <span className={`px-2 py-1 rounded text-xs ${
                              user.discountType === 'CLINIC' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                            }`}>
                              {user.discountType} {user.discountPercentage}%
                            </span>
                            <button
                              onClick={() => updateDiscount(user.id, null, null)}
                              className="px-2 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600"
                            >
                              Remove
                            </button>
                          </div>
                        ) : (
                          <div className="flex gap-1">
                            <button
                              onClick={() => updateDiscount(user.id, 'CLINIC', 50)}
                              className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 flex items-center gap-1"
                            >
                              <Building className="h-3 w-3" />
                              CLINIC 50%
                            </button>
                            <button
                              onClick={() => {
                                const customPercent = prompt('Enter VIP discount percentage (0-100):')
                                if (customPercent && !isNaN(Number(customPercent)) && Number(customPercent) >= 0 && Number(customPercent) <= 100) {
                                  updateDiscount(user.id, 'VIP', Number(customPercent))
                                }
                              }}
                              className="px-2 py-1 bg-purple-500 text-white rounded text-xs hover:bg-purple-600 flex items-center gap-1"
                            >
                              <Crown className="h-3 w-3" />
                              VIP
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Delete User Button */}
                      <div className="pt-2 border-t border-gray-200">
                        <button
                          onClick={() => deleteUser(user.id, user.name)}
                          className="px-3 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 flex items-center gap-1"
                        >
                          <Trash2 className="h-3 w-3" />
                          Delete User
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
            </>
          ) : (
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
                // Order Detail View
                <div className="space-y-6">
                  <div className="flex items-center gap-4 mb-6">
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back to Orders
                    </button>
                    <h2 className="text-2xl font-bold text-gray-800">Order Details</h2>
                  </div>

                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    {/* Order Header */}
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="bg-white rounded-full p-3 shadow-sm">
                            <ShoppingBag className="h-6 w-6 text-primary-600" />
                          </div>
                            <div>
                            <h3 className="text-xl font-bold text-gray-800">Order #{selectedOrder.orderNumber}</h3>
                            <p className="text-sm text-gray-500">
                              {new Date(selectedOrder.createdAt).toLocaleDateString('en-AE', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold shadow-sm ${getStatusColor(selectedOrder.status)}`}>
                            {getStatusIcon(selectedOrder.status)}
                            {selectedOrder.status.toUpperCase()}
                          </span>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-gray-800">{formatCurrency(selectedOrder.total)}</p>
                            <p className="text-sm text-gray-500">{selectedOrder.items.reduce((sum, item) => sum + item.quantity, 0)} items</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Customer Info */}
                        <div className="lg:col-span-2 space-y-6">
                          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
                            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                              <UserIcon className="h-5 w-5 text-blue-600" />
                              Customer Information
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                              <div>
                                <p className="text-gray-500">Name</p>
                                <p className="font-medium text-gray-800">{selectedOrder.customerName}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Email</p>
                                <p className="font-medium text-gray-800">{selectedOrder.customerEmail}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Phone</p>
                                <p className="font-medium text-gray-800">{selectedOrder.customerPhone}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Emirate</p>
                                <p className="font-medium text-gray-800">{selectedOrder.customerEmirate}</p>
                              </div>
                              <div className="sm:col-span-2">
                                <p className="text-gray-500">Address</p>
                                <p className="font-medium text-gray-800">{selectedOrder.customerAddress}</p>
                              </div>
                            </div>
                          </div>
                          
                          {/* Order Items */}
                          <div>
                            <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                              <Package className="h-5 w-5 text-green-600" />
                              Order Items
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {selectedOrder.items.map((item, itemIndex) => (
                                <div key={itemIndex} className="flex items-center gap-4 bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors">
                                  <div className="relative">
                                  <img
                                    src={item.image}
                                    alt={item.productName}
                                      className="w-16 h-16 object-cover rounded-lg shadow-sm"
                                  />
                                    <div className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                                      {item.quantity}
                                    </div>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium text-gray-800 truncate">{item.productName}</p>
                                    <p className="text-sm text-gray-500">{formatCurrency(item.price)} each</p>
                                    <p className="text-sm font-semibold text-primary-600">{formatCurrency(item.price * item.quantity)}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        {/* Order Actions */}
                        <div className="space-y-4">
                          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4">
                            <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                              <RefreshCw className="h-5 w-5 text-gray-600" />
                              Order Actions
                            </h4>
                            
                            <div className="space-y-3">
                              <h5 className="text-sm font-medium text-gray-600">Update Status</h5>
                            {(['pending', 'paid', 'shipped', 'delivered', 'cancelled'] as const).map((status) => (
                              <button
                                key={status}
                                  onClick={() => updateOrderStatus(selectedOrder.id, status)}
                                  disabled={selectedOrder.status === status}
                                  className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                    selectedOrder.status === status
                                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 hover:shadow-sm'
                                }`}
                              >
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                              </button>
                            ))}
                            </div>
                            
                            <div className="mt-6 pt-4 border-t border-gray-200">
                              <h5 className="text-sm font-medium text-gray-600 mb-3">Danger Zone</h5>
                              <button
                                onClick={() => deleteOrder(selectedOrder.id)}
                                className="w-full px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-lg"
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete Order
                              </button>
                            </div>
                          </div>

                          {/* Order Summary */}
                          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4">
                            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                              <CreditCard className="h-5 w-5 text-green-600" />
                              Order Summary
                            </h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Subtotal</span>
                                <span className="font-medium">{formatCurrency(selectedOrder.subtotal)}</span>
                              </div>
                              {selectedOrder.discountAmount > 0 && (
                                <div className="flex justify-between text-green-600">
                                  <span>Discount</span>
                                  <span className="font-medium">-{formatCurrency(selectedOrder.discountAmount)}</span>
                                </div>
                              )}
                              <div className="flex justify-between">
                                <span className="text-gray-600">Shipping</span>
                                <span className="font-medium">{formatCurrency(selectedOrder.shipping)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">VAT (5%)</span>
                                <span className="font-medium">{formatCurrency(selectedOrder.vat)}</span>
                              </div>
                              <div className="border-t border-gray-200 pt-2 flex justify-between text-lg font-bold text-gray-800">
                                <span>Total</span>
                                <span>{formatCurrency(selectedOrder.total)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // Order List View
                <div className="space-y-4">
                  {/* Order Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-blue-100 text-sm font-medium">Total Orders</p>
                          <p className="text-3xl font-bold">{orders.length}</p>
                        </div>
                        <Package className="h-8 w-8 text-blue-200" />
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-6 text-white shadow-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-yellow-100 text-sm font-medium">Pending</p>
                          <p className="text-3xl font-bold">{orders.filter(o => o.status === 'pending').length}</p>
                        </div>
                        <Clock className="h-8 w-8 text-yellow-200" />
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-green-100 text-sm font-medium">Completed</p>
                          <p className="text-3xl font-bold">{orders.filter(o => o.status === 'delivered').length}</p>
                        </div>
                        <CheckCircle className="h-8 w-8 text-green-200" />
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-purple-100 text-sm font-medium">Revenue</p>
                          <p className="text-3xl font-bold">{formatCurrency(orders.reduce((sum, o) => sum + o.total, 0))}</p>
                        </div>
                        <CreditCard className="h-8 w-8 text-purple-200" />
                      </div>
                    </div>
                  </div>

                  {/* Orders Table */}
                  <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-800">All Orders</h3>
                    </div>
                    
                    {ordersLoading ? (
                      <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent mx-auto mb-4"></div>
                        <p className="text-gray-500 text-lg">Loading orders...</p>
                      </div>
                    ) : orders.length === 0 ? (
                      <div className="text-center py-12 text-gray-500">
                        <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                          <Package className="h-12 w-12 text-gray-300" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
                        <p className="text-gray-400">Orders will appear here once customers start placing them.</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
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
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="bg-primary-100 rounded-full p-2 mr-3">
                                      <ShoppingBag className="h-4 w-4 text-primary-600" />
                                    </div>
                                    <div>
                                      <div className="text-sm font-medium text-gray-900">Order #{order.orderNumber}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">{order.customerName}</div>
                                  <div className="text-sm text-gray-500">{order.customerEmail}</div>
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
                                  <button
                                    onClick={() => setSelectedOrder(order)}
                                    className="text-primary-600 hover:text-primary-900 font-semibold"
                                  >
                                    View Details
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                )}
              </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}