import type { Metadata } from 'next'
import ResetPasswordClient from '../../../reset-password/[token]/page'

export const metadata: Metadata = {
  title: 'إعادة تعيين كلمة المرور - GENOSYS',
  description: 'أنشئ كلمة مرور جديدة لحسابك في GENOSYS.',
  robots: { index: false, follow: false },
}

export default function ArabicResetPasswordPage() {
  return <ResetPasswordClient />
}
