import Link from 'next/link'
import { MapPin, Phone, Mail, Truck, ArrowLeft, Instagram, Globe, Award, FileText } from 'lucide-react'
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'
import type { Metadata } from 'next'
import { LocationPageProps } from '@/types/common'
import { notFound } from 'next/navigation'

interface AuthorizedReseller {
  name: string
  company: string
  phone: string
  territory: string
  certificateUrl: string
  validUntil: string
}

const locations: Record<string, {
  name: string
  title: string
  description: string
  address: string
  phone: string
  email: string
  instagram?: string
  website?: string
  shippingInfo: string
  shippingCost: string
  deliveryTime: string
  coordinates?: { lat: number; lng: number }
  authorizedReseller?: AuthorizedReseller
}> = {
  dubai: {
    name: 'دبي',
    title: 'GENOSYS دبي - موزع مستحضرات التجميل الكورية في دبي',
    description: 'GENOSYS الشرق الأوسط FZ-LLC يخدم دبي بمستحضرات التجميل الكورية المهنية والتدريب على العناية بالبشرة. توصيل سريع في جميع أنحاء دبي مع شحن مجاني للطلبات التي تزيد عن 1000 درهم.',
    address: 'كوردوبا ريزيدنس، فيلا E02، دبي، الإمارات العربية المتحدة',
    phone: '+971 58 548 76 65',
    email: 'sales@genosys.ae',
    instagram: 'https://www.instagram.com/genosys.me',
    website: 'https://genosys.ae',
    shippingInfo: 'نقوم بالتوصيل إلى جميع مناطق دبي بما في ذلك داون تاون دبي، دبي مارينا، جميرا، بزنس باي والمزيد.',
    shippingCost: '45 درهم (مجاني للطلبات التي تزيد عن 1000 درهم)',
    deliveryTime: '1-2 ساعة، نفس اليوم (كريم)',
    coordinates: { lat: 25.2048, lng: 55.2708 }
  },
  'abu-dhabi': {
    name: 'أبوظبي والعين',
    title: 'GENOSYS أبوظبي والعين - موزع مستحضرات التجميل الكورية',
    description: 'GENOSYS الشرق الأوسط FZ-LLC يوصل مستحضرات التجميل الكورية المهنية إلى أبوظبي والعين. منتجات العناية بالبشرة الفاخرة متاحة من خلال موزعنا المعتمد الحصري.',
    address: 'خدمة جميع مناطق أبوظبي والعين',
    phone: '+971 58 548 76 65',
    email: 'sales@genosys.ae',
    instagram: 'https://www.instagram.com/genosys.me',
    website: 'https://genosys.ae',
    shippingInfo: 'نقوم بالتوصيل إلى جميع مناطق أبوظبي بما في ذلك الخالدية، المركزية، الزاهية، الكورنيش، وجميع مناطق العين.',
    shippingCost: '30 درهم (مجاني للطلبات التي تزيد عن 1000 درهم)',
    deliveryTime: '24 ساعة عبر كويك أب',
    coordinates: { lat: 24.4539, lng: 54.3773 },
    authorizedReseller: {
      name: 'عبير مكي',
      company: 'ABEER MEKKI BEAUTY LADIES CENTER - L.L.C - S.P.C',
      phone: '+971 55 671 75 64',
      territory: 'العين وأبوظبي',
      certificateUrl: '/documents/GENOSYS_Authorized_Reseller_ABEER_MEKKI.pdf',
      validUntil: '20 يناير 2027'
    }
  },
  sharjah: {
    name: 'الشارقة',
    title: 'GENOSYS الشارقة - موزع مستحضرات التجميل الكورية في الشارقة',
    description: 'GENOSYS الشرق الأوسط FZ-LLC يقدم مستحضرات التجميل الكورية المهنية إلى الشارقة. منتجات العناية بالبشرة عالية الجودة والتدريب المهني متاح.',
    address: 'خدمة جميع مناطق الشارقة',
    phone: '+971 58 548 76 65',
    email: 'sales@genosys.ae',
    instagram: 'https://www.instagram.com/genosys.me',
    website: 'https://genosys.ae',
    shippingInfo: 'نقوم بالتوصيل إلى جميع مناطق الشارقة بما في ذلك القاسمية، النهدة، المجاز، الخان والمزيد.',
    shippingCost: '70 درهم (مجاني للطلبات التي تزيد عن 1000 درهم)',
    deliveryTime: '1-2 ساعة، نفس اليوم (كريم)',
    coordinates: { lat: 25.3573, lng: 55.4033 }
  },
  'ras-al-khaimah': {
    name: 'رأس الخيمة',
    title: 'GENOSYS رأس الخيمة - موزع مستحضرات التجميل الكورية',
    description: 'GENOSYS الشرق الأوسط FZ-LLC يخدم رأس الخيمة بمستحضرات التجميل الكورية المهنية. مكتبنا يقع في رأس الخيمة.',
    address: 'MBAM0014 كومباس بيلدنج، طريق الشهداء، منطقة الحمرا الصناعية-FZ، رأس الخيمة، الإمارات',
    phone: '+971 58 548 76 65',
    email: 'sales@genosys.ae',
    instagram: 'https://www.instagram.com/genosys.me',
    website: 'https://genosys.ae',
    shippingInfo: 'نقوم بالتوصيل إلى جميع مناطق رأس الخيمة بما في ذلك النخيل، القواسم، الحمرا والمزيد.',
    shippingCost: '70 درهم (مجاني للطلبات التي تزيد عن 1000 درهم)',
    deliveryTime: '48 ساعة عبر كويك أب',
    coordinates: { lat: 25.7895, lng: 55.9590 }
  },
  ajman: {
    name: 'عجمان',
    title: 'GENOSYS عجمان - موزع مستحضرات التجميل الكورية في عجمان',
    description: 'GENOSYS الشرق الأوسط FZ-LLC يوصل مستحضرات التجميل الكورية المهنية إلى عجمان. منتجات العناية بالبشرة الفاخرة متاحة مع توصيل موثوق.',
    address: 'خدمة جميع مناطق عجمان',
    phone: '+971 58 548 76 65',
    email: 'sales@genosys.ae',
    instagram: 'https://www.instagram.com/genosys.me',
    website: 'https://genosys.ae',
    shippingInfo: 'نقوم بالتوصيل إلى جميع مناطق عجمان بما في ذلك النعيمية، الجرف، الراشدية والمزيد.',
    shippingCost: '70 درهم (مجاني للطلبات التي تزيد عن 1000 درهم)',
    deliveryTime: '48 ساعة عبر كويك أب',
  },
  fujairah: {
    name: 'الفجيرة',
    title: 'GENOSYS الفجيرة - موزع مستحضرات التجميل الكورية في الفجيرة',
    description: 'GENOSYS الشرق الأوسط FZ-LLC يقدم مستحضرات التجميل الكورية المهنية إلى الفجيرة. منتجات العناية بالبشرة عالية الجودة يتم توصيلها في جميع أنحاء الإمارة.',
    address: 'خدمة جميع مناطق الفجيرة',
    phone: '+971 58 548 76 65',
    email: 'sales@genosys.ae',
    instagram: 'https://www.instagram.com/genosys.me',
    website: 'https://genosys.ae',
    shippingInfo: 'نقوم بالتوصيل إلى جميع مناطق الفجيرة بما في ذلك مدينة الفجيرة، الفصيل والمناطق المحيطة.',
    shippingCost: '70 درهم (مجاني للطلبات التي تزيد عن 1000 درهم)',
    deliveryTime: '48 ساعة عبر كويك أب',
  },
  'umm-al-quwain': {
    name: 'أم القيوين',
    title: 'GENOSYS أم القيوين - موزع مستحضرات التجميل الكورية',
    description: 'GENOSYS الشرق الأوسط FZ-LLC يخدم أم القيوين بمستحضرات التجميل الكورية المهنية. منتجات العناية بالبشرة الفاخرة يتم توصيلها في جميع أنحاء الإمارة.',
    address: 'خدمة جميع مناطق أم القيوين',
    phone: '+971 58 548 76 65',
    email: 'sales@genosys.ae',
    instagram: 'https://www.instagram.com/genosys.me',
    website: 'https://genosys.ae',
    shippingInfo: 'نقوم بالتوصيل إلى جميع مناطق أم القيوين بما في ذلك مدينة أم القيوين والمناطق المحيطة.',
    shippingCost: '70 درهم (مجاني للطلبات التي تزيد عن 1000 درهم)',
    deliveryTime: '48 ساعة عبر كويك أب',
  },
}

export async function generateMetadata({ params }: LocationPageProps): Promise<Metadata> {
  const { city } = await params
  const location = locations[city]
  
  if (!location) {
    return {
      title: 'الموقع غير موجود | GENOSYS الشرق الأوسط FZ-LLC',
    }
  }

  return {
    title: `${location.title} | GENOSYS الشرق الأوسط FZ-LLC`,
    description: location.description,
    keywords: [
      `GENOSYS ${location.name}`,
      `مستحضرات التجميل الكورية ${location.name}`,
      `العناية بالبشرة المهنية ${location.name}`,
      `موزع GENOSYS ${location.name}`
    ],
    openGraph: {
      title: location.title,
      description: location.description,
      type: 'website',
      images: [
        {
          url: 'https://genosys.ae/images/genosys-products.jpg',
          width: 1200,
          height: 630,
          alt: `GENOSYS ${location.name}`,
        },
      ],
      url: `https://genosys.ae/ar/locations/${city}`,
      siteName: 'GENOSYS الشرق الأوسط FZ-LLC',
      locale: 'ar_AE',
    },
    twitter: {
      card: 'summary_large_image',
      site: '@genosys_official',
      creator: '@genosys_official',
      title: location.title,
      description: location.description,
      images: ['https://genosys.ae/images/genosys-products.jpg'],
    },
    alternates: {
      canonical: `https://genosys.ae/ar/locations/${city}`,
      languages: {
        'en': `https://genosys.ae/locations/${city}`,
        'ar': `https://genosys.ae/ar/locations/${city}`,
        'ru': `https://genosys.ae/ru/locations/${city}`,
      },
    },
  }
}

export async function generateStaticParams() {
  return Object.keys(locations).map((city) => ({
    city,
  }))
}

export default async function ArabicLocationPage({ params }: LocationPageProps) {
  const { city } = await params
  const location = locations[city]

  if (!location) {
    notFound()
  }

  return (
    <div className="bg-white min-h-screen" dir="rtl">
      <BreadcrumbSchema 
        items={[
          { name: 'الرئيسية', url: '/ar' },
          { name: 'المواقع', url: '/ar/locations' },
          { name: location.name, url: `/ar/locations/${city}` }
        ]}
      />
      
      {/* LocalBusiness Schema for this location */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": `GENOSYS الشرق الأوسط FZ-LLC - ${location.name}`,
            "description": location.description,
            "address": {
              "@type": "PostalAddress",
              "addressLocality": location.name,
              "addressRegion": location.name,
              "addressCountry": "AE"
            },
            "telephone": location.phone,
            "email": location.email,
            "areaServed": {
              "@type": "City",
              "name": location.name
            },
            "url": `https://genosys.ae/ar/locations/${city}`
          }, null, 2)
        }}
      />

      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-4xl mx-auto">
          {/* Navigation Breadcrumb */}
          <nav className="flex flex-col gap-2 text-sm md:text-base text-gray-600 mb-8" aria-label="Breadcrumb">
            {/* Mobile Breadcrumb */}
            <div className="md:hidden flex items-center gap-2">
              <Link 
                href="/ar"
                className="hover:text-primary-600 transition-colors flex items-center"
              >
                الرئيسية
              </Link>
              <span className="flex items-center">/</span>
              <Link 
                href="/ar/locations"
                className="hover:text-primary-600 transition-colors flex items-center"
              >
                المواقع
              </Link>
              <span className="flex items-center">/</span>
              <span className="text-gray-900 font-medium flex items-center">
                {location.name}
              </span>
            </div>
            
            {/* Mobile Back Button */}
            <Link 
              href="/ar/locations"
              className="md:hidden flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 rotate-180" />
              <span className="font-medium">العودة إلى المواقع</span>
            </Link>
            
            {/* Desktop Breadcrumb */}
            <div className="hidden md:flex items-center gap-2">
              <Link 
                href="/ar"
                className="hover:text-primary-600 transition-colors flex items-center"
              >
                الرئيسية
              </Link>
              <span className="flex items-center">/</span>
              <Link 
                href="/ar/locations"
                className="hover:text-primary-600 transition-colors flex items-center"
              >
                المواقع
              </Link>
              <span className="flex items-center">/</span>
              <span className="text-gray-900 font-medium flex items-center">
                {location.name}
              </span>
            </div>
          </nav>

          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              GENOSYS {location.name}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {location.description}
            </p>
          </div>

          {/* Authorized Reseller Section */}
          {location.authorizedReseller && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6 md:p-8 mb-12 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-amber-100 rounded-full p-3">
                  <Award className="h-7 w-7 text-amber-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    الموزع المعتمد الحصري الرسمي
                  </h2>
                  <p className="text-amber-700 font-medium">{location.authorizedReseller.territory}</p>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-6 border border-amber-100">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {location.authorizedReseller.company}
                      </h3>
                      <p className="text-gray-600 mt-1">
                        متخصص معتمد من GENOSYS • صالح حتى {location.authorizedReseller.validUntil}
                      </p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                      <a 
                        href={`tel:${location.authorizedReseller.phone.replace(/\s/g, '')}`}
                        className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold text-lg"
                      >
                        <Phone className="h-5 w-5" />
                        {location.authorizedReseller.phone}
                      </a>
                      <a 
                        href={`https://wa.me/${location.authorizedReseller.phone.replace(/\s/g, '').replace('+', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors font-medium"
                      >
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                        واتساب
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0">
                    <a
                      href={location.authorizedReseller.certificateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-amber-600 text-white px-5 py-3 rounded-lg hover:bg-amber-700 transition-colors font-semibold shadow-md"
                    >
                      <FileText className="h-5 w-5" />
                      عرض الشهادة
                    </a>
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-amber-800 mt-4 text-center">
                هذا الموزع مخول رسمياً من Genosys Middle East FZ-LLC لتوزيع منتجات GENOSYS حصرياً في {location.authorizedReseller.territory}.
              </p>
            </div>
          )}

          {/* Location Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Contact Information */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <MapPin className="h-6 w-6 text-primary-600" />
                {location.authorizedReseller ? 'Genosys Middle East FZ-LLC (الموزع)' : 'معلومات الاتصال'}
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">العنوان</h3>
                  <p className="text-gray-600">{location.address}</p>
                </div>
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Phone className="h-5 w-5 text-primary-600" />
                      <a href={`tel:${location.phone.replace(/\s/g, '')}`} className="text-primary-600 hover:text-primary-700 font-medium">
                        {location.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-5 w-5 text-primary-600" />
                      <a href={`mailto:${location.email}`} className="text-primary-600 hover:text-primary-700 font-medium">
                        {location.email}
                      </a>
                    </div>
                  </div>
                </div>
                {(location.instagram || location.website) && (
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      {location.instagram && (
                        <div className="flex items-center gap-2">
                          <Instagram className="h-5 w-5 text-primary-600" />
                          <a 
                            href={location.instagram} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                          >
                            {location.instagram.replace('https://www.instagram.com/', '@').replace('https://instagram.com/', '@')}
                            <span className="text-xs">↗</span>
                          </a>
                        </div>
                      )}
                      {location.website && (
                        <div className="flex items-center gap-2">
                          <Globe className="h-5 w-5 text-primary-600" />
                          <a 
                            href={location.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                          >
                            {location.website.replace('https://', '').replace('http://', '')}
                            <span className="text-xs">↗</span>
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Shipping Information */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <Truck className="h-6 w-6 text-primary-600" />
                معلومات الشحن
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">مناطق التوصيل</h3>
                  <p className="text-gray-600">{location.shippingInfo}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">تكلفة الشحن</h3>
                  <p className="text-gray-600">{location.shippingCost}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">وقت التوصيل</h3>
                  <p className="text-gray-600">{location.deliveryTime}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Google Maps Link */}
          {location.coordinates && (
            <div className="mb-12">
              <a
                href={`https://maps.google.com/?q=${location.coordinates.lat},${location.coordinates.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-primary-600 text-white p-4 rounded-lg hover:bg-primary-700 transition-colors text-center font-semibold"
              >
                عرض على خرائط جوجل
              </a>
            </div>
          )}

          {/* Call to Action */}
          <div className="bg-primary-50 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              هل أنت مستعد للطلب؟
            </h2>
            <p className="text-gray-600 mb-6">
              تصفح مجموعتنا الكاملة من منتجات مستحضرات التجميل الكورية المهنية.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/ar/products"
                className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
              >
                عرض المنتجات
              </Link>
              <Link
                href="/ar/contact"
                className="border border-primary-600 text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
              >
                اتصل بنا
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
