import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { unsubscribeAction, resubscribeAction } from './actions'
import { errorLog } from '@/lib/logger'
import { ceraSerif } from '@/components/product/cerabarrier/ceraFont'
import '@/components/product/cerabarrier/cerabarrier.css'
import '@/components/editorial/editorial.css'

export const dynamic = 'force-dynamic'
export const metadata = {
  title: 'Unsubscribe | GENOSYS',
  robots: { index: false, follow: false },
}

type Copy = {
  heading: string
  subheading: string
  unsubscribed: string
  unsubscribedBody: string
  confirm: string
  resubscribe: string
  backHome: string
  invalidTitle: string
  invalidBody: string
  tagline: string
}

const COPY: Record<'en' | 'ar' | 'ru', Copy> = {
  en: {
    heading: 'Unsubscribe',
    subheading: 'You\u2019ll stop receiving GENOSYS newsletter emails at',
    unsubscribed: 'You\u2019re unsubscribed.',
    unsubscribedBody: 'We\u2019ve removed you from the list. You won\u2019t receive any further newsletter emails. Change your mind later? You can resubscribe any time.',
    confirm: 'Confirm unsubscribe',
    resubscribe: 'Resubscribe',
    backHome: 'Back to genosys.ae',
    invalidTitle: 'This link is no longer valid.',
    invalidBody: 'It may have expired or already been used. If you\u2019re still receiving emails, please contact info@genosys.ae.',
    tagline: 'Official UAE distributor of GENOSYS professional Korean dermacosmetics.',
  },
  ar: {
    heading: 'إلغاء الاشتراك',
    subheading: 'سيتوقف وصول رسائل GENOSYS إلى',
    unsubscribed: 'تم إلغاء اشتراكك.',
    unsubscribedBody: 'لقد تمت إزالتك من القائمة. لن تتلقى أي رسائل نشرة إضافية. غيّرت رأيك؟ يمكنك إعادة الاشتراك في أي وقت.',
    confirm: 'تأكيد إلغاء الاشتراك',
    resubscribe: 'إعادة الاشتراك',
    backHome: 'العودة إلى genosys.ae',
    invalidTitle: 'هذا الرابط لم يعد صالحاً.',
    invalidBody: 'ربما انتهت صلاحيته أو سبق استخدامه. إذا كنت لا تزال تتلقى رسائل، يرجى مراسلة info@genosys.ae.',
    tagline: 'الموزع الرسمي في الإمارات لمنتجات GENOSYS الاحترافية.',
  },
  ru: {
    heading: 'Отписаться от рассылки',
    subheading: 'Вы перестанете получать письма GENOSYS на',
    unsubscribed: 'Вы отписались.',
    unsubscribedBody: 'Мы убрали вас из списка. Больше писем рассылки вы не получите. Передумали? Подписаться снова можно в любой момент.',
    confirm: 'Подтвердить отписку',
    resubscribe: 'Подписаться снова',
    backHome: 'На главную genosys.ae',
    invalidTitle: 'Эта ссылка больше не действительна.',
    invalidBody: 'Возможно, срок её действия истёк или она уже использована. Если письма всё ещё приходят, напишите нам на info@genosys.ae.',
    tagline: 'Официальный дистрибьютор GENOSYS в ОАЭ.',
  },
}

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; done?: string; resubscribed?: string }>
}) {
  const params = await searchParams
  const token = typeof params.token === 'string' ? params.token : ''
  const done = params.done === '1'
  const resubscribed = params.resubscribed === '1'

  let subscriber: { email: string; locale: string; isActive: boolean } | null = null
  if (token) {
    try {
      subscriber = await prisma.newsletterSubscriber.findUnique({
        where: { unsubscribeToken: token },
        select: { email: true, locale: true, isActive: true },
      })
    } catch (err) {
      errorLog('[newsletter/unsubscribe] lookup failed:', err)
    }
  }

  const locale = (subscriber?.locale === 'ar' || subscriber?.locale === 'ru'
    ? subscriber.locale
    : 'en') as 'en' | 'ar' | 'ru'
  const t = COPY[locale]
  const dir = locale === 'ar' ? 'rtl' : 'ltr'

  const invalid = !token || !subscriber

  return (
    <main
      dir={dir}
      className={`cera-page genosys-page ${ceraSerif.variable} min-h-[calc(100vh-0px)] bg-gradient-to-b from-[var(--cera-cream-deep)] to-white flex items-center justify-center px-4 py-20`}
    >
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-sm border border-[var(--cera-line)] p-8 md:p-10">
        <div className="flex justify-center mb-8">
          <Image
            src="/images/genosys-wordmark-transparent.png"
            alt="GENOSYS"
            width={977}
            height={210}
            priority
            className="h-8 w-auto"
          />
        </div>

        {invalid ? (
          <>
            <h1 className="cera-serif text-2xl md:text-3xl font-display text-[var(--cera-ink)] text-center tracking-tight">
              {t.invalidTitle}
            </h1>
            <p className="mt-4 text-sm md:text-base text-[var(--cera-body)] leading-relaxed text-center">
              {t.invalidBody}
            </p>
          </>
        ) : done || !subscriber!.isActive ? (
          <>
            <div className="flex justify-center mb-4">
              <span className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-green-50 text-green-700">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </span>
            </div>
            <h1 className="cera-serif text-2xl md:text-3xl font-display text-[var(--cera-ink)] text-center tracking-tight">
              {resubscribed ? COPY[locale].heading : t.unsubscribed}
            </h1>
            {!resubscribed && (
              <>
                <p className="mt-4 text-sm md:text-base text-[var(--cera-body)] leading-relaxed text-center">
                  {t.unsubscribedBody}
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                  <form action={resubscribeAction}>
                    <input type="hidden" name="token" value={token} />
                    <button
                      type="submit"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--cera-line)] bg-white px-5 py-2.5 text-sm font-semibold text-[var(--cera-ink)] hover:bg-[var(--cera-cream-deep)] transition-colors"
                    >
                      {t.resubscribe}
                    </button>
                  </form>
                  <Link
                    href="/"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--cera-cta)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--cera-rose-ink)] transition-colors"
                  >
                    {t.backHome}
                  </Link>
                </div>
              </>
            )}
            {resubscribed && (
              <>
                <p className="mt-4 text-sm md:text-base text-[var(--cera-body)] leading-relaxed text-center">
                  {subscriber!.email}
                </p>
                <div className="mt-8 flex justify-center">
                  <Link
                    href="/"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--cera-cta)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--cera-rose-ink)] transition-colors"
                  >
                    {t.backHome}
                  </Link>
                </div>
              </>
            )}
          </>
        ) : (
          <>
            <h1 className="cera-serif text-2xl md:text-3xl font-display text-[var(--cera-ink)] text-center tracking-tight">
              {t.heading}
            </h1>
            <p className="mt-4 text-sm md:text-base text-[var(--cera-body)] leading-relaxed text-center">
              {t.subheading}
              <br />
              <span className="font-semibold text-[var(--cera-ink)] break-all">{subscriber!.email}</span>
            </p>
            <form action={unsubscribeAction} className="mt-8 flex justify-center">
              <input type="hidden" name="token" value={token} />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--cera-cta)] px-6 py-3 text-sm font-semibold text-white hover:bg-[var(--cera-rose-ink)] transition-colors"
              >
                {t.confirm}
              </button>
            </form>
          </>
        )}

        <p className="mt-10 pt-6 border-t border-[var(--cera-line)] text-[11px] md:text-xs text-[var(--cera-muted)] text-center leading-relaxed">
          {t.tagline}
        </p>
      </div>
    </main>
  )
}
