import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { errorLog } from '@/lib/logger'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'
import RussianBlogPageClient from './RussianBlogPageClient'

// Revalidate blog list every 60 seconds to show new posts quickly
export const revalidate = 60

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

export const metadata: Metadata = {
  title: 'Блог GENOSYS - Советы по корейскому уходу за кожей и профессиональные идеи красоты | Genosys Middle East FZ-LLC',
  description: 'Экспертные статьи о корейском уходе за кожей, профессиональной косметике, техниках микронидлинга и трендах индустрии красоты в ОАЭ. Узнайте от профессионалов GENOSYS.',
  keywords: 'Блог корейского ухода за кожей, советы по дерматокосметике, руководство по микронидлингу, профессиональный уход за кожей ОАЭ, блог K-beauty, советы по уходу за кожей',
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
    title: 'Блог GENOSYS - Советы по корейскому уходу за кожей и профессиональные идеи красоты',
    description: 'Экспертные статьи о корейском уходе за кожей, профессиональной косметике, техниках микронидлинга и трендах индустрии красоты в ОАЭ.',
    type: 'website',
    images: [
      {
        url: '/images/genosys-products.jpg',
        width: 1200,
        height: 630,
        alt: 'Блог GENOSYS',
      },
    ],
    url: 'https://genosys.ae/ru/blog',
    siteName: 'GENOSYS Middle East FZ-LLC',
    locale: 'ru_AE',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@genosys_official',
    creator: '@genosys_official',
    title: 'Блог GENOSYS - Советы по корейскому уходу за кожей и профессиональные идеи красоты',
    description: 'Экспертные статьи о корейском уходе за кожей, профессиональной косметике, техниках микронидлинга и трендах индустрии красоты в ОАЭ.',
    images: ['/images/genosys-products.jpg'],
  },
  alternates: {
    canonical: 'https://genosys.ae/ru/blog',
    languages: {
      'en': 'https://genosys.ae/blog',
      'ar': 'https://genosys.ae/ar/blog',
      'ru': 'https://genosys.ae/ru/blog',
    },
  },
}

async function getBlogPosts(): Promise<BlogPostListItem[]> {
  try {
    // First check if Russian columns exist
    let hasRussianColumns = false
    try {
      const columns = await prisma.$queryRaw<Array<{ column_name: string }>>`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'blog_posts' 
        AND column_name IN ('titleRu', 'excerptRu')
      `
      hasRussianColumns = columns.length >= 2
      } catch (error) {
      // If we can't check, assume they don't exist
      hasRussianColumns = false
    }

    // Use raw SQL to handle missing columns gracefully
    if (hasRussianColumns) {
      const posts = await prisma.$queryRaw<BlogPostListItem[]>`
        SELECT 
          id,
          title,
          "titleRu",
          slug,
          excerpt,
          "excerptRu",
          "featuredImage",
          "authorName",
          "publishedAt",
          views,
          "createdAt"
        FROM blog_posts
        WHERE published = true
        ORDER BY "publishedAt" DESC
        LIMIT 20
      `
      return posts
    } else {
      // Fallback: query without Russian columns
      const posts = await prisma.$queryRaw<Array<{
        id: string
        title: string
        slug: string
        excerpt: string | null
        featuredImage: string | null
        authorName: string | null
        publishedAt: Date | null
        views: number
        createdAt: Date
      }>>`
        SELECT 
          id,
          title,
          slug,
          excerpt,
          "featuredImage",
          "authorName",
          "publishedAt",
          views,
          "createdAt"
        FROM blog_posts
        WHERE published = true
        ORDER BY "publishedAt" DESC
        LIMIT 20
      `
      // Map to BlogPostListItem format with null Russian fields
      return posts.map(post => ({
        ...post,
        titleRu: null,
        excerptRu: null,
      }))
    }
  } catch (error) {
    errorLog('Error fetching blog posts:', error)
    return []
  }
}

export default async function RussianBlogPage() {
  const posts = await getBlogPosts()

  return (
    <>
      <BreadcrumbSchema 
        items={[
          { name: 'Главная', url: '/ru' },
          { name: 'Блог', url: '/ru/blog' }
        ]}
      />
      
      {/* Blog Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": "Блог GENOSYS",
            "description": "Экспертные статьи о корейском уходе за кожей, профессиональной дерматокосметике и трендах индустрии красоты",
            "url": "https://genosys.ae/ru/blog",
            "inLanguage": "ru-AE",
            "publisher": {
              "@type": "Organization",
              "name": "GENOSYS Middle East FZ-LLC",
              "url": "https://genosys.ae"
            }
          }, null, 2)
        }}
      />

      <RussianBlogPageClient posts={posts} />
    </>
  )
}

