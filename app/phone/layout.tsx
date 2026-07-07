import type { Metadata } from 'next'

// Internal device-preview simulator — never index.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function PhoneLayout({ children }: { children: React.ReactNode }) {
  return children
}
