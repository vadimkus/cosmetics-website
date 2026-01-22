import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'

export async function POST(request: NextRequest) {
  try {
    const { path, tag, secret } = await request.json()

    // Optional: Add a secret to protect this endpoint
    const revalidateSecret = process.env.REVALIDATE_SECRET
    if (revalidateSecret && secret !== revalidateSecret) {
      return NextResponse.json(
        { error: 'Invalid secret' },
        { status: 401 }
      )
    }

    const results: string[] = []

    // Revalidate by tag if provided (Next.js 16 requires 'max' profile)
    if (tag) {
      revalidateTag(tag, 'max')
      results.push(`Tag '${tag}' revalidated`)
    }

    // Revalidate the specified path or default to /blog
    if (path) {
      revalidatePath(path)
      results.push(`Path '${path}' revalidated`)
    }

    if (results.length === 0) {
      revalidatePath('/blog')
      results.push("Path '/blog' revalidated (default)")
    }

    return NextResponse.json({
      success: true,
      message: results.join(', '),
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
  const tag = searchParams.get('tag')
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

    const results: string[] = []

    // Revalidate by tag if provided (Next.js 16 requires 'max' profile)
    if (tag) {
      revalidateTag(tag, 'max')
      results.push(`Tag '${tag}' revalidated`)
    }

    // Revalidate the specified path
    if (path) {
      revalidatePath(path)
      results.push(`Path '${path}' revalidated`)
    }

    if (results.length === 0) {
      revalidatePath('/blog')
      results.push("Path '/blog' revalidated (default)")
    }

    return NextResponse.json({
      success: true,
      message: results.join(', '),
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


