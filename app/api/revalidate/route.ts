import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function POST(request: NextRequest) {
  try {
    const { path, secret } = await request.json()

    // Optional: Add a secret to protect this endpoint
    const revalidateSecret = process.env.REVALIDATE_SECRET
    if (revalidateSecret && secret !== revalidateSecret) {
      return NextResponse.json(
        { error: 'Invalid secret' },
        { status: 401 }
      )
    }

    // Revalidate the specified path or default to /blog
    const pathToRevalidate = path || '/blog'
    
    revalidatePath(pathToRevalidate)

    return NextResponse.json({
      success: true,
      message: `Path ${pathToRevalidate} revalidated successfully`,
      revalidated: true,
      now: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Error revalidating', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const path = searchParams.get('path')
  const secret = searchParams.get('secret')

  try {
    // Optional: Add a secret to protect this endpoint
    const revalidateSecret = process.env.REVALIDATE_SECRET
    if (revalidateSecret && secret !== revalidateSecret) {
      return NextResponse.json(
        { error: 'Invalid secret' },
        { status: 401 }
      )
    }

    // Revalidate the specified path or default to /blog
    const pathToRevalidate = path || '/blog'
    
    revalidatePath(pathToRevalidate)

    return NextResponse.json({
      success: true,
      message: `Path ${pathToRevalidate} revalidated successfully`,
      revalidated: true,
      now: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Error revalidating', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}


