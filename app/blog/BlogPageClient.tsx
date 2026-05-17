'use client'

/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import { Calendar, ArrowRight, ArrowLeft, Eye } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'
import { useIsMobileWeb } from '@/hooks/useIsMobile'
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
  const { isMobileWeb, isPWA } = useIsMobileWeb()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()

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

          {/* Page Header — editorial asymmetric on desktop, compact on mobile */}
          <div className="mb-8 md:mb-16">
            {/* Mobile-only compact header */}
            <div className="md:hidden text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-2 font-display tracking-tight">
                {locale === 'ar' ? 'مدونة GENOSYS' : locale === 'ru' ? 'Блог GENOSYS' : 'GENOSYS Journal'}
              </h1>
              <p className="text-sm text-gray-600 max-w-md mx-auto">
                {locale === 'ar'
                  ? 'مقالات متخصصة حول العناية بالبشرة الكورية وأحدث اتجاهات صناعة التجميل'
                  : locale === 'ru'
                    ? 'Экспертные статьи о корейском уходе за кожей и последних трендах индустрии красоты'
                    : 'Expert insights on Korean skincare, dermacosmetics, and the GENOSYS lab.'}
              </p>
            </div>

            {/* Desktop editorial header — asymmetric grid */}
            <div className={`hidden md:grid lg:grid-cols-12 gap-8 lg:gap-16 items-end ${isRTL ? 'text-right' : ''}`}>
              <div className="lg:col-span-7">
                <div className={`inline-flex items-center gap-2 text-[11px] font-mono tracking-[0.22em] uppercase text-primary-600 mb-5 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span aria-hidden="true" className="h-px w-8 bg-primary-600" />
                  {locale === 'ar' ? 'المدونة' : locale === 'ru' ? 'Блог' : 'Journal'}
                </div>
                <h1 className="text-4xl lg:text-[56px] lg:leading-[1.02] font-bold text-gray-900 font-display tracking-tight">
                  {locale === 'ar' ? 'مدونة GENOSYS' : locale === 'ru' ? 'Блог GENOSYS' : 'Notes from the lab.'}
                </h1>
              </div>
              <div className="lg:col-span-5">
                <p className="text-[15px] lg:text-base text-gray-600 leading-relaxed lg:max-w-md lg:ml-auto">
                  {locale === 'ar'
                    ? 'مقالات متخصصة حول العناية بالبشرة الكورية، الميزوثيرابي بالإبر الدقيقة، ومنتجات GENOSYS — كتبها فريقنا في دبي.'
                    : locale === 'ru'
                    ? 'Экспертные материалы о корейском уходе, микронидлинге и продуктах GENOSYS — пишет наша команда в Дубае.'
                    : 'Expert insights on Korean skincare, microneedling, and GENOSYS formulations — written by our Dubai team and the lab in Seoul.'}
                </p>
                {posts.length > 0 && (
                  <p className={`mt-4 text-[12px] font-mono uppercase tracking-[0.18em] text-gray-400 lg:text-right ${isRTL ? 'lg:text-left' : ''}`}>
                    {posts.length}{' '}
                    {locale === 'ar'
                      ? 'مقالة · يتم التحديث أسبوعياً'
                      : locale === 'ru'
                      ? 'статей · обновления еженедельно'
                      : (posts.length === 1 ? 'article' : 'articles')}{' '}
                    {locale === 'en' && '· updated weekly'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Blog Posts */}
          {posts.length > 0 ? (
            <>
              {/* ── Featured (latest) post — desktop only, asymmetric hero ─── */}
              {posts[0] && (
                <Link
                  key={`featured-${posts[0].id}`}
                  href={getLocalizedPath(`/blog/${posts[0].slug}`, locale)}
                  className={`group hidden md:grid lg:grid-cols-12 gap-8 lg:gap-12 mb-14 lg:mb-20 ${isRTL ? 'text-right' : ''}`}
                >
                  {posts[0].featuredImage && (
                    <div className={`lg:col-span-7 relative aspect-[16/10] overflow-hidden rounded-2xl bg-gray-100 ${isRTL ? 'lg:order-2' : ''}`}>
                      <img
                        src={posts[0].featuredImage}
                        alt={`${posts[0].title} - GENOSYS Featured Article`}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                        loading="eager"
                        decoding="async"
                      />
                    </div>
                  )}
                  <div className={`lg:col-span-5 flex flex-col justify-center ${posts[0].featuredImage ? '' : 'lg:col-span-12'}`}>
                    <div className={`inline-flex items-center gap-2 text-[11px] font-mono tracking-[0.22em] uppercase text-primary-600 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary-600 animate-pulse" aria-hidden="true" />
                      {locale === 'ar' ? 'المقالة الأحدث' : locale === 'ru' ? 'Свежее' : 'Latest article'}
                    </div>
                    <h2 className="text-2xl lg:text-[34px] lg:leading-[1.15] font-bold text-gray-900 font-display tracking-tight transition-colors group-hover:text-primary-700">
                      {posts[0].title}
                    </h2>
                    {posts[0].excerpt && (
                      <p className="mt-4 text-[15px] lg:text-base text-gray-600 leading-relaxed line-clamp-3">
                        {posts[0].excerpt}
                      </p>
                    )}
                    <div className={`mt-6 flex items-center gap-4 text-[12px] text-gray-500 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      {posts[0].publishedAt && (
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                          {new Date(posts[0].publishedAt).toLocaleDateString(
                            locale === 'ar' ? 'ar-AE' : locale === 'ru' ? 'ru-RU' : 'en-AE',
                            { year: 'numeric', month: 'short', day: 'numeric' }
                          )}
                        </span>
                      )}
                      {posts[0].views > 0 && (
                        <span className="inline-flex items-center gap-1.5">
                          <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                          {posts[0].views.toLocaleString()}{' '}
                          {locale === 'ar' ? 'مشاهدة' : locale === 'ru' ? 'просмотров' : 'views'}
                        </span>
                      )}
                    </div>
                    <span className={`mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary-600 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      {locale === 'ar' ? 'اقرأ المقالة' : locale === 'ru' ? 'Читать статью' : 'Read the article'}
                      <ArrowRight className={`h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : ''}`} aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              )}

              {/* ── Mobile: featured post is first card in the grid (no special layout) ── */}
              {/* ── Desktop: divider before remaining posts ─────────────────── */}
              {posts.length > 1 && (
                <div className="hidden md:flex items-center gap-4 mb-10">
                  <p className="text-[11px] font-mono tracking-[0.22em] uppercase text-gray-500">
                    {locale === 'ar' ? 'المزيد من المقالات' : locale === 'ru' ? 'Больше статей' : 'More articles'}
                  </p>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>
              )}

              {/* Posts grid — mobile: all posts, desktop: posts after the featured one */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-x-8 md:gap-y-12">
                {posts.map((post, idx) => {
                  // On desktop, skip the first post (it's the featured hero above).
                  // On mobile, show every post in the grid for a simpler experience.
                  const desktopHidden = idx === 0
                  return (
                    <Link
                      key={post.id}
                      href={getLocalizedPath(`/blog/${post.slug}`, locale)}
                      className={`group flex flex-col ${desktopHidden ? 'md:hidden' : ''}`}
                    >
                      {post.featuredImage && (
                        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-100">
                          <img
                            src={post.featuredImage}
                            alt={`${post.title} - GENOSYS Korean Skincare Blog Article`}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                            loading={idx <= 2 ? 'eager' : 'lazy'}
                            decoding="async"
                          />
                        </div>
                      )}
                      <div className="mt-4 md:mt-5 flex flex-col flex-1">
                        {post.publishedAt && (
                          <p className="text-[11px] font-mono tracking-[0.18em] uppercase text-gray-400 mb-2">
                            {new Date(post.publishedAt).toLocaleDateString(
                              locale === 'ar' ? 'ar-AE' : locale === 'ru' ? 'ru-RU' : 'en-AE',
                              { year: 'numeric', month: 'short', day: 'numeric' }
                            )}
                          </p>
                        )}
                        <h2 className="text-base md:text-[19px] lg:text-[20px] font-bold text-gray-900 font-display leading-[1.25] tracking-tight transition-colors group-hover:text-primary-700 line-clamp-2">
                          {post.title}
                        </h2>
                        {post.excerpt && (
                          <p className="mt-2 text-sm md:text-[14px] text-gray-600 leading-relaxed line-clamp-2 md:line-clamp-3">
                            {post.excerpt}
                          </p>
                        )}
                        {post.views > 0 && (
                          <p className={`mt-3 text-[12px] text-gray-400 inline-flex items-center gap-1.5 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                            {post.views.toLocaleString()}{' '}
                            {locale === 'ar' ? 'مشاهدة' : locale === 'ru' ? 'просмотров' : 'views'}
                          </p>
                        )}
                      </div>
                    </Link>
                  )
                })}
              </div>
            </>
          ) : (
            <div className="text-center py-16 md:py-24 max-w-md mx-auto">
              <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-gray-100 mb-5">
                <Calendar className="h-6 w-6 text-gray-400" aria-hidden="true" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 font-display tracking-tight">
                {locale === 'ar'
                  ? 'لا توجد مقالات متاحة بعد.'
                  : locale === 'ru'
                    ? 'Статьи пока недоступны.'
                    : 'The journal is just getting started.'}
              </h2>
              <p className="text-sm md:text-base text-gray-600">
                {locale === 'ar'
                  ? 'تحقق قريبًا للحصول على نصائح متخصصة للعناية بالبشرة!'
                  : locale === 'ru'
                    ? 'Загляните позже за советами по уходу за кожей!'
                    : 'Check back soon for expert skincare guides and lab notes from our team.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
