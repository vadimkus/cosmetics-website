'use client'

import '@/components/product/cerabarrier/cerabarrier.css'
import './blog.css'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, ArrowRight, Calendar, Eye } from 'lucide-react'
import { ceraSerif } from '@/components/product/cerabarrier/ceraFont'
import PageBreadcrumb from '@/components/PageBreadcrumb'
import LocaleSwitchInline from '@/components/LocaleSwitchInline'
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

/** All three locales render this. The route files translate before passing in. */
export default function BlogPageClient({ posts }: BlogPageClientProps) {
  const { t, locale, dir } = useTranslation()
  const { isMobileWeb, isPWA } = useIsMobileWeb()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()

  const isRTL = dir === 'rtl'
  const fromProfile = searchParams?.get('from') === 'profile'
  const isAppLikeMode = isPWA || isMobileWeb

  const dateLocale = locale === 'ar' ? 'ar-AE' : locale === 'ru' ? 'ru-RU' : 'en-AE'
  const formatDate = (value: Date) =>
    new Date(value).toLocaleDateString(dateLocale, { year: 'numeric', month: 'short', day: 'numeric' })

  const label = {
    blog: locale === 'ar' ? 'المدونة' : locale === 'ru' ? 'Блог' : 'Journal',
    title: locale === 'ar' ? 'مدونة GENOSYS' : locale === 'ru' ? 'Блог GENOSYS' : 'Notes from the lab',
    lead:
      locale === 'ar'
        ? 'مقالات متخصصة حول العناية بالبشرة الكورية، والميزوثيرابي بالإبر الدقيقة، وتركيبات GENOSYS، يكتبها فريقنا في دبي والمختبر في سيول.'
        : locale === 'ru'
          ? 'Экспертные материалы о корейском уходе, микронидлинге и составах GENOSYS. Пишет наша команда в Дубае и лаборатория в Сеуле.'
          : 'Expert notes on Korean skincare, microneedling and GENOSYS formulations, written by our Dubai team and the lab in Seoul.',
    latest: locale === 'ar' ? 'المقالة الأحدث' : locale === 'ru' ? 'Свежая статья' : 'Latest article',
    more: locale === 'ar' ? 'المزيد من المقالات' : locale === 'ru' ? 'Больше статей' : 'More articles',
    read: locale === 'ar' ? 'اقرأ المقالة' : locale === 'ru' ? 'Читать статью' : 'Read the article',
    views: locale === 'ar' ? 'مشاهدة' : locale === 'ru' ? 'просмотров' : 'views',
    emptyTitle:
      locale === 'ar'
        ? 'المدونة في بدايتها.'
        : locale === 'ru'
          ? 'Блог только начинается.'
          : 'The journal is just getting started.',
    emptyLead:
      locale === 'ar'
        ? 'عُد قريباً للاطلاع على أدلة العناية بالبشرة وملاحظات المختبر من فريقنا.'
        : locale === 'ru'
          ? 'Загляните позже: здесь появятся руководства по уходу и заметки из лаборатории.'
          : 'Check back soon for skincare guides and lab notes from our team.',
  }

  const articleCount = (count: number) => {
    if (locale === 'ar') return `${count} مقالة`
    if (locale === 'ru') return `${count} ${count === 1 ? 'статья' : 'статей'}`
    return `${count} ${count === 1 ? 'article' : 'articles'}`
  }

  const [featured, ...rest] = posts

  function Meta({ post }: { post: BlogPostListItem }) {
    return (
      <div className={`mt-4 flex flex-wrap items-center gap-x-5 gap-y-1.5 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
        {post.publishedAt && (
          <span className="blog-meta">
            <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
            {formatDate(post.publishedAt)}
          </span>
        )}
        {post.views > 0 && (
          <span className="blog-meta">
            <Eye className="h-3.5 w-3.5" aria-hidden="true" />
            {post.views.toLocaleString(dateLocale)} {label.views}
          </span>
        )}
      </div>
    )
  }

  return (
    <div className={`cera-page blog-page ${ceraSerif.variable} min-h-[100dvh] ${isAppLikeMode ? 'pb-32' : ''}`} dir={dir}>
      {/* In the installed app and on mobile web the site chrome is hidden, so
          the page carries its own back / title / profile bar. */}
      {isAppLikeMode && (
        <div
          className={`sticky top-0 z-20 flex items-center justify-between border-b border-[var(--cera-line)] bg-[var(--cera-cream)]/95 px-5 py-4 backdrop-blur ${
            isRTL ? 'flex-row-reverse' : ''
          }`}
        >
          <button
            onClick={() => router.push(getLocalizedPath(fromProfile ? '/profile' : '/products', locale))}
            className={`flex min-w-[80px] items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <ArrowLeft className={`h-5 w-5 text-[var(--cera-rose)] ${isRTL ? 'rotate-180' : ''}`} />
            <span className="text-[15px] text-[var(--cera-rose)]">
              {fromProfile
                ? locale === 'ar'
                  ? 'الحساب'
                  : locale === 'ru'
                    ? 'Аккаунт'
                    : 'Account'
                : locale === 'ar'
                  ? 'المنتجات'
                  : locale === 'ru'
                    ? 'Продукты'
                    : 'Products'}
            </span>
          </button>
          <span className="cera-serif text-[17px]">{label.blog}</span>
          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <LocaleSwitchInline />
          <button
            onClick={() => router.push(getLocalizedPath('/profile', locale))}
            className="flex"
            aria-label="Profile"
          >
            <div className="relative">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--cera-rose)]">
                <span className="text-sm font-semibold text-white">
                  {user?.name?.charAt(0)?.toUpperCase() || 'G'}
                </span>
              </div>
              {user && (
                <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-[1.5px] border-white bg-green-500" />
              )}
            </div>
          </button>
          </div>
        </div>
      )}

      {!isAppLikeMode && (
        <PageBreadcrumb
          items={[
            { name: t('common.home') || 'Home', href: getLocalizedPath('/', locale) },
            { name: label.blog },
          ]}
        />
      )}

      <div className="mx-auto max-w-[1120px] px-4 py-8 md:px-8 md:py-16">
        {!isAppLikeMode && (
          <>
            <Link
              href={getLocalizedPath('/', locale)}
              className={`mt-3 inline-flex items-center gap-1.5 text-[13px] text-[var(--cera-rose-ink)] transition-opacity hover:opacity-70 ${
                isRTL ? 'flex-row-reverse' : ''
              }`}
            >
              <ArrowLeft className={`h-3.5 w-3.5 ${isRTL ? 'rotate-180' : ''}`} />
              {t('common.backToHome') || 'Back to home'}
            </Link>
          </>
        )}

        {/* ─────────────────────────────── Hero ───────────────────────────── */}
        <header className={`mt-8 md:mt-16 ${isRTL ? 'text-right' : ''}`}>
          <p className="cera-eyebrow mb-3">{label.blog}</p>
          <h1 className="cera-serif text-[34px] leading-[1.05] md:text-[56px] lg:text-[64px]">{label.title}</h1>
          <p className="mt-5 max-w-[62ch] text-[15.5px] leading-relaxed text-[var(--cera-muted)] md:text-[17px]">
            {label.lead}
          </p>
          {posts.length > 0 && (
            <p className="cera-numeral mt-5 text-[13px] text-[var(--cera-muted)]">{articleCount(posts.length)}</p>
          )}
        </header>

        <div className="cera-rule mt-10 md:mt-14" />

        {posts.length > 0 ? (
          <>
            {/* ──────────────────── Latest, given the width ──────────────── */}
            {featured && (
              <Link
                href={getLocalizedPath(`/blog/${featured.slug}`, locale)}
                className={`blog-card group mt-10 grid gap-7 md:mt-14 lg:grid-cols-12 lg:gap-12 ${
                  isRTL ? 'text-right' : ''
                }`}
              >
                {/* No order override on the frame: the grid already mirrors in
                    RTL, so the image leads on the right the way it leads on the
                    left in English. Forcing it back was un-mirroring the one
                    block on an otherwise mirrored page. */}
                {featured.featuredImage && (
                  <div className="blog-frame aspect-square lg:col-span-6">
                    <Image
                      src={featured.featuredImage}
                      alt={featured.title}
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 58vw"
                      className="object-contain"
                    />
                  </div>
                )}
                <div
                  className={`flex flex-col justify-center ${
                    featured.featuredImage ? 'lg:col-span-6' : 'lg:col-span-12'
                  }`}
                >
                  <p className="cera-eyebrow mb-3">{label.latest}</p>
                  <h2 className="blog-card__title cera-serif text-[26px] leading-[1.15] md:text-[34px]">
                    {featured.title}
                  </h2>
                  {featured.excerpt && (
                    <p className="mt-4 line-clamp-3 text-[15px] leading-relaxed text-[var(--cera-muted)] md:text-[16px]">
                      {featured.excerpt}
                    </p>
                  )}
                  <Meta post={featured} />
                  <span className={`blog-read mt-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    {label.read}
                    <ArrowRight className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} aria-hidden="true" />
                  </span>
                </div>
              </Link>
            )}

            {rest.length > 0 && (
              <>
                <div className={`mt-14 flex items-center gap-5 md:mt-20 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <p className="cera-eyebrow whitespace-nowrap">{label.more}</p>
                  <div className="cera-rule flex-1" />
                </div>

                <div className="mt-9 grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
                  {rest.map((post, idx) => (
                    <Link
                      key={post.id}
                      href={getLocalizedPath(`/blog/${post.slug}`, locale)}
                      className={`blog-card group flex flex-col ${isRTL ? 'text-right' : ''}`}
                    >
                      {post.featuredImage && (
                        <div className="blog-frame aspect-square w-full">
                          <Image
                            src={post.featuredImage}
                            alt={post.title}
                            fill
                            loading={idx <= 2 ? 'eager' : 'lazy'}
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-contain"
                          />
                        </div>
                      )}
                      <div className="mt-5 flex flex-1 flex-col">
                        {post.publishedAt && (
                          <p className="cera-numeral mb-2 text-[12px] text-[var(--cera-muted)]">
                            {formatDate(post.publishedAt)}
                          </p>
                        )}
                        <h2 className="blog-card__title cera-serif line-clamp-2 text-[19px] leading-[1.25] md:text-[21px]">
                          {post.title}
                        </h2>
                        {post.excerpt && (
                          <p className="mt-2.5 line-clamp-3 text-[14px] leading-relaxed text-[var(--cera-muted)]">
                            {post.excerpt}
                          </p>
                        )}
                        {post.views > 0 && (
                          <p className={`blog-meta mt-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                            {post.views.toLocaleString(dateLocale)} {label.views}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="mx-auto max-w-[46ch] py-20 text-center md:py-28">
            <span className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-[var(--cera-blush-deep)] bg-[var(--cera-blush)]">
              <Calendar className="h-5 w-5 text-[var(--cera-rose)]" aria-hidden="true" />
            </span>
            <h2 className="cera-serif text-[24px] leading-tight md:text-[30px]">{label.emptyTitle}</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-[var(--cera-muted)]">{label.emptyLead}</p>
          </div>
        )}
      </div>
    </div>
  )
}
