'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, Megaphone, Loader2, RefreshCw, Bell, Check, CheckCheck } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'
import { useAuth } from '@/components/auth/AuthProvider'
import { usePWAMode } from '@/hooks/usePWAMode'
import { errorLog } from '@/lib/logger'
import { sanitizeHtml } from '@/lib/sanitizeHtml'
import { ceraSerif } from '@/components/product/cerabarrier/ceraFont'
import '@/components/product/cerabarrier/cerabarrier.css'
import '@/components/editorial/editorial.css'

interface Promo {
  id: string
  date: string
  text: string
}

interface Notification {
  id: string
  title: string
  body: string
  url?: string
  sentAt: string
  isRead: boolean
}

export default function PromoPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { locale, dir } = useTranslation()
  const { user } = useAuth()
  const { isPWA } = usePWAMode()
  const isRTL = dir === 'rtl'
  const [isMobileWeb, setIsMobileWeb] = useState(false)
  
  // Detect mobile web (non-PWA mobile)
  useEffect(() => {
    const checkMobile = () => {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) && window.innerWidth < 768
      const isPWAMode = window.matchMedia('(display-mode: standalone)').matches || 
                        (window.navigator as Navigator & { standalone?: boolean }).standalone === true
      setIsMobileWeb(isMobile && !isPWAMode)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  const isAppLikeMode = isPWA || isMobileWeb
  
  const fromPage = searchParams?.get('from')

  const [promo, setPromo] = useState<Promo | null>(null)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchPromo = async (showLoading = true) => {
    if (showLoading) setLoading(true)
    try {
      const response = await fetch(`/api/promo?locale=${locale}`)
      const data = await response.json()
      if (data.success && data.data) {
        setPromo(data.data)
      } else {
        setPromo(null)
      }
    } catch (error) {
      errorLog('Failed to fetch promo:', error)
      setPromo(null)
    } finally {
      if (showLoading) setLoading(false)
      setRefreshing(false)
    }
  }

  const fetchNotifications = useCallback(async () => {
    if (!user) return
    
    try {
      const response = await fetch(`/api/push/notifications?locale=${locale}`, {
        credentials: 'include'
      })
      const data = await response.json()
      
      if (data.success) {
        setNotifications(data.notifications || [])
        setUnreadCount(data.unreadCount || 0)
        
        // Clear badge when viewing notifications
        if ('clearAppBadge' in navigator && typeof (navigator as Navigator & { clearAppBadge?: () => Promise<void> }).clearAppBadge === 'function') {
          (navigator as Navigator & { clearAppBadge: () => Promise<void> }).clearAppBadge().catch(() => {})
        }
      }
    } catch (error) {
      errorLog('Failed to fetch notifications:', error)
    }
  }, [user, locale])

  const markAsRead = useCallback(async (notificationId?: string) => {
    try {
      await fetch('/api/push/mark-read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notificationId ? { notificationId } : { markAll: true }),
        credentials: 'include'
      })
      
      // Refresh notifications
      await fetchNotifications()
    } catch (error) {
      errorLog('Failed to mark as read:', error)
    }
  }, [fetchNotifications])

  useEffect(() => {
    fetchPromo()
    fetchNotifications()
  }, [locale, fetchNotifications])

  // Mark all as read when page loads (after a short delay)
  useEffect(() => {
    if (unreadCount > 0 && notifications.length > 0) {
      const timer = setTimeout(() => {
        markAsRead()
      }, 2000) // Mark as read after 2 seconds of viewing
      return () => clearTimeout(timer)
    }
    return undefined
  }, [unreadCount, notifications.length, markAsRead])

  const handleBack = () => {
    if (fromPage === 'profile') {
      router.push(getLocalizedPath('/profile', locale))
    } else {
      router.back()
    }
  }

  const handleRefresh = () => {
    setRefreshing(true)
    fetchPromo(false)
    fetchNotifications()
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      const displayLocale = locale === 'ar' ? 'ar-AE' : locale === 'ru' ? 'ru-RU' : 'en-US'
      return date.toLocaleDateString(displayLocale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    } catch {
      return dateString
    }
  }

  // Translations
  const t = {
    title: locale === 'ar' ? 'الإعلانات' : locale === 'ru' ? 'Объявления' : 'Announcements',
    back: locale === 'ar' ? 'رجوع' : locale === 'ru' ? 'Назад' : 'Account',
    infoTitle: locale === 'ar' ? 'آخر الأخبار والعروض' : locale === 'ru' ? 'Новости и предложения' : 'Latest News & Offers',
    infoSubtitle: locale === 'ar' ? 'ابق على اطلاع بآخر إعلاناتنا' : locale === 'ru' ? 'Следите за нашими объявлениями' : 'Stay updated with our latest announcements',
    dateLabel: locale === 'ar' ? 'التاريخ' : locale === 'ru' ? 'Дата' : 'Date',
    loading: locale === 'ar' ? 'جاري التحميل...' : locale === 'ru' ? 'Загрузка...' : 'Loading...',
    empty: locale === 'ar' ? 'لا توجد عروض حالية' : locale === 'ru' ? 'Нет текущих акций' : 'No current promotions',
    notifications: locale === 'ar' ? 'الإشعارات' : locale === 'ru' ? 'Уведомления' : 'Notifications',
    markAllRead: locale === 'ar' ? 'تحديد الكل كمقروء' : locale === 'ru' ? 'Отметить все прочитанными' : 'Mark all read',
    noNotifications: locale === 'ar' ? 'لا توجد إشعارات' : locale === 'ru' ? 'Нет уведомлений' : 'No notifications yet'
  }

  return (
    <div className={`cera-page genosys-page ${ceraSerif.variable} min-h-screen ${isAppLikeMode ? 'pb-32' : ''}`}>
      {/* Unified nav header */}
      <div
        className="mweb-float-sticky-top sticky top-0 z-10 bg-[var(--cera-cream)]/95 backdrop-blur border-b border-[var(--cera-line)]"
        style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
      >
        <div className={`flex items-center justify-between px-5 py-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <button
            onClick={handleBack}
            className={`flex items-center gap-1 min-w-[80px] ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <ArrowLeft className={`w-5 h-5 text-[var(--cera-rose-ink)] ${isRTL ? 'rotate-180' : ''}`} />
            <span className="text-base text-[var(--cera-rose-ink)]">{t.back}</span>
          </button>
          <h1 className="text-base font-semibold text-[var(--cera-ink)]">{t.title}</h1>
          <div className="min-w-[80px] flex justify-end">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 text-[var(--cera-body)] hover:text-[var(--cera-ink)]"
              aria-label="Refresh"
            >
              <RefreshCw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-5">
        {/* Push Notifications Section */}
        {user && notifications.length > 0 && (
          <div className="bg-white rounded-2xl border border-[var(--cera-line)] shadow-sm p-5">
            <div className={`flex items-center justify-between mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center relative">
                  <Bell className="w-5 h-5 text-blue-600" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[var(--cera-blush)]0 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <div className={isRTL ? 'text-right' : ''}>
                  <h2 className="text-base font-bold text-[var(--cera-ink)]">{t.notifications}</h2>
                </div>
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={() => markAsRead()}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  {t.markAllRead}
                </button>
              )}
            </div>

            <div className="space-y-3">
              {notifications.map(notification => (
                <div 
                  key={notification.id}
                  className={`p-3 rounded-lg border ${notification.isRead ? 'bg-[var(--cera-cream-deep)] border-[var(--cera-line)]' : 'bg-blue-50 border-blue-100'}`}
                  onClick={() => !notification.isRead && markAsRead(notification.id)}
                >
                  <div className={`flex items-start gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className="flex-1 min-w-0">
                      <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <h3 className={`font-semibold text-[var(--cera-ink)] ${isRTL ? 'text-right' : ''}`}>
                          {notification.title}
                        </h3>
                        {notification.isRead ? (
                          <CheckCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
                        ) : (
                          <Check className="w-4 h-4 text-blue-500 flex-shrink-0" />
                        )}
                      </div>
                      <p className={`text-sm text-[var(--cera-body)] mt-1 ${isRTL ? 'text-right' : ''}`}>
                        {notification.body}
                      </p>
                      <p className={`text-xs text-[var(--cera-muted)] mt-2 ${isRTL ? 'text-right' : ''}`}>
                        {formatDate(notification.sentAt)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Current Promotion */}
        <div className="bg-white rounded-2xl border border-[var(--cera-line)] shadow-sm p-5">
          {/* Card Header */}
          <div className={`flex items-center gap-3 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="w-10 h-10 rounded-xl bg-[var(--cera-blush)] border border-[var(--cera-blush-deep)] flex items-center justify-center">
              <Megaphone className="w-5 h-5 text-[var(--cera-rose-ink)]" />
            </div>
            <div className={`flex-1 ${isRTL ? 'text-right' : ''}`}>
              <h2 className="text-base font-bold text-[var(--cera-ink)]">{t.infoTitle}</h2>
              <p className="text-sm text-[var(--cera-muted)]">{t.infoSubtitle}</p>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className={`flex items-center gap-3 py-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Loader2 className="w-5 h-5 text-[var(--cera-muted)] animate-spin" />
              <span className="text-sm text-[var(--cera-muted)]">{t.loading}</span>
            </div>
          )}

          {/* Promo Content */}
          {!loading && promo ? (
            <div className={isRTL ? 'text-right' : ''}>
              <p className="text-xs text-[var(--cera-muted)] mb-3">
                {t.dateLabel}: {formatDate(promo.date)}
              </p>
              <div 
                className="prose prose-sm max-w-none text-[var(--cera-body)]"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(promo.text) }}
              />
            </div>
          ) : !loading && (
            <p className={`text-sm text-[var(--cera-muted)] py-4 ${isRTL ? 'text-right' : ''}`}>
              {t.empty}
            </p>
          )}
        </div>

        {/* Empty state for notifications */}
        {user && notifications.length === 0 && !loading && (
          <div className="text-center py-8">
            <Bell className="w-12 h-12 text-[var(--cera-blush-deep)] mx-auto mb-3" />
            <p className="text-sm text-[var(--cera-muted)]">{t.noNotifications}</p>
          </div>
        )}
      </div>
    </div>
  )
}
