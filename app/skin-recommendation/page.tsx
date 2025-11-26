import { Metadata } from 'next'
import SkinRecommendationClient from './SkinRecommendationClient'

export const metadata: Metadata = {
  title: 'Personalized Skin Recommendation | GENOSYS Professional Korean Dermacosmetics',
  description: 'Discover your perfect GENOSYS products tailored to your unique skin needs. Our AI-powered recommendation system analyzes your skin profile to suggest the best professional Korean skincare products.',
  keywords: [
    'skin recommendation',
    'personalized skincare',
    'GENOSYS',
    'Korean skincare',
    'custom products',
    'skin analysis',
    'product recommendations',
    'professional skincare UAE',
    'dermacosmetics',
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
    title: 'Personalized Skin Recommendation | GENOSYS Professional',
    description: 'Discover your perfect GENOSYS products tailored to your unique skin needs. AI-powered recommendation system for professional Korean skincare.',
    url: 'https://genosys.ae/skin-recommendation',
    siteName: 'GENOSYS Middle East FZ-LLC',
    locale: 'en_AE',
    type: 'website',
    images: [
      {
        url: '/images/genosys-products.jpg',
        width: 1200,
        height: 630,
        alt: 'GENOSYS Skin Recommendation System',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@genosys_official',
    creator: '@genosys_official',
    title: 'Personalized Skin Recommendation | GENOSYS Professional',
    description: 'Discover your perfect GENOSYS products tailored to your unique skin needs.',
    images: ['/images/genosys-products.jpg'],
  },
  alternates: {
    canonical: 'https://genosys.ae/skin-recommendation',
    languages: {
      'en': 'https://genosys.ae/skin-recommendation',
      'ar': 'https://genosys.ae/ar/skin-recommendation',
    },
  },
}

export default function SkinRecommendationPage() {
  return <SkinRecommendationClient />
}

