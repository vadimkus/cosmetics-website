import type { Metadata } from 'next'
import GenosysPageClient from './GenosysPageClient'

export const metadata: Metadata = {
  title: 'GENOSYS Official - About GENOSYS Middle East FZ-LLC | Genosys.ae',
  description: 'Learn about GENOSYS Middle East FZ-LLC, official distributor of DTSMG Co., Ltd Korea in UAE. Certified Korean dermacosmetics distributor since 2019.',
  keywords: 'GENOSYS official, GENOSYS Middle East, Korean dermacosmetics distributor UAE, DTSMG Korea distributor',
  alternates: {
    canonical: 'https://genosys.ae/genosys',
  },
}

export default function GenosysPage() {
  return <GenosysPageClient />
}
