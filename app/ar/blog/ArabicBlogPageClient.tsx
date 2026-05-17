'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Calendar, User, ArrowRight, ArrowLeft, Eye } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'

type BlogPostListItem = {
  id: string
  title: string
  titleAr: string | null
  slug: string
  excerpt: string | null
  excerptAr: string | null
  featuredImage: string | null
  authorName: string | null
  publishedAt: Date | null
  views: number
  createdAt: Date
}

interface ArabicBlogPageClientProps {
  posts: BlogPostListItem[]
}

export default function ArabicBlogPageClient({ posts }: ArabicBlogPageClientProps) {
  const { t, locale, dir } = useTranslation()

  return (
    <div className="bg-white min-h-screen" dir={dir}>
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-6xl mx-auto">
          {/* Navigation Breadcrumb */}
          <nav className={`flex flex-col gap-2 text-sm md:text-base text-gray-600 mb-8 ${dir === 'rtl' ? 'text-right' : ''}`} aria-label="Breadcrumb">
            {/* Mobile Breadcrumb */}
            <div className={`md:hidden flex items-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
              <Link 
                href={getLocalizedPath('/', locale)}
                className="hover:text-primary-600 transition-colors flex items-center"
              >
                {t('common.home')}
              </Link>
              <span className="flex items-center">/</span>
              <span className={`text-gray-900 font-medium flex items-center ${dir === 'rtl' ? 'text-right' : ''}`}>
                {t('common.blog')}
              </span>
            </div>
            
            {/* Mobile Back Button */}
            <Link 
              href={getLocalizedPath('/', locale)}
              className={`md:hidden flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
            >
              <ArrowLeft className={`h-4 w-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
              <span className="font-medium">{t('common.backToHome')}</span>
            </Link>
            
            {/* Desktop Breadcrumb */}
            <div className={`hidden md:flex items-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
              <Link 
                href={getLocalizedPath('/', locale)}
                className="hover:text-primary-600 transition-colors flex items-center"
              >
                {t('common.home')}
              </Link>
              <span className="flex items-center">/</span>
              <span className={`text-gray-900 font-medium flex items-center ${dir === 'rtl' ? 'text-right' : ''}`}>
                {t('common.blog')}
              </span>
            </div>
          </nav>

          {/* Page Header */}
          <div className={`text-center mb-12 ${dir === 'rtl' ? 'text-right' : ''}`}>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              {t('blog.title')}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('blog.subtitle')}
            </p>
          </div>

          {/* Blog Posts Grid */}
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={getLocalizedPath(`/blog/${post.slug}`, locale)}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {post.featuredImage && (
                    <div className="relative h-48 w-full">
                      <Image
                        src={post.featuredImage}
                        alt={`${post.titleAr || post.title} - مقال مدونة GENOSYS للعناية بالبشرة الكورية`}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h2 className={`text-xl font-semibold text-gray-800 mb-3 line-clamp-2 ${dir === 'rtl' ? 'text-right' : ''}`}>
                      {post.titleAr || post.title}
                    </h2>
                    {(post.excerptAr || post.excerpt) && (
                      <p className={`text-gray-600 mb-4 line-clamp-3 ${dir === 'rtl' ? 'text-right' : ''}`}>
                        {post.excerptAr || post.excerpt}
                      </p>
                    )}
                    <div className={`flex items-center gap-4 text-sm text-gray-500 flex-wrap ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                      {post.authorName && (
                        <div className={`flex items-center gap-1 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                          <User className="h-4 w-4 text-green-600" />
                          <span>{post.authorName}</span>
                        </div>
                      )}
                      {post.publishedAt && (
                        <div className={`flex items-center gap-1 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                          <Calendar className="h-4 w-4" />
                          <span>
                            {new Date(post.publishedAt).toLocaleDateString(locale === 'ar' ? 'ar-AE' : 'en-AE', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                      )}
                      {post.views > 0 && (
                        <div className={`flex items-center gap-1 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                          <Eye className="h-4 w-4" />
                          <span>{post.views} {post.views === 1 ? t('blog.view') : t('blog.views')}</span>
                        </div>
                      )}
                    </div>
                    <div className={`mt-4 flex items-center text-primary-600 font-semibold ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                      {t('blog.readMore')}
                      <ArrowRight className={`h-4 w-4 ${dir === 'rtl' ? 'rotate-180 ml-2' : 'mr-2'}`} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className={`text-center py-16 ${dir === 'rtl' ? 'text-right' : ''}`}>
              <p className="text-gray-600 text-lg mb-4">
                {t('blog.noPosts')}
              </p>
              <p className="text-gray-500">
                {t('blog.checkBack')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

