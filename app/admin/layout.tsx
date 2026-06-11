import type { Metadata } from 'next'
import { AdminErrorBoundary } from '@/components/error-boundaries'

// Admin pages must never appear in search results. robots.txt only disallows
// /admin/ (with trailing slash), so /admin itself was crawlable and indexable.
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminErrorBoundary>{children}</AdminErrorBoundary>
}
