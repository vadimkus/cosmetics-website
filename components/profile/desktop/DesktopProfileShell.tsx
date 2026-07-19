'use client'

import Image from 'next/image'
import Link from 'next/link'
import {
  BookOpen,
  ChevronRight,
  CreditCard,
  Heart,
  LayoutDashboard,
  LogOut,
  MapPin,
  Package,
  ShieldCheck,
  Stethoscope,
  UserRound,
} from 'lucide-react'
import type { ReactNode } from 'react'
import type { User } from '@/types/user'
import { useTranslation } from '@/hooks/useTranslation'
import { useMembershipData } from '@/hooks/useMembershipData'
import { getLocalizedPath } from '@/lib/i18n'

export type DesktopProfileTab = 'overview' | 'orders' | 'details' | 'security'

interface DesktopProfileShellProps {
  user: User
  activeTab: DesktopProfileTab
  orderCount: number
  favoritesCount: number
  onLogout: () => void
  children: ReactNode
}

const tabItems = [
  { id: 'overview', labelKey: 'overview', icon: LayoutDashboard },
  { id: 'orders', labelKey: 'orders', icon: Package, count: 'orders' },
  { id: 'details', labelKey: 'personalDetails', icon: UserRound },
] as const

const routeItems = [
  { href: '/favorites', labelKey: 'savedFavorites', icon: Heart, count: 'favorites' },
  { href: '/profile/addresses', labelKey: 'shippingAddresses', icon: MapPin },
  { href: '/profile/billing', labelKey: 'billing', icon: CreditCard },
] as const

const sectionCopy: Record<DesktopProfileTab, { title: string; description: string }> = {
  overview: { title: 'overview', description: 'overviewDescription' },
  orders: { title: 'orders', description: 'ordersDescription' },
  details: { title: 'personalDetails', description: 'detailsDescription' },
  security: { title: 'securityAndPrivacy', description: 'securityDescription' },
}

export default function DesktopProfileShell({
  user,
  activeTab,
  orderCount,
  favoritesCount,
  onLogout,
  children,
}: DesktopProfileShellProps) {
  const { t, locale, dir } = useTranslation()
  const { data: membership } = useMembershipData()
  const isRTL = dir === 'rtl'
  const displayEmail =
    user.email.includes('@privaterelay.appleid.com') || user.email.includes('@genosys.local')
      ? user.contactEmail || t('profile.signedInWithApple')
      : user.email
  const activeCopy = sectionCopy[activeTab]

  const navClass = (active = false) =>
    `group flex min-h-11 w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 ${
      active
        ? 'bg-gray-950 text-white shadow-sm'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-950'
    } ${isRTL ? 'flex-row-reverse text-right' : ''}`

  return (
    <div className="min-h-[100dvh] bg-[#f7f7f5]" dir={dir}>
      <div className="mx-auto max-w-[1440px] px-6 py-8 lg:px-10 lg:py-10">
        <div className="grid grid-cols-[260px_minmax(0,1fr)] items-start gap-8 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-10">
          <aside className="sticky top-24 overflow-hidden rounded-3xl border border-gray-200/80 bg-white shadow-[0_18px_50px_rgba(17,24,39,0.06)]">
            <div className="border-b border-gray-100 p-5">
              <div className={`flex items-center gap-3.5 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-gray-200 bg-gray-100">
                  <Image
                    src={user.profilePicture || '/images/avatar/avatar.png'}
                    alt=""
                    width={56}
                    height={56}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className={`min-w-0 ${isRTL ? 'text-right' : ''}`}>
                  <p className="truncate text-base font-semibold tracking-tight text-gray-950">{user.name}</p>
                  <p className="truncate text-xs text-gray-500" dir="ltr">{displayEmail}</p>
                  {membership?.memberNumber && (
                    <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary-600">
                      {membership.memberNumber}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <nav aria-label={t('profile.accountNavigation')} className="p-3">
              <p className={`px-3 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400 ${isRTL ? 'text-right' : ''}`}>
                {t('profile.myAccount')}
              </p>
              <div className="space-y-1">
                {tabItems.map(item => {
                  const Icon = item.icon
                  const active = activeTab === item.id
                  return (
                    <Link
                      key={item.id}
                      href={`${getLocalizedPath('/profile', locale)}?tab=${item.id}`}
                      aria-current={active ? 'page' : undefined}
                      className={navClass(active)}
                    >
                      <Icon className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
                      <span className="flex-1">{t(`profile.${item.labelKey}`)}</span>
                      {'count' in item && item.count === 'orders' && orderCount > 0 && (
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${active ? 'bg-white/15 text-white' : 'bg-gray-100 text-gray-600'}`}>
                          {orderCount}
                        </span>
                      )}
                    </Link>
                  )
                })}

                {routeItems.map(item => {
                  const Icon = item.icon
                  const count = 'count' in item && item.count === 'favorites' ? favoritesCount : 0
                  return (
                    <Link
                      key={item.href}
                      href={getLocalizedPath(item.href, locale)}
                      className={navClass()}
                    >
                      <Icon className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
                      <span className="flex-1">{t(`profile.${item.labelKey}`)}</span>
                      {count > 0 && (
                        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-600">
                          {count}
                        </span>
                      )}
                      <ChevronRight className={`h-4 w-4 text-gray-300 transition-transform group-hover:translate-x-0.5 ${isRTL ? 'rotate-180 group-hover:-translate-x-0.5' : ''}`} aria-hidden="true" />
                    </Link>
                  )
                })}

                <Link
                  href={`${getLocalizedPath('/profile', locale)}?tab=security`}
                  aria-current={activeTab === 'security' ? 'page' : undefined}
                  className={navClass(activeTab === 'security')}
                >
                  <ShieldCheck className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
                  <span className="flex-1">{t('profile.securityAndPrivacy')}</span>
                </Link>

                <Link href={getLocalizedPath('/training', locale)} className={navClass()}>
                  <BookOpen className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
                  <span className="flex-1">{t('profile.documents')}</span>
                  <ChevronRight className={`h-4 w-4 text-gray-300 ${isRTL ? 'rotate-180' : ''}`} aria-hidden="true" />
                </Link>
              </div>

              {(user.partnerPortalAccess || ['CLINIC', 'VIP'].includes(String(user.discountType || '').toUpperCase())) && (
                <div className="mt-3 border-t border-gray-100 pt-3">
                  <Link href={getLocalizedPath('/partner-portal', locale)} className={navClass()}>
                    <Stethoscope className="h-[18px] w-[18px] shrink-0 text-primary-600" aria-hidden="true" />
                    <span className="flex-1">{t('profile.partnerPortal')}</span>
                    <ChevronRight className={`h-4 w-4 text-gray-300 ${isRTL ? 'rotate-180' : ''}`} aria-hidden="true" />
                  </Link>
                </div>
              )}

              <div className="mt-3 border-t border-gray-100 pt-3">
                <button type="button" onClick={onLogout} className={navClass()}>
                  <LogOut className={`h-[18px] w-[18px] shrink-0 text-gray-400 ${isRTL ? 'rotate-180' : ''}`} aria-hidden="true" />
                  <span className="flex-1">{t('profile.signOut')}</span>
                </button>
              </div>
            </nav>
          </aside>

          <main id="profile-content" className="min-w-0">
            <header className={`mb-7 ${isRTL ? 'text-right' : ''}`}>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary-600">
                {t('profile.myAccount')}
              </p>
              <h1 className="text-3xl font-semibold tracking-[-0.035em] text-gray-950 lg:text-4xl">
                {t(`profile.${activeCopy.title}`)}
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 lg:text-base">
                {t(`profile.${activeCopy.description}`)}
              </p>
            </header>
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
