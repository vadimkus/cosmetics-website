'use client'

import Link from 'next/link'
import { ArrowLeft, User, Package, Settings, Download, Shield, Trash2, X, RefreshCw, Edit3 } from 'lucide-react'
import { useAuth } from '@/components/AuthProvider'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Order, OrderItem } from '@prisma/client'
import { fetchCsrfToken, getCsrfHeaders, addCsrfToBody } from '@/lib/csrfClient'
import { errorLog } from '@/lib/logger'

// Import refactored components
import ProfileHeader from '@/components/profile/ProfileHeader'
import ProfileForm from '@/components/profile/ProfileForm'
import OrderHistory from '@/components/profile/OrderHistory'
import SettingsPanel from '@/components/profile/SettingsPanel'
import DownloadsSection from '@/components/profile/DownloadsSection'
import PrivacySettings from '@/components/profile/PrivacySettings'

// Constants
const LOCAL_STORAGE_KEYS = {
  USER: 'genosys_user',
  CUSTOMER_NUMBER: (userId: string) => `customer_number_${userId}`,
  LAST_CUSTOMER_NUMBER: 'last_customer_number'
} as const

const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5MB
const REFRESH_ANIMATION_DELAY = 1000 // 1 second

// Custom type that includes the items relation
type OrderWithItems = Order & {
  items: OrderItem[]
}

// Tab type for better type safety
type ActiveTab = 'profile' | 'orders' | 'settings' | 'downloads' | 'privacy'

// Edit data type
type EditData = {
  name: string
  phone: string
  address: string
  birthday: string
}

// Helper function for error messages
const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === 'string') {
    return error
  }
  return 'An unknown error occurred'
}

// Helper function for API error handling
const handleApiError = (error: unknown, defaultMessage: string): void => {
  errorLog(defaultMessage, error)
  alert(`${defaultMessage}: ${getErrorMessage(error)}`)
}

export default function ProfilePageRefactored() {
  const { user, logout, forceRefreshUser } = useAuth()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState<EditData>({
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
  const [showCancelOrderConfirm, setShowCancelOrderConfirm] = useState(false)
  const [orderToCancel, setOrderToCancel] = useState<string | null>(null)
  const [orders, setOrders] = useState<OrderWithItems[]>([])
  const [loadingOrders, setLoadingOrders] = useState(false)
  const [activeTab, setActiveTab] = useState<ActiveTab>('profile')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Fetch CSRF token on mount
  useEffect(() => {
    fetchCsrfToken().catch(err => {
      errorLog('Failed to fetch CSRF token:', err)
    })
  }, [])

  // Handle refresh with loading state
  const handleRefresh = async () => {
    if (isRefreshing) return // Prevent multiple simultaneous refreshes
    
    setIsRefreshing(true)
    try {
      await forceRefreshUser()
    } catch (error) {
      errorLog('Error refreshing user data:', error)
    } finally {
      // Add a small delay to show the animation
      setTimeout(() => {
        setIsRefreshing(false)
      }, REFRESH_ANIMATION_DELAY)
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
      
      const savedCustomerNumber = localStorage.getItem(LOCAL_STORAGE_KEYS.CUSTOMER_NUMBER(user.id))
      if (savedCustomerNumber) {
        setCustomerNumber(parseInt(savedCustomerNumber, 10))
      } else {
        const lastCustomerNumber = parseInt(localStorage.getItem(LOCAL_STORAGE_KEYS.LAST_CUSTOMER_NUMBER) || '0', 10)
        const newCustomerNumber = lastCustomerNumber + 1
        
        localStorage.setItem(LOCAL_STORAGE_KEYS.CUSTOMER_NUMBER(user.id), newCustomerNumber.toString())
        localStorage.setItem(LOCAL_STORAGE_KEYS.LAST_CUSTOMER_NUMBER, newCustomerNumber.toString())
        
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
          errorLog('Failed to fetch orders:', response.statusText)
        }
      } catch (error) {
        errorLog('Error fetching orders:', error)
      } finally {
        setLoadingOrders(false)
      }
    }

    fetchOrders()
  }, [user?.email])

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file')
        return
      }
      
      if (file.size > MAX_IMAGE_SIZE) {
        alert(`Image size should be less than ${MAX_IMAGE_SIZE / (1024 * 1024)}MB`)
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

      // Ensure CSRF token is available
      const csrfToken = await fetchCsrfToken()
      if (!csrfToken) {
        alert('Security error: Could not verify request. Please refresh the page and try again.')
        return
      }

      const response = await fetch('/api/profile/update', {
        method: 'POST',
        headers: getCsrfHeaders(),
        body: JSON.stringify(addCsrfToBody({
          userId: user.id,
          updates: {
            ...editData,
            profilePicture
          }
        })),
      })

      const responseData = await response.json()

      if (response.ok) {
        const updatedUser = { ...user, ...editData, profilePicture }
        localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(updatedUser))
        setIsEditing(false)
        alert('Profile updated successfully!')
        window.location.reload()
      } else {
        errorLog('Failed to update profile:', responseData)
        alert(`Failed to update profile: ${responseData.error || 'Unknown error'}`)
      }
    } catch (error) {
      handleApiError(error, 'Error updating profile')
    }
  }

  const handleCancel = () => {
    if (!user) return
    
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
      // Ensure CSRF token is available
      const csrfToken = await fetchCsrfToken()
      if (!csrfToken) {
        alert('Security error: Could not verify request. Please refresh the page and try again.')
        setIsDeleting(false)
        return
      }

      const response = await fetch('/api/profile/delete', {
        method: 'DELETE',
        headers: getCsrfHeaders(),
        body: JSON.stringify(addCsrfToBody({ userId: user.id })),
      })

      if (response.ok) {
        localStorage.removeItem(LOCAL_STORAGE_KEYS.USER)
        localStorage.removeItem(LOCAL_STORAGE_KEYS.CUSTOMER_NUMBER(user.id))
        
        // Immediately logout and redirect
        logout()
        router.push('/')
        
        // Show success message after redirect
        setTimeout(() => {
          alert('Your account has been successfully deleted.')
        }, 100)
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to delete account. Please try again.')
      }
    } catch (error) {
      handleApiError(error, 'Error deleting account')
    } finally {
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  const handleCancelOrderClick = (orderId: string) => {
    setOrderToCancel(orderId)
    setShowCancelOrderConfirm(true)
  }

  const cancelOrder = async () => {
    if (!orderToCancel) return

    try {
      // Ensure CSRF token is available
      const csrfToken = await fetchCsrfToken()
      if (!csrfToken) {
        alert('Security error: Could not verify request. Please refresh the page and try again.')
        setShowCancelOrderConfirm(false)
        setOrderToCancel(null)
        return
      }

      const encodedOrderId = encodeURIComponent(orderToCancel)
      const response = await fetch(`/api/orders/${encodedOrderId}/cancel`, {
        method: 'POST',
        headers: getCsrfHeaders(),
        body: JSON.stringify(addCsrfToBody({}))
      })
      
      if (response.ok) {
        setOrders(orders.filter(order => order.id !== orderToCancel))
        setShowCancelOrderConfirm(false)
        setOrderToCancel(null)
        alert('Order cancelled and removed successfully')
      } else {
        const errorData = await response.json()
        alert(`Failed to cancel order: ${errorData.error || 'Unknown error'}`)
      }
    } catch (error) {
      handleApiError(error, 'Failed to cancel order')
    } finally {
      setShowCancelOrderConfirm(false)
      setOrderToCancel(null)
    }
  }

  // Show loading or nothing while redirecting
  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-40">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb Navigation */}
      <div className="bg-gray-50/80 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <nav className="flex items-center space-x-2 text-sm" aria-label="Breadcrumb">
            <Link 
              href="/" 
              className="text-gray-500 hover:text-gray-700 transition-colors flex items-center gap-1"
            >
              <span>Home</span>
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">Profile</span>
            {activeTab !== 'profile' && (
              <>
                <span className="text-gray-400">/</span>
                <span className="text-gray-900 font-medium capitalize">{activeTab}</span>
              </>
            )}
          </nav>
        </div>
      </div>

      {/* Back to Home Button */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Back to Home</span>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 pt-3 sm:pt-4">
        <div className="max-w-6xl mx-auto">
          
          {/* Profile Header Card */}
          <ProfileHeader
            user={user}
            isEditing={isEditing}
            previewImage={previewImage}
            customerNumber={customerNumber}
            onImageUpload={handleImageUpload}
            onRemoveImage={handleRemoveImage}
            fileInputRef={fileInputRef}
          />

          {/* Navigation Tabs */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-2 mb-4 sm:mb-6 lg:mb-8">
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
                  { id: 'settings', label: 'Settings', icon: Settings, shortLabel: 'Settings' },
                  { id: 'downloads', label: 'Downloads', icon: Download, shortLabel: 'Downloads' },
                  { id: 'privacy', label: 'Privacy', icon: Shield, shortLabel: 'Privacy' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as ActiveTab)}
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
                
                {/* Action Buttons - Refresh and Edit */}
                <div className="flex items-center gap-2">
                  {/* Refresh Button */}
                  <button
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="flex items-center gap-1 sm:gap-2 px-2 xs:px-3 sm:px-4 py-3 bg-white/50 backdrop-blur-sm text-gray-600 rounded-xl font-medium hover:bg-white/70 transition-all duration-200 disabled:opacity-50 whitespace-nowrap flex-shrink-0"
                    title="Refresh profile data"
                  >
                    <RefreshCw className={`h-4 w-4 sm:h-5 sm:w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                    <span className="text-sm sm:text-base hidden xs:inline sm:inline">Refresh</span>
                  </button>

                  {/* Edit Button */}
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className={`flex items-center gap-1 sm:gap-2 px-2 xs:px-3 sm:px-4 py-3 rounded-xl font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                      isEditing 
                        ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                    }`}
                    title={isEditing ? 'Cancel editing' : 'Edit profile'}
                  >
                    <Edit3 className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="text-sm sm:text-base hidden xs:inline sm:inline">{isEditing ? 'Cancel' : 'Edit'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'profile' && (
            <ProfileForm
              user={user}
              isEditing={isEditing}
              editData={editData}
              onEditDataChange={setEditData}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          )}

          {activeTab === 'orders' && (
            <OrderHistory
              orders={orders}
              loadingOrders={loadingOrders}
              onCancelOrder={handleCancelOrderClick}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsPanel
              isRefreshing={isRefreshing}
              onLogout={logout}
              onDeleteAccount={() => setShowDeleteConfirm(true)}
              onRefresh={handleRefresh}
            />
          )}

          {activeTab === 'downloads' && (
            <DownloadsSection />
          )}

          {activeTab === 'privacy' && (
            <PrivacySettings />
          )}

        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-md w-full p-4 sm:p-6 lg:p-8 max-h-[90vh] overflow-y-auto">
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
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="flex-1 bg-red-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] touch-manipulation"
              >
                {isDeleting ? 'Deleting...' : 'Delete Account'}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-xl font-semibold hover:bg-gray-300 transition-colors min-h-[44px] touch-manipulation"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Order Confirmation Modal */}
      {showCancelOrderConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-md w-full p-4 sm:p-6 lg:p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-red-100 rounded-xl">
                <X className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Cancel Order</h3>
            </div>
            
            <div className="mb-8">
              <p className="text-gray-600 mb-4">
                Are you sure you want to cancel this order? The order will be permanently removed from your history. This action cannot be undone.
              </p>
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-red-800 font-medium mb-2">This will:</p>
                <ul className="text-red-700 text-sm space-y-1">
                  <li>• Permanently cancel the order</li>
                  <li>• Remove it from your order history</li>
                  <li>• Cannot be restored</li>
                </ul>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={cancelOrder}
                className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-red-700 transition-colors min-h-[44px] touch-manipulation"
              >
                <X className="h-5 w-5" />
                Yes, Cancel Order
              </button>
              <button
                onClick={() => {
                  setShowCancelOrderConfirm(false)
                  setOrderToCancel(null)
                }}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors min-h-[44px] touch-manipulation"
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
