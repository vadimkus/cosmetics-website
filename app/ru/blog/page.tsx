import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { errorLog } from '@/lib/logger'
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'
import BlogPageClient from '@/app/blog/BlogPageClient'

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
  title: 'Блог GENOSYS - Советы по корейскому уходу за кожей и профессиональные идеи красоты',
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
        url: 'https://genosys.ae/images/genosys-products.jpg',
        width: 1200,
        height: 630,
        alt: 'Блог GENOSYS',
      },
    ],
    url: 'https://genosys.ae/ru/blog',
    siteName: 'GENOSYS',
    locale: 'ru_RU',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@genosys_official',
    creator: '@genosys_official',
    title: 'Блог GENOSYS - Советы по корейскому уходу за кожей и профессиональные идеи красоты',
    description: 'Экспертные статьи о корейском уходе за кожей, профессиональной косметике, техниках микронидлинга и трендах индустрии красоты в ОАЭ.',
    images: ['https://genosys.ae/images/genosys-products.jpg'],
  },
  alternates: {
    canonical: 'https://genosys.ae/ru/blog',
    languages: {
      'en': 'https://genosys.ae/blog',
      'ar': 'https://genosys.ae/ar/blog',
      'ru': 'https://genosys.ae/ru/blog',
      'x-default': 'https://genosys.ae/blog',
    },
  },
}

async function fetchPublishedPosts(): Promise<BlogPostListItem[]> {
  {
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
      } catch {
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
  }
}

// Retried rather than swallowed. A single failure used to return [], which a
// reader cannot tell apart from having published nothing.
async function getBlogPosts(): Promise<BlogPostListItem[]> {
  try {
    return await fetchPublishedPosts()
  } catch (error) {
    errorLog('Blog fetch failed, retrying once:', error)
    try {
      return await fetchPublishedPosts()
    } catch (retryError) {
      errorLog('Error fetching blog posts:', retryError)
      return []
    }
  }
}

export default async function RussianBlogPage() {
  const posts = await getBlogPosts()
  const localizedPosts = posts.map(({ titleRu, excerptRu, ...post }) => ({
    ...post,
    title: titleRu || post.title,
    excerpt: excerptRu || post.excerpt,
  }))

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
              "name": "GENOSYS",
              "url": "https://genosys.ae"
            }
          }, null, 2)
        }}
      />

      <BlogPageClient posts={localizedPosts} />
    </>
  )
}

