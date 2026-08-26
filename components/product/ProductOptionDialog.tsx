'use client'

import Image from 'next/image'
import { createPortal } from 'react-dom'
import {
  AlertTriangle,
  LoaderCircle,
  Minus,
  Plus,
  RefreshCw,
  ShoppingBag,
  X,
} from 'lucide-react'
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import { useIsMobile } from '@/hooks/useIsMobile'
import { getPricingDisplay, formatAed } from '@/lib/pricingDisplay'
import {
  extractProductOptions,
  getInitialProductSelection,
  isOptionAvailable,
  isProductSelectionComplete,
  type ProductOptionSelection,
} from '@/lib/productOptions'
import { MAX_LINE_QUANTITY } from '@/lib/cartStore'
import type { Product } from '@/types'
import type { User } from '@/types/user'

interface ProductOptionDialogProps {
  open: boolean
  product: Product
  user: User | null
  isAdding: boolean
  onClose: () => void
  onConfirm: (
    product: Product,
    selection: ProductOptionSelection,
    quantity: number,
  ) => void | Promise<void>
}

const focusableSelector = [
  'button:not([disabled])',
  '[href]',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

function localizedProductName(product: Product, locale: string): string {
  if (locale === 'ar') return product.nameAr || product.name
  if (locale === 'ru') return product.nameRu || product.name
  return product.name
}

export default function ProductOptionDialog({
  open,
  product,
  user,
  isAdding,
  onClose,
  onConfirm,
}: ProductOptionDialogProps) {
  const { t, locale, dir } = useTranslation()
  const { isMobile, isClient } = useIsMobile()
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const previouslyFocusedRef = useRef<HTMLElement | null>(null)
  const scrollYRef = useRef(0)
  const submittedRef = useRef(false)
  const dragStartRef = useRef<number | null>(null)
  const isAddingRef = useRef(isAdding)
  const historyMarkerRef = useRef('')
  const [canonicalProduct, setCanonicalProduct] = useState(product)
  const [selection, setSelection] = useState<ProductOptionSelection>(
    getInitialProductSelection(product),
  )
  const [quantity, setQuantity] = useState(1)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [refreshError, setRefreshError] = useState('')
  const [refreshNonce, setRefreshNonce] = useState(0)
  const [dragOffset, setDragOffset] = useState(0)
  const [mounted, setMounted] = useState(false)

  const model = useMemo(
    () => extractProductOptions(canonicalProduct),
    [canonicalProduct],
  )
  const pricing = useMemo(
    () => getPricingDisplay(canonicalProduct, user, selection),
    [canonicalProduct, selection, user],
  )
  const localizedName = localizedProductName(canonicalProduct, locale)
  const isComplete = isProductSelectionComplete(canonicalProduct, selection)
  const canConfirm =
    !isAdding &&
    !isRefreshing &&
    canonicalProduct.inStock &&
    isComplete &&
    !model.missingOptionData
  const presentation = isClient && isMobile ? 'sheet' : 'dialog'

  const close = useCallback(() => {
    if (isAddingRef.current) return
    onClose()
    if (
      historyMarkerRef.current &&
      window.history.state?.genosysProductOptions === historyMarkerRef.current
    ) {
      window.history.back()
    }
  }, [onClose])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    isAddingRef.current = isAdding
  }, [isAdding])

  useEffect(() => {
    if (!open) return
    setCanonicalProduct(product)
    setSelection(getInitialProductSelection(product))
    setQuantity(1)
    setRefreshError('')
    setDragOffset(0)
    submittedRef.current = false
  }, [open, product])

  useEffect(() => {
    if (!open) return

    const controller = new AbortController()
    const productId = product.productNumber || product.id
    setIsRefreshing(true)
    setRefreshError('')

    fetch(`/api/products/${encodeURIComponent(productId)}`, {
      cache: 'no-store',
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        return response.json() as Promise<Product>
      })
      .then((freshProduct) => {
        setCanonicalProduct(freshProduct)
        setSelection((current) => {
          const freshModel = extractProductOptions(freshProduct)
          const selectedSize = freshModel.sizes.some(
            (option) => option.value === current.selectedSize,
          )
            ? current.selectedSize
            : ''
          const selectedColor = freshModel.colors.some(
            (option) => option.value === current.selectedColor,
          )
            ? current.selectedColor
            : ''
          if (selectedSize || selectedColor) return { selectedSize, selectedColor }
          return getInitialProductSelection(freshProduct)
        })
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return
        setRefreshError(t('product.optionRefreshError'))
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsRefreshing(false)
      })

    return () => controller.abort()
  }, [open, product.id, product.productNumber, refreshNonce, t])

  useEffect(() => {
    if (!open) return

    previouslyFocusedRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null
    scrollYRef.current = window.scrollY
    const body = document.body
    const previousStyles = {
      overflow: body.style.overflow,
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
    }
    body.style.overflow = 'hidden'
    body.style.position = 'fixed'
    body.style.top = `-${scrollYRef.current}px`
    body.style.width = '100%'
    historyMarkerRef.current = product.id
    window.history.pushState({ ...window.history.state, genosysProductOptions: product.id }, '')
    const focusTimer = window.setTimeout(() => closeButtonRef.current?.focus(), 0)

    const handlePopState = () => {
      historyMarkerRef.current = ''
      if (!isAddingRef.current) onClose()
    }
    window.addEventListener('popstate', handlePopState)

    return () => {
      window.clearTimeout(focusTimer)
      window.removeEventListener('popstate', handlePopState)
      body.style.overflow = previousStyles.overflow
      body.style.position = previousStyles.position
      body.style.top = previousStyles.top
      body.style.width = previousStyles.width
      window.scrollTo(0, scrollYRef.current)
      previouslyFocusedRef.current?.focus()
    }
  }, [onClose, open, product.id])

  useEffect(() => {
    if (!open) return
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        close()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [close, open])

  const trapFocus = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Tab' || !dialogRef.current) return
    const focusable = Array.from(
      dialogRef.current.querySelectorAll<HTMLElement>(focusableSelector),
    )
    if (focusable.length === 0) return
    const first = focusable[0]!
    const last = focusable[focusable.length - 1]!
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  const selectOption = (dimension: 'size' | 'color', value: string) => {
    const next =
      dimension === 'size'
        ? { ...selection, selectedSize: value }
        : { ...selection, selectedColor: value }
    if (
      dimension === 'size' &&
      next.selectedColor &&
      !isOptionAvailable(model, 'color', next.selectedColor, next)
    ) {
      next.selectedColor = ''
    }
    if (
      dimension === 'color' &&
      next.selectedSize &&
      !isOptionAvailable(model, 'size', next.selectedSize, next)
    ) {
      next.selectedSize = ''
    }
    setSelection(next)
  }

  const handleConfirm = async () => {
    if (!canConfirm || submittedRef.current) return
    submittedRef.current = true
    try {
      await onConfirm(canonicalProduct, selection, quantity)
    } finally {
      submittedRef.current = false
    }
  }

  const handleDragStart = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (presentation !== 'sheet' || isAdding) return
    dragStartRef.current = event.clientY
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handleDragMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (dragStartRef.current === null) return
    setDragOffset(Math.max(0, event.clientY - dragStartRef.current))
  }

  const handleDragEnd = () => {
    if (dragStartRef.current === null) return
    dragStartRef.current = null
    if (dragOffset > 96) close()
    setDragOffset(0)
  }

  if (!open || !mounted || typeof document === 'undefined') return null

  return createPortal(
    <div
      className="fixed inset-0 z-[20000] flex items-end justify-center md:items-center md:p-5"
      data-testid="product-option-overlay"
      data-presentation={presentation}
      dir={dir}
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default bg-black/45 backdrop-blur-[2px]"
        aria-label={t('product.closeOptions')}
        onClick={close}
        tabIndex={-1}
        data-testid="product-option-backdrop"
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-option-title"
        aria-describedby="product-option-name"
        onKeyDown={trapFocus}
        className="relative flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl md:max-h-[min(760px,90dvh)] md:max-w-lg md:rounded-3xl"
        style={{
          transform: presentation === 'sheet' ? `translateY(${dragOffset}px)` : undefined,
          transition: dragStartRef.current === null ? 'transform 180ms ease-out' : 'none',
        }}
      >
        <div
          className="flex min-h-8 touch-none items-center justify-center md:hidden"
          onPointerDown={handleDragStart}
          onPointerMove={handleDragMove}
          onPointerUp={handleDragEnd}
          onPointerCancel={handleDragEnd}
          aria-hidden="true"
        >
          <span className="h-1.5 w-10 rounded-full bg-gray-300" />
        </div>

        <div className="flex items-start gap-3 border-b border-gray-100 px-4 pb-4 md:px-6 md:pt-6">
          <div className="relative h-[76px] w-[76px] shrink-0 overflow-hidden rounded-2xl border border-gray-100 bg-white">
            <Image
              src={canonicalProduct.image || '/images/genosys-logo-transparent.png'}
              alt={localizedName}
              fill
              sizes="76px"
              className="object-contain"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p
              id="product-option-title"
              className="mb-1 text-[11px] font-bold uppercase tracking-[0.08em] text-primary-600"
            >
              {t('product.chooseOptions')}
            </p>
            <h2
              id="product-option-name"
              className="line-clamp-3 text-sm font-semibold leading-5 text-gray-950"
            >
              {localizedName}
            </h2>
            {pricing.canSeePrice ? (
              <div className="mt-1.5 flex flex-wrap items-baseline gap-2">
                {pricing.originalPrice ? (
                  <span className="text-xs text-gray-400 line-through">
                    {formatAed(pricing.originalPrice)}
                  </span>
                ) : null}
                <span className="text-base font-bold text-primary-600">
                  {formatAed(pricing.displayPrice)}
                </span>
                {pricing.discountPercentage > 0 ? (
                  <span className="rounded-full bg-[var(--status-green-bg)] px-2 py-0.5 text-[10px] font-bold text-[var(--status-green-deep)]">
                    {Math.round(pricing.discountPercentage)}% {t('product.off')}
                  </span>
                ) : null}
              </div>
            ) : (
              <p className="mt-1.5 text-sm font-semibold text-gray-600">
                {t('product.priceLocked')}
              </p>
            )}
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={close}
            disabled={isAdding}
            className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-700 transition-colors hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:opacity-50"
            aria-label={t('product.closeOptions')}
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 md:px-6">
          {isRefreshing ? (
            <div
              className="mb-4 flex items-center gap-2 rounded-xl bg-[var(--status-blue-bg)] px-3 py-2.5 text-xs text-[var(--status-blue)]"
              role="status"
            >
              <LoaderCircle className="h-4 w-4 animate-spin text-primary-600" aria-hidden="true" />
              <span>{t('product.refreshingOptions')}</span>
            </div>
          ) : null}

          {refreshError && !isRefreshing ? (
            <div className="mb-4 rounded-2xl bg-[var(--status-orange-bg)] p-4 text-center" role="alert">
              <AlertTriangle className="mx-auto mb-2 h-6 w-6 text-[var(--status-orange)]" aria-hidden="true" />
              <p className="text-sm text-[var(--status-orange)]">{refreshError}</p>
              <button
                type="button"
                onClick={() => setRefreshNonce((value) => value + 1)}
                className="mt-3 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-primary-700 shadow-sm"
              >
                <RefreshCw className="h-4 w-4" aria-hidden="true" />
                {t('common.tryAgain')}
              </button>
            </div>
          ) : null}

          {model.missingOptionData ? (
            <div className="mb-4 rounded-2xl bg-[var(--status-orange-bg)] p-4 text-center" role="alert">
              <AlertTriangle className="mx-auto mb-2 h-6 w-6 text-[var(--status-orange)]" aria-hidden="true" />
              <p className="text-sm text-[var(--status-orange)]">{t('product.optionsUnavailable')}</p>
            </div>
          ) : null}

          {model.sizes.length > 0 ? (
            <fieldset className="mb-6">
              <legend className="mb-2.5 flex w-full items-center justify-between gap-3 text-sm font-bold text-gray-900">
                <span>{t('product.size')}</span>
                {model.required.size && !selection.selectedSize ? (
                  <span className="text-[10px] font-bold uppercase tracking-wide text-primary-600">
                    {t('product.selectSizeRequired')}
                  </span>
                ) : null}
              </legend>
              <div className="flex flex-wrap gap-2.5">
                {model.sizes.map((option) => {
                  const selected = selection.selectedSize === option.value
                  const available = isOptionAvailable(model, 'size', option.value, selection)
                  return (
                    <button
                      key={`size-${option.value}`}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      aria-disabled={!available}
                      disabled={!available || isAdding}
                      onClick={() => selectOption('size', option.value)}
                      className={`min-h-[52px] min-w-[82px] rounded-xl border-2 px-3 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${
                        selected
                          ? 'border-primary-600 bg-primary-50 text-primary-700'
                          : available
                            ? 'border-gray-200 bg-white text-gray-800 hover:border-gray-400'
                            : 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400 line-through'
                      }`}
                    >
                      <span className="block">{option.label}</span>
                      {!available ? (
                        <span className="mt-0.5 block text-[10px] font-medium text-red-600 no-underline">
                          {t('product.unavailable')}
                        </span>
                      ) : null}
                    </button>
                  )
                })}
              </div>
            </fieldset>
          ) : null}

          {model.colors.length > 0 ? (
            <fieldset className="mb-6">
              <legend className="mb-2.5 flex w-full items-center justify-between gap-3 text-sm font-bold text-gray-900">
                <span>{t('product.color')}</span>
                {model.required.color && !selection.selectedColor ? (
                  <span className="text-[10px] font-bold uppercase tracking-wide text-primary-600">
                    {t('product.selectColorRequired')}
                  </span>
                ) : null}
              </legend>
              <div className="flex flex-wrap gap-2.5">
                {model.colors.map((option) => {
                  const selected = selection.selectedColor === option.value
                  const available = isOptionAvailable(model, 'color', option.value, selection)
                  return (
                    <button
                      key={`color-${option.value}`}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      aria-disabled={!available}
                      disabled={!available || isAdding}
                      onClick={() => selectOption('color', option.value)}
                      className={`min-h-[52px] min-w-[96px] rounded-xl border-2 px-3 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${
                        selected
                          ? 'border-primary-600 bg-primary-50 text-primary-700'
                          : available
                            ? 'border-gray-200 bg-white text-gray-800 hover:border-gray-400'
                            : 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400'
                      }`}
                    >
                      <span
                        className="mx-auto mb-1.5 block h-6 w-6 rounded-full border border-gray-300 shadow-sm"
                        style={{ backgroundColor: option.hex || '#F3F4F6' }}
                        aria-hidden="true"
                      />
                      <span className="block">{option.label}</span>
                      {!available ? (
                        <span className="mt-0.5 block text-[10px] font-medium text-red-600">
                          {t('product.unavailable')}
                        </span>
                      ) : null}
                    </button>
                  )
                })}
              </div>
            </fieldset>
          ) : null}

          <div>
            <p className="mb-2.5 text-sm font-bold text-gray-900">
              {t('product.quantity')}
            </p>
            <div className="inline-flex items-center rounded-2xl border border-gray-200 bg-gray-100 p-1">
              <button
                type="button"
                onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                disabled={quantity <= 1 || isAdding}
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white text-gray-900 shadow-sm disabled:bg-gray-50 disabled:text-gray-300"
                aria-label={t('product.decreaseQuantity')}
              >
                <Minus className="h-5 w-5" aria-hidden="true" />
              </button>
              <span
                className="min-w-12 text-center text-base font-semibold tabular-nums text-gray-900"
                aria-live="polite"
              >
                {quantity}
              </span>
              <button
                type="button"
                onClick={() =>
                  setQuantity((current) => Math.min(MAX_LINE_QUANTITY, current + 1))
                }
                disabled={quantity >= MAX_LINE_QUANTITY || isAdding}
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white text-gray-900 shadow-sm disabled:bg-gray-50 disabled:text-gray-300"
                aria-label={t('product.increaseQuantity')}
              >
                <Plus className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-2.5 border-t border-gray-100 bg-white px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] md:px-6 md:pb-6">
          <button
            type="button"
            onClick={close}
            disabled={isAdding}
            className="min-h-[52px] rounded-2xl bg-gray-100 px-5 text-sm font-bold text-gray-900 transition-colors hover:bg-gray-200 disabled:opacity-50"
          >
            {t('common.cancel')}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!canConfirm}
            className="inline-flex min-h-[52px] flex-1 items-center justify-center gap-2 rounded-2xl bg-primary-600 px-4 text-sm font-bold text-white shadow-lg shadow-primary-600/20 transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none"
            aria-label={`${t('product.addToBag')} — ${localizedName}`}
          >
            {isAdding ? (
              <LoaderCircle className="h-5 w-5 animate-spin" aria-hidden="true" />
            ) : (
              <ShoppingBag className="h-5 w-5" aria-hidden="true" />
            )}
            <span>
              {canonicalProduct.inStock
                ? isAdding
                  ? t('product.adding')
                  : t('product.addToBag')
                : t('product.outOfStock')}
            </span>
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
