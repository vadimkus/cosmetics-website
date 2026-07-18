'use client'

import { useState } from 'react'
import { ArrowLeft, Upload, CheckCircle } from 'lucide-react'
import { Order, OrderItem } from '@prisma/client'
import { fetchCsrfToken, addCsrfToBody } from '@/lib/csrfClient'
import { errorLog } from '@/lib/logger'

// Custom type that includes the items relation
type OrderWithItems = Order & {
  items: OrderItem[]
}

interface OrderDetailsProps {
  order: OrderWithItems
  onBack: () => void
  onUpdateStatus: (orderId: string, status: string) => void
  getAdminHeaders: (additionalHeaders?: Record<string, string>) => HeadersInit
  showToast: (message: string, type: 'success' | 'error' | 'warning') => void
  onMoySkladPushed?: (orderId: string, moySkladOrderId: string) => void
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: 'AED'
  }).format(amount)
}

const roundMoney = (amount: number) => Math.round(amount * 100) / 100

const getBundleLinePricing = (item: OrderItem) => {
  const discountPercent = Number(item.bundleDiscount || 0)
  const unitPrice = Number(item.price || 0)

  if (!Number.isFinite(discountPercent) || discountPercent <= 0 || discountPercent >= 100 || unitPrice <= 0) {
    return null
  }

  const originalUnitPrice = roundMoney(unitPrice / (1 - discountPercent / 100))
  const originalLineTotal = roundMoney(originalUnitPrice * item.quantity)
  const discountedLineTotal = roundMoney(unitPrice * item.quantity)

  return {
    discountPercent,
    originalUnitPrice,
    originalLineTotal,
    discountedLineTotal,
    savings: roundMoney(originalLineTotal - discountedLineTotal)
  }
}

export default function OrderDetails({ order, onBack, onUpdateStatus, getAdminHeaders, showToast, onMoySkladPushed }: OrderDetailsProps) {
  const [pushingToMoySklad, setPushingToMoySklad] = useState(false)
  const [moySkladId, setMoySkladId] = useState<string | null>(order.moySkladOrderId)

  const computedBundleSavings = roundMoney(
    order.items.reduce((total, item) => total + (getBundleLinePricing(item)?.savings || 0), 0)
  )
  const storedBundleSavings = roundMoney(Number(order.bundleDiscountAmount || 0))
  const bundleSavings = storedBundleSavings > 0 ? storedBundleSavings : computedBundleSavings

  const pushToMoySklad = async () => {
    try {
      const csrfToken = await fetchCsrfToken()
      if (!csrfToken) {
        showToast('Security error: Could not verify request. Please refresh the page.', 'error')
        return
      }

      setPushingToMoySklad(true)
      const response = await fetch(`/api/admin/orders/${order.id}/push-moysklad`, {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify(addCsrfToBody({})),
      })

      const result = await response.json()

      if (result.success) {
        showToast(result.message || `Order #${order.orderNumber} pushed to MoySklad!`, 'success')
        setMoySkladId(result.moySkladOrderId)
        onMoySkladPushed?.(order.id, result.moySkladOrderId)
      } else {
        showToast(`MoySklad push failed: ${result.error}`, 'error')
      }
    } catch (error) {
      errorLog('Error pushing to MoySklad:', error)
      showToast('Error pushing order to MoySklad', 'error')
    } finally {
      setPushingToMoySklad(false)
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 active:text-gray-900 text-sm sm:text-base touch-manipulation"
        >
          <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="hidden xs:inline">Back to Orders</span>
          <span className="xs:hidden">Back</span>
        </button>
        <div className="text-xs sm:text-sm text-gray-500 break-all">
          Order #{order.id?.slice(-8) || 'N/A'}
        </div>
      </div>

      <div className="bg-white rounded-lg border p-4 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Customer Information</h3>
            <div className="space-y-2 text-xs sm:text-sm">
              <div className="break-words"><span className="font-medium">Name:</span> {order.customerName}</div>
              <div className="break-all"><span className="font-medium">Email:</span> {order.customerEmail}</div>
              <div className="break-words"><span className="font-medium">Phone:</span> {order.customerPhone}</div>
              <div className="break-words"><span className="font-medium">Address:</span> {order.customerAddress}</div>
            </div>
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Order Details</h3>
            <div className="space-y-2 text-xs sm:text-sm">
              <div className="break-words"><span className="font-medium">Date:</span> {new Date(order.createdAt).toLocaleString()}</div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <span className="font-medium">Status:</span> 
                <select
                  value={order.status}
                  onChange={(e) => onUpdateStatus(order.id, e.target.value)}
                  className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 touch-manipulation"
                >
                  <option value="PENDING">Pending</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="SHIPPED">Shipped</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
              <div className="break-words"><span className="font-medium">Total:</span> {formatCurrency(order.total)}</div>
              {/* MoySklad Push Button */}
              <div className="mt-3 pt-3 border-t border-gray-200">
                {moySkladId ? (
                  <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                    <CheckCircle className="h-4 w-4 flex-shrink-0" />
                    <span className="text-xs sm:text-sm font-medium">Synced to MoySklad</span>
                  </div>
                ) : (
                  <button
                    onClick={pushToMoySklad}
                    disabled={pushingToMoySklad}
                    className="flex items-center gap-2 px-4 py-2.5 bg-orange-50 text-orange-700 border border-orange-300 rounded-lg hover:bg-orange-100 active:bg-orange-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm font-medium w-full sm:w-auto justify-center touch-manipulation"
                  >
                    <Upload className="h-4 w-4" />
                    {pushingToMoySklad ? 'Pushing to MoySklad...' : 'Push to MoySklad'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Order Items</h3>
        <div className="space-y-3 mb-4 sm:mb-6">
          {order.items.map((item) => {
            const bundlePricing = getBundleLinePricing(item)
            const isFreeItem = Number(item.price || 0) === 0
            const visibleSize = item.size && item.size !== '__PROMO__' ? item.size : null

            return (
              <div key={item.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm sm:text-base break-words">{item.productName}</div>
                  <div className="flex flex-wrap items-center gap-2 mt-1 text-xs sm:text-sm text-gray-600">
                    <span>Quantity: {item.quantity}</span>
                    {bundlePricing && (
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-green-700">
                        -{Math.round(bundlePricing.discountPercent)}% Bundle
                      </span>
                    )}
                    {isFreeItem && (
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-green-700">
                        Free item
                      </span>
                    )}
                  </div>
                  {(item.color || visibleSize) && (
                    <div className="flex flex-wrap gap-2 sm:gap-4 mt-2">
                      {item.color && (
                        <div className="text-xs text-gray-600">
                          <span className="text-gray-500">Color:</span> <span className="font-semibold text-gray-800 bg-blue-50 px-2 py-0.5 rounded">{item.color}</span>
                        </div>
                      )}
                      {visibleSize && (
                        <div className="text-xs text-gray-600">
                          <span className="text-gray-500">Size:</span> <span className="font-semibold text-gray-800 bg-green-50 px-2 py-0.5 rounded">{visibleSize}</span>
                        </div>
                      )}
                    </div>
                  )}
                  {bundlePricing && (
                    <div className="mt-2 text-xs text-green-700">
                      Line total: <span className="line-through text-gray-500">{formatCurrency(bundlePricing.originalLineTotal)}</span>{' '}
                      <span className="font-semibold">{formatCurrency(bundlePricing.discountedLineTotal)}</span>
                      <span className="text-green-600"> · saved {formatCurrency(bundlePricing.savings)}</span>
                    </div>
                  )}
                </div>
                <div className="text-right sm:text-left sm:ml-4">
                  {bundlePricing ? (
                    <>
                      <div className="text-xs text-gray-500 line-through">{formatCurrency(bundlePricing.originalUnitPrice)}</div>
                      <div className="font-medium text-sm sm:text-base text-green-700">{formatCurrency(item.price)}</div>
                    </>
                  ) : isFreeItem ? (
                    <div className="font-bold text-sm sm:text-base text-green-700">FREE</div>
                  ) : (
                    <div className="font-medium text-sm sm:text-base">{formatCurrency(item.price)}</div>
                  )}
                  {!isFreeItem && <div className="text-xs sm:text-sm text-gray-600">each</div>}
                </div>
              </div>
            )
          })}
        </div>

        {/* Order Breakdown */}
        <div className="bg-gray-50 rounded-lg p-4 sm:p-5">
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Order Breakdown</h3>
          <div className="space-y-2 text-sm sm:text-base">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium">{formatCurrency(order.subtotal)}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount ({Math.round((order.discountAmount / (order.subtotal + order.discountAmount)) * 100)}%):</span>
                <span className="font-medium">-{formatCurrency(order.discountAmount)}</span>
              </div>
            )}
            {bundleSavings > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Bundle savings included:</span>
                <span className="font-medium">{formatCurrency(bundleSavings)}</span>
              </div>
            )}
            {Number(order.loyaltyDiscountAmount || 0) > 0 && Number(order.loyaltyPointsRedeemed || 0) > 0 && (
              <div className="flex justify-between text-blue-600">
                <span>GENOSYS Rewards ({Number(order.loyaltyPointsRedeemed).toLocaleString()} pts):</span>
                <span className="font-medium">-{formatCurrency(Number(order.loyaltyDiscountAmount))}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping:</span>
              <span className="font-medium">{formatCurrency(order.shipping)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">VAT (5%):</span>
              <span className="font-medium">{formatCurrency(order.vat)}</span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between text-base sm:text-lg font-semibold">
              <span>Total:</span>
              <span className="text-red-600">{formatCurrency(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Additional Order Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mt-4 sm:mt-6">
          <div className="bg-blue-50 rounded-lg p-3 sm:p-4">
            <h4 className="text-sm sm:text-base font-semibold text-blue-800 mb-2">Delivery Information</h4>
            <div className="space-y-1 text-xs sm:text-sm">
              <div className="break-words"><span className="font-medium">Emirate:</span> {order.customerEmirate}</div>
              <div className="break-words"><span className="font-medium">Address:</span> {order.customerAddress}</div>
              <div className="break-words"><span className="font-medium">Phone:</span> {order.customerPhone}</div>
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-3 sm:p-4">
            <h4 className="text-sm sm:text-base font-semibold text-green-800 mb-2">Order Summary</h4>
            <div className="space-y-1 text-xs sm:text-sm">
              <div className="break-all"><span className="font-medium">Order Number:</span> {order.orderNumber}</div>
              <div><span className="font-medium">Items Count:</span> {order.items.length}</div>
              <div><span className="font-medium">Created:</span> {new Date(order.createdAt).toLocaleDateString()}</div>
              <div><span className="font-medium">Updated:</span> {new Date(order.updatedAt).toLocaleDateString()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
