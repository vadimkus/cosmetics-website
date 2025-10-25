import type { Metadata } from 'next'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'
import { Building } from 'lucide-react'
import Image from 'next/image'

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
                Building strong partnerships across the UAE and Middle East
              </p>
            </div>
            
            {/* Featured Partners */}
            <div className="mb-8">
              
              {/* UNIQUE PERSONA */}
              <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl shadow-lg border border-pink-200 p-6 mb-8">
                <div className="flex flex-col lg:flex-row items-center gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg border border-pink-200">
                      <Image
                        src="/images/partners/Persona.png"
                        alt="UNIQUE PERSONA DUBAI MARINA Logo"
                        width={50}
                        height={50}
                        className="object-contain"
                      />
                    </div>
                  </div>
                  <div className="flex-1 text-center lg:text-left">
                    <h3 className="text-xl font-bold text-gray-800 mb-1">UNIQUE PERSONA DUBAI MARINA</h3>
                    <p className="text-base text-gray-600 mb-2">Beauty & Aesthetic Center</p>
                    <p className="text-sm text-gray-600 mb-3">
                      Professional beauty salon offering comprehensive skincare and aesthetic services in Dubai Marina
                    </p>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center justify-center lg:justify-start gap-2">
                        <Building className="h-4 w-4 text-pink-600" />
                        <span>The Residences at Marina Gate 1, Dubai Marina</span>
                      </div>
                      <div className="flex items-center justify-center lg:justify-start gap-2">
                        <span className="text-pink-600">📞</span>
                        <a href="tel:+971529481238" className="hover:text-pink-600 transition-colors">
                          +971 52 948 1238
                        </a>
                      </div>
                      <div className="flex items-center justify-center lg:justify-start gap-2">
                        <span className="text-pink-600">🌐</span>
                        <a 
                          href="https://persona-dubai.com/eng" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:text-pink-600 transition-colors"
                        >
                          persona-dubai.com
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <a 
                      href="https://www.google.com/maps/dir//The+Residences+at+Marina+Gate+1+-+Dubai+-+%D0%9E%D0%90%D0%AD/@25.086284,55.1398907,14.76z/data=!4m8!4m7!1m0!1m5!1m1!1s0x3e5f6bdd6fb9a655:0x9d88db1312e9d2e3!2m2!1d55.147257!2d25.0862329?entry=ttu&g_ep=EgoyMDI1MTAyMi4wIKXMDSoASAFQAw%3D%3D"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center bg-pink-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-pink-700 transition-colors"
                    >
                      📍 Directions
                    </a>
                    <a 
                      href="https://persona-dubai.com/eng"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center border border-pink-600 text-pink-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-pink-50 transition-colors"
                    >
                      Website
                    </a>
                  </div>
                </div>
              </div>

              {/* FACE ROOM */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-lg border border-blue-200 p-6 mb-8">
                <div className="flex flex-col lg:flex-row items-center gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg border border-blue-200">
                      <Image
                        src="/images/partners/logo-faceroom.png"
                        alt="FACE ROOM DUBAI MARINA Logo"
                        width={50}
                        height={50}
                        className="object-contain"
                      />
                    </div>
                  </div>
                  <div className="flex-1 text-center lg:text-left">
                    <h3 className="text-xl font-bold text-gray-800 mb-1">FACE ROOM DUBAI MARINA</h3>
                    <p className="text-base text-gray-600 mb-2">Facial Care & Massage Studio</p>
                    <p className="text-sm text-gray-600 mb-3">
                      Professional facial massage and cosmetology services with unique techniques for skin care and relaxation
                    </p>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center justify-center lg:justify-start gap-2">
                        <Building className="h-4 w-4 text-blue-600" />
                        <span>The Residences at Marina Gate 2, Dubai Marina</span>
                      </div>
                      <div className="flex items-center justify-center lg:justify-start gap-2">
                        <span className="text-blue-600">📞</span>
                        <a href="tel:+971528290457" className="hover:text-blue-600 transition-colors">
                          +971 52 829 0457
                        </a>
                      </div>
                      <div className="flex items-center justify-center lg:justify-start gap-2">
                        <span className="text-blue-600">🌐</span>
                        <a 
                          href="https://face-rooms.com/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:text-blue-600 transition-colors"
                        >
                          face-rooms.com
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <a 
                      href="https://www.google.com/maps/search/The+Residences+at+Marina+Gate+2+Dubai+Marina"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
                    >
                      📍 Directions
                    </a>
                    <a 
                      href="https://face-rooms.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center border border-blue-600 text-blue-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-50 transition-colors"
                    >
                      Website
                    </a>
                  </div>
                </div>
              </div>

              {/* SHAKIROVNA LADIES BEAUTY SALOON */}
              <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl shadow-lg border border-purple-200 p-6">
                <div className="flex flex-col lg:flex-row items-center gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg border border-purple-200">
                      <Image
                        src="/images/partners/Shakirovna.png"
                        alt="Shakirovna Ladies Beauty Saloon Logo"
                        width={50}
                        height={50}
                        className="object-contain"
                      />
                    </div>
                  </div>
                  <div className="flex-1 text-center lg:text-left">
                    <h3 className="text-xl font-bold text-gray-800 mb-1">SHAKIROVNA LADIES BEAUTY SALOON</h3>
                    <p className="text-base text-gray-600 mb-2">Ladies Beauty Salon</p>
                    <p className="text-sm text-gray-600 mb-3">
                      Professional beauty services for women with expert care and attention to detail in Jumeirah Beach Residence
                    </p>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center justify-center lg:justify-start gap-2">
                        <Building className="h-4 w-4 text-purple-600" />
                        <span>Jumeirah Beach Residence 2, Marina Wharf 1</span>
                      </div>
                      <div className="flex items-center justify-center lg:justify-start gap-2">
                        <span className="text-purple-600">📞</span>
                        <a href="tel:+971504099407" className="hover:text-purple-600 transition-colors">
                          +971 50 409 9407
                        </a>
                      </div>
                      <div className="flex items-center justify-center lg:justify-start gap-2">
                        <span className="text-purple-600">🌐</span>
                        <a 
                          href="https://shakirovna.com/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:text-purple-600 transition-colors"
                        >
                          shakirovna.com
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <a 
                      href="https://www.google.com/maps?rlz=1C5CHFA_enAE820AE820&um=1&ie=UTF-8&fb=1&gl=es&sa=X&geocode=KS37CzxUE18-MV_-F9n4c6n1&daddr=Marina+Promenade+-+Marsa+Dubai+-+Dubai+Marina+-+Dubai+-+%D0%9E%D0%90%D0%AD"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple-700 transition-colors"
                    >
                      📍 Directions
                    </a>
                    <a 
                      href="https://shakirovna.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center border border-purple-600 text-purple-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple-50 transition-colors"
                    >
                      Website
                    </a>
                  </div>
                </div>
              </div>
            </div>


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
