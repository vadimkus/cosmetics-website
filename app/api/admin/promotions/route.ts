import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminAuth } from '@/lib/adminAuth'
import { requireCsrfToken } from '@/lib/csrf'
import { errorLog } from '@/lib/logger'
import { sanitizeHtml } from '@/lib/sanitizeHtml'

export async function GET(request: NextRequest) {
  const auth = await requireAdminAuth(request)
  if (!auth.authorized) return auth.response

  try {
    // Verify Promotion model exists in Prisma client
    if (!('promotion' in prisma)) {
      errorLog('[ADMIN_PROMOTIONS] Promotion model not found in Prisma client')
      return NextResponse.json({ 
        success: false, 
        error: 'Promotion model not available. Please regenerate Prisma client: npx prisma generate' 
      }, { status: 500 })
    }

    const promotions = await prisma.promotion.findMany({
      orderBy: [{ isActive: 'desc' }, { date: 'desc' }],
    })
    return NextResponse.json({ success: true, promotions })
  } catch (error: unknown) {
    errorLog('[ADMIN_PROMOTIONS] GET error:', error)
    
    // Check if it's a table not found error
    const errorMessage = error instanceof Error ? error.message : String(error)
    if (errorMessage.includes('does not exist') || errorMessage.includes('Unknown table') || errorMessage.includes('promotions')) {
      errorLog('[ADMIN_PROMOTIONS] Database table not found. Migration required.')
      return NextResponse.json({ 
        success: false, 
        error: 'Promotions table not found. Please run database migration: npx prisma db push' 
      }, { status: 500 })
    }
    
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch promotions',
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminAuth(request)
  if (!auth.authorized) return auth.response

  const csrfCheck = await requireCsrfToken(request)
  if (!csrfCheck.valid) return csrfCheck.response!

  try {
    const body = await request.json()
    const textEn = sanitizeHtml(String(body?.textEn || '').trim())
    const textRu = body?.textRu != null ? sanitizeHtml(String(body.textRu).trim()) : null
    const textAr = body?.textAr != null ? sanitizeHtml(String(body.textAr).trim()) : null
    const isActive = body?.isActive === false ? false : true

    if (!textEn) {
      return NextResponse.json({ success: false, error: 'textEn is required' }, { status: 400 })
    }

    const dateRaw = body?.date
    const date = dateRaw ? new Date(String(dateRaw)) : new Date()
    if (Number.isNaN(date.getTime())) {
      return NextResponse.json({ success: false, error: 'Invalid date' }, { status: 400 })
    }

    const created = await prisma.$transaction(async (tx) => {
      if (isActive) {
        await tx.promotion.updateMany({ data: { isActive: false }, where: { isActive: true } })
      }
      return await tx.promotion.create({
        data: {
          date,
          textEn,
          textRu: textRu || null,
          textAr: textAr || null,
          isActive,
        },
      })
    })

    return NextResponse.json({ success: true, promotion: created }, { status: 201 })
  } catch (error: unknown) {
    errorLog('[ADMIN_PROMOTIONS] POST error:', error)
    
    // Check if it's a table not found error
    const errorMessage = error instanceof Error ? error.message : String(error)
    if (errorMessage.includes('does not exist') || errorMessage.includes('Unknown table') || errorMessage.includes('promotions')) {
      errorLog('[ADMIN_PROMOTIONS] Database table not found. Migration required.')
      return NextResponse.json({ 
        success: false, 
        error: 'Promotions table not found. Please run database migration: npx prisma db push' 
      }, { status: 500 })
    }
    
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to create promotion',
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    }, { status: 500 })
  }
}


