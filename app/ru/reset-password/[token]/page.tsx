import type { Metadata } from 'next'
import ResetPasswordClient from '../../../reset-password/[token]/page'

export const metadata: Metadata = {
  title: 'Сброс пароля - GENOSYS',
  description: 'Создайте новый пароль для вашего аккаунта GENOSYS.',
  robots: { index: false, follow: false },
}

export default function RussianResetPasswordPage() {
  return <ResetPasswordClient />
}
