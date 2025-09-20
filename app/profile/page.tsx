'use client'

import Link from 'next/link'
import { ArrowLeft, User, Mail, Phone, MapPin, Calendar, Edit3, Package, CheckCircle, Clock, Camera, X, MessageCircle, Lock, Eye, Trash2, Percent, Crown, Building, ShoppingBag, Truck, CreditCard, RefreshCw, Settings, Bell, Shield, Star, Award, Gift, Heart, Share2, Download, Upload, Zap, Sparkles, MoreHorizontal } from 'lucide-react'
import { useAuth } from '@/components/AuthProvider'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Order, OrderItem } from '@prisma/client'

// Custom type that includes the items relation
type OrderWithItems = Order & {
  items: OrderItem[]
}

export default function ProfilePageNew() {
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
  const [orders, setOrders] = useState<OrderWithItems[]>([])
  const [loadingOrders, setLoadingOrders] = useState(false)
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'settings' | 'downloads'>('profile')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showMoreMenu, setShowMoreMenu] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const moreMenuRef = useRef<HTMLDivElement>(null)

  // Handle refresh with loading state
  const handleRefresh = async () => {
    if (isRefreshing) return // Prevent multiple simultaneous refreshes
    
    setIsRefreshing(true)
    try {
      await forceRefreshUser()
    } catch (error) {
      console.error('Error refreshing user data:', error)
    } finally {
      // Add a small delay to show the animation
      setTimeout(() => {
        setIsRefreshing(false)
      }, 1000)
    }
  }

  // Redirect to login page if user is not logged in
  useEffect(() => {
    if (!user) {
      router.push('/login')
    }
  }, [user, router])

  // Initialize profile picture and customer number when user loads
  useEffect(() => {
    if (user) {
      setProfilePicture(user.profilePicture || null)
      setPreviewImage(user.profilePicture || null)
      
      setEditData({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || '',
        birthday: user.birthday || ''
      })
      
      const savedCustomerNumber = localStorage.getItem(`customer_number_${user.id}`)
      if (savedCustomerNumber) {
        setCustomerNumber(parseInt(savedCustomerNumber))
      } else {
        const lastCustomerNumber = parseInt(localStorage.getItem('last_customer_number') || '0')
        const newCustomerNumber = lastCustomerNumber + 1
        
        localStorage.setItem(`customer_number_${user.id}`, newCustomerNumber.toString())
        localStorage.setItem('last_customer_number', newCustomerNumber.toString())
        
        setCustomerNumber(newCustomerNumber)
      }
    }
  }, [user])

  // Close more menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setShowMoreMenu(false)
      }
    }

    if (showMoreMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showMoreMenu])

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
        return 'bg-emerald-100 text-emerald-800 border-emerald-200'
      case 'shipped':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'delivered':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-amber-100 text-amber-800 border-amber-200'
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
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file')
        return
      }
      
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
      if (!user?.id) {
        alert('User ID not found. Please try logging out and back in.')
        return
      }

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

      if (response.ok) {
        const updatedUser = { ...user, ...editData, profilePicture }
        localStorage.setItem('genosys_user', JSON.stringify(updatedUser))
        setIsEditing(false)
        alert('Profile updated successfully!')
        window.location.reload()
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
        localStorage.removeItem('genosys_user')
        localStorage.removeItem(`customer_number_${user.id}`)
        
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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/" 
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Back to Home</span>
            </Link>
            
            <div className="flex items-center gap-3">
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Profile Header Card */}
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 mb-8">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              
              {/* Profile Picture */}
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-green-100 to-emerald-200 border-4 border-white shadow-2xl flex items-center justify-center">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="h-16 w-16 text-green-400" />
                  )}
                </div>

                {isEditing && (
                  <div className="absolute -bottom-2 -right-2 flex gap-2">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-gradient-to-r from-red-600 to-red-700 text-white p-3 rounded-full hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                      title="Upload Photo"
                    >
                      <Camera className="h-4 w-4" />
                    </button>
                    {previewImage && (
                      <button
                        onClick={handleRemoveImage}
                        className="bg-gradient-to-r from-red-500 to-red-600 text-white p-3 rounded-full hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                        title="Remove Photo"
                      >
                        <X className="h-4 w-4" />
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

              {/* Profile Info */}
              <div className="flex-1 text-center lg:text-left">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                  <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    {user.name}
                  </h1>
                  
                  {customerNumber > 0 && (
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-full shadow-lg">
                      <Sparkles className="h-4 w-4" />
                      <span className="text-sm font-semibold">
                        Family Member #{customerNumber}
                      </span>
                    </div>
                  )}
                </div>
                
                <p className="text-gray-600 text-lg mb-4">{user.email}</p>
                
                <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                  {user.canSeePrices && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
                      <Eye className="h-4 w-4" />
                      Price Access
                    </div>
                  )}
                  
                  {user.discountType && (
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                      user.discountType === 'CLINIC' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.discountType === 'CLINIC' ? (
                        <Building className="h-4 w-4" />
                      ) : (
                        <Crown className="h-4 w-4" />
                      )}
                      {user.discountType} {user.discountPercentage}% OFF
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                    <Calendar className="h-4 w-4" />
                    Member since {new Date(user.createdAt).getFullYear()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-2 mb-8">
            {/* Mobile: Horizontal scroll with scroll indicators */}
            <div className="relative">
              {/* Scroll indicators for mobile */}
              <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-white/70 to-transparent z-10 pointer-events-none sm:hidden"></div>
              <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-white/70 to-transparent z-10 pointer-events-none sm:hidden"></div>
              
              {/* Navigation container with horizontal scroll on mobile */}
              <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 sm:overflow-x-visible sm:pb-0">
                {/* Primary Navigation Tabs */}
                {[
                  { id: 'profile', label: 'Profile', icon: User, shortLabel: 'Profile' },
                  { id: 'orders', label: 'Orders', icon: Package, shortLabel: 'Orders' },
                  { id: 'settings', label: 'Settings', icon: Settings, shortLabel: 'Settings' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-1 sm:gap-2 px-2 xs:px-3 sm:px-6 py-3 rounded-xl font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                    }`}
                    title={tab.label}
                  >
                    <tab.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="text-sm sm:text-base hidden xs:inline">{tab.shortLabel}</span>
                  </button>
                ))}
                
                {/* Secondary Actions - Show on larger screens */}
                <div className="hidden xs:flex items-center gap-2">
                  <button
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-white/50 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap flex-shrink-0"
                    title="Refresh profile data"
                  >
                    <RefreshCw className={`h-4 w-4 sm:h-5 sm:w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                    <span className="text-sm sm:text-base">Refresh</span>
                  </button>
                  
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-3 rounded-xl font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                      isEditing 
                        ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                    }`}
                    title={isEditing ? 'Cancel editing' : 'Edit profile'}
                  >
                    <Edit3 className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="text-sm sm:text-base">{isEditing ? 'Cancel' : 'Edit'}</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('downloads')}
                    className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-3 rounded-xl font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                      activeTab === 'downloads'
                        ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                    }`}
                    title="Downloads"
                  >
                    <Download className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="text-sm sm:text-base">Downloads</span>
                  </button>
                </div>

                {/* More Menu for very small screens */}
                <div className="relative xs:hidden" ref={moreMenuRef}>
                  <button
                    onClick={() => setShowMoreMenu(!showMoreMenu)}
                    className="flex items-center gap-1 px-2 py-3 text-gray-600 hover:text-gray-900 hover:bg-white/50 rounded-xl font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0"
                    title="More actions"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                  
                  {/* Dropdown Menu */}
                  {showMoreMenu && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                      <button
                        onClick={() => {
                          handleRefresh()
                          setShowMoreMenu(false)
                        }}
                        disabled={isRefreshing}
                        className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                        <span className="text-sm">Refresh</span>
                      </button>
                      
                      <button
                        onClick={() => {
                          setIsEditing(!isEditing)
                          setShowMoreMenu(false)
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Edit3 className="h-4 w-4" />
                        <span className="text-sm">{isEditing ? 'Cancel' : 'Edit Profile'}</span>
                      </button>
                      
                      <button
                        onClick={() => {
                          setActiveTab('downloads')
                          setShowMoreMenu(false)
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Download className="h-4 w-4" />
                        <span className="text-sm">Downloads</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'profile' && (
            <div className="space-y-8">
              
              {/* Personal Information */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl">
                    <User className="h-6 w-6 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Personal Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Full Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.name}
                        onChange={(e) => setEditData({...editData, name: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200">
                        <p className="text-gray-800">{user.name}</p>
                      </div>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <div className="px-4 py-3 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200">
                      <p className="text-gray-800 break-all">{user.email}</p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Phone</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editData.phone}
                        onChange={(e) => setEditData({...editData, phone: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200">
                        <p className="text-gray-800">{user.phone || 'Not provided'}</p>
                      </div>
                    )}
                  </div>

                  {/* Birthday */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Birthday</label>
                    {isEditing ? (
                      <input
                        type="date"
                        value={editData.birthday}
                        onChange={(e) => setEditData({...editData, birthday: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200">
                        <p className="text-gray-800">
                          {user.birthday ? new Date(user.birthday).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          }) : 'Not provided'}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Address */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700">Address</label>
                    {isEditing ? (
                      <textarea
                        value={editData.address}
                        onChange={(e) => setEditData({...editData, address: e.target.value})}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white/50 backdrop-blur-sm resize-none"
                        placeholder="Enter your address"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200">
                        <p className="text-gray-800">{user.address || 'Not provided'}</p>
                      </div>
                    )}
                  </div>
                </div>

                {isEditing && (
                  <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      <CheckCircle className="h-5 w-5" />
                      Save Changes
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-200"
                    >
                      <X className="h-5 w-5" />
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              {/* Account Status */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl">
                    <Shield className="h-6 w-6 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Account Status</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Price Access */}
                  <div className="p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-emerald-200 rounded-lg">
                        <Eye className="h-5 w-5 text-emerald-700" />
                      </div>
                      <h3 className="font-semibold text-gray-800">Price Access</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      {user.canSeePrices ? (
                        <>
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-200 text-emerald-800 rounded-full text-sm font-medium">
                            <CheckCircle className="h-4 w-4" />
                            Allowed
                          </span>
                          <p className="text-emerald-700 text-sm font-medium">You can view product prices</p>
                        </>
                      ) : (
                        <>
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-200 text-red-800 rounded-full text-sm font-medium">
                            <Lock className="h-4 w-4" />
                            Restricted
                          </span>
                          <p className="text-red-700 text-sm font-medium">Price access required</p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Discount Level */}
                  {user.discountType && (
                    <div className={`p-6 rounded-xl border ${
                      user.discountType === 'CLINIC' 
                        ? 'bg-gradient-to-br from-green-50 to-green-100 border-green-200' 
                        : 'bg-gradient-to-br from-red-50 to-red-100 border-red-200'
                    }`}>
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`p-2 rounded-lg ${
                          user.discountType === 'CLINIC' ? 'bg-green-200' : 'bg-red-200'
                        }`}>
                          {user.discountType === 'CLINIC' ? (
                            <Building className="h-5 w-5 text-green-700" />
                          ) : (
                            <Crown className="h-5 w-5 text-red-700" />
                          )}
                        </div>
                        <h3 className="font-semibold text-gray-800">Discount Level</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                          user.discountType === 'CLINIC' 
                            ? 'bg-green-200 text-green-800' 
                            : 'bg-red-200 text-red-800'
                        }`}>
                          {user.discountType === 'CLINIC' ? (
                            <Building className="h-4 w-4" />
                          ) : (
                            <Crown className="h-4 w-4" />
                          )}
                          {user.discountType} {user.discountPercentage}% OFF
                        </span>
                        <p className={`text-sm font-medium ${
                          user.discountType === 'CLINIC' ? 'text-green-700' : 'text-red-700'
                        }`}>
                          {user.discountType === 'CLINIC' ? 'Clinic Partnership' : 'VIP Customer'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Support Section */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl">
                    <MessageCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Need Help?</h2>
                    <p className="text-gray-600">Get instant support via WhatsApp</p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href="https://wa.me/971585487665"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <MessageCircle className="h-5 w-5" />
                    Start WhatsApp Chat
                  </a>
                  <div className="flex items-center justify-center gap-2 text-gray-600">
                    <Phone className="h-5 w-5" />
                    <span className="font-medium">+971 58 548 76 65</span>
                  </div>
                </div>
                
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    <span>Available 24/7</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>Quick response</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Gift className="h-4 w-4" />
                    <span>Product recommendations</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl">
                  <Package className="h-6 w-6 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Order History</h2>
              </div>
              
              {loadingOrders ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                  <p className="text-gray-500">Loading your orders...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Package className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">No orders yet</h3>
                  <p className="text-gray-500 mb-6">Start shopping to see your order history here!</p>
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <ShoppingBag className="h-5 w-5" />
                    Browse Products
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <div key={order.id} className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-200">
                      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-lg font-semibold text-gray-800">Order #{order.id}</h3>
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                              {getStatusIcon(order.status)}
                              {order.status.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-4">
                            {new Date(order.createdAt).toLocaleDateString('en-AE', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {order.items.slice(0, 3).map((item, index) => (
                              <div key={index} className="flex items-center gap-2 bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                                <img
                                  src={item.image}
                                  alt={item.productName}
                                  className="w-10 h-10 object-cover rounded-lg"
                                />
                                <span className="text-sm text-gray-700 font-medium">
                                  {item.productName} × {item.quantity}
                                </span>
                              </div>
                            ))}
                            {order.items.length > 3 && (
                              <div className="flex items-center bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                                <span className="text-sm text-gray-500 font-medium">
                                  +{order.items.length - 3} more items
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-center lg:text-right">
                          <p className="text-2xl font-bold text-gray-800 mb-2">{formatCurrency(order.total)}</p>
                          <p className="text-sm text-gray-500 mb-4">
                            {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
                          </p>
                          {(order.status === 'pending' || order.status === 'paid') && (
                            <button
                              onClick={() => cancelOrder(order.id)}
                              className="px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors font-medium"
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
          )}

          {activeTab === 'settings' && (
            <div className="space-y-8">
              
              {/* Account Actions */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl">
                    <Settings className="h-6 w-6 text-gray-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Account Actions</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Logout */}
                  <button
                    onClick={logout}
                    className="flex items-center gap-4 p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-xl border border-red-200 hover:from-red-100 hover:to-red-200 transition-all duration-200 group"
                  >
                    <div className="p-3 bg-red-200 rounded-lg group-hover:bg-red-300 transition-colors">
                      <ArrowLeft className="h-6 w-6 text-red-700" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-800">Logout</h3>
                      <p className="text-sm text-gray-600">Sign out of your account</p>
                    </div>
                  </button>

                  {/* Delete Account */}
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="flex items-center gap-4 p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-xl border border-red-200 hover:from-red-100 hover:to-red-200 transition-all duration-200 group"
                  >
                    <div className="p-3 bg-red-200 rounded-lg group-hover:bg-red-300 transition-colors">
                      <Trash2 className="h-6 w-6 text-red-700" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-800">Delete Account</h3>
                      <p className="text-sm text-gray-600">Permanently delete your account</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-r from-red-100 to-pink-100 rounded-xl">
                    <Zap className="h-6 w-6 text-red-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Quick Actions</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  
                  <Link
                    href="/products"
                    className="flex flex-col items-center gap-3 p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200 hover:from-emerald-100 hover:to-emerald-200 transition-all duration-200 group"
                  >
                    <div className="p-3 bg-emerald-200 rounded-lg group-hover:bg-emerald-300 transition-colors">
                      <ShoppingBag className="h-6 w-6 text-emerald-700" />
                    </div>
                    <div className="text-center">
                      <h3 className="font-semibold text-gray-800">Browse Products</h3>
                      <p className="text-sm text-gray-600">Shop our collection</p>
                    </div>
                  </Link>

                  <Link
                    href="/favorites"
                    className="flex flex-col items-center gap-3 p-6 bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl border border-pink-200 hover:from-pink-100 hover:to-pink-200 transition-all duration-200 group"
                  >
                    <div className="p-3 bg-pink-200 rounded-lg group-hover:bg-pink-300 transition-colors">
                      <Heart className="h-6 w-6 text-pink-700" />
                    </div>
                    <div className="text-center">
                      <h3 className="font-semibold text-gray-800">Favorites</h3>
                      <p className="text-sm text-gray-600">Your saved items</p>
                    </div>
                  </Link>

                  <a
                    href="https://wa.me/971585487665"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-3 p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 hover:from-green-100 hover:to-green-200 transition-all duration-200 group"
                  >
                    <div className="p-3 bg-green-200 rounded-lg group-hover:bg-green-300 transition-colors">
                      <MessageCircle className="h-6 w-6 text-green-700" />
                    </div>
                    <div className="text-center">
                      <h3 className="font-semibold text-gray-800">Support</h3>
                      <p className="text-sm text-gray-600">Get help via WhatsApp</p>
                    </div>
                  </a>

                  <button
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="flex flex-col items-center gap-3 p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 hover:from-green-100 hover:to-green-200 transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="p-3 bg-green-200 rounded-lg group-hover:bg-green-300 transition-colors">
                      <RefreshCw className={`h-6 w-6 text-green-700 ${isRefreshing ? 'animate-spin' : ''}`} />
                    </div>
                    <div className="text-center">
                      <h3 className="font-semibold text-gray-800">Refresh</h3>
                      <p className="text-sm text-gray-600">Update profile data</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'downloads' && (
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl">
                  <Download className="h-6 w-6 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Download Documents</h2>
              </div>
              
              <div className="text-center mb-8">
                <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                  Access our guides and training manuals to enhance your professional/home training
                </p>
              </div>
              
              {/* Training Documents Section */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  Training Documents
                </h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="group border border-gray-200 rounded-lg p-6 hover:border-green-300 hover:shadow-lg transition-all duration-200">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-100 transition-colors">
                        <Download className="h-8 w-8 text-green-600" />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">
                        Product Catalogue 2026
                      </h4>
                      <p className="text-sm text-gray-500 mb-4">
                        Complete product overview and specifications
                      </p>
                      <p className="text-xs text-gray-400 mb-4">
                        235.5 MB
                      </p>
                      <a 
                        href="https://u.pcloud.link/publink/show?code=XZ9wc15ZDTFcM6uvKg0snY1dEJwzwQgHsEF7"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-full px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-colors font-medium"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </a>
                    </div>
                  </div>
                  
                  <div className="group border border-gray-200 rounded-lg p-6 hover:border-green-300 hover:shadow-lg transition-all duration-200">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-100 transition-colors">
                        <Download className="h-8 w-8 text-green-600" />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">
                        Home Care Guide 2026
                      </h4>
                      <p className="text-sm text-gray-500 mb-4">
                        Professional home care protocols and guidelines
                      </p>
                      <p className="text-xs text-gray-400 mb-4">
                        9.8 MB
                      </p>
                      <a 
                        href="https://genosys.ae/documents/Genosys-Home-Care-Guide.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-full px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-colors font-medium"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </a>
                    </div>
                  </div>
                  
                  <div className="group border border-gray-200 rounded-lg p-6 hover:border-green-300 hover:shadow-lg transition-all duration-200">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-100 transition-colors">
                        <Download className="h-8 w-8 text-green-600" />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">
                        Professional Manual 2026
                      </h4>
                      <p className="text-sm text-gray-500 mb-4">
                        Comprehensive professional treatment manual
                      </p>
                      <p className="text-xs text-gray-400 mb-4">
                        10.4 MB
                      </p>
                      <a 
                        href="https://genosys.ae/documents/Genosys-Professional-Manual.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-full px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-colors font-medium"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Product Documentation Section */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                  Product Documentation
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="group border border-gray-200 rounded-lg p-6 hover:border-red-300 hover:shadow-lg transition-all duration-200">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4 overflow-hidden">
                        <Link href="/products/31">
                          <img 
                            src="/images/RAA.jpg" 
                            alt="MULTI VITA RADIANCE CREAM" 
                            className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                          />
                        </Link>
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">
                        MULTI VITA RADIANCE CREAM
                      </h4>
                      <p className="text-sm text-gray-500 mb-2">
                        Product guide
                      </p>
                      <p className="text-xs text-gray-400 mb-4">
                        2.1 MB
                      </p>
                      <a 
                        href="/documents/ppt/GENOSYS%20MULTI%20VITA%20RADIANCE%20CREAM.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-full px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-colors font-medium"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </a>
                    </div>
                  </div>
                  
                  <div className="group border border-gray-200 rounded-lg p-6 hover:border-red-300 hover:shadow-lg transition-all duration-200">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4 overflow-hidden">
                        <Link href="/products/50">
                          <img 
                            src="/images/EYEZ.jpg" 
                            alt="EyeCell EYE ZONE CARE SYSTEM" 
                            className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                          />
                        </Link>
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">
                        EyeCell EYE ZONE CARE SYSTEM
                      </h4>
                      <p className="text-sm text-gray-500 mb-2">
                        Product guide
                      </p>
                      <p className="text-xs text-gray-400 mb-4">
                        1.8 MB
                      </p>
                      <a 
                        href="/documents/ppt/GENOSYS%20EyeCell%20EYE%20ZONE%20CARE%20SYSTEM.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-full px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-colors font-medium"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </a>
                    </div>
                  </div>
                  
                  {/* EPI TURNOVER BOOSTING PEELING GEL */}
                  <div className="group border border-gray-200 rounded-lg p-6 hover:border-red-300 hover:shadow-lg transition-all duration-200">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4 overflow-hidden">
                        <Link href="/products/12">
                          <img 
                            src="/images/EPI.jpg" 
                            alt="EPI TURNOVER BOOSTING PEELING GEL" 
                            className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                          />
                        </Link>
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">
                        EPI TURNOVER BOOSTING PEELING GEL
                      </h4>
                      <p className="text-sm text-gray-500 mb-2">
                        Product guide
                      </p>
                      <p className="text-xs text-gray-400 mb-4">
                        3.8 MB
                      </p>
                      <a 
                        href="/documents/ppt/GENOSYS%20EPI%20TURNOVER%20BOOSTING%20PEELING%20GEL.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-full px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-colors font-medium"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </a>
                    </div>
                  </div>
                  
                  {/* MULTI VITA RADIANCE SERUM */}
                  <div className="group border border-gray-200 rounded-lg p-6 hover:border-red-300 hover:shadow-lg transition-all duration-200">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4 overflow-hidden">
                        <Link href="/products/21">
                          <img 
                            src="/images/RADS.jpg" 
                            alt="MULTI VITA RADIANCE SERUM" 
                            className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                          />
                        </Link>
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">
                        MULTI VITA RADIANCE SERUM
                      </h4>
                      <p className="text-sm text-gray-500 mb-2">
                        Product guide
                      </p>
                      <p className="text-xs text-gray-400 mb-4">
                        1.5 MB
                      </p>
                      <a 
                        href="/documents/ppt/GENOSYS%20MULTI%20VITA%20RADIANCE%20SERUM.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-full px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-colors font-medium"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </a>
                    </div>
                  </div>
                  
                  {/* SKIN DEFENDER LIP & EYE MAKEUP REMOVER */}
                  <div className="group border border-gray-200 rounded-lg p-6 hover:border-red-300 hover:shadow-lg transition-all duration-200">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4 overflow-hidden">
                        <Link href="/products/11">
                          <img 
                            src="/images/DEF.jpg" 
                            alt="SKIN DEFENDER LIP & EYE MAKEUP REMOVER" 
                            className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                          />
                        </Link>
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">
                        SKIN DEFENDER LIP & EYE MAKEUP REMOVER
                      </h4>
                      <p className="text-sm text-gray-500 mb-2">
                        Product guide
                      </p>
                      <p className="text-xs text-gray-400 mb-4">
                        0.7 MB
                      </p>
                      <a 
                        href="/documents/ppt/GENOSYS%20SKIN%20DEFENDER%20LIP%20%26%20EYE%20MAKEUP%20REMOVER.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-full px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-colors font-medium"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </a>
                    </div>
                  </div>
                  
                  {/* MICROBIOME ENERGY INFUSING MIST */}
                  <div className="group border border-gray-200 rounded-lg p-6 hover:border-red-300 hover:shadow-lg transition-all duration-200">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4 overflow-hidden">
                        <Link href="/products/14">
                          <img 
                            src="/images/mist.jpg" 
                            alt="MICROBIOME ENERGY INFUSING MIST" 
                            className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                          />
                        </Link>
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">
                        MICROBIOME ENERGY INFUSING MIST
                      </h4>
                      <p className="text-sm text-gray-500 mb-2">
                        Product guide
                      </p>
                      <p className="text-xs text-gray-400 mb-4">
                        0.8 MB
                      </p>
                      <a 
                        href="/documents/ppt/GENOSYS%20MICROBIOME%20ENERGY%20INFUSING%20MIST.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-full px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-colors font-medium"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </a>
                    </div>
                  </div>
                  
                  {/* SKIN RESCUE OVERNIGHT CREAM MASK */}
                  <div className="group border border-gray-200 rounded-lg p-6 hover:border-red-300 hover:shadow-lg transition-all duration-200">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4 overflow-hidden">
                        <Link href="/products/34">
                          <img 
                            src="/images/SKIN.jpg" 
                            alt="SKIN RESCUE OVERNIGHT CREAM MASK" 
                            className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                          />
                        </Link>
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">
                        SKIN RESCUE OVERNIGHT CREAM MASK
                      </h4>
                      <p className="text-sm text-gray-500 mb-2">
                        Product guide
                      </p>
                      <p className="text-xs text-gray-400 mb-4">
                        1.3 MB
                      </p>
                      <a 
                        href="/documents/ppt/GENOSYS%20SKIN%20RESCUE%20OVERNIGHT%20CREAM%20MASK.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-full px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-colors font-medium"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </a>
                    </div>
                  </div>
                  
                  {/* INTENSIVE PROBLEM CONTROL TONER */}
                  <div className="group border border-gray-200 rounded-lg p-6 hover:border-red-300 hover:shadow-lg transition-all duration-200">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4 overflow-hidden">
                        <Link href="/products/15">
                          <img 
                            src="/images/PRS.jpg" 
                            alt="INTENSIVE PROBLEM CONTROL TONER" 
                            className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                          />
                        </Link>
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">
                        INTENSIVE PROBLEM CONTROL TONER
                      </h4>
                      <p className="text-sm text-gray-500 mb-2">
                        Product guide
                      </p>
                      <p className="text-xs text-gray-400 mb-4">
                        1.0 MB
                      </p>
                      <a 
                        href="/documents/ppt/GENOSYS%20INTENSIVE%20PROBLEM%20CONTROL%20TONER.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-full px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-colors font-medium"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </a>
                    </div>
                  </div>
                  
                  {/* ULTRA SHIELD SUN CREAM */}
                  <div className="group border border-gray-200 rounded-lg p-6 hover:border-red-300 hover:shadow-lg transition-all duration-200">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4 overflow-hidden">
                        <Link href="/products/39">
                          <img 
                            src="/images/SPF50.jpg" 
                            alt="ULTRA SHIELD SUN CREAM" 
                            className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                          />
                        </Link>
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">
                        ULTRA SHIELD SUN CREAM
                      </h4>
                      <p className="text-sm text-gray-500 mb-2">
                        Product guide
                      </p>
                      <p className="text-xs text-gray-400 mb-4">
                        0.6 MB
                      </p>
                      <a 
                        href="/documents/ppt/GENOSYS%20ULTRA%20SHIELD%20SUN%20CREAM.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-full px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-colors font-medium"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </a>
                    </div>
                  </div>
                  
                  {/* HR³ MATRIX SCALP SHAMPOO α */}
                  <div className="group border border-gray-200 rounded-lg p-6 hover:border-red-300 hover:shadow-lg transition-all duration-200">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4 overflow-hidden">
                        <Link href="/products/44">
                          <img 
                            src="/images/Sham.jpg" 
                            alt="HR³ MATRIX SCALP SHAMPOO α" 
                            className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                          />
                        </Link>
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">
                        HR³ MATRIX SCALP SHAMPOO α
                      </h4>
                      <p className="text-sm text-gray-500 mb-2">
                        Product guide
                      </p>
                      <p className="text-xs text-gray-400 mb-4">
                        2.3 MB
                      </p>
                      <a 
                        href="/documents/ppt/GENOSYS%20HR3%20MATRIX%20SCALP%20SHAMPOO%20ALPHA.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-full px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-colors font-medium"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </a>
                    </div>
                  </div>
                  
                  {/* MOISTURE REPLENISHING HYALURON SERUM */}
                  <div className="group border border-gray-200 rounded-lg p-6 hover:border-red-300 hover:shadow-lg transition-all duration-200">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4 overflow-hidden">
                        <Link href="/products/18">
                          <img 
                            src="/images/HRS.jpg" 
                            alt="MOISTURE REPLENISHING HYALURON SERUM" 
                            className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                          />
                        </Link>
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">
                        MOISTURE REPLENISHING HYALURON SERUM
                      </h4>
                      <p className="text-sm text-gray-500 mb-2">
                        Product guide
                      </p>
                      <p className="text-xs text-gray-400 mb-4">
                        1.9 MB
                      </p>
                      <a 
                        href="/documents/ppt/GENOSYS%20MOISTURE%20REPLENISHING%20HYALURON%20SERUM.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-full px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-colors font-medium"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </a>
                    </div>
                  </div>
                  
                  {/* MOISTURE REPLENISHING HYALURON CREAM */}
                  <div className="group border border-gray-200 rounded-lg p-6 hover:border-red-300 hover:shadow-lg transition-all duration-200">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4 overflow-hidden">
                        <Link href="/products/29">
                          <img 
                            src="/images/HER.jpg" 
                            alt="MOISTURE REPLENISHING HYALURON CREAM" 
                            className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                          />
                        </Link>
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">
                        MOISTURE REPLENISHING HYALURON CREAM
                      </h4>
                      <p className="text-sm text-gray-500 mb-2">
                        Product guide
                      </p>
                      <p className="text-xs text-gray-400 mb-4">
                        2.0 MB
                      </p>
                      <a 
                        href="/documents/ppt/GENOSYS%20MOISTURE%20REPLENISHING%20HYALURON%20CREAM.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-full px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-colors font-medium"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </a>
                    </div>
                  </div>
                  
                  {/* SKIN CARING BLEMISH BALM CUSHION */}
                  <div className="group border border-gray-200 rounded-lg p-6 hover:border-red-300 hover:shadow-lg transition-all duration-200">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4 overflow-hidden">
                        <Link href="/products/41">
                          <img 
                            src="/images/BBC.jpg" 
                            alt="SKIN CARING BLEMISH BALM CUSHION" 
                            className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                          />
                        </Link>
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">
                        SKIN CARING BLEMISH BALM CUSHION
                      </h4>
                      <p className="text-sm text-gray-500 mb-2">
                        Product guide
                      </p>
                      <p className="text-xs text-gray-400 mb-4">
                        1.2 MB
                      </p>
                      <a 
                        href="/documents/ppt/GENOSYS%20SKIN%20CARING%20BLEMISH%20BALM%20CUSHION.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-full px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-colors font-medium"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </a>
                    </div>
                  </div>
                  
                  {/* EyeCell EYE PEPTIDE GEL PATCH */}
                  <div className="group border border-gray-200 rounded-lg p-6 hover:border-red-300 hover:shadow-lg transition-all duration-200">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4 overflow-hidden">
                        <Link href="/products/33">
                          <img 
                            src="/images/Patch.jpg" 
                            alt="EyeCell EYE PEPTIDE GEL PATCH" 
                            className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                          />
                        </Link>
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">
                        EyeCell EYE PEPTIDE GEL PATCH
                      </h4>
                      <p className="text-sm text-gray-500 mb-2">
                        Product guide
                      </p>
                      <p className="text-xs text-gray-400 mb-4">
                        1.4 MB
                      </p>
                      <a 
                        href="/documents/ppt/GENOSYS%20EyeCell%20EYE%20PEPTIDE%20GEL%20PATCH.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-full px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-colors font-medium"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </a>
                    </div>
                  </div>
                  
                  {/* BIO-FERMENT AGE DEFYING POWDER MASK */}
                  <div className="group border border-gray-200 rounded-lg p-6 hover:border-red-300 hover:shadow-lg transition-all duration-200">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4 overflow-hidden">
                        <Link href="/products/51">
                          <img 
                            src="/images/BFAD.png" 
                            alt="BIO-FERMENT AGE DEFYING POWDER MASK" 
                            className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                          />
                        </Link>
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">
                        BIO-FERMENT AGE DEFYING POWDER MASK
                      </h4>
                      <p className="text-sm text-gray-500 mb-2">
                        Product guide
                      </p>
                      <p className="text-xs text-gray-400 mb-4">
                        2.1 MB
                      </p>
                      <a 
                        href="/documents/ppt/GENOSYS%20BIO-FERMENT%20AGE%20DEFYING%20POWDER%20MASK.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-full px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-colors font-medium"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-red-100 rounded-xl">
                <Trash2 className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Delete Account</h3>
            </div>
            
            <div className="mb-8">
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete your account? This action cannot be undone.
              </p>
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-red-800 font-medium mb-2">This will permanently delete:</p>
                <ul className="text-red-700 text-sm space-y-1">
                  <li>• Your profile and personal information</li>
                  <li>• All order history</li>
                  <li>• Your customer number (#{customerNumber})</li>
                  <li>• All saved preferences and data</li>
                </ul>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-5 w-5" />
                    Yes, Delete My Account
                  </>
                )}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-200 disabled:opacity-50"
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
