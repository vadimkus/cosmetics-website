'use client'

import Link from 'next/link'
import { MapPin, ArrowLeft } from 'lucide-react'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'

const locations = [
  {
    slug: 'dubai',
    name: 'دبي',
    description: 'يقع مكتبنا/مستودعنا في دبي.',
    shippingCost: '45 درهم',
    deliveryTime: '1-2 ساعة، نفس اليوم (كريم)',
  },
  {
    slug: 'abu-dhabi',
    name: 'أبوظبي',
    description: 'مستحضرات التجميل الكورية المهنية يتم توصيلها إلى جميع مناطق أبوظبي',
    shippingCost: '70 درهم',
    deliveryTime: '48 ساعة عبر كويك أب',
  },
  {
    slug: 'sharjah',
    name: 'الشارقة',
    description: 'منتجات العناية بالبشرة عالية الجودة والتدريب المهني متاحان في الشارقة',
    shippingCost: '70 درهم',
    deliveryTime: '1-2 ساعة، نفس اليوم (كريم)',
  },
  {
    slug: 'ras-al-khaimah',
    name: 'رأس الخيمة',
    description: 'يقع مكتبنا في رأس الخيمة.',
    shippingCost: '70 درهم',
    deliveryTime: '48 ساعة عبر كويك أب',
  },
  {
    slug: 'ajman',
    name: 'عجمان',
    description: 'توصيل موثوق لمستحضرات التجميل الكورية الفاخرة إلى عجمان',
    shippingCost: '70 درهم',
    deliveryTime: '48 ساعة عبر كويك أب',
  },
  {
    slug: 'fujairah',
    name: 'الفجيرة',
    description: 'منتجات العناية بالبشرة عالية الجودة يتم توصيلها في جميع أنحاء الفجيرة',
    shippingCost: '70 درهم',
    deliveryTime: '48 ساعة عبر كويك أب',
  },
  {
    slug: 'umm-al-quwain',
    name: 'أم القيوين',
    description: 'منتجات العناية بالبشرة الفاخرة يتم توصيلها في جميع أنحاء أم القيوين',
    shippingCost: '70 درهم',
    deliveryTime: '48 ساعة عبر كويك أب',
  },
]

export default function ArabicLocationsPageClient() {
  const { t, locale, dir } = useTranslation()
  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen" dir={dir}>
      <BreadcrumbSchema 
        items={[
          { name: t('navigation.home'), url: getLocalizedPath('/', locale) },
          { name: t('common.locations'), url: getLocalizedPath('/locations', locale) }
        ]}
      />
      
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-6xl mx-auto">
          {/* Navigation Breadcrumb */}
          <nav className="flex flex-col gap-2 text-sm md:text-base text-gray-600 mb-8" aria-label="Breadcrumb">
            {/* Mobile Breadcrumb */}
            <div className="md:hidden flex items-center gap-2">
              <Link 
                href={getLocalizedPath('/', locale)}
                className="hover:text-primary-600 transition-colors flex items-center"
              >
                {t('navigation.home')}
              </Link>
              <span className="flex items-center">/</span>
              <span className="text-gray-900 font-medium flex items-center">
                {t('common.locations')}
              </span>
            </div>
            
            {/* Mobile Back Button */}
            <Link 
              href={getLocalizedPath('/', locale)}
              className="md:hidden flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 rotate-180" />
              <span className="font-medium">{t('common.backToHome')}</span>
            </Link>
            
            {/* Desktop Breadcrumb */}
            <div className="hidden md:flex items-center gap-2">
              <Link 
                href={getLocalizedPath('/', locale)}
                className="hover:text-primary-600 transition-colors flex items-center"
              >
                {t('navigation.home')}
              </Link>
              <span className="flex items-center">/</span>
              <span className="text-gray-900 font-medium flex items-center">
                {t('common.locations')}
              </span>
            </div>
          </nav>

          {/* Page Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6">
              <MapPin className="h-8 w-8 text-primary-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              مواقعنا
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              GENOSYS الشرق الأوسط FZ-LLC يقدم مستحضرات التجميل الكورية المهنية إلى جميع الإمارات السبع في الإمارات
            </p>
          </div>

          {/* Locations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {locations.map((location) => (
              <Link
                key={location.slug}
                href={getLocalizedPath(`/locations/${location.slug}`, locale)}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-200 group"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-primary-100 rounded-full p-3 group-hover:bg-primary-600 transition-colors">
                    <MapPin className="h-6 w-6 text-primary-600 group-hover:text-white transition-colors" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-primary-600 transition-colors">
                      {location.name}
                    </h2>
                    <p className="text-gray-600 text-sm mb-3">
                      {location.description}
                    </p>
                    <div className="flex flex-col gap-1 text-xs text-gray-500">
                      <span className="font-medium">الشحن: <span className="text-gray-700">{location.shippingCost}</span></span>
                      <span className="font-medium">التوصيل: <span className="text-gray-700">{location.deliveryTime}</span></span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* General Information */}
          <div className="bg-gradient-to-r from-primary-50 to-red-50 rounded-xl p-8 border border-primary-100 shadow-sm">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                الشحن المجاني متاح
              </h2>
              <p className="text-gray-600 mb-6 max-w-xl mx-auto">
                جميع الطلبات التي تزيد عن 1000 درهم مؤهلة للشحن المجاني في جميع إمارات الإمارات. 
                نقدم منتجات مستحضرات التجميل الكورية المهنية مع خدمة موثوقة وسريعة عبر كريم وكويك أب.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href={getLocalizedPath('/products', locale)}
                  className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors text-center shadow-md hover:shadow-lg"
                >
                  تصفح المنتجات
                </Link>
                <Link
                  href={getLocalizedPath('/contact', locale)}
                  className="border border-primary-600 text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-white transition-colors text-center shadow-md hover:shadow-lg"
                >
                  {t('common.contact')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

