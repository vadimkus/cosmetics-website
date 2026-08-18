'use client'

import Link from 'next/link'
import { MapPin, ArrowLeft } from 'lucide-react'
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'
import PageBreadcrumb from '@/components/PageBreadcrumb'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'
import { ceraSerif } from '@/components/product/cerabarrier/ceraFont'
import '@/components/product/cerabarrier/cerabarrier.css'
import '@/components/editorial/editorial.css'

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
    name: 'أبوظبي والعين',
    description: 'موزع معتمد حصري متاح في أبوظبي والعين',
    shippingCost: '70 درهم',
    deliveryTime: '24 ساعة عبر كويك أب',
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
    <div className={`cera-page genosys-page ${ceraSerif.variable} min-h-screen`} dir={dir}>
      <BreadcrumbSchema 
        items={[
          { name: t('navigation.home'), url: getLocalizedPath('/', locale) },
          { name: t('common.locations'), url: getLocalizedPath('/locations', locale) }
        ]}
      />
      
      <PageBreadcrumb
        items={[
          { name: t('navigation.home'), href: getLocalizedPath('/', locale) },
          { name: t('common.locations') },
        ]}
      />

      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-6xl mx-auto">
          {/* Navigation Breadcrumb */}
        {/* Mobile back link: it used to sit inside the <nav>, which is not a
            breadcrumb item. */}
        <Link href={getLocalizedPath('/', locale)} className="mb-6 flex items-center gap-2 text-[var(--cera-rose-ink)] transition-colors hover:text-[var(--cera-rose-ink)] md:hidden">
          <ArrowLeft className="h-4 w-4 rotate-180" />
          <span className="font-medium">{t('common.backToHome')}</span>
        </Link>

          {/* Page Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[var(--cera-blush)] rounded-full mb-6">
              <MapPin className="h-8 w-8 text-[var(--cera-rose-ink)]" />
            </div>
            <h1 className="cera-serif text-4xl md:text-5xl text-[var(--cera-ink)] mb-4">
              مواقعنا
            </h1>
            <p className="text-lg text-[var(--cera-body)] max-w-2xl mx-auto">
              GENOSYS الشرق الأوسط يقدم مستحضرات التجميل الكورية الاحترافية إلى الإمارات السبع
            </p>
          </div>

          {/* Locations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {locations.map((location) => (
              <Link
                key={location.slug}
                href={getLocalizedPath(`/locations/${location.slug}`, locale)}
                className="bg-white border border-[var(--cera-line)] rounded-xl p-6 hover:shadow-md transition-all duration-200 group"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-[var(--cera-blush)] rounded-full p-3 group-hover:bg-[var(--cera-rose)] transition-colors">
                    <MapPin className="h-6 w-6 text-[var(--cera-rose-ink)] group-hover:text-white transition-colors" />
                  </div>
                  <div className="flex-1">
                    <h2 className="cera-serif text-xl text-[var(--cera-ink)] mb-2 group-hover:text-[var(--cera-rose-ink)] transition-colors">
                      {location.name}
                    </h2>
                    <p className="text-[var(--cera-body)] text-sm mb-3">
                      {location.description}
                    </p>
                    <div className="flex flex-col gap-1 text-xs text-[var(--cera-muted)]">
                      <span className="font-medium">الشحن: <span className="text-[var(--cera-body)]">{location.shippingCost}</span></span>
                      <span className="font-medium">التوصيل: <span className="text-[var(--cera-body)]">{location.deliveryTime}</span></span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* General Information */}
          <div className="bg-gradient-to-r from-[var(--cera-blush)] to-red-50 rounded-xl p-8 border border-[var(--cera-blush-deep)] shadow-sm">
            <div className="text-center">
              <h2 className="cera-serif text-2xl text-[var(--cera-ink)] mb-3">
                الشحن المجاني متاح
              </h2>
              <p className="text-[var(--cera-body)] mb-6 max-w-xl mx-auto">
                جميع الطلبات التي تزيد عن 1000 درهم مؤهلة للشحن المجاني في جميع الإمارات.
                نقدم منتجات مستحضرات التجميل الكورية الاحترافية مع خدمة موثوقة وسريعة عبر كريم وكويك أب.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href={getLocalizedPath('/products', locale)}
                  className="bg-[var(--cera-rose)] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[var(--cera-rose-ink)] transition-colors text-center shadow-md hover:shadow-lg"
                >
                  تصفح المنتجات
                </Link>
                <Link
                  href={getLocalizedPath('/contact', locale)}
                  className="border border-[var(--cera-rose)] text-[var(--cera-rose-ink)] px-8 py-3 rounded-lg font-semibold hover:bg-white transition-colors text-center shadow-md hover:shadow-lg"
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

