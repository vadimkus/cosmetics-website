import { ProfileErrorBoundary } from '@/components/error-boundaries'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Profile - GENOSYS Professional Korean Dermacosmetics',
  description: 'Manage your GENOSYS account, view order history, update preferences, and access exclusive professional skincare resources.',
}

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProfileErrorBoundary>
      {children}
    </ProfileErrorBoundary>
  )
}
