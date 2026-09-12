/**
 * Server-side copy for the one registration error the client cannot phrase
 * itself: the address already belongs to an account. Many of these are people
 * who signed in with Google or Apple once and are now trying to create a
 * password account with the same address, so the message tells them what to
 * do instead of just refusing.
 */
const ACCOUNT_EXISTS: Record<'en' | 'ru' | 'ar', string> = {
  en: 'You already have an account with this email. Please log in, or use "Forgot password" if you signed up with Google or Apple.',
  ru: 'Аккаунт с этим email уже существует. Войдите или воспользуйтесь «Забыли пароль», если регистрировались через Google или Apple.',
  ar: 'لديك حساب بهذا البريد الإلكتروني بالفعل. يرجى تسجيل الدخول، أو استخدام "نسيت كلمة المرور" إذا كنت قد سجّلت عبر Google أو Apple.',
}

export const ACCOUNT_EXISTS_CODE = 'ACCOUNT_EXISTS' as const

export const accountExistsMessage = (locale: unknown): string => {
  const key = String(locale || 'en').toLowerCase().slice(0, 2)
  return key === 'ru' || key === 'ar' ? ACCOUNT_EXISTS[key] : ACCOUNT_EXISTS.en
}
