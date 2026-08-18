'use client'

import Image from 'next/image'
import Link from 'next/link'
import {
  BookOpen,
  ChevronRight,
  CreditCard,
  Handshake,
  Heart,
  LayoutDashboard,
  LogOut,
  MapPin,
  Package,
  ShieldCheck,
  UserRound,
} from 'lucide-react'
import type { ReactNode } from 'react'
import type { User } from '@/types/user'
import { useTranslation } from '@/hooks/useTranslation'
import { useMembershipData } from '@/hooks/useMembershipData'
import { getLocalizedPath } from '@/lib/i18n'
import { ceraSerif } from '@/components/product/cerabarrier/ceraFont'

export type DesktopProfileTab =
  | 'overview'
  | 'orders'
  | 'favorites'
  | 'details'
  | 'addresses'
  | 'billing'
  | 'security'

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
  { id: 'favorites', labelKey: 'savedFavorites', icon: Heart, count: 'favorites' },
  { id: 'details', labelKey: 'personalDetails', icon: UserRound },
  { id: 'addresses', labelKey: 'shippingAddresses', icon: MapPin },
  { id: 'billing', labelKey: 'billing', icon: CreditCard },
] as const

const sectionCopy: Record<DesktopProfileTab, { title: string; description: string }> = {
  overview: { title: 'overview', description: 'overviewDescription' },
  orders: { title: 'orders', description: 'ordersDescription' },
  favorites: { title: 'savedFavorites', description: 'favoritesDescription' },
  details: { title: 'personalDetails', description: 'detailsDescription' },
  addresses: { title: 'shippingAddresses', description: 'manageAddresses' },
  billing: { title: 'billing', description: 'manageBilling' },
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
    `group flex min-h-11 w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cera-rose)] focus-visible:ring-offset-2 ${
      active
        ? 'bg-[var(--cera-ink)] text-white shadow-sm'
        : 'text-[var(--cera-body)] hover:bg-[var(--cera-cream-deep)] hover:text-[var(--cera-ink)]'
    } ${isRTL ? 'flex-row-reverse text-right' : ''}`

  return (
    <div className={`cera-page genosys-page ${ceraSerif.variable} min-h-[100dvh]`} dir={dir}>
      <div className="mx-auto max-w-[1440px] px-6 py-8 lg:px-10 lg:py-10">
        <div className="grid grid-cols-[260px_minmax(0,1fr)] items-start gap-8 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-10">
          <aside className="sticky top-24 overflow-hidden rounded-3xl border border-[var(--cera-line)] bg-white shadow-[0_18px_50px_-30px_rgba(23,20,15,0.18)]">
            <div className="border-b border-[var(--cera-line)] p-5">
              <div className={`flex items-center gap-3.5 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-[var(--cera-line)] bg-[var(--cera-cream-deep)]">
                  <Image
                    src={user.profilePicture || '/images/avatar/avatar.png'}
                    alt=""
                    width={56}
                    height={56}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className={`min-w-0 ${isRTL ? 'text-right' : ''}`}>
                  <p className="truncate text-base font-semibold tracking-tight text-[var(--cera-ink)]">{user.name}</p>
                  <p className="truncate text-xs text-[var(--cera-muted)]" dir="ltr">{displayEmail}</p>
                  {membership?.memberNumber && (
                    <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--cera-rose-ink)]">
                      {membership.memberNumber}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <nav aria-label={t('profile.accountNavigation')} className="p-3">
              <p className={`px-3 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--cera-muted)] ${isRTL ? 'text-right' : ''}`}>
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
                      {'count' in item && (
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${active ? 'bg-white/15 text-white' : 'bg-[var(--cera-blush)] text-[var(--cera-rose-ink)]'}`}>
                          {item.count === 'orders' ? orderCount : favoritesCount}
                        </span>
                      )}
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
                  <ChevronRight className={`h-4 w-4 text-[var(--cera-blush-deep)] ${isRTL ? 'rotate-180' : ''}`} aria-hidden="true" />
                </Link>
              </div>

              {(user.partnerPortalAccess || ['CLINIC', 'VIP'].includes(String(user.discountType || '').toUpperCase())) && (
                <div className="mt-3 border-t border-[var(--cera-line)] pt-3">
                  <Link href={getLocalizedPath('/partner-portal', locale)} className={navClass()}>
                    <Handshake className="h-[18px] w-[18px] shrink-0 text-[var(--cera-rose-ink)]" aria-hidden="true" />
                    <span className="flex-1">{t('profile.partnerPortal')}</span>
                    <ChevronRight className={`h-4 w-4 text-[var(--cera-blush-deep)] ${isRTL ? 'rotate-180' : ''}`} aria-hidden="true" />
                  </Link>
                </div>
              )}

              <div className="mt-3 border-t border-[var(--cera-line)] pt-3">
                <button type="button" onClick={onLogout} className={navClass()}>
                  <LogOut className={`h-[18px] w-[18px] shrink-0 text-[var(--cera-muted)] ${isRTL ? 'rotate-180' : ''}`} aria-hidden="true" />
                  <span className="flex-1">{t('profile.signOut')}</span>
                </button>
              </div>
            </nav>
          </aside>

          <main id="profile-content" className="min-w-0">
            <header className={`mb-7 ${isRTL ? 'text-right' : ''}`}>
              <p className="cera-eyebrow mb-2">{t('profile.myAccount')}</p>
              <h1 className="cera-serif text-[30px] leading-[1.1] text-[var(--cera-ink)] lg:text-[40px]">
                {t(`profile.${activeCopy.title}`)}
              </h1>
              <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[var(--cera-muted)]">
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
