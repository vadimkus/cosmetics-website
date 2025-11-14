import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'
import PartnersList from '@/components/partners/PartnersList'

export const metadata: Metadata = {
  title: 'Partners - GENOSYS Professional Korean Dermacosmetics | Genosys Middle East FZ-LLC',
  description: 'Our trusted partners and distributors for GENOSYS professional Korean dermacosmetics in the UAE and Middle East region.',
  keywords: 'GENOSYS partners, Korean dermacosmetics distributors, UAE skincare partners, Middle East cosmetics partners',
  openGraph: {
    title: 'Partners - GENOSYS Professional Korean Dermacosmetics',
    description: 'Our trusted partners and distributors for GENOSYS professional Korean dermacosmetics in the UAE and Middle East region.',
    type: 'website',
    images: [
      {
        url: '/images/genosys-products.jpg',
        width: 1200,
        height: 630,
        alt: 'GENOSYS Partners',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@genosys_me',
    creator: '@genosys_me',
    title: 'Partners - GENOSYS Professional Korean Dermacosmetics',
    description: 'Our trusted partners and distributors for GENOSYS professional Korean dermacosmetics in the UAE and Middle East region.',
    images: ['/images/genosys-products.jpg'],
  },
  alternates: {
    canonical: 'https://genosys.ae/partners',
  },
}

export default function PartnersPage() {
  return (
    <>
      <BreadcrumbSchema 
        items={[
          { name: 'Home', url: '/' },
          { name: 'Partners', url: '/partners' }
        ]}
      />
      <div className="bg-white min-h-screen">
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
                  Partners
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
                  Partners
                </span>
              </div>
            </nav>
            <div className="text-center mb-4 sm:mb-6 lg:mb-8">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-2 px-2">
                Our Partners
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-gray-600 mb-4 px-2">
                Building strong partnerships across United Arab Emirates
              </p>
            </div>
            
            <PartnersList />

            {/* Call to Action */}
            <div className="mt-6 sm:mt-8 lg:mt-12 text-center">
              <div className="bg-gradient-to-r from-primary-50 to-red-50 rounded-xl p-3 sm:p-4 md:p-6 lg:p-8">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-2 sm:mb-3 lg:mb-4">
                  Interested in Becoming a Partner?
                </h2>
                <p className="text-xs sm:text-sm lg:text-base text-gray-600 mb-3 sm:mb-4 lg:mb-6 px-1">
                  Join our network of trusted partners and help us bring GENOSYS products to more customers
                </p>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 lg:gap-4 justify-center">
                  <Link 
                    href="/contact-genosys-uae"
                    className="inline-flex items-center justify-center bg-primary-600 text-white px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 rounded-lg text-xs sm:text-sm lg:text-base font-semibold hover:bg-primary-700 transition-colors w-full sm:w-auto"
                  >
                    Contact Us
                  </Link>
                  <Link 
                    href="/products"
                    className="inline-flex items-center justify-center border border-primary-600 text-primary-600 px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 rounded-lg text-xs sm:text-sm lg:text-base font-semibold hover:bg-primary-50 transition-colors w-full sm:w-auto"
                  >
                    View Products
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}