import ShareClient from './ShareClient'
import { ShareErrorBoundary } from '@/components/error-boundaries'

export default function SharePage() {
  return (
    <ShareErrorBoundary>
      <ShareClient />
    </ShareErrorBoundary>
  )
}
