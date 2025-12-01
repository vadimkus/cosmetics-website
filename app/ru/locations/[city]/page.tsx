import Link from 'next/link'
import { MapPin, Phone, Mail, Truck, ArrowLeft, Instagram, Globe } from 'lucide-react'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

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
    name: 'Абу-Даби',
    title: 'GENOSYS Абу-Даби - Дистрибьютор корейской дерматокосметики в Абу-Даби',
    description: 'GENOSYS Middle East FZ-LLC доставляет профессиональную корейскую дерматокосметику в Абу-Даби. Премиальные продукты для ухода за кожей и устройства для микронидлинга доступны с быстрой доставкой.',
    address: 'Обслуживание всех районов Абу-Даби',
    phone: '+971 58 548 76 65',
    email: 'sales@genosys.ae',
    instagram: 'https://www.instagram.com/genosys.me',
    website: 'https://genosys.ae',
    shippingInfo: 'Мы доставляем во все районы Абу-Даби, включая Al Khalidiyah, Al Markaziyah, Al Zahiyah, Corniche и другие.',
    shippingCost: '70 дирхамов (Бесплатно для заказов свыше 1000 дирхамов)',
    deliveryTime: '48 часов через Quiqup',
    coordinates: { lat: 24.4539, lng: 54.3773 }
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

interface LocationPageProps {
  params: Promise<{ city: string }>
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

          {/* Location Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Contact Information */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <MapPin className="h-6 w-6 text-primary-600" />
                Контактная информация
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

