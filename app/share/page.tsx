import type { Metadata } from 'next'
import ShareClient from './ShareClient'
import { ShareErrorBoundary } from '@/components/error-boundaries'

/**
 * A share-target utility, not a content page. Without metadata it inherited the root
 * layout's title and `index: true`, so it competed with the homepage for the brand term.
 */
export const metadata: Metadata = {
  title: 'Share - GENOSYS',
  description: 'Share a GENOSYS product.',
  robots: { index: false, follow: true },
}

export default function SharePage() {
  return (
    <ShareErrorBoundary>
      <ShareClient />
    </ShareErrorBoundary>
  )
}
