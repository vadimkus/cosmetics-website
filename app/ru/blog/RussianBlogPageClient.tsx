'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Calendar, User, ArrowRight, ArrowLeft, Eye } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'

type BlogPostListItem = {
  id: string
  title: string
  titleRu: string | null
  slug: string
  excerpt: string | null
  excerptRu: string | null
  featuredImage: string | null
  authorName: string | null
  publishedAt: Date | null
  views: number
  createdAt: Date
}

interface RussianBlogPageClientProps {
  posts: BlogPostListItem[]
}

export default function RussianBlogPageClient({ posts }: RussianBlogPageClientProps) {
  const { t, locale, dir } = useTranslation()

  return (
    <div className="bg-white min-h-screen" dir={dir}>
      <div className="container mx-auto px-3 md:px-4 py-4 md:py-16">
        <div className="max-w-6xl mx-auto">
          {/* Navigation Breadcrumb */}
          <nav className="text-xs md:text-base text-gray-600 mb-2 md:mb-4" aria-label="Breadcrumb">
            <Link href={getLocalizedPath('/', locale)} className="hover:text-primary-600 transition-colors">
              {t('navigation.home')}
            </Link>
            <span> / </span>
            <span className="text-gray-900 font-medium">{t('navigation.blog')}</span>
          </nav>
          
          {/* Back to Home */}
          <Link href={getLocalizedPath('/', locale)} className="inline-flex items-center gap-1 text-xs md:text-sm text-primary-600 hover:text-primary-700 mb-4 md:mb-8">
            <ArrowLeft className="h-3 w-3 md:h-4 md:w-4" />
            <span>{t('common.backToHome')}</span>
          </Link>

          {/* Page Header */}
          <div className="text-center mb-12">
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
                    <div className="relative h-48 w-full bg-gray-50">
                      <Image
                        src={post.featuredImage}
                        alt={`${post.titleRu || post.title} - Статья блога GENOSYS о корейском уходе за кожей`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-contain"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-3 line-clamp-2">
                      {post.titleRu || post.title}
                    </h2>
                    {(post.excerptRu || post.excerpt) && (
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {post.excerptRu || post.excerpt}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
                      {post.authorName && (
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4 text-green-600" />
                          <span>{post.authorName}</span>
                        </div>
                      )}
                      {post.publishedAt && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {new Date(post.publishedAt).toLocaleDateString('ru-AE', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                      )}
                      {post.views > 0 && (
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          <span>{post.views} {post.views === 1 ? t('blog.view') : t('blog.views')}</span>
                        </div>
                      )}
                    </div>
                    <div className="mt-4 flex items-center text-primary-600 font-semibold">
                      {t('blog.readMore')}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
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

