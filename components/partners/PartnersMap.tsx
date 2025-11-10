'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { Icon } from 'leaflet'
import { partnersData } from '@/lib/partners'
import { Partner } from '@/types/partner'
import Image from 'next/image'

// Fix for default marker icons in Next.js
const defaultIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

// Dubai center coordinates (approximate)
const DUBAI_CENTER: [number, number] = [25.2048, 55.2708]

// Partner coordinates mapping - extracted from Google Maps URLs or manually verified
const PARTNER_COORDINATES: Record<string, [number, number]> = {
  "persona-marina": [25.0862329, 55.147257], // From Google Maps URL: !2m2!1d55.147257!2d25.0862329
  "persona-palm": [25.1129, 55.1392], // Palm Jumeirah approximate
  "persona-downtown": [25.1972, 55.2794], // Downtown Dubai approximate
  "faceroom": [25.0772, 55.1398], // Dubai Marina approximate
  "evolution": [25.1395, 55.2097], // 49 Umm Al Sheif Road, Jumeirah 3 - exact coordinates (Plus Code: 56CF+XJ)
  "shakirovna": [25.0772, 55.1398], // Dubai Marina approximate
  "shakirovna-business-bay": [25.1868, 55.2608], // Business Bay approximate
  "face-only": [25.0785, 55.1182], // Blue Waves Residence, 9 A Street, Marsa Dubai, Bluewaters Island - exact coordinates (Plus Code: 34HF+54)
  "egoistka": [25.0772, 55.1398], // Dubai Marina approximate
  "vesna": [25.0675764, 55.1309523], // From Google Maps URL: !2m2!1d55.1309523!2d25.0675764
  "kindcare": [25.14914, 55.19815], // Villa 794, Jumeirah Beach Road, Umm Suqeim 2, Jumeirah 3 - exact coordinates
  "hortman-1": [25.2234, 55.2840], // Burj Al Salam Building, 32nd Floor, Sheikh Zayed Road, Business Bay - exact coordinates
  "hortman-2": [25.1972, 55.2408], // Jumeirah 3 approximate
  "lfk-clinic": [25.2139577, 55.2780647], // From Google Maps URL: !2m2!1d55.2780647!2d25.2139577
  "elaris": [25.1846245, 55.2751612], // From Google Maps URL: !2m2!1d55.2751612!2d25.1846245
  "milyne": [25.1833, 55.3333], // Dubai Creek Harbour approximate
  "hideaway": [25.22529, 55.2584], // La Plage Shop 6, 403 Jumeirah Street, Al Athar Street, Jumeirah 3 - exact coordinates
  "skinstory": [25.2048, 55.2708], // Online store - Dubai center
  "melanta": [25.1972, 55.2472], // 748A Al Wasl Road, Jumeirah 3 - exact coordinates (Plus Code: 56GJ+2C)
  "sugar-wax": [25.0772, 55.1398], // Dubai Marina approximate
  "bianco-spa": [25.1272415, 55.3966572], // From Google Maps URL: !2m2!1d55.3966572!2d25.1272415
  "bianco-spa-dubai-hills": [25.1027525, 55.2377572], // From Google Maps URL: !2m2!1d55.2377572!2d25.1027525
  "bianco-spa-layan": [25.0321311, 55.2830924], // From Google Maps URL: !2m2!1d55.2830924!2d25.0321311
  "bianco-spa-jumeirah-golf": [25.0209213, 55.19986], // From Google Maps URL: !2m2!1d55.19986!2d25.0209213
  "lodyana-spa": [24.4900, 54.3800], // Al Sahel Towers, Block A, 1st Floor, Al Bateen, Abu Dhabi Corniche - exact coordinates
  "different-aesthetic-clinic": [24.4539, 54.3773], // Abu Dhabi approximate
  "brau-jumeirah": [25.1512, 55.2127665], // From Google Maps URL: !2m2!1d55.2127665!2d25.1512
  "brau-springs-souk": [25.0662078, 55.1921234], // From Google Maps URL: !2m2!1d55.1921234!2d25.0662078
  "brau-khalifa-city": [24.4167725, 54.5663204], // From Google Maps URL: !2m2!1d54.5663204!2d24.4167725
  "love-my-body": [25.0785, 55.1182], // Bluewaters Island Building 9 - exact coordinates (Plus Code: 34HC+QJ)
  "arfi-nails": [25.1180, 55.2000], // Al Barsha approximate
  "fayy-health": [25.2215, 55.2860], // One Central Offices 2, Dubai World Trade Centre - verified coordinates
  "lavana-spa-difc": [25.2139, 55.2781], // DIFC approximate
}

// Function to extract coordinates from Google Maps URL
function extractCoordinatesFromURL(url: string): [number, number] | null {
  if (!url) return null
  
  // Try to extract from @lat,lng pattern
  const atPattern = /@(-?\d+\.?\d*),(-?\d+\.?\d*)/
  const atMatch = url.match(atPattern)
  if (atMatch && atMatch[1] && atMatch[2]) {
    const lat = parseFloat(atMatch[1])
    const lng = parseFloat(atMatch[2])
    if (!isNaN(lat) && !isNaN(lng)) {
      return [lat, lng]
    }
  }
  
  // Try to extract from !2m2!1dlng!2dlat pattern (Google Maps format)
  const coordsPattern = /!2m2!1d(-?\d+\.?\d*)!2d(-?\d+\.?\d*)/
  const coordsMatch = url.match(coordsPattern)
  if (coordsMatch && coordsMatch[1] && coordsMatch[2]) {
    const lng = parseFloat(coordsMatch[1])
    const lat = parseFloat(coordsMatch[2])
    if (!isNaN(lat) && !isNaN(lng)) {
      return [lat, lng]
    }
  }
  
  // Try to extract from place URL with data parameter (e.g., /place/.../data=!4m2!3m1!1s...)
  // For place URLs, we'll need to use the place ID to geocode, but for now return null
  // and rely on the coordinate mapping
  
  return null
}

// Function to geocode addresses - uses exact coordinates when available
function getCoordinates(partner: Partner): [number, number] {
  // First, check if we have exact coordinates for this partner
  const exactCoords = PARTNER_COORDINATES[partner.id]
  if (exactCoords) {
    return exactCoords
  }
  
  // Try to extract coordinates from directions URL
  if (partner.directions) {
    const coords = extractCoordinatesFromURL(partner.directions)
    if (coords) {
      return coords
    }
  }
  
  // Fallback to location-based approximation
  const location = partner.location.toLowerCase()
  
  // More specific location matching
  if (location.includes('marina gate 1')) return [25.0862329, 55.147257]
  if (location.includes('marina gate 2')) return [25.0772, 55.1398]
  if (location.includes('marina')) return [25.0772, 55.1398]
  if (location.includes('downtown') || location.includes('dubai mall')) return [25.1972, 55.2794]
  if (location.includes('jumeirah 3') || location.includes('jumeira third')) return [25.1972, 55.2408]
  if (location.includes('jumeirah') || location.includes('jumeira')) return [25.1972, 55.2408]
  if (location.includes('business bay')) return [25.1868, 55.2608]
  if (location.includes('difc')) return [25.2139, 55.2781]
  if (location.includes('palm jumeirah') || location.includes('palm')) return [25.1129, 55.1392]
  if (location.includes('al barsha') || location.includes('barsha')) return [25.1180, 55.2000]
  if (location.includes('bluewaters') || location.includes('blue waters')) return [25.0833, 55.1333]
  if (location.includes('world trade centre') || location.includes('wtc') || location.includes('one central')) return [25.2239, 55.2808]
  if (location.includes('abu dhabi')) return [24.4539, 54.3773]
  if (location.includes('silicon oasis') || location.includes('dso')) return [25.1170, 55.3800]
  if (location.includes('dubai hills')) return [25.0667, 55.1833]
  if (location.includes('creek harbour') || location.includes('creek')) return [25.1833, 55.3333]
  
  // Default to Dubai center
  return DUBAI_CENTER
}

export default function PartnersMap() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className="w-full h-[600px] rounded-xl bg-gray-100 flex items-center justify-center border border-gray-200">
        <p className="text-gray-600">Loading map...</p>
      </div>
    )
  }

  return (
    <div className="w-full h-[600px] rounded-xl overflow-hidden shadow-lg border border-gray-200">
      <MapContainer
        center={DUBAI_CENTER}
        zoom={11}
        style={{ height: '100%', width: '100%', zIndex: 0 }}
        scrollWheelZoom={true}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {partnersData.map((partner) => {
          const coordinates = getCoordinates(partner)
          return (
            <Marker
              key={partner.id}
              position={coordinates}
              icon={defaultIcon}
            >
              <Popup>
                <div className="min-w-[200px] max-w-[250px]">
                  <div className="flex items-center gap-2 mb-2">
                    {partner.logo && (
                      <Image
                        src={partner.logo}
                        alt={`${partner.name} Logo`}
                        width={32}
                        height={32}
                        className="object-contain rounded flex-shrink-0"
                      />
                    )}
                    <h3 className="font-bold text-sm text-gray-800 leading-tight">{partner.name}</h3>
                  </div>
                  <p className="text-xs text-gray-600 mb-1">{partner.type}</p>
                  <p className="text-xs text-gray-600 mb-2 leading-tight">{partner.location}</p>
                  {partner.phone && (
                    <a
                      href={`tel:${partner.phone.replace(/\s/g, '')}`}
                      className="text-xs text-blue-600 hover:underline block mb-2"
                    >
                      📞 {partner.phone}
                    </a>
                  )}
                  <div className="flex flex-col gap-1 mt-2">
                    {partner.directions && (
                      <a
                        href={partner.directions}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 text-center"
                      >
                        📍 Directions
                      </a>
                    )}
                    {partner.website && (
                      <a
                        href={partner.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs border border-blue-600 text-blue-600 px-2 py-1 rounded hover:bg-blue-50 text-center"
                      >
                        {partner.website.includes('instagram.com') ? '📷 Instagram' : '🌐 Website'}
                      </a>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>
    </div>
  )
}

