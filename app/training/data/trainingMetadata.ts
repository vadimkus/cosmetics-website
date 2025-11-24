import type { Metadata } from 'next'

export const trainingMetadata: Metadata = {
  title: 'Professional Training - GENOSYS Skincare Training | Genosys Middle East FZ-LLC',
  description: 'Professional training resources for GENOSYS skincare products. Download training documents, watch video lessons, and master professional techniques for Korean dermacosmetics.',
  keywords: 'GENOSYS training, professional skincare training, Korean dermacosmetics training, microneedling training, UAE skincare training',
  openGraph: {
    title: 'Professional Training - GENOSYS Skincare Training',
    description: 'Professional training resources for GENOSYS skincare products. Download training documents, watch video lessons, and master professional techniques.',
    type: 'website',
    images: [
      {
        url: '/images/genosys-logo.png',
        width: 400,
        height: 200,
        alt: 'GENOSYS Professional Training',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@genosys_official',
    creator: '@genosys_official',
    title: 'Professional Training - GENOSYS Skincare Training',
    description: 'Professional training resources for GENOSYS skincare products. Download training documents, watch video lessons, and master professional techniques.',
    images: ['/images/genosys-logo.png'],
  },
  alternates: {
    canonical: 'https://genosys.ae/training',
  },
}
