import Image from 'next/image'
import Link from 'next/link'
import type { Product } from '@/types'
import ConcernProductPrice from './ConcernProductPrice'
import ConcernAddToCart from './ConcernAddToCart'
import { translateCategory } from '@/utils/categoryTranslations'
// Server component — static locale bundles stay out of client JS.
import enMessages from '@/messages/en.json'
import arMessages from '@/messages/ar.json'
import ruMessages from '@/messages/ru.json'

const MESSAGES_BY_LOCALE = { en: enMessages, ar: arMessages, ru: ruMessages } as const

interface ConcernProductGridProps {
  products: Product[]
  locale?: 'en' | 'ar' | 'ru'
  dir?: 'ltr' | 'rtl'
}

/**
 * ConcernProductGrid - Server Component
 * 
 * A lightweight, server-rendered product grid for SEO landing pages
 * (concern and category pages). No client-side JS needed for rendering,
 * making it instantly indexable by Google and AI crawlers.
 * 
 * Links to individual product pages where the full ProductCard with
 * add-to-cart, favorites, etc. is available.
 */
export default function ConcernProductGrid({ products, locale = 'en', dir = 'ltr' }: ConcernProductGridProps) {
  const prefix = locale === 'en' ? '' : `/${locale}`
  
  const labels = {
    en: { viewProduct: 'View Product', inStock: 'In Stock', outOfStock: 'Out of Stock', soldOut: 'Sold Out', aed: 'AED', priceOnRequest: 'Price on Request', noProducts: 'No products found for this category.', off: 'OFF', addToCart: 'Add to Cart', added: 'Added!' },
    ar: { viewProduct: 'عرض المنتج', inStock: 'متوفر', outOfStock: 'غير متوفر', soldOut: 'نفذ المخزون', aed: 'درهم', priceOnRequest: 'السعر عند الطلب', noProducts: 'لم يتم العثور على منتجات في هذه الفئة.', off: 'خصم', addToCart: 'أضف للسلة', added: 'تمت الإضافة!' },
    ru: { viewProduct: 'Смотреть товар', inStock: 'В наличии', outOfStock: 'Нет в наличии', soldOut: 'Нет в наличии', aed: 'AED', priceOnRequest: 'Цена по запросу', noProducts: 'Товары не найдены.', off: 'СКИДКА', addToCart: 'В корзину', added: 'Добавлено!' },
  }
  const t = labels[locale]

  if (products.length === 0) {
    return (
      <div className="text-center py-12 text-[var(--cera-muted)]">
        <p>{t.noProducts}</p>
      </div>
    )
  }

  // Product names are never translated (brand identity) — English everywhere.
  const getName = (product: Product): string => product.name

  // Get localized product description
  const getDescription = (product: Product): string => {
    if (locale === 'ar' && product.descriptionAr) return product.descriptionAr
    if (locale === 'ru' && product.descriptionRu) return product.descriptionRu
    return product.description
  }

  const getSpfBadge = (name: string): string | null => {
    const match = name.match(/SPF\s*(\d+\+?)/i)
    return match ? `SPF ${match[1]}` : null
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6" dir={dir}>
      {products.map(product => {
        const spfBadge = getSpfBadge(getName(product))
        return (
        <Link
          key={product.id}
          href={`${prefix}/products/${product.id}`}
          className="group block bg-white rounded-xl border border-[var(--cera-line)] overflow-hidden hover:shadow-lg transition-shadow duration-300"
        >
          {/* Product Image */}
          <div className="relative aspect-square bg-white overflow-hidden">
            <Image
              src={product.image}
              alt={getName(product)}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-contain group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            {spfBadge && (
              <div className="absolute top-2 right-2 bg-amber-500 text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
                {spfBadge}
              </div>
            )}
            {!product.inStock && (
              <div className="absolute top-2 left-2 bg-[var(--cera-ink)] text-white text-xs px-2 py-1 rounded">
                {t.outOfStock}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="p-3 sm:p-4">
            {product.category && (
              <p className="text-xs text-[var(--cera-muted)] uppercase tracking-wider mb-1">
                {translateCategory(product.category, MESSAGES_BY_LOCALE[locale] as never)}
              </p>
            )}
            <h3 className="text-sm sm:text-base font-medium text-[var(--cera-ink)] line-clamp-2 mb-1 group-hover:text-[var(--cera-rose-ink)] transition-colors">
              {getName(product)}
            </h3>
            <p className="text-xs text-[var(--cera-muted)] line-clamp-2 mb-2">
              {getDescription(product)}
            </p>
            {product.size && (
              <p className="text-xs text-[var(--cera-muted)] mb-2">{product.size}</p>
            )}
            <ConcernProductPrice
              product={product}
              aedLabel={t.aed}
              priceOnRequestLabel={t.priceOnRequest}
              inStockLabel={t.inStock}
              offLabel={t.off}
            />
            <ConcernAddToCart
              product={product}
              label={t.addToCart}
              addedLabel={t.added}
              soldOutLabel={t.soldOut}
            />
          </div>
        </Link>
        )
      })}
    </div>
  )
}
