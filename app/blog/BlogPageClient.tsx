'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, User, ArrowRight, ArrowLeft, Eye } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'
import { usePWAMode } from '@/hooks/usePWAMode'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/components/auth/AuthProvider'

type BlogPostListItem = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  featuredImage: string | null
  authorName: string | null
  publishedAt: Date | null
  views: number
  createdAt: Date
}

interface BlogPageClientProps {
  posts: BlogPostListItem[]
}

export default function BlogPageClient({ posts }: BlogPageClientProps) {
  const { t, locale, dir } = useTranslation()
  const { isPWA } = usePWAMode()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
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

  const isRTL = dir === 'rtl'
  const fromProfile = searchParams?.get('from') === 'profile'
  const isAppLikeMode = isPWA || isMobileWeb

  return (
    <div className={`bg-white min-h-screen ${isAppLikeMode ? 'pb-32' : ''}`}>
      {/* PWA / Mobile Web Simple Navigation Header */}
      {isAppLikeMode && (
        <div className={`flex items-center justify-between px-5 py-4 bg-white border-b border-gray-100 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <button 
            onClick={() => router.push(getLocalizedPath(fromProfile ? '/profile' : '/products', locale))}
            className={`flex items-center gap-1 min-w-[80px] ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <svg className={`w-5 h-5 text-red-600 ${isRTL ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-base text-red-600">
              {fromProfile ? (locale === 'ar' ? 'الحساب' : locale === 'ru' ? 'Аккаунт' : 'Account') : (locale === 'ar' ? 'المنتجات' : locale === 'ru' ? 'Продукты' : 'Products')}
            </span>
          </button>
          <span className="text-base font-semibold text-gray-900">
            {locale === 'ar' ? 'المدونة' : locale === 'ru' ? 'Блог' : 'Blog'}
          </span>
          {/* Profile Icon with green dot */}
          <button 
            onClick={() => router.push(getLocalizedPath('/profile', locale))}
            className="min-w-[80px] flex justify-end"
          >
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-red-600 flex items-center justify-center">
                <span className="text-sm font-semibold text-white">
                  {user?.name?.charAt(0)?.toUpperCase() || 'G'}
                </span>
              </div>
              {user && (
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-[1.5px] border-white" />
              )}
            </div>
          </button>
        </div>
      )}

      <div className="container mx-auto px-3 md:px-4 py-4 md:py-16">
        <div className="max-w-6xl mx-auto">
          {/* Navigation Breadcrumb - Hide in PWA and mobile web */}
          {!isAppLikeMode && (
            <nav className="text-xs md:text-base text-gray-600 mb-2 md:mb-4" aria-label="Breadcrumb">
              <Link href={getLocalizedPath('/', locale)} className="hover:text-primary-600 transition-colors">
                {t('common.home') || 'Home'}
              </Link>
              <span> / </span>
              <span className="text-gray-900 font-medium">
                {locale === 'ar' ? 'المدونة' : locale === 'ru' ? 'Блог' : 'Blog'}
              </span>
            </nav>
          )}
          
          {/* Back to Home - Hide in PWA and mobile web */}
          {!isAppLikeMode && (
            <Link href={getLocalizedPath('/', locale)} className={`inline-flex items-center gap-1 text-xs md:text-sm text-primary-600 hover:text-primary-700 mb-4 md:mb-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <ArrowLeft className={`h-3 w-3 md:h-4 md:w-4 ${isRTL ? 'rotate-180' : ''}`} />
              <span>{t('common.backToHome') || 'Back to Home'}</span>
            </Link>
          )}

          {/* Page Header */}
          <div className="text-center mb-6 md:mb-12">
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-2 md:mb-4">
              {locale === 'ar' ? 'مدونة GENOSYS' : locale === 'ru' ? 'Блог GENOSYS' : 'GENOSYS Blog'}
            </h1>
            <p className="text-sm md:text-lg text-gray-600 max-w-2xl mx-auto">
              {locale === 'ar' 
                ? 'مقالات متخصصة حول العناية بالبشرة الكورية وأحدث اتجاهات صناعة التجميل'
                : locale === 'ru'
                  ? 'Экспертные статьи о корейском уходе за кожей и последних трендах индустрии красоты'
                  : 'Expert insights on Korean skincare, professional dermacosmetics, and beauty industry trends'}
            </p>
          </div>

          {/* Blog Posts Grid */}
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={getLocalizedPath(`/blog/${post.slug}`, locale)}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {post.featuredImage && (
                    <div className="relative h-32 md:h-48 w-full">
                      <Image
                        src={post.featuredImage}
                        alt={`${post.title} - GENOSYS Korean Skincare Blog Article`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-3 md:p-6">
                    <h2 className="text-sm md:text-xl font-semibold text-gray-800 mb-2 md:mb-3 line-clamp-2">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="text-xs md:text-base text-gray-600 mb-3 md:mb-4 line-clamp-2 md:line-clamp-3">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="flex items-center gap-2 md:gap-4 text-xs md:text-sm text-gray-500 flex-wrap">
                      {post.authorName && (
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3 md:h-4 md:w-4 text-green-600" />
                          <span>{post.authorName}</span>
                        </div>
                      )}
                      {post.publishedAt && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 md:h-4 md:w-4" />
                          <span>
                            {new Date(post.publishedAt).toLocaleDateString(
                              locale === 'ar' ? 'ar-AE' : locale === 'ru' ? 'ru-RU' : 'en-AE', 
                              { year: 'numeric', month: 'short', day: 'numeric' }
                            )}
                          </span>
                        </div>
                      )}
                      {post.views > 0 && (
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3 md:h-4 md:w-4" />
                          <span>{post.views}</span>
                        </div>
                      )}
                    </div>
                    <div className={`mt-3 md:mt-4 flex items-center text-primary-600 font-semibold text-xs md:text-base ${isRTL ? 'flex-row-reverse' : ''}`}>
                      {locale === 'ar' ? 'اقرأ المزيد' : locale === 'ru' ? 'Читать далее' : 'Read More'}
                      <ArrowRight className={`h-3 w-3 md:h-4 md:w-4 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'}`} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 md:py-16">
              <p className="text-gray-600 text-base md:text-lg mb-3 md:mb-4">
                {locale === 'ar' 
                  ? 'لا توجد مقالات متاحة بعد.'
                  : locale === 'ru'
                    ? 'Статьи пока недоступны.'
                    : 'No blog posts available yet.'}
              </p>
              <p className="text-gray-500 text-sm md:text-base">
                {locale === 'ar'
                  ? 'تحقق قريبًا للحصول على نصائح متخصصة للعناية بالبشرة!'
                  : locale === 'ru'
                    ? 'Загляните позже за советами по уходу за кожей!'
                    : 'Check back soon for expert skincare tips and insights!'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
