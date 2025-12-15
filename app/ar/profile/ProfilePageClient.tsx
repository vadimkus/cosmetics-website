'use client'

import Link from 'next/link'
import { ArrowLeft, User, Package, Settings, Download, Shield, Trash2, X, RefreshCw, Edit3 } from 'lucide-react'
import { useAuth } from '@/components/AuthProvider'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Order, OrderItem } from '@prisma/client'
import { fetchCsrfToken, getCsrfHeaders, addCsrfToBody } from '@/lib/csrfClient'
import { errorLog } from '@/lib/logger'
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

export default function ProfilePageClient() {
  const { t, locale, dir } = useTranslation()
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
    if (isRefreshing) return
    
    setIsRefreshing(true)
    try {
      await forceRefreshUser()
    } catch (error) {
      errorLog('Error refreshing user data:', error)
    } finally {
      setTimeout(() => {
        setIsRefreshing(false)
      }, REFRESH_ANIMATION_DELAY)
    }
  }

  // Redirect to login page if user is not logged in
  useEffect(() => {
    if (!user) {
      router.push(getLocalizedPath('/login', locale))
    }
  }, [user, router, locale])

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
        alert(t('profile.pleaseSelectImageFile'))
        return
      }
      
      if (file.size > MAX_IMAGE_SIZE) {
        alert(`${t('profile.imageSizeShouldBeLessThan')} ${MAX_IMAGE_SIZE / (1024 * 1024)} ${t('profile.mb')}`)
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
        alert(t('profile.userIdNotFound'))
        return
      }

      const csrfToken = await fetchCsrfToken()
      if (!csrfToken) {
        alert(t('profile.securityError'))
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
        alert(t('profile.profileUpdatedSuccessfully'))
        window.location.reload()
      } else {
        errorLog('Failed to update profile:', responseData)
        // Check for validation errors array first
        let errorMessage = responseData.error || t('profile.unknownError')
        if (responseData?.errors && Array.isArray(responseData.errors) && responseData.errors.length > 0) {
          errorMessage = responseData.errors.join('\n')
        }
        alert(`${t('profile.failedToUpdateProfile')}: ${errorMessage}`)
      }
    } catch (error) {
      handleApiError(error, t('profile.errorUpdatingProfile'))
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
      const csrfToken = await fetchCsrfToken()
      if (!csrfToken) {
        alert(t('profile.securityError'))
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
        
        await logout()
        router.push(getLocalizedPath('/', locale))
        
        setTimeout(() => {
          alert(t('profile.accountDeletedSuccessfully'))
        }, 100)
      } else {
        const data = await response.json()
        alert(data.error || t('profile.failedToDeleteAccount'))
      }
    } catch (error) {
      handleApiError(error, t('profile.errorDeletingAccount'))
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
      const csrfToken = await fetchCsrfToken()
      if (!csrfToken) {
        alert(t('profile.securityError'))
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
        alert(t('profile.orderCancelledAndRemovedSuccessfully'))
      } else {
        const errorData = await response.json()
        alert(`${t('profile.failedToCancelOrder')}: ${errorData.error || t('profile.unknownError')}`)
      }
    } catch (error) {
      handleApiError(error, t('profile.failedToCancelOrder'))
    } finally {
      setShowCancelOrderConfirm(false)
      setOrderToCancel(null)
    }
  }

  if (!user) {
    return null
  }

  const tabs = [
    { id: 'profile', label: t('profile.title'), icon: User, shortLabel: t('profile.title') },
    { id: 'orders', label: t('profile.orderHistory'), icon: Package, shortLabel: t('profile.orderHistory') },
    { id: 'settings', label: t('common.settings'), icon: Settings, shortLabel: t('common.settings') },
    { id: 'downloads', label: t('common.download'), icon: Download, shortLabel: t('common.download') },
    { id: 'privacy', label: t('profile.privacyPolicy'), icon: Shield, shortLabel: t('profile.privacyPolicy') }
  ]

  return (
    <div className="min-h-screen bg-white" dir={dir}>
      <BreadcrumbSchema 
        items={[
          { name: t('common.home'), url: getLocalizedPath('/', locale) },
          { name: t('common.profile'), url: getLocalizedPath('/profile', locale) },
          ...(activeTab !== 'profile' ? [{ name: tabs.find(tab => tab.id === activeTab)?.shortLabel || activeTab, url: getLocalizedPath(`/profile#${activeTab}`, locale) }] : [])
        ]}
      />
      {/* Breadcrumb Navigation */}
      <div className="container mx-auto px-3 md:px-4 pt-4 md:pt-8">
        {/* Navigation Breadcrumb */}
        <nav className="text-xs md:text-base text-gray-600 mb-2 md:mb-4" aria-label="Breadcrumb">
          <Link href={getLocalizedPath('/', locale)} className="hover:text-primary-600 transition-colors">{t('common.home')}</Link>
          <span> / </span>
          <span className="text-gray-900 font-medium">{t('profile.title')}</span>
          {activeTab !== 'profile' && (
            <>
              <span> / </span>
              <span className="text-gray-900 font-medium capitalize">{tabs.find(tab => tab.id === activeTab)?.shortLabel || activeTab}</span>
            </>
          )}
        </nav>
        
        {/* Back to Home */}
        <Link href={getLocalizedPath('/', locale)} className="inline-flex items-center gap-1 text-xs md:text-sm text-primary-600 hover:text-primary-700 mb-4 md:mb-8">
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
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-2 mb-4 sm:mb-6 lg:mb-8">
            <div className="relative">
              <div className={`absolute ${dir === 'rtl' ? 'right-0' : 'left-0'} top-0 bottom-0 w-4 bg-gradient-to-r ${dir === 'rtl' ? 'from-white/70 to-transparent' : 'from-white/70 to-transparent'} z-10 pointer-events-none sm:hidden`}></div>
              <div className={`absolute ${dir === 'rtl' ? 'left-0' : 'right-0'} top-0 bottom-0 w-4 bg-gradient-to-l ${dir === 'rtl' ? 'to-white/70 from-transparent' : 'from-white/70 to-transparent'} z-10 pointer-events-none sm:hidden`}></div>
              
              <div className={`flex gap-2 overflow-x-auto scrollbar-hide pb-1 sm:overflow-x-visible sm:pb-0 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                {tabs.map((tab) => (
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
                
                <div className={`flex items-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  <button
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className={`flex items-center gap-1 sm:gap-2 px-2 xs:px-3 sm:px-4 py-3 bg-white/50 backdrop-blur-sm text-gray-600 rounded-xl font-medium hover:bg-white/70 transition-all duration-200 disabled:opacity-50 whitespace-nowrap flex-shrink-0 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
                    title={t('profile.refreshProfileData')}
                  >
                    <RefreshCw className={`h-4 w-4 sm:h-5 sm:w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                    <span className="text-sm sm:text-base hidden xs:inline sm:inline">{t('profile.refresh')}</span>
                  </button>

                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className={`flex items-center gap-1 sm:gap-2 px-2 xs:px-3 sm:px-4 py-3 rounded-xl font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0 ${dir === 'rtl' ? 'flex-row-reverse' : ''} ${
                      isEditing 
                        ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                    }`}
                    title={isEditing ? t('common.cancel') : t('common.edit')}
                  >
                    <Edit3 className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="text-sm sm:text-base hidden xs:inline sm:inline">{isEditing ? t('common.cancel') : t('common.edit')}</span>
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
          <div className={`bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-md w-full p-4 sm:p-6 lg:p-8 max-h-[90vh] overflow-y-auto ${dir === 'rtl' ? 'text-right' : ''}`}>
            <div className={`flex items-center gap-4 mb-6 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
              <div className="p-3 bg-red-100 rounded-xl">
                <Trash2 className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">{t('profile.deleteAccountTitle')}</h3>
            </div>
            
            <div className="mb-8">
              <p className="text-gray-600 mb-4">
                {t('profile.areYouSureDeleteAccount')}
              </p>
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-red-800 font-medium mb-2">{t('profile.thisWillPermanentlyDelete')}</p>
                <ul className={`text-red-700 text-sm space-y-1 ${dir === 'rtl' ? 'text-right' : ''}`}>
                  <li>• {t('profile.yourProfileAndPersonalInformation')}</li>
                  <li>• {t('profile.allOrderHistory')}</li>
                  <li>• {t('profile.yourCustomerNumber')} (#{customerNumber})</li>
                  <li>• {t('profile.allSavedPreferencesAndData')}</li>
                </ul>
              </div>
            </div>
            
            <div className={`flex flex-col sm:flex-row gap-3 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="flex-1 bg-red-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] touch-manipulation"
              >
                {isDeleting ? t('profile.deleting') : t('profile.deleteAccount')}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-xl font-semibold hover:bg-gray-300 transition-colors min-h-[44px] touch-manipulation"
              >
                {t('common.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Order Confirmation Modal */}
      {showCancelOrderConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
          <div className={`bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-md w-full p-4 sm:p-6 lg:p-8 max-h-[90vh] overflow-y-auto ${dir === 'rtl' ? 'text-right' : ''}`}>
            <div className={`flex items-center gap-4 mb-6 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
              <div className="p-3 bg-red-100 rounded-xl">
                <X className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">{t('profile.cancelOrderTitle')}</h3>
            </div>
            
            <div className="mb-8">
              <p className="text-gray-600 mb-4">
                {t('profile.areYouSureCancelOrder')}
              </p>
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-red-800 font-medium mb-2">{t('profile.thisWill')}</p>
                <ul className={`text-red-700 text-sm space-y-1 ${dir === 'rtl' ? 'text-right' : ''}`}>
                  <li>• {t('profile.permanentlyCancelTheOrder')}</li>
                  <li>• {t('profile.removeItFromYourOrderHistory')}</li>
                  <li>• {t('profile.cannotBeRestored')}</li>
                </ul>
              </div>
            </div>
            
            <div className={`flex flex-col sm:flex-row gap-3 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
              <button
                onClick={cancelOrder}
                className={`flex-1 flex items-center justify-center gap-2 bg-red-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-red-700 transition-colors min-h-[44px] touch-manipulation ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
              >
                <X className="h-5 w-5" />
                {t('profile.yesCancelOrder')}
              </button>
              <button
                onClick={() => {
                  setShowCancelOrderConfirm(false)
                  setOrderToCancel(null)
                }}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors min-h-[44px] touch-manipulation"
              >
                {t('common.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

