import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminAuth } from '@/lib/adminAuth'
import { errorLog } from '@/lib/logger'

export async function POST(request: NextRequest) {
  try {
    // Require admin authentication
    const auth = await requireAdminAuth(request)
    if (!auth.authorized) {
      return auth.response
    }

    console.log('🔍 Checking if Russian fields exist...')
    
    // Check if columns already exist by trying to query them
    let fieldsExist = false
    try {
      await prisma.$queryRaw`
        SELECT "titleRu", "excerptRu", "contentRu" 
        FROM blog_posts 
        LIMIT 1
      `
      fieldsExist = true
      console.log('✅ Russian fields already exist in database')
    } catch (error: any) {
      if (error.message?.includes('column') || error.message?.includes('does not exist')) {
        console.log('📝 Russian fields do not exist, adding them...')
        fieldsExist = false
      } else {
        throw error
      }
    }

    if (!fieldsExist) {
      console.log('📝 Adding Russian translation fields to blog_posts table...')
      
      // Add Russian fields using raw SQL
      await prisma.$executeRaw`
        ALTER TABLE blog_posts 
        ADD COLUMN IF NOT EXISTS "titleRu" TEXT,
        ADD COLUMN IF NOT EXISTS "excerptRu" TEXT,
        ADD COLUMN IF NOT EXISTS "contentRu" TEXT
      `
      
      console.log('✅ Successfully added Russian fields to blog_posts table')
      
      // Verify the columns were added
      const columns = await prisma.$queryRaw<Array<{ column_name: string }>>`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'blog_posts' 
        AND column_name IN ('titleRu', 'excerptRu', 'contentRu')
      `
      
      console.log(`✅ Verified: ${columns.length} Russian columns exist`)
      
      return NextResponse.json({
        success: true,
        message: 'Russian fields added successfully',
        columnsAdded: columns.map(c => c.column_name)
      })
    } else {
      return NextResponse.json({
        success: true,
        message: 'Russian fields already exist',
        columnsAdded: ['titleRu', 'excerptRu', 'contentRu']
      })
    }
  } catch (error) {
    errorLog('Failed to add Russian fields:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    )
  }
}

