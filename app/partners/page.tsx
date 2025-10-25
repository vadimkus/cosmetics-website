import type { Metadata } from 'next'
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
          {/* Navigation Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm md:text-base text-gray-600 mb-8" aria-label="Breadcrumb">
            <a href="/" className="hover:text-primary-600 transition-colors flex items-center">
              Home
            </a>
            <span className="flex items-center">/</span>
            <span className="text-gray-900 font-medium flex items-center">
              Partners
            </span>
          </nav>

          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-4">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Our Partners
              </h1>
              <p className="text-lg text-gray-600 mb-4">
                Building strong partnerships across the United Arab Emirates
              </p>
            </div>
            
            <PartnersList />

            {/* Call to Action */}
            <div className="mt-12 text-center">
              <div className="bg-gradient-to-r from-primary-50 to-red-50 rounded-xl p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Interested in Becoming a Partner?
                </h2>
                <p className="text-gray-600 mb-6">
                  Join our network of trusted partners and help us bring GENOSYS products to more customers
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a 
                    href="/contact-genosys-uae"
                    className="inline-flex items-center bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                  >
                    Contact Us
                  </a>
                  <a 
                    href="/products"
                    className="inline-flex items-center border border-primary-600 text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
                  >
                    View Products
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}