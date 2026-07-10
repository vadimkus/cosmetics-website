'use client'

import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  Package, Plus, RefreshCw, ChevronRight, ChevronDown, LogOut, ShoppingBag,
  Clock, ShieldCheck, TrendingUp, Check,
} from 'lucide-react'
import { useAuth } from '@/components/auth/AuthProvider'
import { useTranslation } from '@/hooks/useTranslation'
import { usePWAMode } from '@/hooks/usePWAMode'
import { getLocalizedPath } from '@/lib/i18n'
import { PartnerGuard } from '@/components/partners/PartnerGuard'
import { errorLog } from '@/lib/logger'

interface POrderItem {
  productId: string
  productName: string
  price: number
  quantity: number
  image?: string | null
  size?: string | null
  color?: string | null
}
interface POrder {
  id: string
  orderNumber: string
  total: number
  subtotal?: number
  status: string
  createdAt: string
  items?: POrderItem[]
}

const DAY = 24 * 60 * 60 * 1000

function statusStyle(status: string): { bg: string; text: string; label: (l: string) => string } {
  const s = status.toLowerCase()
  const L = (en: string, ru: string, ar: string) => (l: string) => (l === 'ru' ? ru : l === 'ar' ? ar : en)
  if (['delivered'].includes(s)) return { bg: 'bg-green-50', text: 'text-green-700', label: L('Delivered', 'Доставлено', 'تم التسليم') }
  if (['shipped', 'out_for_delivery'].includes(s)) return { bg: 'bg-indigo-50', text: 'text-indigo-700', label: L('Shipped', 'Отправлено', 'تم الشحن') }
  if (['paid'].includes(s)) return { bg: 'bg-emerald-50', text: 'text-emerald-700', label: L('Paid', 'Оплачено', 'مدفوع') }
  if (['confirmed', 'processing'].includes(s)) return { bg: 'bg-blue-50', text: 'text-blue-700', label: L('Processing', 'В обработке', 'قيد المعالجة') }
  if (['cancelled'].includes(s)) return { bg: 'bg-red-50', text: 'text-red-700', label: L('Cancelled', 'Отменено', 'ملغاة') }
  return { bg: 'bg-amber-50', text: 'text-amber-700', label: L('Pending', 'В ожидании', 'قيد الانتظار') }
}

// Order-item thumbnail with product-image fallback: older orders may have no
// stored `item.image`, so fall back to the product's current image (same
// behaviour as the main Orders page).
function OrderThumb({ image, productId }: { image?: string | null; productId: string }) {
  const [src, setSrc] = useState<string | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    setFailed(false)
    if (image && image.trim()) {
      setSrc(image)
      return
    }
    let active = true
    fetch(`/api/products/${productId}`)
      .then(r => (r.ok ? r.json() : null))
      .then(p => {
        if (!active) return
        if (p?.image) setSrc(p.image)
        else setFailed(true)
      })
      .catch(() => { if (active) setFailed(true) })
    return () => { active = false }
  }, [image, productId])

  if (src && !failed) {
    return <Image src={src} alt="" width={44} height={44} className="w-full h-full object-cover" onError={() => setFailed(true)} />
  }
  return <Package className="w-4 h-4 text-gray-300 absolute inset-0 m-auto" />
}

function PartnerDashboardInner() {
  const router = useRouter()
  const { locale, dir } = useTranslation()
  const { user, logout } = useAuth()
  const { isPWA } = usePWAMode()
  const [isMobileWeb, setIsMobileWeb] = useState(false)
  const [orders, setOrders] = useState<POrder[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const [showSignOut, setShowSignOut] = useState(false)
  const [welcome, setWelcome] = useState(true)

  const isRTL = dir === 'rtl'
  const t = (en: string, ru: string, ar: string) => (locale === 'ru' ? ru : locale === 'ar' ? ar : en)

  useEffect(() => {
    const check = () => setIsMobileWeb(window.innerWidth < 768 && !isPWA)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [isPWA])

  useEffect(() => {
    const timer = setTimeout(() => setWelcome(false), 3500)
    return () => clearTimeout(timer)
  }, [])

  const isAppLikeMode = isPWA || isMobileWeb

  const fetchOrders = async () => {
    if (!user?.email) return
    setLoading(true)
    try {
      let url = `/api/orders?email=${encodeURIComponent(user.email)}`
      if (user.contactEmail && user.contactEmail.trim()) url += `&contactEmail=${encodeURIComponent(user.contactEmail.trim())}`
      const res = await fetch(url)
      if (res.ok) {
        const data = await res.json()
        setOrders(data.orders || [])
      }
    } catch (e) {
      errorLog('Partner dashboard orders fetch failed:', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.email])

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchOrders()
    setRefreshing(false)
  }

  const stats = useMemo(() => {
    const count = orders.length
    const spent = orders.reduce((s, o) => s + (Number(o.total) || 0), 0)
    const lastDate = orders[0]?.createdAt ? new Date(orders[0].createdAt).getTime() : null
    const daysSince = lastDate !== null ? Math.floor((Date.now() - lastDate) / DAY) : null
    return { count, spent, daysSince }
  }, [orders])

  const showReorderNudge = stats.daysSince !== null && stats.daysSince >= 30

  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString(locale === 'ar' ? 'ar-AE' : locale === 'ru' ? 'ru-RU' : 'en-GB', {
      year: 'numeric', month: 'short', day: 'numeric',
    })

  const toggle = (id: string) => {
    setExpanded(prev => {
      const n = new Set(prev)
      if (n.has(id)) n.delete(id)
      else n.add(id)
      return n
    })
  }

  // Reorder: stash this order's lines and jump to the order builder prefilled.
  const reorder = (order: POrder) => {
    const map: Record<string, number> = {}
    for (const it of order.items || []) {
      map[it.productId] = (map[it.productId] || 0) + it.quantity
    }
    const items = Object.entries(map).map(([id, quantity]) => ({ id, quantity }))
    if (items.length === 0) return
    try {
      sessionStorage.setItem('partner_reorder', JSON.stringify(items))
    } catch {
      /* ignore storage errors */
    }
    router.push(getLocalizedPath('/partner-portal/order', locale))
  }

  const initial = (user?.name || user?.email || 'P').charAt(0).toUpperCase()
  const discountPct = Math.round(Number(user?.discountPercentage) || 0)

  return (
    <div className={`min-h-screen bg-gray-50 ${isAppLikeMode ? 'pb-28' : ''}`} dir={dir}>
      {/* Welcome toast */}
      {welcome && (
        <div className="fixed top-4 inset-x-4 z-50 mx-auto max-w-sm">
          <div className={`flex items-center gap-3 bg-gray-900 text-white rounded-xl px-4 py-3 shadow-lg ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
              <Check className="w-4 h-4" />
            </div>
            <p className="text-sm flex-1">{t(`Welcome back, ${user?.name || 'Partner'}`, `С возвращением, ${user?.name || 'Партнёр'}`, `مرحبًا بعودتك، ${user?.name || 'شريك'}`)}</p>
          </div>
        </div>
      )}

      {/* ── Corporate hero header (dark) ── */}
      <div className="bg-gray-950 text-white">
        <div className={`${isAppLikeMode ? 'px-5' : 'container mx-auto px-6 max-w-5xl'} pt-6 pb-8`}>
          <div className={`flex items-center justify-between mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <span className="text-lg font-black tracking-[0.2em] text-white">GENOSYS</span>
              <span className="text-[10px] font-semibold tracking-[0.25em] text-red-500 uppercase mt-0.5">Partner</span>
            </div>
            <button
              onClick={() => setShowSignOut(true)}
              className={`flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <LogOut className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
              <span className="hidden sm:inline">{t('Sign out', 'Выйти', 'خروج')}</span>
            </button>
          </div>

          <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="w-14 h-14 rounded-2xl bg-red-600 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl font-bold">{initial}</span>
            </div>
            <div className={`flex-1 min-w-0 ${isRTL ? 'text-right' : ''}`}>
              <h1 className="text-2xl font-bold tracking-tight truncate">{user?.name || t('Partner', 'Партнёр', 'شريك')}</h1>
              <div className={`flex items-center gap-2 mt-1.5 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 text-white text-xs font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-green-400" />
                  {t('Verified Partner', 'Проверенный партнёр', 'شريك موثّق')}
                </span>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-red-600 text-white text-xs font-bold">
                  {discountPct > 0 ? `−${discountPct}% ${t('pricing', 'цена', 'سعر')}` : t('Partner pricing', 'Партнёрская цена', 'سعر الشريك')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`${isAppLikeMode ? 'px-4' : 'container mx-auto px-6 max-w-5xl'} -mt-5`}>
        {/* Stats strip */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { icon: Package, value: String(stats.count), label: t('Orders', 'Заказов', 'الطلبات') },
            { icon: TrendingUp, value: `${stats.spent.toFixed(0)}`, label: t('Total AED', 'Всего AED', 'إجمالي AED') },
            { icon: Clock, value: stats.daysSince === null ? '—' : `${stats.daysSince}d`, label: t('Since last', 'С посл.', 'منذ الأخير') },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm px-3 py-4 text-center">
              <s.icon className="w-5 h-5 text-gray-300 mx-auto mb-1.5" />
              <p className="text-xl font-bold text-gray-900 leading-none">{s.value}</p>
              <p className="text-[11px] text-gray-400 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Reorder nudge */}
        {showReorderNudge && (
          <div className={`flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-4 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
            <RefreshCw className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <p className="text-sm text-amber-800 flex-1">
              {t(
                `It's been ${stats.daysSince} days since your last order — time to restock?`,
                `С последнего заказа прошло ${stats.daysSince} дн. — пора пополнить запас?`,
                `مرّ ${stats.daysSince} يومًا على آخر طلب — حان وقت إعادة التخزين؟`
              )}
            </p>
          </div>
        )}

        {/* Primary action */}
        <button
          onClick={() => router.push(getLocalizedPath('/partner-portal/order', locale))}
          className={`w-full flex items-center justify-between gap-3 bg-red-600 text-white rounded-2xl p-5 mb-5 shadow-lg shadow-red-600/20 hover:bg-red-700 active:bg-red-800 transition-colors ${isRTL ? 'flex-row-reverse text-right' : ''}`}
        >
          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center">
              <Plus className="w-6 h-6" />
            </div>
            <div className={isRTL ? 'text-right' : 'text-left'}>
              <p className="font-bold text-base">{t('New Order', 'Новый заказ', 'طلب جديد')}</p>
              <p className="text-xs text-white/80">{discountPct > 0 ? t(`Order at −${discountPct}% partner price`, `Заказ по цене −${discountPct}%`, `اطلب بسعر الشريك −${discountPct}%`) : t('Order at your partner price', 'Заказ по партнёрской цене', 'اطلب بسعر الشريك')}</p>
            </div>
          </div>
          <ChevronRight className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
        </button>

        {/* Order history */}
        <div className="mb-6">
          <div className={`flex items-center justify-between mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <h2 className="text-base font-bold text-gray-900">{t('Order history', 'История заказов', 'سجل الطلبات')}</h2>
            <button onClick={handleRefresh} disabled={refreshing} className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50" aria-label="refresh">
              <RefreshCw className={`w-4 h-4 text-gray-400 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => <div key={i} className="h-20 bg-white rounded-2xl border border-gray-100 animate-pulse" />)}
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
              <ShoppingBag className="w-12 h-12 text-gray-200 mx-auto mb-3" />
              <p className="text-sm font-medium text-gray-900 mb-1">{t('No orders yet', 'Заказов пока нет', 'لا توجد طلبات بعد')}</p>
              <p className="text-xs text-gray-400">{t('Place your first partner order above', 'Оформите первый заказ выше', 'قدّم طلبك الأول أعلاه')}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map(order => {
                const st = statusStyle(order.status)
                const isOpen = expanded.has(order.id)
                const items = order.items || []
                return (
                  <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <button onClick={() => toggle(order.id)} className={`w-full flex items-center gap-3 p-4 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                      <div className={`flex -space-x-2 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
                        {items.slice(0, 3).map((it, idx) => (
                          <div key={idx} className="w-11 h-11 rounded-lg bg-gray-100 border-2 border-white overflow-hidden relative flex-shrink-0">
                            <OrderThumb image={it.image ?? null} productId={it.productId} />
                          </div>
                        ))}
                        {items.length > 3 && (
                          <div className="w-11 h-11 rounded-lg bg-gray-200 border-2 border-white flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-semibold text-gray-600">+{items.length - 3}</span>
                          </div>
                        )}
                      </div>
                      <div className={`flex-1 min-w-0 ${isRTL ? 'text-right' : 'text-left'}`}>
                        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <p className="text-sm font-semibold text-gray-900 truncate">{order.orderNumber}</p>
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${st.bg} ${st.text}`}>{st.label(locale)}</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">{fmtDate(order.createdAt)} · {items.length} {items.length === 1 ? t('item', 'товар', 'منتج') : t('items', 'товаров', 'منتجات')}</p>
                      </div>
                      <div className={`flex items-center gap-1.5 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className="text-sm font-bold text-gray-900">{Number(order.total).toFixed(2)}</span>
                        <ChevronDown className={`w-4 h-4 text-gray-300 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                      </div>
                    </button>

                    {isOpen && (
                      <div className="px-4 pb-4 border-t border-gray-50 pt-3">
                        <div className="space-y-2.5">
                          {items.map((it, idx) => (
                            <div key={idx} className={`flex items-center justify-between gap-3 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                              <div className={`flex-1 min-w-0 ${isRTL ? 'text-right' : ''}`}>
                                <p className="text-sm text-gray-900 leading-tight">{it.productName}</p>
                                <p className="text-xs text-gray-400">{t('Qty', 'Кол-во', 'الكمية')}: {it.quantity}{it.size ? ` · ${it.size}` : ''}</p>
                              </div>
                              <span className="text-sm font-medium text-gray-900 flex-shrink-0">{(Number(it.price) * it.quantity).toFixed(2)} AED</span>
                            </div>
                          ))}
                        </div>
                        <div className={`flex items-center justify-between mt-3 pt-3 border-t border-gray-100 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <span className="text-sm font-semibold text-gray-900">{t('Total', 'Итого', 'الإجمالي')}</span>
                          <span className="text-base font-bold text-red-600">{Number(order.total).toFixed(2)} AED</span>
                        </div>
                        <button
                          onClick={() => reorder(order)}
                          className={`mt-3 w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-black transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
                        >
                          <RefreshCw className="w-4 h-4" />
                          {t('Reorder these items', 'Повторить заказ', 'إعادة طلب هذه المنتجات')}
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {!isAppLikeMode && (
          <div className="text-center pb-8">
            <button onClick={() => router.push(getLocalizedPath('/products', locale))} className="text-sm text-gray-400 hover:text-gray-600">
              {t('Back to shop', 'Вернуться в магазин', 'العودة للمتجر')}
            </button>
          </div>
        )}
      </div>

      {/* Sign-out confirm */}
      {showSignOut && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6">
            <div className={`flex items-center gap-3 mb-5 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
              <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                <LogOut className="w-6 h-6 text-red-600" />
              </div>
              <div className={isRTL ? 'text-right' : ''}>
                <h3 className="text-lg font-bold text-gray-900">{t('Sign out?', 'Выйти?', 'تسجيل الخروج؟')}</h3>
                <p className="text-sm text-gray-500">{t('You can sign back in anytime', 'Вы можете войти снова в любое время', 'يمكنك تسجيل الدخول مرة أخرى')}</p>
              </div>
            </div>
            <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <button onClick={() => setShowSignOut(false)} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors">
                {t('Cancel', 'Отмена', 'إلغاء')}
              </button>
              <button onClick={() => logout()} className="flex-1 bg-red-600 text-white py-3 rounded-xl font-medium hover:bg-red-700 transition-colors">
                {t('Sign out', 'Выйти', 'خروج')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function PartnerDashboardPage() {
  return (
    <PartnerGuard>
      <PartnerDashboardInner />
    </PartnerGuard>
  )
}
