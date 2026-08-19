import type { Metadata } from 'next'

/**
 * page.tsx is a client component, and Next.js silently ignores a metadata export from one.
 * So this route was inheriting the root layout's title and `index: true`, which put a
 * password-reset form in the index under the homepage's title. The AR and RU versions
 * already set their own `robots: { index: false }`; this brings English in line.
 *
 * The metadata lives in a layout rather than a server wrapper because /ar and /ru import
 * the client component from this path directly.
 */
export const metadata: Metadata = {
  title: 'Reset your password - GENOSYS',
  description: 'Enter your email address and we will send you a link to reset your GENOSYS account password.',
  robots: { index: false, follow: true },
}

export default function ForgotPasswordLayout({ children }: { children: React.ReactNode }) {
  return children
}
