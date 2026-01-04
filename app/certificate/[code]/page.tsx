import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import CertificateClient from './CertificateClient'

type Props = {
  params: Promise<{ code: string }>
}

// Validate certificate code (you can expand this with database lookup)
function validateCertificateCode(code: string): boolean {
  // For now, we'll accept the specific code or any alphanumeric code
  // In production, this should check against a database
  return /^[A-Z0-9]{4,10}$/i.test(code)
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params
  
  if (!validateCertificateCode(code)) {
    return {
      title: 'Invalid Certificate | GENOSYS',
    }
  }

  return {
    title: `Gift Certificate ${code} | GENOSYS Middle East`,
    description: `GENOSYS gift certificate - Redeem for premium Korean dermacosmetics and professional skincare products in UAE.`,
    robots: {
      index: false, // Don't index individual certificates
      follow: false,
    },
    openGraph: {
      title: `GENOSYS Gift Certificate`,
      description: 'Premium gift certificate for professional Korean dermacosmetics',
      images: ['/Logo/BIGLogo-high.png'],
    },
  }
}

export default async function CertificatePage({ params }: Props) {
  const { code } = await params
  
  // Validate the certificate code
  if (!validateCertificateCode(code)) {
    notFound()
  }

  // In a real application, fetch certificate details from database
  // For now, we'll use static data based on the code
  const certificateData = {
    code: code.toUpperCase(),
    amount: code === '178B2' ? 200 : 100, // Default to 100 AED for other codes
    currency: 'AED',
    issueDate: '2025-12-29',
    validityMonths: 6,
  }

  return <CertificateClient {...certificateData} />
}



