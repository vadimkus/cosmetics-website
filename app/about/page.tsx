import Link from 'next/link'
import Logo from '@/components/Logo'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About GENOSYS Middle East FZ-LLC - Official Korean Dermacosmetics Distributor',
  description: 'Learn about GENOSYS Middle East FZ-LLC, the official distributor of DTSMG Co., Ltd Korea in the UAE. Professional Korean dermacosmetics with Dubai Municipality certification.',
  keywords: 'GENOSYS Middle East, Korean dermacosmetics distributor, DTSMG Korea, Dubai Municipality certified, UAE cosmetics distributor',
  openGraph: {
    title: 'About GENOSYS Middle East FZ-LLC - Official Korean Dermacosmetics Distributor',
    description: 'Learn about GENOSYS Middle East FZ-LLC, the official distributor of DTSMG Co., Ltd Korea in the UAE. Professional Korean dermacosmetics with Dubai Municipality certification.',
    type: 'website',
    images: [
      {
        url: '/images/genosys-logo.png',
        width: 400,
        height: 400,
        alt: 'GENOSYS Middle East FZ-LLC Logo',
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
    title: 'About GENOSYS Middle East FZ-LLC - Official Korean Dermacosmetics Distributor',
    description: 'Learn about GENOSYS Middle East FZ-LLC, the official distributor of DTSMG Co., Ltd Korea in the UAE.',
    images: ['/images/genosys-logo.png'],
  },
  alternates: {
    canonical: 'https://genosys.ae/about',
    languages: {
      'en': 'https://genosys.ae/about',
      'ar': 'https://genosys.ae/ar/about',
    },
  },
}

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen">
      <BreadcrumbSchema 
        items={[
          { name: 'Home', url: '/' },
          { name: 'About', url: '/about' }
        ]}
      />
      <div className="container mx-auto px-3 md:px-4 py-4 md:py-16">
      <div className="max-w-4xl mx-auto">

        {/* Navigation Breadcrumb */}
        <nav className="flex items-center gap-1 md:gap-2 text-xs md:text-base text-gray-600 mb-4 md:mb-8" aria-label="Breadcrumb">
          <Link 
            href="/"
            className="hover:text-primary-600 transition-colors"
          >
            Home
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">
            About
          </span>
        </nav>

        {/* Header - Compact on mobile */}
        <div className="text-center mb-6 md:mb-12">
          <h1 className="text-xl md:text-5xl font-bold text-gray-800 mb-3 md:mb-6">
            Genosys Middle East FZ-LLC
          </h1>
          <div className="flex justify-center mb-3 md:mb-6">
            <Logo size="lg" className="justify-center scale-50 md:scale-100" />
          </div>
        </div>

        {/* About & Mission - Stacked on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-8 mb-6 md:mb-12">
          <div className="bg-white rounded-lg shadow-sm border p-3 md:p-6">
            <h2 className="text-base md:text-2xl font-semibold text-gray-800 mb-2 md:mb-4 text-center">About Us</h2>
            <p className="text-xs md:text-base text-gray-600 leading-relaxed mb-2 md:mb-4">
              Genosys Middle East FZ-LLC is an official distributor of DTSMG. Co., Ltd, Korea in the United Arab Emirates.
            </p>
            <p className="text-xs md:text-base text-gray-600 leading-relaxed">
              All products are manufactured in Seoul, South Korea and certified by 
              <a href="https://www.dm.gov.ae/" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700 underline ml-1">
                Dubai Municipality
              </a>.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-3 md:p-6">
            <h2 className="text-base md:text-2xl font-semibold text-gray-800 mb-2 md:mb-4 text-center">Our Mission</h2>
            <p className="text-xs md:text-base text-gray-600 leading-relaxed">
              To provide exceptional beauty products that enhance our customers&apos; 
              confidence and natural beauty, with the highest standards of quality.
            </p>
          </div>
        </div>

        {/* Legal & Contact - Accordion-style on mobile */}
        <div className="bg-white rounded-lg shadow-sm border p-3 md:p-8 mb-4 md:mb-8">
          <h2 className="text-lg md:text-3xl font-bold text-gray-800 mb-4 md:mb-8 text-center">Legal Info & Contact</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            {/* Company Details */}
            <div>
              <h3 className="text-sm md:text-xl font-semibold text-gray-800 mb-2 md:mb-6 pb-1 md:pb-2 border-b border-gray-200">Company Details</h3>
              <div className="space-y-1 md:space-y-4 text-gray-600">
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-800 text-[10px] md:text-sm uppercase tracking-wide">Company Name</span>
                  <span className="text-xs md:text-base">Genosys Middle East FZ-LLC</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-800 text-[10px] md:text-sm uppercase tracking-wide">Year</span>
                  <span className="text-xs md:text-base">2019</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-800 text-[10px] md:text-sm uppercase tracking-wide">License</span>
                  <a href="/documents/commercial-license.pdf" download="Genosys-Commercial-License-5023192.pdf" className="text-primary-600 hover:text-primary-700 underline text-xs md:text-base">5023192</a>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-800 text-[10px] md:text-sm uppercase tracking-wide">TRN</span>
                  <a href="/documents/genosys-trn-104229886700003.pdf" download="GENOSYS-TRN-104229886700003.pdf" className="text-primary-600 hover:text-primary-700 underline text-xs md:text-base">104229886700003</a>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-800 text-[10px] md:text-sm uppercase tracking-wide">Main Office</span>
                  <span className="text-xs md:text-base">Al Hamra Industrial Zone-FZ, RAK, UAE</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-800 text-[10px] md:text-sm uppercase tracking-wide">Dubai Office</span>
                  <span className="text-xs md:text-base">Cordoba Residence, Villa E02</span>
                </div>
              </div>
            </div>
            
            {/* Contact Information */}
            <div>
              <h3 className="text-sm md:text-xl font-semibold text-gray-800 mb-2 md:mb-6 pb-1 md:pb-2 border-b border-gray-200">Contact</h3>
              <div className="space-y-1 md:space-y-4 text-gray-600">
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-800 text-[10px] md:text-sm uppercase tracking-wide">Phone</span>
                  <a href="tel:+971585487665" className="text-primary-600 hover:text-primary-700 text-xs md:text-base">+971 58 548 76 65</a>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-800 text-[10px] md:text-sm uppercase tracking-wide">Email</span>
                  <a href="mailto:sales@genosys.ae" className="text-primary-600 hover:text-primary-700 text-xs md:text-base">sales@genosys.ae</a>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-800 text-[10px] md:text-sm uppercase tracking-wide">Website</span>
                  <a href="https://genosys.ae" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700 text-xs md:text-base">genosys.ae</a>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-800 text-[10px] md:text-sm uppercase tracking-wide">Instagram</span>
                  <a href="https://www.instagram.com/genosys.uae/" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700 text-xs md:text-base">@genosys.uae</a>
                </div>
              </div>
            </div>
            
            {/* Business Information */}
            <div>
              <h3 className="text-sm md:text-xl font-semibold text-gray-800 mb-2 md:mb-6 pb-1 md:pb-2 border-b border-gray-200">Business</h3>
              <div className="space-y-1 md:space-y-4 text-gray-600">
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-800 text-[10px] md:text-sm uppercase tracking-wide">Distributor</span>
                  <span className="text-xs md:text-base">DTSMG Co., Ltd, Korea</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-800 text-[10px] md:text-sm uppercase tracking-wide">Certification</span>
                  <span className="text-xs md:text-base">Dubai Municipality</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-800 text-[10px] md:text-sm uppercase tracking-wide">Products</span>
                  <span className="text-xs md:text-base">Korean dermacosmetics</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-800 text-[10px] md:text-sm uppercase tracking-wide">Area</span>
                  <span className="text-xs md:text-base">UAE</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-white rounded-lg p-4 md:p-8 text-center border">
          <h2 className="text-lg md:text-3xl font-bold text-gray-800 mb-2 md:mb-4">Get in Touch</h2>
          <p className="text-xs md:text-base text-gray-600 mb-4 md:mb-6">
            Ready to discover our products? Contact us today!
          </p>
          <div className="flex flex-row gap-2 md:gap-4 justify-center">
            <Link 
              href="/products"
              className="bg-primary-600 text-white px-4 md:px-8 py-2 md:py-3 rounded-lg text-xs md:text-base font-semibold hover:bg-primary-700 transition-colors"
            >
              Products
            </Link>
            <Link 
              href="/contact-genosys-uae"
              className="border border-primary-600 text-primary-600 px-4 md:px-8 py-2 md:py-3 rounded-lg text-xs md:text-base font-semibold hover:bg-primary-50 transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}