import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'
import type { Metadata } from 'next'
import { BlogPostPageProps } from '@/types/common'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { errorLog } from '@/lib/logger'
import RussianBlogPostClient from './RussianBlogPostClient'

// Match the EN blog slug page — ISR every 60 seconds so edits propagate quickly.
export const revalidate = 60

type BlogPostWithComments = {
  id: string
  title: string
  titleRu: string | null
  slug: string
  excerpt: string | null
  excerptRu: string | null
  content: string
  contentRu: string | null
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
          select?: {
            id: true
            title: true
            titleRu: true
            slug: true
            excerpt: true
            excerptRu: true
            content: true
            contentRu: true
            featuredImage: true
            authorName: true
            publishedAt: true
            views: true
            updatedAt: true
            comments: true
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
      select: {
        id: true,
        title: true,
        titleRu: true,
        slug: true,
        excerpt: true,
        excerptRu: true,
        content: true,
        contentRu: true,
        featuredImage: true,
        authorName: true,
        publishedAt: true,
        views: true,
        updatedAt: true,
        comments: {
          where: {
            approved: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
          select: {
            id: true,
            userName: true,
            content: true,
            createdAt: true,
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
      title: 'Статья не найдена | Блог GENOSYS',
    }
  }

  const title = post.titleRu || post.title
  const excerpt = post.excerptRu || post.excerpt || post.content.substring(0, 160)

  return {
    title: `${title} | Блог GENOSYS`,
    description: excerpt,
    openGraph: {
      title,
      description: excerpt,
      type: 'article',
      images: post.featuredImage ? [
        {
          url: post.featuredImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ] : [],
      publishedTime: post.publishedAt?.toISOString(),
      authors: post.authorName ? [post.authorName] : [],
      url: `https://genosys.ae/ru/blog/${slug}`,
      siteName: 'GENOSYS Professional',
      locale: 'ru_AE',
    },
    alternates: {
      canonical: `https://genosys.ae/ru/blog/${slug}`,
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

export default async function RussianBlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await getBlogPost(slug)

  if (!post) {
    notFound()
  }

  // Use Russian content if available, otherwise fall back to English
  const title = post.titleRu || post.title
  const excerpt = post.excerptRu || post.excerpt
  let content = post.contentRu || post.content

  // Remove featured image from content if it appears there (to avoid duplication)
  if (post.featuredImage) {
    // Escape special regex characters in the image path
    const escapedPath = post.featuredImage.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    // Match img tags with the featured image src (handles both single and double quotes)
    const imgRegex = new RegExp(`<img[^>]*src=["']${escapedPath}["'][^>]*>`, 'gi')
    // Also match img tags within div containers
    const divImgRegex = new RegExp(`<div[^>]*>\\s*<img[^>]*src=["']${escapedPath}["'][^>]*>\\s*</div>`, 'gi')
    content = content.replace(divImgRegex, '').replace(imgRegex, '')
  }

  return (
    <>
      <BreadcrumbSchema 
        items={[
          { name: 'Главная', url: '/ru' },
          { name: 'Блог', url: '/ru/blog' },
          { name: title, url: `/ru/blog/${post.slug}` }
        ]}
      />
      
      {/* Article Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": title,
            "description": excerpt || content.substring(0, 160),
            "image": post.featuredImage || "https://genosys.ae/images/genosys-products.jpg",
            "datePublished": post.publishedAt?.toISOString(),
            "dateModified": post.updatedAt.toISOString(),
            "author": {
              "@type": "Person",
              "name": post.authorName || "GENOSYS Team"
            },
            "publisher": {
              "@type": "Organization",
              "name": "GENOSYS Middle East FZ-LLC",
              "logo": {
                "@type": "ImageObject",
                "url": "https://genosys.ae/images/genosys-logo.png"
              }
            },
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `https://genosys.ae/ru/blog/${post.slug}`
            },
            "inLanguage": "ru-AE"
          }, null, 2)
        }}
      />

      <RussianBlogPostClient 
        post={{
          ...post,
          title,
          excerpt,
          content,
        }}
      />
    </>
  )
}

