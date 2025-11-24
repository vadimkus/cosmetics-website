import Link from 'next/link'
import { ArrowLeft, Clock, Truck, MapPin, Phone, Mail, Gift, RotateCcw } from 'lucide-react'
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
                Delivery
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
                Delivery
              </span>
            </div>
          </nav>

          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Delivery Information
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Fast and reliable delivery service across the UAE
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center mb-4">
                <Clock className="h-8 w-8 text-black mr-3" />
                <h2 className="text-2xl font-semibold text-gray-800">Delivery Time</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                We provide fast delivery services with <strong>1 hour delivery within Dubai</strong> and 
                <strong> 24-36 hours across UAE</strong>. Our commitment to efficient delivery ensures you receive 
                your premium Korean dermacosmetics products as quickly as possible.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center mb-4">
                <Truck className="h-8 w-8 text-black mr-3" />
                <h2 className="text-2xl font-semibold text-gray-800">Delivery Partner</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Delivery is done by <strong>Careem/QuipQup</strong> directly to your doorstep. 
                Our partnership with Careem and QuipQup ensures professional, reliable tracking, and safe delivery 
                of your beauty products throughout the UAE.
              </p>
            </div>
          </div>

          <div className="bg-primary-50 rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Delivery Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-primary-600 mr-3 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Service Area</h3>
                    <p className="text-gray-600">United Arab Emirates</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-primary-600 mr-3 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Delivery Time</h3>
                    <p className="text-gray-600">Within 1 hour of order placement across Dubai</p>
                    <p className="text-gray-600">Within 24-36 hours across UAE</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Truck className="h-5 w-5 text-primary-600 mr-3 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Delivery Partner</h3>
                    <p className="text-gray-600">Careem/QuipQup</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-primary-600 mr-3 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Delivery Type</h3>
                    <p className="text-gray-600">Direct to doorstep</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Free Shipping Section */}
          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-8 mb-8">
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Gift className="h-10 w-10 text-green-600" />
                <h2 className="text-3xl font-bold text-gray-800">Free Shipping Offer</h2>
              </div>
              <p className="text-xl text-black mb-6">
                Enjoy FREE DELIVERY on all orders above 1,000 AED
              </p>
              <div className="bg-white rounded-lg p-6 max-w-md mx-auto">
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">1,000 AED+</div>
                  <div className="text-2xl font-semibold text-green-600">FREE DELIVERY</div>
                </div>
              </div>
              <p className="text-gray-600 mt-6 max-w-2xl mx-auto">
                No minimum order restrictions, no hidden fees. Simply place an order worth 1,000 AED or more 
                and enjoy complimentary delivery service across the United Arab Emirates.
              </p>
            </div>
          </div>

          {/* Return Policy Section */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-8 mb-8">
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <RotateCcw className="h-10 w-10 text-blue-600" />
                <h2 className="text-3xl font-bold text-gray-800">Return Policy</h2>
              </div>
              <p className="text-xl text-black mb-6">
                We accept returns for your peace of mind
              </p>
              <div className="bg-white rounded-lg p-6 max-w-4xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <RotateCcw className="h-5 w-5 text-blue-600 mr-3 mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-1">Return Period</h3>
                        <p className="text-gray-600">10 days from delivery date</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Clock className="h-5 w-5 text-blue-600 mr-3 mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-1">Processing Time</h3>
                        <p className="text-gray-600">3-5 business days for refund processing</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <Gift className="h-5 w-5 text-blue-600 mr-3 mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-1">Condition</h3>
                        <p className="text-gray-600">Items must be unused and in original packaging</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Truck className="h-5 w-5 text-blue-600 mr-3 mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-1">Return Process</h3>
                        <p className="text-gray-600">Contact us to initiate return process</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-gray-700 text-center">
                    <strong>We accept returns</strong> - Your satisfaction is our priority. If you&apos;re not completely satisfied with your purchase, 
                    we&apos;re here to help make it right.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Need Help with Your Order?</h2>
            <p className="text-gray-600 mb-6">
              Contact us for assistance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="https://wa.me/971585487665"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                <Phone className="mr-2 h-5 w-5" />
                WhatsApp Support
              </a>
              <a 
                href="mailto:sales@genosys.ae"
                className="inline-flex items-center justify-center bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
              >
                <Mail className="mr-2 h-5 w-5" />
                Email Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
