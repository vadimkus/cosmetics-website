'use client'

import Image from 'next/image'
import Link from 'next/link'
import type { Order, OrderItem } from '@prisma/client'
import {
  ArrowUpRight,
  Award,
  BookOpen,
  Building,
  CalendarDays,
  Crown,
  CreditCard,
  Heart,
  MapPin,
  Medal,
  MessageCircle,
  Package,
  Phone,
  Sparkles,
} from 'lucide-react'
import type { User } from '@/types/user'
import { useFavorites } from '@/components/FavoritesProvider'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'
import MembershipCard from '@/components/profile/MembershipCard'
import StatusBadge from '@/components/shared/StatusBadge'
import { useMembershipData, type MembershipTier } from '@/hooks/useMembershipData'

type OrderWithItems = Order & { items: OrderItem[] }

interface ProfileOverviewProps {
  user: User
  orders: OrderWithItems[]
  loadingOrders: boolean
  onStartSkinAnalysis: () => void
}

function Arrow({ rtl }: { rtl: boolean }) {
  return <ArrowUpRight className={`h-4 w-4 shrink-0 ${rtl ? '-rotate-90' : ''}`} aria-hidden="true" />
}

export default function ProfileOverview({
  user,
  orders,
  loadingOrders,
  onStartSkinAnalysis,
}: ProfileOverviewProps) {
  const { t, locale, dir } = useTranslation()
  const { favorites } = useFavorites()
  const { data: membership } = useMembershipData()
  const isRTL = dir === 'rtl'
  const latestOrder = [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )[0]
  const dateLocale = locale === 'ar' ? 'ar-AE' : locale === 'ru' ? 'ru-RU' : 'en-AE'
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat(dateLocale, {
      style: 'currency',
      currency: 'AED',
      maximumFractionDigits: 2,
    }).format(amount)
  const registeredDate = new Intl.DateTimeFormat(dateLocale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(user.createdAt))
  const phone = user.phone?.trim() || latestOrder?.customerPhone?.trim() || t('profile.notAdded')
  const address = user.address?.trim() || latestOrder?.customerAddress?.trim() || t('profile.notAdded')
  const paymentLabels: Record<string, string> = {
    cod: t('profile.paymentCashOnDelivery'),
    stripe: t('profile.paymentOnline'),
    bank_transfer: t('profile.paymentBankTransfer'),
    partner_credit: t('profile.paymentPartnerCredit'),
  }
  const paymentMethod = latestOrder
    ? paymentLabels[latestOrder.paymentMethod] || latestOrder.paymentMethod
    : t('profile.noPaymentsYet')
  const summaryItems = [
    { label: t('profile.registered'), value: registeredDate, icon: CalendarDays },
    { label: t('profile.phone'), value: phone, icon: Phone, ltr: true },
    { label: t('profile.address'), value: address, icon: MapPin },
    { label: t('profile.lastPayment'), value: paymentMethod, icon: CreditCard },
  ]
  const isPartner = membership?.track === 'PARTNER'
  const tier: MembershipTier =
    membership?.track === 'REWARDS' ? membership.tier || 'MEMBER' : 'MEMBER'
  const TierIcon = isPartner
    ? Building
    : tier === 'PLATINUM'
      ? Crown
      : tier === 'SILVER' || tier === 'GOLD'
        ? Medal
        : Award
  const tierLabel = isPartner
    ? t('rewards.professionalPartner')
    : t(`rewards.tier.${tier.toLowerCase()}`)
  const tierBadgeStyles: Record<MembershipTier, string> = {
    MEMBER: 'border-white/15 bg-white/10 text-white/80',
    SILVER: 'border-slate-300/30 bg-slate-200/15 text-slate-100',
    GOLD: 'border-amber-300/35 bg-amber-300/15 text-amber-200',
    PLATINUM: 'border-cyan-200/30 bg-cyan-100/15 text-cyan-100',
  }

  return (
    <div className="space-y-5">
      <section className={`rounded-3xl bg-[var(--cera-ink)] px-6 py-7 text-white lg:px-8 lg:py-8 ${isRTL ? 'text-right' : ''}`}>
        <div className={`flex items-start justify-between gap-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
              {t('profile.accountSummary')}
            </p>
            {/* cerabarrier.css sets `.cera-page :where(h1,h2,h3) { color: ink }` outside
                any layer, so it beats the inherited white and paints this ink-on-ink
                against the dark card. Same bang as the login hero. */}
            <h2 className="cera-serif mt-1.5 !text-white text-[26px] leading-tight lg:text-[32px]">{user.name}</h2>
          </div>
          <div className={`flex shrink-0 flex-col gap-2 ${isRTL ? 'items-start' : 'items-end'}`}>
            <Image
              src="/images/genosys-wordmark-transparent.png"
              alt="GENOSYS"
              width={116}
              height={25}
              className="h-auto w-[116px] brightness-0 invert"
            />
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] ${tierBadgeStyles[tier]} ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <TierIcon className="h-3.5 w-3.5" aria-hidden="true" />
              {tierLabel}
            </span>
          </div>
        </div>
        <dl className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {summaryItems.map(item => {
            const Icon = item.icon
            return (
              <div
                key={item.label}
                className="min-w-0 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3.5"
              >
                <dt className={`flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/55 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  {item.label}
                </dt>
                <dd
                  className="mt-2 truncate text-sm font-medium text-white"
                  dir={item.ltr ? 'ltr' : undefined}
                  title={item.value}
                >
                  {item.value}
                </dd>
              </div>
            )
          })}
        </dl>
      </section>

      <MembershipCard />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.45fr)_minmax(300px,0.75fr)]">
        <section className="overflow-hidden rounded-3xl border border-[var(--cera-line)] bg-white shadow-[0_14px_40px_-28px_rgba(23,20,15,0.3)]">
          <div className={`flex items-center justify-between border-b border-[var(--cera-line)] px-6 py-5 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={isRTL ? 'text-right' : ''}>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--cera-muted)]">{t('profile.recentOrder')}</p>
              <h2 className="cera-serif mt-1 text-[20px] leading-tight text-[var(--cera-ink)]">{t('profile.orderActivity')}</h2>
            </div>
            <Link
              href={`${getLocalizedPath('/profile', locale)}?tab=orders`}
              className={`inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-[var(--cera-body)] hover:bg-[var(--cera-cream-deep)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cera-rose)] ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              {t('profile.viewAllOrders')}
              <Arrow rtl={isRTL} />
            </Link>
          </div>

          {loadingOrders ? (
            <div className="animate-pulse p-6">
              <div className="h-5 w-1/3 rounded bg-[var(--cera-cream-deep)]" />
              <div className="mt-5 h-20 rounded-2xl bg-[var(--cera-cream-deep)]" />
              <div className="mt-5 h-11 w-36 rounded-xl bg-[var(--cera-cream-deep)]" />
            </div>
          ) : latestOrder ? (
            <div className="p-6">
              <div className={`flex flex-wrap items-start justify-between gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--cera-cream-deep)] text-[var(--cera-body)]">
                    <Package className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="font-semibold text-[var(--cera-ink)]">
                      {t('profile.order')} #{latestOrder.orderNumber || latestOrder.id}
                    </p>
                    <p className="mt-0.5 text-xs text-[var(--cera-muted)]">
                      {new Date(latestOrder.createdAt).toLocaleDateString(locale === 'ar' ? 'ar-AE' : locale === 'ru' ? 'ru-RU' : 'en-AE', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                <div className={isRTL ? 'text-left' : 'text-right'}>
                  <StatusBadge status={latestOrder.status} />
                  <p className="mt-2 text-lg font-semibold text-[var(--cera-ink)]">{formatCurrency(latestOrder.total)}</p>
                </div>
              </div>

              <div className={`mt-5 flex items-center gap-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                {latestOrder.items.slice(0, 4).map(item => (
                  <div key={item.id} className="h-14 w-14 overflow-hidden rounded-xl border border-[var(--cera-line)] bg-[var(--cera-cream-deep)]">
                    <Image
                      src={item.image || '/images/genosys-logo-transparent.png'}
                      alt={item.productName}
                      width={56}
                      height={56}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
                {latestOrder.items.length > 4 && (
                  <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-[var(--cera-cream-deep)] text-xs font-semibold text-[var(--cera-body)]">
                    +{latestOrder.items.length - 4}
                  </span>
                )}
              </div>

              <div className={`mt-6 flex flex-wrap items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Link
                  href={getLocalizedPath(`/track/${latestOrder.orderNumber || latestOrder.id}`, locale)}
                  className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[var(--cera-ink)] px-4 text-sm font-semibold text-white transition-colors hover:bg-[var(--cera-rose-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cera-rose)] focus-visible:ring-offset-2"
                >
                  {t('profile.trackOrder')}
                  <Arrow rtl={isRTL} />
                </Link>
                <p className="text-xs text-[var(--cera-muted)]">
                  {latestOrder.items.reduce((sum, item) => sum + item.quantity, 0)} {t('profile.items')}
                </p>
              </div>
            </div>
          ) : (
            <div className={`p-6 ${isRTL ? 'text-right' : ''}`}>
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--cera-cream-deep)] text-[var(--cera-muted)]">
                <Package className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="cera-serif mt-4 text-[19px] leading-tight text-[var(--cera-ink)]">{t('profile.noOrdersYet')}</h3>
              <p className="mt-1 text-sm leading-6 text-[var(--cera-muted)]">{t('profile.noOrdersDescription')}</p>
              <Link
                href={getLocalizedPath('/products', locale)}
                className="mt-5 inline-flex min-h-11 items-center rounded-xl bg-[var(--cera-ink)] px-4 text-sm font-semibold text-white hover:bg-[var(--cera-rose-ink)]"
              >
                {t('profile.browseProducts')}
              </Link>
            </div>
          )}
        </section>

        <div className="grid grid-cols-1 gap-5">
          <Link
            href={`${getLocalizedPath('/profile', locale)}?tab=favorites`}
            className={`group rounded-3xl border border-[var(--cera-line)] bg-white p-5 shadow-[0_14px_40px_-28px_rgba(23,20,15,0.26)] transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cera-rose)] ${isRTL ? 'text-right' : ''}`}
          >
            <div className={`flex items-start justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--cera-blush)] text-[var(--cera-rose-ink)]">
                <Heart className="h-5 w-5" aria-hidden="true" />
              </span>
              <Arrow rtl={isRTL} />
            </div>
            <p className="cera-serif cera-numeral mt-5 text-[34px] leading-none text-[var(--cera-ink)]">{favorites.length}</p>
            <p className="mt-1 text-sm font-medium text-[var(--cera-body)]">{t('profile.savedFavorites')}</p>
            <p className="mt-1 text-xs leading-5 text-[var(--cera-muted)]">{t('profile.favoritesDescription')}</p>
          </Link>

          <div className="grid grid-cols-2 gap-3">
              <Link href={`${getLocalizedPath('/profile', locale)}?tab=addresses`} className="rounded-2xl border border-[var(--cera-line)] bg-white p-4 transition-colors hover:border-[var(--cera-blush-deep)] hover:bg-[var(--cera-cream-deep)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cera-rose)]">
              <MapPin className="h-5 w-5 text-[var(--cera-body)]" aria-hidden="true" />
              <p className="mt-4 text-sm font-semibold text-[var(--cera-ink)]">{t('profile.shipping')}</p>
              <p className="mt-1 text-xs leading-5 text-[var(--cera-muted)]">{t('profile.manageAddresses')}</p>
            </Link>
              <Link href={`${getLocalizedPath('/profile', locale)}?tab=billing`} className="rounded-2xl border border-[var(--cera-line)] bg-white p-4 transition-colors hover:border-[var(--cera-blush-deep)] hover:bg-[var(--cera-cream-deep)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cera-rose)]">
              <CreditCard className="h-5 w-5 text-[var(--cera-body)]" aria-hidden="true" />
              <p className="mt-4 text-sm font-semibold text-[var(--cera-ink)]">{t('profile.billing')}</p>
              <p className="mt-1 text-xs leading-5 text-[var(--cera-muted)]">{t('profile.manageBilling')}</p>
            </Link>
          </div>
        </div>
      </div>

      <section className={`grid gap-4 rounded-3xl bg-[var(--cera-blush)] p-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:p-8 ${isRTL ? 'text-right' : ''}`}>
        <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-[var(--cera-ink)] shadow-sm">
            <Sparkles className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--cera-muted)]">{t('profile.beautyProfile')}</p>
            <h2 className="cera-serif mt-1 text-[23px] leading-tight text-[var(--cera-ink)]">{t('profile.skinAnalysis')}</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--cera-body)]">{t('profile.skinAnalysisDescription')}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onStartSkinAnalysis}
          className="min-h-11 rounded-xl bg-[var(--cera-ink)] px-5 text-sm font-semibold text-white hover:bg-[var(--cera-rose-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cera-rose)] focus-visible:ring-offset-2"
        >
          {t('profile.startSkinAnalysis')}
        </button>
      </section>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <a
          href="https://wa.me/971585487665"
          target="_blank"
          rel="noopener noreferrer"
          className={`flex min-h-28 items-center justify-between gap-4 rounded-3xl border border-[var(--cera-line)] bg-white p-5 transition-colors hover:bg-[var(--cera-cream-deep)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cera-rose)] ${isRTL ? 'flex-row-reverse text-right' : ''}`}
        >
          <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <MessageCircle className="h-5 w-5 text-[var(--cera-body)]" aria-hidden="true" />
            <div>
              <p className="font-semibold text-[var(--cera-ink)]">{t('profile.needHelp')}</p>
              <p className="mt-1 text-sm text-[var(--cera-muted)]">{t('profile.supportDescription')}</p>
            </div>
          </div>
          <Arrow rtl={isRTL} />
        </a>
        <Link
          href={`${getLocalizedPath('/profile', locale)}?tab=documents`}
          className={`flex min-h-28 items-center justify-between gap-4 rounded-3xl border border-[var(--cera-line)] bg-white p-5 transition-colors hover:bg-[var(--cera-cream-deep)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cera-rose)] ${isRTL ? 'flex-row-reverse text-right' : ''}`}
        >
          <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <BookOpen className="h-5 w-5 text-[var(--cera-body)]" aria-hidden="true" />
            <div>
              <p className="font-semibold text-[var(--cera-ink)]">{t('profile.documents')}</p>
              <p className="mt-1 text-sm text-[var(--cera-muted)]">{t('profile.documentsDescription')}</p>
            </div>
          </div>
          <Arrow rtl={isRTL} />
        </Link>
      </div>
    </div>
  )
}
