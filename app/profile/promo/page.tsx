'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, Megaphone, Loader2, RefreshCw } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'
import { usePWAMode } from '@/hooks/usePWAMode'

interface Promo {
  id: string
  date: string
  text: string
}

export default function PromoPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { locale, dir } = useTranslation()
  const { isPWA } = usePWAMode()
  const isRTL = dir === 'rtl'
  
  const fromPage = searchParams?.get('from')

  const [promo, setPromo] = useState<Promo | null>(null)
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
      console.error('Failed to fetch promo:', error)
      setPromo(null)
    } finally {
      if (showLoading) setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchPromo()
  }, [locale])

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
    back: locale === 'ar' ? 'الحساب' : locale === 'ru' ? 'Аккаунт' : 'Account',
    infoTitle: locale === 'ar' ? 'آخر الأخبار والعروض' : locale === 'ru' ? 'Последние новости и акции' : 'Latest News & Offers',
    infoSubtitle: locale === 'ar' ? 'ابق على اطلاع بأحدث إعلاناتنا' : locale === 'ru' ? 'Будьте в курсе наших последних объявлений' : 'Stay updated with our latest announcements',
    dateLabel: locale === 'ar' ? 'التاريخ' : locale === 'ru' ? 'Дата' : 'Date',
    empty: locale === 'ar' ? 'لا توجد إعلانات حالياً' : locale === 'ru' ? 'Пока нет объявлений' : 'No announcements at this time',
    loading: locale === 'ar' ? 'جارٍ التحميل...' : locale === 'ru' ? 'Загрузка...' : 'Loading...',
    pullToRefresh: locale === 'ar' ? 'اسحب للتحديث' : locale === 'ru' ? 'Потяните для обновления' : 'Pull to refresh',
  }

  return (
    <div className={`min-h-screen bg-white ${isPWA ? 'pb-32' : ''}`} dir={dir}>
      {/* Header */}
      <div className={`flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-white ${isRTL ? 'flex-row-reverse' : ''}`}>
        <button 
          onClick={handleBack}
          className={`flex items-center gap-1 min-w-[80px] ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          <ArrowLeft className={`w-5 h-5 text-red-600 ${isRTL ? 'rotate-180' : ''}`} />
          <span className="text-base text-red-600">{t.back}</span>
        </button>
        <span className="text-base font-semibold text-gray-900">{t.title}</span>
        <button 
          onClick={handleRefresh}
          disabled={refreshing}
          className="min-w-[80px] flex justify-end"
        >
          <RefreshCw className={`w-5 h-5 text-gray-500 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          {/* Card Header */}
          <div className={`flex items-center gap-3 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center">
              <Megaphone className="w-5 h-5 text-red-600" />
            </div>
            <div className={`flex-1 ${isRTL ? 'text-right' : ''}`}>
              <h2 className="text-base font-bold text-gray-900">{t.infoTitle}</h2>
              <p className="text-sm text-gray-500">{t.infoSubtitle}</p>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className={`flex items-center gap-3 py-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
              <span className="text-sm text-gray-500">{t.loading}</span>
            </div>
          )}

          {/* Promo Content */}
          {!loading && promo ? (
            <div className={isRTL ? 'text-right' : ''}>
              <p className="text-xs text-gray-500 mb-3">
                {t.dateLabel}: {formatDate(promo.date)}
              </p>
              <div 
                className="prose prose-sm max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: promo.text }}
              />
            </div>
          ) : !loading && (
            <p className={`text-sm text-gray-500 py-4 ${isRTL ? 'text-right' : ''}`}>
              {t.empty}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

