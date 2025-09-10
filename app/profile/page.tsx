'use client'

import Link from 'next/link'
import { ArrowLeft, User, Mail, Phone, MapPin, Calendar, Edit3, Package, CheckCircle, Clock, Camera, X, MessageCircle, Lock, Eye, Trash2, Percent, Crown, Building, ShoppingBag, Truck, CreditCard, RefreshCw } from 'lucide-react'
import { useAuth } from '@/components/AuthProvider'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Order } from '@/lib/orderStorage'

export default function ProfilePage() {
  const { user, logout, forceRefreshUser } = useAuth()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    birthday: user?.birthday || ''
  })
  const [profilePicture, setProfilePicture] = useState<string | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [customerNumber, setCustomerNumber] = useState<number>(0)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [orders, setOrders] = useState<Order[]>([])
  const [loadingOrders, setLoadingOrders] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Redirect to login page if user is not logged in
  useEffect(() => {
    if (!user) {
      router.push('/login')
    }
  }, [user, router])

  // Initialize profile picture and customer number when user loads
  useEffect(() => {
    if (user) {
      // Initialize profile picture
      setProfilePicture(user.profilePicture || null)
      setPreviewImage(user.profilePicture || null)
      
      // Update editData when user data changes
      setEditData({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || '',
        birthday: user.birthday || ''
      })
      
      // Check if user already has a customer number
      const savedCustomerNumber = localStorage.getItem(`customer_number_${user.id}`)
      if (savedCustomerNumber) {
        setCustomerNumber(parseInt(savedCustomerNumber))
      } else {
        // Get the next customer number
        const lastCustomerNumber = parseInt(localStorage.getItem('last_customer_number') || '0')
        const newCustomerNumber = lastCustomerNumber + 1
        
        // Save the customer number for this user
        localStorage.setItem(`customer_number_${user.id}`, newCustomerNumber.toString())
        localStorage.setItem('last_customer_number', newCustomerNumber.toString())
        
        setCustomerNumber(newCustomerNumber)
      }
    }
  }, [user])

  // Fetch user orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.email) return
      
      setLoadingOrders(true)
      try {
        const response = await fetch(`/api/orders?email=${encodeURIComponent(user.email)}`)
        if (response.ok) {
          const data = await response.json()
          setOrders(data.orders || [])
        } else {
          console.error('Failed to fetch orders')
        }
      } catch (error) {
        console.error('Error fetching orders:', error)
      } finally {
        setLoadingOrders(false)
      }
    }

    fetchOrders()
  }, [user?.email])

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
        return 'bg-green-100 text-green-800'
      case 'shipped':
        return 'bg-blue-100 text-blue-800'
      case 'delivered':
        return 'bg-purple-100 text-purple-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-yellow-100 text-yellow-800'
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

  const cancelOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to cancel this order? The order will be permanently removed from your history. This action cannot be undone.')) {
      return
    }

    try {
      const encodedOrderId = encodeURIComponent(orderId)
      const response = await fetch(`/api/orders/${encodedOrderId}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      
      if (response.ok) {
        // Remove order from local state
        setOrders(orders.filter(order => order.id !== orderId))
        alert('Order cancelled and removed successfully')
      } else {
        const errorData = await response.json()
        alert(`Failed to cancel order: ${errorData.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error cancelling order:', error)
      alert('Failed to cancel order')
    }
  }

  // Show loading or nothing while redirecting
  if (!user) {
    return null
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file')
        return
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB')
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setPreviewImage(result)
        setProfilePicture(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setProfilePicture(null)
    setPreviewImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSave = async () => {
    try {
      console.log('Saving profile with data:', {
        userId: user?.id,
        updates: {
          ...editData,
          profilePicture
        }
      })

      if (!user?.id) {
        alert('User ID not found. Please try logging out and back in.')
        return
      }

      // Update user data via API
      const response = await fetch('/api/profile/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          updates: {
            ...editData,
            profilePicture
          }
        }),
      })

      const responseData = await response.json()
      console.log('Profile update response:', responseData)

      if (response.ok) {
        // Update local user state
        const updatedUser = { ...user, ...editData, profilePicture }
        localStorage.setItem('genosys_user', JSON.stringify(updatedUser))
        setIsEditing(false)
        
        // Show success message or refresh user data
        alert('Profile updated successfully!')
        window.location.reload() // Simple refresh to reload user data
      } else {
        console.error('Failed to update profile:', responseData)
        alert(`Failed to update profile: ${responseData.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      alert(`Error updating profile: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handleCancel = () => {
    setEditData({
      name: user.name,
      phone: user.phone || '',
      address: user.address || '',
      birthday: user.birthday || ''
    })
    setProfilePicture(user?.profilePicture || null)
    setPreviewImage(user?.profilePicture || null)
    setIsEditing(false)
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDeleteAccount = async () => {
    if (!user) return
    
    setIsDeleting(true)
    try {
      const response = await fetch('/api/profile/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id }),
      })

      if (response.ok) {
        // Clear all local data
        localStorage.removeItem('genosys_user')
        localStorage.removeItem(`customer_number_${user.id}`)
        
        // Logout and redirect to home
        logout()
        router.push('/')
        
        alert('Your account has been successfully deleted.')
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to delete account. Please try again.')
      }
    } catch (error) {
      console.error('Error deleting account:', error)
      alert('Error deleting account. Please try again.')
    } finally {
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-4xl mx-auto">

          <div className="bg-white rounded-lg shadow-sm border p-4 md:p-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 md:mb-8 gap-4">
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-800 text-center sm:text-left">
                {customerNumber > 0 ? `Genosys Family Member #${customerNumber}` : 'My Profile'}
              </h1>
              <div className="flex gap-2">
                <button
                  onClick={forceRefreshUser}
                  className="flex items-center justify-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700 transition-colors text-sm md:text-base touch-manipulation"
                  title="Refresh profile data"
                >
                  <RefreshCw className="h-4 w-4 md:h-5 md:w-5" />
                  Refresh
                </button>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center justify-center gap-2 px-4 py-2 text-primary-600 hover:text-primary-700 transition-colors text-sm md:text-base touch-manipulation"
                >
                  <Edit3 className="h-4 w-4 md:h-5 md:w-5" />
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>
            </div>

            {/* Profile Picture Section */}
            <div className="flex flex-col items-center mb-6 md:mb-8">
              <div className="relative">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden bg-gray-100 border-4 border-gray-200 flex items-center justify-center">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="h-12 w-12 md:h-16 md:w-16 text-gray-400" />
                  )}
                </div>

                {isEditing && (
                  <div className="absolute -bottom-2 -right-2 flex gap-2">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-primary-600 text-white p-2 rounded-full hover:bg-primary-700 transition-colors shadow-lg touch-manipulation"
                      title="Upload Photo"
                    >
                      <Camera className="h-3 w-3 md:h-4 md:w-4" />
                    </button>
                    {previewImage && (
                      <button
                        onClick={handleRemoveImage}
                        className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors shadow-lg touch-manipulation"
                        title="Remove Photo"
                      >
                        <X className="h-3 w-3 md:h-4 md:w-4" />
                      </button>
                    )}
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              {/* Customer Status Badge */}
              {customerNumber > 0 && (
                <div className="mt-4 px-3 md:px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-full shadow-lg">
                  <span className="text-xs md:text-sm font-semibold">
                    👨‍👩‍👧‍👦 Family Member #{customerNumber}
                  </span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div className="space-y-4 md:space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 md:gap-4">
                  <div className="bg-primary-100 p-2 md:p-3 rounded-full flex-shrink-0 mx-auto sm:mx-0">
                    <User className="h-6 w-6 md:h-8 md:w-8 text-primary-600" />
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-base md:text-lg font-semibold text-gray-800">Full Name</h3>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.name}
                        onChange={(e) => setEditData({...editData, name: e.target.value})}
                        className="mt-1 px-3 py-3 md:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent w-full text-base"
                      />
                    ) : (
                      <p className="text-gray-600 text-sm md:text-base">{user.name}</p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-3 md:gap-4">
                  <div className="bg-primary-100 p-2 md:p-3 rounded-full flex-shrink-0 mx-auto sm:mx-0">
                    <Mail className="h-6 w-6 md:h-8 md:w-8 text-primary-600" />
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-base md:text-lg font-semibold text-gray-800">Email</h3>
                    <p className="text-gray-600 text-sm md:text-base break-all">{user.email}</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-3 md:gap-4">
                  <div className="bg-primary-100 p-2 md:p-3 rounded-full flex-shrink-0 mx-auto sm:mx-0">
                    <Phone className="h-6 w-6 md:h-8 md:w-8 text-primary-600" />
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-base md:text-lg font-semibold text-gray-800">Phone</h3>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editData.phone}
                        onChange={(e) => setEditData({...editData, phone: e.target.value})}
                        className="mt-1 px-3 py-3 md:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent w-full text-base"
                      />
                    ) : (
                      <p className="text-gray-600 text-sm md:text-base">{user.phone || 'Not provided'}</p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-3 md:gap-4">
                  <div className="bg-primary-100 p-2 md:p-3 rounded-full flex-shrink-0 mx-auto sm:mx-0">
                    <Calendar className="h-6 w-6 md:h-8 md:w-8 text-primary-600" />
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-base md:text-lg font-semibold text-gray-800">Birthday</h3>
                    {isEditing ? (
                      <input
                        type="date"
                        value={editData.birthday}
                        onChange={(e) => setEditData({...editData, birthday: e.target.value})}
                        className="mt-1 px-3 py-3 md:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent w-full text-base"
                      />
                    ) : (
                      <p className="text-gray-600 text-sm md:text-base">
                        {user.birthday ? new Date(user.birthday).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        }) : 'Not provided'}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4 md:space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-start gap-3 md:gap-4">
                  <div className="bg-primary-100 p-2 md:p-3 rounded-full flex-shrink-0 mx-auto sm:mx-0">
                    <MapPin className="h-6 w-6 md:h-8 md:w-8 text-primary-600" />
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-base md:text-lg font-semibold text-gray-800">Address</h3>
                    {isEditing ? (
                      <textarea
                        value={editData.address}
                        onChange={(e) => setEditData({...editData, address: e.target.value})}
                        rows={3}
                        className="mt-1 px-3 py-3 md:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent w-full text-base"
                        placeholder="Enter your address"
                      />
                    ) : (
                      <p className="text-gray-600 text-sm md:text-base">{user.address || 'Not provided'}</p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-3 md:gap-4">
                  <div className="bg-primary-100 p-2 md:p-3 rounded-full flex-shrink-0 mx-auto sm:mx-0">
                    <Calendar className="h-6 w-6 md:h-8 md:w-8 text-primary-600" />
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-base md:text-lg font-semibold text-gray-800">Member Since</h3>
                    <p className="text-gray-600 text-sm md:text-base">
                      {new Date(user.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                {/* Price Access Status */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 md:gap-4">
                  <div className={`p-2 md:p-3 rounded-full flex-shrink-0 mx-auto sm:mx-0 ${
                    user.canSeePrices ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {user.canSeePrices ? (
                      <Eye className="h-6 w-6 md:h-8 md:w-8 text-green-600" />
                    ) : (
                      <Lock className="h-6 w-6 md:h-8 md:w-8 text-red-600" />
                    )}
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-base md:text-lg font-semibold text-gray-800">Price Access</h3>
                    <div className="flex items-center gap-2 mt-1">
                      {user.canSeePrices ? (
                        <>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Allowed
                          </span>
                          <p className="text-green-600 text-sm md:text-base font-medium">You can view product prices</p>
                        </>
                      ) : (
                        <>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <Lock className="h-3 w-3 mr-1" />
                            Restricted
                          </span>
                          <p className="text-red-600 text-sm md:text-base font-medium">Price access required</p>
                        </>
                      )}
                    </div>
                    {!user.canSeePrices && (
                      <p className="text-gray-500 text-xs mt-1">
                        Contact support to request price access
                      </p>
                    )}
                  </div>
                </div>

                {/* Discount Level Status */}
                {user.discountType && (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 md:gap-4">
                    <div className={`p-2 md:p-3 rounded-full flex-shrink-0 mx-auto sm:mx-0 ${
                      user.discountType === 'CLINIC' ? 'bg-blue-100' : 'bg-purple-100'
                    }`}>
                      {user.discountType === 'CLINIC' ? (
                        <Building className="h-6 w-6 md:h-8 md:w-8 text-blue-600" />
                      ) : (
                        <Crown className="h-6 w-6 md:h-8 md:w-8 text-purple-600" />
                      )}
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="text-base md:text-lg font-semibold text-gray-800">Discount Level</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.discountType === 'CLINIC' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                        }`}>
                          {user.discountType === 'CLINIC' ? (
                            <Building className="h-3 w-3 mr-1" />
                          ) : (
                            <Crown className="h-3 w-3 mr-1" />
                          )}
                          {user.discountType} {user.discountPercentage}% OFF
                        </span>
                        <p className={`text-sm md:text-base font-medium ${
                          user.discountType === 'CLINIC' ? 'text-blue-600' : 'text-purple-600'
                        }`}>
                          {user.discountType === 'CLINIC' ? 'Clinic Partnership Discount' : 'VIP Customer Discount'}
                        </p>
                      </div>
                      <p className="text-gray-500 text-xs mt-1">
                        Applied automatically to all orders
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {isEditing && (
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mt-6 md:mt-8 pt-6 border-t">
                <button
                  onClick={handleSave}
                  className="bg-primary-600 text-white px-6 py-3 md:py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors text-base md:text-lg touch-manipulation"
                >
                  Save Changes
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-gray-300 text-gray-700 px-6 py-3 md:py-2 rounded-lg font-semibold hover:bg-gray-400 transition-colors text-base md:text-lg touch-manipulation"
                >
                  Cancel
                </button>
              </div>
            )}

            {/* Support Section */}
            <div className="mt-8 pt-6 border-t">
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <MessageCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Chat with Support</h3>
                    <p className="text-gray-600">Get instant help via WhatsApp</p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href="https://wa.me/971585487665"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                  >
                    <MessageCircle className="h-5 w-5" />
                    Start WhatsApp Chat
                  </a>
                  <div className="text-sm text-gray-600 flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    +971 58 548 76 65
                  </div>
                </div>
                
                <div className="mt-4 text-sm text-gray-500">
                  <p>• Available 24/7 for your convenience</p>
                  <p>• Quick response for order inquiries</p>
                  <p>• Product recommendations and support</p>
                </div>
              </div>
            </div>

            {/* Order History Section */}
            <div className="mt-8 pt-6 border-t">
              <div className="flex items-center gap-3 mb-6">
                <Package className="h-6 w-6 text-primary-600" />
                <h2 className="text-2xl font-bold text-gray-800">Order History</h2>
              </div>
              
              {loadingOrders ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-3"></div>
                  <p className="text-gray-500">Loading your orders...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Package className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-sm">No orders yet. Start shopping to see your order history here!</p>
                  <Link
                    href="/products"
                    className="inline-block mt-3 text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Browse Products
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-gray-800">Order #{order.id}</h3>
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                              {getStatusIcon(order.status)}
                              {order.status.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {new Date(order.createdAt).toLocaleDateString('en-AE', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {order.items.slice(0, 3).map((item, index) => (
                              <div key={index} className="flex items-center gap-2 bg-white rounded-lg p-2 border">
                                <img
                                  src={item.image}
                                  alt={item.productName}
                                  className="w-8 h-8 object-cover rounded"
                                />
                                <span className="text-xs text-gray-600">
                                  {item.productName} × {item.quantity}
                                </span>
                              </div>
                            ))}
                            {order.items.length > 3 && (
                              <div className="flex items-center bg-white rounded-lg p-2 border">
                                <span className="text-xs text-gray-500">
                                  +{order.items.length - 3} more items
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-800">{formatCurrency(order.total)}</p>
                          <p className="text-sm text-gray-500">
                            {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
                          </p>
                          {(order.status === 'pending' || order.status === 'paid') && (
                            <button
                              onClick={() => cancelOrder(order.id)}
                              className="mt-2 px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors"
                            >
                              Cancel Order
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-8 pt-6 border-t">
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="https://wa.me/971585487665"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  <MessageCircle className="h-5 w-5" />
                  Chat with Support
                </a>
                <button
                  onClick={logout}
                  className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="bg-red-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-900 transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 className="h-5 w-5" />
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-100 p-2 rounded-full">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Delete Account</h3>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-600 mb-3">
                Are you sure you want to delete your account? This action cannot be undone.
              </p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-800 text-sm font-medium mb-1">This will permanently delete:</p>
                <ul className="text-red-700 text-sm space-y-1">
                  <li>• Your profile and personal information</li>
                  <li>• All order history</li>
                  <li>• Your customer number (#{customerNumber})</li>
                  <li>• All saved preferences and data</li>
                </ul>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    Yes, Delete My Account
                  </>
                )}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-400 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
