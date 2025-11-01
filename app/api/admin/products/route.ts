import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminAuth } from '@/lib/adminAuth'
import { requireCsrfToken } from '@/lib/csrf'

export async function GET(request: NextRequest) {
  const auth = await requireAdminAuth(request)
  if (!auth.authorized) {
    return auth.response
  }

  try {
    const products = await prisma.product.findMany({
      orderBy: {
        name: 'asc',
      },
    })
    return NextResponse.json({ success: true, products })
  } catch (error: unknown) {
    console.error('Error fetching products:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminAuth(request)
  if (!auth.authorized) {
    return auth.response
  }

  // CSRF protection (defense in depth)
  const csrfCheck = await requireCsrfToken(request)
  if (!csrfCheck.valid) {
    return csrfCheck.response!
  }

  try {
    const { name, price, description, image, images, category, inStock, size, productNumber } = await request.json()

    if (!name || !price || !description || !image || !category) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
    }

    const newProduct = await prisma.product.create({
      data: {
        name,
        price,
        description,
        image,
        images: images || null,
        category,
        inStock: inStock ?? true,
        size: size || null,
        productNumber: productNumber || null,
      },
    })

    return NextResponse.json({ success: true, product: newProduct }, { status: 201 })
  } catch (error: unknown) {
    console.error('Error creating product:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 })
  }
}