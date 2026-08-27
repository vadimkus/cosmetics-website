'use client'

import { Trash2, X, RefreshCw, Edit3, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { useAuth } from '@/components/auth/AuthProvider'
import { useState, useRef, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Order, OrderItem } from '@prisma/client'
import { fetchCsrfToken, getCsrfHeaders, addCsrfToBody } from '@/lib/csrfClient'
import { errorLog } from '@/lib/logger'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'
import { usePWAMode } from '@/hooks/usePWAMode'
import PWAProfilePage from '@/components/pwa/PWAProfilePage'
import { useFavorites } from '@/components/FavoritesProvider'
import { useMembershipData } from '@/hooks/useMembershipData'

import ProfileHeader from '@/components/profile/ProfileHeader'
import ProfileForm from '@/components/profile/ProfileForm'
import OrderHistory from '@/components/profile/OrderHistory'
import DesktopProfileShell, { type DesktopProfileTab } from '@/components/profile/desktop/DesktopProfileShell'
import ProfileOverview from '@/components/profile/desktop/ProfileOverview'
import DesktopSecurityPanel from '@/components/profile/desktop/DesktopSecurityPanel'
import FavoritesClient from '@/app/favorites/FavoritesClient'
import { AddressesContent } from '@/app/profile/addresses/page'
import { AddressEditorContent } from '@/app/profile/addresses/add/page'
import { BillingContent } from '@/app/profile/billing/page'
import TrainingLibrary from '@/app/training/TrainingLibrary'
import '@/components/product/cerabarrier/cerabarrier.css'
import '@/components/editorial/editorial.css'

// Constants
const LOCAL_STORAGE_KEYS = {
  USER: 'genosys_user'
} as const

const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5MB
const REFRESH_ANIMATION_DELAY = 1000 // 1 second

// Custom type that includes the items relation
type OrderWithItems = Order & {
  items: OrderItem[]
}

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
  const { user, logout, forceRefreshUser, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isPWA, isClient } = usePWAMode()
  const { favorites } = useFavorites()
  const { data: membership } = useMembershipData()
  const [isMobileWeb, setIsMobileWeb] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  
  // Detect mobile web (non-PWA mobile)
  useEffect(() => {
    const checkMobileWeb = () => {
      const isMobile = window.innerWidth < 768
      setIsMobileWeb(isMobile && !isPWA)
    }
    checkMobileWeb()
    window.addEventListener('resize', checkMobileWeb)
    return () => window.removeEventListener('resize', checkMobileWeb)
  }, [isPWA])
  const [editData, setEditData] = useState<EditData>({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    birthday: user?.birthday || '',
    contactEmail: user?.contactEmail || ''
  })
  const [profilePicture, setProfilePicture] = useState<string | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showCancelOrderConfirm, setShowCancelOrderConfirm] = useState(false)
  const [orderToCancel, setOrderToCancel] = useState<string | null>(null)
  const [orders, setOrders] = useState<OrderWithItems[]>([])
  const [loadingOrders, setLoadingOrders] = useState(false)
  const [activeTab, setActiveTab] = useState<DesktopProfileTab>('overview')
  const addressEditId = searchParams.get('edit')
  const isAddingAddress = searchParams.get('mode') === 'add'
  const [isRefreshing, setIsRefreshing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Toast notification state
  const [toasts, setToasts] = useState<Toast[]>([])
  const toastIdCounter = useRef(0)

  // Read tab from URL query parameter
  useEffect(() => {
    const tab = searchParams.get('tab')
    const normalized: Record<string, DesktopProfileTab> = {
      overview: 'overview',
      profile: 'details',
      details: 'details',
      orders: 'orders',
      favorites: 'favorites',
      addresses: 'addresses',
      billing: 'billing',
      settings: 'security',
      privacy: 'security',
      security: 'security',
      documents: 'documents',
    }
    setActiveTab((tab && normalized[tab]) || 'overview')
  }, [searchParams])

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

  // Redirect to login page if user is not logged in - wait for auth to finish loading first
  useEffect(() => {
    if (!authLoading && !user) {
      router.push(getLocalizedPath('/login', locale))
    }
  }, [user, authLoading, router, locale])

  // Initialize editable profile data when the user loads.
  useEffect(() => {
    if (user) {
      // If no profile picture but user is logged in, try to refresh from server
      if (!user.profilePicture && !isEditing) {
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
        // Build URL with both auth email and contact email for better matching
        let url = `/api/orders?email=${encodeURIComponent(user.email)}`
        if (user.contactEmail && user.contactEmail.trim()) {
          url += `&contactEmail=${encodeURIComponent(user.contactEmail.trim())}`
        }
        
        const response = await fetch(url)
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
  }, [user?.email, user?.contactEmail])

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        showToast(t('profileActions.selectImageFile'), 'error')
        return
      }
      
      if (file.size > MAX_IMAGE_SIZE) {
        showToast(t('profileActions.imageTooLarge').replace('{maxSize}', String(MAX_IMAGE_SIZE / (1024 * 1024))), 'error')
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
        showToast(t('profileActions.userIdNotFound'), 'error')
        return
      }

      // Ensure CSRF token is available
      const csrfToken = await fetchCsrfToken()
      if (!csrfToken) {
        showToast(t('profileActions.securityError'), 'error')
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
      } catch {
        responseData = {}
      }

      if (response.ok) {
        const updatedUser = { ...user, ...editData, profilePicture }
        localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(updatedUser))
        setIsEditing(false)
        showToast(t('profileActions.profileUpdated'), 'success')
        forceRefreshUser()
      } else {
        errorLog('Failed to update profile:', response.status, responseData)
        // Check for validation errors array first
        let errorMessage = responseData?.error || responseData?.message || `Server error (${response.status})`
        if (responseData?.errors && Array.isArray(responseData.errors) && responseData.errors.length > 0) {
          errorMessage = responseData.errors.join('\n')
        }
        showToast(t('profileActions.failedToUpdate').replace('{error}', errorMessage), 'error')
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
        showToast(t('profileActions.securityError'), 'error')
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
        
        showToast(t('profileActions.accountDeleted'), 'success')
        // Small delay before logout to show the message
        setTimeout(async () => {
          await logout()
        }, 1500)
      } else {
        const data = await response.json()
        showToast(data.error || t('profileActions.failedToDelete'), 'error')
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
        showToast(t('profileActions.securityError'), 'error')
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
        showToast(t('profileActions.orderCancelled'), 'success')
      } else {
        const errorData = await response.json()
        showToast(t('profileActions.failedToCancel').replace('{error}', errorData.error || 'Unknown error'), 'error')
      }
    } catch (error) {
      handleApiError(error, 'Failed to cancel order')
    } finally {
      setShowCancelOrderConfirm(false)
      setOrderToCancel(null)
    }
  }

  // Render PWA-specific profile page when in PWA mode or mobile web
  // IMPORTANT: This check must happen BEFORE the user check below
  // because PWAProfilePage has its own loading state and user handling
  if (isClient && (isPWA || isMobileWeb)) {
    return <PWAProfilePage />
  }

  // Show loading or nothing while redirecting (only for non-PWA)
  if (!user) {
    return null
  }

  return (
    <div className="min-h-[100dvh]">
      <DesktopProfileShell
        user={user}
        activeTab={activeTab}
        orderCount={orders.length}
        favoritesCount={favorites.length}
        onLogout={logout}
      >
        {activeTab === 'overview' && (
          <ProfileOverview
            user={user}
            orders={orders}
            loadingOrders={loadingOrders}
            onStartSkinAnalysis={() =>
              router.push(getLocalizedPath('/skin-recommendation', locale))
            }
          />
        )}

        {activeTab === 'orders' && (
          <OrderHistory
            orders={orders}
            loadingOrders={loadingOrders}
            onCancelOrder={handleCancelOrderClick}
          />
        )}

        {activeTab === 'favorites' && <FavoritesClient embedded />}

        {activeTab === 'addresses' && (addressEditId || isAddingAddress) ? (
          <AddressEditorContent
            key={addressEditId || 'new-address'}
            embedded
            editIdOverride={addressEditId}
            onDone={() => router.push(`${getLocalizedPath('/profile', locale)}?tab=addresses`)}
          />
        ) : activeTab === 'addresses' ? (
          <AddressesContent embedded />
        ) : null}

        {activeTab === 'billing' && <BillingContent embedded />}

        {activeTab === 'documents' && <TrainingLibrary embedded />}

        {activeTab === 'details' && (
          <div className="space-y-5">
            <div className={`flex flex-wrap items-center justify-end gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
              <button
                type="button"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[var(--cera-line)] bg-white px-4 text-sm font-semibold text-[var(--cera-body)] transition-colors hover:border-[var(--cera-blush-deep)] hover:bg-[var(--cera-cream-deep)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cera-rose)] disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} aria-hidden="true" />
                {t('profileActions.refresh')}
              </button>
              <button
                type="button"
                onClick={() => (isEditing ? handleCancel() : setIsEditing(true))}
                aria-pressed={isEditing}
                className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[var(--cera-cta)] px-4 text-sm font-semibold text-white transition-colors hover:bg-[var(--cera-rose-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cera-rose)] focus-visible:ring-offset-2"
              >
                <Edit3 className="h-4 w-4" aria-hidden="true" />
                {isEditing ? t('profileActions.cancel') : t('profileActions.edit')}
              </button>
            </div>

            <ProfileHeader
              user={user}
              isEditing={isEditing}
              previewImage={previewImage}
              onImageUpload={handleImageUpload}
              onRemoveImage={handleRemoveImage}
              fileInputRef={fileInputRef}
            />
            <ProfileForm
              user={user}
              isEditing={isEditing}
              editData={editData}
              onEditDataChange={setEditData}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          </div>
        )}

        {activeTab === 'security' && (
          <DesktopSecurityPanel
            onLogout={logout}
            onDeleteAccount={() => setShowDeleteConfirm(true)}
          />
        )}
      </DesktopProfileShell>

      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-md w-full p-4 sm:p-6 lg:p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-red-100 rounded-xl">
                <Trash2 className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="cera-serif text-[22px] leading-tight text-[var(--cera-ink)]">{t('profileActions.deleteAccountTitle')}</h3>
            </div>
            
            <div className="mb-8">
              <p className="mb-4 text-[15px] leading-relaxed text-[var(--cera-body)]">
                {t('profileActions.deleteAccountConfirm')}
              </p>
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-red-800 font-medium mb-2">{t('profileActions.deleteAccountWarning')}</p>
                <ul className="text-red-700 text-sm space-y-1">
                  <li>• {t('profileActions.deleteProfileInfo')}</li>
                  <li>• {t('profileActions.deleteLoginAccess')}</li>
                  <li>• {t('profileActions.deleteCustomerNumber').replace('{customerNumber}', membership?.memberNumber || '')}</li>
                  <li>• {t('profileActions.deletePreferences')}</li>
                </ul>
                <p className="text-red-800 text-sm mt-3">
                  {t('profileActions.deleteOrdersNote')}
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="flex-1 bg-red-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] touch-manipulation"
              >
                {isDeleting ? t('profileActions.deleting') : t('profileActions.deleteAccount')}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="min-h-[44px] flex-1 touch-manipulation rounded-xl border border-[var(--cera-line)] bg-white px-6 py-3 font-semibold text-[var(--cera-body)] transition-colors hover:bg-[var(--cera-cream-deep)]"
              >
                {t('profileActions.cancel')}
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
              <h3 className="cera-serif text-[22px] leading-tight text-[var(--cera-ink)]">{t('profileActions.cancelOrderTitle')}</h3>
            </div>
            
            <div className="mb-8">
              <p className="mb-4 text-[15px] leading-relaxed text-[var(--cera-body)]">
                {t('profileActions.cancelOrderConfirm')}
              </p>
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-red-800 font-medium mb-2">{t('profileActions.cancelOrderWarning')}</p>
                <ul className="text-red-700 text-sm space-y-1">
                  <li>• {t('profileActions.cancelPermanently')}</li>
                  <li>• {t('profileActions.cancelRemoveHistory')}</li>
                  <li>• {t('profileActions.cancelCannotRestore')}</li>
                </ul>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={cancelOrder}
                className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-red-700 transition-colors min-h-[44px] touch-manipulation"
              >
                <X className="h-5 w-5" />
                {t('profileActions.yesCancelOrder')}
              </button>
              <button
                onClick={() => {
                  setShowCancelOrderConfirm(false)
                  setOrderToCancel(null)
                }}
                className="min-h-[44px] touch-manipulation rounded-xl border border-[var(--cera-line)] bg-white px-6 py-3 font-semibold text-[var(--cera-body)] transition-colors hover:bg-[var(--cera-cream-deep)]"
              >
                {t('profileActions.cancel')}
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
              className="flex-shrink-0 text-[var(--cera-muted)] transition-colors hover:text-[var(--cera-ink)]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

    </div>
  )
}
