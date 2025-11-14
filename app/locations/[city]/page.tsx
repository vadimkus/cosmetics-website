import Link from 'next/link'
import { MapPin, Phone, Mail, Truck, ArrowLeft, Instagram, Globe } from 'lucide-react'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'
import type { Metadata } from 'next'

const locations: Record<string, {
  name: string
  title: string
  description: string
  address: string
  phone: string
  email: string
  instagram?: string
  website?: string
  shippingInfo: string
  shippingCost: string
  deliveryTime: string
  coordinates?: { lat: number; lng: number }
}> = {
  dubai: {
    name: 'Dubai',
    title: 'GENOSYS Dubai - Korean Dermacosmetics Distributor in Dubai',
    description: 'GENOSYS Middle East FZ-LLC serves Dubai with professional Korean dermacosmetics and skincare training. Fast delivery across Dubai with free shipping for orders over 1000 AED.',
    address: 'Cordoba Residence, Villa E02, Dubai, United Arab Emirates',
    phone: '+971 58 548 76 65',
    email: 'sales@genosys.ae',
    instagram: 'https://www.instagram.com/genosys.me',
    website: 'https://genosys.ae',
    shippingInfo: 'We deliver to all areas of Dubai including Downtown Dubai, Dubai Marina, Jumeirah, Business Bay, and more.',
    shippingCost: '45 AED (Free for orders over 1000 AED)',
    deliveryTime: '1-2 hours, same day (Careem)',
    coordinates: { lat: 25.2048, lng: 55.2708 }
  },
  'abu-dhabi': {
    name: 'Abu Dhabi',
    title: 'GENOSYS Abu Dhabi - Korean Dermacosmetics Distributor in Abu Dhabi',
    description: 'GENOSYS Middle East FZ-LLC delivers professional Korean dermacosmetics to Abu Dhabi. Premium skincare products and microneedling devices available with fast delivery.',
    address: 'Serving all areas of Abu Dhabi',
    phone: '+971 58 548 76 65',
    email: 'sales@genosys.ae',
    instagram: 'https://www.instagram.com/genosys.me',
    website: 'https://genosys.ae',
    shippingInfo: 'We deliver to all areas of Abu Dhabi including Al Khalidiyah, Al Markaziyah, Al Zahiyah, Corniche, and more.',
    shippingCost: '70 AED (Free for orders over 1000 AED)',
    deliveryTime: '48 hours via Quiqup',
    coordinates: { lat: 24.4539, lng: 54.3773 }
  },
  sharjah: {
    name: 'Sharjah',
    title: 'GENOSYS Sharjah - Korean Dermacosmetics Distributor in Sharjah',
    description: 'GENOSYS Middle East FZ-LLC provides professional Korean dermacosmetics to Sharjah. Quality skincare products and professional training available.',
    address: 'Serving all areas of Sharjah',
    phone: '+971 58 548 76 65',
    email: 'sales@genosys.ae',
    shippingInfo: 'We deliver to all areas of Sharjah including Al Qasimia, Al Nahda, Al Majaz, Al Khan, and more.',
    shippingCost: '70 AED (Free for orders over 1000 AED)',
    deliveryTime: '1-2 hours, same day (Careem)',
    coordinates: { lat: 25.3573, lng: 55.4033 }
  },
  'ras-al-khaimah': {
    name: 'Ras Al Khaimah',
    title: 'GENOSYS Ras Al Khaimah - Korean Dermacosmetics Distributor',
    description: 'GENOSYS Middle East FZ-LLC serves Ras Al Khaimah with professional Korean dermacosmetics. Our office is located in Ras Al Khaimah.',
    address: 'MBAM0014 Compass Building, Al Shohada Road, AL Hamra Industrial Zone-FZ, Ras Al Khaimah, UAE',
    phone: '+971 58 548 76 65',
    email: 'sales@genosys.ae',
    shippingInfo: 'We deliver to all areas of Ras Al Khaimah including Al Nakheel, Al Qawasim, Al Hamra, and more.',
    shippingCost: '70 AED (Free for orders over 1000 AED)',
    deliveryTime: '48 hours via Quiqup',
    coordinates: { lat: 25.7895, lng: 55.9590 }
  },
  ajman: {
    name: 'Ajman',
    title: 'GENOSYS Ajman - Korean Dermacosmetics Distributor in Ajman',
    description: 'GENOSYS Middle East FZ-LLC delivers professional Korean dermacosmetics to Ajman. Premium skincare products available with reliable delivery.',
    address: 'Serving all areas of Ajman',
    phone: '+971 58 548 76 65',
    email: 'sales@genosys.ae',
    shippingInfo: 'We deliver to all areas of Ajman including Al Nuaimiya, Al Jerf, Al Rashidiya, and more.',
    shippingCost: '70 AED (Free for orders over 1000 AED)',
    deliveryTime: '48 hours via Quiqup',
  },
  fujairah: {
    name: 'Fujairah',
    title: 'GENOSYS Fujairah - Korean Dermacosmetics Distributor in Fujairah',
    description: 'GENOSYS Middle East FZ-LLC provides professional Korean dermacosmetics to Fujairah. Quality skincare products delivered across the emirate.',
    address: 'Serving all areas of Fujairah',
    phone: '+971 58 548 76 65',
    email: 'sales@genosys.ae',
    shippingInfo: 'We deliver to all areas of Fujairah including Fujairah City, Al Faseel, and surrounding areas.',
    shippingCost: '70 AED (Free for orders over 1000 AED)',
    deliveryTime: '48 hours via Quiqup',
  },
  'umm-al-quwain': {
    name: 'Umm Al Quwain',
    title: 'GENOSYS Umm Al Quwain - Korean Dermacosmetics Distributor',
    description: 'GENOSYS Middle East FZ-LLC serves Umm Al Quwain with professional Korean dermacosmetics. Premium skincare products delivered across the emirate.',
    address: 'Serving all areas of Umm Al Quwain',
    phone: '+971 58 548 76 65',
    email: 'sales@genosys.ae',
    shippingInfo: 'We deliver to all areas of Umm Al Quwain including Umm Al Quwain City and surrounding areas.',
    shippingCost: '70 AED (Free for orders over 1000 AED)',
    deliveryTime: '48 hours via Quiqup',
  },
}

interface LocationPageProps {
  params: Promise<{ city: string }>
}

export async function generateMetadata({ params }: LocationPageProps): Promise<Metadata> {
  const { city } = await params
  const location = locations[city]
  
  if (!location) {
    return {
      title: 'Location Not Found | GENOSYS Middle East FZ-LLC',
    }
  }

  return {
    title: `${location.title} | GENOSYS Middle East FZ-LLC`,
    description: location.description,
    keywords: `GENOSYS ${location.name}, Korean dermacosmetics ${location.name}, professional skincare ${location.name}, GENOSYS distributor ${location.name}`,
    openGraph: {
      title: location.title,
      description: location.description,
      type: 'website',
      images: [
        {
          url: '/images/genosys-products.jpg',
          width: 1200,
          height: 630,
          alt: `GENOSYS ${location.name}`,
        },
      ],
    },
    alternates: {
      canonical: `https://genosys.ae/locations/${city}`,
    },
  }
}

export async function generateStaticParams() {
  return Object.keys(locations).map((city) => ({
    city,
  }))
}

export default async function LocationPage({ params }: LocationPageProps) {
  const { city } = await params
  const location = locations[city]

  if (!location) {
    return (
      <div className="bg-white min-h-screen">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Location Not Found</h1>
            <p className="text-gray-600 mb-8">The requested location could not be found.</p>
            <Link href="/" className="text-primary-600 hover:text-primary-700">
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white min-h-screen">
      <BreadcrumbSchema 
        items={[
          { name: 'Home', url: '/' },
          { name: 'Locations', url: '/locations' },
          { name: location.name, url: `/locations/${city}` }
        ]}
      />
      
      {/* LocalBusiness Schema for this location */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": `GENOSYS Middle East FZ-LLC - ${location.name}`,
            "description": location.description,
            "address": {
              "@type": "PostalAddress",
              "addressLocality": location.name,
              "addressRegion": location.name,
              "addressCountry": "AE"
            },
            "telephone": location.phone,
            "email": location.email,
            "areaServed": {
              "@type": "City",
              "name": location.name
            },
            "url": `https://genosys.ae/locations/${city}`
          }, null, 2)
        }}
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
              <Link 
                href="/locations"
                className="hover:text-primary-600 transition-colors flex items-center"
              >
                Locations
              </Link>
              <span className="flex items-center">/</span>
              <span className="text-gray-900 font-medium flex items-center">
                {location.name}
              </span>
            </div>
            
            {/* Mobile Back Button */}
            <Link 
              href="/locations"
              className="md:hidden flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="font-medium">Back to Locations</span>
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
                href="/locations"
                className="hover:text-primary-600 transition-colors flex items-center"
              >
                Locations
              </Link>
              <span className="flex items-center">/</span>
              <span className="text-gray-900 font-medium flex items-center">
                {location.name}
              </span>
            </div>
          </nav>

          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              GENOSYS {location.name}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {location.description}
            </p>
          </div>

          {/* Location Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Contact Information */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <MapPin className="h-6 w-6 text-primary-600" />
                Contact Information
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Address</h3>
                  <p className="text-gray-600">{location.address}</p>
                </div>
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Phone className="h-5 w-5 text-primary-600" />
                      <a href={`tel:${location.phone.replace(/\s/g, '')}`} className="text-primary-600 hover:text-primary-700 font-medium">
                        {location.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-5 w-5 text-primary-600" />
                      <a href={`mailto:${location.email}`} className="text-primary-600 hover:text-primary-700 font-medium">
                        {location.email}
                      </a>
                    </div>
                  </div>
                </div>
                {(location.instagram || location.website) && (
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      {location.instagram && (
                        <div className="flex items-center gap-2">
                          <Instagram className="h-5 w-5 text-primary-600" />
                          <a 
                            href={location.instagram} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                          >
                            {location.instagram.replace('https://www.instagram.com/', '@').replace('https://instagram.com/', '@')}
                            <span className="text-xs">↗</span>
                          </a>
                        </div>
                      )}
                      {location.website && (
                        <div className="flex items-center gap-2">
                          <Globe className="h-5 w-5 text-primary-600" />
                          <a 
                            href={location.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                          >
                            {location.website.replace('https://', '').replace('http://', '')}
                            <span className="text-xs">↗</span>
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Shipping Information */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <Truck className="h-6 w-6 text-primary-600" />
                Shipping Information
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Delivery Areas</h3>
                  <p className="text-gray-600">{location.shippingInfo}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Shipping Cost</h3>
                  <p className="text-gray-600">{location.shippingCost}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Delivery Time</h3>
                  <p className="text-gray-600">{location.deliveryTime}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Google Maps Link */}
          {location.coordinates && (
            <div className="mb-12">
              <a
                href={`https://maps.google.com/?q=${location.coordinates.lat},${location.coordinates.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-primary-600 text-white p-4 rounded-lg hover:bg-primary-700 transition-colors text-center font-semibold"
              >
                View on Google Maps
              </a>
            </div>
          )}

          {/* Call to Action */}
          <div className="bg-primary-50 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Ready to Order?
            </h2>
            <p className="text-gray-600 mb-6">
              Browse our complete collection of professional Korean dermacosmetics products.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/products"
                className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
              >
                View Products
              </Link>
              <Link
                href="/contact-genosys-uae"
                className="border border-primary-600 text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

