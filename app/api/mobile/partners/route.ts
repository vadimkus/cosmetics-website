import { NextRequest, NextResponse } from 'next/server'
import { partnersData } from '@/lib/partners'

/**
 * GET /api/mobile/partners
 * Returns all partner locations for the native mobile app.
 * Partners are sourced from lib/partners.ts - add a partner there
 * and it automatically appears in the app.
 */
export async function GET(request: NextRequest) {
  try {
    // Validate API key
    const apiKey = request.headers.get('x-api-key')
    if (apiKey !== process.env.MOBILE_APP_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Map partners to a mobile-friendly format
    const partners = partnersData.map((p) => ({
      id: p.id,
      name: p.name,
      type: p.type,
      description: p.description,
      location: p.location,
      phone: p.phone || null,
      website: p.website || null,
      directions: p.directions || null,
      theme: p.theme,
    }))

    return NextResponse.json({
      partners,
      total: partners.length,
    })
  } catch (error) {
    console.error('Mobile partners API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
