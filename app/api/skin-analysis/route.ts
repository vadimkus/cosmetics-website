import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'
import { debugLog, errorLog } from '@/lib/logger'
import { findUserById, findUserByEmail } from '@/lib/userStorageDb'

// Helper to get user from session cookie
async function getUserFromSession(request: NextRequest) {
  const sessionCookie = request.cookies.get('genosys_session')
  
  if (!sessionCookie) {
    return null
  }

  try {
    const sessionData = JSON.parse(sessionCookie.value)
    
    if (!sessionData.email && !sessionData.id) {
      return null
    }

    // Fetch user from database
    const user = sessionData.id
      ? await findUserById(sessionData.id)
      : await findUserByEmail(sessionData.email)
    
    return user
  } catch (error) {
    errorLog('Error parsing session:', error)
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromSession(request)
    const userId = user?.id || null
    
    const body = await request.json()
    const {
      imageUrl,
      skinType,
      confidence,
      oilinessLevel,
      hydrationLevel,
      rednessLevel,
      textureScore,
      evennessScore,
      tZoneOiliness,
      cheekHydration,
      skinTone,
      undertone,
      poreVisibility,
      estimatedSkinAge,
      concerns,
      recommendations,
      ageGroup,
      lightingQuality,
      locale,
    } = body

    // Validate required fields
    if (!skinType || confidence === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: skinType and confidence are required' },
        { status: 400 }
      )
    }

    // Get device info from user agent
    const userAgent = request.headers.get('user-agent') || null

    // Create skin analysis record
    const skinAnalysis = await prisma.skinAnalysis.create({
      data: {
        userId,
        imageUrl: imageUrl || null, // Can be base64 or cloud URL
        skinType,
        confidence: Math.round(confidence),
        oilinessLevel: Math.round(oilinessLevel || 0),
        hydrationLevel: Math.round(hydrationLevel || 0),
        rednessLevel: Math.round(rednessLevel || 0),
        textureScore: Math.round(textureScore || 0),
        evennessScore: Math.round(evennessScore || 0),
        tZoneOiliness: Math.round(tZoneOiliness || 0),
        cheekHydration: Math.round(cheekHydration || 0),
        skinTone: skinTone || 'medium',
        undertone: undertone || 'neutral',
        poreVisibility: poreVisibility || 'moderate',
        estimatedSkinAge: Math.round(estimatedSkinAge || 25),
        concerns: JSON.stringify(concerns || []),
        recommendations: JSON.stringify(recommendations || []),
        ageGroup: ageGroup || null,
        lightingQuality: lightingQuality || 'good',
        deviceInfo: userAgent,
        locale: locale || 'en',
      },
    })

    debugLog('Skin analysis saved:', skinAnalysis.id)

    return NextResponse.json({
      success: true,
      id: skinAnalysis.id,
      message: 'Skin analysis saved successfully',
    })
  } catch (error) {
    errorLog('Error saving skin analysis:', error)
    return NextResponse.json(
      { error: 'Failed to save skin analysis' },
      { status: 500 }
    )
  }
}

// GET - Fetch user's skin analysis history
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromSession(request)
    
    if (!user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    const analyses = await prisma.skinAnalysis.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
      select: {
        id: true,
        skinType: true,
        confidence: true,
        oilinessLevel: true,
        hydrationLevel: true,
        rednessLevel: true,
        textureScore: true,
        evennessScore: true,
        skinTone: true,
        undertone: true,
        estimatedSkinAge: true,
        concerns: true,
        ageGroup: true,
        createdAt: true,
        // Don't return imageUrl by default (large base64)
      },
    })

    // Parse JSON fields
    const parsedAnalyses = analyses.map(a => ({
      ...a,
      concerns: JSON.parse(a.concerns),
    }))

    const total = await prisma.skinAnalysis.count({
      where: { userId: user.id },
    })

    return NextResponse.json({
      analyses: parsedAnalyses,
      total,
      hasMore: offset + limit < total,
    })
  } catch (error) {
    errorLog('Error fetching skin analyses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch skin analyses' },
      { status: 500 }
    )
  }
}


