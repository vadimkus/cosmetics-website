'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useAuth } from './AuthProvider'
import { useCartStore } from '@/lib/cartStore'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'
import { ChevronRight, ChevronLeft } from 'lucide-react'
import { ThemeToggleItem } from '@/components/ThemeToggle'
import { SkinAnalysisCamera, SkinAnalysisResult } from './SkinAnalysisCamera'
import { ARSkinAnalysisCamera } from './ar'
import { debugLog } from '@/lib/logger'
import { VAPID_PUBLIC_KEY } from '@/lib/siteConfig'

/**
 * PWA Profile Page - Matches mobile app design exactly
 * 
 * Only shows in PWA/standalone mode on mobile.
 * Features all the same sections as the mobile app.
 */

interface ProfileItemProps {
  icon: React.ReactNode
  title: string
  subtitle?: string
  onClick?: () => void
  rightComponent?: React.ReactNode
  hasArrow?: boolean
  isLast?: boolean
  isRTL?: boolean
}

function ProfileItem({ 
  icon, 
  title, 
  subtitle, 
  onClick, 
  rightComponent, 
  hasArrow = true,
  isLast = false,
  isRTL = false
}: ProfileItemProps) {
  const content = (
    <div className={`flex items-center justify-between py-3 px-4 min-h-[56px] ${!isLast ? 'border-b border-gray-200' : ''}`}>
      <div className={`flex items-center gap-3 flex-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className="w-8 h-8 flex items-center justify-center">
          {icon}
        </div>
        <div className={`flex-1 ${isRTL ? 'text-right' : ''}`}>
          <p className="text-[17px] text-gray-900">{title}</p>
          {subtitle && <p className="text-[15px] text-gray-500">{subtitle}</p>}
        </div>
      </div>
      <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
        {rightComponent || (hasArrow && (
          isRTL ? <ChevronLeft className="w-4 h-4 text-gray-300" /> : <ChevronRight className="w-4 h-4 text-gray-300" />
        ))}
      </div>
    </div>
  )

  if (onClick) {
    return (
      <button onClick={onClick} className="w-full text-left active:bg-gray-50 transition-colors">
        {content}
      </button>
    )
  }

  return content
}

interface SwitchItemProps {
  icon: React.ReactNode
  title: string
  subtitle?: string | undefined
  value: boolean
  onChange: (value: boolean) => void
  disabled?: boolean
  isLast?: boolean
  isRTL?: boolean
}

function SwitchItem({
  icon,
  title,
  subtitle,
  value,
  onChange,
  disabled = false,
  isLast = false,
  isRTL = false
}: SwitchItemProps) {
  return (
    <div className={`flex items-center justify-between py-3 px-4 min-h-[56px] ${!isLast ? 'border-b border-gray-200' : ''}`}>
      <div className={`flex items-center gap-3 flex-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className="w-8 h-8 flex items-center justify-center">
          {icon}
        </div>
        <div className={`flex-1 ${isRTL ? 'text-right' : ''}`}>
          <p className="text-[17px] text-gray-900">{title}</p>
          {subtitle && <p className="text-[15px] text-gray-500">{subtitle}</p>}
        </div>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only peer"
        />
        <div className={`
          w-[51px] h-[31px] rounded-full transition-colors duration-200
          ${value ? 'bg-red-600' : 'bg-gray-200'}
          ${disabled ? 'opacity-50' : ''}
          after:content-[''] after:absolute after:top-[2px] after:left-[2px]
          after:bg-white after:rounded-full after:h-[27px] after:w-[27px]
          after:transition-transform after:duration-200 after:shadow-sm
          ${value ? 'after:translate-x-[20px]' : 'after:translate-x-0'}
        `} />
      </label>
    </div>
  )
}

export default function PWAProfilePage() {
  const { user, logout, isLoading: authLoading } = useAuth()
  const { getTotalItems } = useCartStore()
  const { t, locale, dir } = useTranslation()
  const router = useRouter()
  
  const [ordersCount, setOrdersCount] = useState(0)
  const [unreadNotifications, setUnreadNotifications] = useState(0)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(false)
  const [pushSupported, setPushSupported] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [showSkinAnalysis, setShowSkinAnalysis] = useState(false)
  const [showARSkinAnalysis, setShowARSkinAnalysis] = useState(false)
  const [lastSkinType, setLastSkinType] = useState<string | null>(null)
  const [showAnalysisSuccess, setShowAnalysisSuccess] = useState(false)
  
  const isRTL = dir === 'rtl'
  const cartCount = getTotalItems()
  
  // Fetch orders count
  useEffect(() => {
    const fetchOrdersCount = async () => {
      if (!user?.email) return
      try {
        // Build URL with both auth email and contact email for better matching
        let url = `/api/orders?email=${encodeURIComponent(user.email)}`
        if (user.contactEmail && user.contactEmail.trim()) {
          url += `&contactEmail=${encodeURIComponent(user.contactEmail.trim())}`
        }
        
        const response = await fetch(url)
        if (response.ok) {
          const data = await response.json()
          setOrdersCount(data.orders?.length || 0)
        }
      } catch (error) {
        console.error('Error fetching orders count:', error)
      }
    }
    fetchOrdersCount()
  }, [user?.email])

  // Fetch unread notifications count
  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (!user) return
      try {
        const response = await fetch('/api/push/mark-read', {
          credentials: 'include'
        })
        if (response.ok) {
          const data = await response.json()
          setUnreadNotifications(data.unreadCount || 0)
        }
      } catch (error) {
        console.error('Error fetching unread notifications:', error)
      }
    }
    fetchUnreadCount()
  }, [user])
  
  // Fetch skin analysis history
  useEffect(() => {
    const fetchSkinAnalysisHistory = async () => {
      if (!user) return
      try {
        const response = await fetch('/api/skin-analysis?limit=1', {
          credentials: 'include'
        })
        if (response.ok) {
          const data = await response.json()
          if (data.analyses && data.analyses.length > 0) {
            setLastSkinType(data.analyses[0].skinType)
          }
        }
      } catch (error) {
        console.error('Error fetching skin analysis history:', error)
      }
    }
    fetchSkinAnalysisHistory()
  }, [user])
  
  // Check push notification support, permission, AND active subscription
  useEffect(() => {
    const checkPushSupport = async () => {
      // Check if push notifications are supported
      const supported = 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window
      setPushSupported(supported)
      
      if (supported) {
        // Check current permission status
        const permission = Notification.permission
        
        if (permission === 'granted') {
          // Also verify there's an active subscription
          try {
            const registration = await navigator.serviceWorker.ready
            const subscription = await registration.pushManager.getSubscription()
            // Only show as enabled if both permission granted AND subscription exists
            setPushNotifications(!!subscription)
          } catch (error) {
            console.error('[PUSH] Error checking subscription:', error)
            setPushNotifications(false)
          }
        } else {
          setPushNotifications(false)
        }
      }
    }
    checkPushSupport()
  }, [])
  
  // Helper function to convert VAPID public key
  const urlBase64ToUint8Array = (base64String: string): Uint8Array => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4)
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }

  // Handle push notification toggle
  const handlePushToggle = async (enabled: boolean) => {
    if (!pushSupported) {
      alert(t('pwaProfile.pushNotSupported') || 'Push notifications are not supported on this device/browser.')
      return
    }
    
    if (enabled) {
      try {
        // First request permission
        const permission = await Notification.requestPermission()
        debugLog('[PUSH] Permission result:', permission)
        
        if (permission === 'granted') {
          // Wait for service worker
          debugLog('[PUSH] Waiting for service worker...')
          const registration = await navigator.serviceWorker.ready
          debugLog('[PUSH] Service worker ready')
          
          // Get VAPID key from centralized config
          const vapidKey = VAPID_PUBLIC_KEY
          debugLog('[PUSH] VAPID key present:', !!vapidKey)
          
          if (!vapidKey) {
            throw new Error('Push notifications not configured (missing VAPID key)')
          }
          
          // Subscribe to push
          const subscribeOptions = {
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(vapidKey)
          }
          
          debugLog('[PUSH] Subscribing to push manager...')
          const subscription = await registration.pushManager.subscribe(subscribeOptions as PushSubscriptionOptionsInit)
          debugLog('[PUSH] Got subscription:', subscription.endpoint.substring(0, 50))
          
          // Send subscription to server
          debugLog('[PUSH] Saving to server...')
          const response = await fetch('/api/push/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ subscription: subscription.toJSON() }),
            credentials: 'include'
          })
          
          const data = await response.json()
          debugLog('[PUSH] Server response:', data)
          
          if (data.success) {
            setPushNotifications(true)
            debugLog('[PUSH] Subscription saved successfully!')
          } else {
            throw new Error(data.error || 'Failed to save subscription')
          }
        } else {
          setPushNotifications(false)
          if (permission === 'denied') {
            alert(t('pwaProfile.pushDenied') || 'Push notifications were denied. Please enable them in your browser settings.')
          }
        }
      } catch (error: any) {
        console.error('[PUSH] Error:', error)
        setPushNotifications(false)
        
        // Show more specific error message
        const errorMessage = error?.message || 'Unknown error'
        if (errorMessage.includes('VAPID')) {
          alert('Push notifications are not configured. Please contact support.')
        } else if (errorMessage.includes('Authentication')) {
          alert('Please log in again to enable notifications.')
        } else {
          alert(`Failed to enable notifications: ${errorMessage}`)
        }
      }
    } else {
      // Unsubscribe from push
      try {
        const registration = await navigator.serviceWorker.ready
        const subscription = await registration.pushManager.getSubscription()
        if (subscription) {
          // Remove from server first
          await fetch('/api/push/subscribe', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ endpoint: subscription.endpoint }),
            credentials: 'include'
          })
          
          // Then unsubscribe locally
          await subscription.unsubscribe()
        }
        setPushNotifications(false)
      } catch (error) {
        console.error('Push unsubscribe error:', error)
      }
    }
  }
  
  // Handle skin analysis completion
  const handleSkinAnalysisComplete = (result: SkinAnalysisResult) => {
    setLastSkinType(result.skinType)
    setShowSkinAnalysis(false)
    
    // Show success message
    setShowAnalysisSuccess(true)
    setTimeout(() => setShowAnalysisSuccess(false), 3000)
    
    // Store full analysis result in sessionStorage for the recommendation page
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('skinAnalysisResult', JSON.stringify(result))
    }
    
    // Navigate to recommendations with results
    setTimeout(() => {
      router.push(getLocalizedPath('/skin-recommendation', locale) + `?skinType=${result.skinType}&concerns=${result.concerns.join(',')}&fromAnalysis=true`)
    }, 500)
  }
  
  // Handle AR skin analysis completion
  const handleARSkinAnalysisComplete = (result: SkinAnalysisResult) => {
    setLastSkinType(result.skinType)
    setShowARSkinAnalysis(false)
    
    // Show success message
    setShowAnalysisSuccess(true)
    setTimeout(() => setShowAnalysisSuccess(false), 3000)
    
    // Store full analysis result in sessionStorage for the recommendation page
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('skinAnalysisResult', JSON.stringify(result))
    }
    
    // Navigate to recommendations with results
    setTimeout(() => {
      router.push(getLocalizedPath('/skin-recommendation', locale) + `?skinType=${result.skinType}&concerns=${result.concerns.join(',')}&fromAnalysis=true&mode=ar`)
    }, 500)
  }

  // Handle sign out
  const handleSignOut = async () => {
    if (isLoggingOut) return
    
    const confirmed = window.confirm(t('pwaProfile.signOutConfirm'))
    
    if (confirmed) {
      setIsLoggingOut(true)
      try {
        // Clear splash screen flag so auth check runs when PWA is reopened
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('pwa_splash_shown')
        }
        // AuthProvider handles redirect to appropriate login page (PWA or regular)
        await logout()
      } catch (error) {
        console.error('Logout error:', error)
      } finally {
        setIsLoggingOut(false)
      }
    }
  }
  
  // Get user info
  const userInitial = user?.name?.charAt(0) || user?.email?.charAt(0) || 'G'
  const displayEmail = user?.contactEmail || user?.email || ''
  const discountPercentage = user?.discountPercentage || 0
  
  // Language display
  const languageDisplay = locale === 'ru' ? 'Русский' : locale === 'ar' ? 'العربية' : 'English'

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-red-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Simple Navigation Header */}
      <div className={`flex items-center justify-between px-5 py-4 bg-white ${isRTL ? 'flex-row-reverse' : ''}`}>
        <button 
          onClick={() => router.push(getLocalizedPath('/products', locale))}
          className={`flex items-center gap-1 min-w-[80px] ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          <svg className={`w-5 h-5 text-red-600 ${isRTL ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-base text-red-600">
            {t('pwaProfile.home')}
          </span>
        </button>
        <span className="text-base font-semibold text-gray-900">
          {t('pwaProfile.account')}
        </span>
        {/* Profile Icon with green dot */}
        <div className="min-w-[80px] flex justify-end">
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center">
              <span className="text-sm font-semibold text-white">
                {userInitial.toUpperCase()}
              </span>
            </div>
            {/* Green online dot */}
            <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border-[1.5px] border-white" />
          </div>
        </div>
      </div>

      <div className="overflow-y-auto">
        {/* Profile Card */}
        <div className="px-5 py-6">
          <div className={`relative bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {/* Avatar Section */}
            <div className="flex flex-col items-center">
              <div className="relative">
                {user?.profilePicture ? (
                  <Image
                    src={user.profilePicture}
                    alt={user?.name || 'Profile'}
                    width={80}
                    height={80}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-red-600 flex items-center justify-center">
                    <span className="text-3xl font-semibold text-white">
                      {userInitial.toUpperCase()}
                    </span>
                  </div>
                )}
                {/* Online dot */}
                <div className="absolute bottom-0.5 right-0.5 w-5 h-5 bg-green-500 rounded-full border-[3px] border-white" />
              </div>
              
              {/* Discount Badge */}
              {discountPercentage > 0 && (
                <div className="mt-2 flex items-center gap-1.5 bg-green-500 text-white px-3 py-1.5 rounded-full">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <span className="text-xs font-bold">
                    {t('pwaProfile.discount')}: {discountPercentage}%
                  </span>
                </div>
              )}
            </div>

            {/* User Info */}
            <div className={`flex-1 ${isRTL ? 'text-right' : ''}`}>
              <h2 className="text-[22px] font-bold text-gray-900 tracking-tight">
                {user?.name || 'Loading...'}
              </h2>
              <p className="text-base text-gray-500 mt-0.5">{displayEmail}</p>
              {user?.phone && (
                <p className="text-sm text-gray-400 mt-1">{user.phone}</p>
              )}
              <button 
                onClick={() => router.push(getLocalizedPath('/profile/edit', locale) + '?from=profile')}
                className="mt-3 text-[17px] text-blue-500"
              >
                {t('pwaProfile.viewAndEdit')}
              </button>
            </div>

            {/* Notification/Promo Icon - Bottom right corner of card */}
            <button 
              onClick={() => router.push(getLocalizedPath('/profile/promo', locale) + '?from=profile')}
              className={`absolute ${isRTL ? 'left-3' : 'right-3'} bottom-3 w-8 h-8 rounded-full bg-red-50 border border-red-200 flex items-center justify-center active:bg-red-100 transition-colors`}
              aria-label={t('pwaProfile.notifications') || 'Notifications'}
            >
              {/* Megaphone/Notification icon */}
              <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
              {/* Unread count badge */}
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white px-1">
                  {unreadNotifications > 99 ? '99+' : unreadNotifications}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-5 pb-4 border-b border-gray-200">
          <div className="flex gap-4">
            {/* Orders Card */}
            <button 
              onClick={() => router.push(getLocalizedPath('/orders', locale) + '?from=profile')}
              className="flex-1 bg-white rounded-xl p-4 text-center"
            >
              <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center mx-auto mb-3">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <p className="text-[17px] font-semibold text-gray-900">
                {t('pwaProfile.orders')}
              </p>
              <p className="text-[15px] text-gray-500">
                {ordersCount} {t('pwaProfile.purchases')}
              </p>
            </button>

            {/* Bag Card */}
            <button 
              onClick={() => router.push(getLocalizedPath('/cart', locale) + '?from=profile')}
              className="flex-1 bg-white rounded-xl p-4 text-center"
            >
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-3">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <p className="text-[17px] font-semibold text-gray-900">
                {t('pwaProfile.bag')}
              </p>
              <p className="text-[15px] text-gray-500">
                {cartCount > 0 
                  ? `${cartCount} ${t('pwaProfile.items')}`
                  : t('pwaProfile.empty')
                }
              </p>
            </button>
          </div>
        </div>

        {/* Account Section */}
        <div className="py-4">
          <h3 className={`text-[22px] font-bold text-gray-900 mb-2 px-5 ${isRTL ? 'text-right' : ''}`}>
            {t('pwaProfile.accountSection')}
          </h3>
          <div className="mx-5 bg-white rounded-xl overflow-hidden">
            <ProfileItem
              icon={<svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
              title={t('pwaProfile.personalInformation')}
              onClick={() => router.push(getLocalizedPath('/profile/edit', locale) + '?from=profile')}
              isRTL={isRTL}
            />
            <ProfileItem
              icon={<svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
              title={t('pwaProfile.addresses')}
              onClick={() => router.push(getLocalizedPath('/profile/addresses', locale) + '?from=profile')}
              isRTL={isRTL}
            />
            <ProfileItem
              icon={<svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>}
              title={t('pwaProfile.paymentAndBilling')}
              onClick={() => router.push(getLocalizedPath('/profile/billing', locale) + '?from=profile')}
              isLast
              isRTL={isRTL}
            />
          </div>
        </div>

        {/* Privacy & Security Section */}
        <div className="py-4">
          <h3 className={`text-[22px] font-bold text-gray-900 mb-2 px-5 ${isRTL ? 'text-right' : ''}`}>
            {t('pwaProfile.privacyAndSecurity')}
          </h3>
          <div className="mx-5 bg-white rounded-xl overflow-hidden">
            <SwitchItem
              icon={<svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
              title={t('pwaProfile.emailNotifications')}
              subtitle={t('pwaProfile.emailNotificationsSubtitle')}
              value={emailNotifications}
              onChange={setEmailNotifications}
              isRTL={isRTL}
            />
            <SwitchItem
              icon={<svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>}
              title={t('pwaProfile.pushNotifications')}
              subtitle={!pushSupported ? (t('pwaProfile.pushNotSupported') || 'Not supported') : (pushNotifications ? (t('pwaProfile.pushEnabled') || 'Enabled') : (t('pwaProfile.pushDisabled') || 'Tap to enable'))}
              value={pushNotifications}
              onChange={handlePushToggle}
              disabled={!pushSupported}
              isRTL={isRTL}
            />
            <ProfileItem
              icon={<svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>}
              title={t('pwaProfile.privacyPolicy')}
              onClick={() => router.push(getLocalizedPath('/privacy-policy', locale) + '?from=profile')}
              isRTL={isRTL}
            />
            <ProfileItem
              icon={<svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
              title={t('pwaProfile.termsAndConditions')}
              onClick={() => router.push(getLocalizedPath('/terms', locale) + '?from=profile')}
              isLast
              isRTL={isRTL}
            />
          </div>
        </div>

        {/* General Section */}
        <div className="py-4">
          <h3 className={`text-[22px] font-bold text-gray-900 mb-2 px-5 ${isRTL ? 'text-right' : ''}`}>
            {t('pwaProfile.general')}
          </h3>
          <div className="mx-5 bg-white rounded-xl overflow-hidden">
            {/* AI Skin Analysis - Premium Feature */}
            <ProfileItem
              icon={
                <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              }
              title={locale === 'ar' ? 'تحليل البشرة بالذكاء الاصطناعي' : locale === 'ru' ? 'AI Анализ кожи' : 'AI Skin Analysis'}
              subtitle={
                lastSkinType 
                  ? (locale === 'ar' ? `آخر نتيجة: ${lastSkinType}` : locale === 'ru' ? `Последний: ${lastSkinType}` : `Last: ${lastSkinType} skin`)
                  : (locale === 'ar' ? 'اكتشف نوع بشرتك' : locale === 'ru' ? 'Узнайте тип кожи' : 'Discover your skin type')
              }
              onClick={() => setShowSkinAnalysis(true)}
              isRTL={isRTL}
            />
            {/* AR Skin Analysis - Live Real-time Analysis */}
            <ProfileItem
              icon={
                <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              }
              title={locale === 'ar' ? 'تحليل AR المباشر' : locale === 'ru' ? 'AR Анализ в реальном времени' : 'Live AR Analysis'}
              subtitle={locale === 'ar' ? 'تحليل فوري بالواقع المعزز' : locale === 'ru' ? 'Мгновенный анализ с AR' : 'Real-time augmented reality'}
              onClick={() => setShowARSkinAnalysis(true)}
              isRTL={isRTL}
            />
            <ProfileItem
              icon={<svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" /></svg>}
              title={t('pwaProfile.language')}
              subtitle={languageDisplay}
              onClick={() => router.push(getLocalizedPath('/profile/language', locale) + '?from=profile')}
              isRTL={isRTL}
            />
            {/* Theme/Appearance Toggle */}
            <ThemeToggleItem isRTL={isRTL} />
            <ProfileItem
              icon={<svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
              title={t('pwaProfile.helpAndSupport')}
              onClick={() => router.push(getLocalizedPath('/faq', locale) + '?from=profile')}
              isRTL={isRTL}
            />
            <ProfileItem
              icon={<svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
              title={t('pwaProfile.contactUs')}
              onClick={() => router.push(getLocalizedPath('/contact', locale) + '?from=profile')}
              isRTL={isRTL}
            />
            <ProfileItem
              icon={<svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
              title={t('pwaProfile.aboutGenosys')}
              onClick={() => router.push(getLocalizedPath('/about', locale) + '?from=profile')}
              isLast
              isRTL={isRTL}
            />
          </div>
        </div>

        {/* Sign Out Button */}
        <div className="px-5 py-4">
          <button
            onClick={handleSignOut}
            disabled={isLoggingOut}
            className={`w-full bg-gray-100 text-red-600 py-3.5 rounded-xl text-[17px] font-normal transition-colors ${isLoggingOut ? 'opacity-50' : 'active:bg-gray-200'}`}
          >
            {isLoggingOut ? t('pwaProfile.signingOut') : t('pwaProfile.signOut')}
          </button>
        </div>

        {/* Footer */}
        <div className="text-center py-2">
          <p className="text-[15px] text-gray-500">{t('pwaProfile.genosysMobile')}</p>
          <p className="text-[13px] text-gray-300 mt-0.5">
            {t('pwaProfile.version')} 1.0.0
          </p>
        </div>
      </div>

      {/* AI Skin Analysis Camera Modal */}
      {showSkinAnalysis && (
        <SkinAnalysisCamera
          onAnalysisComplete={handleSkinAnalysisComplete}
          onClose={() => setShowSkinAnalysis(false)}
        />
      )}

      {/* AR Skin Analysis Camera Modal */}
      {showARSkinAnalysis && (
        <ARSkinAnalysisCamera
          onAnalysisComplete={handleARSkinAnalysisComplete}
          onClose={() => setShowARSkinAnalysis(false)}
        />
      )}

      {/* Analysis Success Toast */}
      {showAnalysisSuccess && (
        <div className="fixed bottom-24 left-4 right-4 z-50 animate-slide-up">
          <div className={`bg-green-600 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className={`flex-1 ${isRTL ? 'text-right' : ''}`}>
              <p className="font-semibold text-sm">
                {locale === 'ar' ? 'تم تحليل بشرتك بنجاح!' : locale === 'ru' ? 'Анализ кожи завершен!' : 'Skin Analysis Complete!'}
              </p>
              <p className="text-xs text-white/80">
                {locale === 'ar' ? 'جارٍ تحميل التوصيات...' : locale === 'ru' ? 'Загрузка рекомендаций...' : 'Loading recommendations...'}
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

