import Link from 'next/link'
import { MapPin, ArrowLeft } from 'lucide-react'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'GENOSYS Locations - Serving All UAE Emirates | Genosys Middle East FZ-LLC',
  description: 'GENOSYS Middle East FZ-LLC delivers professional Korean dermacosmetics to all UAE emirates: Dubai, Abu Dhabi, Sharjah, Ajman, Ras Al Khaimah, Fujairah, and Umm Al Quwain.',
  keywords: 'GENOSYS locations UAE, Korean dermacosmetics Dubai, GENOSYS Abu Dhabi, GENOSYS Sharjah, UAE skincare delivery',
  openGraph: {
    title: 'GENOSYS Locations - Serving All UAE Emirates',
    description: 'GENOSYS Middle East FZ-LLC delivers professional Korean dermacosmetics to all UAE emirates.',
    type: 'website',
    images: [
      {
        url: '/images/genosys-products.jpg',
        width: 1200,
        height: 630,
        alt: 'GENOSYS Locations UAE',
      },
    ],
  },
  alternates: {
    canonical: 'https://genosys.ae/locations',
  },
}

const locations = [
  {
    slug: 'dubai',
    name: 'Dubai',
    description: 'Our office/warehouse is located in Dubai.',
    shippingCost: '45 AED',
    deliveryTime: '1-2 hours, same day (Careem)',
  },
  {
    slug: 'abu-dhabi',
    name: 'Abu Dhabi',
    description: 'Professional Korean dermacosmetics delivered to all areas of Abu Dhabi',
    shippingCost: '70 AED',
    deliveryTime: '48 hours via Quiqup',
  },
  {
    slug: 'sharjah',
    name: 'Sharjah',
    description: 'Quality skincare products and professional training available in Sharjah',
    shippingCost: '70 AED',
    deliveryTime: '1-2 hours, same day (Careem)',
  },
  {
    slug: 'ras-al-khaimah',
    name: 'Ras Al Khaimah',
    description: 'Our office is located in Ras Al Khaimah.',
    shippingCost: '70 AED',
    deliveryTime: '48 hours via Quiqup',
  },
  {
    slug: 'ajman',
    name: 'Ajman',
    description: 'Reliable delivery of premium Korean dermacosmetics to Ajman',
    shippingCost: '70 AED',
    deliveryTime: '48 hours via Quiqup',
  },
  {
    slug: 'fujairah',
    name: 'Fujairah',
    description: 'Quality skincare products delivered across Fujairah',
    shippingCost: '70 AED',
    deliveryTime: '48 hours via Quiqup',
  },
  {
    slug: 'umm-al-quwain',
    name: 'Umm Al Quwain',
    description: 'Premium skincare products delivered across Umm Al Quwain',
    shippingCost: '70 AED',
    deliveryTime: '48 hours via Quiqup',
  },
]

export default function LocationsPage() {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <BreadcrumbSchema 
        items={[
          { name: 'Home', url: '/' },
          { name: 'Locations', url: '/locations' }
        ]}
      />
      
      <div className="container mx-auto px-3 md:px-4 py-4 md:py-16">
        <div className="max-w-6xl mx-auto">
          {/* Navigation Breadcrumb */}
          <nav className="text-xs md:text-base text-gray-600 mb-2 md:mb-4" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-primary-600 transition-colors">Home</Link>
            <span> / </span>
            <span className="text-gray-900 font-medium">Locations</span>
          </nav>
          
          {/* Back to Home */}
          <Link href="/" className="inline-flex items-center gap-1 text-xs md:text-sm text-primary-600 hover:text-primary-700 mb-4 md:mb-8">
            <ArrowLeft className="h-3 w-3 md:h-4 md:w-4" />
            <span>Back to Home</span>
          </Link>

          {/* Page Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6">
              <MapPin className="h-8 w-8 text-primary-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Our Locations
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              GENOSYS Middle East FZ-LLC delivers professional Korean dermacosmetics to all 7 UAE emirates
            </p>
          </div>

          {/* Locations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {locations.map((location) => (
              <Link
                key={location.slug}
                href={`/locations/${location.slug}`}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-200 group"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-primary-100 rounded-full p-3 group-hover:bg-primary-600 transition-colors">
                    <MapPin className="h-6 w-6 text-primary-600 group-hover:text-white transition-colors" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-primary-600 transition-colors">
                      {location.name}
                    </h2>
                    <p className="text-gray-600 text-sm mb-3">
                      {location.description}
                    </p>
                    <div className="flex flex-col gap-1 text-xs text-gray-500">
                      <span className="font-medium">Shipping: <span className="text-gray-700">{location.shippingCost}</span></span>
                      <span className="font-medium">Delivery: <span className="text-gray-700">{location.deliveryTime}</span></span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* General Information */}
          <div className="bg-gradient-to-r from-primary-50 to-red-50 rounded-xl p-8 border border-primary-100 shadow-sm">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                Free Shipping Available
              </h2>
              <p className="text-gray-600 mb-6 max-w-xl mx-auto">
                All orders over 1000 AED qualify for free shipping across all UAE emirates. 
                We deliver professional Korean dermacosmetics products with reliable and fast service via Careem and Quiqup.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/products"
                  className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors text-center shadow-md hover:shadow-lg"
                >
                  Browse Products
                </Link>
                <Link
                  href="/contact-genosys-uae"
                  className="border border-primary-600 text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-white transition-colors text-center shadow-md hover:shadow-lg"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

