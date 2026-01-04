'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { RefreshCw, Check, AlertCircle, ShoppingBag } from 'lucide-react'
import { useCart } from '@/components/CartProvider'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { Product } from '@/types'
import { useHapticFeedback } from '@/hooks/useHapticFeedback'

interface OrderItem {
  productId?: string | null
  productName: string
  quantity: number
  price: number | string
  image?: string | null
  size?: string | null
  color?: string | null
}

interface QuickReorderButtonProps {
  orderItems: OrderItem[]
  orderNumber?: string // Used for analytics/logging
  className?: string
  variant?: 'button' | 'icon' | 'link'
  showToCart?: boolean
}

type ReorderStatus = 'idle' | 'loading' | 'success' | 'partial' | 'error'

interface ReorderResult {
  added: number
  failed: number
  failedItems: string[]
}

export function QuickReorderButton({
  orderItems,
  orderNumber: _orderNumber, // Kept for future analytics
  className,
  variant = 'button',
  showToCart = true,
}: QuickReorderButtonProps) {
  const { locale, dir } = useTranslation()
  const { addItem } = useCart()
  const router = useRouter()
  const haptic = useHapticFeedback()
  const [status, setStatus] = useState<ReorderStatus>('idle')
  const [result, setResult] = useState<ReorderResult | null>(null)
  const isRTL = dir === 'rtl'

  // Translations
  const translations = {
    reorder: locale === 'ar' ? 'إعادة الطلب' : locale === 'ru' ? 'Повторить' : 'Reorder',
    reordering: locale === 'ar' ? 'جاري الإضافة...' : locale === 'ru' ? 'Добавление...' : 'Adding...',
    added: locale === 'ar' ? 'تمت الإضافة!' : locale === 'ru' ? 'Добавлено!' : 'Added!',
    viewCart: locale === 'ar' ? 'عرض السلة' : locale === 'ru' ? 'Корзина' : 'View Cart',
    error: locale === 'ar' ? 'حدث خطأ' : locale === 'ru' ? 'Ошибка' : 'Error',
    someAdded: (added: number, total: number) => 
      locale === 'ar' 
        ? `تمت إضافة ${added} من ${total} منتج` 
        : locale === 'ru' 
          ? `Добавлено ${added} из ${total}` 
          : `Added ${added} of ${total} items`,
  }

  const handleReorder = useCallback(async () => {
    if (status === 'loading') return

    setStatus('loading')
    setResult(null)

    let addedCount = 0
    let failedCount = 0
    const failedItems: string[] = []

    try {
      // Fetch product details for each item
      for (const item of orderItems) {
        try {
          // If we have productId, fetch the current product data
          if (item.productId) {
            const response = await fetch(`/api/products/${item.productId}`)
            
            if (response.ok) {
              const productData = await response.json()
              const product: Product = productData.product || productData

              // Add to cart with original quantity and variants
              addItem(product, item.quantity, item.color || undefined, item.size || undefined)
              addedCount++
            } else {
              // Product not found - might be discontinued
              failedItems.push(item.productName)
              failedCount++
            }
          } else {
            // No productId - try to find by name
            const searchResponse = await fetch(`/api/products?search=${encodeURIComponent(item.productName)}&limit=1`)
            
            if (searchResponse.ok) {
              const searchData = await searchResponse.json()
              const products = searchData.products || searchData.data || []
              
              if (products.length > 0) {
                addItem(products[0], item.quantity, item.color || undefined, item.size || undefined)
                addedCount++
              } else {
                failedItems.push(item.productName)
                failedCount++
              }
            } else {
              failedItems.push(item.productName)
              failedCount++
            }
          }
        } catch {
          failedItems.push(item.productName)
          failedCount++
        }
      }

      // Set result
      setResult({ added: addedCount, failed: failedCount, failedItems })

      // Determine status and trigger haptic feedback
      if (addedCount === 0 && failedCount > 0) {
        setStatus('error')
        haptic.error()
      } else if (failedCount > 0) {
        setStatus('partial')
        haptic.warning()
      } else {
        setStatus('success')
        haptic.success()
      }

      // Reset after delay
      setTimeout(() => {
        setStatus('idle')
        setResult(null)
      }, 3000)

    } catch {
      setStatus('error')
      haptic.error()
      setTimeout(() => {
        setStatus('idle')
        setResult(null)
      }, 3000)
    }
  }, [orderItems, addItem, status])

  const handleGoToCart = useCallback(() => {
    router.push(getLocalizedPath('/cart', locale))
  }, [router, locale])

  // Icon variant
  if (variant === 'icon') {
    return (
      <button
        onClick={handleReorder}
        disabled={status === 'loading'}
        className={cn(
          'w-10 h-10 rounded-full flex items-center justify-center transition-all',
          status === 'idle' && 'bg-primary-50 text-primary-600 hover:bg-primary-100 active:scale-95',
          status === 'loading' && 'bg-primary-50 text-primary-600',
          status === 'success' && 'bg-green-50 text-green-600',
          status === 'partial' && 'bg-amber-50 text-amber-600',
          status === 'error' && 'bg-red-50 text-red-600',
          className
        )}
        title={translations.reorder}
        aria-label={translations.reorder}
      >
        {status === 'loading' ? (
          <RefreshCw className="w-5 h-5 animate-spin" />
        ) : status === 'success' || status === 'partial' ? (
          <Check className="w-5 h-5" />
        ) : status === 'error' ? (
          <AlertCircle className="w-5 h-5" />
        ) : (
          <RefreshCw className="w-5 h-5" />
        )}
      </button>
    )
  }

  // Link variant
  if (variant === 'link') {
    return (
      <button
        onClick={handleReorder}
        disabled={status === 'loading'}
        className={cn(
          'text-sm font-medium transition-colors',
          status === 'idle' && 'text-primary-600 hover:text-primary-700',
          status === 'loading' && 'text-primary-600',
          status === 'success' && 'text-green-600',
          status === 'partial' && 'text-amber-600',
          status === 'error' && 'text-red-600',
          className
        )}
      >
        {status === 'loading' ? (
          <span className="flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            {translations.reordering}
          </span>
        ) : status === 'success' ? (
          <span className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5" />
            {translations.added}
          </span>
        ) : status === 'partial' && result ? (
          <span className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5" />
            {translations.someAdded(result.added, orderItems.length)}
          </span>
        ) : status === 'error' ? (
          <span className="flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" />
            {translations.error}
          </span>
        ) : (
          <span className="flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" />
            {translations.reorder}
          </span>
        )}
      </button>
    )
  }

  // Button variant (default)
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <button
        onClick={handleReorder}
        disabled={status === 'loading'}
        className={cn(
          'flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all',
          status === 'idle' && 'bg-primary-600 text-white hover:bg-primary-700 active:scale-[0.98]',
          status === 'loading' && 'bg-primary-600 text-white cursor-wait',
          status === 'success' && 'bg-green-600 text-white',
          status === 'partial' && 'bg-amber-500 text-white',
          status === 'error' && 'bg-red-600 text-white',
          isRTL && 'flex-row-reverse'
        )}
      >
        {status === 'loading' ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin" />
            {translations.reordering}
          </>
        ) : status === 'success' ? (
          <>
            <Check className="w-4 h-4" />
            {translations.added}
          </>
        ) : status === 'partial' && result ? (
          <>
            <Check className="w-4 h-4" />
            {translations.someAdded(result.added, orderItems.length)}
          </>
        ) : status === 'error' ? (
          <>
            <AlertCircle className="w-4 h-4" />
            {translations.error}
          </>
        ) : (
          <>
            <RefreshCw className="w-4 h-4" />
            {translations.reorder}
          </>
        )}
      </button>

      {/* View Cart button - only show after success */}
      {showToCart && (status === 'success' || status === 'partial') && (
        <button
          onClick={handleGoToCart}
          className={cn(
            'flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium',
            'bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-[0.98] transition-all',
            isRTL && 'flex-row-reverse'
          )}
        >
          <ShoppingBag className="w-4 h-4" />
          {translations.viewCart}
        </button>
      )}
    </div>
  )
}

/**
 * Buy Again Section - Shows previous orders for quick reorder
 */
interface BuyAgainSectionProps {
  orders: Array<{
    id: string
    orderNumber: string
    items: OrderItem[]
    createdAt: Date | string
    status: string
  }>
  maxOrders?: number
  className?: string
}

export function BuyAgainSection({ orders, maxOrders = 3, className }: BuyAgainSectionProps) {
  const { locale, dir } = useTranslation()
  const isRTL = dir === 'rtl'

  // Only show completed orders
  const completedOrders = orders
    .filter(order => ['delivered', 'completed', 'shipped'].includes(order.status.toLowerCase()))
    .slice(0, maxOrders)

  if (completedOrders.length === 0) return null

  return (
    <div className={cn('space-y-4', className)}>
      <h3 className={cn(
        'text-lg font-bold text-gray-900',
        isRTL && 'text-right'
      )}>
        {locale === 'ar' ? 'شراء مرة أخرى' : locale === 'ru' ? 'Купить снова' : 'Buy Again'}
      </h3>
      
      <div className="space-y-3">
        {completedOrders.map(order => (
          <div
            key={order.id}
            className={cn(
              'bg-white border border-gray-100 rounded-xl p-4',
              'flex items-center justify-between gap-4',
              isRTL && 'flex-row-reverse'
            )}
          >
            <div className={cn('flex-1 min-w-0', isRTL && 'text-right')}>
              <p className="text-sm font-medium text-gray-900 truncate">
                {order.orderNumber}
              </p>
              <p className="text-xs text-gray-500">
                {order.items.length} {order.items.length === 1 
                  ? (locale === 'ar' ? 'منتج' : locale === 'ru' ? 'товар' : 'item')
                  : (locale === 'ar' ? 'منتجات' : locale === 'ru' ? 'товаров' : 'items')}
              </p>
            </div>
            
            <QuickReorderButton
              orderItems={order.items}
              orderNumber={order.orderNumber}
              variant="icon"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

