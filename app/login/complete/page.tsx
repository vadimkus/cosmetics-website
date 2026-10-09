import type { Metadata } from 'next'
import LoginCompleteClient from './LoginCompleteClient'

export const metadata: Metadata = {
  title: 'Signing in | GENOSYS',
  robots: { index: false, follow: false },
}

export default function LoginCompletePage() {
  return <LoginCompleteClient />
}
