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
    name: 'Дубай',
    title: 'GENOSYS Дубай - Дистрибьютор корейской дерматокосметики в Дубае',
    description: 'GENOSYS Middle East FZ-LLC обслуживает Дубай профессиональной корейской дерматокосметикой и обучением уходу за кожей. Быстрая доставка по всему Дубаю с бесплатной доставкой для заказов свыше 1000 дирхамов.',
    address: 'Cordoba Residence, Villa E02, Дубай, Объединенные Арабские Эмираты',
    phone: '+971 58 548 76 65',
    email: 'sales@genosys.ae',
    instagram: 'https://www.instagram.com/genosys.me',
    website: 'https://genosys.ae',
    shippingInfo: 'Мы доставляем во все районы Дубая, включая Downtown Dubai, Dubai Marina, Jumeirah, Business Bay и другие.',
    shippingCost: '45 дирхамов (Бесплатно для заказов свыше 1000 дирхамов)',
    deliveryTime: '1-2 часа, в тот же день (Careem)',
    coordinates: { lat: 25.2048, lng: 55.2708 }
  },
  'abu-dhabi': {
    name: 'Абу-Даби и Аль-Айн',
    title: 'GENOSYS Абу-Даби и Аль-Айн - Дистрибьютор корейской дерматокосметики',
    description: 'GENOSYS Middle East FZ-LLC доставляет профессиональную корейскую дерматокосметику в Абу-Даби и Аль-Айн. Премиальные продукты для ухода за кожей доступны через нашего эксклюзивного авторизованного реселлера.',
    address: 'Обслуживание всех районов Абу-Даби и Аль-Айна',
    phone: '+971 58 548 76 65',
    email: 'sales@genosys.ae',
    instagram: 'https://www.instagram.com/genosys.me',
    website: 'https://genosys.ae',
    shippingInfo: 'Мы доставляем во все районы Абу-Даби, включая Al Khalidiyah, Al Markaziyah, Al Zahiyah, Corniche, и все районы Аль-Айна.',
    shippingCost: '30 дирхамов (Бесплатно для заказов свыше 1000 дирхамов)',
    deliveryTime: '24 часа через Quiqup',
    coordinates: { lat: 24.4539, lng: 54.3773 },
    authorizedReseller: {
      name: 'Абир Мекки',
      company: 'ABEER MEKKI BEAUTY LADIES CENTER - L.L.C - S.P.C',
      phone: '+971 55 671 75 64',
      territory: 'Аль-Айн и Абу-Даби',
      certificateUrl: '/documents/GENOSYS_Authorized_Reseller_ABEER_MEKKI.pdf',
      validUntil: '20 января 2027'
    }
  },
  sharjah: {
    name: 'Шарджа',
    title: 'GENOSYS Шарджа - Дистрибьютор корейской дерматокосметики в Шардже',
    description: 'GENOSYS Middle East FZ-LLC предоставляет профессиональную корейскую дерматокосметику в Шарджу. Качественные продукты для ухода за кожей и профессиональное обучение доступны.',
    address: 'Обслуживание всех районов Шарджи',
    phone: '+971 58 548 76 65',
    email: 'sales@genosys.ae',
    instagram: 'https://www.instagram.com/genosys.me',
    website: 'https://genosys.ae',
    shippingInfo: 'Мы доставляем во все районы Шарджи, включая Al Qasimia, Al Nahda, Al Majaz, Al Khan и другие.',
    shippingCost: '70 дирхамов (Бесплатно для заказов свыше 1000 дирхамов)',
    deliveryTime: '1-2 часа, в тот же день (Careem)',
    coordinates: { lat: 25.3573, lng: 55.4033 }
  },
  'ras-al-khaimah': {
    name: 'Рас-эль-Хайма',
    title: 'GENOSYS Рас-эль-Хайма - Дистрибьютор корейской дерматокосметики',
    description: 'GENOSYS Middle East FZ-LLC обслуживает Рас-эль-Хайму профессиональной корейской дерматокосметикой. Наш офис находится в Рас-эль-Хайме.',
    address: 'MBAM0014 Compass Building, Al Shohada Road, AL Hamra Industrial Zone-FZ, Рас-эль-Хайма, ОАЭ',
    phone: '+971 58 548 76 65',
    email: 'sales@genosys.ae',
    instagram: 'https://www.instagram.com/genosys.me',
    website: 'https://genosys.ae',
    shippingInfo: 'Мы доставляем во все районы Рас-эль-Хаймы, включая Al Nakheel, Al Qawasim, Al Hamra и другие.',
    shippingCost: '70 дирхамов (Бесплатно для заказов свыше 1000 дирхамов)',
    deliveryTime: '48 часов через Quiqup',
    coordinates: { lat: 25.7895, lng: 55.9590 }
  },
  ajman: {
    name: 'Аджман',
    title: 'GENOSYS Аджман - Дистрибьютор корейской дерматокосметики в Аджмане',
    description: 'GENOSYS Middle East FZ-LLC доставляет профессиональную корейскую дерматокосметику в Аджман. Премиальные продукты для ухода за кожей доступны с надежной доставкой.',
    address: 'Обслуживание всех районов Аджмана',
    phone: '+971 58 548 76 65',
    email: 'sales@genosys.ae',
    instagram: 'https://www.instagram.com/genosys.me',
    website: 'https://genosys.ae',
    shippingInfo: 'Мы доставляем во все районы Аджмана, включая Al Nuaimiya, Al Jerf, Al Rashidiya и другие.',
    shippingCost: '70 дирхамов (Бесплатно для заказов свыше 1000 дирхамов)',
    deliveryTime: '48 часов через Quiqup',
  },
  fujairah: {
    name: 'Фуджейра',
    title: 'GENOSYS Фуджейра - Дистрибьютор корейской дерматокосметики в Фуджейре',
    description: 'GENOSYS Middle East FZ-LLC предоставляет профессиональную корейскую дерматокосметику в Фуджейру. Качественные продукты для ухода за кожей доставляются по всему эмирату.',
    address: 'Обслуживание всех районов Фуджейры',
    phone: '+971 58 548 76 65',
    email: 'sales@genosys.ae',
    instagram: 'https://www.instagram.com/genosys.me',
    website: 'https://genosys.ae',
    shippingInfo: 'Мы доставляем во все районы Фуджейры, включая Fujairah City, Al Faseel и окружающие районы.',
    shippingCost: '70 дирхамов (Бесплатно для заказов свыше 1000 дирхамов)',
    deliveryTime: '48 часов через Quiqup',
  },
  'umm-al-quwain': {
    name: 'Умм-эль-Кайвайн',
    title: 'GENOSYS Умм-эль-Кайвайн - Дистрибьютор корейской дерматокосметики',
    description: 'GENOSYS Middle East FZ-LLC обслуживает Умм-эль-Кайвайн профессиональной корейской дерматокосметикой. Премиальные продукты для ухода за кожей доставляются по всему эмирату.',
    address: 'Обслуживание всех районов Умм-эль-Кайвайна',
    phone: '+971 58 548 76 65',
    email: 'sales@genosys.ae',
    instagram: 'https://www.instagram.com/genosys.me',
    website: 'https://genosys.ae',
    shippingInfo: 'Мы доставляем во все районы Умм-эль-Кайвайна, включая Umm Al Quwain City и окружающие районы.',
    shippingCost: '70 дирхамов (Бесплатно для заказов свыше 1000 дирхамов)',
    deliveryTime: '48 часов через Quiqup',
  },
}

export async function generateMetadata({ params }: LocationPageProps): Promise<Metadata> {
  const { city } = await params
  const location = locations[city]
  
  if (!location) {
    return {
      title: 'Локация не найдена | GENOSYS Middle East FZ-LLC',
    }
  }

  return {
    title: `${location.title} | GENOSYS Middle East FZ-LLC`,
    description: location.description,
    keywords: [
      `GENOSYS ${location.name}`,
      `корейская дерматокосметика ${location.name}`,
      `профессиональный уход за кожей ${location.name}`,
      `дистрибьютор GENOSYS ${location.name}`
    ],
    openGraph: {
      title: location.title,
      description: location.description,
      type: 'website',
      images: [
        {
          url: '/images/genosys-products.jpg',
          width: 1200,
          height: 630,
          alt: `GENOSYS ${location.name}`,
        },
      ],
      url: `https://genosys.ae/ru/locations/${city}`,
      siteName: 'GENOSYS Middle East FZ-LLC',
      locale: 'ru_AE',
    },
    twitter: {
      card: 'summary_large_image',
      site: '@genosys_official',
      creator: '@genosys_official',
      title: location.title,
      description: location.description,
      images: ['/images/genosys-products.jpg'],
    },
    alternates: {
      canonical: `https://genosys.ae/ru/locations/${city}`,
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

export default async function RussianLocationPage({ params }: LocationPageProps) {
  const { city } = await params
  const location = locations[city]

  if (!location) {
    notFound()
  }

  return (
    <div className="bg-white min-h-screen">
      <BreadcrumbSchema 
        items={[
          { name: 'Главная', url: '/ru' },
          { name: 'Локации', url: '/ru/locations' },
          { name: location.name, url: `/ru/locations/${city}` }
        ]}
      />
      
      {/* LocalBusiness Schema for this location */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": `GENOSYS Middle East FZ-LLC - ${location.name}`,
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
            "url": `https://genosys.ae/ru/locations/${city}`
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
                href="/ru"
                className="hover:text-primary-600 transition-colors flex items-center"
              >
                Главная
              </Link>
              <span className="flex items-center">/</span>
              <Link 
                href="/ru/locations"
                className="hover:text-primary-600 transition-colors flex items-center"
              >
                Локации
              </Link>
              <span className="flex items-center">/</span>
              <span className="text-gray-900 font-medium flex items-center">
                {location.name}
              </span>
            </div>
            
            {/* Mobile Back Button */}
            <Link 
              href="/ru/locations"
              className="md:hidden flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="font-medium">Назад к локациям</span>
            </Link>
            
            {/* Desktop Breadcrumb */}
            <div className="hidden md:flex items-center gap-2">
              <Link 
                href="/ru"
                className="hover:text-primary-600 transition-colors flex items-center"
              >
                Главная
              </Link>
              <span className="flex items-center">/</span>
              <Link 
                href="/ru/locations"
                className="hover:text-primary-600 transition-colors flex items-center"
              >
                Локации
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
                    Официальный эксклюзивный авторизованный реселлер
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
                        Сертифицированный специалист GENOSYS • Действителен до {location.authorizedReseller.validUntil}
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
                        WhatsApp
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
                      Просмотреть сертификат
                    </a>
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-amber-800 mt-4 text-center">
                Этот реселлер официально уполномочен Genosys Middle East FZ-LLC на эксклюзивное распространение продукции GENOSYS в {location.authorizedReseller.territory}.
              </p>
            </div>
          )}

          {/* Location Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Contact Information */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <MapPin className="h-6 w-6 text-primary-600" />
                {location.authorizedReseller ? 'Genosys Middle East FZ-LLC (Дистрибьютор)' : 'Контактная информация'}
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Адрес</h3>
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
                Информация о доставке
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Районы доставки</h3>
                  <p className="text-gray-600">{location.shippingInfo}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Стоимость доставки</h3>
                  <p className="text-gray-600">{location.shippingCost}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Время доставки</h3>
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
                Посмотреть на Google Maps
              </a>
            </div>
          )}

          {/* Call to Action */}
          <div className="bg-primary-50 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Готовы заказать?
            </h2>
            <p className="text-gray-600 mb-6">
              Просмотрите нашу полную коллекцию профессиональной корейской дерматокосметики.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/ru/products"
                className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
              >
                Посмотреть продукцию
              </Link>
              <Link
                href="/ru/contact"
                className="border border-primary-600 text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
              >
                Связаться с нами
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

