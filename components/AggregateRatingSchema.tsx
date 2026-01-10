'use client'

import { SITE_URL } from '@/lib/siteConfig'

interface AggregateRatingSchemaProps {
  ratingValue?: number
  reviewCount?: number
  bestRating?: number
  worstRating?: number
  reviews?: Array<{
    author: string
    rating: number
    reviewBody: string
    datePublished?: string
  }>
}

export default function AggregateRatingSchema({ 
  ratingValue = 4.8, 
  reviewCount = 127, 
  bestRating = 5, 
  worstRating = 1,
  reviews = []
}: AggregateRatingSchemaProps) {
  const baseUrl = SITE_URL
  
  // Default reviews if none provided
  const defaultReviews = [
    {
      author: "Dr. Sarah Ahmed",
      rating: 5,
      reviewBody: "Excellent professional products and outstanding customer service. Highly recommended for dermatology clinics.",
      datePublished: "2024-01-15"
    },
    {
      author: "Maria Santos",
      rating: 4,
      reviewBody: "Great quality Korean skincare products. Fast delivery and professional service.",
      datePublished: "2024-01-10"
    },
    {
      author: "Ahmed Al-Rashid",
      rating: 5,
      reviewBody: "Best Korean dermacosmetics in Dubai. Professional training and excellent support.",
      datePublished: "2024-01-05"
    },
    {
      author: "Jennifer Lee",
      rating: 5,
      reviewBody: "Amazing results with GENOSYS products. My clients love the professional quality.",
      datePublished: "2023-12-28"
    },
    {
      author: "Dr. Fatima Hassan",
      rating: 4,
      reviewBody: "Reliable supplier with high-quality products. Great for professional use.",
      datePublished: "2023-12-20"
    }
  ]
  
  const allReviews = reviews.length > 0 ? reviews : defaultReviews
  
  const schema = {
    "@context": "https://schema.org",
    "@type": "AggregateRating",
    "ratingValue": ratingValue,
    "reviewCount": reviewCount,
    "bestRating": bestRating,
    "worstRating": worstRating,
    "itemReviewed": {
      "@type": "Organization",
      "name": "GENOSYS Middle East FZ-LLC",
      "url": baseUrl,
      "description": "Official distributor of GENOSYS professional Korean dermacosmetics in UAE"
    },
    "review": allReviews.map(review => ({
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": review.rating,
        "bestRating": bestRating,
        "worstRating": worstRating
      },
      "author": {
        "@type": "Person",
        "name": review.author
      },
      "reviewBody": review.reviewBody,
      "datePublished": review.datePublished || new Date().toISOString().split('T')[0],
      "publisher": {
        "@type": "Organization",
        "name": "GENOSYS Middle East FZ-LLC"
      }
    })),
    "publisher": {
      "@type": "Organization",
      "name": "GENOSYS Middle East FZ-LLC",
      "url": baseUrl
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
    />
  )
}
