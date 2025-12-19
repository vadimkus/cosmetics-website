'use client'

import Link from 'next/link'
import { ArrowLeft, User, Package, Settings, Download, Shield, Trash2, X, RefreshCw, Edit3, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { useAuth } from '@/components/AuthProvider'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Order, OrderItem } from '@prisma/client'
import { fetchCsrfToken, getCsrfHeaders, addCsrfToBody } from '@/lib/csrfClient'
import { errorLog, debugLog } from '@/lib/logger'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'

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
  contactEmail: string
}

// Toast notification type
type ToastType = 'success' | 'error' | 'warning'
type Toast = {
  id: number
  message: string
  type: ToastType
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

export default function ProfilePageRefactored() {
  const { t, locale, dir } = useTranslation()
  const { user, logout, forceRefreshUser } = useAuth()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState<EditData>({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    birthday: user?.birthday || '',
    contactEmail: user?.contactEmail || ''
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

  // Toast notification state
  const [toasts, setToasts] = useState<Toast[]>([])
  const toastIdCounter = useRef(0)

  // Add toast notification
  const showToast = (message: string, type: ToastType = 'success') => {
    const id = toastIdCounter.current++
    setToasts(prev => [...prev, { id, message, type }])
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id))
    }, 4000)
  }

  // Remove toast manually
  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  // Helper function for API error handling
  const handleApiError = (error: unknown, defaultMessage: string): void => {
    errorLog(defaultMessage, error)
    showToast(`${defaultMessage}: ${getErrorMessage(error)}`, 'error')
  }

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
      // Debug: Log profile picture to help troubleshoot
      debugLog('[PROFILE_PAGE] User data:', {
        email: user.email,
        name: user.name,
        profilePicture: user.profilePicture,
        hasProfilePicture: !!user.profilePicture,
        profilePictureType: typeof user.profilePicture,
        profilePictureLength: user.profilePicture?.length || 0,
        fullUser: user
      })
      
      // Check profile picture via debug endpoint (only if NOT editing to avoid disruption)
      if (!isEditing) {
        fetch('/api/debug/profile-picture')
          .then(res => res.json())
          .then(data => {
            debugLog('[PROFILE_PAGE] Debug Profile Picture API Response:', JSON.stringify(data, null, 2))
            debugLog('[PROFILE_PAGE] Profile Picture Details:', {
              exists: data.profilePicture?.exists,
              value: data.profilePicture?.value,
              isNull: data.profilePicture?.isNull,
              isUndefined: data.profilePicture?.isUndefined,
              length: data.profilePicture?.length,
              preview: data.profilePicture?.preview,
              userFromDB: data.userFromDatabase?.profilePicture
            })
            if (data.success && data.profilePicture.exists && !user.profilePicture && !isEditing) {
              debugLog('[PROFILE_PAGE] Profile picture exists in DB but not in user object - refreshing...')
              debugLog('[PROFILE_PAGE] DB has:', data.profilePicture.value)
              debugLog('[PROFILE_PAGE] User object has:', user.profilePicture)
              forceRefreshUser().catch(err => {
                errorLog('[PROFILE_PAGE] Error refreshing user:', err)
              })
            }
          })
          .catch(err => {
            errorLog('[PROFILE_PAGE] Error checking profile picture:', err)
          })
      }
      
      // If no profile picture but user is logged in, try to refresh from server
      if (!user.profilePicture && !isEditing) {
        debugLog('[PROFILE_PAGE] No profile picture found in user object, attempting to refresh user data...')
        forceRefreshUser().catch(err => {
          errorLog('[PROFILE_PAGE] Error refreshing user:', err)
        })
      }
      
      // Only update profile picture and preview if NOT currently editing (prevents overwriting user's new selection)
      if (!isEditing) {
        setProfilePicture(user.profilePicture || null)
        setPreviewImage(user.profilePicture || null)
      }
      
      // Only update editData if NOT currently editing (prevents overwriting user input)
      if (!isEditing) {
        setEditData({
          name: user.name || '',
          phone: user.phone || '',
          address: user.address || '',
          birthday: user.birthday || '',
          contactEmail: user.contactEmail || ''
        })
      }
      
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
  }, [user, isEditing, forceRefreshUser])
  
  // Force refresh user data when component mounts (in case profile picture was just set)
  useEffect(() => {
    if (user && !user.profilePicture) {
      // If user is logged in but no profile picture, try refreshing once
      const timer = setTimeout(() => {
        forceRefreshUser().catch(err => {
          errorLog('Error refreshing user for profile picture:', err)
        })
      }, 1000)
      return () => clearTimeout(timer)
    }
    return undefined
  }, [user, forceRefreshUser])

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
        showToast('Please select an image file', 'error')
        return
      }
      
      if (file.size > MAX_IMAGE_SIZE) {
        showToast(`Image size should be less than ${MAX_IMAGE_SIZE / (1024 * 1024)}MB`, 'error')
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
        showToast('User ID not found. Please try logging out and back in.', 'error')
        return
      }

      // Ensure CSRF token is available
      const csrfToken = await fetchCsrfToken()
      if (!csrfToken) {
        showToast('Security error: Could not verify request. Please refresh the page and try again.', 'error')
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

      let responseData
      try {
        responseData = await response.json()
      } catch (error) {
        responseData = {}
      }

      if (response.ok) {
        const updatedUser = { ...user, ...editData, profilePicture }
        localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(updatedUser))
        setIsEditing(false)
        showToast('Profile updated successfully', 'success')
        forceRefreshUser()
      } else {
        errorLog('Failed to update profile:', response.status, responseData)
        // Check for validation errors array first
        let errorMessage = responseData?.error || responseData?.message || `Server error (${response.status})`
        if (responseData?.errors && Array.isArray(responseData.errors) && responseData.errors.length > 0) {
          errorMessage = responseData.errors.join('\n')
        }
        showToast(`Failed to update profile: ${errorMessage}`, 'error')
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
      birthday: user.birthday || '',
      contactEmail: user.contactEmail || ''
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
        showToast('Security error: Could not verify request. Please refresh the page and try again.', 'error')
        setIsDeleting(false)
        return
      }

      const response = await fetch('/api/profile/delete', {
        method: 'DELETE',
        headers: getCsrfHeaders(),
        // Body not needed (server determines user from session); CSRF is sent via header.
        credentials: 'include',
      })

      if (response.ok) {
        localStorage.removeItem(LOCAL_STORAGE_KEYS.USER)
        localStorage.removeItem(LOCAL_STORAGE_KEYS.CUSTOMER_NUMBER(user.id))
        
        showToast('Your account has been deleted. Signing out...', 'success')
        // Small delay before logout to show the message
        setTimeout(async () => {
          await logout()
        }, 1500)
      } else {
        const data = await response.json()
        showToast(data.error || 'Failed to delete account. Please try again.', 'error')
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
        showToast('Security error: Could not verify request. Please refresh the page and try again.', 'error')
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
        showToast('Order cancelled successfully', 'success')
      } else {
        const errorData = await response.json()
        showToast(`Failed to cancel order: ${errorData.error || 'Unknown error'}`, 'error')
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
    debugLog('[PROFILE_PAGE] No user found, redirecting to login...')
    return null
  }
  
  // Always log user data when profile page renders
  debugLog('[PROFILE_PAGE] Profile Page Rendered - User:', {
    email: user.email,
    name: user.name,
    profilePicture: user.profilePicture,
    hasProfilePicture: !!user.profilePicture,
    profilePictureURL: user.profilePicture || 'NO PICTURE'
  })

  return (
    <div className="min-h-screen bg-white">
      <BreadcrumbSchema 
        items={[
          { name: t('common.home'), url: getLocalizedPath('/', locale) },
          { name: t('common.profile'), url: getLocalizedPath('/profile', locale) },
          ...(activeTab !== 'profile' ? [{ 
            name: activeTab === 'orders' ? (t('profile.orders') || 'Orders') : 
                  activeTab === 'settings' ? (t('profile.settings') || 'Settings') :
                  activeTab === 'downloads' ? (t('profile.downloads') || 'Downloads') :
                  activeTab === 'privacy' ? (t('profile.privacyPolicy') || 'Privacy') :
                  String(activeTab).charAt(0).toUpperCase() + String(activeTab).slice(1), 
            url: getLocalizedPath(`/profile#${activeTab}`, locale) 
          }] : [])
        ]}
      />
      {/* Breadcrumb Navigation */}
      <div className="container mx-auto px-3 md:px-4 pt-4 md:pt-8">
        {/* Navigation Breadcrumb */}
        <nav className={`text-xs md:text-base text-gray-600 mb-2 md:mb-4 ${dir === 'rtl' ? 'text-right' : ''}`} aria-label="Breadcrumb">
          <Link href={getLocalizedPath('/', locale)} className="hover:text-primary-600 transition-colors">{t('common.home')}</Link>
          <span> / </span>
          <span className="text-gray-900 font-medium">{t('common.profile')}</span>
          {activeTab !== 'profile' && (
            <>
              <span> / </span>
              <span className="text-gray-900 font-medium">
                {activeTab === 'orders' ? (t('profile.orders') || 'Orders') : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </span>
            </>
          )}
        </nav>
        
        {/* Back to Home */}
        <Link href={getLocalizedPath('/', locale)} className={`inline-flex items-center gap-1 text-xs md:text-sm text-primary-600 hover:text-primary-700 mb-4 md:mb-8 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
          <ArrowLeft className={`h-3 w-3 md:h-4 md:w-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
          <span>{t('common.backToHome')}</span>
        </Link>
      </div>

      <div className="container mx-auto px-3 sm:px-4">
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
          <div className="bg-white rounded-xl md:rounded-2xl shadow-sm md:shadow-lg border border-gray-100 p-1.5 md:p-2 mb-3 md:mb-6 lg:mb-8">
            {/* Mobile: Icon-only tabs (downloads hidden - duplicate of Training page) */}
            <div className="flex justify-between md:hidden">
              {[
                { id: 'profile', icon: User },
                { id: 'orders', icon: Package },
                { id: 'settings', icon: Settings },
                { id: 'privacy', icon: Shield }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as ActiveTab)}
                  className={`flex-1 flex items-center justify-center py-2.5 rounded-lg transition-all ${
                    activeTab === tab.id
                      ? 'bg-primary-600 text-white shadow-sm'
                      : 'text-gray-500'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                </button>
              ))}
              {/* Edit button */}
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`flex-1 flex items-center justify-center py-2.5 rounded-lg transition-all ${
                  isEditing ? 'bg-red-100 text-red-600' : 'text-gray-500'
                }`}
              >
                <Edit3 className="h-4 w-4" />
              </button>
            </div>
            
            {/* Desktop: Full tabs with labels */}
            <div className="hidden md:flex gap-2 overflow-x-auto scrollbar-hide">
              {[
                { id: 'profile', label: 'Profile', icon: User },
                { id: 'orders', label: 'Orders', icon: Package },
                { id: 'settings', label: 'Settings', icon: Settings },
                { id: 'downloads', label: 'Downloads', icon: Download },
                { id: 'privacy', label: 'Privacy', icon: Shield }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as ActiveTab)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
              
              {/* Action Buttons */}
              <div className="flex items-center gap-2 ml-auto">
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="flex items-center gap-2 px-4 py-3 bg-white/50 text-gray-600 rounded-xl font-medium hover:bg-white/70 transition-all disabled:opacity-50"
                >
                  <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                    isEditing ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                  }`}
                >
                  <Edit3 className="h-5 w-5" />
                  <span>{isEditing ? 'Cancel' : 'Edit'}</span>
                </button>
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
                <p className="text-red-800 font-medium mb-2">This will remove your personal data and disable your account:</p>
                <ul className="text-red-700 text-sm space-y-1">
                  <li>• Your profile and personal information</li>
                  <li>• Login access to this account</li>
                  <li>• Your customer number (#{customerNumber})</li>
                  <li>• All saved preferences and data</li>
                </ul>
                <p className="text-red-800 text-sm mt-3">
                  Note: Orders are preserved for legal/operational reasons, but will no longer be tied to your personal details.
                </p>
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
            {toast.type === 'success' && <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />}
            {toast.type === 'error' && <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />}
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
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
