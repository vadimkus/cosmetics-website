import Link from 'next/link'
import Image from 'next/image'
import { Calendar, User, ArrowLeft } from 'lucide-react'
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'
import BlogComments from '@/components/blog/BlogComments'
import BlackFridayCountdown from '@/components/BlackFridayCountdown'
import BlogPostClient from './BlogPostClient'
import type { Metadata } from 'next'
import { BlogPostPageProps } from '@/types/common'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { errorLog } from '@/lib/logger'
import { sanitizeHtml } from '@/lib/sanitize'

// Revalidate blog post every 60 seconds to show updates quickly
export const revalidate = 60

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
  updatedAt: Date
  comments: Array<{
    id: string
    userName: string
    content: string
    createdAt: Date
  }>
}

async function getBlogPost(slug: string): Promise<BlogPostWithComments | null> {
  try {
    // Type-safe Prisma query with fallback for type checking
    type PrismaClientWithBlogPost = typeof prisma & {
      blogPost?: {
        findUnique: (args: {
          where: { slug: string; published: boolean }
          include: {
            comments: {
              where: { approved: boolean }
              orderBy: { createdAt: 'desc' }
            }
          }
        }) => Promise<BlogPostWithComments | null>
        update: (args: {
          where: { id: string }
          data: { views: { increment: number } }
        }) => Promise<BlogPostWithComments>
      }
    }
    const typedPrisma = prisma as PrismaClientWithBlogPost
    const post = await typedPrisma.blogPost?.findUnique({
      where: {
        slug,
        published: true,
      },
      include: {
        comments: {
          where: {
            approved: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    }) || null

    if (post) {
      // Increment view count
      await typedPrisma.blogPost?.update({
        where: { id: post.id },
        data: { views: { increment: 1 } },
      })
    }

    return post
      } catch (error) {
    errorLog('Error fetching blog post:', error)
    return null
  }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPost(slug)

  if (!post) {
    return {
      title: 'Post Not Found | GENOSYS Blog',
    }
  }

  return {
    title: `${post.title} | GENOSYS Blog`,
    description: post.excerpt || post.content.substring(0, 160),
    openGraph: {
      title: post.title,
      description: post.excerpt || post.content.substring(0, 160),
      type: 'article',
      images: post.featuredImage ? [
        {
          url: post.featuredImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ] : [],
      publishedTime: post.publishedAt?.toISOString(),
      authors: post.authorName ? [post.authorName] : [],
    },
    alternates: {
      canonical: `https://genosys.ae/blog/${slug}`,
      languages: {
        'en': `https://genosys.ae/blog/${slug}`,
        'ar': `https://genosys.ae/ar/blog/${slug}`,
        'ru': `https://genosys.ae/ru/blog/${slug}`,
      },
    },
  }
}

export async function generateStaticParams() {
  try {
    // Type-safe Prisma query with fallback for type checking
    type PrismaClientWithBlogPost = typeof prisma & {
      blogPost?: {
        findMany: (args: {
          where: { published: boolean }
          select: { slug: true }
        }) => Promise<Array<{ slug: string }>>
      }
    }
    const typedPrisma = prisma as PrismaClientWithBlogPost
    const posts = await typedPrisma.blogPost?.findMany({
      where: { published: true },
      select: { slug: true },
    }) || []
    return posts.map((post: { slug: string }) => ({ slug: post.slug }))
      } catch (error) {
    return []
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await getBlogPost(slug)

  if (!post) {
    notFound()
  }

  // Remove featured image from content if it appears there (to avoid duplication)
  let content = post.content
  if (post.featuredImage) {
    // Escape special regex characters in the image path
    const escapedPath = post.featuredImage.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    // Match img tags with the featured image src (handles both single and double quotes)
    const imgRegex = new RegExp(`<img[^>]*src=["']${escapedPath}["'][^>]*>`, 'gi')
    // Also match img tags within div containers
    const divImgRegex = new RegExp(`<div[^>]*>\\s*<img[^>]*src=["']${escapedPath}["'][^>]*>\\s*</div>`, 'gi')
    content = content.replace(divImgRegex, '').replace(imgRegex, '')
  }

  // Sanitize content to prevent XSS attacks
  content = sanitizeHtml(content)

  return (
    <BlogPostClient>
      <div className="bg-white min-h-screen">
        <BreadcrumbSchema 
          items={[
            { name: 'Home', url: '/' },
            { name: 'Blog', url: '/blog' },
            { name: post.title, url: `/blog/${post.slug}` }
          ]}
        />
        
        {/* Article Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              "headline": post.title,
              "description": post.excerpt || post.content.substring(0, 160),
              "image": post.featuredImage || "https://genosys.ae/images/genosys-products.jpg",
              "datePublished": post.publishedAt?.toISOString(),
              "dateModified": post.updatedAt.toISOString(),
              "author": {
                "@type": "Person",
                "name": post.authorName || "GENOSYS Team"
              },
              "publisher": {
                "@type": "Organization",
                "name": "GENOSYS",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://genosys.ae/images/genosys-logo.png"
                }
              },
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": `https://genosys.ae/blog/${post.slug}`
              }
            }, null, 2)
          }}
        />

        <article className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
        <div className="container mx-auto px-4 py-8 md:py-16">
          <div className="max-w-4xl mx-auto">
          {/* Navigation Breadcrumb */}
          <nav className="text-xs md:text-sm text-gray-500 mb-3 md:mb-5" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-primary-600 transition-colors">Home</Link>
            <span className="mx-1.5">/</span>
            <Link href="/blog" className="hover:text-primary-600 transition-colors">Blog</Link>
            <span className="mx-1.5">/</span>
            <span className="text-gray-700 font-medium">{post.title}</span>
          </nav>

          {/* Prominent back-to-articles link — visible on all viewports */}
          <Link
            href="/blog"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700 mb-6 md:mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
            <span>All articles</span>
          </Link>

          {/* Article Header */}
          <header className="mb-10 md:mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight tracking-tight">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-gray-600 mb-8 pb-6 border-b border-gray-200">
              {post.authorName && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-green-600" />
                  <span className="font-medium">{post.authorName}</span>
                </div>
              )}
              {post.publishedAt && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <time dateTime={post.publishedAt.toISOString()} className="font-medium">
                    {new Date(post.publishedAt).toLocaleDateString('en-AE', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                </div>
              )}
              {post.views > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">•</span>
                  <span>{post.views} {post.views === 1 ? 'view' : 'views'}</span>
                </div>
              )}
            </div>

            {post.featuredImage && (
              <div className="relative w-full rounded-xl overflow-hidden mb-10 shadow-lg bg-gray-50" style={{ aspectRatio: '1522 / 922' }}>
                <Image
                  src={post.featuredImage}
                  alt={`${post.title} - GENOSYS Professional Korean Dermacosmetics Blog Post`}
                  fill
                  className="object-contain"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 896px"
                />
              </div>
            )}

            {/* Black Friday Countdown Timer - Only for Black Friday post */}
            {post.slug === 'black-friday-sale-20-off' && (
              <div className="mb-10">
                <BlackFridayCountdown />
              </div>
            )}
          </header>

          {/* Article Content */}
          <div 
            className="blog-content prose prose-lg prose-headings:text-gray-900 prose-headings:font-bold prose-headings:tracking-tight prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h3:text-2xl prose-h3:mt-10 prose-h3:mb-4 prose-h4:text-xl prose-h4:mt-8 prose-h4:mb-3 prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6 prose-p:text-base md:prose-p:text-lg prose-strong:text-gray-900 prose-strong:font-semibold prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline prose-a:font-medium prose-ul:text-gray-700 prose-li:text-gray-700 prose-li:leading-relaxed prose-li:mb-2 max-w-none mb-12"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }}
          />

          {/* End-of-article: back to articles + share/related affordance */}
          <div className="border-t border-gray-200 pt-8 mb-16 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <Link
              href="/blog"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
              <span>Back to all articles</span>
            </Link>
            <p className="text-xs text-gray-500">
              Published{' '}
              {post.publishedAt
                ? new Date(post.publishedAt).toLocaleDateString('en-AE', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : ''}
              {post.authorName ? ` · by ${post.authorName}` : ''}
            </p>
          </div>

          {/* Comments Section */}
          <div className="border-t border-gray-200 pt-12 mt-16">
            <div className="flex items-center gap-3 mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Comments
              </h2>
              {post.comments.length > 0 && (
                <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold">
                  {post.comments.length}
                </span>
              )}
            </div>
            <BlogComments 
              postId={post.id} 
              initialComments={post.comments.map((comment: { id: string; userName: string; content: string; createdAt: Date }) => ({
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
      </div>
    </BlogPostClient>
  )
}

