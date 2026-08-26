'use client'

import Link from 'next/link'
import { Calendar, User, ArrowLeft } from 'lucide-react'
import BlogComments from '@/components/blog/BlogComments'
import BlackFridayCountdown from '@/components/BlackFridayCountdown'
import PageBreadcrumb from '@/components/PageBreadcrumb'
import BlogArticleBar from '@/components/blog/BlogArticleBar'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'
import { sanitizeHtml } from '@/lib/sanitize'
import { optimizeBlogContentImages } from '@/lib/blogContentImages'
import { useMemo } from 'react'
import ReadingProgress from '@/components/ui/ReadingProgressV3'
import BlogContentHtml from '@/components/blog/BlogContentHtml'
import BlogFeaturedImage from '@/components/blog/BlogFeaturedImage'
import { ceraSerif } from '@/components/product/cerabarrier/ceraFont'
import '@/components/product/cerabarrier/cerabarrier.css'
import '@/components/editorial/editorial.css'

type BlogPostWithComments = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  featuredImage: string | null
  authorName: string | null
  publishedAt: Date | null
  views: number
  comments: Array<{
    id: string
    userName: string
    content: string
    createdAt: Date
  }>
}

interface ArabicBlogPostClientProps {
  post: BlogPostWithComments
  featuredImageDimensions: { width: number; height: number }
}

export default function ArabicBlogPostClient({
  post,
  featuredImageDimensions,
}: ArabicBlogPostClientProps) {
  const { t, locale, dir } = useTranslation()

  return (
    <article className={`cera-page genosys-page ${ceraSerif.variable} min-h-screen`} dir={dir}>
      <ReadingProgress />
      {/* The same bar the English route uses. This route renders its own body rather
          than going through BlogPostClient, which is why it reached for the product
          locale bar instead and ended up without an account control. */}
      <BlogArticleBar />
      <PageBreadcrumb
        items={[
          { name: t('common.home'), href: getLocalizedPath('/', locale) },
          { name: t('common.blog'), href: getLocalizedPath('/blog', locale) },
          { name: post.title },
        ]}
      />

      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-4xl mx-auto">
          {/* Prominent back-to-articles link — visible on all viewports */}
          <Link
            href={getLocalizedPath('/blog', locale)}
            className={`group inline-flex items-center gap-2 text-sm font-semibold text-[var(--cera-rose-ink)] hover:text-[var(--cera-rose-ink)] mb-6 md:mb-8 transition-colors ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
          >
            <ArrowLeft className={`h-4 w-4 transition-transform duration-200 ${dir === 'rtl' ? 'rotate-180 group-hover:translate-x-1' : 'group-hover:-translate-x-1'}`} />
            <span>جميع المقالات</span>
          </Link>

          {/* Article Header */}
          <header className={`mb-10 md:mb-12 ${dir === 'rtl' ? 'text-right' : ''}`}>
            <h1 className={`cera-serif text-3xl md:text-4xl lg:text-5xl text-[var(--cera-ink)] mb-6 leading-tight tracking-tight ${dir === 'rtl' ? 'text-right' : ''}`}>
              {post.title}
            </h1>
            
            <div className={`flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-[var(--cera-body)] mb-8 pb-6 border-b border-[var(--cera-line)] ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
              {post.authorName && (
                <div className={`flex items-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  <User className="h-4 w-4 text-[var(--cera-rose-ink)]" />
                  <span className="font-medium">{post.authorName}</span>
                </div>
              )}
              {post.publishedAt && (
                <div className={`flex items-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  <Calendar className="h-4 w-4 text-[var(--cera-muted)]" />
                  <time dateTime={post.publishedAt.toISOString()} className="font-medium">
                    {new Date(post.publishedAt).toLocaleDateString(locale === 'ar' ? 'ar-AE' : 'en-AE', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                </div>
              )}
              {post.views > 0 && (
                <div className={`flex items-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  <span className="text-[var(--cera-muted)]">•</span>
                  <span>{post.views} {post.views === 1 ? t('blog.view') : t('blog.views')}</span>
                </div>
              )}
            </div>

            {post.featuredImage && (
              <BlogFeaturedImage
                src={post.featuredImage}
                alt={`${post.title} - GENOSYS Professional Korean Dermacosmetics Blog Post`}
                dimensions={featuredImageDimensions}
              />
            )}

            {/* Black Friday Countdown Timer - Only for Black Friday post */}
            {post.slug === 'black-friday-sale-20-off' && (
              <div className="mb-10">
                <BlackFridayCountdown />
              </div>
            )}
          </header>

          {/* Article Content */}
          <BlogContentHtml
            className={`blog-content prose prose-lg prose-headings:text-[var(--cera-ink)] prose-headings:font-bold prose-headings:tracking-tight prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h3:text-2xl prose-h3:mt-10 prose-h3:mb-4 prose-h4:text-xl prose-h4:mt-8 prose-h4:mb-3 prose-p:text-[var(--cera-body)] prose-p:leading-relaxed prose-p:mb-6 prose-p:text-base md:prose-p:text-lg prose-strong:text-[var(--cera-ink)] prose-strong:font-semibold prose-a:text-[var(--cera-rose-ink)] prose-a:no-underline hover:prose-a:underline prose-a:font-medium prose-ul:text-[var(--cera-body)] prose-li:text-[var(--cera-body)] prose-li:leading-relaxed prose-li:mb-2 max-w-none mb-12 break-words ${dir === 'rtl' ? 'text-right prose-headings:text-right prose-p:text-right prose-ul:text-right prose-li:text-right' : ''}`}
            html={useMemo(() => optimizeBlogContentImages(sanitizeHtml(post.content)), [post.content])}
          />

          {/* End-of-article: back to articles + meta */}
          <div className={`border-t border-[var(--cera-line)] pt-8 mb-16 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${dir === 'rtl' ? 'sm:flex-row-reverse text-right' : ''}`}>
            <Link
              href={getLocalizedPath('/blog', locale)}
              className={`group inline-flex items-center gap-2 text-sm font-semibold text-[var(--cera-rose-ink)] hover:text-[var(--cera-rose-ink)] transition-colors ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
            >
              <ArrowLeft className={`h-4 w-4 transition-transform duration-200 ${dir === 'rtl' ? 'rotate-180 group-hover:translate-x-1' : 'group-hover:-translate-x-1'}`} />
              <span>العودة إلى جميع المقالات</span>
            </Link>
            <p className="text-xs text-[var(--cera-muted)]">
              {post.publishedAt
                ? `نُشر في ${new Date(post.publishedAt).toLocaleDateString('ar-AE', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}`
                : ''}
              {post.authorName ? ` · بواسطة ${post.authorName}` : ''}
            </p>
          </div>

          {/* Comments Section */}
          <div className="border-t border-[var(--cera-line)] pt-12 mt-16">
            <div className={`flex items-center gap-3 mb-8 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
              <h2 className={`cera-serif text-2xl md:text-3xl text-[var(--cera-ink)] ${dir === 'rtl' ? 'text-right' : ''}`}>
                {t('blog.comments')}
              </h2>
              {post.comments.length > 0 && (
                <span className="px-3 py-1 bg-[var(--cera-blush)] text-[var(--cera-rose-ink)] rounded-full text-sm font-semibold">
                  {post.comments.length}
                </span>
              )}
            </div>
            <BlogComments 
              postId={post.id} 
              initialComments={post.comments.map((comment) => ({
                id: comment.id,
                userName: comment.userName,
                content: comment.content,
                createdAt: comment.createdAt.toISOString(),
              }))} 
            />
          </div>
        </div>
      </div>
    </article>
  )
}

