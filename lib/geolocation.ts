// IP Geolocation utility
// Uses ipapi.co for free IP geolocation (1000 requests/day free)

export interface GeolocationData {
  country: string
  countryCode: string
  city?: string
  region?: string
}

// Get country from IP address
export async function getCountryFromIP(ipAddress: string): Promise<string | null> {
  try {
    // Skip local/private IPs
    if (isPrivateIP(ipAddress)) {
      return 'Local'
    }

    const response = await fetch(`https://ipapi.co/${ipAddress}/json/`, {
      headers: {
        'User-Agent': 'Cosmetics-Website-Analytics/1.0'
      }
    })

    if (!response.ok) {
      console.warn(`Failed to get geolocation for IP ${ipAddress}: ${response.status}`)
      return null
    }

    const data = await response.json()
    
    if (data.error) {
      console.warn(`Geolocation error for IP ${ipAddress}: ${data.reason}`)
      return null
    }

    return data.country_name || null
  } catch (error) {
    console.error(`Error getting geolocation for IP ${ipAddress}:`, error)
    return null
  }
}

// Check if IP is private/local
function isPrivateIP(ip: string): boolean {
  const privateRanges = [
    /^10\./,
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
    /^192\.168\./,
    /^127\./,
    /^::1$/,
    /^fe80:/,
    /^fc00:/,
    /^fd00:/
  ]
  
  return privateRanges.some(range => range.test(ip))
}

// Get full geolocation data (for future use)
export async function getGeolocationData(ipAddress: string): Promise<GeolocationData | null> {
  try {
    if (isPrivateIP(ipAddress)) {
      return {
        country: 'Local',
        countryCode: 'LOCAL',
        city: 'Local',
        region: 'Local'
      }
    }

    const response = await fetch(`https://ipapi.co/${ipAddress}/json/`, {
      headers: {
        'User-Agent': 'Cosmetics-Website-Analytics/1.0'
      }
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    
    if (data.error) {
      return null
    }

    return {
      country: data.country_name || 'Unknown',
      countryCode: data.country_code || 'XX',
      city: data.city || 'Unknown',
      region: data.region || 'Unknown'
    }
  } catch (error) {
    console.error(`Error getting geolocation data for IP ${ipAddress}:`, error)
    return null
  }
}
