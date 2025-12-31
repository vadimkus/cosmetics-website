import { Metadata } from 'next'
import CertificateGeneratorClient from './CertificateGeneratorClient'

export const metadata: Metadata = {
  title: 'Certificate Generator | GENOSYS Admin',
  description: 'Generate gift certificates for GENOSYS customers',
  robots: {
    index: false,
    follow: false,
  },
}

export default function CertificateGeneratorPage() {
  return <CertificateGeneratorClient />
}


