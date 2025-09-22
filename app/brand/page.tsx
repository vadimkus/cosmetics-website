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
          <nav className="flex items-center gap-2 text-sm md:text-base text-gray-600 mb-8" aria-label="Breadcrumb">
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
          </nav>
          
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Genosys Gene Re-Birth System
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              GENOSYS is the world's first microneedling-dedicated brand born by combining microneedling with the cosmeceuticals specially formulated for microneedling treatment to optimize the skin care effects.
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

          {/* Business Presentation Download Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-2">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                GENOSYS Business Presentation
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Download our business presentation to learn more about Gene Re-Birth System and GENOSYS professional skincare solutions.
              </p>
              <div className="inline-flex items-center gap-3 bg-white rounded-lg px-6 py-4 shadow-md hover:shadow-lg transition-shadow">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <div className="text-left">
                  <div className="font-semibold text-gray-800">GENOSYS Business presentation.pdf</div>
                  <div className="text-sm text-gray-500">Business Presentation • 2.8 MB</div>
                </div>
                <a
                  href="/documents/ppt/GENOSYS%20Business%20presentation.pdf"
                  className="ml-4 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-2 rounded-lg hover:from-green-700 hover:to-green-800 transition-colors font-medium"
                >
                  View PDF
                </a>
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