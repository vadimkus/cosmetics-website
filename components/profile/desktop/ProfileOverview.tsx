'use client'

import Image from 'next/image'
import Link from 'next/link'
import type { Order, OrderItem } from '@prisma/client'
import {
  ArrowUpRight,
  BookOpen,
  CreditCard,
  Heart,
  MapPin,
  MessageCircle,
  Package,
  Sparkles,
} from 'lucide-react'
import type { User } from '@/types/user'
import { useFavorites } from '@/components/FavoritesProvider'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'
import MembershipCard from '@/components/profile/MembershipCard'
import StatusBadge from '@/components/shared/StatusBadge'

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
  const isRTL = dir === 'rtl'
  const latestOrder = [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )[0]
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat(locale === 'ar' ? 'ar-AE' : 'en-AE', {
      style: 'currency',
      currency: 'AED',
      maximumFractionDigits: 2,
    }).format(amount)

  return (
    <div className="space-y-5">
      <section className={`rounded-3xl bg-gray-950 px-6 py-7 text-white lg:px-8 lg:py-8 ${isRTL ? 'text-right' : ''}`}>
        <div className={`flex items-start justify-between gap-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div>
            <p className="text-sm text-gray-400">{t('profile.welcomeBack')}</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-[-0.03em] lg:text-3xl">{user.name}</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-gray-400">{t('profile.welcomeDescription')}</p>
          </div>
          <span className="hidden rounded-full bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-300 lg:block">
            GENOSYS UAE
          </span>
        </div>
      </section>

      <MembershipCard />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.45fr)_minmax(300px,0.75fr)]">
        <section className="overflow-hidden rounded-3xl border border-gray-200/80 bg-white shadow-[0_14px_40px_rgba(17,24,39,0.05)]">
          <div className={`flex items-center justify-between border-b border-gray-100 px-6 py-5 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={isRTL ? 'text-right' : ''}>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">{t('profile.recentOrder')}</p>
              <h2 className="mt-1 text-lg font-semibold tracking-tight text-gray-950">{t('profile.orderActivity')}</h2>
            </div>
            <Link
              href={`${getLocalizedPath('/profile', locale)}?tab=orders`}
              className={`inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              {t('profile.viewAllOrders')}
              <Arrow rtl={isRTL} />
            </Link>
          </div>

          {loadingOrders ? (
            <div className="animate-pulse p-6">
              <div className="h-5 w-1/3 rounded bg-gray-100" />
              <div className="mt-5 h-20 rounded-2xl bg-gray-100" />
              <div className="mt-5 h-11 w-36 rounded-xl bg-gray-100" />
            </div>
          ) : latestOrder ? (
            <div className="p-6">
              <div className={`flex flex-wrap items-start justify-between gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gray-100 text-gray-700">
                    <Package className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="font-semibold text-gray-950">
                      {t('profile.order')} #{latestOrder.orderNumber || latestOrder.id}
                    </p>
                    <p className="mt-0.5 text-xs text-gray-500">
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
                  <p className="mt-2 text-lg font-semibold text-gray-950">{formatCurrency(latestOrder.total)}</p>
                </div>
              </div>

              <div className={`mt-5 flex items-center gap-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                {latestOrder.items.slice(0, 4).map(item => (
                  <div key={item.id} className="h-14 w-14 overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
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
                  <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-gray-100 text-xs font-semibold text-gray-600">
                    +{latestOrder.items.length - 4}
                  </span>
                )}
              </div>

              <div className={`mt-6 flex flex-wrap items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Link
                  href={getLocalizedPath(`/track/${latestOrder.orderNumber || latestOrder.id}`, locale)}
                  className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-gray-950 px-4 text-sm font-semibold text-white transition-colors hover:bg-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                >
                  {t('profile.trackOrder')}
                  <Arrow rtl={isRTL} />
                </Link>
                <p className="text-xs text-gray-500">
                  {latestOrder.items.reduce((sum, item) => sum + item.quantity, 0)} {t('profile.items')}
                </p>
              </div>
            </div>
          ) : (
            <div className={`p-6 ${isRTL ? 'text-right' : ''}`}>
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-500">
                <Package className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 font-semibold text-gray-950">{t('profile.noOrdersYet')}</h3>
              <p className="mt-1 text-sm leading-6 text-gray-500">{t('profile.noOrdersDescription')}</p>
              <Link
                href={getLocalizedPath('/products', locale)}
                className="mt-5 inline-flex min-h-11 items-center rounded-xl bg-gray-950 px-4 text-sm font-semibold text-white hover:bg-primary-600"
              >
                {t('profile.browseProducts')}
              </Link>
            </div>
          )}
        </section>

        <div className="grid grid-cols-1 gap-5">
          <Link
            href={getLocalizedPath('/favorites', locale)}
            className={`group rounded-3xl border border-gray-200/80 bg-white p-5 shadow-[0_14px_40px_rgba(17,24,39,0.04)] transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${isRTL ? 'text-right' : ''}`}
          >
            <div className={`flex items-start justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
                <Heart className="h-5 w-5" aria-hidden="true" />
              </span>
              <Arrow rtl={isRTL} />
            </div>
            <p className="mt-5 text-3xl font-semibold tracking-tight text-gray-950">{favorites.length}</p>
            <p className="mt-1 text-sm font-medium text-gray-700">{t('profile.savedFavorites')}</p>
            <p className="mt-1 text-xs leading-5 text-gray-500">{t('profile.favoritesDescription')}</p>
          </Link>

          <div className="grid grid-cols-2 gap-3">
            <Link href={getLocalizedPath('/profile/addresses', locale)} className="rounded-2xl border border-gray-200 bg-white p-4 transition-colors hover:border-gray-300 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500">
              <MapPin className="h-5 w-5 text-gray-700" aria-hidden="true" />
              <p className="mt-4 text-sm font-semibold text-gray-950">{t('profile.shipping')}</p>
              <p className="mt-1 text-xs leading-5 text-gray-500">{t('profile.manageAddresses')}</p>
            </Link>
            <Link href={getLocalizedPath('/profile/billing', locale)} className="rounded-2xl border border-gray-200 bg-white p-4 transition-colors hover:border-gray-300 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500">
              <CreditCard className="h-5 w-5 text-gray-700" aria-hidden="true" />
              <p className="mt-4 text-sm font-semibold text-gray-950">{t('profile.billing')}</p>
              <p className="mt-1 text-xs leading-5 text-gray-500">{t('profile.manageBilling')}</p>
            </Link>
          </div>
        </div>
      </div>

      <section className={`grid gap-4 rounded-3xl bg-[#efeae3] p-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:p-8 ${isRTL ? 'text-right' : ''}`}>
        <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-gray-950 shadow-sm">
            <Sparkles className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">{t('profile.beautyProfile')}</p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight text-gray-950">{t('profile.skinAnalysis')}</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-gray-600">{t('profile.skinAnalysisDescription')}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onStartSkinAnalysis}
          className="min-h-11 rounded-xl bg-gray-950 px-5 text-sm font-semibold text-white hover:bg-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
        >
          {t('profile.startSkinAnalysis')}
        </button>
      </section>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <a
          href="https://wa.me/971585487665"
          target="_blank"
          rel="noopener noreferrer"
          className={`flex min-h-28 items-center justify-between gap-4 rounded-3xl border border-gray-200 bg-white p-5 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${isRTL ? 'flex-row-reverse text-right' : ''}`}
        >
          <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <MessageCircle className="h-5 w-5 text-gray-700" aria-hidden="true" />
            <div>
              <p className="font-semibold text-gray-950">{t('profile.needHelp')}</p>
              <p className="mt-1 text-sm text-gray-500">{t('profile.supportDescription')}</p>
            </div>
          </div>
          <Arrow rtl={isRTL} />
        </a>
        <Link
          href={getLocalizedPath('/training', locale)}
          className={`flex min-h-28 items-center justify-between gap-4 rounded-3xl border border-gray-200 bg-white p-5 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${isRTL ? 'flex-row-reverse text-right' : ''}`}
        >
          <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <BookOpen className="h-5 w-5 text-gray-700" aria-hidden="true" />
            <div>
              <p className="font-semibold text-gray-950">{t('profile.documents')}</p>
              <p className="mt-1 text-sm text-gray-500">{t('profile.documentsDescription')}</p>
            </div>
          </div>
          <Arrow rtl={isRTL} />
        </Link>
      </div>
    </div>
  )
}
