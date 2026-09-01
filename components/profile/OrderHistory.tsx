'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { Package, ShoppingBag, Calendar, X, CreditCard, Truck, CheckCircle, Clock, Fish, FileText, Loader2, MapPin } from 'lucide-react'
import { Order, OrderItem } from '@prisma/client'
import StatusBadge from '@/components/shared/StatusBadge'
import EmptyState from '@/components/shared/EmptyState'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'
import { motion } from 'framer-motion'
import { useAnimationStore } from '@/lib/animationStore'
import { fetchCsrfToken, getCsrfHeaders, addCsrfToBody } from '@/lib/csrfClient'
import { useAuth } from '@/components/auth/AuthProvider'
import { errorLog } from '@/lib/logger'

// Custom type that includes the items relation
type OrderWithItems = Order & {
  items: OrderItem[]
}

interface OrderHistoryProps {
  orders: OrderWithItems[]
  loadingOrders: boolean
  onCancelOrder: (orderId: string) => void
}

export default function OrderHistory({ orders, loadingOrders, onCancelOrder }: OrderHistoryProps) {
  const { t, locale, dir } = useTranslation()
  const { enabled: animationsEnabled } = useAnimationStore()
  const { user } = useAuth()
  const [generatingInvoiceId, setGeneratingInvoiceId] = useState<string | null>(null)
  const [invoiceSuccess, setInvoiceSuccess] = useState<string | null>(null)
  const [invoiceError, setInvoiceError] = useState<string | null>(null)
  const invoiceTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Clean up timer on unmount
  useEffect(() => () => { if (invoiceTimerRef.current) clearTimeout(invoiceTimerRef.current) }, [])

  // Generate and send invoice for a completed order
  const generateInvoice = async (order: OrderWithItems) => {
    // Determine the email to send to
    // For Apple users, prefer contactEmail
    let customerEmail = order.customerEmail
    if (user?.appleSub && user?.contactEmail) {
      customerEmail = user.contactEmail
    }

    setGeneratingInvoiceId(order.id)
    setInvoiceSuccess(null)
    setInvoiceError(null)

    try {
      // Ensure CSRF token is available
      const csrfToken = await fetchCsrfToken()
      if (!csrfToken) {
        setInvoiceError(order.id)
        setGeneratingInvoiceId(null)
        return
      }

      const invoiceData = {
        orderNumber: order.orderNumber,
        customerEmail: customerEmail,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        customerAddress: order.customerAddress,
        emirate: order.customerEmirate,
        items: order.items.map(item => ({
          id: item.productId,
          name: item.productName,
          image: item.image,
          price: item.price,
          quantity: item.quantity,
          total: item.price * item.quantity,
          size: item.size,
          color: item.color
        })),
        subtotal: order.subtotal,
        shippingCost: order.shipping,
        vatAmount: order.vat,
        total: order.total,
        locale: order.locale || locale,
        // Pass discount data for waterfall breakdown display
        ...(order.discountAmount ? { discountAmount: order.discountAmount } : {}),
        ...(order.bundleDiscountPercentage ? { bundleDiscountPercentage: order.bundleDiscountPercentage } : {}),
        ...(order.bundleDiscountAmount ? { bundleDiscountAmount: order.bundleDiscountAmount } : {}),
        // User discount percentage from the user object (if available)
        ...(user?.discountPercentage ? { discountPercentage: Number(user.discountPercentage) } : {})
      }

      const response = await fetch('/api/invoice/generate', {
        method: 'POST',
        headers: getCsrfHeaders(),
        body: JSON.stringify(addCsrfToBody(invoiceData)),
      })

      if (response.ok) {
        setInvoiceSuccess(order.id)
        invoiceTimerRef.current = setTimeout(() => setInvoiceSuccess(null), 3000)
      } else {
        throw new Error('Failed to generate invoice')
      }
    } catch (error) {
      errorLog('Error generating invoice:', error)
      setInvoiceError(order.id)
      invoiceTimerRef.current = setTimeout(() => setInvoiceError(null), 3000)
    } finally {
      setGeneratingInvoiceId(null)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(locale === 'ar' ? 'ar-AE' : 'en-AE', {
      style: 'currency',
      currency: 'AED',
      minimumFractionDigits: 2
    }).format(amount)
  }

  const getProductImage = (productName: string) => {
    const imageMap: Record<string, string> = {
      // Add your product image mappings here
      'Microneedle Roller': '/images/genosys-microneedling-devices.jpg',
      'Needle Pen-K': '/images/Needle-pen.jpg',
      'SNOW O₂ CLEANSER': '/images/cleanser/main_clean.jpeg',
      'SNOW BOOSTER': '/images/BOOS.jpg',
      'MULTI VITA RADIANCE CREAM': '/images/radiance/main.jpeg',
      'MULTI VITA RADIANCE SERUM': '/images/radiance_serum/main.jpeg',
      'MULTI FUNCTIONAL ANTI-WRINKLE SERUM': '/images/multif_serum/main.jpeg',
      'MULTI FUNCTIONAL ANTI-WRINKLE CREAM': '/images/multifunc_cream/main.jpeg',
      'INTENSIVE PROBLEM CONTROL CREAM': '/images/problem_cream/main.jpeg',
      'MOISTURE REPLENISHING HYALURON SERUM': '/images/hyaluron_serum/main.jpeg',
      'ALL FOR SENSITIVE SERUM': '/images/sensitive_serum/main.jpeg',
      'PROBLEM CONTROL SERUM': '/images/problems_serum/main.jpeg',
      'HR³ MATRIX HAIR TONIC α': '/images/hair_tonic/main-v2.jpeg',
      'ND Cell ANTI-WRINKLE CREAM': '/images/nd_cell_o/Main.jpeg',
      'SOOTHING REPAIR POSTCREAM': '/images/soothing_rep_o/Main.jpeg',
      'SKIN RENEWAL PEELING SYSTEM (SRS)': '/images/srs_2_new/main.jpeg',
      'PEPTIDE GEL MASK': '/images/peptide_mask/main.jpeg',
      'SKIN RESCUE OVERNIGHT CREAM MASK': '/images/overnight/main.jpeg',
      'SOOTHING BOMB SEA ALGAE MASK': '/images/sea_algae/Main.jpeg',
      'MULTI SUN CREAM [SPF 40 PA++]': '/images/sun/main.jpeg',
      'ULTRA SHIELD SUN CREAM [SPF 50+ PA++++]': '/images/ultra/main.jpeg',
      'BIO-FERMENT AGE DEFYING POWDER MASK': '/images/BFAD.png',
      'SKIN REBOOT PDRN MASK PACK': '/images/REB.png',
      'Test Product': '/images/genosys-logo-transparent.png',
      'Support Product': '/images/genosys-logo-transparent.png'
    }
    
    return imageMap[productName] || '/images/genosys-logo-transparent.png'
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CreditCard className="h-4 w-4" />
      case 'shipped':
        return <Truck className="h-4 w-4" />
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />
      case 'cancelled':
        return <X className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getOrderIcon = (orderNumber: string | null) => {
    // Use pot emoji for SUP orders
    if (orderNumber && orderNumber.startsWith('SUP')) {
      return <span className="text-base md:text-xl">🍲</span>
    }
    // Use fish icon for COD orders
    if (orderNumber && orderNumber.startsWith('COD')) {
      return <Fish className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
    }
    // Default Package icon for other orders
    return <Package className="h-4 w-4 md:h-5 md:w-5 text-[var(--cera-body)]" />
  }

  return (
    <div className="rounded-3xl border border-[var(--cera-line)] bg-white p-5 shadow-[0_14px_40px_-28px_rgba(23,20,15,0.26)] sm:p-6 lg:p-8">
      <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
        <div className="rounded-xl bg-[var(--cera-cream-deep)] p-2 md:p-3">
          <Package className="h-4 w-4 text-[var(--cera-body)] md:h-6 md:w-6" />
        </div>
        <h2 className="text-lg font-semibold tracking-tight text-[var(--cera-ink)] md:text-2xl">{t('profile.orderHistory')}</h2>
      </div>
      
      {loadingOrders ? (
        <div className="text-center py-8 md:py-12">
          <div className="animate-spin rounded-full h-8 w-8 md:h-12 md:w-12 border-b-2 border-red-600 mx-auto mb-3 md:mb-4"></div>
          <p className="text-[var(--cera-muted)] text-sm md:text-base">{t('profile.loadingYourOrders')}</p>
        </div>
      ) : orders.length === 0 ? (
        <EmptyState
          icon={
            <div className="relative">
              <motion.div
                animate={animationsEnabled ? {
                  y: [0, -10, 0],
                  rotate: [0, 3, -3, 0],
                  scale: [1, 1.05, 1]
                } : {}}
                transition={animationsEnabled ? {
                  duration: 4.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                } : {}}
                className="relative"
              >
                <Image
                  src="/images/avatar/uni.png"
                  alt="No orders"
                  width={120}
                  height={120}
                  className="mx-auto w-auto h-auto max-w-[108px] md:max-w-[120px]"
                  priority
                />
                
                {/* Shopping bag floating around Uni */}
                {animationsEnabled && (
                  <>
                    <motion.div
                      className="absolute -top-2 -right-2"
                      animate={{
                        y: [0, -8, 0],
                        x: [0, 4, 0],
                        rotate: [0, 10, 0]
                      }}
                      transition={{
                        duration: 2.8,
                        repeat: Infinity,
                        delay: 0.3,
                        ease: "easeInOut"
                      }}
                    >
                      <ShoppingBag className="w-5 h-5 text-[var(--cera-blush-deep)] opacity-60" />
                    </motion.div>
                    <motion.div
                      className="absolute top-2 -left-3"
                      animate={{
                        y: [0, -6, 0],
                        x: [0, -3, 0],
                        rotate: [0, -8, 0]
                      }}
                      transition={{
                        duration: 3.2,
                        repeat: Infinity,
                        delay: 1,
                        ease: "easeInOut"
                      }}
                    >
                      <Package className="w-4 h-4 text-[var(--cera-blush-deep)] opacity-50" />
                    </motion.div>
                  </>
                )}
              </motion.div>
            </div>
          }
          title={t('profile.noOrdersYet')}
          action={{
            label: t('profile.browseProducts'),
            href: getLocalizedPath('/products', locale),
            onClick: () => {}
          }}
          buttonClassName="bg-[var(--cera-rose)] text-white hover:bg-[var(--cera-rose-ink)] active:bg-red-800 font-semibold"
        />
      ) : (
        <div className="space-y-3 md:space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl md:rounded-2xl border border-[var(--cera-line)] shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
              {/* Order Header */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-3 md:px-6 py-3 md:py-4 border-b border-[var(--cera-line)]">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 md:gap-3">
                  <div className="flex items-center gap-2 md:gap-4">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shadow-sm ${
                        order.orderNumber?.startsWith('SUP') ? 'bg-orange-50' : 
                        order.orderNumber?.startsWith('COD') ? 'bg-blue-50' : 
                        'bg-white'
                      }`}>
                        {getOrderIcon(order.orderNumber)}
                      </div>
                      <div>
                        <h3 className="text-sm md:text-lg font-bold text-[var(--cera-ink)]">{t('profile.order')} #{order.orderNumber || order.id}</h3>
                        <p className="text-xs md:text-sm text-[var(--cera-body)]">
                          {new Date(order.createdAt).toLocaleDateString(locale === 'ar' ? 'ar-AE' : 'en-AE', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 md:gap-3">
                    <StatusBadge
                      status={order.status}
                      icon={getStatusIcon(order.status)}
                      className="px-2 md:px-4 py-1.5 md:py-2 text-xs md:text-sm border"
                    />
                    <div className="text-right">
                      <p className="text-base md:text-xl font-bold text-[var(--cera-ink)]">{formatCurrency(order.total)}</p>
                      <p className="text-[10px] md:text-xs text-[var(--cera-muted)]">
                        {order.items.reduce((sum, item) => sum + item.quantity, 0)} {t('profile.items')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Content */}
              <div className="p-3 md:p-6">
                <div className="mb-3 md:mb-4">
                  <h4 className="text-xs md:text-sm font-semibold text-[var(--cera-body)] mb-2 md:mb-3 flex items-center gap-1.5 md:gap-2">
                    <ShoppingBag className="h-3.5 w-3.5 md:h-4 md:w-4" />
                    {t('profile.productsOrdered')}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">
                    {(order.items || []).slice(0, 6).map((item, index) => {
                      // Use item.image if available, otherwise fallback to getProductImage
                      const imageSrc = item.image || getProductImage(item.productName);
                      return (
                      <div key={index} className="flex items-center gap-2 md:gap-3 bg-[var(--cera-cream-deep)] rounded-lg md:rounded-xl p-2 md:p-3 border border-[var(--cera-line)] hover:bg-[var(--cera-cream-deep)] transition-colors">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-md md:rounded-lg flex items-center justify-center overflow-hidden shadow-sm border border-[var(--cera-line)] flex-shrink-0">
                          <Image
                            src={imageSrc}
                            alt={item.productName}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                            onError={(event) => {
                              event.currentTarget.src = '/images/genosys-logo-transparent.png'
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs md:text-sm font-medium text-[var(--cera-ink)] truncate">
                            {item.productName}
                          </p>
                          <div className="flex items-center gap-1.5 md:gap-2 text-[10px] md:text-xs text-[var(--cera-body)]">
                            <span>Qty: {item.quantity}</span>
                            <span>•</span>
                            <span className="font-medium text-[var(--cera-ink)]">{formatCurrency(item.price * item.quantity)}</span>
                          </div>
                        </div>
                      </div>
                      );
                    })}
                    {order.items.length > 6 && (
                      <div className="flex items-center justify-center bg-[var(--cera-cream-deep)] rounded-lg md:rounded-xl p-2 md:p-3 border border-[var(--cera-line)]">
                        <span className="text-xs md:text-sm text-[var(--cera-body)] font-medium">
                          +{order.items.length - 6} {t('common.products')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Actions */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between pt-3 md:pt-4 border-t border-[var(--cera-line)] gap-2 md:gap-3">
                  <div className={`flex items-center gap-1.5 md:gap-2 text-xs md:text-sm text-[var(--cera-body)] ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    <Calendar className="h-3.5 w-3.5 md:h-4 md:w-4" />
                    <span>{t('profile.orderedOn')} {new Date(order.createdAt).toLocaleDateString(locale === 'ar' ? 'ar-AE' : 'en-AE', { 
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Track Order link */}
                    <Link
                      href={`/track/${order.orderNumber || order.id}`}
                      className={`inline-flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-[var(--cera-blush)] text-[var(--cera-rose-ink)] text-xs md:text-sm rounded-lg hover:bg-[var(--cera-blush)] transition-colors font-medium border border-[var(--cera-blush-deep)] min-h-[36px] md:min-h-[44px] touch-manipulation ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
                    >
                      <MapPin className="h-3.5 w-3.5 md:h-4 md:w-4" />
                      {locale === 'ar' ? 'تتبع الطلب' : locale === 'ru' ? 'Отследить' : 'Track Order'}
                    </Link>
                    {/* Invoice button for delivered orders */}
                    {order.status.toLowerCase() === 'delivered' && (
                      <button
                        onClick={() => generateInvoice(order)}
                        disabled={generatingInvoiceId === order.id}
                        className={`inline-flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm rounded-lg transition-colors font-medium min-h-[36px] md:min-h-[44px] touch-manipulation ${
                          invoiceSuccess === order.id 
                            ? 'bg-[var(--cera-ok-bg)] text-[var(--cera-ok)] border border-[var(--cera-ok-line)]'
                            : invoiceError === order.id
                            ? 'bg-red-100 text-red-700 border border-red-200'
                            : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
                        } ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
                      >
                        {generatingInvoiceId === order.id ? (
                          <>
                            <Loader2 className="h-3.5 w-3.5 md:h-4 md:w-4 animate-spin" />
                            {t('profile.generating')}
                          </>
                        ) : invoiceSuccess === order.id ? (
                          <>
                            <CheckCircle className="h-3.5 w-3.5 md:h-4 md:w-4" />
                            {t('profile.invoiceSent')}
                          </>
                        ) : invoiceError === order.id ? (
                          <>
                            <X className="h-3.5 w-3.5 md:h-4 md:w-4" />
                            {t('profile.invoiceFailed')}
                          </>
                        ) : (
                          <>
                            <FileText className="h-3.5 w-3.5 md:h-4 md:w-4" />
                            {t('profile.getInvoice')}
                          </>
                        )}
                      </button>
                    )}
                    {/* Cancel button for pending/paid orders */}
                    {(order.status === 'pending' || order.status === 'paid') && (
                      <button
                        onClick={() => onCancelOrder(order.id)}
                        className={`inline-flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-red-50 text-red-700 text-xs md:text-sm rounded-lg hover:bg-red-100 transition-colors font-medium border border-red-200 min-h-[36px] md:min-h-[44px] touch-manipulation ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
                      >
                        <X className="h-3.5 w-3.5 md:h-4 md:w-4" />
                        {t('profile.cancelOrder')}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}