import type { Metadata } from 'next'
import { Suspense } from 'react'
import AddToBagClient from './AddToBagClient'

export const metadata: Metadata = {
  title: 'Adding to your bag | GENOSYS',
  robots: { index: false, follow: false },
}

export default function AddToBagPage() {
  return (
    <Suspense fallback={null}>
      <AddToBagClient />
    </Suspense>
  )
}
