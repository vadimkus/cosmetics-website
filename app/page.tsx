import Hero from '@/components/Hero'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'
import MobileRedirect from '@/components/MobileRedirect'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'GENOSYS Middle East FZ-LLC | Official Korean Dermacosmetics Distributor UAE',
  description: 'Official distributor of GENOSYS professional Korean dermacosmetics in UAE. Premium microneedling devices, skincare products & beauty treatments. Free shipping over 1000 AED. Dubai, Abu Dhabi, Sharjah.',
  keywords: [
    'GENOSYS UAE',
    'Korean dermacosmetics Dubai',
    'professional skincare UAE',
    'microneedling devices Dubai',
    'Korean beauty products UAE',
    'GENOSYS distributor UAE',
    'professional skincare Dubai',
    'Korean cosmetics Abu Dhabi',
    'dermacosmetics Sharjah',
    'beauty devices UAE',
    'GENOSYS Middle East',
    'Korean skincare UAE'
  ],
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
    title: 'GENOSYS Middle East FZ-LLC | Official Korean Dermacosmetics Distributor UAE',
    description: 'Official distributor of GENOSYS professional Korean dermacosmetics in UAE. Premium microneedling devices, skincare products & beauty treatments. Free shipping over 1000 AED.',
    type: 'website',
    url: 'https://genosys.ae',
    siteName: 'GENOSYS Middle East FZ-LLC',
    images: [
      {
        url: '/images/genosys-products.jpg',
        width: 1200,
        height: 630,
        alt: 'GENOSYS Premium Korean Dermacosmetics',
      },
    ],
    locale: 'en_AE',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@genosys_official',
    creator: '@genosys_official',
    title: 'GENOSYS Middle East FZ-LLC | Official Korean Dermacosmetics Distributor UAE',
    description: 'Official distributor of GENOSYS professional Korean dermacosmetics in UAE. Premium microneedling devices and skincare products.',
    images: ['/images/genosys-products.jpg'],
  },
  alternates: {
    canonical: 'https://genosys.ae',
    languages: {
      'en': 'https://genosys.ae',
      'ar': 'https://genosys.ae/ar',
    },
  },
}

export default function Home() {
  return (
    <MobileRedirect to="/products">
      <div className="bg-white" dir="ltr">
        <BreadcrumbSchema 
          items={[
            { name: 'Home', url: '/' }
          ]}
        />
        <Hero initialLocale="en" initialDir="ltr" />
      </div>
    </MobileRedirect>
  )
}
