'use client'

import Link from 'next/link'
import { MapPin, Phone, Mail, Truck, ArrowLeft, Globe, Award, FileText } from 'lucide-react'
import { Instagram } from '@/components/icons/BrandIcons'
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'
import PageBreadcrumb from '@/components/PageBreadcrumb'
import { useTranslation } from '@/hooks/useTranslation'
import { ceraSerif } from '@/components/product/cerabarrier/ceraFont'
import '@/components/product/cerabarrier/cerabarrier.css'
import '@/components/editorial/editorial.css'

interface AuthorizedReseller {
  name: string
  company: string
  phone: string
  territory: string
  certificateUrl: string
  validUntil: string
}

interface LocationData {
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
}

interface LocationPageClientProps {
  city: string
  location: LocationData | null
}

export default function LocationPageClient({ city, location }: LocationPageClientProps) {
  const { t } = useTranslation()

  if (!location) {
    return (
      <div className={`cera-page genosys-page ${ceraSerif.variable} min-h-screen`}>
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="cera-serif text-4xl text-[var(--cera-ink)] mb-4">{t('locations.locationNotFound')}</h1>
            <p className="text-[var(--cera-body)] mb-8">{t('locations.locationNotFoundDesc')}</p>
            <Link href="/" className="text-[var(--cera-rose-ink)] hover:text-[var(--cera-rose-ink)]">
              {t('locations.returnToHome')}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`cera-page genosys-page ${ceraSerif.variable} min-h-screen`}>
      <BreadcrumbSchema 
        items={[
          { name: t('locations.home'), url: '/' },
          { name: t('locations.locationsTitle'), url: '/locations' },
          { name: location.name, url: `/locations/${city}` }
        ]}
      />
      
      {/* LocalBusiness Schema for this location */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": `GENOSYS - ${location.name}`,
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
            "url": `https://genosys.ae/locations/${city}`
          }, null, 2)
        }}
      />

      <PageBreadcrumb
        items={[
          { name: t('locations.home'), href: '/' },
          { name: t('locations.locationsTitle'), href: '/locations' },
          { name: location.name },
        ]}
      />

      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-4xl mx-auto">
        {/* Mobile back link: it used to sit inside the <nav>, which is not a
            breadcrumb item. */}
        <Link href="/locations" className="mb-6 flex items-center gap-2 text-[var(--cera-rose-ink)] transition-colors hover:text-[var(--cera-rose-ink)] md:hidden">
          <ArrowLeft className="h-4 w-4" />
          <span className="font-medium">{t('locations.backToLocations')}</span>
        </Link>

          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="cera-serif text-4xl md:text-5xl text-[var(--cera-ink)] mb-4">
              GENOSYS {location.name}
            </h1>
            <p className="text-lg text-[var(--cera-body)] max-w-2xl mx-auto">
              {location.description}
            </p>
          </div>

          {/* Authorized Reseller Section */}
          {location.authorizedReseller && (
            <div className="ed-panel border border-[var(--cera-blush-deep)] rounded-xl p-6 md:p-8 mb-12 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="rounded-full bg-[var(--cera-blush)] p-3">
                  <Award className="h-7 w-7 text-[var(--cera-rose-ink)]" />
                </div>
                <div>
                  <h2 className="cera-serif text-2xl text-[var(--cera-ink)]">
                    Official exclusive authorized reseller
                  </h2>
                  <p className="text-[var(--cera-rose-ink)] font-medium">{location.authorizedReseller.territory}</p>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-6 border border-[var(--cera-line)]">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-xl font-bold text-[var(--cera-ink)]">
                        {location.authorizedReseller.company}
                      </h3>
                      <p className="text-[var(--cera-body)] mt-1">
                        Certified GENOSYS Professional • Valid until {location.authorizedReseller.validUntil}
                      </p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                      <a 
                        href={`tel:${location.authorizedReseller.phone.replace(/\s/g, '')}`}
                        className="inline-flex items-center gap-2 text-[var(--cera-rose-ink)] hover:text-[var(--cera-rose-ink)] font-semibold text-lg"
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
                      className="inline-flex items-center gap-2 bg-[var(--cera-rose)] text-white px-5 py-3 rounded-lg hover:bg-[var(--cera-rose-ink)] transition-colors font-semibold shadow-md"
                    >
                      <FileText className="h-5 w-5" />
                      View certificate
                    </a>
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-[var(--cera-muted)] mt-4 text-center">
                This reseller is officially authorized by Genosys to exclusively distribute GENOSYS products in {location.authorizedReseller.territory}.
              </p>
            </div>
          )}

          {/* Location Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Contact Information */}
            <div className="bg-[var(--cera-cream-deep)] rounded-lg p-6">
              <h2 className="cera-serif text-2xl text-[var(--cera-ink)] mb-6 flex items-center gap-2">
                <MapPin className="h-6 w-6 text-[var(--cera-rose-ink)]" />
                {location.authorizedReseller ? 'Genosys (Distributor)' : 'Contact Information'}
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-[var(--cera-ink)] mb-2">{t('locations.address')}</h3>
                  <p className="text-[var(--cera-body)]">{location.address}</p>
                </div>
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Phone className="h-5 w-5 text-[var(--cera-rose-ink)]" />
                      <a href={`tel:${location.phone.replace(/\s/g, '')}`} className="text-[var(--cera-rose-ink)] hover:text-[var(--cera-rose-ink)] font-medium">
                        {location.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-5 w-5 text-[var(--cera-rose-ink)]" />
                      <a href={`mailto:${location.email}`} className="text-[var(--cera-rose-ink)] hover:text-[var(--cera-rose-ink)] font-medium">
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
                          <Instagram className="h-5 w-5 text-[var(--cera-rose-ink)]" />
                          <a 
                            href={location.instagram} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[var(--cera-rose-ink)] hover:text-[var(--cera-rose-ink)] font-medium flex items-center gap-1"
                          >
                            {location.instagram.replace('https://www.instagram.com/', '@').replace('https://instagram.com/', '@')}
                            <span className="text-xs">↗</span>
                          </a>
                        </div>
                      )}
                      {location.website && (
                        <div className="flex items-center gap-2">
                          <Globe className="h-5 w-5 text-[var(--cera-rose-ink)]" />
                          <a 
                            href={location.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[var(--cera-rose-ink)] hover:text-[var(--cera-rose-ink)] font-medium flex items-center gap-1"
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
            <div className="bg-[var(--cera-cream-deep)] rounded-lg p-6">
              <h2 className="cera-serif text-2xl text-[var(--cera-ink)] mb-6 flex items-center gap-2">
                <Truck className="h-6 w-6 text-[var(--cera-rose-ink)]" />
                {t('locations.shippingInformation')}
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-[var(--cera-ink)] mb-2">{t('locations.deliveryAreas')}</h3>
                  <p className="text-[var(--cera-body)]">{location.shippingInfo}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--cera-ink)] mb-2">{t('locations.shippingCost')}</h3>
                  <p className="text-[var(--cera-body)]">{location.shippingCost}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--cera-ink)] mb-2">{t('locations.deliveryTime')}</h3>
                  <p className="text-[var(--cera-body)]">{location.deliveryTime}</p>
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
                className="block bg-[var(--cera-rose)] text-white p-4 rounded-lg hover:bg-[var(--cera-rose-ink)] transition-colors text-center font-semibold"
              >
                {t('locations.viewOnGoogleMaps')}
              </a>
            </div>
          )}

          {/* Call to Action */}
          <div className="bg-[var(--cera-blush)] rounded-lg p-8 text-center">
            <h2 className="cera-serif text-2xl text-[var(--cera-ink)] mb-4">
              {t('locations.readyToOrder')}
            </h2>
            <p className="text-[var(--cera-body)] mb-6">
              {t('locations.browseCollection')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/products"
                className="bg-[var(--cera-rose)] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[var(--cera-rose-ink)] transition-colors"
              >
                {t('locations.viewProducts')}
              </Link>
              <Link
                href="/contact-genosys-uae"
                className="border border-[var(--cera-rose)] text-[var(--cera-rose-ink)] px-8 py-3 rounded-lg font-semibold hover:bg-[var(--cera-blush)] transition-colors"
              >
                {t('locations.contactUs')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
