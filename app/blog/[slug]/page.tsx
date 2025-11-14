import Link from 'next/link'
import Image from 'next/image'
import { Calendar, User, ArrowLeft } from 'lucide-react'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'
import BlogComments from '@/components/blog/BlogComments'
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

async function getBlogPost(slug: string) {
  try {
    const post = await prisma.blogPost.findUnique({
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
    })

    if (post) {
      // Increment view count
      await prisma.blogPost.update({
        where: { id: post.id },
        data: { views: { increment: 1 } },
      })
    }

    return post
  } catch (error) {
    console.error('Error fetching blog post:', error)
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
    },
  }
}

export async function generateStaticParams() {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      select: { slug: true },
    })
    return posts.map((post) => ({ slug: post.slug }))
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

  return (
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
              "name": "GENOSYS Middle East FZ-LLC",
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
              <Link 
                href="/blog"
                className="hover:text-primary-600 transition-colors flex items-center"
              >
                Blog
              </Link>
              <span className="flex items-center">/</span>
              <span className="text-gray-900 font-medium flex items-center line-clamp-1">
                {post.title}
              </span>
            </div>
            
            {/* Mobile Back Button */}
            <Link 
              href="/blog"
              className="md:hidden flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="font-medium">Back to Blog</span>
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
              <Link 
                href="/blog"
                className="hover:text-primary-600 transition-colors flex items-center"
              >
                Blog
              </Link>
              <span className="flex items-center">/</span>
              <span className="text-gray-900 font-medium flex items-center line-clamp-1">
                {post.title}
              </span>
            </div>
          </nav>

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
              <div className="relative h-[280px] sm:h-[400px] md:h-[500px] w-full rounded-xl overflow-hidden mb-10 shadow-lg">
                <Image
                  src={post.featuredImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 896px"
                />
              </div>
            )}
          </header>

          {/* Article Content */}
          <div 
            className="blog-content prose prose-lg prose-headings:text-gray-900 prose-headings:font-bold prose-headings:tracking-tight prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h3:text-2xl prose-h3:mt-10 prose-h3:mb-4 prose-h4:text-xl prose-h4:mt-8 prose-h4:mb-3 prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6 prose-p:text-base md:prose-p:text-lg prose-strong:text-gray-900 prose-strong:font-semibold prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline prose-a:font-medium prose-ul:text-gray-700 prose-li:text-gray-700 prose-li:leading-relaxed prose-li:mb-2 max-w-none mb-16"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

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
              initialComments={post.comments.map(comment => ({
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
  )
}

