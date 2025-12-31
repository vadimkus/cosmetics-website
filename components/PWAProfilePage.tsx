'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useAuth } from './AuthProvider'
import { useCartStore } from '@/lib/cartStore'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'
import { ChevronRight, ChevronLeft } from 'lucide-react'

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
  subtitle?: string
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
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(false)
  const [faceIdEnabled, setFaceIdEnabled] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  
  const isRTL = dir === 'rtl'
  const cartCount = getTotalItems()
  
  // Fetch orders count
  useEffect(() => {
    const fetchOrdersCount = async () => {
      if (!user?.email) return
      try {
        const response = await fetch(`/api/orders?email=${encodeURIComponent(user.email)}`)
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
  
  // Handle sign out
  const handleSignOut = async () => {
    if (isLoggingOut) return
    
    const confirmed = window.confirm(t('pwaProfile.signOutConfirm'))
    
    if (confirmed) {
      setIsLoggingOut(true)
      try {
        await logout()
        router.push(getLocalizedPath('/login', locale))
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
    <div className="min-h-screen bg-white pb-32">
      {/* Header */}
      <div className={`flex items-center px-5 py-4 border-b border-gray-200 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <button 
          onClick={() => router.push(getLocalizedPath('/products', locale))}
          className={`flex items-center gap-1.5 min-w-[100px] ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          {isRTL ? (
            <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          ) : (
            <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          )}
          <span className="text-sm font-semibold text-red-600">
            {t('pwaProfile.home')}
          </span>
        </button>
        <h1 className="flex-1 text-center text-lg font-semibold text-gray-900">
          {t('pwaProfile.account')}
        </h1>
        <div className="min-w-[100px]" />
      </div>

      <div className="overflow-y-auto">
        {/* Profile Card */}
        <div className="px-5 py-6">
          <div className={`bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
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
                onClick={() => router.push(getLocalizedPath('/profile', locale) + '?edit=true')}
                className="mt-3 text-[17px] text-blue-500"
              >
                {t('pwaProfile.viewAndEdit')}
              </button>
            </div>

            {/* Promo Icon */}
            <button 
              onClick={() => {/* Open promo page */}}
              className={`absolute ${isRTL ? 'left-8' : 'right-8'} bottom-8 w-8 h-8 rounded-full bg-red-50 border border-red-200 flex items-center justify-center`}
            >
              <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
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
              onClick={() => router.push(getLocalizedPath('/profile', locale) + '?edit=true&from=profile')}
              isRTL={isRTL}
            />
            <ProfileItem
              icon={<svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
              title={t('pwaProfile.addresses')}
              onClick={() => router.push(getLocalizedPath('/profile', locale) + '?tab=settings&from=profile')}
              isRTL={isRTL}
            />
            <ProfileItem
              icon={<svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>}
              title={t('pwaProfile.paymentAndBilling')}
              onClick={() => router.push(getLocalizedPath('/profile', locale) + '?tab=settings&from=profile')}
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
              icon={<svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>}
              title={t('pwaProfile.faceId')}
              value={faceIdEnabled}
              onChange={setFaceIdEnabled}
              isRTL={isRTL}
            />
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
              value={pushNotifications}
              onChange={setPushNotifications}
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
              onClick={() => router.push(getLocalizedPath('/privacy-policy', locale) + '?from=profile')}
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
            <ProfileItem
              icon={<svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" /></svg>}
              title={t('pwaProfile.language')}
              subtitle={languageDisplay}
              onClick={() => {/* Language picker */}}
              isRTL={isRTL}
            />
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
        <div className="text-center py-8 pb-24">
          <p className="text-[15px] text-gray-500">{t('pwaProfile.genosysMobile')}</p>
          <p className="text-[13px] text-gray-300 mt-1">
            {t('pwaProfile.version')} 1.0.0
          </p>
        </div>
      </div>
    </div>
  )
}

