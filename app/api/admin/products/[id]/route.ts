import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const product = await prisma.product.findUnique({
      where: { id },
    })

    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, product })
  } catch (error: any) {
    console.error('Error fetching product:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const { name, price, description, image, images, category, inStock, size } = await request.json()

    if (!name || !price || !description || !image || !category) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
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

    return NextResponse.json({ success: true, product: updatedProduct })
  } catch (error: any) {
    console.error('Error updating product:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // Check if the product is part of any existing orders
    const orderItems = await prisma.orderItem.findMany({
      where: { productId: id },
    })

    if (orderItems.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete product: it is part of existing orders.' },
        { status: 409 } // Conflict
      )
    }

    await prisma.product.delete({
      where: { id },
    })

    return NextResponse.json({ success: true, message: 'Product deleted successfully' })
  } catch (error: any) {
    console.error('Error deleting product:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}