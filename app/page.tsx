import Hero from '@/components/Hero'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'GENOSYS Middle East FZ-LLC | Official Distributor in the UAE',
  description: 'Premium Korean dermacosmetics by GENOSYS. Official UAE distributor. Professional skincare products, microneedling devices & beauty solutions.',
  keywords: 'GENOSYS, Korean dermacosmetics, UAE cosmetics, professional skincare, microneedling, Korean beauty products, Dubai cosmetics',
  openGraph: {
    title: 'GENOSYS Middle East FZ-LLC | Official Distributor in the UAE',
    description: 'Premium Korean dermacosmetics by GENOSYS. Official UAE distributor. Professional skincare products, microneedling devices & beauty solutions.',
    type: 'website',
    images: [
      {
        url: '/images/genosys-products.jpg',
        width: 1200,
        height: 630,
        alt: 'GENOSYS Premium Korean Dermacosmetics',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@genosys_me',
    creator: '@genosys_me',
    title: 'GENOSYS Middle East FZ-LLC | Official Distributor in the UAE',
    description: 'Discover premium Korean dermacosmetics by GENOSYS. Official distributor in UAE.',
    images: ['/images/genosys-products.jpg'],
  },
  alternates: {
    canonical: 'https://genosys.ae',
  },
}

export default function Home() {
  return (
    <div className="bg-white min-h-screen">
      <BreadcrumbSchema 
        items={[
          { name: 'Home', url: '/' }
        ]}
      />
      <Hero />
    </div>
  )
}
