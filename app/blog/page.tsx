import Link from 'next/link'
import Image from 'next/image'
import { Calendar, User, ArrowRight, ArrowLeft, Eye } from 'lucide-react'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { errorLog } from '@/lib/logger'

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

export const metadata: Metadata = {
  title: 'GENOSYS Blog - Korean Skincare Tips & Professional Beauty Insights | Genosys Middle East FZ-LLC',
  description: 'Expert articles on Korean skincare, professional dermacosmetics, microneedling techniques, and beauty industry trends in UAE. Learn from GENOSYS professionals.',
  keywords: 'Korean skincare blog, dermacosmetics tips, microneedling guide, professional skincare UAE, K-beauty blog, skincare advice',
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
}

export default async function BlogPage() {
  const posts = await getBlogPosts()

  return (
    <div className="bg-white min-h-screen">
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

      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-6xl mx-auto">
          {/* Navigation Breadcrumb */}
          <nav className="flex flex-col gap-2 text-sm md:text-base text-gray-600 mb-8" aria-label="Breadcrumb">
            {/* Mobile Breadcrumb */}
            <div className="md:hidden flex items-center gap-2">
              <Link 
                href="/"
                className="hover:text-primary-600 transition-colors flex items-center"
              >
                Home
              </Link>
              <span className="flex items-center">/</span>
              <span className="text-gray-900 font-medium flex items-center">
                Blog
              </span>
            </div>
            
            {/* Mobile Back Button */}
            <Link 
              href="/"
              className="md:hidden flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="font-medium">Back to Home</span>
            </Link>
            
            {/* Desktop Breadcrumb */}
            <div className="hidden md:flex items-center gap-2">
              <Link 
                href="/"
                className="hover:text-primary-600 transition-colors flex items-center"
              >
                Home
              </Link>
              <span className="flex items-center">/</span>
              <span className="text-gray-900 font-medium flex items-center">
                Blog
              </span>
            </div>
          </nav>

          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              GENOSYS Blog
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Expert insights on Korean skincare, professional dermacosmetics, and beauty industry trends
            </p>
          </div>

          {/* Blog Posts Grid */}
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post: { id: string; slug: string; title: string; excerpt: string | null; featuredImage: string | null; authorName: string | null; publishedAt: Date | null; views: number; createdAt: Date }) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {post.featuredImage && (
                    <div className="relative h-48 w-full">
                      <Image
                        src={post.featuredImage}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-3 line-clamp-2">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {post.excerpt}
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
                            {new Date(post.publishedAt).toLocaleDateString('en-AE', {
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
                          <span>{post.views} {post.views === 1 ? 'view' : 'views'}</span>
                        </div>
                      )}
                    </div>
                    <div className="mt-4 flex items-center text-primary-600 font-semibold">
                      Read More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-600 text-lg mb-4">
                No blog posts available yet.
              </p>
              <p className="text-gray-500">
                Check back soon for expert skincare tips and insights!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

