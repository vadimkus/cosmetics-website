import type { Metadata } from 'next'
import ContactClient from './ContactClient'

export const metadata: Metadata = {
  title: 'Contact GENOSYS Middle East FZ-LLC - Get in Touch | Genosys.ae',
  description: 'Contact GENOSYS Middle East FZ-LLC for professional Korean dermacosmetics. Phone: +971 58 548 76 65, Email: sales@genosys.ae. Located in Dubai, UAE.',
  keywords: 'contact GENOSYS, UAE cosmetics contact, Korean dermacosmetics UAE, Dubai skincare distributor, GENOSYS phone number',
  openGraph: {
    title: 'Contact GENOSYS Middle East FZ-LLC - Get in Touch',
    description: 'Contact GENOSYS Middle East FZ-LLC for professional Korean dermacosmetics. Phone: +971 58 548 76 65, Email: sales@genosys.ae.',
    type: 'website',
    url: 'https://genosys.ae/contact',
    siteName: 'GENOSYS',
    locale: 'en_AE',
    images: [
      {
        url: 'https://genosys.ae/images/genosys-logo.png',
        width: 400,
        height: 400,
        alt: 'GENOSYS Middle East FZ-LLC Contact',
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
    title: 'Contact GENOSYS Middle East FZ-LLC - Get in Touch',
    description: 'Contact GENOSYS Middle East FZ-LLC for professional Korean dermacosmetics. Phone: +971 58 548 76 65, Email: sales@genosys.ae.',
    images: ['https://genosys.ae/images/genosys-logo.png'],
  },
  alternates: {
    canonical: 'https://genosys.ae/contact',
    languages: {
      'en': 'https://genosys.ae/contact',
      'ar': 'https://genosys.ae/ar/contact',
      'ru': 'https://genosys.ae/ru/contact',
    },
  },
}

export default function ContactPage() {
  return <ContactClient />
}
