import BreadcrumbSchema from '@/components/BreadcrumbSchema'
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { errorLog } from '@/lib/logger'
import BlogPageClient from './BlogPageClient'
import { unstable_cache } from 'next/cache'

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

// Revalidate blog list every 60 seconds to show new posts quickly
export const revalidate = 60

export const metadata: Metadata = {
  title: 'GENOSYS Blog - Korean Skincare Tips & Professional Beauty Insights | Genosys Middle East FZ-LLC',
  description: 'Expert articles on Korean skincare, professional dermacosmetics, microneedling techniques, and beauty industry trends in UAE. Learn from GENOSYS professionals.',
  keywords: [
    'Korean skincare blog',
    'dermacosmetics tips',
    'microneedling guide',
    'professional skincare UAE',
    'K-beauty blog',
    'skincare advice'
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'GENOSYS Blog - Korean Skincare Tips & Professional Beauty Insights',
    description: 'Expert articles on Korean skincare, professional dermacosmetics, microneedling techniques, and beauty industry trends in UAE.',
    type: 'website',
    url: 'https://genosys.ae/blog',
    siteName: 'GENOSYS Middle East FZ-LLC',
    locale: 'en_AE',
    images: [
      {
        url: '/images/genosys-products.jpg',
        width: 1200,
        height: 630,
        alt: 'GENOSYS Blog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@genosys_official',
    creator: '@genosys_official',
    title: 'GENOSYS Blog - Korean Skincare Tips & Professional Beauty Insights',
    description: 'Expert articles on Korean skincare, professional dermacosmetics, microneedling techniques, and beauty industry trends in UAE.',
    images: ['/images/genosys-products.jpg'],
  },
  alternates: {
    canonical: 'https://genosys.ae/blog',
    languages: {
      'en': 'https://genosys.ae/blog',
      'ar': 'https://genosys.ae/ar/blog',
      'ru': 'https://genosys.ae/ru/blog',
    },
  },
}

// Cached blog posts fetch - revalidates every 60 seconds
const getBlogPosts = unstable_cache(
  async (): Promise<BlogPostListItem[]> => {
    try {
      // Type-safe Prisma query with fallback for type checking
      type PrismaClientWithBlogPost = typeof prisma & {
        blogPost?: {
          findMany: (args: {
            where: { published: boolean }
            orderBy: { publishedAt: 'desc' }
            take: number
            select: {
              id: true
              title: true
              slug: true
              excerpt: true
              featuredImage: true
              authorName: true
              publishedAt: true
              views: true
              createdAt: true
            }
          }) => Promise<BlogPostListItem[]>
        }
      }
      const typedPrisma = prisma as PrismaClientWithBlogPost
      const posts = await typedPrisma.blogPost?.findMany({
        where: {
          published: true,
        },
        orderBy: {
          publishedAt: 'desc',
        },
        take: 20,
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          featuredImage: true,
          authorName: true,
          publishedAt: true,
          views: true,
          createdAt: true,
        },
      }) || []
      return posts
    } catch (error) {
      errorLog('Error fetching blog posts:', error)
      return []
    }
  },
  ['blog-posts'],
  { revalidate: 60, tags: ['blog'] }
)

export default async function BlogPage() {
  const posts = await getBlogPosts()

  return (
    <>
      <BreadcrumbSchema 
        items={[
          { name: 'Home', url: '/' },
          { name: 'Blog', url: '/blog' }
        ]}
      />
      
      {/* Blog Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": "GENOSYS Blog",
            "description": "Expert articles on Korean skincare, professional dermacosmetics, and beauty industry trends",
            "url": "https://genosys.ae/blog",
            "publisher": {
              "@type": "Organization",
              "name": "GENOSYS Middle East FZ-LLC",
              "url": "https://genosys.ae"
            }
          }, null, 2)
        }}
      />
      
      <BlogPageClient posts={posts} />
    </>
  )
}

