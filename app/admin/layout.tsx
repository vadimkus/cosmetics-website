import { AdminErrorBoundary } from '@/components/error-boundaries'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminErrorBoundary>{children}</AdminErrorBoundary>
}
