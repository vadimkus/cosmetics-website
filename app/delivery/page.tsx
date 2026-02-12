import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'
import type { Metadata } from 'next'
import DeliveryPageClient from './DeliveryPageClient'

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
        url: 'https://genosys.ae/images/genosys-products.jpg',
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
    images: ['https://genosys.ae/images/genosys-products.jpg'],
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
    <>
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
      <DeliveryPageClient />
    </>
  )
}
