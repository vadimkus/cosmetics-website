import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        name: 'asc',
      },
    })
    return NextResponse.json({ success: true, products })
  } catch (error: any) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, price, description, image, images, category, inStock, size } = await request.json()

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
      },
    })

    return NextResponse.json({ success: true, product: newProduct }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating product:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}