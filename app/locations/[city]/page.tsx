import type { Metadata } from 'next'
import { type LocationPageProps } from '@/types/common'
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- used in JSX return
import LocationPageClient from './LocationPageClient'

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
          url: 'https://genosys.ae/images/genosys-products.jpg',
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
      images: ['https://genosys.ae/images/genosys-products.jpg'],
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
  const location = locations[city] || null

  return <LocationPageClient city={city} location={location} />
}

