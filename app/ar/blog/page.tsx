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
  title: 'مدونة GENOSYS - نصائح العناية بالبشرة الكورية ورؤى التجميل الاحترافية',
  description: 'مقالات الخبراء حول العناية بالبشرة الكورية، ومنتجات العناية بالبشرة الاحترافية، وتقنيات المايكرونيدلينغ، واتجاهات صناعة التجميل في الإمارات. تعلم من خبراء GENOSYS.',
  keywords: [
    'مدونة العناية بالبشرة الكورية',
    'نصائح منتجات العناية بالبشرة',
    'دليل المايكرونيدلينغ',
    'العناية بالبشرة الاحترافية الإمارات',
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
    title: 'مدونة GENOSYS - نصائح العناية بالبشرة الكورية ورؤى التجميل الاحترافية',
    description: 'مقالات الخبراء حول العناية بالبشرة الكورية، ومنتجات العناية بالبشرة الاحترافية، وتقنيات المايكرونيدلينغ، واتجاهات صناعة التجميل في الإمارات.',
    type: 'website',
    images: [
      {
        url: 'https://genosys.ae/images/genosys-products.jpg',
        width: 1200,
        height: 630,
        alt: 'مدونة GENOSYS',
      },
    ],
    url: 'https://genosys.ae/ar/blog',
    siteName: 'GENOSYS',
    locale: 'ar_AE',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@genosys_official',
    creator: '@genosys_official',
    title: 'مدونة GENOSYS - نصائح العناية بالبشرة الكورية ورؤى التجميل الاحترافية',
    description: 'مقالات الخبراء حول العناية بالبشرة الكورية، ومنتجات العناية بالبشرة الاحترافية، وتقنيات المايكرونيدلينغ، واتجاهات صناعة التجميل في الإمارات.',
    images: ['https://genosys.ae/images/genosys-products.jpg'],
  },
  alternates: {
    canonical: 'https://genosys.ae/ar/blog',
    languages: {
      'en': 'https://genosys.ae/blog',
      'ar': 'https://genosys.ae/ar/blog',
      'ru': 'https://genosys.ae/ru/blog',
      'x-default': 'https://genosys.ae/blog',
    },
  },
}

// Split so the query itself can be retried. The single catch that used to wrap
// it turned any transient database error into an empty blog, which is
// indistinguishable to a reader from having published nothing.
const fetchPublishedPosts = (): Promise<BlogPostListItem[]> =>
  prisma.blogPost.findMany({
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
  })

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

export default async function ArabicBlogPage() {
  const posts = await getBlogPosts()
  const localizedPosts = posts.map(({ titleAr, excerptAr, ...post }) => ({
    ...post,
    title: titleAr || post.title,
    excerpt: excerptAr || post.excerpt,
  }))

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
            "description": "مقالات الخبراء حول العناية بالبشرة الكورية، ومنتجات العناية بالبشرة الاحترافية، واتجاهات صناعة التجميل",
            "url": "https://genosys.ae/ar/blog",
            "inLanguage": "ar-AE",
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

