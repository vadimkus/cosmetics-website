import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { errorLog } from '@/lib/logger'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'
import ArabicBlogPageClient from './ArabicBlogPageClient'

// Revalidate blog list every 60 seconds to show new posts quickly
export const revalidate = 60

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

export const metadata: Metadata = {
  title: 'مدونة GENOSYS - نصائح العناية بالبشرة الكورية ورؤى الجمال المهنية | Genosys Middle East FZ-LLC',
  description: 'مقالات الخبراء حول العناية بالبشرة الكورية، منتجات العناية بالبشرة المهنية، تقنيات المايكرونيدلينغ، واتجاهات صناعة الجمال في الإمارات. تعلم من محترفي GENOSYS.',
  keywords: [
    'مدونة العناية بالبشرة الكورية',
    'نصائح منتجات العناية بالبشرة',
    'دليل المايكرونيدلينغ',
    'العناية بالبشرة المهنية الإمارات',
    'مدونة K-beauty',
    'نصائح العناية بالبشرة'
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
    title: 'مدونة GENOSYS - نصائح العناية بالبشرة الكورية ورؤى الجمال المهنية',
    description: 'مقالات الخبراء حول العناية بالبشرة الكورية، منتجات العناية بالبشرة المهنية، تقنيات المايكرونيدلينغ، واتجاهات صناعة الجمال في الإمارات.',
    type: 'website',
    images: [
      {
        url: '/images/genosys-products.jpg',
        width: 1200,
        height: 630,
        alt: 'مدونة GENOSYS',
      },
    ],
    url: 'https://genosys.ae/ar/blog',
    siteName: 'GENOSYS Middle East FZ-LLC',
    locale: 'ar_AE',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@genosys_official',
    creator: '@genosys_official',
    title: 'مدونة GENOSYS - نصائح العناية بالبشرة الكورية ورؤى الجمال المهنية',
    description: 'مقالات الخبراء حول العناية بالبشرة الكورية، منتجات العناية بالبشرة المهنية، تقنيات المايكرونيدلينغ، واتجاهات صناعة الجمال في الإمارات.',
    images: ['/images/genosys-products.jpg'],
  },
  alternates: {
    canonical: 'https://genosys.ae/ar/blog',
    languages: {
      'en': 'https://genosys.ae/blog',
      'ar': 'https://genosys.ae/ar/blog',
      'ru': 'https://genosys.ae/ru/blog',
    },
  },
}

async function getBlogPosts(): Promise<BlogPostListItem[]> {
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
            titleAr: true
            slug: true
            excerpt: true
            excerptAr: true
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
        titleAr: true,
        slug: true,
        excerpt: true,
        excerptAr: true,
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
}

export default async function ArabicBlogPage() {
  const posts = await getBlogPosts()

  return (
    <>
      <BreadcrumbSchema 
        items={[
          { name: 'الرئيسية', url: '/ar' },
          { name: 'المدونة', url: '/ar/blog' }
        ]}
      />
      
      {/* Blog Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": "مدونة GENOSYS",
            "description": "مقالات الخبراء حول العناية بالبشرة الكورية، منتجات العناية بالبشرة المهنية، واتجاهات صناعة الجمال",
            "url": "https://genosys.ae/ar/blog",
            "inLanguage": "ar-AE",
            "publisher": {
              "@type": "Organization",
              "name": "GENOSYS Middle East FZ-LLC",
              "url": "https://genosys.ae"
            }
          }, null, 2)
        }}
      />

      <ArabicBlogPageClient posts={posts} />
    </>
  )
}

