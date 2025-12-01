import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'GENOSYS Brand Story - Gene Re-Birth System | Genosys Middle East FZ-LLC',
  description: 'Discover GENOSYS, the world\'s first microneedling-dedicated brand. Gene Re-Birth System combines microneedling with specially formulated cosmeceuticals for optimal skincare results.',
  keywords: 'GENOSYS brand, Gene Re-Birth System, microneedling brand, Korean dermacosmetics, professional skincare, UAE cosmetics',
  openGraph: {
    title: 'GENOSYS Brand Story - Gene Re-Birth System',
    description: 'Discover GENOSYS, the world\'s first microneedling-dedicated brand. Gene Re-Birth System combines microneedling with specially formulated cosmeceuticals.',
    type: 'website',
    url: 'https://genosys.ae/brand',
    siteName: 'GENOSYS Middle East FZ-LLC',
    locale: 'en_AE',
    images: [
      {
        url: '/images/genosys-products.jpg',
        width: 1200,
        height: 630,
        alt: 'GENOSYS Brand - Gene Re-Birth System',
      },
    ],
  },
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
  twitter: {
    card: 'summary_large_image',
    site: '@genosys_official',
    creator: '@genosys_official',
    title: 'GENOSYS Brand Story - Gene Re-Birth System',
    description: 'Discover GENOSYS, the world\'s first microneedling-dedicated brand. Gene Re-Birth System combines microneedling with specially formulated cosmeceuticals.',
    images: ['/images/genosys-products.jpg'],
  },
  alternates: {
    canonical: 'https://genosys.ae/brand',
    languages: {
      'en': 'https://genosys.ae/brand',
      'ar': 'https://genosys.ae/ar/brand',
      'ru': 'https://genosys.ae/ru/brand',
    },
  },
}

export default function BrandPage() {
  return (
    <div className="bg-white min-h-screen">
      <BreadcrumbSchema 
        items={[
          { name: 'Home', url: '/' },
          { name: 'Brand', url: '/brand' }
        ]}
      />
      <div className="container mx-auto px-3 md:px-4 py-4 md:py-16">
        <div className="max-w-4xl mx-auto">

          {/* Navigation Breadcrumb */}
          <nav className="text-xs md:text-base text-gray-600 mb-2 md:mb-4" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-primary-600 transition-colors">Home</Link>
            <span> / </span>
            <span className="text-gray-900 font-medium">Brand</span>
          </nav>
          
          {/* Back to Home */}
          <Link href="/" className="inline-flex items-center gap-1 text-xs md:text-sm text-primary-600 hover:text-primary-700 mb-4 md:mb-8">
            <ArrowLeft className="h-3 w-3 md:h-4 md:w-4" />
            <span>Back to Home</span>
          </Link>
          
          <div className="text-center mb-6 md:mb-12">
            <h1 className="text-xl md:text-5xl font-bold text-gray-800 mb-3 md:mb-6">
              Genosys Gene Re-Birth System
            </h1>
            <p className="text-xs md:text-xl text-gray-600 max-w-2xl mx-auto mb-4 md:mb-8 leading-relaxed">
              GENOSYS is the world&apos;s first microneedling-dedicated brand born by combining microneedling with the cosmeceuticals specially formulated for microneedling treatment to optimize the skin care effects.
            </p>
            
            {/* Video Section */}
            <div className="max-w-4xl mx-auto mb-4 md:mb-8">
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
                  src="https://www.youtube.com/embed/4L9xZc7wAjI"
                  title="Genosys Gene Re-Birth System"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
            
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-3 md:p-8 mb-4 md:mb-8">
            <p className="text-gray-600 leading-relaxed text-xs md:text-lg text-center mb-4 md:mb-8">
              With skin-friendly formulations and powerful active ingredients, GENOSYS homecare/professional lines not only provide long-lasting, visible results but also boosts the effectiveness of professional treatments.
            </p>
            
            {/* Video Section */}
            <div className="max-w-4xl mx-auto">
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
                  src="https://www.youtube.com/embed/v-i6CHJfWIg?autoplay=1&loop=1&playlist=v-i6CHJfWIg&mute=1&controls=0&showinfo=0&rel=0&modestbranding=1"
                  title="GENOSYS Professional Treatment"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                ></iframe>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-3 md:p-8">
            <div className="text-center">
              <div className="mt-3 md:mt-6">
                <Image
                  src="/Logo/Full.png"
                  alt="GENOSYS Gene Re-Birth System - Professional Korean Dermacosmetics Brand Logo"
                  width={200}
                  height={100}
                  className="mx-auto scale-75 md:scale-100"
                />
              </div>
              <div className="mt-3 md:mt-6">
                <Image
                  src="/images/genosys-products.jpg"
                  alt="GENOSYS Professional Korean Dermacosmetics Skincare Products Collection - Microneedling Devices and Skincare Solutions"
                  width={800}
                  height={600}
                  className="rounded-lg shadow-md mx-auto"
                  priority
                />
              </div>
              <p className="text-gray-500 text-[10px] md:text-base mt-2 md:mt-4">
                GENOSYS Professional Skincare Line - Dermatologically Tested Products.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}