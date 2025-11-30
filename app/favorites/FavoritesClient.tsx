'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Heart } from 'lucide-react'
import { useFavorites } from '@/components/FavoritesProvider'
import ProductCard from '@/components/ProductCard'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'

export default function FavoritesClient() {
  const { t, locale, dir } = useTranslation()
  const { favorites } = useFavorites()
  const favoriteProducts = favorites

  if (favorites.length === 0) {
    return (
      <div className="container mx-auto px-3 md:px-4 py-4 md:py-16" dir={dir}>
        {/* Navigation Breadcrumb */}
        <nav className={`text-xs md:text-base text-gray-600 mb-2 md:mb-4 ${dir === 'rtl' ? 'text-right' : ''}`} aria-label="Breadcrumb">
          <Link href={getLocalizedPath('/', locale)} className="hover:text-primary-600 transition-colors">{t('common.home')}</Link>
          <span> / </span>
          <span className="text-gray-900 font-medium">{t('common.favorites')}</span>
        </nav>
        
        {/* Back to Home */}
        <Link href={getLocalizedPath('/', locale)} className={`inline-flex items-center gap-1 text-xs md:text-sm text-primary-600 hover:text-primary-700 mb-4 md:mb-8 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
          <ArrowLeft className={`h-3 w-3 md:h-4 md:w-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
          <span>{t('common.backToHome')}</span>
        </Link>

        <div className="max-w-md mx-auto text-center py-6 md:py-16">
          <div className="bg-white rounded-xl p-4 md:p-8">
            {/* Mobile: Custom image, Desktop: Custom image */}
            <div className="mb-2 md:mb-4">
              <Image
                src="/images/avatar/uni.png"
                alt="No favorites"
                width={210}
                height={210}
                className="mx-auto"
              />
            </div>
            <h1 className="text-base md:text-2xl font-bold text-gray-900 mb-3 md:mb-6">{t('favorites.empty') || 'No Favorites Yet'}</h1>
            <Link
              href={getLocalizedPath('/products', locale)}
              className={`inline-flex items-center gap-1 bg-primary-600 text-white px-3 md:px-6 py-1.5 md:py-2.5 rounded-lg text-xs md:text-sm font-medium hover:bg-primary-700 transition-colors ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
            >
              <ArrowLeft className={`h-3 w-3 md:h-4 md:w-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
              {t('favorites.browseProducts') || 'Browse Products'}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-3 md:px-4 py-4 md:py-16" dir={dir}>
      {/* Navigation Breadcrumb */}
      <nav className={`text-xs md:text-base text-gray-600 mb-2 md:mb-4 ${dir === 'rtl' ? 'text-right' : ''}`} aria-label="Breadcrumb">
        <Link href={getLocalizedPath('/', locale)} className="hover:text-primary-600 transition-colors">{t('common.home')}</Link>
        <span> / </span>
        <span className="text-gray-900 font-medium">{t('common.favorites')}</span>
      </nav>
      
      {/* Back to Home */}
      <Link href={getLocalizedPath('/', locale)} className={`inline-flex items-center gap-1 text-xs md:text-sm text-primary-600 hover:text-primary-700 mb-4 md:mb-8 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
        <ArrowLeft className={`h-3 w-3 md:h-4 md:w-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
        <span>{t('common.backToHome')}</span>
      </Link>

      <div className="max-w-6xl mx-auto">
        <div className="mb-4 md:mb-8">
          <h1 className="text-xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-4 flex items-center gap-2">
            <Heart className="h-6 w-6 md:h-8 md:w-8 text-red-500" />
            My Favorites ({favorites.length})
          </h1>
          <p className="text-xs md:text-base text-gray-600">
            Your saved GENOSYS professional Korean dermacosmetics products
          </p>
        </div>

        {favoriteProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-6">
            {favoriteProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="max-w-md mx-auto text-center py-6 md:py-16">
            <div className="bg-gray-50 rounded-xl p-4 md:p-8">
              {/* Mobile: Custom image, Desktop: Heart icon */}
              <div className="md:hidden mb-2">
                <Image
                  src="/images/avatar/uni.png"
                  alt="No products"
                  width={60}
                  height={60}
                  className="mx-auto"
                />
              </div>
              <Heart className="hidden md:block h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-base md:text-2xl font-bold text-gray-900 mb-1 md:mb-3">No Products Found</h2>
              <p className="text-[11px] md:text-sm text-gray-500 mb-3 md:mb-6 leading-relaxed">
                Products may no longer be available.
              </p>
              <Link
                href={getLocalizedPath('/products', locale)}
                className={`inline-flex items-center gap-1 bg-primary-600 text-white px-3 md:px-6 py-1.5 md:py-2.5 rounded-lg text-xs md:text-sm font-medium hover:bg-primary-700 transition-colors ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
              >
                <ArrowLeft className={`h-3 w-3 md:h-4 md:w-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                {t('favorites.browseProducts') || 'Browse Products'}
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
