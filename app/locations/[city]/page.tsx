import Link from 'next/link'
import { MapPin, Phone, Mail, Truck, ArrowLeft, Instagram, Globe, Award, FileText } from 'lucide-react'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'
import type { Metadata } from 'next'

interface AuthorizedReseller {
  name: string
  company: string
  phone: string
  territory: string
  certificateUrl: string
  validUntil: string
}

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
  authorizedReseller?: AuthorizedReseller
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
    name: 'Abu Dhabi & Al Ain',
    title: 'GENOSYS Abu Dhabi & Al Ain - Korean Dermacosmetics Distributor',
    description: 'GENOSYS Middle East FZ-LLC delivers professional Korean dermacosmetics to Abu Dhabi and Al Ain. Premium skincare products and microneedling devices available through our exclusive authorized reseller.',
    address: 'Serving all areas of Abu Dhabi and Al Ain',
    phone: '+971 58 548 76 65',
    email: 'sales@genosys.ae',
    instagram: 'https://www.instagram.com/genosys.me',
    website: 'https://genosys.ae',
    shippingInfo: 'We deliver to all areas of Abu Dhabi including Al Khalidiyah, Al Markaziyah, Al Zahiyah, Corniche, and all areas of Al Ain.',
    shippingCost: '30 AED (Free for orders over 1000 AED)',
    deliveryTime: '24 hours via Quiqup',
    coordinates: { lat: 24.4539, lng: 54.3773 },
    authorizedReseller: {
      name: 'Abeer Mekki',
      company: 'ABEER MEKKI BEAUTY LADIES CENTER - L.L.C - S.P.C',
      phone: '+971 55 671 75 64',
      territory: 'Al Ain & Abu Dhabi',
      certificateUrl: '/documents/GENOSYS_Authorized_Reseller_ABEER_MEKKI.pdf',
      validUntil: 'January 20, 2027'
    }
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
    keywords: [
      `GENOSYS ${location.name}`,
      `Korean dermacosmetics ${location.name}`,
      `professional skincare ${location.name}`,
      `GENOSYS distributor ${location.name}`
    ],
    openGraph: {
      title: location.title,
      description: location.description,
      type: 'website',
      url: `https://genosys.ae/locations/${city}`,
      siteName: 'GENOSYS Middle East FZ-LLC',
      locale: 'en_AE',
      images: [
        {
          url: '/images/genosys-products.jpg',
          width: 1200,
          height: 630,
          alt: `GENOSYS ${location.name}`,
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
      title: location.title,
      description: location.description,
      images: ['/images/genosys-products.jpg'],
    },
    alternates: {
      canonical: `https://genosys.ae/locations/${city}`,
      languages: {
        'en': `https://genosys.ae/locations/${city}`,
        'ar': `https://genosys.ae/ar/locations/${city}`,
        'ru': `https://genosys.ae/ru/locations/${city}`,
      },
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

          {/* Authorized Reseller Section */}
          {location.authorizedReseller && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6 md:p-8 mb-12 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-amber-100 rounded-full p-3">
                  <Award className="h-7 w-7 text-amber-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Official Exclusive Authorized Reseller
                  </h2>
                  <p className="text-amber-700 font-medium">{location.authorizedReseller.territory}</p>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-6 border border-amber-100">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {location.authorizedReseller.company}
                      </h3>
                      <p className="text-gray-600 mt-1">
                        Certified GENOSYS Professional • Valid until {location.authorizedReseller.validUntil}
                      </p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                      <a 
                        href={`tel:${location.authorizedReseller.phone.replace(/\s/g, '')}`}
                        className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold text-lg"
                      >
                        <Phone className="h-5 w-5" />
                        {location.authorizedReseller.phone}
                      </a>
                      <a 
                        href={`https://wa.me/${location.authorizedReseller.phone.replace(/\s/g, '').replace('+', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors font-medium"
                      >
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                        WhatsApp
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0">
                    <a
                      href={location.authorizedReseller.certificateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-amber-600 text-white px-5 py-3 rounded-lg hover:bg-amber-700 transition-colors font-semibold shadow-md"
                    >
                      <FileText className="h-5 w-5" />
                      View Certificate
                    </a>
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-amber-800 mt-4 text-center">
                This reseller is officially authorized by Genosys Middle East FZ-LLC to exclusively distribute GENOSYS products in {location.authorizedReseller.territory}.
              </p>
            </div>
          )}

          {/* Location Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Contact Information */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <MapPin className="h-6 w-6 text-primary-600" />
                {location.authorizedReseller ? 'Genosys Middle East (Distributor)' : 'Contact Information'}
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

