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
    images: [
      {
        url: '/images/genosys-products.jpg',
        width: 1200,
        height: 630,
        alt: 'GENOSYS Brand - Gene Re-Birth System',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@genosys_me',
    creator: '@genosys_me',
    title: 'GENOSYS Brand Story - Gene Re-Birth System',
    description: 'Discover GENOSYS, the world\'s first microneedling-dedicated brand. Gene Re-Birth System combines microneedling with specially formulated cosmeceuticals.',
    images: ['/images/genosys-products.jpg'],
  },
  alternates: {
    canonical: 'https://genosys.ae/brand',
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
              <span className="text-gray-900 font-medium flex items-center">
                Brand
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
                Brand
              </span>
            </div>
          </nav>
          
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Genosys Gene Re-Birth System
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              GENOSYS is the world&apos;s first microneedling-dedicated brand born by combining microneedling with the cosmeceuticals specially formulated for microneedling treatment to optimize the skin care effects.
            </p>
            
            {/* Video Section */}
            <div className="max-w-4xl mx-auto mb-8">
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

          <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
            <p className="text-gray-600 leading-relaxed text-lg text-center mb-8">
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

          <div className="bg-white rounded-lg shadow-sm border p-8">
            <div className="text-center">
              <div className="mt-6">
                <Image
                  src="/Logo/Full.png"
                  alt="GENOSYS Logo"
                  width={200}
                  height={100}
                  className="mx-auto"
                />
              </div>
              <div className="mt-6">
                <Image
                  src="/images/genosys-products.jpg"
                  alt="GENOSYS Professional Skincare Products"
                  width={800}
                  height={600}
                  className="rounded-lg shadow-md mx-auto"
                  priority
                />
              </div>
              <p className="text-gray-500 text-base mt-4">
                GENOSYS Professional Skincare Line - Dermatologically Tested Products.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}