import Link from 'next/link'
import { ArrowLeft, Clock, Truck, Phone, Mail, Gift, RotateCcw } from 'lucide-react'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Delivery Information - Fast Shipping UAE | Genosys Middle East FZ-LLC',
  description: 'Fast and reliable delivery service across the UAE. 1 hour delivery in Dubai, 24-36 hours across UAE. Free shipping on orders above 1,000 AED.',
  keywords: 'delivery UAE, fast shipping Dubai, Careem delivery, QuipQup delivery, free shipping UAE, Korean cosmetics delivery',
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
  openGraph: {
    title: 'Delivery Information - Fast Shipping UAE',
    description: 'Fast and reliable delivery service across the UAE. 1 hour delivery in Dubai, 24-36 hours across UAE. Free shipping on orders above 1,000 AED.',
    type: 'website',
    url: 'https://genosys.ae/delivery',
    siteName: 'GENOSYS Middle East FZ-LLC',
    locale: 'en_AE',
    images: [
      {
        url: '/images/genosys-products.jpg',
        width: 1200,
        height: 630,
        alt: 'GENOSYS Delivery Service UAE',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@genosys_official',
    creator: '@genosys_official',
    title: 'Delivery Information - Fast Shipping UAE',
    description: 'Fast and reliable delivery service across the UAE. 1 hour delivery in Dubai, 24-36 hours across UAE.',
    images: ['/images/genosys-products.jpg'],
  },
  alternates: {
    canonical: 'https://genosys.ae/delivery',
    languages: {
      'en': 'https://genosys.ae/delivery',
      'ar': 'https://genosys.ae/ar/delivery',
      'ru': 'https://genosys.ae/ru/delivery',
    },
  },
}

export default function DeliveryPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is the delivery time for GENOSYS products in UAE?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We provide fast delivery services with 1 hour delivery within Dubai and 24-36 hours across UAE. Delivery is done by Careem/QuipQup directly to your doorstep."
        }
      },
      {
        "@type": "Question",
        "name": "Is there free shipping available?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, we offer FREE DELIVERY on all orders above 1,000 AED. No minimum order restrictions, no hidden fees. Simply place an order worth 1,000 AED or more and enjoy complimentary delivery service across the United Arab Emirates."
        }
      },
      {
        "@type": "Question",
        "name": "What is the return policy for GENOSYS products?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We accept returns within 10 days from delivery date. Items must be unused and in original packaging. Refund processing takes 3-5 business days. Contact us to initiate the return process."
        }
      },
      {
        "@type": "Question",
        "name": "Which delivery partners does GENOSYS use?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Delivery is done by Careem/QuipQup directly to your doorstep. Our partnership with Careem and QuipQup ensures professional, reliable tracking, and safe delivery of your beauty products throughout the UAE."
        }
      },
      {
        "@type": "Question",
        "name": "What areas do you deliver to?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We deliver across the entire United Arab Emirates, including Dubai, Abu Dhabi, Sharjah, and all other Emirates."
        }
      }
    ]
  }

  return (
    <div className="bg-white min-h-screen">
      <BreadcrumbSchema 
        items={[
          { name: 'Home', url: '/' },
          { name: 'Delivery', url: '/delivery' }
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema, null, 2) }}
      />
      <div className="container mx-auto px-3 md:px-4 py-4 md:py-16">
        <div className="max-w-4xl mx-auto">

          {/* Navigation Breadcrumb */}
          <nav className="text-xs md:text-base text-gray-600 mb-2 md:mb-4" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-primary-600 transition-colors">Home</Link>
            <span> / </span>
            <span className="text-gray-900 font-medium">Delivery</span>
          </nav>
          
          {/* Back to Home */}
          <Link href="/" className="inline-flex items-center gap-1 text-xs md:text-sm text-primary-600 hover:text-primary-700 mb-4 md:mb-8">
            <ArrowLeft className="h-3 w-3 md:h-4 md:w-4" />
            <span>Back to Home</span>
          </Link>

          {/* Header */}
          <div className="text-center mb-6 md:mb-12">
            <h1 className="text-xl md:text-5xl font-bold text-gray-800 mb-2 md:mb-6">
              Delivery Information
            </h1>
            <p className="text-sm md:text-xl text-gray-600 max-w-2xl mx-auto">
              Fast delivery across the UAE
            </p>
          </div>

          {/* Delivery Time & Partner */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-8 mb-4 md:mb-12">
            <div className="bg-white rounded-lg shadow-sm border p-3 md:p-6">
              <div className="flex items-center mb-2 md:mb-4">
                <Clock className="h-5 w-5 md:h-8 md:w-8 text-black mr-2 md:mr-3" />
                <h2 className="text-sm md:text-2xl font-semibold text-gray-800">Delivery Time</h2>
              </div>
              <p className="text-xs md:text-base text-gray-600 leading-relaxed">
                <strong>1 hour in Dubai</strong>, <strong>24-36 hours across UAE</strong>
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-3 md:p-6">
              <div className="flex items-center mb-2 md:mb-4">
                <Truck className="h-5 w-5 md:h-8 md:w-8 text-black mr-2 md:mr-3" />
                <h2 className="text-sm md:text-2xl font-semibold text-gray-800">Delivery Partner</h2>
              </div>
              <p className="text-xs md:text-base text-gray-600 leading-relaxed">
                <strong>Careem/QuipQup</strong> - Direct to doorstep
              </p>
            </div>
          </div>

          {/* Delivery Details */}
          <div className="bg-primary-50 rounded-lg p-3 md:p-8 mb-3 md:mb-8">
            <h2 className="text-sm md:text-2xl font-semibold text-gray-800 mb-3 md:mb-6 text-center">Delivery Details</h2>
            <div className="grid grid-cols-2 gap-2 md:gap-6 text-xs md:text-base">
              <div><span className="font-semibold text-gray-800">Area:</span> UAE</div>
              <div><span className="font-semibold text-gray-800">Partner:</span> Careem/QuipQup</div>
              <div><span className="font-semibold text-gray-800">Dubai:</span> 1 hour</div>
              <div><span className="font-semibold text-gray-800">UAE:</span> 24-36 hours</div>
            </div>
          </div>

          {/* Free Shipping Section */}
          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-3 md:p-8 mb-3 md:mb-8">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 md:gap-3 mb-2 md:mb-4">
                <Gift className="h-6 w-6 md:h-10 md:w-10 text-green-600" />
                <h2 className="text-base md:text-3xl font-bold text-gray-800">Free Shipping</h2>
              </div>
              <div className="bg-white rounded-lg p-3 md:p-6 max-w-md mx-auto">
                <div className="text-center">
                  <div className="text-2xl md:text-4xl font-bold text-green-600 mb-1">1,000 AED+</div>
                  <div className="text-sm md:text-2xl font-semibold text-green-600">FREE DELIVERY</div>
                </div>
              </div>
              <p className="text-xs md:text-base text-gray-600 mt-3 md:mt-6">
                No minimum order, no hidden fees
              </p>
            </div>
          </div>

          {/* Return Policy Section */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-3 md:p-8 mb-3 md:mb-8">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 md:gap-3 mb-2 md:mb-4">
                <RotateCcw className="h-6 w-6 md:h-10 md:w-10 text-blue-600" />
                <h2 className="text-base md:text-3xl font-bold text-gray-800">Return Policy</h2>
              </div>
              <div className="bg-white rounded-lg p-3 md:p-6">
                <div className="grid grid-cols-2 gap-2 md:gap-4 text-xs md:text-base text-left">
                  <div><span className="font-semibold text-gray-800">Period:</span> 10 days</div>
                  <div><span className="font-semibold text-gray-800">Refund:</span> 3-5 days</div>
                  <div><span className="font-semibold text-gray-800">Condition:</span> Unused, original packaging</div>
                  <div><span className="font-semibold text-gray-800">Process:</span> Contact us</div>
                </div>
              </div>
            </div>
          </div>

          {/* Help Section */}
          <div className="bg-white rounded-lg shadow-sm border p-3 md:p-8 text-center">
            <h2 className="text-sm md:text-2xl font-semibold text-gray-800 mb-2 md:mb-4">Need Help?</h2>
            <div className="flex flex-row gap-2 md:gap-4 justify-center">
              <a 
                href="https://wa.me/971585487665"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-green-600 text-white px-3 md:px-6 py-2 md:py-3 rounded-lg text-xs md:text-base font-semibold hover:bg-green-700 transition-colors"
              >
                <Phone className="mr-1 md:mr-2 h-4 w-4 md:h-5 md:w-5" />
                WhatsApp
              </a>
              <a 
                href="mailto:sales@genosys.ae"
                className="inline-flex items-center justify-center bg-primary-600 text-white px-3 md:px-6 py-2 md:py-3 rounded-lg text-xs md:text-base font-semibold hover:bg-primary-700 transition-colors"
              >
                <Mail className="mr-1 md:mr-2 h-4 w-4 md:h-5 md:w-5" />
                Email
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
